# Validação dos sprites de combate — Prompt 14

**Resultado do pacote: FAIL. Não homologado para integração.**

## Segunda remediação — Prompt 14B

O [gate do Prompt 15 v2](battle-integration-report.md) foi executado e permaneceu **FAIL**. A produção foi retomada, com duas novas tentativas reprovadas de apoio oposto do Robô e nova antecipação de Steam Blast, agora em REVISÃO. Os [resultados de produção](gate-production-attempts.md) e a [decisão de integração](integration-approval.json) registram que nenhuma integração foi autorizada.

A [correção localizada da biela](train-rod-correction.md) substituiu posteriormente o ciclo do Trem no candidato: seis fases de pinos excêntricos agora deslocam a biela ao redor dos eixos. Train Walk passou de FAIL para REVISÃO, sem homologação do pacote.

**Resultado: FAIL. Prompts 15 e 16 continuam bloqueados.** Foram produzidas sete novas pranchas em `assets/art/toy-room/battle/remediation/`, com manifesto separado e referências corporais explícitas. A verificação técnica passou para 144 PNGs e 26 sequências. Robot Walk, Train Walk, Rocket Punch e Steam Blast ainda impedem homologação; continuidade e escala final permanecem pendentes. O modelo de ataques físicos e de emissão segue a autorização do Prompt 14B.

O [relatório da segunda remediação](combat-remediation-report.md) registra os resultados, as tentativas descartadas e os limites da revisão. A página `/tests/combat-remediation-review.html` apresenta animações, duas escalas e montagens de transição. Não houve integração ao gameplay nem aprovação automática baseada no teste técnico.

## Revalidação após o Prompt 14A

**Resultado atual: FAIL**, tanto para o manifesto original quanto para o candidato de correções. A avaliação abaixo desta seção conserva o registro da primeira execução. A autorização posterior do Prompt 14A substitui o critério de emissão: Steam Blast e Laser Beam precisam comunicar intenção de emitir/disparar sem efeitos; não precisam revelar qual substância ou feixe será emitido. Ataques físicos continuam exigindo identificação da ação sem efeitos.

Foram executadas novamente as verificações dos dois manifestos: 144 PNGs originais e 146 PNGs do candidato, ambos com 26 sequências. As verificações técnicas passaram. Foram reinspecionadas as pranchas corrigidas de Robot Walk, Rocket Punch, Laser Beam, Train Walk e Dinosaur Rush; os demais resultados visuais permanecem os registrados no [relatório de correção](combat-correction-report.md), sem nova aprovação automática.

| Pergunta obrigatória | Resultado atual |
| --- | --- |
| O ataque é legível? | Parcialmente. Rocket Punch e Rush comunicam suas ações, mas Front Charge e a antecipação de emissão ainda têm reprovações ou pendências. |
| O movimento é legível? | Não em todo o pacote: Walk do Robô repete a mesma fase dominante; a biela do Trem não mantém sincronização coerente entre pinos. |
| Existe teletransporte visual? | Há um defeito de âncora no candidato de Rocket Punch: o centro do recorte muda com a extensão do punho, deslocando a referência do corpo. A ausência de outros saltos não foi certificada. |
| Existe pose congelada? | Não há cópias exatas nos manifestos testados. Há repetição perceptiva de fase no Walk do Robô; desenhos diferentes não bastam para aprovar o ciclo. |
| O golpe parece um golpe? | Rocket Punch, Bite e ações corporais do Urso têm leitura presente. Front Charge ainda não tem lançamento inequívoco em escala pequena. |
| O jogador entende a ação sem efeitos? | Não para o conjunto. Para emissão, a pergunta agora é sobre intenção de disparo; Steam Blast permanece reprovado e Laser Beam permanece em revisão. |

**Reprovação imediata confirmada:** ciclo de locomoção insuficiente do Robô e inconsistência artística de Rocket Punch. A sincronização mecânica do Trem e o defeito de âncora também impedem homologação. Rush ganhou distinção de Bite por manter mandíbula fechada e enfatizar impulso corporal, mas sua continuidade permanece pendente.

Não houve nova execução integral da revisão animada em todas as transições nesta revalidação. A revisão em escala pequena anterior usa uma hipótese de apresentação, pois os sprites não estão integrados à arena. Clipping ilustrado e continuidade de todas as transições continuam sem certificação; não devem ser anunciados como aprovados. A reprovação do pacote já é conclusiva pelos defeitos confirmados, sem transformar itens não medidos em PASS.

## Método e alcance

Inspeção visual das pranchas de origem, comparação com `environment-sheet.png` e `retro-robot-v1.png`, revisão das amostras da prévia do Prompt 13 e nova execução de `npm run verify:battle-sprites`. Foram examinadas as 26 sequências declaradas no manifesto. Somente os quatro quadros internos de cada sequência do Dinossauro pertencem à entrega; os quadros externos descartados não contam como clipping do pacote.

A leitura sem efeitos foi avaliada pela pose corporal e pela sucessão dos desenhos, desconsiderando visualmente vapor, poeira, brilho e feixe. Não foi produzida uma variante raster com efeitos removidos. Isso permite reprovar a dependência evidente de efeitos, mas não constitui teste de compreensão com jogadores. Também não houve medição temporal de teletransporte em todas as sequências, nem validação no gameplay: o pacote ainda não está integrado.

## Respostas obrigatórias

| Pergunta | Resposta |
| --- | --- |
| O ataque é legível? | Parcialmente. Mordida, abraço, salto e punho extensível têm ações corporais reconhecíveis. Vapor, laser e investida do Trem não passam no critério sem efeitos. |
| O movimento é legível? | Parcialmente. Há mudanças de membros e poses; o ciclo do Robô apresenta várias passadas com a mesma perna à frente e não demonstra alternância convincente. |
| Existe teletransporte visual? | Não foi certificado como ausente. O alinhamento entre sequências e a continuidade temporal precisam de revisão dedicada; âncoras finitas não provam continuidade. |
| Existe pose congelada? | Não há duplicação exata nos quadros exportados. Isso não exclui imobilidade perceptiva: diferenças de textura, expressão e pequenos deslocamentos não bastam para aprovar locomoção. |
| O golpe parece um golpe? | Alguns sim; Front Charge não apresenta preparação e impulso corporal suficientemente distintos da locomoção. |
| O jogador entende o golpe sem precisar ver efeitos especiais? | **NÃO para todo o pacote. Logo, FAIL.** Steam Blast e Laser Beam perdem a identificação do ataque específico sem seus efeitos. |

O critério literal do Prompt 14 também se aplica a ataques cuja identidade é vapor ou laser: não foi criada uma exceção para aprová-los. As correções devem melhorar a antecipação corporal sem trocar o repertório aprovado.

## Avaliação por sequência

“Leitura presente” indica que os desenhos comunicam a ação; não significa homologação completa de continuidade temporal ou identidade artística.

| Personagem | Sequência | Resultado visual | Evidência / pendência |
| --- | --- | --- | --- |
| Trem | Idle | Leitura presente | Repouso com pequenas variações; não representa deslocamento. |
| Trem | Walk | Revisar | Biela muda de posição, mas o ciclo de rodas e a conexão mecânica precisam de continuidade mais clara em animação. |
| Trem | Steam Blast | **FAIL** | A nuvem comunica o ataque; a mudança do corpo não permite identificar o disparo sem vapor. |
| Trem | Front Charge | **FAIL** | Corpo próximo do Walk; poeira assume a indicação de impulso. Falta preparação e projeção frontal inequívoca. |
| Trem | Hit | Leitura presente | Inclinação e desequilíbrio diferentes do repouso. |
| Trem | Death | Leitura presente | Inclinação progressiva, chaminé caída e colapso. |
| Robô | Idle | Leitura presente | Repouso reconhecível, pequenas mudanças de inclinação. |
| Robô | Walk | **FAIL** | Vários quadros repetem a mesma fase de passada; alterações no desenho não formam alternância convincente de apoio. |
| Robô | Laser Beam | **FAIL** | Sem feixe e brilho, a pose não diferencia claramente emissão ofensiva de guarda. |
| Robô | Rocket Punch | **FAIL** | Extensão e retorno do punho são legíveis sem brilho, mas contorno preto espesso e acabamento mais gráfico destoam do robô de referência e das outras sequências. |
| Robô | Hit | Leitura presente | Recuo, desequilíbrio e mudança de expressão comunicam dano. |
| Robô | Death | Leitura presente | Ajoelhamento e queda progressiva até ficar deitado. |
| Dinossauro | Idle | Leitura presente | Repouso; identidade nova autorizada, ainda sujeita à aprovação artística do conjunto. |
| Dinossauro | Walk | Leitura presente | Pés mudam de apoio e corpo acompanha a passada; continuidade do ciclo precisa de revisão temporal. |
| Dinossauro | Bite | Leitura presente | Abertura da boca, avanço da cabeça e fechamento comunicam mordida sem efeitos. |
| Dinossauro | Rush | Revisar | Inclinação e extensão das pernas indicam avanço, mas a boca aberta também sugere Bite. Diferenciar antecipação e impulso da mordida sem acrescentar ataque. |
| Dinossauro | Hit | Leitura presente | Recuo da cabeça e perda de apoio comunicam reação. |
| Dinossauro | Death | Leitura presente | Cabeça e corpo cedem até repousar no chão. |
| Urso | Idle | Leitura presente | Repouso sentado e pequenas mudanças de expressão. |
| Urso | Walk | Leitura presente | Membros e apoio mudam; revisar em especial a ligação entre repouso sentado e caminhada em pé. |
| Urso | Bear Hug | Leitura presente | Braços abrem, fecham em abraço e soltam, sem necessidade de efeitos. |
| Urso | Belly Charge | Leitura presente | Inclinação, barriga projetada e passada comunicam investida; continuidade deve ser medida. |
| Urso | Toy Leap | Leitura presente | Agachamento, elevação, recolhimento e aterrissagem têm progressão corporal clara. |
| Urso | Hit | Leitura presente | Recuo e desequilíbrio comunicam impacto recebido. |
| Urso | Enrage | Leitura presente | Expressão, punhos e braços levantados distinguem fúria de repouso. Não implica novo golpe. |
| Urso | Death | Leitura presente | Corpo cede progressivamente até ficar deitado. |

## Clipping e identidade

A verificação dos PNGs exportados encontrou margem transparente e conteúdo em todos os arquivos. Isso confirma ausência de contato do conteúdo visível com a borda do PNG, **não** certifica que todo apêndice ou efeito tenha sido desenhado completo: uma imagem previamente cortada pode receber padding e passar nesse teste. Os quadros externos cortados do Dinossauro foram excluídos da entrega.

A identidade cromática de Trem e Urso é reconhecível em relação ao atlas original. A nova identidade do Dinossauro foi autorizada, mas não há referência original dele para comparar. O **Rocket Punch está reprovado por inconsistência de técnica/acabamento**, embora preserve cores e componentes do Robô. Os recursos da menina e do quarto não foram alterados; este pacote não contém animações novas de espada da protagonista, portanto não valida esse ataque.

## Correções necessárias antes de nova homologação

1. Refazer o Walk do Robô com apoio esquerdo/direito, passagem, transferência de peso e fechamento do ciclo reconhecíveis.
2. Harmonizar Rocket Punch com os contornos, textura, proporções e sombreamento da referência original; preservar a extensão legível do punho.
3. Dar a Front Charge uma antecipação e projeção corporal que diferenciem ataque de caminhada sem poeira.
4. Dar a Steam Blast e Laser Beam antecipação corporal inequívoca de emissão; reaplicar a pergunta sem efeitos, sem aprovar apenas porque o ataque usa vapor/laser.
5. Rever Walk do Trem e Rush do Dinossauro; comparar poses de preparação, execução e recuperação com os demais movimentos do mesmo personagem.
6. Reproduzir quadro a quadro com âncora e escala de destino; avaliar ciclos e transições Idle → Walk → Attack → Hit, além de Death e Toy Leap. Medir deslocamentos do corpo, conferir apêndices e revisar em escala pequena. Não confundir uma mudança física intencional com erro de alinhamento.

Esta validação registra reprovações; não regenera sprites nem altera regras de combate. Nenhum resultado técnico anterior deve ser apresentado como aprovação artística do Prompt 14.
