const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/azziz/frepping/src/assets/3dmodel/comp/卫衣内搭夹克外套工装裤套装_obj.obj'),
  crlfDelay: Infinity
});

let currentGroup = 'default';
let currentMtl = 'default';
const groupStats = {};
const mtlStats = {};

// We will also sample vertex positions to map faces to Y coordinates
const vertices = []; // We can store just Y coordinate or every N-th vertex

rl.on('line', (line) => {
  if (line.startsWith('g ')) {
    currentGroup = line.substring(2).trim();
  } else if (line.startsWith('usemtl ')) {
    currentMtl = line.substring(7).trim();
  } else if (line.startsWith('v ')) {
    const parts = line.split(/\s+/);
    vertices.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
  } else if (line.startsWith('f ')) {
    if (!groupStats[currentGroup]) groupStats[currentGroup] = { faces: 0, mtl: new Set(), minY: Infinity, maxY: -Infinity };
    if (!mtlStats[currentMtl]) mtlStats[currentMtl] = { faces: 0, groups: new Set(), minY: Infinity, maxY: -Infinity, minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity };

    groupStats[currentGroup].faces++;
    groupStats[currentGroup].mtl.add(currentMtl);

    mtlStats[currentMtl].faces++;
    mtlStats[currentMtl].groups.add(currentGroup);

    // Get the first vertex index of the face
    const fParts = line.split(/\s+/).slice(1);
    for (const p of fParts) {
      const vIdx = parseInt(p.split('/')[0], 10) - 1;
      if (vIdx >= 0 && vIdx < vertices.length) {
        const [vx, vy, vz] = vertices[vIdx];
        if (vy < groupStats[currentGroup].minY) groupStats[currentGroup].minY = vy;
        if (vy > groupStats[currentGroup].maxY) groupStats[currentGroup].maxY = vy;

        if (vy < mtlStats[currentMtl].minY) mtlStats[currentMtl].minY = vy;
        if (vy > mtlStats[currentMtl].maxY) mtlStats[currentMtl].maxY = vy;
        if (vx < mtlStats[currentMtl].minX) mtlStats[currentMtl].minX = vx;
        if (vx > mtlStats[currentMtl].maxX) mtlStats[currentMtl].maxX = vx;
        if (vz < mtlStats[currentMtl].minZ) mtlStats[currentMtl].minZ = vz;
        if (vz > mtlStats[currentMtl].maxZ) mtlStats[currentMtl].maxZ = vz;
      }
    }
  }
});

rl.on('close', () => {
  console.log('--- GROUPS (' + Object.keys(groupStats).length + ') ---');
  for (const [name, stats] of Object.entries(groupStats)) {
    console.log(`Group: "${name}" | Faces: ${stats.faces} | Y: [${stats.minY.toFixed(1)}, ${stats.maxY.toFixed(1)}] | Mtls: ${Array.from(stats.mtl).join(', ')}`);
  }

  console.log('\n--- MATERIALS (' + Object.keys(mtlStats).length + ') ---');
  for (const [name, stats] of Object.entries(mtlStats)) {
    console.log(`Material: "${name}" | Faces: ${stats.faces} | Y: [${stats.minY.toFixed(1)}, ${stats.maxY.toFixed(1)}] | X: [${stats.minX.toFixed(1)}, ${stats.maxX.toFixed(1)}] | Z: [${stats.minZ.toFixed(1)}, ${stats.maxZ.toFixed(1)}]`);
  }
});
