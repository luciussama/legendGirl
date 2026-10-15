import { DAMAGE_SPRITE_FRAMES } from './DamageSpriteFrames.js';
import { BATTLE_CROUCH_FRAME, BATTLE_TRAIN_BODY } from './BattlePresentation.js';

// A raiz permanece relativa a este módulo; não depende da URL da página.
const BATTLE_ASSET_ROOT = new URL('../../../assets/art/toy-room/battle/', import.meta.url);

/** Carrega os metadados existentes, preservando os quadros nativos de dano. */
export async function loadBattleManifest() {
  const response = await fetch(new URL('remediation/manifest.json', BATTLE_ASSET_ROOT));
  if (!response.ok) throw Error('Não foi possível carregar o manifesto de combate.');
  const manifest = await response.json();
  for (const actor of ['train', 'robot', 'dinosaur', 'bear']) {
    manifest.actors[actor].animations.Hit = DAMAGE_SPRITE_FRAMES[actor];
  }
  return manifest;
}

/** Preenche o cache fornecido sem acessar estado, narrativa ou regras do combate. */
export async function loadBattleImages(manifest, images) {
  const files = new Set(Object.values(manifest.actors).flatMap(actor =>
    Object.values(actor.animations).flatMap(animation => animation.frames.map(frame => frame.file))));
  files.add(BATTLE_CROUCH_FRAME.file);
  files.add(BATTLE_TRAIN_BODY.file);
  await Promise.all([...files].map(file => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => { images.set(file, image); resolve(); };
    image.onerror = () => reject(Error(`Sprite de combate ausente: ${file}`));
    image.src = new URL(file, BATTLE_ASSET_ROOT).href;
  })));
}
