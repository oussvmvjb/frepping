const fs = require('fs');
const readline = require('readline');

async function checkObj(filename) {
  const stream = fs.createReadStream('C:/Users/azziz/frepping/src/assets/hoodie/' + filename);
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let vCount = 0;
  let vtCount = 0;
  let vnCount = 0;
  let fCount = 0;
  const groups = new Set();
  const objects = new Set();
  const mtls = new Set();

  for await (const line of rl) {
    if (line.startsWith('v ')) vCount++;
    else if (line.startsWith('vt ')) vtCount++;
    else if (line.startsWith('vn ')) vnCount++;
    else if (line.startsWith('f ')) fCount++;
    else if (line.startsWith('g ')) groups.add(line.substring(2).trim());
    else if (line.startsWith('o ')) objects.add(line.substring(2).trim());
    else if (line.startsWith('usemtl ')) mtls.add(line.substring(7).trim());
  }

  console.log('=== ' + filename + ' ===');
  console.log('Vertices:', vCount, 'UVs:', vtCount, 'Normals:', vnCount, 'Faces:', fCount);
  console.log('Groups:', Array.from(groups));
  console.log('Objects:', Array.from(objects));
  console.log('Materials:', Array.from(mtls));
}

async function run() {
  await checkObj('HOOD+DOWN.obj');
  await checkObj('HOOD+UP.obj');
}

run().catch(console.error);

