const fs = require('fs');
const THREE = require('three');
const { OBJLoader } = require('three/examples/jsm/loaders/OBJLoader.js');

const objText = fs.readFileSync('C:/Users/azziz/frepping/src/assets/hoodie/HOOD+DOWN.obj', 'utf8');
const loader = new OBJLoader();
const objGroup = loader.parse(objText);

let mesh = null;
objGroup.traverse(c => { if (c.isMesh && !mesh) mesh = c; });

const geom = mesh.geometry.clone();
geom.center();

const pos = geom.attributes.position.array;
const norm = geom.attributes.normal.array;

// Let's sample points with max Z vs min Z
let frontNormalZ = 0;
let backNormalZ = 0;

for (let i = 0; i < pos.length; i += 3) {
  const z = pos[i + 2];
  const nz = norm[i + 2];
  if (z > 100) frontNormalZ += nz;
  if (z < -100) backNormalZ += nz;
}

console.log('Front points normal Z sum (z > 100):', frontNormalZ);
console.log('Back points normal Z sum (z < -100):', backNormalZ);

