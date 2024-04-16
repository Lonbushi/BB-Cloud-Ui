<template>
  <div class="upload_button">
    <!-- 上传文件按钮 -->
    <el-button type="primary" :icon="DocumentAdd" round @click="triggerFolderUpload">上传文件</el-button>
    <!-- 文件上传input -->
    <input ref="uploadRef" class="upload_input" type="file" @change="handleFiles" multiple>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { api } from "@/api"
import { DocumentAdd } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { useFolderStore } from '@/stores/folder';
import SparkMD5 from 'spark-md5';
import { ElMessage } from 'element-plus';

const folderStore = useFolderStore();
const CHUNK_SIZE = 5 * 1024 * 1024; // 定义每个文件块的大小（这里是5MB）
const selectedFiles = ref([]); // 改为数组，支持多文件选择
const uploadProgress = ref({}); // 用于存储每个文件的上传进度
const concurrentLimit = 4; // 同时上传的最大块数
const uploadRef = ref();
const isUploadChunks = ref([]);
const file_id = ref()
const triggerFolderUpload = () => {
  uploadRef.value.click();
};

const handleFiles = (event) => {
  selectedFiles.value = Array.from(event.target.files); // 将FileList转换为数组
  handleUpload();
};

const handleUpload = async () => {
  for (const file of selectedFiles.value) {
    const fileMd5 = await generateFileMD5(file);
    console.log(fileMd5);
    const { needUpload, uploadedChunksSet, fileId } = await checkFile(fileMd5, file.size, file.name);

    if (needUpload) {
      await uploadFile(file, fileId, uploadedChunksSet);
    } else {
      ElMessage({
        message: '文件已存在，实现秒传',
        type: 'success',
      });
    }
  }
};


const generateFileMD5 = (file) => {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      spark.append(e.target.result);
      const md5 = spark.end();
      resolve(md5);
    };
  });
};

const checkFile = async (md5, file_size, file_name) => {
  const [err, res] = await api.FilePreUploadRequest(md5, file_size, file_name);
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


const uploadFile = async (file, fileId, uploadedChunksSet) => {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const type = file.type
  const name = file.name
  let uploadedSize = 0; // 已上传的总字节数
  let activeUploads = []; // 当前活跃的上传任务
  // 如果当前分片尚未上传
  const uploadChunk = async (index) => {
    const start = index * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end, type);
    console.log(chunk);
    // 创建一个异步任务上传当前分片
    try {
      const [err, res] = await api.uploadChunk(chunk, fileId, totalChunks, index, name, chunk.size, (progressEvent) => {
        const loaded = progressEvent.loaded;
        uploadedSize += loaded; // 更新已上传的总字节数
        const totalProgress = (uploadedSize / file.size * 100).toFixed(1);
        console.log(`Total upload progress: ${totalProgress}%`);
      });
    } catch (error) {
      console.log(error);
    } 
  }
  // const checkAndUploadNextChunk = async (index) => {
  //   // 移除已完成的上传任务
  //   activeUploads = activeUploads.filter(item => item !== index);
  //   console.log(activeUploads);
  //   // 检查是否有更多分片需要上传
  //   const nextIndex = uploadedChunksSet.size + activeUploads.length;
  //   console.log(nextIndex);
  //   if (nextIndex < totalChunks) {
  //     // 添加新的上传任务
  //     activeUploads.push(nextIndex);
  //     uploadChunk(nextIndex).then(checkAndUploadNextChunk);
  //   }
  // };

  // // 初始化上传，启动最大并发数量的上传任务
  // for (let i = 0; i < Math.min(concurrentLimit, totalChunks); i++) {
  //   console.log(uploadedChunksSet);
  //   if (!uploadedChunksSet.has(i)) {
  //     console.log(uploadedChunksSet.has(i));
  //     console.log("我被触发了", i);
  //     activeUploads.push(i);
  //     uploadChunk(i).then(checkAndUploadNextChunk);
  //   }
  // }
  // 定义处理分片上传队列的函数
  const handleUploadQueue = async (startIndex) => {
    const endIndex = Math.min(startIndex + concurrentLimit, totalChunks);
    const uploadPromises = [];
    console.log(uploadPromises);
    for (let i = startIndex; i < endIndex; i++) {
      if (!uploadedChunksSet.has(i)) {
        uploadPromises.push(uploadChunk(i));
      }
    }
    await Promise.all(uploadPromises);
    if (endIndex < totalChunks) {
      await handleUploadQueue(endIndex); // 递归处理剩余的分片
    }
  };

  // 开始处理分片上传队列
  await handleUploadQueue(0);
  ElMessage({
    message: '文件上传完成',
    type: 'success',
  });
};
</script>


<style lang="scss" scoped>
.upload_button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  outline: 0;

  .upload_input {
    display: none;
  }
}
</style>