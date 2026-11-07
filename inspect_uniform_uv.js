const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/azziz/frepping/src/assets/3dmodel/comp/pants_cargo.obj'),
  crlfDelay: Infinity
});

let currentMtl = '';
const uvs = [];
let minU = Infinity, maxU = -Infinity;
let minV = Infinity, maxV = -Infinity;

rl.on('line', (line) => {
  if (line.startsWith('vt ')) {
    const parts = line.split(/\s+/).slice(1).map(Number);
    uvs.push(parts);
  } else if (line.startsWith('usemtl ')) {
    currentMtl = line.substring(7).trim();
  } else if (line.startsWith('f ') && currentMtl === 'uniform_1001') {
    const tokens = line.trim().split(/\s+/).slice(1);
    for (const t of tokens) {
      const vtIdx = parseInt(t.split('/')[1], 10) - 1;
      if (vtIdx >= 0 && vtIdx < uvs.length) {
        const [u, v] = uvs[vtIdx];
        if (u < minU) minU = u; if (u > maxU) maxU = u;
        if (v < minV) minV = v; if (v > maxV) maxV = v;
      }
    }
  }
});

rl.on('close', () => {
  console.log(`uniform_1001 UV Bounds: U=[${minU.toFixed(4)}, ${maxU.toFixed(4)}], V=[${minV.toFixed(4)}, ${maxV.toFixed(4)}]`);
});

