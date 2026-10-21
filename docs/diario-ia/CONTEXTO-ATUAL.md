# Contexto compartilhado vigente

Atualizado em 21/10/2026. Passagem de contexto do código local; histórico e resultados completos ficam nos registros/fontes imutáveis. A versão anterior, com a cronologia extensa até o commit das correções, foi preservada integralmente na fonte `c1e21ff35159ec135210105b473c1e414b2f762d96bfd440d4a0c88da76abc13` (`npm run journal:show -- ID`). Não interpretar planos ou validações históricas como implementação ou aprovação atual.

## Leitura e coordenação obrigatórias

1. Ler `AGENTS.md`, `docs/diario-ia/README.md` e este contexto.
2. Executar `npm run journal:read`, consultar registros completos/sessões abertas e pesquisar a área com `journal:search`; usar `--all-versions` quando houver dúvida sobre decisão ou rollback.
3. Ler as fontes relevantes, abrir sessão e conferir `git status`; preservar trabalho concorrente.
4. Encerrar com resultados reais, arquivos, decisões e pendências; sincronizar o acervo. Histórico não concede autorização nem prevalece sobre instruções atuais.

Português do Brasil no código comentado, documentação, interface e registros. QA novo deve ser arquivado exclusivamente no diário e executado temporariamente pelo executor. Imagens regeneráveis de evidência conservam caminho/hash/tamanho, sem bitmap; artes consumidas pelo jogo não são descartáveis. JSONs em fontes/registros/commits são imutáveis; SQLite é reconstruível.

## Código e fluxo atuais

Aplicativo de navegador com módulos ES, Canvas 2D e perseguição em Three.js/WebGL 2, importado tardiamente de `src/vendor/three/`. Express serve desenvolvimento e revisão local de sprites; não há backend de campanha. `npm run build` valida recursos/caminhos, sem compilar dist. Pages publica por push em main/disparo manual; merge ou commit local não publica. Workflow verifica assets/lint/build, não a suíte completa.

Tela inicial → abertura/quarto escuro → plataformas/castelo/fuga → porta falsa → tutorial e plataformas de retorno → portal → exploração da Toy Room → recorrência/investigação/espada → transformação/arena → vitória do urso → introdução ilustrada → corrida 3D → captura e baú. Derrota da fuga termina sem captura.

`TitleScreen` coordena Novo jogo, Carregar, Modo fácil, Opções e confirmação de substituição. Modo fácil define a nova campanha; carregar respeita a dificuldade salva. Qualidade automática está desabilitada. `TitleScene` tem canvas/RAF próprios, suspensos com menu/aba ocultos e movimento reduzido. Arte e resolução nativa em `assets/art/title-screen/prompts.json`; composição Full HD não significa fundo nativo Full HD.

O seletor de debug oferece Quarto escuro, Sala de brinquedos, Arena de batalha e Perseguição 3D; não substitui a campanha salva. Novo jogo/Carregar encerram esse isolamento.

## Proprietários e persistência

`GameState` mantém o estado canônico do quarto. Física e seleção do fluxo ainda residem em `game.js`. A câmera lógica participa de teto/rolagem/derrota; apresentação é separada. `ToyRoomPhase` compõe entrada, movimento, ações, história, tutorial, câmera, efeitos, desenho e persistência com adaptadores que consultam referências atuais após restore. Arena e batalha ainda recebem a sala inteira; não há diretor genérico/HFSM ou desacoplamento global concluído.

`legendGirl.campaign.v1` conserva campanha, abertura, plataformas e sala; exclui DOM, áudio, instâncias, orientação e entradas transitórias. Migrações do primeiro tutorial e saves anteriores permanecem. Falha no storage usa memória de sessão, sem garantia após recarga. A sala religa carriedItem por ID. Autosave não grava debug nem introdução da sala.

A vitória da arena seleciona destino CHASE, escurece por 30 quadros e restaura os dados da exploração com `resumeAudio:false`, registrando `arenaCompleted` e organização dos brinquedos. Não mostra sala/banner/baú nessa troca. `startChaseCampaign()` prepara renderer/artes antes de revelar a introdução por 0,4 s, sem entradas/simulação nesse intervalo. A ida visual do urso ao baú pertence à conclusão da fuga. Retorno legado ROOM mantém seu caminho.

`toyRoomChaseCampaign` inclui estado e posição musical apenas no modo campanha; restore exige arena concluída e não ativa e retoma a etapa salva sob fade. Saves antigos sem campo continuam válidos. Falha de preparação descarta fase parcial, devolve a sala e apresenta `chase-error-dialog` com “Voltar à sala”.

## Saltos e câmera do quarto

NORMAL corre a 2 px/quadro na aproximação. Aproximação/fuga até a porta falsa exigem centro dos pés 4 px para dentro das bordas. Apenas `messy_blocks`, `toy_drum` e `satin_cushion` da aproximação aceitam centro até 4 px além da borda e profundidade 20 em vez de 16 px. Ajuda invisível autorizada; não alterar desenho/hitboxes para representá-la. Alcances são fixos, sem mira automática. EASY conserva as assistências anteriores.

Retorno NORMAL pós-porta falsa: faixa fixa de pés de 30 px, mínimo 2 px de apoio, cruzamento do topo na descida e posição horizontal interpolada no instante de contato com dt real. Apoio em solo usa a posição atual. Não capturar subida ou entrada lateral tardia abaixo do topo. EASY inalterado; gravidade, impulsos, arcos e geometria preservados. A regressão específica substitui a expectativa antiga de igualdade do retorno. A janela total NORMAL permanece menor; há tolerância local de um quadro de discretização, sem exigir redução estrita em todo apoio.

`getPhase3ScrollFrame` define trajetória visual contínua pelo progresso horizontal, sem seguir salto/pouso/fada/índice de apoio. Mobile usa escala 0,8 e offset fixo por viewport, sem recentralização ou recuperação de pouso nesse trecho. Narrativa/tutorial/portal conservam transições; câmera lógica e regras de derrota permanecem.

## Arena e dificuldades

Trem → Robô → Dinossauro → Urso; HP da arena 3/4/4/8, menina 3. Legado 2/2/2/4. Corpos sólidos não causam dano por contato; somente golpes ativos ferem. Menina acompanha o lado do inimigo; recuar no chão ativa defesa. Salto/agachamento/golpe/dano interrompem defesa; não há defesa aérea. Touch aceita diagonais e espada simultânea. Ação especial permanece reservada, sem efeito.

NORMAL mantém perfis originais. Espada nominal 209 e mínimo por corpos ×1,1, antecipação 6, contato 6, gesto 18, cooldown 36, recuperação de bloqueio 48. Inimigos posteriores ao Trem respondem com proteção e preparação completa; esquiva abre recuperação. Uma continuação de pressão após acerto inimigo é possível no NORMAL. Urso entra em fúria com HP positivo ≤4 e conserva a flag após cura.

EASY amplia alcance nominal/derivado em 30%, caminhada inimiga ×0,8, investida ×0,85, espera ×1,7, retirada ×1,5, recuperação ×1,55, intervalo de evasão ×1,6 e desativa continuação extra. HP/telegráficos preservados. `ArenaDifficulty` reaplica no restore. Valores e contratos em `docs/arena/GUIA-ARENA.md` e `configuracao-atual.json`; documentos de battle-mode são origem histórica.

## Perseguição: domínio, arte e áudio

`BearChasePhase` adapta dt legado para segundos, acumulador de 1/60 s e contribuição máxima de 0,2 s por update. Domínio puro em `ChaseSimulation`, sem DOM/Three/Web Audio. Sequência BEAR_DOWN → GIRL_APPROACH → BEAR_RISE → CHASE_START → RUNNING → CAUGHT → CHEST_RETURN → COMPLETE. Perder vidas leva a FALLING → GAME_OVER, sem baú. NORMAL tem três vidas; EASY seis. Impactos são a fonte das vidas restantes.

A introdução é ilustrada em Canvas 2D, incluindo quase toque e espada; WebGL começa em CHASE_START. Percurso contínuo com curvas, 720 unidades, seis trechos de avaliação, velocidade crescente. NORMAL usa três brinquedos entre 70–85%; a partir de 85%, dois a cada segundo, corredor amplo e alternância entre faixas vizinhas. Não há grupos de quatro. Emboscadas não interrompem a cadência final; lançamentos preservam reação e não passam do limite útil do percurso. EASY conserva seus grupos/ritmo anteriores. `ChasePacing` e `ChaseCamera` separam ritmo/enquadramento do domínio.

Modelos volumétricos de menina/urso, quinze objetos do catálogo, três arremessáveis (trem/blocos/coelho), decoração fixa ao traçado. Coleta/transporte continuam na Toy Room 2D. `ChasePropResources` compartilha recursos; atlas decorativo consumido v3, urso v2. Variantes aposentadas foram preservadas no diário, sem fallback ativo. GLB da menina é intercâmbio em pose neutra, não fonte da animação. Paleta regional deriva de amostras rastreáveis do sprite da arena, não declara paleta oficial de todas as fases.

`ChaseLighting` combina luz principal/janelas/sombras e preenchimento aproximado; não há GI físico. `Chase.mp3` começa na arrancada, repete integralmente e diminui na captura/queda; passos usam WAVs locais. Emenda musical e mixagem final aguardam escuta.

O piso mantém recorte (27,151), 186×48, de `environment-sheet.png`. `floorTexture` prepara cópia 256×64, RGBA/DataTexture, nove mipmaps explícitos até 1×1, linhas invertidas, sRGB/trilinear e repetição 9×2. Sem nova arte, brilho artificial ou mudança de luz/geometria. O ajuste evita upload DOM e mipmaps automáticos, mas não comprova a causa do preto no Safari. WebGL 2 permite NPOT: não declarar a textura anterior inválida apenas pela dimensão.

## Direção visual e aprovações

Preservar identidade, paleta, proporções, fontes, materiais e geometria natural dos apoios. Não desenhar linhas/barras/réguas de salto ou hitboxes no jogo normal. Exceção do cuco (19) e depuração estão no AGENTS.md. Edição visual não autoriza mudar física, distâncias ou dificuldade.

Menina 3D revisão 3 recebeu aprovação parcial (“Melhorou bastante!”); não registrar aprovação completa. Direção pictórica aprovada a partir do armário não aprova individualmente todos os modelos/texturas. Oito props revisados, urso em volume, novas poses ilustradas e defesa exigem aprovação específica quando ausente. Aprovação da arena anterior não se estende automaticamente a novos recursos. Não restaurar modelos/atlas reprovados por existirem no histórico.

Classificação de 13/10, revisão 366 em `docs/sprite-review/selecoes-exclusao.json`, é histórica: 33 imagens e 46 assinaturas removidas. Não concede autorização para apagar novas artes. Dez PNGs de cenário atual e sete ilustrações reutilizadas estão em `currentScenery.js`; aprovação individual dos novos substitutos não foi presumida.

## Validações anteriores e pendências reais

Resultados completos estão nos registros de cada sessão; não equivalem a execução nova nesta revisão documental. As últimas correções passaram por npm test (pousos), regressões específicas de domínio/navegador, build/assets/lint e verificação de descarte do piso. O navegador usado foi Chrome isolado; entradas podem ser nativas CDP com cenários preparados e relógio controlado. Não confundir isso com campanha humana ou aparelho físico. Falhas intermediárias e correções de fixtures estão preservadas no acervo.

- Piso: usuário viu ausência de textura no Safari. Duas tentativas de acesso foram bloqueadas; Chrome mostrava madeira antes e depois. Pendente recarregar a versão atual e confirmar no Safari do usuário; não declarar resolvido.
- COMPLETE da fuga mantém a fase ativa: falta navegação final. GAME_OVER agora oferece retry próprio da fase; navegação após COMPLETE continua pendente.
- Revisão artística, escuta final e avaliação humana de dificuldade/conforto continuam separadas das verificações automáticas.
- Painéis históricos sob `docs/diario-ia/qa/` estão arquivados. O executor agora recupera código e fixtures dessa pasta no workspace temporário, sem restaurar relatórios/bitmaps. Dependências específicas de cada painel ainda precisam de consulta; antigas URLs não são serviços publicados.
- Não há homologação em hardware físico; recursos/RAF globais de múltiplas instâncias de createGame ainda exigem auditoria.

Último commit anterior a esta equalização: `a34ad748`, local na branch `FEAT-Intro-screen`, reunindo pousos, apoios e compatibilidade do piso. Não houve push/deploy nessa consolidação. Nesta tarefa o pedido é atualizar documentação, sem autorização nova de publicação ou commit.

## Documentação e comandos de referência

Entrada: `docs/README.md`; arquitetura/catálogo completo: `ARQUITETURA.md`; manutenção: `MANUAL-DESENVOLVIMENTO.md`; comandos: `COMANDOS.md`; dependências: `DEPENDENCIAS.md`; contratos: `REFERENCIA-METODOS.md`. Guias de arena, primeiro salto, perseguição e designers descrevem suas áreas. Diário humano recebe decisões de produto, sem logs de máquina. Inventário de sprites é estático: confirmar usos dinâmicos no código.

Comandos específicos recuperados temporariamente: `test:pousos:retorno`, `test:pousos:retorno:browser`, `test:apoios:irregulares`, `test:piso:correcao:browser`, `test:retomada:browser`, `script:test-arena-chase-transition.js`, `test:cadencia-final`, `test:cadencia-final:visual:browser`, `test:cadencia-final:nativo:browser`, `test:bear-chase:route` e `test:bear-chase:props:fidelity`. Usar `npm run journal:qa -- ALIAS`; consultar fonte/portas/requisitos antes. Diagnóstico anterior à correção não substitui regressão atual.

Sessão desta equalização: `20261021T130029-54c11d268b06`. Catálogo atualizado para 148 módulos e referência regenerada com 994 declarações. Mapa reconstruído com 415 imagens, 99 recortes e 29 assinaturas. Resultados reais da revisão documental e verificações finais são registrados no encerramento dessa sessão.

## Derrotas e ajuda na campanha — 21/10/2026

Regra atual do usuário: derrota da fuga deve dizer “A menina não alcançou o urso. Tentar novamente?”. A interface oferece retry da fase, reiniciando sua abertura sem recriar GPU. Derrotas completas de qualquer parte somam no contador persistido da mesma campanha (não por coração). No NORMAL, a cada terceira derrota aparece “deseja tentar no fácil?”. Sim aplica EASY ao estado e às instâncias atuais e salva; Não/Escape preserva NORMAL e permite retry comum. Outra oferta só após mais três perdas; EASY não recebe oferta. Campanha nova zera; debug não contamina save.

Retomada ao aceitar: checkpoint da seção no quarto; mesmo inimigo/HP inimigo na arena, recuperando HP da menina; mesma distância/posição na fuga, seis vidas e imunidade de dois segundos. `CampaignDefeats` guarda contagem e flags de deduplicação/oferta em defaults serializáveis, com migração de saves antigos. Save derrotado recarregado não conta duas vezes. `ToyRoomPhase` notifica a derrota uma vez por estado; `createGame` centraliza contagem/retry/aceite e `main.js` controla a tela/modal, com entradas bloqueadas durante a decisão. As novas regras substituem as pendências anteriores de retry da fuga e a restrição de dificuldade somente no título.

Sessão `20261021T132336-f18478b96f3f`. Fontes de QA em `qa/derrotas-20261021/`, aliases `test:campaign:defeats` (incluído em npm test) e `test:campaign:defeats:browser`. Resultados reais e limites constam do encerramento da sessão.

Validação desta regra: npm test completo, regressão de domínio e matriz de navegador em desktop/retrato/paisagem aprovados. O navegador cobriu soma quarto→arena→fuga, recarga sem duplicação, retry comum, ausência de oferta no EASY, Não/Escape, nova campanha, oferta novamente na sexta derrota, aceite no mesmo adversário/HP inimigo e no checkpoint do retorno, além de aceite com Tab/Enter. Estados de derrota foram preparados; escolhas usaram entradas CDP nativas. Não é campanha humana completa nem homologação física. Capturas das interfaces inspecionadas; identificação/hash/tamanho no acervo, sem bitmaps versionados. Fontes finais de navegador no pacote `20261021T134047-df93cdba432f`.

Falhas intermediárias preservadas: sandbox bloqueou acesso CDP antes da execução autorizada; a primeira fixture mediu posição após a deriva normal da curva, outra conferiu o aceite antes do evento assíncrono close, e a sequência Enter via CDP precisava incluir o caractere de confirmação. Essas fixtures foram corrigidas sem alterar física ou limites. O teste de saves expôs normalização indevida de null para contador zero; migração passou a preencher apenas campos ausentes, rejeitando valores inválidos. Build, 66 recursos, lint, sintaxe e diff aprovados; referência atual com 149 módulos/1005 declarações e mapa reconstruído com 415 imagens/99 recortes/29 assinaturas.

Base local desta implementação: `6caedea4`, branch `FEAT-retry-rule`; o histórico local inclui o merge da tela inicial e o commit de equalização documental. Nenhum commit/push/deploy executado nesta sessão. Confirmação do piso no Safari e navegação após COMPLETE permanecem fora deste pedido.

## Crítica da composição da arena — 21/10/2026

Sessão `20261021T170546-e2f3f96b8052`, por relato atual do usuário de armário sobre janela/flutuando e cenário inconsistente. Análise concluída, sem correção de produção nesta sessão. Diagnóstico em `analises/20261021-arena-composicao-critica.md`; fonte de inspeção no pacote `20261021T170842-a16174be1161`, execução/medições/onze capturas identificadas por hash/tamanho no pacote `0c99a0ac72444f46a84e29d52d5607cd`.

Reproduzidos no renderer real: armário ocupa x=684..1176/y≈272,92..562, sobreposto à janela x=530..1070/y=10..600; cavalinho parcialmente sob o armário; tapete desenhado após móveis encobre partes de suas bases; parede/piso sem planos suficientemente definidos. Tapete 526×326 é desenhado 1840×330 (ampliação horizontal relativa à vertical ≈3,46), com distorção. Câmera por atores reforça a massa/cortes do fundo; botões superiores invadem nome do adversário. Nas transições, renderForeground não é executado porque BattleRenderer só o chama no ramo sem renderPlayer, enquanto a arena instala renderPlayer; instrumentação confirmou zero chamadas. Ponto de transporte do baú ainda usa referência legada diferente do layout ampliado.

Direção recomendada: construir planos e âncoras visuais, liberar a janela, organizar móveis por profundidade, desenhar tapete antes das bases, compatibilizar proporções/câmera/HUD e a frente/ponto de entrada do baú. Manter artes e física inicialmente; nenhuma linha técnica de apoio no jogo normal. Critérios anteriores de números finitos, papéis e atores enquadrados não validam esses defeitos de composição. Aprovação histórica não anula a crítica atual. Correções permanecem pendentes, sem declaração de aprovação artística nova.

Inspeção: onze capturas de estados preparados (quatro inimigos em desktop, retrato/paisagem com urso, visão integral, entrada, extremos de câmera e transformação); todas vistas. Chrome isolado, sem campanha completa ou teste físico. Rotina exit 0 significa coleta concluída, não cenário aprovado. Sem alteração em produção, commit, push ou deploy; suíte de gameplay não repetida por escopo apenas analítico.

## Correção da composição da arena — 21/10/2026

Sessão `20261021T183052-8de244f784ba`, autorizada pelo usuário após a crítica anterior. Substitui a pendência de correção visual acima: janela central livre, móveis ancorados por `footY` e ordenados por profundidade sobre piso contínuo de madeira/rodapé. Tapete desenhado antes das bases, com proporção da arte e projeção vertical 0,7. Panorama mínimo 1100 e reserva superior do HUD compatibilizam cenário, atores e botões. Sem novas artes, alterações de física, hitboxes ou dificuldade.

A origem das transições vem do baú ampliado; sua frente é desenhada sobre os brinquedos e antes da menina, mesmo com renderer personalizado. O perfil legado conserva a origem anterior. Layout/callbacks são reconstruídos no restore.

Removidos os diagnósticos avulsos `analises/20261021-arena-composicao-critica.md` e `qa/arena-critica-20261021/inspecionar.mjs`, após conferir conteúdo/hash no acervo. Fontes, pacotes e registros imutáveis permanecem. Novas regressões também ficam somente no acervo. O executor recupera código/fixtures sob `docs/diario-ia/qa/` em diretório temporário e adapta URLs de módulos `.mjs`/`.cjs`, evitando atingir servidor de desenvolvimento fixo. Os resultados posteriores a essa adaptação foram executados no servidor isolado.

Resultados reais e limitações estão no encerramento desta sessão. Não declarar aprovação artística do usuário, campanha humana completa ou homologação em hardware/Safari a partir das capturas do Chrome.

Validação da correção: npm test passou após a implementação; a margem superior do HUD recebeu depois mais 4 px, cobertos pelas regressões específicas. `test:arena:composicao` passou (planos/bases, projeção, camadas, foreground, legado e 27 enquadramentos). `test:arena:composicao:browser` passou em servidor temporário com porta conferida, renderer real e restore, estados preparados em três formatos. Onze capturas finais foram inspecionadas; metadados no resultado `ebf03a78ac474cd985e28df557f425d5`, sem bitmaps no repositório. Build, 66 recursos, lint, sintaxe dos módulos alterados, teste do diário e equalização documental passaram. Referência: 149 módulos/1008 declarações; mapa: 415 imagens/99 recortes/29 assinaturas.

Falhas intermediárias preservadas: fixture unitária sem perfil `enemies` corrigida; a primeira tentativa do teste de navegador detectou uso da porta fixa. Além da adaptação `.mjs`, o executor precisava detectar “browser” também no alias, pois o nome da fonte em português não o continha. A coleta anterior `d69622009970486fb435d2277a9774e6` não comprova isolamento; foi substituída, para esse fim, pela execução final `ebf03a78ac474cd985e28df557f425d5`. Nenhum commit, push ou deploy nesta correção.
