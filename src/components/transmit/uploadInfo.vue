<template>
    <div class="upload-file-item">
        <span class="upload-file-left-part">
            <img class="upload-file-icon" src="@/assets/img.svg" alt="">
            <span class="file-info">
                <span class="upload-file-name">{{ props.fileName }}</span>
                <span class="upload-file-spend">{{ percentage }} / {{ props.fileSize }}</span>
            </span>
        </span>
        <span class="upload-fill-time">{{ props.estimatedTime }}</span>
        <span class="upload-file-middle-part">
            <el-progress :percentage="props.percentage"></el-progress>
            <span>暂停中...</span>
        </span>
        <span class="upload-file-right-part">
            <span class="iconfont icon-zanting pading" v-show="!fileButton"></span>
            <span class="iconfont icon-weibiaoti518 pading" v-show="fileButton"></span>
            <span class="iconfont icon-shanchu1 pading"></span>
            <span class="iconfont icon-wenjianjia1 pading"></span>
        </span>
    </div>
</template>

<script setup>
import { ref } from 'vue';
// 定义接收的 props
const props = defineProps({
    fileName: String,
    estimatedTime: String, // 假设这是已格式化的时间，例如 "2:30"
    fileSize: String, // 假设这是已格式化的文件大小，例如 "1.2 MB"
    percentage: Number, // 假设这是百分比，例如 50
    indeterminate: Boolean,
    status: String
});

const fileButton = ref(false);
</script>

<style scoped>
.upload-file-item {
    height: 50px;
    display: flex;
    align-items: center;
    margin-top: 10px;
    justify-content: space-between;
}




.upload-file-item:hover {
    background-color: var(--el-menu-hover-bg-color);
}

.upload-file-left-part {
    display: flex;
    align-items: center;
}

.upload-file-icon {
    width: 2rem;
    height: 2rem;
    margin-right: 20px;
    padding-left: 15px;
}

.file-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    margin-right: 10px;
    color: #3b3a3a;
}

.upload-file-spend {
    color: #999;
}

.upload-fill-time {
    width: 50%;
    font-size: 14px;
    text-align: end;
    padding-left: 40px;
    color: #999;
}

.upload-file-right-part {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.pading {
    padding: 0 25px;
}

.upload-file-middle-part {
    width: 15%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    font-size: 14px;
    color: #999;
}

.el-progress {
    width: 100%;
}
</style>