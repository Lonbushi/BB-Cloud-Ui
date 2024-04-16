import { userApi } from "@/api/user";
import { folderApi } from "@/api/folder";
import { filesApi } from "@/api/files";
export const api = {
  ...userApi,
  ...folderApi,
  ...filesApi
}