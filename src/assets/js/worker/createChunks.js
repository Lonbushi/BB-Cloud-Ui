export function createChunks(file, CHUNK_SIZE) {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const partList = [];
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);
    partList.push(chunk);
  }
  return partList;
}
