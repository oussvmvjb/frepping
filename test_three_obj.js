const fs = require('fs');
const THREE = require('three');
const { OBJLoader } = require('three/examples/jsm/loaders/OBJLoader.js');

const objText = fs.readFileSync('C:/Users/azziz/frepping/src/assets/hoodie/HOOD+DOWN.obj', 'utf8');

const loader = new OBJLoader();
const objGroup = loader.parse(objText);

console.log('Parsed OBJ Group children count:', objGroup.children.length);

let totalVertices = 0;
objGroup.traverse((child) => {
  if (child.isMesh) {
    console.log('Mesh found:', child.name, 'Geometry attributes:', Object.keys(child.geometry.attributes));
    console.log('Vertex count:', child.geometry.attributes.position.count);
    totalVertices += child.geometry.attributes.position.count;

    child.geometry.computeBoundingBox();
    const box = child.geometry.boundingBox;
    console.log('Box Min:', box.min);
    console.log('Box Max:', box.max);

    // Test centering and scaling like tshirt-customizer does
    const geom = child.geometry.clone();
    geom.computeVertexNormals();
    geom.center();
    geom.computeBoundingBox();
    const size = new THREE.Vector3();
    geom.boundingBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.82 / maxDim;
    geom.scale(scale, scale, scale);
    geom.computeBoundingBox();
    console.log('Scaled Box Min:', geom.boundingBox.min);
    console.log('Scaled Box Max:', geom.boundingBox.max);
    console.log('Scaled Box Size:', geom.boundingBox.getSize(new THREE.Vector3()));
  }
});

