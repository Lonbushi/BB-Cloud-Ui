import { Get, Post, Delete, Put } from "@/utils/request";

export function getFolderInfo(parentId = null) {
  let url = "/folder";

  if (parentId !== null) {
    url += `?parent_id=${parentId}`;
  }
  return Get(url);
}

export function createNewFolder(folderData) {
  return Post("/folder", folderData);
}

export function deleteFolder(folderId) {
  return Delete(`/folder/${folderId}`);
}


export function renameFolder(folderId, newFolderName) {
  return Put(`/folder/${folderId}`, { new_name: newFolderName });
}
export const folderApi = {
  getFolderInfo,
  createNewFolder,
  deleteFolder,
  renameFolder,
};
