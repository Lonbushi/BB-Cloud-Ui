<template>
    <el-tabs tab-position="top" style="padding: 10px;">
        <el-tab-pane class="download_part" label="正在下载">
            <div class="progress" v-show="filesList.length">
                <span class="progress-form" style="width: 50px;">0 kb/s</span>
                <el-progress></el-progress>
            </div>
            <div v-for="file in filesList" :key="file.fileId" class="upload-file-item">
                <uploadInfo :fileName="file.name" :percentage="file.progress" :indeterminate="true"
                    :fileSize="file.size" />
            </div>
        </el-tab-pane>
        <el-tab-pane label="正在上传">
            <el-progress></el-progress>
            <div v-for="file in filesList" :key="file.fileId" class="upload-file-item">
                <span class="iconfont icon-tupian"></span>
                <span>{{ file.name }}</span>
                <el-progress :percentage="file.progress"></el-progress>
                <span v-if="file.status === 'uploading'">上传完成</span>
            </div>
        </el-tab-pane>
        <el-tab-pane label="上传完成">
            <div v-for="file in filesList" :key="file.fileId" class="upload-file-item">
                <span>{{ file.name }}</span>
                <span v-if="file.status === 'uploading'">上传完成</span>
            </div>
        </el-tab-pane>
        <!-- 其他标签页内容 -->
    </el-tabs>
    <div v-show="filesList.length === 0" class="upload-file-empty">
        <img src="@/assets/download.svg">
        <span>当前没有上传任务呦~</span>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useFolderStore } from '@/stores/folder';
import uploadInfo from '@/components/transmit/uploadInfo.vue'
const folderStore = useFolderStore();
const filesList = computed(() => folderStore.filesList)
const fileButton = ref(true)
</script>
<style lang="scss" scoped>
.iconfont {
    font-size: 1.3rem;
    --tw-text-opacity: 1;
    color: #2b2a2a;
}

.download_part {
    margin: 10px;

    .progress {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 15px;

        .progress-form {
            font-size: small;
            color: var(--el-color-primary);
        }

        .el-progress {
            width: 100%;
        }
    }





}



.upload-file-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100% - 55px);
    width: 100%;

    img {
        width: 200px;
        height: 200px;
    }
}
</style>