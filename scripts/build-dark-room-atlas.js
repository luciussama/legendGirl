// Pack the canonical manifest images. Does not regenerate or rename artwork.
import fs from 'node:fs';
import {PNG} from 'pngjs';
import {darkRoomAtlas} from '../src/js/assets/darkRoomAtlas.js';
const manifest=JSON.parse(fs.readFileSync('assets/manifest.json'));
const regions={}, packed=new Map(), width=2048, padding=8;
let x=padding,y=padding,rowH=0;
for(const [name,old] of Object.entries(darkRoomAtlas)){
  const file=(manifest.images['dark-room-sprite-'+name.replaceAll('_','-')]??old.file).replace(/^\.\//,'');
  if(!packed.has(file)){
    const png=PNG.sync.read(fs.readFileSync(file));
    if(png.width+padding*2>width)throw Error('Sprite too wide: '+file);
    if(x+png.width+padding>width){x=padding;y+=rowH+padding;rowH=0;}
    packed.set(file,{png,x,y});x+=png.width+padding;rowH=Math.max(rowH,png.height);
  }
  const item=packed.get(file);
  regions[name]={x:item.x,y:item.y,width:item.png.width,height:item.png.height,file};
}
const height=y+rowH+padding, sheet=new PNG({width,height});
for(const {png,x,y} of packed.values())PNG.bitblt(png,sheet,0,0,png.width,png.height,x,y);
const data=PNG.sync.write(sheet);
for(const file of ['production-spritesheet.png','environment-assets.png'])fs.writeFileSync('assets/art/dark-room/'+file,data);
const path='src/js/assets/darkRoomAtlas.js';
let source=fs.readFileSync(path,'utf8').replace(/export const SHEET_WIDTH = \d+;/,`export const SHEET_WIDTH = ${width};`)
  .replace(/export const SHEET_HEIGHT = \d+;/,`export const SHEET_HEIGHT = ${height};`)
  .replace(/export const darkRoomAtlas = \{[\s\S]*?\n\};/,`export const darkRoomAtlas = ${JSON.stringify(regions,null,2)};`);
fs.writeFileSync(path,source);
fs.writeFileSync('assets/art/dark-room/darkRoomAtlas.json',JSON.stringify({sheet:'assets/art/dark-room/production-spritesheet.png',width,height,sprites:regions},null,2)+'\n');
console.log(`Packed ${packed.size} images, ${Object.keys(regions).length} regions: ${width} × ${height}`);
