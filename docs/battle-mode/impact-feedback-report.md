# Relatório de feedback de impacto — Prompt 19A

**Implementação: adicionada. Legibilidade perceptiva humana: pendente.**

## Resposta ao dano

- **Menina:** cancela a animação/agachamento corrente, apresenta a pose oficial `damage`, flash curto e recuo apenas visual. O estado físico/posição de combate não é empurrado.
- **Trem, Robô, Dinossauro e Urso:** entram na animação existente `HIT`; um flash curto e recuo visual acompanham a interrupção. A recuperação retorna ao fluxo existente, sem laço de stun.
- **Faísca/estouro:** burst circular pequeno e temporário no ponto de impacto confirmado; não é desenhado em erro/esquiva e não mostra alcance de colisão.
- **Hit pause:** 1 quadro para impactos regulares e 2 para golpes do Urso. A pausa não congela input por tempo indefinido e não muda HP adicional.
- **Combat shake:** deslocamento de poucos pixels limitado à arena, com decaimento de 10 quadros. O HUD fica fora da transformação da câmera.

## Sincronização lógica

No passo que confirma dano, o registro `IMPACT`, o início da reação, o efeito transitório e a chamada do som de impacto são agendados juntos. O caso de Toy Leap acima do alcance visível não produz dano e, por isso, não cria efeito.

## Limites

Não foi feita medição de FPS/dispositivo físico após efeitos, nem avaliação de “entender sem olhar HP”. Não houve comparação cega entre níveis de pausa/tremor; a decisão de rollback deve ser aplicada se o playtest demonstrar atraso, confusão, distração ou queda de desempenho. Os artefatos permanecem visuais de apresentação, nunca sobreposições técnicas de hitbox.

Os seis retestes obrigatórios passaram, incluindo fairness de 886 poses de Rocket Punch sem divergência entre máscara desenhada, projeção e dano. Essa evidência é automatizada e não substitui a aprovação perceptiva nem as cinco sessões humanas.
