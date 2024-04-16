import { WorkerWrapper } from "./worker-wrapper ";
import { WorkerPool } from "./worker-pool";

export class WorkerPoolForMd5s extends WorkerPool {
  constructor(maxWorkers) {
    super(maxWorkers);
    this.pool = Array.from({ length: this.maxWorkerCount }).map(
      () =>
        new WorkerWrapper(
          new Worker(new URL("./md5-worker", import.meta.url), {
            type: "module",
          })
        )
    );
  }
}
