import { WorkerMessage } from "@/assets/js/worker/wokerMessage";
import { getCrc, getCrcHex } from "@/assets/js/worker/upload-helper";
import { WorkerLabelsEnum } from './WorkerLabelsEnum';

addEventListener("message", ({ data }) => {
  try {
    const crc = getCrc(new Uint8Array(data));
    const hash = getCrcHex(crc);

    postMessage(
      new WorkerMessage(WorkerLabelsEnum.DONE, { result: hash })
    );
  } catch (error) {
    postMessage(
      new WorkerMessage(WorkerLabelsEnum.ERROR, { error: error.message })
    );
  }
});
