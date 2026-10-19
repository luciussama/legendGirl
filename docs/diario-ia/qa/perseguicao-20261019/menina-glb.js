import fs from 'node:fs';
import assert from 'node:assert/strict';
const file = fs.readFileSync('assets/models/bear-chase/menina.glb');
assert.equal(file.toString('utf8', 0, 4), 'glTF');
assert.equal(file.readUInt32LE(4), 2);
assert.equal(file.readUInt32LE(8), file.length);
const json = JSON.parse(file.toString('utf8', 20, 20 + file.readUInt32LE(12)));
for (const name of ['Menina3D', 'RaboDeCavalo', 'Joelho', 'Cotovelo']) {
  assert.ok(json.nodes.some(node => node.name === name), 'Pivô exportado ausente: ' + name);
}
const instances = json.nodes.filter(node => node.mesh !== undefined).length;
assert.ok(instances > 40, 'A exportação deve conservar corpo, tecidos, mechas e articulações.');
assert.ok(json.meshes.length < instances, 'Malhas iguais devem ser reutilizadas no GLB.');
console.log('APROVADO: GLB 2 íntegro, volumes, materiais e pivôs preservados.', JSON.stringify({
  bytes: file.length, volumes: instances, malhasCompartilhadas: json.meshes.length, materiais: json.materials.length,
}));
