# Histórico de remediação — Prompt 17

Cada item é avaliado isoladamente. O manifesto anterior foi preservado em `assets/art/toy-room/battle/polish/baseline-manifest.json`; os parâmetros de combate não são alterados por produção de arte.

## Passe 01 — Robot Walk

**ROLLED BACK na revisão prévia.** Tentativa `polish/robot-walk-v1.png`, produzida por `imagegen` a partir da prancha atual. As poses A e C continuam com a bota próxima à câmera à frente; C também mantém gesto de braço semelhante a ataque. Não há alternância convincente. O candidato não foi promovido ao manifesto; o ciclo anterior permanece ativo. Os testes de gameplay após descarte permanecem aprovados.

## Passe 02 — Rocket Punch

**ACCEPTED como melhoria incremental de acabamento.** `polish/rocket-punch-v1.png` reforça textura de metal e sombreamento da referência; a extensão do punho permanece legível. Os seis recortes usam as mesmas referências corporais e `displayScale` da versão anterior. Tempos, alcance e lógica não mudaram. Verificação dos 144 PNGs, `npm test` e campanha no Chrome passaram. A batalha manteve 583 atualizações, ordem dos quatro inimigos, 3 HP e save/load. Observação do Rocket Punch na arena confirmou reprodução da extensão sem deslocar a âncora para o punho. Isso não encerra a homologação artística integral do pacote.

## Passe 03 — Train Walk

**ROLLED BACK na revisão prévia.** `polish/train-walk-v1.png` mantém órbita aparente, mas os dois pinos ainda não têm raio/posição coerentes em relação aos centros das rodas. A solicitação de cubos separados não foi atendida consistentemente. Não há ganho mecânico suficiente para substituir a correção anterior da biela. O manifesto mantém Train Walk original do candidato e Rocket Punch aceito no passe 02.

## Passe 04 — Steam Blast

**ACCEPTED.** `polish/steam-blast-v1.png` conserva seis quadros e introduz abertura da válvula frontal já existente após compressão da caldeira. O preparo no quadro 36 da simulação foi inspecionado na arena, antes do vapor ativo no quadro 54: a abertura comunica intenção de emitir. Escala e referências corporais preservadas; alcance, preparação e dano inalterados. Verificação técnica, `npm test` e campanha completa no Chrome passaram com a mesma batalha de 583 atualizações, 3 HP e recarga.

## Passe 05 — Laser Beam

**ACCEPTED.** `polish/laser-beam-v1.png` troca braços abertos/para trás por mira para a frente, apoio do punho e palma aberta antes do disparo. Mantém seis quadros, escala e tempos; as marcações acompanham o torso na nova pose, sem usar a mão como âncora. A preparação sem feixe foi inspecionada no quadro 37 da simulação. Verificação técnica, `npm test` e campanha no Chrome passaram: 583 atualizações de batalha, ordem completa, 3 HP e recarga. A correspondência do feixe com o agachamento é uma pendência independente do passe 07.

## Passe 06 — Dinosaur Rush

**ACCEPTED como melhoria de progressão temporal.** As seis poses existentes foram preservadas; o renderer distribui duas na preparação, duas na janela ativa e duas na recuperação. Antes, a janela ativa de 18 quadros mostrava uma única pose; agora alterna as duas poses de impulso a cada nove quadros. Não altera velocidade, janela de dano, alcance ou estado da IA. Quadros 54 e 63 foram inspecionados no gameplay e mostram progressão das pernas/corpo com mandíbula fechada, mantendo distinção de Bite. Teste de timeline, verificação dos PNGs, `npm test` e campanha no Chrome passaram com os mesmos 583 passos de combate. Não certifica todas as transições artísticas restantes.

## Passe 07 — justiça das hitboxes em 2×

**ROLLED BACK para o candidato de colisão.** A análise combinou pixels dos sprites, as transformações do renderer e impactos da simulação. No Rocket Punch, o punho ativo alcança aproximadamente 85 unidades a partir da âncora; somando a meia largura da menina (55), há aproximadamente 109 unidades de espaço vazio quando o ataque causa dano a 250 unidades. No laser, o feixe a 55 unidades do chão cruza pixels opacos da menina agachada, mas o agachamento concede esquiva. Esses defeitos não foram criados pelos passes de textura/antecipação.

Foi ensaiado isoladamente um alcance de 140 para Rocket Punch. A campanha continuou concluível, mas a IA, que inicia o golpe a 270, passou a errar uma menina parada nessa distância: HP anterior 2, candidato 3. A mudança enfraquece o inimigo e foi rejeitada por alterar o balanceamento. A cópia temporária foi removida; o módulo ativo mantém alcance 280 e os demais parâmetros. Nenhuma colisão do laser foi modificada. A revisão de justiça permanece reprovada, mesmo com os testes funcionais passando.

Reprodução: `node scripts/review-battle-fairness.js --write` e `node scripts/test-battle-fairness-candidate.js`. Evidências: [geometria/impacto](hitbox-fairness-evidence.json) e [comparação do candidato](hitbox-candidate-comparison.json).

## Continuação — Prompt 18

O [relatório de certificação](fairness-certification-report.md) registra os passes posteriores sem reescrever o histórico acima. Foram aceitas correções locais de projeção do punho, feixe/pose baixa e transmissão do Trem. As antecipações e Rush foram reinspecionados no gameplay. Duas alternativas de Robot Walk foram descartadas; a matriz ampliada do punho motivou ajuste por pose e terminou com 886 casos aprovados. Toy Leap foi reproduzido com dano além da representação visual, mantendo a certificação geral em FAIL.
