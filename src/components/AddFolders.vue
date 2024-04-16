<template>
  <el-button type="primary" :icon="Folder" @click="createFolder" round>新建文件夹</el-button>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Folder } from '@element-plus/icons-vue';
import { useFolderStore } from '@/stores/folder';
import { api } from "@/api";


const folderStore = useFolderStore(); // 假设使用Pinia来管理文件夹列表状态
const route = useRoute();
const creatingFolder = ref(false);

const createFolder = async () => {
  creatingFolder.value = true;
  const parent = route.query.id || null;
  console.log(parent);
  const [e, r] = await api.createNewFolder({ parent: parent, name: "新建文件夹" }); // 假设这是创建文件夹的 API 调用
  console.log(r);
  if (!e && r) {
    folderStore.addFolder(r); // 假设 response.data 是新创建的文件夹信息
  } else {
    console.log(e);
  }
};



</script>
<style lang="scss" scoped>
.button_bar {
  height: 32px;
  display: flex;
  align-items: baseline;
  font-size: 14px;
  flex-wrap: wrap;
  margin-left: 20px;

  .el-link {
    margin-left: 10px;
    font-size: 14px;
  }
}
</style>