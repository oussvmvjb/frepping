const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/azziz/frepping/src/assets/3dmodel/comp/pants_cargo.obj'),
  crlfDelay: Infinity
});

let minX = Infinity, maxX = -Infinity;
let minY = Infinity, maxY = -Infinity;
let minZ = Infinity, maxZ = -Infinity;
let minU = Infinity, maxU = -Infinity;
let minV = Infinity, maxV = -Infinity;

const mtls = new Set();
const groups = new Set();

rl.on('line', (line) => {
  if (line.startsWith('v ')) {
    const parts = line.split(/\s+/).slice(1).map(Number);
    if (parts[0] < minX) minX = parts[0]; if (parts[0] > maxX) maxX = parts[0];
    if (parts[1] < minY) minY = parts[1]; if (parts[1] > maxY) maxY = parts[1];
    if (parts[2] < minZ) minZ = parts[2]; if (parts[2] > maxZ) maxZ = parts[2];
  } else if (line.startsWith('vt ')) {
    const parts = line.split(/\s+/).slice(1).map(Number);
    if (parts[0] < minU) minU = parts[0]; if (parts[0] > maxU) maxU = parts[0];
    if (parts[1] < minV) minV = parts[1]; if (parts[1] > maxV) maxV = parts[1];
  } else if (line.startsWith('usemtl ')) {
    mtls.add(line.substring(7).trim());
  } else if (line.startsWith('g ')) {
    groups.add(line.substring(2).trim());
  }
});

rl.on('close', () => {
  console.log('--- Pants Cargo Stats ---');
  console.log(`Groups count: ${groups.size}`);
  console.log(`Materials: ${Array.from(mtls).join(', ')}`);
  console.log(`Bounding Box X: [${minX.toFixed(2)}, ${maxX.toFixed(2)}], Size: ${(maxX - minX).toFixed(2)}`);
  console.log(`Bounding Box Y: [${minY.toFixed(2)}, ${maxY.toFixed(2)}], Size: ${(maxY - minY).toFixed(2)}`);
  console.log(`Bounding Box Z: [${minZ.toFixed(2)}, ${maxZ.toFixed(2)}], Size: ${(maxZ - minZ).toFixed(2)}`);
  console.log(`UV Bounds: U=[${minU.toFixed(3)}, ${maxU.toFixed(3)}], V=[${minV.toFixed(3)}, ${maxV.toFixed(3)}]`);
});

