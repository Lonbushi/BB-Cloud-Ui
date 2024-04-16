// import { createChunks } from "./createChunks.js";
// onmessage = async (e) => {
//   const arr = [];
//   const { file, CHUNK_SIZE, startIndex, endIndex } = e.data;
//   // console.log(file, CHUNK_SIZE, startIndex, endIndex);
//   for (let i = startIndex; i < endIndex; i++) {
//     arr.push(createChunks(file, i, CHUNK_SIZE));
//   }
//   //  Promise.all=> 同时进行异步操作
//   try {
//     const chunks = await Promise.all(arr);
//     postMessage(chunks);
//   } catch (error) {
//     // 处理或者报告错误
//     console.error(error);
//     postMessage({ error: error.message });
//   }

//   // 提交线程信息
//   // postMessage(chunks);
// };

self.importScripts("https://cdn.bootcss.com/spark-md5/3.0.0/spark-md5.js");
self.onmessage = async (event) => {
  const startTime = performance.now();
  let { partList } = event.data;
  const spark = new self.SparkMD5.ArrayBuffer();
  let percent = 0;
  let size = 100 / partList.length;

  const processChunk = (chunk) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(chunk);
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
    });
  };

  for (let i = 0; i < partList.length; i++) {
    try {
      const buffer = await processChunk(partList[i]);
      spark.append(buffer);
      percent += size;
      self.postMessage({ percent: Number(percent.toFixed(2)) });
    } catch (error) {
      console.error("Error reading chunk:", error);
      self.postMessage({ error: "Error processing file." });
      self.close();
      return;
    }
  }

  self.postMessage({ percent: 100, hash: spark.end() });
  console.log(performance.now() - startTime);
  self.close();
};

// 生成文件 hash
// self.onmessage = async (event) => {
//   const startTime = performance.now(); // 开始计时
//   let { partList } = event.data;
//   const spark = new self.SparkMD5.ArrayBuffer();
//   let percent = 0;
//   let size = 100 / partList.length;
//   const buffers = await Promise.all(
//     partList.map(
//       (chunk) =>
//         new Promise((resolve) => {
//           const reader = new FileReader();
//           reader.readAsArrayBuffer(chunk);
//           reader.onload = (event) => {
//             percent += size;
//             // 修改滚动条
//             self.postMessage({ percent: Number(percent.toFixed(2)) });
//             resolve(event.target.result);
//           };
//         })
//     )
//   );
//   buffers.forEach((buffer) => spark.append(buffer));
//   const hash = spark.end(); // 结束哈希计算
//   const endTime = performance.now(); // 结束计时
//   const timeTaken = endTime - startTime; // 计算时间差
//   console.log(timeTaken);
//   self.postMessage({ percent: 100, hash: hash });
//   self.close();
// };
