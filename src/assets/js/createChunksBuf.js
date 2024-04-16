export class CreateChunksBuf {
  blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result); // reader.result 包含了转换后的 ArrayBuffer
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(blob);
    });
  }

  async blobsToArrayBuffers(blobs) {
    // 修正：通过 this 关键字调用 blobToArrayBuffer 方法
    const promises = blobs.map(blob => this.blobToArrayBuffer(blob));

    // 使用 Promise.all 等待所有转换操作完成
    return await Promise.all(promises);
  }
}
