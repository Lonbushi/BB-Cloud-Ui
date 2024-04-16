<template>
    <el-upload ref="uploadRef" :limit="3" multiple :http-request="handleUpload" :show-file-list="false"
        :on-change="handleChange" :before-upload="beforeUpload">
        <el-button type="primary" :icon="DocumentAdd" round>上传文件测试版</el-button>
    </el-upload>
</template>
<script setup>
import { ref, watch } from 'vue'
import { DocumentAdd } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { debounce } from 'lodash';
import { createChunks } from '@/assets/js/worker/createChunks'
import { WorkerService } from '@/assets/js/worker/wokerServer'
import { CreateChunksBuf } from '@/assets/js/createChunksBuf';
import { MerkleTree } from '@/assets/js/MerkleTree'
import SparkMD5 from 'spark-md5';
import pLimit from 'p-limit';
import { api } from '@/api';
import axios from 'axios';
const BORDER_COUNT = 200
const limit = pLimit(5); // 限制并发上传的分片数量为5
const uploadRef = ref()
const selectedFiles = ref([]); // 改为数组，支持多文件选择
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB 
// const THREAD_COUNT = Math.max(Math.floor(navigator.hardwareConcurrency / 2), 4);
const handleChange = debounce((file, fileList) => {
    selectedFiles.value = fileList
}, 300); // 300 毫秒的延迟时间
watch(selectedFiles, (newVal, oldVal) => {
    if (newVal.length > 0) { // 确保 newVal 不是空数组
        handleUpload();
    }
});
const handleUpload = async () => {
    const fileList = selectedFiles.value
    const workerService = new WorkerService();
    let chunksHash = []
    // console.log(fileList);
    const uploadPromises = fileList.map(async (file, index) => {
        const fileSize = file.size;
        const fileName = file.name
        const partList = createChunks(file.raw, CHUNK_SIZE);
        const chunksTotal = partList.length
        const createChunksBufInstance = new CreateChunksBuf();
        const chunksBuf = await createChunksBufInstance.blobsToArrayBuffers(partList)
        if (chunksBuf.length === 1) {
            chunksHash = [getMD5FromArrayBuffer(chunksBuf[0])]
        } else if (chunksBuf.length <= BORDER_COUNT) {
            chunksHash = await workerService.getMD5ForFiles(chunksBuf);
        } else {
            chunksHash = await workerService.getCRC32ForFiles(chunksBuf);
        }
        const merkleTree = new MerkleTree(chunksHash)
        const fileHash = merkleTree.getRootHash()
        // 调用 checkFile 函数检查文件状态
        const { needUpload, uploadedChunksSet, fileId } = await checkFile(fileHash, fileSize, fileName);
        if (needUpload) {
            // 过滤出需要上传的分片
            const chunksToUpload = partList.filter((_, index) => !uploadedChunksSet.has(index));
            console.log(chunksToUpload);
            // 上传需要上传的分片
            await handleUploadChunks(chunksToUpload, fileHash, fileName, chunksTotal, fileId);
        } else {
            console.log(`File ${fileName} is already uploaded.`);
        }
    });
    await Promise.all(uploadPromises);
}
const checkFile = async (md5, file_size, file_name) => {
    const [err, res] = await api.FilePreUploadRequest(md5, file_size, file_name);
    console.log(res);
    // 用 Set 存储已上传分片索引，便于快速查找
    const uploadedChunksSet = new Set(res.uploaded_chunks);
    console.log(uploadedChunksSet);
    // 根据服务器响应判断需要进行的操作
    const needUpload = res.status !== "completed"; // 如果状态不是 'complete'，则需要上传
    return {
        needUpload,
        uploadedChunksSet,
        fileId: res.file_id,
    };
};
const retry = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (err) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return retry(fn, retries - 1, delay * 2);
        }
        throw err;
    }
};
const handleUploadChunks = async (partList, fileHash, fileName, chunksTotal, file_id) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const uploadChunk = (async (part, index) => {
        const chunk_hash = `${fileHash}_${index}`;
        await retry(() => api.uploadChunk(part, fileHash, chunksTotal, index, fileName, part.size, chunk_hash, file_id, { cancelToken: source.token }))
    })
    const uploadChunks = partList.map((part, index) =>
        limit(() => uploadChunk(part, index))
    );
    try {
        await Promise.all(uploadChunks);
    } catch (err) {
        if (axios.isCancel(err)) {
            console.log('Upload canceled');
        } else {
            throw err;
        }
    }
}
const getMD5FromArrayBuffer = (chunkBuf) => {
    const spark = new SparkMD5.ArrayBuffer()
    spark.append(chunkBuf)
    return spark.end()
}

const beforeUpload = () => {
    return true; // 返回 false 则停止上传
}


const calculateHash = (partList, fileIndex) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('/src/assets/js/hash.js');
        worker.postMessage({ partList });
        worker.onmessage = (event) => {
            const { percent, hash } = event.data;
            // setHashPercent(percent, fileIndex);
            if (hash) {
                resolve(hash);
            }
        };
        worker.onerror = reject;
    });
}

// const setHashPercent = (percent, fileIndex) => {
//     const file = selectedFiles.value[fileIndex];
//     file.percent = percent;
//     if (percent === 100) {
//         file.state = 'complete';
//         ElMessage.success(`文件${fileIndex + 1}哈希计算完成`);
//     } else {
//         file.state = 'part';
//     }
// };

const createRequests = (partList, uploadedList) => {
    const partLists = partList.filter((part) => {
        const uploadedFile = uploadedList.find((item) => item.filename === part.chunk_name);
        if (!uploadedFile) { // 未上传过的
            part.loaded = 0;
            part.percent = 0;
            return true;
        }
        if (uploadedFile.size < part.chunk.size) { // 上传过一部分的
            part.loaded = uploadedFile.size; // 后端返回已上传过文件的大小
            part.percent = parseInt(Number((Number(part.loaded) / part.chunk.size * 100)), 10);
            return true;
        }
        if (uploadedFile.size >= part.chunk.size) {
            part.percent = 100;
            return false;
        }
        return false;
    });
    return partLists.map((part) => {
        const formData = new FormData();
        formData.append(part.filename, part.chunk.slice(part.loaded), part.filename);
        return request({
            url: `${this.action.partUpload}/${part.filename}/${part.chunk_name}/${part.loaded}`,
            method: 'POST',
            data: formData,
            setXHR: (xhr) => {
                part.xhr = xhr;
            },
            onProgress: (event) => {
                const percent = parseInt(Number((Number(part.loaded + event.loaded) / part.chunk.size * 100)), 10);
                part.percent = percent > 100 ? 100 : percent;
            },
        });
    });
}
const uploadParts = async (partList, filename, fileIndex) => {
    // if (!filename) return;
    // // 先向服务器获取已上传过的文件列表
    // const { needUpload = true, uploadedList = [] } = await getUploadedList(filename);
    // if (!needUpload) { // 表示该文件已经上传完整, 不用在上传.
    //     partList.forEach((item) => {
    //         item.percent = 100;
    //     });
    //     handleSuccess(fileIndex, true);
    //     return;
    // }
    // const requests = createRequests(partList, uploadedList);
    // await Promise.all(requests);
}
// // 继续
// const resumeItem = async (index) => {
//   const { partList = [], hashName } = this.fileList[index];
//   this.fileList[index].state = UPLOADING;
//   uploadParts(partList || [], hashName, index);
// }
// // 暂停 xhr.abort 核心 将每个请求 xhr 保存到 partList 中
// const pauseItem = (index) => {
//   const { partList = [] } = this.fileList[index];
//   this.fileList[index].state = PAUSE;
//   partList.forEach((part) => part.xhr && part.xhr.abort());
// }

</script>

<style lang="scss" scoped></style>@/assets/js/worker/createChunks.js