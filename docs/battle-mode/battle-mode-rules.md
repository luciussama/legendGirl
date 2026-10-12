# Toy Room — regras do modo de batalha

Versão: 1.0  
Status: Design  
Prioridade: CRITICAL  
Origem: PROMPT 10 — TOY ROOM BATTLE MODE e esclarecimento sobre cura excedente.  
Dependência: `09-final-homologation.md` — arquivo não localizado no workspace; homologação não verificada.

## Escopo

Design apenas, conforme o escopo previamente solicitado. Este pacote não produz sprites, código de gameplay nem integração. As regras abaixo ficam congeladas. Prompts posteriores não podem alterá-las; uma eventual mudança exige aprovação explícita do usuário.

## Transição e arena

Imediatamente após terminar a cena de obtenção da espada, a exploração termina, a câmera trava e o modo batalha inicia. O quarto se transforma em arena.

A arena funciona exclusivamente no eixo horizontal. A menina não anda em profundidade e não explora mais o quarto. Pular e abaixar são ações de combate, não deslocamento em profundidade.

A câmera fixa da batalha começa após a aquisição da espada. O retorno da câmera à menina após o diálogo de investigação pertence ao fluxo anterior de exploração.

Street Fighter, Golden Axe e Castle Crashers permanecem referências exclusivamente de gameplay, sem servir de referência de arte ou autorização para importar mecânicas adicionais.

## Controles

| Entrada lógica | Ação |
| --- | --- |
| ESQUERDA (`LEFT`) | Andar para a esquerda. |
| DIREITA (`RIGHT`) | Andar para a direita. |
| CIMA (`UP`) | Pular. |
| BAIXO (`DOWN`) | Abaixar. |
| ATAQUE (`ATTACK`) | Atacar com a espada. |

CIMA e BAIXO nunca movimentam a menina em profundidade durante a batalha. O mapeamento físico para teclado, joystick e gamepad permanece pendente.

## Corações

| Participante | HP máximo |
| --- | ---: |
| Menina | 3 |
| Brinquedo inimigo comum | 2 |
| Urso | 4 |

O HP nunca ultrapassa o máximo do participante. Os valores são fixos; nenhum modificador de dificuldade está autorizado.

## Roubo de coração

Quando a menina sofre dano de um inimigo:

- A menina perde 1 coração.
- O inimigo que causou o dano ganha 1 coração, limitado ao próprio máximo.

Quando a menina acerta um inimigo com a espada:

- O inimigo atingido perde 1 coração.
- A menina ganha 1 coração, limitada ao máximo de 3.

A cura excedente é descartada. Estar com HP cheio não impede que o alvo perca 1 coração. O HP mínimo é 0; uma perda de coração não gera HP negativo. As mesmas regras de transferência aplicam-se ao Urso, cujo máximo é 4.

O objetivo do combate é recuperar vida através dos ataques.

### Exemplos

| Evento | Antes: menina / inimigo | Depois: menina / inimigo |
| --- | --- | --- |
| Menina acerta brinquedo | 2 / 2 | 3 / 1 |
| Menina acerta com HP cheio | 3 / 2 | 3 / 1; cura excedente descartada |
| Brinquedo causa dano | 3 / 1 | 2 / 2 |
| Brinquedo cheio causa dano | 3 / 2 | 2 / 2; cura excedente descartada |
| Menina derrota brinquedo | 1 / 1 | 2 / 0 |
| Urso causa dano com HP cheio | 3 / 4 | 2 / 4; cura excedente descartada |
| Menina perde o último coração | 1 / 1 | 0 / 2; derrota |

## Resultados

**Derrota:** menina chega a 0 corações.

**Vitória:** todos os brinquedos inimigos e o Urso foram derrotados. Derrotar apenas o Urso ou apenas os brinquedos não basta. O PROMPT 12 define o Urso como o último inimigo enfrentado; o confronto com ele sucede os brinquedos inimigos comuns. Consulte o [design do chefe final](bear-final-boss-design.md).

## Decisões ainda não fornecidas

Os tipos Trem, Robô e Dinossauro e seus repertórios foram definidos no PROMPT 11 e constam no [catálogo oficial de inimigos](toy-enemy-design.md). Essa definição não altera as regras congeladas deste documento.

- HP inicial dos participantes; os máximos não definem implicitamente o estado inicial.
- Quantidade de brinquedos, aparição, ondas e IA.
- Limites, enquadramento e posicionamento da arena; comportamento da câmera fixa após resize/orientação.
- Velocidade, física do salto, duração do agachamento e combinações de inputs.
- Alcance, tempos, hitboxes e invulnerabilidade; contabilização de contatos repetidos ou múltiplos alvos.
- Prioridade se as condições de vitória e derrota forem satisfeitas simultaneamente.
- Save/load durante batalha, reinício e destino após vitória.

Essas pendências não autorizam alterações nas regras congeladas. Devem ser resolvidas antes da produção. A homologação dependente também precisa ser verificada.

## Entregáveis

- `battle-mode-rules.md`: referência textual canônica.
- `battle-flow-diagram.png`: fluxo conceitual, sem prioridade implícita entre resultados simultâneos.
- `battle-balance-spec.json`: especificação estruturada; `null` significa decisão pendente, não default de runtime.
