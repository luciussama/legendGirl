/** Convite depois do pesadelo: o receio dá lugar à curiosidade, sem exigir cliques para continuar. */
export const BRINQUEDAO_INTRO = Object.freeze(
  [
    {
      speaker: 'Narrador',
      text: 'O grito tinha passado.\nO medo, ainda não.',
      duration: 5,
      pose: 0,
    },
    {
      speaker: 'Yuna',
      text: 'Eu não gostei daquele sonho…',
      duration: 5,
      pose: 0,
    },
    {
      speaker: 'Nanda',
      text: 'Já passou, Yuna. Estou aqui com você.',
      duration: 5,
      pose: 0,
    },
    {
      speaker: 'Nanda',
      text: 'Vamos ao Brinquedão? A gente pode correr pelas pontes e voar nos tobogãs!',
      duration: 7,
      pose: 1,
    },
    {
      speaker: 'Yuna',
      text: 'Você vai comigo?',
      duration: 4,
      pose: 1,
    },
    {
      speaker: 'Nanda',
      text: 'Até o último escorregador!',
      duration: 4,
      pose: 2,
    },
    {
      speaker: 'Narrador',
      text: 'Naquele convite cabia\num pouquinho de coragem.',
      duration: 5,
      pose: 2,
    },
  ].map(Object.freeze),
);
/** Encerramento canônico no gramado acolhedor: Yuna boceja e dorme, Nanda se aninha junto a ela. */
export const BRINQUEDAO_ENDING = Object.freeze(
  [
    {
      id: 'END_0',
      speaker: 'Narrador',
      text: 'O último tobogã tinha ficado para trás.\nAs pernas pesavam, mas o coração estava leve.',
      duration: 5.5,
      pose: 2,
      shot: [890, 580, 1.0, 1.06],
    },
    {
      id: 'END_1',
      speaker: 'Nanda',
      text: 'Você foi muito corajosa hoje, Yuna.\nAgora pode descansar.',
      duration: 6.0,
      pose: 1,
      shot: [895, 590, 1.15, 1.22],
    },
    {
      id: 'END_2',
      speaker: 'Narrador',
      text: 'O sono veio como um abraço bom.\nE a fadinha dobrou as asas para sonhar junto.',
      duration: 7.0,
      pose: 2,
      shot: [900, 600, 1.28, 1.36],
    },
    {
      id: 'END_3',
      speaker: 'BRINQUEDÃO CONCLUÍDO',
      text: 'Entre uma ponte e um escorregador,\no dia voltou a caber num sorriso.',
      duration: 6.5,
      pose: 3,
      shot: [900, 605, 1.35, 1.45],
      fade: true,
    },
  ].map(Object.freeze),
);

/** Um gesto avança somente a fala atual; a entrada não vaza para o primeiro salto. */
export function advanceBrinquedaoStory(s) {
  if (s.stage === 'INTRO') {
    if (s.story.index < BRINQUEDAO_INTRO.length - 1) {
      s.story.index++;
      s.story.age = 0;
    } else {
      s.stage = 'RUNNING';
      s.age = 0;
      s.player.jumpHeld = true;
      s.story.age = 0;
    }
    return true;
  }
  if (s.stage === 'COMPLETE') {
    const endingIdx = s.story.endingIndex ?? 0;
    if (endingIdx < BRINQUEDAO_ENDING.length - 1) {
      s.story.endingIndex = endingIdx + 1;
      s.story.endingAge = 0;
    } else {
      s.story.endingDone = true;
    }
    return true;
  }
  return false;
}
