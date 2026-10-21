import * as T from '../../../vendor/three/three.module.js';
import { ChasePropResources } from './ChasePropResources.js';
import { TrainProp } from './TrainProp.js';
import { OakCabinetProp } from './OakCabinetProp.js';
import { BlocksProp } from './BlocksProp.js';
import { BookshelfProp } from './BookshelfProp.js';
import { BlockCastleProp } from './BlockCastleProp.js';
import { ToyChestProp } from './ToyChestProp.js';
import { decorativeFactories } from './DecorativeProps.js';
import { BunnyProp } from './BunnyProp.js';

/** Catálogo visual sem decisões de gameplay; cada entrada descreve apoio e referência. */
export class ChasePropCatalog {
  /** Recebe imagens já carregadas e compartilha a contagem GPU com o proprietário da cena. */
  constructor(images, externalResources = null) {
    this.resources = new ChasePropResources(images.cabinet, externalResources, images);
    this.entries = new Map(); this.disposed = false;
    this.register('train', new TrainProp(this.resources), 'toy-room/environment-sheet.png', Math.PI / 2, .85);
    this.register('blocks', new BlocksProp(this.resources), 'toy-room/stage3/stacking-blocks-v1.png');
    this.register('bunny', new BunnyProp(this.resources), 'toy-room/stage3/cotton-bunny-v1.png');
    this.register('shelf', new BookshelfProp(this.resources), 'toy-room/stage3/bookshelf-v1.png');
    this.register('fortress', new BlockCastleProp(this.resources), 'toy-room/stage3/block-castle-v1.png');
    this.register('chest', new ToyChestProp(this.resources), 'toy-room/chest-brinquedos-v1.png');
    const refs = {teddy:'environment-sheet.png',robot:'stage3/retro-robot-v1.png',duck:'stage3/royal-duck-v1.png',drum:'stage3/enchanted-drum-v1.png',jack:'stage3/fairy-jack-box-v1.png',armchair:'stage3/armchair-v1.png','rocking-horse':'stage3/rocking-horse-v1.png',table:'environment-sheet.png'};
    for (const [id,factory] of Object.entries(decorativeFactories(this.resources, images))) this.register(id,factory,'toy-room/'+refs[id]);
    this.register('wardrobe', new OakCabinetProp(this.resources), 'toy-room/stage3/oak-cabinet-v1.png');
  }
  /** Registra limites reais após orientação visual; todos os modelos têm apoio inferior. */
  register(id, factory, reference, rotation = 0, scale = 1) {
    const root = new T.Group(); root.name = id;
    const visual = factory.create(); visual.rotation.y = rotation; visual.scale.multiplyScalar(scale); root.add(visual);
    const box = new T.Box3().setFromObject(root), size = box.getSize(new T.Vector3());
    root.userData = { propId: id, anchor: 'apoio inferior', visualHeight: size.y, visualWidth: size.x, visualCenterX: (box.min.x + box.max.x) / 2 };
    this.entries.set(id, { root, reference, visualBounds: { min: box.min.toArray(), max: box.max.toArray() } });
  }
  /** Entrega instância leve; IDs desconhecidos são erros explícitos, sem fallback artístico. */
  create(id) {
    if (this.disposed) throw new Error('Catálogo de props já encerrado.');
    const entry = this.entries.get(id);
    if (!entry) throw new Error('Prop da perseguição não cadastrado: ' + id);
    return entry.root.clone(true);
  }
  /** Desanexa apenas a instância; geometrias e materiais pertencem ao catálogo. */
  release(root) { root.removeFromParent(); }
  /** Libera os recursos comuns uma única vez e impede recriação após o encerramento. */
  dispose() { if (this.disposed) return; this.disposed = true; this.entries.clear(); this.resources.dispose(); }
}
