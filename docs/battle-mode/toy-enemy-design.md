# Toy Room — design dos inimigos

> **Design inicial preservado.** Os valores, pendências e restrições de escopo abaixo descrevem a concepção original dos prompts 10–12 e o perfil legado, não a arena imaginária atual. A implementação autorizada evoluiu: a arena usa HP 3/4/4/8 para os inimigos, câmera própria, IA, proteção e persistência. Consulte o [guia vigente](../arena/GUIA-ARENA.md), a [configuração documentada](../arena/configuracao-atual.json) e o diário para decisões posteriores. Os `null` das especificações originais continuam sendo pendências daquela versão, sem sobrescrever parâmetros do código atual.


Versão: 1.0  
Status: Design  
Origem: PROMPT 11 — TOY ENEMY DESIGN.

Este catálogo define os três tipos de inimigos comuns fornecidos. O Urso permanece como chefe previsto nas [regras de batalha](battle-mode-rules.md), com máximo de 4 corações; seu design e seus três ataques estão definidos em [Urso, chefe final](bear-final-boss-design.md). A quantidade de instâncias de cada tipo também permanece pendente.

## Catálogo oficial

| Inimigo | HP máximo | Ataque | Característica obrigatória |
| --- | ---: | --- | --- |
| 01 — Trem | 2 corações | `Steam Blast` | Solta vapor quente; ataque de média distância. |
| 01 — Trem | 2 corações | `Front Charge` | Investida frontal; ataque de curta distância. |
| 02 — Robô | 2 corações | `Laser Beam` | Ataque reto. |
| 02 — Robô | 2 corações | `Rocket Punch` | Punho dispara para frente. |
| 03 — Dinossauro | 2 corações | `Bite` | Mordida curta. |
| 03 — Dinossauro | 2 corações | `Rush` | Investida rápida. |

## Identidade e repertório

As características dos ataques devem refletir o brinquedo: o Trem usa vapor e investida frontal; o Robô usa laser e punho disparado; o Dinossauro usa mordida e investida rápida. Cada tipo possui exclusivamente os dois ataques listados. Nenhum inimigo pode receber ataques aleatórios ou emprestados de outro tipo.

Essa restrição define o repertório permitido. A ordem de execução e o algoritmo de escolha dos ataques ainda não foram fornecidos; este documento não impõe uma IA determinística nem autoriza uma seleção aleatória por inferência.

## Regras de combate herdadas

Todos os três tipos são inimigos comuns com máximo de 2 corações. Seus ataques obedecem ao roubo de coração já aprovado: quando causam dano, a menina perde 1 coração e o atacante recupera 1; quando recebem um acerto da espada, perdem 1 e a menina recupera 1. A cura respeita o máximo de quem recebe, e o excedente é descartado sem impedir o dano ao alvo.

O catálogo preserva a arena horizontal, a câmera fixa, os controles e as condições de vitória/derrota. Um ataque reto ou para frente não autoriza deslocamento em profundidade.

## Parâmetros pendentes

- Alcance numérico de cada ataque. Apenas `Steam Blast` tem média distância explicitamente definida; `Front Charge` tem curta distância e `Bite` é uma mordida curta. Os demais alcances não foram fornecidos.
- Velocidades, duração, preparação, recuperação, frequência e critérios de escolha.
- Trajetórias detalhadas, colisões, contatos repetidos e interação com salto/agachamento.
- HP inicial, quantidade de instâncias, aparição e comportamento de cada inimigo.
- Parâmetros de combate do Urso, conforme seu design específico.

Não se acrescentam queimadura, atordoamento, perseguição, explosões, ricochete ou outros efeitos por associação com o nome de um ataque. Esses efeitos não foram solicitados.

## Critérios para implementação futura

- Trem, Robô e Dinossauro têm máximo de 2 corações cada.
- Cada inimigo utiliza somente seu repertório oficial de dois ataques.
- Vapor quente, investida frontal, laser reto, punho para frente, mordida curta e investida rápida conservam as características acima.
- Dano e recuperação de vida respeitam as [regras congeladas](battle-mode-rules.md) e a [especificação de balanceamento](battle-balance-spec.json).
- Parâmetros não fornecidos devem ser decididos antes da produção. Este entregável é de design, sem código, sprites ou integração.

A versão estruturada do catálogo está em [toy-enemy-spec.json](toy-enemy-spec.json). Valores `null` indicam decisões pendentes, não defaults de runtime.
