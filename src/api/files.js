import { Get, Post, Delete, Put } from "@/utils/request";

export function FilePreUploadRequest(md5, file_size, file_name) {
  const requestBody = { file_hash: md5, file_size, file_name }; // 将 MD5 封装在一个对象中
  return Post("/file/pre_upload", requestBody);
}

export function uploadChunk(
  chunk,
  file_hash,
  total,
  chunk_number,
  name,
  chunk_size,
  chunk_hash,
  file_id,
  onProgress
) {
  const formData = new FormData();
  formData.append("chunk", chunk); // 当前分块内容
  // 使用 URLSearchParams 构建查询参数
  console.log("请求中的",chunk);
  const params = new URLSearchParams({
    file_hash: file_hash,
    total: total,
    chunk_number,
    file_name: encodeURIComponent(name),
    chunk_size,
    chunk_hash,
    file_id
  });
  let url = `/file/upload?${params.toString()}`;
  // Post函数应该能够处理FormData，无需手动设置Content-Type
  return Post(url, formData, { onUploadProgress: onProgress });
}

export const filesApi = {
  FilePreUploadRequest,
  uploadChunk,
};
