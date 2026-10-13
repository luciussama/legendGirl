# Polimento seguro pós-playtest — Prompt 17

**Resultado: quatro melhorias aceitas; três tentativas rejeitadas. Justiça de colisões ainda não aprovada.**

Os sistemas funcionais do Prompt 16 foram preservados. Cada passe trata um único item; candidatos reprovados não foram promovidos ou foram descartados em ensaio isolado. A referência inicial está em `assets/art/toy-room/battle/polish/baseline-manifest.json`. Os checkpoints após Rocket Punch, Steam Blast e Laser Beam permitem comparar a produção incremental.

## Decisões por item

| Item | Decisão | Evidência |
| --- | --- | --- |
| Robot Walk | ROLLED BACK | Tentativa ainda repete apoio dominante. |
| Rocket Punch — acabamento | ACCEPTED | Textura/sombreamento melhorados; extensão preservada. |
| Train Walk | ROLLED BACK | Pinos ainda não sincronizam geometricamente. |
| Steam Blast | ACCEPTED | Válvula abre antes da emissão; preparo visível sem vapor. |
| Laser Beam | ACCEPTED | Postura de mira e palma aberta antes do disparo. |
| Dinosaur Rush | ACCEPTED | Duas poses de impulso na janela ativa; mesmos desenhos e física. |
| Hitboxes da menina em 2× | ROLLED BACK para ajuste de alcance | Alcance reduzido enfraquece o Robô; divergências permanecem abertas. |

## Retestes e comparação

Após cada passe de arte foram executados `node scripts/verify-battle-sprites.js --remediation` e `npm test`, que inclui a suíte de batalha. Todos passaram: 144 PNGs, 26 sequências, vitória/derrota, limites de HP, transferência, Enrage, persistência e repertórios dos quatro adversários. Nos passos dt 0,5 / 1 / 3, os percursos mantiveram 1166 / 583 / 182 atualizações, 3 HP, ordem correta e recarga.

Os passes aceitos também tiveram campanha com desenho real no Chrome em `/tests/battle-gameplay.html`: batalha de 583 atualizações, 3 HP e recarga. Foram observados Rocket Punch em ação, Steam Blast no quadro 36, Laser Beam no quadro 37 e Rush nos quadros 54 e 63. A página permite pausar na preparação e avançar a simulação quadro a quadro, sem modificar estados de ataque.

A mudança do Rush altera intencionalmente a exposição das poses; preparação, janela ofensiva e recuperação da simulação continuam em 54 / 18 / 36 quadros. Não muda HP, velocidade, colisões ou IA. `node scripts/test-battle-polish.js` confirma isolamento de sequências, escalas e timeline.

`npm run test:battle:polish` reúne invariantes, recursos e playtest funcional. `npm run review:battle:fairness` gera o diagnóstico; `npm run test:battle:fairness` é um gate estrito que **falha atualmente** pelos casos de Rocket Punch e agachamento diante do laser. Essa falha não deve ser tratada como teste aprovado.

O diagnóstico de justiça encontrou casos que os percursos anteriores não detectavam: Rocket Punch causa dano com espaço vazio entre punho e menina; o laser cruza a menina agachada mesmo quando o código evita dano. O ensaio de alcance menor conservou conclusão da campanha, mas alterou eficácia do inimigo a 270 unidades. Foi rejeitado. Concluir a campanha não basta para aprovar todas as colisões. Os achados são anteriores ao polimento e exigem tratamento dedicado.

## Alcance da aprovação

As melhorias são incrementais. Não há aprovação final do Prompt 14, certificação de todas as âncoras/transições ou avaliação em hardware móvel/gamepad físico. A funcionalidade continuou estável nos percursos testados; a justiça de hitboxes permanece reprovada. Não foi alterada a dificuldade para forçar aprovação.

Comparação de custo de desenho no Robô, Chrome, 180 amostras após 30 quadros de aquecimento: mediana anterior/atual 0,50/0,50 ms; p95 0,60/0,70 ms. A pequena variação do p95 não é evidência conclusiva de regressão de desempenho, mas também não certifica FPS/latência em dispositivos reais. A página com `?baseline=1` permite repetir a comparação dos recursos anteriores sob o mesmo renderer.

Detalhes: [histórico de remediação](remediation-history.md), [rollbacks](rollback-history.md), [melhorias aceitas](accepted-improvements.md) e [pendências restantes](remaining-backlog.md).
