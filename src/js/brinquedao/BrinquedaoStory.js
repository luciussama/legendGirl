/** Convite depois do pesadelo: o receio dá lugar à curiosidade, sem exigir cliques para continuar. */
export const BRINQUEDAO_INTRO=Object.freeze([
 {speaker:'Narrador',text:'O grito tinha passado.\nO medo, ainda não.',duration:5,pose:0},
 {speaker:'Yuna',text:'Eu não gostei daquele sonho…',duration:5,pose:0},
 {speaker:'Nanda',text:'Já passou, Yuna. Estou aqui com você.',duration:5,pose:0},
 {speaker:'Nanda',text:'Vamos ao Brinquedão? A gente pode escorregar e mergulhar nas bolinhas!',duration:7,pose:1},
 {speaker:'Yuna',text:'Você vai comigo?',duration:4,pose:1},
 {speaker:'Nanda',text:'Até o último escorregador!',duration:4,pose:2},
 {speaker:'Narrador',text:'Naquele convite cabia\num pouquinho de coragem.',duration:5,pose:2}
].map(Object.freeze));
/** Um gesto avança somente a fala atual; a entrada não vaza para o primeiro salto. */
export function advanceBrinquedaoStory(s){if(s.stage==='INTRO'){if(s.story.index<BRINQUEDAO_INTRO.length-1){s.story.index++;s.story.age=0;}else{s.stage='RUNNING';s.age=0;s.player.jumpHeld=true;s.story.age=0;}return true;}if(s.stage==='COMPLETE'&&!s.story.endingDone){s.story.endingDone=true;return true;}return false;}
