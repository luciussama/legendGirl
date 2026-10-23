import { GIRL_V2_FRAMES, GIRL_V2_REFERENCE_HEIGHT } from '../assets/illustratedGirl.js';

// A arena mantém escala e relógios próprios; as novas pinturas não redefinem hitboxes.
export const ARENA_GIRL_REFERENCE_HEIGHT = 303;
const frames = pose => GIRL_V2_FRAMES['sword_' + pose].map(frame => ({
  file: '../../characters/girl-v2/runtime/' + frame.key.replace('girl-v2-', '') + '.png',
  x: frame.x, y: frame.y, width: frame.w, height: frame.h,
  anchorX: frame.anchorX, anchorY: frame.anchorY,
  faceX: frame.faceX ?? frame.anchorX, sourceFacing: 1,
  pixelUnit: ARENA_GIRL_REFERENCE_HEIGHT / GIRL_V2_REFERENCE_HEIGHT
}));
const crouchCycle = frames('crouchCycle');
export const ARENA_GIRL_ANIMATION_FRAMES = {
  idle: frames('idle'), run: frames('run'), jump: frames('jump'), fall: frames('fall'),
  attack: frames('attack'), damage: frames('damage'), guard: frames('guard'),
  crouchCycle, crouchEnter: [crouchCycle[0]], crouch: [crouchCycle[3]]
};
