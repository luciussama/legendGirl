# Certificação de justiça e encerramento de defeitos — Prompt 18

**Resultado: FAIL. A certificação final não foi concedida.** As correções locais de Rocket Punch, laser e transmissão do Trem foram aceitas no alcance verificado. Robot Walk continua reprovado após descarte das duas alternativas, e a área de impacto de Toy Leap ainda não tem representação correspondente. Não seria correto transformar o PASS das suítes funcionais em encerramento desses defeitos.

## Protocolo e alcance

Os defeitos foram tratados em passes separados, com os seis comandos exigidos após cada passe: `npm test`, `npm run test:toy-room:qa`, `npm run test:toy-room:battle`, `npm run test:battle:polish`, `npm run test:battle:fairness` e `npm run build`. Os [registros por defeito](certification-evidence/) conservam as repetições em subdiretórios `pass-*`. A exceção autorizada pelo usuário foi aplicada somente às divergências preexistentes de Rocket Punch/laser nos primeiros passes. Os passes posteriores do protocolo terminaram sem essa exceção.

A inspeção no Chrome utilizou `/tests/battle-gameplay.html`, com desenho real da fase, animação, pausa e avanço de um quadro. O segundo canvas amplia o desenho já produzido pela arena; não substitui a personagem por uma prancha. A revisão incluiu a campanha por inputs, antecipações sem efeitos ativos, punho durante impacto, agachamento e fases do Rush. Isso é revisão de QA, não teste de compreensão com participantes humanos nem certificação de aparelhos Android físicos.

## Decisão por defeito

| Defeito | Decisão do passe | Estado da certificação / evidência |
| --- | --- | --- |
| DEFECT-001 — Robot Walk | **ROLLED BACK** | **FAIL.** A prancha candidata conserva a perna dominante e gesto semelhante a ataque. A alternativa articulada alterna apoios numericamente, mas apresenta recortes nas junções dos pés em ampliação. Ambas foram descartadas; o ciclo anterior permanece. |
| DEFECT-002 — Rocket Punch | **FIXED no alcance testado** | A mola e a luva pintadas são projetadas sem mover a referência do torso. A bateria exigida contém 100 ataques próximos, 100 no limite e 50 de borda. O passe DEFECT-008 ampliou a verificação para a silhueta efetiva de cada pose. |
| DEFECT-003 — Laser Beam / agachamento | **FIXED no alcance testado** | Feixe a 85 unidades do chão; pose baixa própria de 80 unidades. Foram aprovados 100 impactos em pé, 100 esquivas agachadas, 100 contatos de borda e 36 casos de salto. Os pixels da pose baixa não atravessam o feixe. |
| DEFECT-004 — Train Walk | **FIXED no alcance testado** | Rodas e pinos usam a mesma fase. A biela mantém comprimento e raio excêntrico; 169 amostras geométricas e revisão em gameplay/ampliação passaram. |
| DEFECT-005 — Steam Blast | **PROVEN ACCEPTABLE na inspeção de QA** | A válvula frontal abre antes da emissão. A preparação no quadro 37 foi examinada sem vapor, em duas escalas; a intenção de emitir é reconhecível na inspeção. Não se afirma compreensão humana certificada. |
| DEFECT-006 — Laser Beam / antecipação | **PROVEN ACCEPTABLE na inspeção de QA** | Palma aberta, braço em mira e base firme precedem o feixe. Preparação no quadro 36 examinada em gameplay e ampliação, sem laser. |
| DEFECT-007 — Dinosaur Rush | **PROVEN ACCEPTABLE nas amostras de QA** | Quadros 36, 54 e 63 mostram compressão e avanço das pernas com mandíbula fechada. As duas poses ativas duram nove quadros cada; não houve alteração de velocidade ou janelas. A inspeção local não certifica todas as transições do pacote. |
| DEFECT-008 — justiça final da menina em 2× | **CERTIFICAÇÃO REPROVADA** | Rocket Punch foi corrigido também por pose; 886 amostras passaram. **Toy Leap mantém uma divergência confirmada**, descrita abaixo. Não há encerramento global deste defeito. |

A decisão explícita de reprovação do DEFECT-008 não é um quarto tipo de aprovação nem uma exceção às regras do usuário: registra que o objetivo de fechar todos os defeitos ainda não foi alcançado. Nenhuma publicação foi aprovada.

## Rocket Punch: correção e ampliação dos testes

A redução de alcance já rejeitada no Prompt 17 não foi retomada. O alcance continua 280, com tolerância posterior de -35 e os mesmos tempos ofensivos. O desenho utiliza a mola e a luva do sprite existente, mantendo cabeça, torso, pernas e escala. A mola liga o ponto original do braço à luva; a projeção considera as linhas opacas do quadro efetivamente apresentado da menina.

O teste inicial de envelope fixo passou, mas não certificava todas as poses. A revisão ampliada encontrou 66 divergências em 135 amostras. Essa constatação motivou o ajuste específico de apresentação do DEFECT-008, sem alterar a colisão ou a eficácia do inimigo. A altura máxima opaca do punho foi alinhada a 89 unidades, permitindo que a apresentação concorde com o limite de esquiva por salto já existente.

A bateria final verifica **886 amostras**: 636 combinações de idle, corrida, agachamento, oito quadros de ataque, salto baixo e salto de esquiva, com ambos os sentidos do Robô e da menina; mais 100 ataques próximos, 100 no limite máximo e 50 de borda. O [resultado por amostra](certification-evidence/DEFECT-008/pose-contact.json) termina com zero divergências. O conteúdo alfa usa limiar 128; os intervalos por linha representam a silhueta e não certificam subpixels de filtragem ou cada detalhe transparente interno.

Ao adicionar casos de tangência exata, surgiu uma comparação falsa em 280 por arredondamento numérico. O candidato foi restaurado à versão anterior; o diagnóstico recebeu tolerância de 1e-8 para separar tangência de sobreposição, e a correção foi reaplicada e revalidada. Isso não altera alcance, dano ou tolerância da simulação.

## Laser e pose baixa

A menina conserva a ampliação 2× na arena. A defesa utiliza uma nova pose baixa, com proporções naturais, e a espada mantém movimento durante ataques agachados. Exploração e atlas original não foram substituídos. O deslocamento visual do salto considera o ponto opaco dos pés do quadro apresentado; a física continua usando os valores anteriores.

As extremidades do feixe consideram o mesmo quadro da personagem e o sentido apresentado, sem mudar a região lógica de -35 a 340. A apresentação reserva altura de arena com divisor 400 para acomodar a trajetória visual do salto. A câmera lógica permanece fixa e a proporção 2× da menina em relação aos inimigos continua preservada.

## Transmissão do Trem

Uma camada pintada sem a biela antiga fornece o corpo e as superfícies das rodas. A barra vermelha e os pinos dourados são recortes da arte anterior. Os dois pinos percorrem círculos de raio 45 nas coordenadas dessa camada, com a mesma fase e ciclo de 42 quadros. A distância entre centros, e portanto entre pinos, permanece constante: `hypot(403, 33)`.

O desenho gira a textura das rodas e posiciona a barra entre os pinos. Não usa linha técnica ou marcador de hitbox para representar a biela. A revisão no Chrome examinou os quadros 7 e 21; o teste inclui o fechamento em 42. Tempos da IA, deslocamento lógico e ataques do Trem não foram alterados.

## Bloqueio confirmado: Toy Leap

No quadro 84, a menina a **154,9 unidades** recebe dano, indo de 3 para 2 HP. O extremo opaco do Urso está a aproximadamente 62,88 unidades da referência corporal; mesmo usando o envelope mais favorável da menina, resta uma separação de **36,93 unidades**. Não existe efeito de impacto desenhado nesse golpe que comunique a extensão da área de dano.

O [registro reproduzido](certification-evidence/DEFECT-008/toy-leap-contact.json) confirma a pendência já indicada no Prompt 17. Essa distância é um limite inferior conservador: um envelope por quadro pode ser mais largo que os pixels na mesma altura. Não foi reduzido o alcance de 155 para encobrir a divergência; isso exigiria validar novamente o balanceamento e poderia enfraquecer o chefe.

Para fechar este caso, a apresentação do impacto de aterrissagem precisa comunicar a área ofensiva existente e a esquiva, passando por teste de contatos nas bordas e saltos. Até essa produção e validação, **DEFECT-008 = FAIL**. Os testes restritos de Rocket Punch e laser não cobrem essa área do chefe.

## Regressões e comparação

A campanha da cena da espada até o final continuou concluível, com Trem → Robô → Dinossauro → Urso, 3 HP e recarga aprovada. Para dt 0,5 / 1 / 3, manteve 2326 / 1164 / 392 atualizações. A suíte iniciada com espada equipada manteve 2364 / 1183 / 400 / 104 atualizações para dt 0,5 / 1 / 3 / 12. Vitória após guardar o Urso, derrota, transferência de corações, limites de HP, Enrage e transições para a caixa permaneceram aprovados nas suítes.

No Chrome, a campanha real registrou 11 coletas, seis recargas de exploração e 1164 atualizações de batalha, com vitória e recarga. A nova apresentação carrega 146 imagens de combate: 144 do manifesto e duas camadas adicionais. O manifesto continua com 26 sequências. O teste técnico desses arquivos não homologa a arte integral.

Os seis comandos obrigatórios passaram na versão final. Esse resultado significa regressão aprovada no alcance das suítes, **não certificação de todos os ataques**: a falha independente de Toy Leap e a reprovação de Robot Walk impedem o PASS do Prompt 18. A correspondência completa da espada com todos os adversários e a avaliação de justiça com jogadores continuam necessárias.

Neste repositório, `npm run build` verifica referências para GitHub Pages; não gera um bundle ou diretório `dist`. A disponibilidade das novas imagens foi verificada também pelo carregamento e desenho no Chrome.

## Reprodução e recursos

- `node scripts/run-certification-pass.js DEFECT-008`: seis comandos e novos registros, preservando os anteriores.
- `node scripts/review-battle-pose-fairness.js --strict`: matriz ampliada de Rocket Punch, incluindo contatos exigidos.
- `node scripts/test-laser-fairness.js`: 336 casos de laser.
- `node scripts/test-train-drive.js`: transmissão mecânica e fechamento do ciclo.
- `node scripts/review-toy-leap-fairness.js --strict`: **FAIL esperado atualmente**; reproduz o bloqueio do impacto do chefe, não incluído na suíte restrita de punho/laser.
- `npm run dev`, seguido de `/tests/battle-gameplay.html`: campanha, ampliação, antecipação, punho, agachamento e biela.

Arte produzida pelo **image_gen integrado**, conforme a skill imagegen: [pose baixa](../../assets/art/toy-room/battle/certification/girl-low-crouch-v1.png), [camada do Trem](../../assets/art/toy-room/battle/certification/train-body-v1.png) e [tentativa descartada do Robô](../../assets/art/toy-room/battle/certification/robot-walk-rejected-v1.png). Os [prompts exatos](../../assets/art/toy-room/battle/certification/prompts.json) foram preservados. A alternativa articulada descartada permanece como fonte de evidência, sem consumo pelo jogo.
