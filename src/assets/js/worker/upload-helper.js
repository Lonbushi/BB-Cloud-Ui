export function getCrc(data) {
  const crcTable = generateCrcTable();
  let crc = 0xffffffff;
  
  // // 将输入数据转换为 Uint8Array
  // const uint8Data = new TextEncoder().encode(data);
  
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xff];
  }
  
  return crc ^ 0xffffffff;
}

function generateCrcTable() {
  const crcTable = [];
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    crcTable[i] = crc;
  }
  return crcTable;
}

export function getCrcHex(crc) {
  return crc.toString(16).padStart(8, "0");
}