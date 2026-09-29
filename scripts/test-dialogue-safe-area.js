import assert from 'node:assert/strict';
import { intersectCanvasSafeArea, getDialogueBoxY } from '../src/js/ui/DialogueSafeArea.js';
const canvas={width:540,height:1200};
const rect={left:0,top:0,width:390,height:866.6666666667};
const safe=intersectCanvasSafeArea(canvas,rect,{left:0,top:0,width:390,height:740},{top:47,bottom:34});
assert.ok(Math.abs(safe.bottom-706*1200/rect.height)<0.001,'Barra do navegador e home indicator excluídos');
assert.equal(safe.left,0,'Borda esquerda sem notch');
const landscape=intersectCanvasSafeArea({width:1200,height:540},{left:0,top:0,width:844,height:390},
  {left:0,top:0,width:844,height:390},{left:47,right:47,bottom:21});
assert.ok(landscape.left>0&&landscape.right<1200,'Notch e margem lateral em paisagem');
const insetCanvas=intersectCanvasSafeArea({width:760,height:500},{left:42,top:20,width:760,height:500},
  {left:0,top:0,width:844,height:600},{left:30,right:30,bottom:21});
assert.equal(insetCanvas.left,0,'Canvas já dentro da área segura não recebe inset duplicado');
assert.equal(insetCanvas.bottom,500,'Canvas inteiramente visível preservado');
console.log('Área segura narrativa: viewport reduzido, notch lateral e canvas deslocado aprovados.');

const area={left:0,right:540,top:0,bottom:1000,marginY:20};
assert.equal(getDialogueBoxY(area,120,12,{top:400,bottom:450},true),480,'Legenda próxima e abaixo da personagem');
assert.equal(getDialogueBoxY(area,120,12,{top:750,bottom:800},true),600,'Legenda acima quando falta espaço inferior');
assert.equal(getDialogueBoxY(area,120,12,{},true),720,'Reserva inferior móvel de 16%');
assert.equal(getDialogueBoxY(area,120,12,{},false),860,'Posição anterior preservada no desktop');
