/** Quadros narrativos fora da jogabilidade; o nome só aparece na fala de Nanda. */
const card=(speaker,text,duration)=>Object.freeze({speaker,text,duration});
export const GARDEN_OPENING=Object.freeze([
  card('UM DIA NO JARDIM','A porta se abriu para uma manhã cheia de coisas.\nO sol aquecia o último degrau.',5),
  card('NANDA','Vamos, Yuna, vamos no piquenique, vai ser divertido!',5),
  card('UM PRIMEIRO PASSO','Yuna.\nSeu nome atravessou a porta antes dos seus pés.',5),
  card('UM PRIMEIRO PASSO','Ela queria o piquenique, os amigos, o pão quentinho.\nMas o jardim chegava todo de uma vez.',6),
  card('UM PRIMEIRO PASSO','A grama roçava suas pernas. As pedrinhas faziam cada passo parecer diferente.\nUm inseto levantou voo, e seus ombros subiram junto.',8),
  card('UM PRIMEIRO PASSO','Dentro dela, a alegria dava pulinhos.\nO medo também.',5),
  card('YUNA','Eu quero ir… mas o jardim faz tanta coisa ao mesmo tempo.',5),
  card('NANDA','Então vamos um pedacinho de cada vez. Eu vou com você.',5),
  card('UM PRIMEIRO PASSO','A vontade de ir e a vontade de ficar couberam no mesmo passo.\nE ela desceu.',6)
]);
export const GARDEN_ENDING=Object.freeze([
  card('UM LUGAR PARA DESCANSAR','Quando a toalha apareceu, Yuna soltou um suspiro comprido.\nTinha trazido o jardim inteiro nas pernas.',6),
  card('UM LUGAR PARA DESCANSAR','Sentou-se devagar entre os amigos.\nPor um instante, só ficou ali, sentindo o chão quietinho debaixo dela.',6),
  card('YUNA','Cheguei… mas minhas pernas ainda estão correndo.',5),
  card('NANDA','Então deixa que elas descansem. Hoje eu sento aqui.',5),
  card('UM LUGAR PARA DESCANSAR','Nanda pousou ao seu lado e dobrou as perninhas.\nPara ela havia um pão do tamanho de sua mãozinha e um copinho de suco miudinho.',8),
  card('UM LUGAR PARA DESCANSAR','Um piquenique inteiro cabia naquele pedacinho de toalha.\nYuna segurou seu pão.',5),
  card('YUNA','O jardim foi bonito. E foi muito.',4),
  card('NANDA','Eu sei.',3),
  card('UM LUGAR PARA DESCANSAR','As folhas continuaram conversando lá no alto.\nO pão estava morno. O suco, fresquinho.',6),
  card('UM LUGAR PARA DESCANSAR','Por enquanto, Yuna não precisava dar mais nenhum passo.\nFicou ali, comendo devagar, com a fada sentada ao seu lado.',8),
  card('MAIS UM PEDACINHO','Veio outro pão na chapa. E mais um gole de laranja.\nNa toalha, a tarde foi ficando macia.',7),
  card('A TARDE FECHOU OS OLHOS','A barriga ficou quentinha. As pálpebras, pesadas.\nYuna tentou guardar um último sorriso.',7),
  card('A TARDE FECHOU OS OLHOS','O sono chegou sem fazer barulho.\nNanda dobrou as asas e se aconchegou ao lado dela.',7),
  card('UM JARDIM POR DENTRO','Lá fora, o jardim continuou do mesmo tamanho.\nDentro do sonho, uma folha já podia ser floresta.',7)
]);
export const GARDEN_OPENING_DURATION=GARDEN_OPENING.reduce((sum,c)=>sum+c.duration,0);
export function gardenNarrativeCard(cards,age){
  let elapsed=0;
  for(const c of cards){elapsed+=c.duration;if(age<elapsed)return c;}
  return cards.at(-1);
}
