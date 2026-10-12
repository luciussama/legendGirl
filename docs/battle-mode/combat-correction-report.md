# Correção e revalidação do combate — Prompt 14A

**Resultado: FAIL. Critérios de sucesso ainda não atingidos.**

Foram geradas as sete pranchas solicitadas usando `image_gen`, com seis poses cada, e realizadas duas tentativas adicionais para Robot Walk (a última usa quatro poses). Nenhuma versão foi promovida ao manifesto principal. Regras, HP, inimigos, IA e progressão permanecem sem alterações.

O novo modelo autorizado distingue ataques físicos (ação identificável sem efeitos) de emissão (intenção de disparar identificável sem efeitos). Não é mais necessário identificar vapor ou laser sem os efeitos correspondentes. As correções de emissão foram geradas sem esses efeitos.

## Resultados

| Sequência | Resultado | Evidência |
| --- | --- | --- |
| Robot Walk | **FAIL** | Três tentativas ainda repetem a mesma perna dominante; não há alternância completa. |
| Front Charge | **FAIL** | Compressão e recuperação melhoraram, mas lançamento ainda não é inequívoco em escala pequena. |
| Rocket Punch | **FAIL** | Extensão legível; contornos e proporções ainda destoam da referência. Âncora central do recorte desloca o corpo quando o punho cresce. |
| Steam Blast | **FAIL** | Há compressão e inclinação, mas a preparação de emissão não se distingue suficientemente da investida em escala pequena. |
| Laser Beam | **REVIEW** | Abre braços e trava postura, mas a leitura de mira ainda se aproxima da guarda de punho; precisa revisão adicional. |
| Train Walk | **FAIL** | Pinos de rodas assumem ângulos diferentes na mesma biela; conexão mecânica e fechamento não são consistentes. |
| Dinosaur Rush | **REVIEW** | Mandíbula fechada e impulso corporal distinguem Rush de Bite; continuidade com o pacote anterior ainda não homologada. |

## Entregáveis

As sete imagens estão em [corrections](../../assets/art/toy-room/battle/corrections/), com os nomes exigidos pelo Prompt 14A. Os [prompts](../../assets/art/toy-room/battle/corrections/prompts.json) registram todas as instruções e tentativas. O [relatório estruturado](combat-correction-report.json) registra resultado, evidências e limites.

A [prévia animada](../../tests/combat-correction-review.html) oferece escala ampliada, escala pequena, pausa, avanço de quadro e sequências concatenadas Idle → Walk → Attack → Hit → Walk → Death para cada ataque. Toy Leap também aparece individualmente e no percurso do Urso. Abra pelo servidor local em `/tests/combat-correction-review.html`.

## Validação executada

- Inspeção ampliada das sete pranchas e das tentativas adicionais de Robot Walk.
- Carregamento no Chrome das 26 sequências e nove percursos de transição; amostras em escala ampliada e pequena.
- `node scripts/verify-battle-sprites.js --corrections`: 146 PNGs passaram nos critérios técnicos de repertório, dimensões, hash, margem, âncoras finitas e ausência de duplicação exata.
- `git diff --check`: sem erros.

O teste técnico não certifica progressão perceptiva, bielas corretas, identidade artística ou ausência de cortes anteriores ao recorte. As margens não substituem a inspeção do desenho. A remoção dos efeitos não foi feita por código: as novas poses foram solicitadas diretamente sem efeitos.

## Continuidade e limites

A escala pequena utiliza fator 0.35 sobre a referência, declaradamente uma hipótese de apresentação. A arena ainda não integra estes sprites, portanto não foi possível certificar o tamanho final do gameplay. A escala de cada correção é aproximada pela altura inicial em relação ao Idle anterior; não é homologação de proporções.

As âncoras automáticas usam centro do recorte. Em Rocket Punch, o punho estendido amplia o recorte e desloca a referência horizontal do corpo. Isso exige âncoras corporais por quadro, não interpolação que esconda o defeito. As transições também misturam desenhos anteriores e novos com acabamento e silhueta diferentes. **Não foi concluída a revisão de todas as sequências duas vezes nem a certificação de todas as transições.** Nenhuma ausência de teletransporte ou clipping foi declarada.

## Trabalho restante

1. Robot Walk precisa de poses guiadas por contatos opostos reais; as três gerações deste ciclo não satisfizeram a alternância exigida.
2. Train Walk precisa de pinos de roda e biela coerentes, com fases ordenadas e fechamento verificado.
3. Refazer antecipação e lançamento de Front Charge; separar emissão de Steam Blast da simples inclinação de investida.
4. Harmonizar desenho do Robô e fortalecer a postura de mira de Laser Beam.
5. Marcar pivôs corporais manualmente após aprovação dos desenhos, comparar tamanhos e revisar todas as transições e escalas.

O resultado desejado PASS não foi produzido. As imagens permanecem como tentativas de correção rastreáveis, não como arte aprovada para integração. Não foram alterados critérios para aprovar uma geração que não os atende.
