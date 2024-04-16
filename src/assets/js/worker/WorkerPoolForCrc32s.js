import { WorkerWrapper } from "@/assets/js/worker/worker-wrapper ";
import { WorkerPool } from "@/assets/js/worker/worker-pool";

export class WorkerPoolForCrc32s extends WorkerPool {
  constructor(maxWorkers = navigator.hardwareConcurrency || 4) {
    super(maxWorkers);
    this.pool = Array.from({ length: this.maxWorkerCount }).map(
      () =>
        new WorkerWrapper(
          new Worker(new URL("./crc32-worker", import.meta.url), {
            type: "module",
          })
        )
    );
  }
}
