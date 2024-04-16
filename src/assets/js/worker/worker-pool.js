// worker-pool.js
import { WorkerStatus, WorkerWrapper } from "./worker-wrapper ";
import { BehaviorSubject } from "rxjs";

export class WorkerPool {
  pool = [];
  maxWorkerCount;
  curRunningCount = new BehaviorSubject(0);
  results = [];

  constructor(maxWorkers = navigator.hardwareConcurrency || 4) {
    this.maxWorkerCount = maxWorkers;
  }

  exec(params) {
    const workerParams = params.map((param, index) => ({ data: param, index }));

    return new Promise((rs) => {
      this.curRunningCount.subscribe((count) => {
        if (count < this.maxWorkerCount && workerParams.length !== 0) {
          // 当前能跑的任务数量
          let curTaskCount = this.maxWorkerCount - count;
          if (curTaskCount > params.length) {
            curTaskCount = params.length;
          }

          // 此时可以用来执行任务的 Worker
          const canUseWorker = [];
          for (const worker of this.pool) {
            if (worker.status === WorkerStatus.WAITING) {
              canUseWorker.push(worker);
              if (canUseWorker.length === curTaskCount) {
                break;
              }
            }
          }

          const paramsToRun = workerParams.splice(0, curTaskCount);
          // 更新当前正在跑起来的 worker 数量

          this.curRunningCount.next(this.curRunningCount.value + curTaskCount);
          canUseWorker.forEach((workerApp, index) => {
            const param = paramsToRun[index];
            workerApp
              .run(param.data, params, param.index)
              .then((res) => {
                this.results[param.index] = res;
              })
              .catch((e) => {
                this.results[param.index] = e;
              })
              .finally(() => {
                this.curRunningCount.next(this.curRunningCount.value - 1);
              });
          });
        }

        if (this.curRunningCount.value === 0 && workerParams.length === 0) {
          rs(this.results);
        }
      });
    });
  }
}
