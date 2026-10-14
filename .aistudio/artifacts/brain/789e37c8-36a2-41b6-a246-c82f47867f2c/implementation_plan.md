# Avaliação Arquitetural e Plano de Desacoplamento — `game.js`

Este documento apresenta uma avaliação técnica aprofundada da arquitetura atual de `src/js/game.js` (1.472 linhas) e propõe um plano de desacoplamento em etapas, adotando o padrão **Diretor de Fases (Phase Director)** e **Máquina de Estados Finitos (HFSM)** com controladores especializados, mantendo **100% intacta** a assinatura pública de `createGame` e todos os contratos de testes existentes.

---

## Decisões Críticas e Preferências Confirmadas

> [!IMPORTANT]
> A avaliação atende estritamente à restrição **SEM ALTERAÇÃO DE CÓDIGO** nesta etapa, servindo como blueprint formal de planejamento e projeto antes de qualquer intervenção futura.

- **Padrão Arquitetural Escolhido**: Diretor de Fases e Máquina de Estados Finitos (HFSM).
- **Escopo e Foco Prioritário**: Isolar as responsabilidades acumuladas em `game.js` em controladores especializados e desacoplados.
- **Garantia de Compatibilidade**: Manter integralmente a assinatura pública de `createGame(canvas, uiFeedback, callbacks)` e os contratos consumidos por `main.js`, scripts de QA e testes automatizados.

---

## 1. Diagnóstico do Acoplamento Atual em `game.js`

Atualmente, `src/js/game.js` atua como um **"God Object"** centralizador que acumula 7 domínios de responsabilidade distintos:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              src/js/game.js                            │
│                               (1.472 linhas)                           │
├─────────────────┬─────────────────┬──────────────────┬─────────────────┤
│  Espelhamento   │     Física      │     Controle     │    Direção      │
│   de Estado     │   e Pouso       │    Narrativo     │    de Fases     │
│ (syncStateTo-   │ (doJump, Floor, │ (Cutscenes,      │ (Quarto Escuro  │
│  Locals, 40+    │  colisões com   │  plot twist,     │  vs. Toy Room   │
│  propriedades)  │  plataformas)   │  diálogos, HUD)  │  e transições)  │
├─────────────────┼─────────────────┴──────────────────┼─────────────────┤
│  Renderização   │          Efeitos e Partículas      │  Loop e Ciclo   │
│   Coordenada    │   (Puffs, Dust, fitas de corrida,  │   de Vida       │
│  (Canvas 2D)    │        iluminação pontual)         │  (loop, RAF)    │
└─────────────────┴────────────────────────────────────┴─────────────────┘
```

### Principais Pontos de Atrito e Gargalos:

1. **Anti-pattern de Espelhamento de Estado (`syncStateToLocals` e `syncLocalsToState`)**:
   - Nas linhas 161 a 260, `game.js` extrai dezenas de campos de `GameState` para variáveis de escopo local (`cameraX`, `cameraY`, `jumpStage`, `isGameOver`, `climbStage`, `fadeAlpha`, etc.) e executa uma cópia reversa antes de eventos e ao final do ciclo.
   - Isso gera duplicação de verdade, risco permanente de dessincronização e impede que componentes externos interajam diretamente com o estado sem mediação de `game.js`.

2. **Loop de Atualização Monolítico (`update(dt)`)**:
   - O método `update(dt)` (linhas 823 a 1230, com mais de 400 linhas) mistura:
     - Verificação de timers de cutscene e avanço de falas;
     - Lógica da Toy Room delegada a `toyRoomInstance`;
     - Física da protagonista no Quarto Escuro (gravidade, aceleração, pulo simples e duplo);
     - Detecção de aterrissagem em 22 apoios no percurso de ida e 16 apoios no retorno;
     - Transições de tela (Game Over, Standby, Castelo, Portal do Guarda-Roupa).

3. **Mistura de Apresentação e Domínio Físico**:
   - `game.js` gerencia diretamente o contexto do Canvas 2D (`ctx.save()`, `ctx.restore()`, matrizes de transformação de câmera, iluminação ambiente) e invoca diretamente os métodos de renderização de baixo nível, além de coordenar áudio e efeitos de partículas.

---

## 2. Nova Arquitetura Proposta: Phase Director & Controladores Especializados

A solução proposta preserva a casca externa `createGame` como uma fachada transparente (Facade Pattern), delegando a execução para controladores com responsabilidade única:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        createGame() [Fachada / API]                    │
│   (Preserva 100% da interface consumida por main.js e testes de QA)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          GamePhaseDirector                             │
│       (Máquina de Estados: 'dark-room' | 'transition' | 'toy-room')    │
├───────────────────────────────────┬────────────────────────────────────┤
│                                   │                                    │
│                 ▼                 │                 ▼                  │
│       DarkRoomPhaseController     │         ToyRoomPhase (já existe)   │
│  ┌─────────────────────────────┐  │  ┌──────────────────────────────┐  │
│  │  DarkRoomPhysicsSystem      │  │  │  ToyRoomStory / Investigation│  │
│  │  (Salto, landing, apoios)   │  │  │  ToyRoomArenaPhase (combate) │  │
│  ├─────────────────────────────┤  │  │  RoomEnvironmentRenderer     │  │
│  │  DarkRoomNarrativeDirector  │  │  └──────────────────────────────┘  │
│  │  (Castelo, fuga, reviravolta│  │                                    │
│  ├─────────────────────────────┤  │                                    │
│  │  DarkRoomEffectsCoordinator │  │                                    │
│  │  (Partículas, ribbons, som) │  │                                    │
│  └─────────────────────────────┘  │                                    │
└───────────────────────────────────┴────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  RuntimeContext & Shared Services                      │
│   (GameState unificado, CameraController, InputController, Audio)     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Especificação dos Novos Módulos Especializados

### 3.1. `GamePhaseDirector` (`src/js/controllers/GamePhaseDirector.js`)
- **Responsabilidade**: Gerenciar o ciclo de vida das fases globais e as transições cinemáticas entre elas.
- **Estados**:
  - `OPENING_CINEMATIC`: Sequência inicial da menina acordando (`OpeningSequence`).
  - `DARK_ROOM`: Plataformas do Quarto Escuro (subida inicial e percurso de fuga).
  - `TOY_ROOM_INTRO`: Transição cinemática com fusão de canvas (`ToyRoomIntroduction`).
  - `TOY_ROOM`: Exploração superior, coleta no baú e revelação da espada.
  - `TOY_ROOM_ARENA`: Arena heroica de combate contra brinquedos corrompidos e chefe Urso.
- **Contrato**:
  ```typescript
  interface PhaseHandler {
    enter(previousPhase, state): void;
    update(dt: number, state): void;
    render(ctx: CanvasRenderingContext2D, state): void;
    handleInput(inputEvent): boolean;
    exit(nextPhase, state): void;
    saveProgress(): object;
    restoreProgress(data: object): void;
  }
  ```

### 3.2. `DarkRoomPhysicsSystem` (`src/js/environment/DarkRoomPhysicsSystem.js`)
- **Responsabilidade**: Isolar as regras de salto, inércia, tolerância de pouso por dificuldade (`easyLanding`) e colisões de caixa delimitadora (AABB) com plataformas.
- **Vantagem**: Reduz mais de 300 linhas de cálculos matemáticos de vetor e tolerância em `game.js`. Permite testes unitários de colisão puramente determinísticos e sem necessidade de Canvas real.

### 3.3. `DarkRoomNarrativeDirector` (`src/js/narrative/DarkRoomNarrativeDirector.js`)
- **Responsabilidade**: Orquestrar as 6 sequências narrativas do Quarto Escuro (standby, castelo, reviravolta/traição, tutorial de primeiro salto, fuga e subida final).
- **Vantagem**: Encapsula as chamadas de avanço de falas, travamento temporário de inputs (`baby.controlsLocked`) e comunicação com `DialogueRenderer` e `PoeticNarrator`.

### 3.4. `DarkRoomEffectsCoordinator` (`src/js/effects/DarkRoomEffectsCoordinator.js`)
- **Responsabilidade**: Centralizar a emissão de partículas de salto, aterrissagem, poeira de voo da fada e fitas de velocidade (`speedRibbons`), eliminando métodos utilitários soltos no coordenador geral.

---

## 4. Plano de Transição Incremental (Zero Quebra de Compatibilidade)

Para que a transição ocorra de forma segura e sem regressões na experiência do jogador ou nos testes:

### Fase 1: Eliminação dos Espelhos Locais (`syncStateToLocals`)
- Migrar gradualmente as variáveis soltas de `game.js` para leituras e escritas diretas no objeto `state` já existente (`createGameState`).
- Validar com a suíte de testes de persistência (`npm test` e `test:campaign-progress`).

### Fase 2: Extração da Física do Quarto Escuro (`DarkRoomPhysicsSystem`)
- Isolar `doJump`, lógica de gravidade e verificação de apoios em um módulo puro com injeção de dependências (`platforms`, `difficulty`, `babyState`).
- Executar os testes de contato de pé e precisão (`test:foot-contact`).

### Fase 3: Criação do `GamePhaseDirector`
- Mover a bifurcação entre `bedroom` e `toy-room` para classes ou handlers dedicados.
- `createGame` passa a ser apenas o instanciador do runtime e o orquestrador do loop de animação (`requestAnimationFrame`).

### Fase 4: Validação Regressiva Automatizada
- Executar a bateria de verificação completa:
  - `npm run check-assets` (validação de integridade dos 66 recursos)
  - `npm run lint` (verificação de sintaxe de módulos ES)
  - `npm run build` (validador de caminhos estáticos para GitHub Pages)
  - `npm run journal:read` e registros no diário IA conforme `AGENTS.md`.

---

## 5. Matriz de Impacto e Trade-Offs

| Abordagem | Benefícios | Riscos / Desvantagens | Mitigação |
| :--- | :--- | :--- | :--- |
| **Status Quo (game.js monolítico)** | Funciona no estado atual; código consolidado em um só lugar. | Alta complexidade cognitiva; difícil manutenção; bugs por desincronização em `syncStateToLocals`. | N/A (motivo da solicitação de avaliação). |
| **Refatoração Diretor de Fases (Recomendada)** | Alta coesão; separação nítida entre Quarto Escuro e Toy Room; manutenibilidade; facilidade de testar fases isoladas. | Pequena dispersão de arquivos; requer testes cuidadosos na passagem de cena. | Preservação integral da fachada `createGame` e reutilização dos contratos de contexto. |
| **Reescrita ECS Completa** | Máxima flexibilidade para jogos com centenas de entidades dinâmicas. | Superengenharia desnecessária para um jogo de plataforma e exploração com escopo fechado; alto risco de regressão física. | Descartada em favor de controladores orientados a domínio. |

---

## Conclusão da Avaliação

A refatoração de `game.js` para uma arquitetura baseada em **Diretor de Fases e Controladores Especializados** é perfeitamente viável, recomendada e de baixo risco estrutural, desde que executada em passos incrementais com a preservação estrita da interface pública de `createGame`.
