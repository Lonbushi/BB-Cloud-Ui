import { WorkerPoolForMd5s } from "./WorkerPoolForMd5s";
import { WorkerPoolForCrc32s } from "./WorkerPoolForCrc32s";
export class WorkerService {
  MAX_WORKERS = 8;

  // 计算所有分片的 MD5
  async getMD5ForFiles(chunks) {
    try {
      // 确保 md5SingleWorkerPool 已经初始化
      if (this.md5SingleWorkerPool === undefined) {
        this.md5SingleWorkerPool = new WorkerPoolForMd5s(this.MAX_WORKERS);
      }
      // 使用 await 等待 exec 方法完成并返回结果
      const result = await this.md5SingleWorkerPool.exec(chunks);
      return result; // 如果成功，返回计算结果
    } catch (error) {
      // 处理发生的错误
      console.error("Error calculating MD5 for files:", error);
      // 根据你的应用需求，你可以在这里决定如何处理这个错误
      // 比如，你可以决定返回一个特殊的错误值、抛出错误或者执行一些恢复操作
      throw error; // 可以重新抛出错误，如果调用方需要对这个错误进行进一步的处理
    }
  }

  // 计算所有分片的 CRC32
  async getCRC32ForFiles(chunks) {
    try {
      if (this.crc32SingleWorkerPool === undefined) {
        this.crc32SingleWorkerPool = new WorkerPoolForCrc32s(this.MAX_WORKERS);
      }
      const result = await this.crc32SingleWorkerPool.exec(chunks);
      return result;
    } catch (error) {
      console.error("Error calculating Crc32s for files:", error);
      return error;
    }
  }
}
