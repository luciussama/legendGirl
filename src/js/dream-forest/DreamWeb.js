/** Contato do corpo da menina com a silhueta elíptica da aranha, incluindo a abertura das patas. */
export function dreamSpiderContact(frame,player){
  const cy=frame.spiderY+frame.spiderH*.5,dx=Math.max(0,Math.abs(player.x-frame.x)-16),dy=cy-Math.max(player.y-88,Math.min(player.y,cy));
  return (dx/(frame.spiderW*.5))**2+(dy/(frame.spiderH*.5))**2<=1;
}
/** O fio só pode ser agarrado no trecho existente, com espaço para os pés acima da aranha. */
export function dreamWebCanGrab(frame,gripY){return gripY>=100&&gripY<=frame.spiderY-96;}
