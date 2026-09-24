// Regression gate for visual changes. Executes production jump, movement and
// landing-selection code without changing the game's runtime or physics.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { platforms, createBabyState, getEscapeStats, getPhase3Stats, FLOOR_Y } from '../src/js/config.js';
import { PlatformRenderer, PLATFORM_SURFACES } from '../src/js/environment/PlatformRenderer.js';
import { darkRoomAtlas } from '../src/js/assets/darkRoomAtlas.js';
import { GameState } from '../src/js/state/GameState.js';

const source = fs.readFileSync(new URL('../src/js/game.js', import.meta.url), 'utf8');
function section(start, end) {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  assert(a >= 0 && b > a, `Production section missing: ${start}`);
  return source.slice(a, b);
}
const jumpSource = section('  function doJump() {', '  // --- SISTEMA DE POEIRA MÁGICA DA FADA ---');
const movement = new Function('baby', 'dt', section('    baby.x += baby.vx * dt;', '    // Rastro de poeira'));
const landing = new Function('baby', 'platforms', `const isPhase3 = false;
  ${section('    const activePlatforms = isPhase3 ? phase3Platforms : platforms;', '    if (landedIdx !== -1) {')}
  return landedIdx;`);
const jump = new Function('baby', 'platforms', 'getEscapeStats', 'getPhase3Stats', `
  const audio = {initAudio(){}, playJumpSound(){}, playLongJumpSound(){}};
  const fairy = {x:0,y:0,vy:0};
  const performance = {now:()=>1000};
  const isGameOver=false, gameStarted=true, isStandbyActive=false,
    isStandbyTransitioning=false, gameWon=false, cutsceneActive=false,
    plotTwistActive=false, isPhase3=false;
  const escapeLevel=Math.max(0,baby.currentPlatformIndex-9);
  let lastJumpTime=0;
  function spawnBabyJumpPuff(){}
  function spawnFairySparkles(){}
  ${jumpSource}
  doJump();`);

const baseline = JSON.parse(fs.readFileSync(new URL('../tests/fixtures/dark-room-physics.json', import.meta.url)));
assert.deepEqual({platforms,baby:createBabyState(),escape:Array.from({length:12},(_,i)=>getEscapeStats(i))}, baseline,
  'Visual changes must preserve the approved physics baseline');
const surface = p => ({x:p.standRegion?.x ?? p.x, w:p.standRegion?.w ?? p.w,
  y:p.surfaceTopY ?? p.standRegion?.y ?? p.y});
let checks=0;
const state=new GameState({width:960},null);
Object.assign(state.baby,createBabyState(),{x:1636,y:192,currentPlatformIndex:9,
  controlsLocked:false,isCrouching:false});
state.finishCutscene();
assert.equal(state.escapeLevel,0);
assert.equal(state.baby.longJumpUnlocked,true);
assert.equal(state.baby.vx,0); // Espera o pulo do jogador sem andar previamente
jump(state.baby,platforms,getEscapeStats,getPhase3Stats);
assert(Math.abs(state.baby.vx - 5.09) < 0.05, 'Jump from castle must have calibrated velocity to reach platform 10');
assert.equal(state.baby.vy,getEscapeStats(0).jumpPower);
checks++;
// Assisted landing belongs only to the castle. All later launches keep the
// exact progressive jump strength and horizontal speed from the level config.
for (let index = 10; index <= 20; index++) {
  const support = surface(platforms[index]);
  const b = {...createBabyState(), x:support.x, y:support.y-44,
    currentPlatformIndex:index, longJumpUnlocked:true, isEscaping:true};
  jump(b,platforms,getEscapeStats,getPhase3Stats);
  const stats = getEscapeStats(index-9);
  assert.equal(b.vx,stats.airVx);
  assert.equal(b.vy,stats.jumpPower);
  checks += 2;
}
for(const guard of ['controlsLocked','respawnLandingPending','isCrouching']) {
  const b={...createBabyState(),[guard]:true};
  const before={...b};jump(b,platforms,getEscapeStats,getPhase3Stats);
  assert.deepEqual(b,before);checks++;
}
const airborne={...createBabyState(),onGround:false,vy:-3};
jump(airborne,platforms,getEscapeStats,getPhase3Stats);
assert.equal(airborne.vy,-3);checks++;
for (const p of platforms) {
  const s=surface(p), base=createBabyState();
  for (const [x, expected] of [[s.x-base.w,false],[s.x-base.w+0.01,true],
    [s.x,true],[s.x+s.w-0.01,true],[s.x+s.w,false]]) {
    for (const vy of [-1,0,2,12]) {
      const b={...base,x,y:s.y-base.h,vy};
      assert.equal(landing(b,[p])===0,expected && vy>=0,`${p.style}: edge/direction`);
      checks++;
    }
  }
  for (const x of [s.x,s.x+(s.w-base.w)/2,s.x+s.w-base.w]) {
    const b={...base,x,y:s.y-base.h-100,vx:0,vy:0};
    let landed=false;
    for(let f=0;f<120;f++) {
      movement(b,1);
      if(landing(b,[p])===0){landed=true;break;}
    }
    assert(landed,`${p.style}: vertical landing`); checks++;
  }
}

// Search actual launch positions across each source's support, including partial
// body overlap. Assert arrival at the NEXT platform, not merely a positive gap.
const routes=[];
for (const dt of [0.5, 1, 1.2]) {
for(let target=0;target<platforms.length;target++) {
  const from=target===0?{x:60,w:160,y:FLOOR_Y}:surface(platforms[target-1]);
  const successful=[];
  if (target !== 10) {
    const early = {...createBabyState(), x:from.x, y:from.y-44,
      currentPlatformIndex:target-1, longJumpUnlocked:target>=10};
    const late = {...early, x:from.x+from.w-1};
    jump(early,platforms,getEscapeStats,getPhase3Stats);
    jump(late,platforms,getEscapeStats,getPhase3Stats);
    assert.equal(early.vx,late.vx,`Target ${target}: launch position must not auto-aim`);
    assert.equal(early.vy,late.vy);
    checks += 2;
  }
  for(let x=Math.ceil(from.x);x<from.x+from.w;x++) {
    const b={...createBabyState(),x,y:from.y-44,currentPlatformIndex:target-1,
      longJumpUnlocked:target>=10};
    jump(b,platforms,getEscapeStats,getPhase3Stats);
    for(let f=0;f<180;f++) {
      movement(b,dt);
      const hit=landing(b,platforms);
      if(hit>=0){if(hit===target)successful.push(x);break;}
      if(b.y>FLOOR_Y)break;
    }
  }
  routes.push({dt,target:platforms[target].style,launches:successful.length,
    first:successful[0]??null,last:successful.at(-1)??null});
  if (target !== 10) {
    assert(successful.length >= 8,
      `Target ${target}: timing window too narrow (dt=${dt})`);
    assert(successful.length < from.w,
      `Target ${target}: every launch succeeds (dt=${dt})`);
    checks++;
  }
  if (target >= 12) {
    const previous = routes.at(-2);
    const window = successful.length / getEscapeStats(target-10).runVx;
    const previousWindow = previous.launches / getEscapeStats(target-11).runVx;
    assert(window < previousWindow,
      `Target ${target}: escape timing must tighten as running speed increases (dt=${dt})`);
    checks++;
  }
}

}

// Follow real landings through the approach, without teleporting to the next
// launch. Sample early, middle and late inputs within each successful window.
const approachTiming = [];
for (const dt of [0.5, 1, 1.2]) {
  for (const timing of [0.25, 0.5, 0.75]) {
    let baby = createBabyState();
    for (let target = 0; target <= 9; target++) {
      const candidates = [];
      const from = target === 0 ? null : surface(platforms[target - 1]);
      const endX = from ? from.x + from.w : platforms[0].x;
      let attempts = 0;
      for (let x = baby.x; x < endX; x += baby.baseVx * dt) {
        const trial = {...baby, x};
        jump(trial, platforms, getEscapeStats, getPhase3Stats);
        let hit = -1;
        for (let frame = 0; frame < 240; frame++) {
          movement(trial, dt);
          hit = landing(trial, platforms);
          if (hit >= 0 || trial.y > FLOOR_Y) break;
        }
        if (hit === target) candidates.push({waitFrames: attempts, baby: trial});
        attempts++;
      }
      const windowMs = candidates.length * dt * 1000 / 60;
      assert(windowMs >= 100,
        `Approach ${target}: needs a usable timing window (dt=${dt}, timing=${timing})`);
      assert.equal(candidates.at(-1).waitFrames - candidates[0].waitFrames + 1,
        candidates.length, `Approach ${target}: fragmented launch window`);
      if (dt === 1 && timing === 0.5) {
        approachTiming.push({target: platforms[target].label,
          waitMs: Math.round(candidates[0].waitFrames * 1000 / 60),
          windowMs: Math.round(windowMs)});
      }
      const selected = candidates[Math.floor((candidates.length - 1) * timing)];
      baby = {...selected.baby, y: surface(platforms[target]).y - baby.h,
        vy: 0, vx: baby.baseVx, onGround: true, currentPlatformIndex: target};
      checks += 2;
    }
    const transition = new GameState({width:960}, null);
    Object.assign(transition.baby, baby);
    transition.startCastleCutscene();
    assert.equal(transition.cutsceneActive, true);
    transition.advanceCutscene();
    transition.advanceCutscene();
    assert.equal(transition.cutsceneActive, false);
    assert.equal(transition.baby.longJumpUnlocked, true);
    assert.equal(transition.escapeLevel, 0);
    assert.equal(transition.baby.vx, 0);
    assert.equal(transition.currentScrollSpeed, 0);
    jump(transition.baby, platforms, getEscapeStats, getPhase3Stats);
    let hit = -1;
    for (let frame = 0; frame < 240; frame++) {
      movement(transition.baby, dt);
      hit = landing(transition.baby, platforms);
      if (hit >= 0 || transition.baby.y > FLOOR_Y) break;
    }
    assert.equal(hit, 10, `Castle → train after cutscene (dt=${dt}, timing=${timing})`);
    checks += 7;
  }
}
console.table(approachTiming);
console.log('PASS: 9 continuous approaches, castle pause and first escape jump.');

// Exercise the real renderer with actual PNG dimensions. Detect missing assets,
// non-finite placement and accidental physics mutation during rendering.
const manifest=JSON.parse(fs.readFileSync(new URL('../assets/manifest.json',import.meta.url)));
const assets={get(key){const file=manifest.images[key];if(!file)return null;
  const png=fs.readFileSync(new URL('../'+file,import.meta.url));
  assert.equal(png.subarray(1,4).toString(),'PNG');
  return {width:png.readUInt32BE(16),height:png.readUInt32BE(20)};},
  getRegion(key,r){const sheet=this.get(key);if(!sheet)return null;
    assert(r.x+r.width<=sheet.width && r.y+r.height<=sheet.height);
    return {width:r.width,height:r.height};}};
const renderer=new PlatformRenderer({assets});
for(const p of platforms){
  const before=JSON.stringify(p);
  let calls=0;
  const ctx={save(){},restore(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},rect(){},clip(){},fillRect(){},drawImage(sprite,...rect){
    assert(rect.every(Number.isFinite));assert(rect[2]>0&&rect[3]>0);calls++;
    const calibration=PLATFORM_SURFACES[p.style];
    assert.equal(sprite.width,calibration.origW,`${p.style}: source width`);
    assert.equal(sprite.height,calibration.origH,`${p.style}: source height`);
    if(!calibration.floorFit) {
      assert(Math.abs(rect[3]-sprite.height*rect[2]/sprite.width)<=1,
        `${p.style}: sprite must preserve its proportions`);
    }
  }};
  if (p.style === 'block_castle') {
    assert.equal(assets.get('dark-room-sprite-block-castle'), null);
    assert.equal(darkRoomAtlas.block_castle, undefined);
    assert.equal(renderer.drawAtlasPlatformSprite(ctx,assets,p.style,p.x,p), false);
    const blocks=[];
    const procedural=new Proxy({fillRect(...r){blocks.push(r);}}, {
      get:(o,k)=>k in o?o[k]:()=>{}
    });
    renderer.renderPlatforms(procedural,{width:10000},0,{platforms:[p]});
    const top=surface(p);
    assert(blocks.some(([x,y,w])=>x===top.x&&y===top.y&&w===top.w),
      'The castle tower must visibly support the real landing region');
    assert(!blocks.some(([x,y,w])=>y===top.y&&(x<top.x||x+w>top.x+top.w)),
      'The castle must not draw a false wide landing surface');
    checks+=3;
    continue; // Deliberate procedural castle, without a raster sprite.
  }
  assert(renderer.drawAtlasPlatformSprite(ctx,assets,p.style,p.x,p));
  assert.equal(calls,1);assert.equal(JSON.stringify(p),before);checks++;
  const calibration=PLATFORM_SURFACES[p.style], support=surface(p);
  for(const camX of [0,123.4,p.x-40]) {
    for(const atlasOnly of [false,true]) {
      const selectedAssets=atlasOnly?{get(){return null;},getRegion:assets.getRegion.bind(assets)}:assets;
      const aligned={save(){},restore(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},rect(){},clip(){},fillRect(){},drawImage(sprite,dx,dy,dw,dh){
        // Rounding of raster placement may differ by less than one pixel.
        assert(Math.abs(dx+calibration.surfaceX*dw/sprite.width-(support.x-camX))<1);
        assert(Math.abs(dy+calibration.surfaceY*dh/sprite.height-support.y)<1);
        assert(Math.abs(calibration.surfaceW*dw/sprite.width-support.w)<1);
      }};
      assert(renderer.drawAtlasPlatformSprite(aligned,selectedAssets,p.style,p.x-camX,p));checks++;
    }
  }
}
for(const name of ['stepped_dresser','music_box','kite_frame','floating_books']) {
  assert.equal(manifest.images['dark-room-sprite-'+name.replaceAll('_','-')],'./'+darkRoomAtlas[name].file);
  const sprite=assets.get('dark-room-sprite-'+name.replaceAll('_','-'));
  assert.equal(sprite.width,darkRoomAtlas[name].width);
  assert.equal(sprite.height,darkRoomAtlas[name].height);checks++;
}
// Debug must show the same surfaceTopY override used by rendering and landing.
globalThis.window={DEBUG_COLLISIONS:true};
const debugRects=[];
const ctx=new Proxy({fillRect(...r){debugRects.push(r);}}, {get:(o,k)=>k in o?o[k]:()=>{}});
renderer.renderPlatforms(ctx,{width:1000},0,{platforms:[{
  x:10,y:200,w:100,h:40,style:'open_books',surfaceTopY:150,
  standRegion:{x:20,y:180,w:60,h:30}
}]});
assert.deepEqual(debugRects[0],[20,150,60,30]);checks++;
delete globalThis.window;
console.table(routes);
console.log(`PASS: ${checks} hitbox/render checks; geometry/config baseline unchanged.`);
const unreachable=routes.filter(r=>!r.launches);
assert.equal(unreachable.length,0,`Unreachable transitions: ${unreachable.map(r=>r.target).join(', ')}`);
console.log(`PASS: ${routes.length} reachable transition/timestep combinations.`);
