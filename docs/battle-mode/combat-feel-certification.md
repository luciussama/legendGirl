# Certificação de sensação de combate — Prompt 19A

**Implementação automática: parcial aprovada. Certificação humana final: PENDENTE.**

O código agora emite sons de combate, feedback visual de dano e uma pausa/tremor limitados. Isso fecha lacunas funcionais anteriores, mas não prova satisfação, clareza perceptiva, qualidade da arte da mão/espada nem desempenho em hardware.

## Resultado por critério

| Critério | Resultado | Evidência |
| --- | --- | --- |
| Sincronização lógica de dano e confirmação | PASS automatizado, escopo limitado | Som de acerto, registro de impacto e reação iniciam na mesma atualização; suíte focada confirma. Latência física não medida. |
| Eventos de áudio de combate | IMPLEMENTADO; aprovação auditiva pendente | Perfis sintetizados por ação e ator, inclusive hit, death, Enrage, eventos de arena e corações. |
| Reação visual sem consultar HP | IMPLEMENTADO; aprovação perceptiva pendente | Flash, pose/reação, recuo visual e burst em impacto válido. |
| Pausa e tremor | Implementados com limites | Pausa de 1 quadro comum/2 chefe; tremor na arena por 10 quadros; sem mudança de posição física. |
| Justiça de Rocket Punch | PASS automatizado, escopo limitado | Casos de distância/borda e 886 amostras de poses preservam contato visível. |
| Justiça de Laser Beam | PASS automatizado, escopo limitado | Testes existentes de em pé, agachamento, borda e salto. |
| Justiça de Toy Leap | PASS automatizado, escopo limitado | Sem dano no caso de 154,9 com lacuna visível; dano mantido em sobreposição a 110. Alcance reduzido de 155 para 118. |
| Integração da mão à espada | PENDENTE | A batalha agora usa os quadros extraídos do conceito, com mão e espada integradas nas poses de ataque. A inspeção humana no jogo ainda precisa confirmar a sensação de posse. |
| Cinco sessões humanas completas | PENDENTE | 0/5 sessões completas registradas nesta execução. |

## Evidência automatizada focada

- `node scripts/test-combat-impact.js` valida som de ataque/acerto, quadro de impacto, estado de reação, hit pause, assinatura dos nove ataques e peso aumentado do Urso.
- `node scripts/review-toy-leap-fairness.js --strict` valida os casos de sobreposição e de vão visual.
- `npm run test:battle:fairness` passou para Rocket Punch/Laser Beam e 886 poses sem divergências entre máscara visual, projeção e dano.
- As âncoras dos quadros conceituais agora mantêm separadas a coordenada em pixels da imagem e a coordenada escalada usada pelas projeções; o teste de laser verifica 100 impactos em pé, 100 esquivas agachadas, 100 contatos de borda e amostras de salto.
- Os seis retestes obrigatórios passaram nesta revisão: `npm test`, `npm run test:toy-room:qa`, `npm run test:toy-room:battle`, `npm run test:battle:polish`, `npm run test:battle:fairness` e `npm run build`. A campanha automatizada completa passou em múltiplos passos de simulação; não substitui playtest humano.

Nenhum teste automatizado responde às perguntas humanas de percepção ou satisfação.

## Playtest obrigatório

O [relatório de playtest humano](human-playtest-report.md) preserva os achados fornecidos e registra explicitamente 0/5 sessões concluídas nesta etapa. Não há respostas inventadas para ataque mais forte/fraco, golpes confusos, injustiça, feedback perdido/duplicado, reação atrasada ou áudio.

## Rollback e decisão

A pausa e o tremor são pequenos e limitados; o teste determinístico confirma pausa de no máximo dois quadros. Ainda assim, reverter qualquer ajuste caso as sessões encontrem atraso, piora de justiça/clareza, distração auditiva ou queda de performance. Efeitos não desenham hitboxes nem guias sobre as superfícies.

**Aprovação final: PENDENTE.** Não certificar o encontro como “jogo de luta completo” até revisar visualmente a posse da espada, executar cinco campanhas humanas, registrar reclamações e validar áudio/performance no ambiente de jogo.
