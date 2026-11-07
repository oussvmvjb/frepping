const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/azziz/frepping/src/assets/3dmodel/comp/卫衣内搭夹克外套工装裤套装_obj.obj'),
  crlfDelay: Infinity
});

let currentGroup = 'default';
let currentMtl = 'default';
const groupList = [];
let cur = null;
const vertices = [];
const uvs = [];

rl.on('line', (line) => {
  if (line.startsWith('g ')) {
    currentGroup = line.substring(2).trim();
    cur = {
      name: currentGroup,
      faces: 0,
      minY: Infinity, maxY: -Infinity,
      minX: Infinity, maxX: -Infinity,
      minZ: Infinity, maxZ: -Infinity,
      minU: Infinity, maxU: -Infinity,
      minV: Infinity, maxV: -Infinity,
      mtls: new Set()
    };
    groupList.push(cur);
  } else if (line.startsWith('usemtl ')) {
    currentMtl = line.substring(7).trim();
    if (cur) cur.mtls.add(currentMtl);
  } else if (line.startsWith('v ')) {
    const parts = line.split(/\s+/);
    vertices.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
  } else if (line.startsWith('vt ')) {
    const parts = line.split(/\s+/);
    uvs.push([parseFloat(parts[1]), parseFloat(parts[2])]);
  } else if (line.startsWith('f ')) {
    if (cur) {
      cur.faces++;
      const fParts = line.split(/\s+/).slice(1);
      for (const p of fParts) {
        const segs = p.split('/');
        const vIdx = parseInt(segs[0], 10) - 1;
        const vtIdx = parseInt(segs[1], 10) - 1;
        if (vIdx >= 0 && vIdx < vertices.length) {
          const [vx, vy, vz] = vertices[vIdx];
          if (vy < cur.minY) cur.minY = vy; if (vy > cur.maxY) cur.maxY = vy;
          if (vx < cur.minX) cur.minX = vx; if (vx > cur.maxX) cur.maxX = vx;
          if (vz < cur.minZ) cur.minZ = vz; if (vz > cur.maxZ) cur.maxZ = vz;
        }
        if (vtIdx >= 0 && vtIdx < uvs.length) {
          const [u, v] = uvs[vtIdx];
          if (u < cur.minU) cur.minU = u; if (u > cur.maxU) cur.maxU = u;
          if (v < cur.minV) cur.minV = v; if (v > cur.maxV) cur.maxV = v;
        }
      }
    }
  }
});

rl.on('close', () => {
  // Separate into upper body (> 1000) vs lower body (pants, Y < 1150)
  const pantsGroups = [];
  const upperGroups = [];

  for (const g of groupList) {
    if (g.maxY <= 1160 && !g.name.includes('墨镜') && !g.name.includes('卫衣') && !g.name.includes('防晒衣')) {
      pantsGroups.push(g);
    } else {
      upperGroups.push(g);
    }
  }

  console.log(`\n=== PANTS GROUPS (${pantsGroups.length}) ===`);
  let pantsFaces = 0;
  for (const g of pantsGroups) {
    pantsFaces += g.faces;
    console.log(`- "${g.name}": faces=${g.faces}, Y=[${g.minY.toFixed(1)}, ${g.maxY.toFixed(1)}], X=[${g.minX.toFixed(1)}, ${g.maxX.toFixed(1)}], UV=([${g.minU.toFixed(2)}, ${g.maxU.toFixed(2)}], [${g.minV.toFixed(2)}, ${g.maxV.toFixed(2)}]), mtls=${Array.from(g.mtls).join(',')}`);
  }
  console.log(`Total Pants Faces: ${pantsFaces}`);

  console.log(`\n=== UPPER BODY GROUPS (${upperGroups.length}) ===`);
  for (const g of upperGroups) {
    console.log(`- "${g.name}": faces=${g.faces}, Y=[${g.minY.toFixed(1)}, ${g.maxY.toFixed(1)}]`);
  }
});

