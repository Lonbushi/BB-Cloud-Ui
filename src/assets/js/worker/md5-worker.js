import { WorkerMessage } from "@/assets/js/worker/wokerMessage";
import { WorkerLabelsEnum } from "./WorkerLabelsEnum";
import SparkMD5 from "spark-md5";

addEventListener("message", ({ data }) => {
  try {
    const hash = calculateHash(data);
    postMessage(
      new WorkerMessage(WorkerLabelsEnum.DONE, { result: hash, chunk: data })
    );
  } catch (error) {
    postMessage(
      new WorkerMessage(WorkerLabelsEnum.ERROR, { error: error.message })
    );
  }
});

function calculateHash(data) {
  return SparkMD5.ArrayBuffer.hash(data);
}
