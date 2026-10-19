import fs from 'node:fs/promises';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { ChaseGirlModel } from '../src/js/bear-chase/ChaseGirlModel.js';

/** Adapta o leitor binário do exportador para o ambiente Node, sem serviço externo. */
class LocalFileReader {
  /** Converte o Blob do GLB em ArrayBuffer antes de notificar o exportador. */
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); });
  }
}
globalThis.FileReader = LocalFileReader;
const resources = new Set();
const model = new ChaseGirlModel(resource => { resources.add(resource); return resource; });
try {
  const binary = await new GLTFExporter().parseAsync(model.root, { binary: true, trs: true });
  await fs.mkdir('assets/models/bear-chase', { recursive: true });
  await fs.writeFile('assets/models/bear-chase/menina.glb', Buffer.from(binary));
  console.log('Modelo 3D da menina exportado; articulações nomeadas, materiais e malhas preservados.');
} finally {
  for (const resource of resources) resource.dispose();
}
