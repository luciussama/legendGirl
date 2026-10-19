import {scan} from './fisica-janelas-saltos.js';
const targets=[1167,850,750,650,420,310,280,250,220,180];
const returnTargets=[450,410,375,340,310,280,255,230,210,190,175,160,145,130,115,100];
const result=[];
for(const phase3 of [false,true])for(let target=0;target<(phase3?16:10);target++) {
 const before=scan(target,phase3),goal=(phase3?returnTargets:targets)[target];let best=null;
 if(!phase3&&target<2){best={speed:1.42,...before};}
 else {
  // A janela cresce a partir do menor alcance viável; busca nesse ramo evita sobresaltos de velocidade.
  let low=.05,high=.1;
  while(high<12&&scan(target,phase3,high).ms<goal){low=high;high+=.05;}
  for(let i=0;i<22;i++){const speed=(low+high)/2,value=scan(target,phase3,speed);if(value.ms<goal)low=speed;else high=speed;}
  best={speed:+high.toFixed(4),...scan(target,phase3,high)};
 }
 result.push({phase3,target,beforeMs:Math.round(before.ms),goalMs:goal,...best,ms:Math.round(best.ms)});
}
console.log(JSON.stringify(result,null,2));
