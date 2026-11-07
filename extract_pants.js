const fs = require('fs');
const readline = require('readline');

async function extractPants() {
  const inputObjPath = 'C:/Users/azziz/frepping/src/assets/3dmodel/comp/卫衣内搭夹克外套工装裤套装_obj.obj';
  const outputObjPath = 'C:/Users/azziz/frepping/src/assets/3dmodel/comp/pants_cargo.obj';
  const outputMtlPath = 'C:/Users/azziz/frepping/src/assets/3dmodel/comp/pants_cargo.mtl';

  console.log('Reading OBJ...');
  const fileStream = fs.createReadStream(inputObjPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const vertices = [];
  const uvs = [];
  const normals = [];

  // Group parsing
  let currentGroup = '';
  let currentMtl = '';
  
  // We need to know which groups belong to the pants
  // In our earlier inspection, groups with maxY <= 1160 and not containing 墨镜, 卫衣, 防晒衣 are pants.
  function isPantsGroup(name) {
    if (name.includes('墨镜') || name.includes('卫衣') || name.includes('防晒衣') || name.includes('帽子') || name.includes('拉链') || name.includes('袖') || name.includes('夹克')) {
      return false;
    }
    // Specific upper body items that reached ~1120-1170
    if (name.includes('纽扣4') || name.includes('纽扣 1') || name.includes('附件14') || name.includes('附件10') || name.includes('附件19')) {
      return false;
    }
    if (name.includes('版片80') || name.includes('版片319') || name.includes('版片325') || name.includes('版片222') || name.includes('版片224') || name.includes('版片120') || name.includes('版片291') || name.includes('版片337') || name.includes('版片209') || name.includes('版片322') || name.includes('版片119') || name.includes('版片229') || name.includes('版片334') || name.includes('版片226') || name.includes('版片219') || name.includes('版片232')) {
      return false;
    }
    return true;
  }

  const pantsFaces = []; // { group, mtl, lines }
  let currentPantsGroup = null;

  for await (const line of rl) {
    if (line.startsWith('v ')) {
      const parts = line.split(/\s+/).slice(1).map(Number);
      vertices.push(parts);
    } else if (line.startsWith('vt ')) {
      const parts = line.split(/\s+/).slice(1).map(Number);
      uvs.push(parts);
    } else if (line.startsWith('vn ')) {
      const parts = line.split(/\s+/).slice(1).map(Number);
      normals.push(parts);
    } else if (line.startsWith('g ')) {
      currentGroup = line.substring(2).trim();
      currentPantsGroup = isPantsGroup(currentGroup) ? currentGroup : null;
    } else if (line.startsWith('usemtl ')) {
      currentMtl = line.substring(7).trim();
    } else if (line.startsWith('f ')) {
      if (currentPantsGroup) {
        pantsFaces.push({ group: currentPantsGroup, mtl: currentMtl, line });
      }
    }
  }

  console.log(`Loaded ${vertices.length} vertices, ${uvs.length} UVs, ${normals.length} normals.`);
  console.log(`Found ${pantsFaces.length} pants faces across pants groups.`);

  // Re-index only used vertices, uvs, and normals for the pants to create an efficient clean file
  const vMap = new Map();
  const vtMap = new Map();
  const vnMap = new Map();

  const newVertices = [];
  const newUvs = [];
  const newNormals = [];

  function getNewV(origIdx) {
    if (vMap.has(origIdx)) return vMap.get(origIdx);
    const newIdx = newVertices.length + 1;
    newVertices.push(vertices[origIdx - 1]);
    vMap.set(origIdx, newIdx);
    return newIdx;
  }

  function getNewVt(origIdx) {
    if (vtMap.has(origIdx)) return vtMap.get(origIdx);
    const newIdx = newUvs.length + 1;
    newUvs.push(uvs[origIdx - 1]);
    vtMap.set(origIdx, newIdx);
    return newIdx;
  }

  function getNewVn(origIdx) {
    if (vnMap.has(origIdx)) return vnMap.get(origIdx);
    const newIdx = newNormals.length + 1;
    newNormals.push(normals[origIdx - 1]);
    vnMap.set(origIdx, newIdx);
    return newIdx;
  }

  const outStream = fs.createWriteStream(outputObjPath);
  outStream.write('# FREPPING Standalone Cargo Pants Model\n');
  outStream.write('# Extracted from 卫衣内搭夹克外套工装裤套装_obj.obj preserving exact topology and UVs\n');
  outStream.write('mtllib 卫衣内搭夹克外套工装裤套装_obj.mtl\n\n');

  // Convert faces and collect references
  const finalFaces = [];
  for (const pf of pantsFaces) {
    const tokens = pf.line.trim().split(/\s+/).slice(1);
    const newTokens = tokens.map(t => {
      const parts = t.split('/');
      const v = getNewV(parseInt(parts[0], 10));
      const vt = parts[1] ? getNewVt(parseInt(parts[1], 10)) : '';
      const vn = parts[2] ? getNewVn(parseInt(parts[2], 10)) : '';
      return `${v}/${vt}/${vn}`;
    });
    finalFaces.push({ group: pf.group, mtl: pf.mtl, line: `f ${newTokens.join(' ')}` });
  }

  console.log(`Writing ${newVertices.length} vertices, ${newUvs.length} UVs, ${newNormals.length} normals...`);

  for (const v of newVertices) {
    outStream.write(`v ${v[0]} ${v[1]} ${v[2]}\n`);
  }
  for (const vt of newUvs) {
    outStream.write(`vt ${vt[0]} ${vt[1]}\n`);
  }
  for (const vn of newNormals) {
    outStream.write(`vn ${vn[0]} ${vn[1]} ${vn[2]}\n`);
  }

  let lastG = '';
  let lastM = '';
  for (const f of finalFaces) {
    if (f.group !== lastG) {
      outStream.write(`g ${f.group}\n`);
      lastG = f.group;
    }
    if (f.mtl !== lastM) {
      outStream.write(`usemtl ${f.mtl}\n`);
      lastM = f.mtl;
    }
    outStream.write(`${f.line}\n`);
  }

  outStream.end();
  console.log('Successfully wrote:', outputObjPath);
}

extractPants().catch(console.error);

