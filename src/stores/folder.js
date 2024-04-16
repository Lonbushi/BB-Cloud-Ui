import { defineStore } from "pinia";
import { api } from "@/api"; // 确保正确导入 folderApi
import { useRoute } from "vue-router";
import { ElMessage } from 'element-plus'
export const useFolderStore = defineStore("folder", {
  state: () => ({
    folderInfoList: [],
    filesList: []
  }),
  getters: {
    getFolderInfo: (state) => state.folderInfoList, // 添加一个新的 getter 来获取用户信息
  },
  actions: {
    addFile(file) {
      this.filesList = file
    },
    updateFileProgress(fileId, progress) {
      const file = this.filesList.find(f => f.fileId === fileId);
      if (file) {
        console.log(file);
        file.progress = progress;
      }
    },
    markFileAsCompleted(fileId) {
      const file = this.filesList.find(f => f.fileId === fileId);
      if (file) {
        file.status = 'completed';
      }
    },
    // 新 action：获取并存储用户信息
    async fetchFolderInfo(parentId = null) {
      const [e, r] = await api.getFolderInfo(parentId);
      if (!e && r) {
        this.folderInfoList = r;
      } else {
        console.log(e);
      }
    },
    addFolder(newFolder) {
      console.log(newFolder.parent);
      if (newFolder.parent !== null) {    
        if (this.folderInfoList[0].children == null){
            this.folderInfoList[0].children = [];
        }
        this.folderInfoList[0].children.push(newFolder);// 将新建的文件夹添加到列表中
      }else {
        this.folderInfoList.push(newFolder);
      }
    },
    // 删除文件夹
    async deleteFolder(folderId, parentId) {
      const [e, r] = await api.deleteFolder(folderId);
      if (!e && r) {
        this.fetchFolderInfo(parentId);
        ElMessage({
            message: '删除成功',
            type: 'success',
        })
      } else {
        console.log(e);
        ElMessage({
            message: '删除失败',
            type: 'error',
        })
      }
    },
    // 重命名
    async renameFolder(folderId, newFolderName,parentId) {
      const [e, r] = await api.renameFolder(folderId, newFolderName);
      if (r) {
        this.fetchFolderInfo(parentId);
        ElMessage({
            message: '重命名成功',
            type: 'success',
        })
      } else {
        console.log(e);
        ElMessage({
            message: '重命名失败',
            type: 'error',
        })
      }
    },
  },
  persist: {
    paths: ["folderInfoList"],
  }, // 开启持久化
});
