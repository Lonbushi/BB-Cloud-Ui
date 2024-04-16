import { WorkerLabelsEnum } from "./WorkerLabelsEnum";

export const WorkerStatus = {
  RUNNING: "running",
  WAITING: "waiting",
};

export class WorkerWrapper {
  constructor(worker) {
    this.worker = worker;
    this.status = WorkerStatus.WAITING;
  }

  run(param, params, index) {
    if (typeof param === "undefined" || typeof index !== "number") {
      throw new Error("Invalid parameters");
    }

    this.status = WorkerStatus.RUNNING;

    return new Promise((resolve, reject) => {
      this.worker.onmessage = ({ data }) => {
        const { label, content } = data;
        if (label === WorkerLabelsEnum.DONE && content) {
          // 使用不可变的方式更新 params
          const newParams = [...params];
          newParams[index] = content.chunk;

          this.status = WorkerStatus.WAITING;
          resolve(content.result);
        }
      };

      this.worker.onerror = (error) => {
        this.status = WorkerStatus.WAITING;
        console.error("Worker error:", error);
        reject(error);
      };

      // 将参数传递给 Worker,并使用 transfer 来避免结构化克隆
      this.worker.postMessage(param,[param]);
    });
  }
}
