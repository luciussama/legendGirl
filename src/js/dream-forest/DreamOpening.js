/** Abertura autorada: leitura pode encurtar uma fala, mas preserva o mínimo de atuação. */
export const DREAM_OPENING_BEATS=Object.freeze([
 {shot:'lost',duration:3,min:3},
 {shot:'discover',speaker:'Narrador',text:'Ao olhar para trás, Yuna encontrou Nanda.\nEstranhamente, a fadinha tinha o mesmo tamanho que ela.',duration:6,min:2},
 {shot:'shake',speaker:'Yuna',text:'Nanda, onde estamos? Está frio aqui.',duration:7,min:3},
 {shot:'wait',duration:3,min:3},
 {shot:'plead',speaker:'Yuna',text:'Nanda, estou com medo! Me fale como sair daqui.',duration:7,min:3},
 {shot:'alone',speaker:'Narrador',text:'Sem a orientação da irmã fadinha, Yuna se sentiu perdida.\nSem escolha, decidiu seguir em frente e deixar Nanda dormindo.',duration:8,min:3},
 {shot:'leave',duration:4,min:4}
].map(Object.freeze));
/** Consulta a atuação e o quadro atuais pelo relógio persistido, sem avançar a simulação. */
export function dreamOpeningBeat(s){return DREAM_OPENING_BEATS[s.story.opening.index];}
/** Um gesto dispensa apenas a fala visível; o movimento obrigatório termina pelo próprio relógio. */
export function advanceDreamOpening(s){const o=s.story.opening,beat=dreamOpeningBeat(s);if(!beat.text||o.dismissed)return false;o.dismissed=true;return true;}
/** Começa a travessia somente após Yuna decidir e caminhar, sem herdar comandos da leitura. */
export function stepDreamOpening(s,input,seconds){const o=s.story.opening,beat=dreamOpeningBeat(s);o.age+=seconds;o.time+=seconds;if(input.advance)advanceDreamOpening(s);if(o.age<beat.duration&&!(o.dismissed&&o.age>=beat.min))return;const next=o.index+1;if(next<DREAM_OPENING_BEATS.length){s.story.opening={index:next,age:0,time:o.time,dismissed:false};return;}s.stage='RUNNING';s.age=0;s.story.opening=null;s.story.index=1;s.story.age=0;s.story.tutorial=true;s.player.jumpHeld=true;}
