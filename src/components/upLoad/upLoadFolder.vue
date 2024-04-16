<template>
    <div class="upload_button">
        <!-- 上传文件夹按钮 -->
        <el-button type="primary" :icon="FolderAdd" round @click="triggerFolderUpload">上传文件夹</el-button>

        <!-- 文件夹上传input -->
        <input ref="folderInput" class="upload_input" type="file" @change="handleFiles" webkitdirectory directory multiple>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { FolderAdd } from '@element-plus/icons-vue';

const selectedFiles = ref([]);
const fileInput = ref(null);
const folderInput = ref(null);

// 处理选择的文件或文件夹
const handleFiles = (event) => {
    const files = Array.from(event.target.files); // 转换为数组以方便处理
    selectedFiles.value = files;
    console.log(selectedFiles.value);
};

// 触发文件上传
const triggerFileUpload = () => {
    fileInput.value.click();
};

// 触发文件夹上传
const triggerFolderUpload = () => {
    folderInput.value.click();
    console.log("我被触发了");
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