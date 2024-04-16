// folderActions.js
import { nextTick, computed } from "vue";
import { folderApi } from "@/api/folder";
import { useFolderStore } from "@/stores/folder";
const folderStore = useFolderStore();
export const handleFolderMenuAction = async (
  action,
  { selectedFolder, isRenaming, folderId, openFolder, updateIsRenaming }
) => {
  switch (action) {
    case "rename":
      updateIsRenaming(true);
      // 确保输入框自动获得焦点
      await nextTick(); // 使用 await 确保 DOM 已更新
      const input = document.querySelector(".file.selected input");
      console.log(selectedFolder.id);
      if (input) {
        input.focus();
        const renameFolder = async () => {
          await folderStore.renameFolder(selectedFolder.id, input.value,selectedFolder.parent);
          input.removeEventListener("blur", renameFolder); // 清理事件监听器
          input.removeEventListener("keyup", handleKeyUp); // 清理事件监听器
        };
        const handleKeyUp = async (event) => {
          if (event.key === "Enter") {
            await renameFolder();
          }
        };
        input.addEventListener("keyup", handleKeyUp);
        input.addEventListener("blur", renameFolder);
      }
      break;

    case "open":
      console.log(selectedFolder);
      if (selectedFolder) {
        openFolder(selectedFolder);
      }
      break;
    case "delete":
      if (selectedFolder) {
        // 删除文件夹
        await folderStore.deleteFolder(
          selectedFolder.id,
          selectedFolder.parent
        );
      }
      break;
    case "createFolder":
      const parent = folderId;
      const [e, r] = await folderApi.createNewFolder({
        parent: parent,
        name: "新建文件夹",
      }); // 假设这是创建文件夹的 API 调用
      if (!e && r) {
        folderStore.addFolder(r); // 假设 response.data 是新创建的文件夹信息
      } else {
        console.log(e);
      }
      break;
    // 可以添加更多 case 来处理其他操作
    default:
      console.warn(`Unknown action: ${action}`);
  }
};
