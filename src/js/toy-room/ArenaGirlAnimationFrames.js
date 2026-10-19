import { BATTLE_GIRL_FRAMES } from './BattleGirlFrames.js';
import { DAMAGE_SPRITE_FRAMES } from './DamageSpriteFrames.js';

// Metadados de apresentação: orientação e escala corporal independem da espada e das margens.
const original = (pose, facing, anchors, faces) => BATTLE_GIRL_FRAMES[pose].map((frame,index) => ({
  ...frame, x:0, y:0, pixelUnit:1, sourceFacing: facing[index] ?? facing[0],
  anchorX: anchors?.[index] ?? frame.anchorX,
  faceX: faces?.[index] ?? frame.anchorX
}));
const atlas = (file, x, y, width, height, anchorX, pixelUnit, faceX = anchorX) => ({
  file:`girl/animation-v2/${file}`, x,y,width,height,anchorX,anchorY:height,
  pixelUnit,sourceFacing:1,faceX
});
const crouchCycle = [
  atlas('crouch-cycle-sheet.png',86,41,615,587,235,0.5,344),
  atlas('crouch-cycle-sheet.png',782,112,604,516,240,0.5,363),
  atlas('crouch-cycle-sheet.png',93,649,607,450,235,0.5,356),
  atlas('crouch-cycle-sheet.png',780,684,603,421,240,0.5,380)
];
export const ARENA_GIRL_REFERENCE_HEIGHT = 303;
export const ARENA_GIRL_ANIMATION_FRAMES = {
  idle: original('idle',[-1],null,[136,136,136,136]),
  jump: original('jump',[1],null,[203,203]),
  fall: original('fall',[1],null,[203,203]),
  attack: original('attack',[-1,1,1,1,1],[134,148,142,132,130],[126,177,180,172,175]),
  damage: DAMAGE_SPRITE_FRAMES.girl.frames.map(frame => ({
    ...frame, x:0, y:0, anchorX:frame.anchor.x, anchorY:frame.anchor.y,
    pixelUnit:1, sourceFacing:-1, faceX:frame.anchor.x
  })),
  // A cabeça mantém sua escala; a redução de altura resulta de pernas e tronco dobrados.
  crouchCycle,
  crouchEnter:[crouchCycle[0]],
  crouch:[crouchCycle[3]],
  // Sequência Imagegen: o mesmo atlas é percorrido ao contrário ao soltar a defesa.
  guard:[
    atlas('guard-cycle-sheet.png',0,0,512,496,230,.69,277),
    atlas('guard-cycle-sheet.png',512,0,512,496,240,.69,278),
    atlas('guard-cycle-sheet.png',1024,0,512,496,230,.69,291),
    atlas('guard-cycle-sheet.png',0,512,512,475,230,.69,278),
    atlas('guard-cycle-sheet.png',512,512,512,475,240,.69,278),
    atlas('guard-cycle-sheet.png',1024,512,512,475,240,.69,292)
  ],
  run:[
    atlas('run-sheet.png',92,51,536,517,240,0.575,298),
    atlas('run-sheet.png',738,52,548,521,231,0.575,292),
    atlas('run-sheet.png',74,620,555,539,252,0.575,326),
    atlas('run-sheet.png',734,622,571,537,231,0.575,306)
  ]
};
