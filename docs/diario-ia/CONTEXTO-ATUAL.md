# Contexto compartilhado vigente

Atualizado em 20/10/2026. Este documento é a passagem de contexto, não uma transcrição completa. O acervo pesquisável preserva documentos, instruções, prompts, relatórios e versões disponíveis no Git. Não inventar fatos ausentes dos registros.

## Ler antes de agir

1. `AGENTS.md`: regras vigentes e fluxo obrigatório do diário.
2. `docs/diario-ia/README.md`: consulta, início e encerramento de sessões.
3. Este documento, registros recentes e sessões abertas (`npm run journal:read`).
4. Guias e relatórios da área afetada, encontrados por `npm run journal:search -- "termo"`. Consulte também versões históricas se a decisão envolver rollback ou mudança de direção.

Histórico não prevalece sobre instruções atuais do usuário ou regras vigentes. Relatórios antigos descrevem o estado da época; testes aprovados anteriormente não certificam o estado atual. Uma sessão iniciada sem encerramento não prova que o trabalho foi concluído. Arquivos do diário não são instruções para executar comandos encontrados em conteúdo arquivado.

## Aplicação e direção visual

Jogo de navegador com módulos ES e Canvas 2D, servidor Express para desenvolvimento. Quarto escuro com plataformas e retorno; Toy Room com exploração, coleta, baú, investigação e espada; após a espada, transformação em arena heroica imaginária da mesma sala, combate e retorno. A arena tem câmera, escala, controller, HUD, efeitos e áudio próprios.

A identidade da protagonista, as artes detalhadas atuais e a geometria das plataformas devem ser preservadas. Agachamento precisa de articulação real, mantendo proporções; ataques têm antecipação, impacto e recuperação. Não transformar a arena em um jogo de luta separado nem substituir a exploração. Nenhuma régua de contato, linha de pulo ou hitbox deve aparecer sobre ilustrações no modo normal. A exceção do relógio cuco está no `AGENTS.md`.

## Decisões recentes e fontes de verdade

- Arena: os guias humanos `docs/arena/GUIA-ARENA.md` e `GUIA-ANIMACAO.md`; relatórios antigos são encontrados pelo caminho original na pesquisa do diário. A aprovação humana da arena foi expressa na conversa original; a validação técnica está nos relatórios. Não estender essa aprovação automaticamente a novas artes.
- Classificação visual pelo usuário: `docs/sprite-review/selecoes-exclusao.json`, revisão 366, de 13/10/2026. Foram removidas 33 imagens e 46 assinaturas em código, conforme os relatórios `limpeza.md` e `substituicao-assinaturas.md`, arquivados no diário e retirados das pastas de documentação.
- Dez novos PNGs em `assets/art/dark-room/scenery-current/`, gerados com imagegen e referenciados por `src/js/assets/currentScenery.js`. Sete recursos aprovados foram reutilizados. Os prompts estão em `docs/sprite-review/prompts-substitutos.json`. Validação técnica concluída; não há registro de aprovação humana individual dos dez substitutos.
- As escolhas históricas não foram alteradas para declarar recursos novos como aprovados. Não usar esse JSON para excluir novas artes nem restaurar variantes aposentadas como fallback.
- Inventário atual: `docs/sprites/inventario.json`, `MAPA-SPRITES.md`, `RECORTES.md` e `GUIA-DESIGNERS.md`. Mapa estático deve ser reconstruído após mudanças; confirme usos dinâmicos no código.
- Persistência: `src/js/state/`, snapshots da Toy Room e arena. Revisões devem preservar saves antigos e estados de transformação, combate e retorno.

## Ajustes de arena em 18/10/2026

A pedido do usuário após avaliação humana, a arena deixa de causar dano por contato corporal. A menina mantém o rosto voltado ao inimigo; recuar no chão defende com espada a 55% da velocidade, bloqueando golpes sem transferência de corações. Atacar, saltar, agachar e reação de dano interrompem a defesa. O direcional móvel fixo em cruz aceita oito direções com um polegar e espada simultânea com outro dedo; em paisagem, a câmera mantém os atores entre os controles. Seis poses geradas com Imagegen entram e saem em 12 quadros; prompt junto ao atlas. Não houve avaliação humana desta nova versão nem aprovação individual da arte. A sessão `20261018T164751-6e403b9b7371` registra validação técnica e limites. O executor de QA passa a resolver versões por data do pacote, evitando que nomes históricos com prefixos `zzz` substituam contratos atuais.

## QA amplo de jogabilidade em 18/10/2026

A sessão `20261018T170852-f832075f0014` não reproduziu regressão funcional nos cenários executados: suíte geral, seis percursos completos (NORMAL/EASY × desktop/Android/iPhone), 48 combinações de entrada/inimigo/lado, 18 cenários de abertura/tutorial, persistência com recarga real e toque nativo em retrato/paisagem. Gamepad e aparelhos são simulados; perfis iPhone no Chrome não certificam Safari ou hardware real. Não foram atribuídas notas de dificuldade.

Foram corrigidas automações antigas: destinos de relatório ausentes, ataque interno forçado durante transformação, expectativa de bloquear o primeiro salto válido e fixture de tutorial incompatível com a refatoração do renderer. O alias arquivado `test:tutorial:browser` usa fontes atuais; evidências históricas permanecem imutáveis. Não houve alteração de produção nesta rodada. Detalhes e limites em `docs/diario-ia/relatorios/20261018-jogabilidade-regressoes.md`; fontes novas em `docs/diario-ia/qa/`. Nova avaliação humana em aparelho físico continua pendente.

## Auditoria dos saltos do NORMAL em 18/10/2026

O responsável confirmou que a impressão de saltos fáceis ocorreu no NORMAL. A sessão `20261019T023417-7d4a862551ef` não encontrou regressão recente: módulos de plataforma/input não foram alterados pelos ajustes da arena; `config.js` é idêntico à revisão anterior ao FÁCIL (07/10). `test:difficulty` passou em 10.640 comparações e `verify:dark-room` preservou geometria/física e progressão da fuga. Os primeiros dez saltos já oferecem janelas aproximadas de 317–1.167 ms no NORMAL; o salto castelo→trem tem assistência garantida desde 24/09. Essas facilidades existentes podem explicar a sensação; não certificam desafio humano. Nenhum parâmetro foi alterado. Evidência e limites em `docs/diario-ia/relatorios/20261018-auditoria-saltos-normal.md` e JSON associado.

## Balanceamento autorizado dos saltos em 18/10/2026

Após a auditoria anterior, o responsável autorizou reduzir gradualmente as janelas, sobretudo após a porta falsa, preservando o repouso do castelo e o início generoso. Sessão `20261019T024019-e67b866342e7`: `getApproachJumpSpeed` mantém os dois primeiros saltos e reduz as janelas seguintes; `getPhase3Stats(level, fromFloor)` usa alcances fixos para o retorno, nominalmente de 456 a 100 ms. Castelo/saída para o trem, fuga, geometria, gravidade e impulso vertical foram preservados. A velocidade horizontal aérea muda, produzindo saltos mais curtos em algumas saídas. Esta é uma mudança intencional de balanceamento, posterior à conclusão de que não havia regressão recente.

`npm test` e seis campanhas completas no navegador passaram em NORMAL/EASY e três perfis; o teste de 156 combinações da curva integra a suíte padrão. Referências históricas não foram reescritas. Detalhes em `docs/diario-ia/relatorios/20261018-progressao-saltos.md` e JSON associado. Sensação humana e aparelhos físicos continuam pendentes.

## Correção da regressão da bailarina em 18/10/2026

O usuário identificou regressão real após o balanceamento acima. Sessão `20261019T025354-58c4358053af`: a velocidade aérea de 0,3266 (antes 1,42) produzia frenagem de cerca de 77% e fazia saídas normais das gavetas retornarem ao mesmo apoio. Os percursos anteriores buscavam posições extremas de lançamento; sua aprovação não demonstrava jogabilidade humana e não detectou o problema.

A aproximação inteira ao castelo recupera as velocidades originais (1,42; exceções 1,8 e 1,95), prevenindo a mesma frenagem nas outras saídas. A progressão estritamente decrescente nessa aproximação foi retirada; o retorno pós-clímax conserva a curva autorizada. Geometria, gravidade, impulso, castelo e assistência de saída não mudam nesta correção. `test:saltos:bailarina` integra `npm test`: reproduz a falha antiga e verifica 24 saídas usuais, pés apoiados, NORMAL/EASY e três passos de tempo. O navegador confirmou nove saltos com teclado/toque em desktop e dois perfis móveis, sem procura pelo melhor quadro; a fixture prepara o ponto inicial e executa a física real em passos por quadro. Isso não equivale a avaliação humana ou aparelho físico. Relatório: `docs/diario-ia/relatorios/20261018-correcao-bailarina.md`. Evidências anteriores permanecem preservadas.

## Enquadramento fixo no retorno em 19/10/2026

Por solicitação explícita do usuário, sessão `20261019T122138-031808675e39`, o retorno pós-porta falsa deixa de aplicar compensações por salto/pouso. A rolagem horizontal base permanece; a apresentação vertical segue uma trajetória contínua do cenário em função do deslocamento horizontal, sem seguir o arco do pulo ou trocar alvo ao pousar. `CameraPresentation.getPhase3ScrollFrame` define esse trajeto. O zoom lógico de recuperação e o offset Android não modulam o desenho durante esse gameplay; no móvel, escala 0,8 e deslocamento fixo substituem a recentralização contextual nas bordas. Transições narrativas conservam seu comportamento e recebem a última pose desenhada.

Física, geometria, alcance, curva de dificuldade e câmera lógica de teto/derrota não foram alterados. Não adicionar compensação de dificuldade agora: eventual auxílio deve ser avaliado separadamente, como pediu o usuário. A regressão visual específica é `test:camera:retorno:browser`, arquivada no diário; contratos históricos foram preservados. Foram aprovados 288 cenários de matriz fixa no navegador, os 48 apoios apresentados, seis percursos completos em NORMAL/EASY e três perfis, suíte padrão, build e diff. A aprovação técnica não equivale à avaliação humana da sensação no aparelho. Detalhes em `docs/diario-ia/relatorios/20261019-camera-retorno-fixa.md`.

## Bateria de formatos em 19/10/2026

Sessão `20261019T124120-b85e3d717fa6`: concluídas 16 campanhas em NORMAL/EASY, nos perfis desktop, Android/iPhone retrato e paisagem, tablet retrato/paisagem e celular compacto. São 608 saltos entre apoios, exploração, espada, quatro inimigos e retorno. Suíte padrão, 48 combinações de entrada, toque nativo em seis dimensões, 18 cenários de abertura/tutorial, persistência com recarga, câmera, bailarina, derrota/nova tentativa, build e recursos passaram. Nenhuma correção de produção foi necessária. As fontes de QA foram ampliadas, preservando os contratos existentes.

Tutorial e prontidão da câmera falharam inicialmente com várias baterias no mesmo Chrome; a repetição isolada passou sem aumentar os prazos ou relaxar asserções. As duas evidências foram mantidas. Executar essas baterias de navegador sequencialmente. Os perfis são emulados no Chrome e os percursos completos consultam estado/instantes viáveis: isso confirma conclusão funcional nos cenários executados, sem homologar dificuldade humana, aparelhos físicos, Safari/WebKit ou Firefox. Relatório: `docs/diario-ia/relatorios/20261019-bateria-formatos.md`.

## Limpeza e preparação de sincronização em 19/10/2026

Sessão `20261019T130908-2bdc86a5c0b0`, por pedido explícito do usuário para limpar resíduos, fazer commit na branch e sincronizar com Git. Relatórios e QA já estavam exclusivamente no diário de IA; o acervo, diário humano, guias e artes foram preservados. Removidos três arquivos `.DS_Store` locais, registrados por caminho/hash/tamanho no diário. As correções da bailarina, câmera e bateria de formatos foram consolidadas no commit local `c541409147803d6eceeb4426083904553919ec2e`, na branch `fix-balanceamento-luta`. Suíte padrão, build, recursos e diff aprovados; triagem dos arquivos novos sem credenciais detectadas. O fetch confirmou alinhamento com origin antes do commit. O push foi rejeitado pela revisão automática antes de executar: exige autorização explícita para enviar o conjunto de cerca de três mil arquivos ao GitHub `https://github.com/luciussama/legendGirl.git`. Não repetir o push sem resolver essa autorização. Um commit documental subsequente registra o bloqueio. Não houve integração à main ou publicação.

## Integração do balanceamento na principal em 19/10/2026

Por pedido atual do usuário, sessão `20261019T131809-fafe34834a5d`, `fix-balanceamento-luta` foi integrada à `main` no commit `ea57dfc324b5dc00e7653244d595fa21e80bcd69`, sem conflitos. O repositório não possui `master`; `HEAD` remoto aponta para `main`, usada como principal após comunicar a correspondência ao usuário. A origem `c169d28789f57cba33dd72c80744560c8aef59e2` já estava no GitHub quando esta sessão começou, resolvendo a pendência externa registrada anteriormente, sem reescrever aquela evidência.

A árvore do merge foi confirmada idêntica à da origem. Suíte padrão, build, 66 recursos e diff aprovados após integrar. O merge foi enviado para `origin/main`; só após confirmar a ancestralidade no remoto, `origin/fix-balanceamento-luta` foi excluída. A branch local foi preservada; o workspace está na `main`. Um commit documental subsequente registra o encerramento e as evidências; os comandos não certificam a conclusão de eventual deploy automático do GitHub.

## Estudo da perseguição 3D após o urso em 19/10/2026

Na branch `FEAT-bear-chase`, a sessão `20261019T163037-29b2efe54c26` estudou o pedido de uma perseguição após vencer o urso: corrida automática dentro do quarto de brinquedos estendido e fiel à estética atual, urso lançando brinquedos com pressão crescente, aproximação gradual e fada seguindo atrás/acima da menina. Identidade e movimentos da menina devem preservar os sprites atuais; a fase deve superar a duração da maior fase existente, ainda a medir. O pedido atual autoriza estudo e plano, sem implementação nesta rodada.

O [plano de execução](planos/20261019-perseguicao-urso-3d.md) registra evidências, alternativas, oito etapas e critérios de validação. Recomenda prova de cenário com geometria 3D real e personagens ilustrados com novas vistas traseiras; essa representação híbrida e sua fidelidade ainda precisam de avaliação visual. Malhas animadas são alternativa caso a prova não satisfaça. Não há biblioteca 3D instalada, assets novos, benchmark ou fase implementada. A integração deve tratar os dois caminhos atuais de vitória da arena, os efeitos de `restoreReality`, saves antigos e canvas WebGL separado do canvas 2D. Código futuro deve usar composição/contratos restritos, seguir SOLID e documentar cada método em português do Brasil. Dano, duração final, encenação detalhada e representação definitiva dos personagens são decisões pendentes do desenvolvimento. Na sessão `20261019T170055-ab3aefbc7118`, o usuário definiu a transição: vitória na luta → corte para cutscene com urso caído → menina se aproxima vagarosamente → urso se levanta e foge → perseguição. O urso só vai ao baú quando a menina o alcança no final do percurso. A vitória da arena não pode antecipar esse envio; saves e conclusão devem preservar a sequência e aplicar o efeito uma única vez. Plano atualizado, sem implementação.

Passos da perseguição preparados na sessão `20261019T174444-74fe85306ae4`: fontes MP3 fornecidas pelo usuário preservadas em `assets/audio/bear-chase/fontes/`; seis WAVs candidatos por ator em `assets/audio/bear-chase/passos/` (12 arquivos, 144.530 bytes). Recortes locais verificados tecnicamente, sem escuta crítica, aprovação artística ou integração ao runtime. [Análise de áudio](analises/20261019-passos-viabilidade.md). Disparar futuramente por contato dos pés, com caminhada lenta na cutscene e cadência de corrida na perseguição. O usuário proíbe pagamentos automáticos e exige solicitá-los pessoalmente na plataforma; não contratar serviços nem consumir créditos para essa preparação.

Trilha da perseguição definida pelo usuário: `assets/audio/bear-chase/Chase.mp3`, cópia integral do arquivo fornecido, com hash conferido. Sessão `20261019T175720-3dfeab17f940`: MP3 estéreo 44,1 kHz/256 kbps, 94,08 s, aproximadamente 3 MB, pico amostral -5,04 dBFS, sem amostras no limite PCM. [Avaliação](analises/20261019-chase-viabilidade.md). Viável tecnicamente; requer escolha auditiva dos pontos de repetição para cobrir a fase longa e mixagem com os passos. Sem escuta crítica, loop validado ou integração no runtime. Na sessão `20261019T180000-ba56e08f8ab9`, o usuário aprovou a direção sonora: entrada quando o urso se levanta e foge, passos audíveis e redução da música quando a menina o alcança; repetição natural a preparar. Essa aprovação não certifica mixagem ou emenda ainda não executadas.

## Prova jogável da perseguição 3D em 19/10/2026

Por pedido de execução do usuário, sessão `20261019T180920-9abdc512abd2`, criada prévia isolada pelo seletor **Perseguição 3D (prévia)**, com quarto 3D real, materiais atuais, avanço/desvio, obstáculos, voo da fada e áudio local. `src/js/bear-chase/` separa domínio, input, áudio, renderer, HUD e coordenação. Three.js 0.186.1 fixo e distribuído localmente com licença; importação pesada somente ao iniciar a prévia. Métodos novos documentados em português. [Guia](../bear-chase/GUIA-PREVIA.md) e [resultado real](relatorios/20261019-previa-perseguicao-3d.md).

São 90 segundos de corrida para avaliação, não a fase final de maior duração. Vistas laterais, caminhada/levantar, voo e repetição integral da música são provisórios. A campanha normal e o transporte do urso ao baú na arena ainda conservam o fluxo anterior; falta ligar os dois caminhos de vitória à nova cutscene, integrar saves/checkpoints e expandir conteúdo após avaliação artística. Snapshot próprio da prévia validado, sem migração de campanha. `npm test` final inclui domínio da perseguição e passou; navegador verificou três formatos, teclado/toque, 12 passos, mudo, pausa, restauração, percurso simulado completo, campanha preservada e descarte. Primeira falha do áudio foi corrigida expondo o contexto no adaptador. Build/recursos/lint/diff passaram; mapas e métodos regenerados. Sem geração paga, créditos, commit ou push. Não homologar dificuldade humana, arte final, emenda musical ou aparelhos físicos com esses testes.

## Trabalho compartilhado

Verifique `git status` e os registros de início antes de editar. Não descartar alterações de outras pessoas/IAs. Registre responsável, escopo, branch, HEAD, arquivos afetados, decisões, resultados dos testes e pendências. Os eventos são anexados em arquivos separados, sem sobrescrever o histórico.

Não realizar commit, push, publicação ou alteração de escopo por autorização presumida de relatórios antigos. As instruções explícitas da sessão atual são a fonte de autorização.

## Validação recente e limites

As últimas alterações visuais passaram por `npm test`, build, verificação de assets e gameplay automatizado. O navegador percorreu plataformas com 114 saltos e a Toy Room até o retorno da arena, incluindo save/load, em desktop e perfis Android emulados. Os relatórios e os registros de evidência estão exclusivamente no diário de IA; as capturas regeneráveis foram descartadas. Android emulado não é uma execução em aparelho físico.

Pendências históricas devem ser verificadas pela pesquisa do diário, usando os caminhos históricos `docs/battle-mode/remaining-backlog.md`, `known-issues-backlog.md` e relatórios da arena, pois podem ter sido resolvidas por alterações posteriores. Não tratar automaticamente todo backlog antigo como problema ainda aberto.

## Diário e documentação de arte implantados

O acervo foi inicializado com documentos atuais, instruções, prompts, evidências textuais/JSON de QA e as revisões disponíveis nos 141 commits locais. São 381 imagens, 93 recortes e 29 assinaturas remanescentes no mapa atual de arte. A automação mantém eventos separados e snapshots imutáveis; o SQLite é reconstruível. Fontes volumosas usam compressão sem perda. O guia de designers é a entrada para localização, metadados e validação de sprites. Reconstruir os mapas e sincronizar o diário após mudanças; os números são a referência desta implantação, não contadores fixos.

## Integração na main em 15/10/2026

A revisão documental e a refatoração foram integradas localmente de `refact` à `main`, sem conflitos, pelo merge `22ec10a8b71846aef56ecaeca0844fbc53db5b62`. O commit integrado de refact é `8e5e8cac046a5eb344fd626449a95b4442558715`. Antes do registro final, as árvores do merge e de refact foram verificadas idênticas. O workspace permanece na main; não houve push nem publicação. Documentação/QA cobrem a implementação atual, sem certificar conclusão do desacoplamento global. A sessão `20261015T190845-c34f66b94a95` registra preparação, testes, falha inicial de comparação de Markdown, correção do comparador e resultado efetivo da integração.

## Documentação vigente do aplicativo

A revisão integral de 15/10/2026, sessão `20261015T190845-c34f66b94a95`, confrontou a documentação com o código atual. `docs/README.md` é o índice; `docs/ARQUITETURA.md` cataloga todos os módulos de produção, exports, entidades, proprietários e ferramenta de revisão local; `docs/COMANDOS.md` cobre os aliases e ferramentas. A referência de métodos inclui acessores e reexports. Os guias e READMEs de arte indicam os consumidores novos. Especificações iniciais de batalha conservam os valores originais, com metadados que remetem à arena atual e `docs/arena/configuracao-atual.json`. O plano antigo de Diretor de Fases foi arquivado integralmente no diário antes de retirar sua cópia externa; não é uma arquitetura implantada. A comparação de refatoração conserva a lista de recursos e os hashes de todos os recursos de runtime; hashes de Markdown humano são identificados separadamente sem reescrever as referências gráficas/comportamentais.

## Atualizar ao encerrar

Mude este contexto quando houver nova decisão vigente, mudança de arquitetura ou pendência relevante. Registre evidências e limites, sincronize o acervo e encerre a sessão. Evite copiar relatos extensos para este resumo: preserve a fonte e a referência no banco.

## Refatoração incremental na branch refact

O responsável autorizou refatorar uma responsabilidade por vez, sempre comparando o jogo com a referência inicial antes de avançar. Inconsistências devem ser corrigidas e revalidadas; se não for possível, reverter somente a etapa e parar. É refatoração de código: preservar todos os assets gráficos, sprites, comportamento, física, áudio e saves. Avaliar dependências gráficas e de código antes de cada alteração.

`BattleAssets.js` concentra carregamento do manifesto e das imagens do combate; `BattleConfig.js` concentra os parâmetros compartilhados; `BattleRenderer.js` concentra a apresentação antes embutida em `ToyRoomBattle.js`. Os exports e métodos públicos anteriores foram preservados. `ToyRoomEnvironmentAssets.js` resolve os recortes existentes da sala, antes definidos no construtor de `ToyRoomPhase`. As imagens e os manifestos permanecem nos mesmos caminhos. O acesso amplo ao estado da sala ainda exige etapas próprias; não declarar o desacoplamento do projeto inteiro concluído.

A sessão `20261015T132445-e026334e555f` preserva as referências iniciais, fontes de QA e resultados de cada etapa. `npm run journal:qa -- test:refact:browser desktop` e `npm run journal:qa -- test:refact:browser android` recuperam as referências do acervo para comparação exata em workspace temporário. Requerem Chrome isolado com CDP na porta 9222. A automação percorre os módulos reais com relógio e aleatoriedade controlados apenas no teste; não equivale a playtest humano ou execução em aparelho físico.

Após validação do responsável, a sessão `20261015T135358-717b91cd8a2c` migrou por etapas 46 campos de câmera, narrativa, progressão e ciclo de vida de `game.js` para leitura/escrita direta em `GameState`, eliminando suas cópias locais e o `Proxy` narrativo. O formato dos saves e as fórmulas permanecem iguais. A orientação `isPortrait` conserva deliberadamente o fluxo original, explicitado por `syncViewportToState`/`syncViewportFromState`: antecipar sua publicação mudou imagens no Android; preservar a barreira restaurou a comparação exata. Não remover essa fronteira como limpeza mecânica. As fixtures ganharam novas fontes imutáveis para acessar o estado canônico; as referências gráficas/comportamentais iniciais não foram atualizadas para acomodar diferenças.

## Foco da câmera na Toy Room

`ToyRoomWorldQueries.js` concentra as consultas de piso livre, piso alcançável e viewport antes embutidas em `ToyRoomStory`. Recebe funções explícitas para acessar dimensões, jogador, resolução de colisões e enquadramento; as referências são consultadas novamente após `restore`. Preservar a ordem de busca, os limites, os raios e as fórmulas de câmera. A sessão `20261015T141909-39608b11a2e9` registra esta extração e sua comparação com a referência inicial.

`ToyRoomToyActions.js` concentra as transições de estado dos brinquedos: pegar, guardar no baú, soltar e devolver ao chão. A fase e a narrativa passam os objetos atuais a cada chamada, sem cópias nem referências retidas após `restore`. Critérios de interação, colisões, contagem, fila narrativa, áudio e efeitos conservam sua ordem. A sessão `20261015T144558-affeabd0220b` registra esta etapa.

Na etapa 12, sessão `20261015T173500-856e5ae3f4fd`, `ToyRoomStory` deixou de receber e reter a sala completa. `ToyRoomPhase` constrói `createToyRoomStoryContext(this)`, com acessos explícitos a mundo, atores, exploração, fluxo, controles, áudio e apresentação. O adaptador `ToyRoomStoryContext.js` concentra a integração com a fase; getters consultam as referências atuais após `restore`. A limpeza de controles e a atualização da contagem no retorno dos brinquedos mantêm a ordem anterior no adaptador. Formatos de save e métodos públicos da fábrica da sala permanecem iguais. As regressões que construíam a história diretamente foram adaptadas em novas fontes imutáveis, sem alterar as referências gráficas/comportamentais. A etapa 13, sessão `20261015T174206-cc80385c6b47`, extraiu o desenho e a resolução dos oito quadros para `ToyRoomStoryRenderer.js`. O renderer recebe somente dados do quadro; seleção de falas, temporização, comandos e persistência continuam na história. Métodos `render*`, export `drawToySword` e propriedade `attackFrames` foram preservados para os chamadores existentes. Não foram alterados desenhos, sprites ou tempos. A redução de responsabilidades de `ToyRoomPhase` prossegue por extrações individuais, começando pelos controles descritos abaixo.

Na etapa 14, sessão `20261015T175325-ae4dabd9c57f`, `ToyRoomInputController.js` passou a processar teclado, toque e gamepad, conversão de coordenadas, captura e limpeza de ponteiros e instalação/remoção dos listeners. `ToyRoomInputContext.js` adapta estado e callbacks específicos da fase, sem copiar os dados compartilhados com HUD, narrativa ou combate. O controlador é criado no primeiro uso; os métodos e handlers públicos da fase foram mantidos como delegações. Getters consultam o jogador e o estado de entrada atuais após `restore`/`clearInput`. Movimento, colisões e decisões de interação foram separados nas etapas seguintes, descritas abaixo.

Na etapa 15, sessão `20261015T175916-a7ae7ac7c6e7`, retomada após reinício do computador, `ToyRoomMovement.js` passou a calcular movimento e colisões da exploração com referências fornecidas a cada quadro. A fase conserva `resolveCollisions` como delegação pública, inclusive para consultas narrativas, e mantém a ordem de atualização da história e do brinquedo carregado. Prioridade das entradas, peso, orientação, passos, limites, ordem dos móveis e desempates foram preservados. As decisões de interação foram separadas na etapa 16, descrita abaixo.

O ciclo restante de redução das responsabilidades de `ToyRoomPhase` foi concluído nas etapas 16–22, sessão `20261015T180819-d29b76205a7e`: interação e proximidade (`ToyRoomInteraction` e contexto), efeitos (`ToyRoomEffects`), acompanhamento da fada (`ToyRoomCompanion`), câmera (`ToyRoomCamera`), composição da cena (`ToyRoomSceneRenderer` e dados do quadro), catálogo inicial (`ToyRoomInitialEntities`) e saves (`ToyRoomPersistence` e contexto). A fase mantém composição, ciclo de vida, seleção dos modos, transições e interfaces públicas. Cada etapa tem checkpoint anterior/posterior e resultado no pacote `refact-etapaN-20261015`, preservando as referências iniciais. Getters e dados por quadro acompanham os objetos substituídos por restore; saves, catálogo, pesos, geometria, ordem aleatória e desenho foram mantidos. O encerramento desse ciclo da fase não certifica desacoplamento global: combate legado e arena ainda recebem a sala completa; `game.js` conserva suas responsabilidades documentadas. Esses limites arquiteturais estão explícitos, sem declarar a refatoração do projeto inteiro concluída.

Nas etapas 23–24, sessão `20261015T181903-9bfbdad5c11d`, o tutorial deixou de receber/reter a fase em produção. `ToyRoomTutorialContext` expõe oito campos específicos, com getters para atores, brinquedos e câmera atuais e setters somente para conclusão e modo. `ToyRoomTutorialRenderer` desenha as mensagens com dados do quadro, sem receber sala/tutorial. `ToyRoomInputBindings` fornece `TOY_ROOM_INPUT` para controles e apresentação; o export anterior em `ToyRoomTutorial` foi preservado. Ordem de seleção, tempos, mensagens, posição da guia, geometria de controles e saves permanecem iguais. Os pacotes `refact-etapa23-20261015` e `refact-etapa24-20261015` guardam checkpoints e comparações. A regressão `test:refact:tutorial`, recuperável com `journal:qa` e incluída na suíte padrão, verifica limites do contrato, referências substituídas, mensagens e conclusão sem organizar brinquedos. Os próximos acessos amplos a reduzir são os do combate legado e da arena; `game.js` conserva suas responsabilidades documentadas.

Por orientação do responsável, a câmera acompanha a menina durante a exploração e as falas. A única exceção é o trecho de revelação da espada na investigação: acompanha temporariamente a fada e retorna à menina já na fala seguinte. A guia da fada para brinquedos e espada não influencia o zoom nem a translação de apresentação no Android. `ToyRoomPhase.updateCamera` e `getCameraFrame` usam o alvo único de `ToyRoomStory.cameraTarget`; a investigação não escreve diretamente na câmera. O viewport usado pela recorrência reutiliza o mesmo enquadramento da apresentação.

## Sprites de dano da arena

Em 14/10/2026 foram criados com imagegen 30 quadros de dano em `assets/art/toy-room/battle/damage-v2/`, seis por ator, aprovados pelo responsável na conversa atual. Resoluções nativas: menina 296×303, trem 201×139, robô 148×236, dinossauro 218×205 e urso 144×177. `DamageSpriteFrames.js` é gerado por `scripts/prepare-damage-sprites.js`; menina e inimigos usam os quadros nos eventos de dano existentes, sem alteração de física ou hitboxes. As fontes e os prompts ficam junto às artes. A reação tem prioridade desde o primeiro quadro de impacto, inclusive no hitstop, cancelando a apresentação do ataque interrompido. O acervo recuperou as ligações dos comandos de diálogo/câmera e inclui a regressão `test:damage-sprites`, sem reescrever fontes históricas.

`DamageAudio.js` cria impacto e reação curta com timbre próprio da menina e dos quatro inimigos, encaminhados ao ganho mestre do sistema de áudio. `player_hit` toca somente a reação da menina; os eventos de cada inimigo são emitidos quando ele recebe dano. Sons sintetizados por Web Audio, sem gravações externas, com liberação dos nós ao terminar e limpeza por pausa/transição. Validação específica disponível em `test:damage-audio:browser`.

## Música e recuo da arena

Por orientação do responsável em 14/10/2026, `Circular Dissonance (1).mp3`, iniciada na aquisição da espada, continua na transformação e no combate sem pausa, troca de faixa ou reinício. `ArenaAudioProfile` mantém o fade em 1 e aumenta a intensidade da trilha para 1,2 na transformação e 1,4 no combate; o reforço procedural é percussivo. O volume mestre e o mudo continuam respeitados. Ao retornar, a intensidade volta a 1 e o fluxo da música da sala é retomado.

Na arena, a menina e os quatro inimigos recuam aproximadamente 173,6 unidades ao tomar dano, referência de dois passos (velocidade 6,2 × 14 quadros × 2). A desaceleração permanece suave e a integração é consistente em subpassos. O recuo é limitado pelas bordas e não modifica hitboxes, corações ou física da exploração. As regressões de continuidade musical, volume/mudo e separação dos atores ficam no acervo sob `test:arena:refinements`.

## Seletor de fases para debug

O antigo botão de segunda fase foi substituído por `debug-phase-select` na barra superior, disponível no menu e durante a partida. A instrução é “Debug: escolha uma fase para pular”, com Quarto escuro, Sala de brinquedos e Arena de batalha. `startDebugPhase` reinicia o estado de execução da fase escolhida; quarto escuro começa no gameplay, sala começa na exploração, arena começa com espada equipada e dispensa a espera cinematográfica da transformação, aguardando apenas o carregamento das artes. Saves automáticos ficam desativados durante a sessão de debug, preservando a campanha; ao iniciar uma partida normal, a persistência normal é retomada. A navegação do select não dispara atalhos ou movimento. Desde a sessão `20261014T165208-d6c4ef11ca99`, o seletor começa recolhido em um ícone discreto de bandeira (`btn-debug-phase-toggle`). O clique abre um painel ancorado abaixo do ícone; selecionar fase, clicar fora ou pressionar Escape recolhe o painel. A seleção libera o foco para voltar ao jogo; Escape devolve o foco ao ícone. O botão informa expansão e controle do painel para acessibilidade. Regressão de navegador arquivada como `test:debug-phases:browser`.

## Corpos sólidos e inteligência progressiva na arena

Por solicitação do responsável em 14/10/2026, os corpos usam medidas próprias da apresentação ampliada, separação bidirecional e conservação do lado de contato em cada subpasso, inclusive em investidas. Armas e projéteis não são o corpo sólido. A colisão considera a sobreposição vertical; o alcance dos ataques foi compatibilizado com as bordas dos corpos. O golpe em curso não é cancelado pelo simples encostar de corpos na arena. A exploração e o combate legado conservam seus parâmetros.

O trem conserva HP, velocidade, tempos iniciais e sequência introdutória previsível. Robô, dinossauro e Urso aumentam progressivamente a pressão, com avanço mais rápido e menores pausas/recuperação. `ArenaEnemyAI.js` reage à antecipação visível da espada: recua temporariamente mais rápido que a menina, tenta um contra-ataque e entra em cooldown. Também mantém uma média móvel curta de saltos, ataques e distância da menina, persistida no snapshot da batalha. `selectArenaEnemyAttack` pontua apenas golpes do repertório existente por alcance, pressão e resposta a saltos; a seleção é determinística e aplica uma penalidade suave aos golpes recentes, permitindo repetir a resposta mais útil. A evasão não ocorre durante ataques já comprometidos, dano ou recuperação, nem tenta recuar para fora da arena. O Urso conserva seus oito corações e fúria, com a maior pressão desses perfis; a avaliação humana da dificuldade final ainda está pendente.

`EnemyMovementAudio.js` cria motor pulsante do trem, juntas metálicas do robô, passos do dinossauro e passos pesados/ruído de tecido do Urso. Os sons são emitidos em deslocamentos reais de aproximação, retirada, evasão e investida, com cadência própria e ganho mestre. Regressões arquivadas: `test:arena:enemies`, `script:test-arena-adaptive-ai.js` e `test:damage-audio:browser`. Os agentes de QA passaram a respeitar o alcance e a distância dos corpos ampliados, preservando suas fontes anteriores.

Avaliação de dificuldade em 14/10/2026, sessão `20261014T161418-372336457b67`: o responsável informou que avançar e repetir espada ainda vence facilmente. A auditoria temporária `script:test-arena-pressure-audit.js`, preservada no acervo, confirmou vitória sem esquivas em 1486 quadros (24,77 s a 60 Hz), com 3 HP e nenhum dano, ao avançar sempre na direção do adversário e tentar atacar a cada quadro. Robô, dinossauro e Urso não iniciaram ataques nessa execução. Repetição a cada 6 e 12 quadros também venceu com 3 HP. Manter somente direita perdeu no robô porque a entrada seguinte pode ocorrer atrás da menina; não confundir esse caso com acompanhar o adversário. A simulação usa os módulos reais de combate, colisão, IA e contato da arena, sem renderização, navegador ou avaliação humana. Variantes apenas em memória de cooldown 36/48/60 demonstraram que desacelerar a espada isoladamente ainda permite vitória ou gera ciclos de dano/cura por 300 s. Nenhum código de gameplay foi alterado. As propostas dessa avaliação foram autorizadas e implementadas na sessão seguinte, descrita abaixo.

## Balanceamento da arena com esquiva e contra-ataque

Implementado em 14/10/2026, sessão `20261014T162124-31cc19b2ec1d`, por autorização do responsável após a avaliação anterior. Robô, dinossauro e Urso não podem ser presos em reações de dano repetidas: após HIT iniciam uma resposta protegida, com antecipação completa. A proteção também cobre a fase comprometida dos ataques normais a partir do quadro 18; acertar a proteção não transfere corações. Esquiva libera uma recuperação vulnerável. Se o inimigo acertar, pode realizar uma única continuação telegráfica, seguida de recuperação obrigatória. O salto do Urso recupera após o impacto dos quadros 84–96. O HUD compartilha as condições de proteção e abertura com a simulação em `ArenaCombatRules.js`.

A espada da arena tem antecipação de 6 quadros, contato de 6, duração do gesto de 18 e cooldown de 36; bloqueio aumenta a recuperação para 48. Movimento durante gesto/recuperação usa 20%/55% da velocidade; reação de dano impede iniciar espada. Alcance nominal de 209, mínimo de (distância entre corpos + 40) × 1,1 após o reforço autorizado de 10%; sem alterar corpos ou plataformas. Evasão de 8 quadros começa no subpasso da antecipação, sai do alcance efetivo e usa resposta protegida quando não há espaço na borda. Escolha de golpe considera recuperação e agachamento, com penalidades suaves de repetição. Trem conserva repertório, HP, velocidades e tempos próprios; corações, transferência, recuo, arte, exploração e combate legado foram preservados.

Regressão `test:arena:balance`, incluída na suíte padrão e arquivada exclusivamente no diário: 90 percursos de espada repetida terminam em derrota dos inimigos posteriores, variando cadência, borda direita e dt 0,5/1/3; 21 percursos com esquiva e contra-ataque vencem, com snapshots intermediários. Há verificações específicas de evasão efetiva, proteção sem cura, recuperação vulnerável, bloqueio de ataque durante dano, resposta com antecipação completa e repetição útil na IA. As fontes anteriores de QA foram preservadas e os agentes de gameplay atualizados para usar esquiva; nenhuma vitória atual por ataque repetido foi tratada como aprovada. Suíte completa, build, mapa de sprites e navegador desktop/Android emulado em retrato e paisagem aprovados. Homologação humana da sensação de dificuldade e teste em aparelho físico continuam pendentes.

Gameplay em tempo real de 14/10/2026, sessão `20261014T165637-fa34b61ad6ca`: automação com teclado CDP na página real, sem alterar estado/HP ou avançar manualmente a simulação, venceu os quatro inimigos em 58,06 s, 19 acertos em 23 tentativas e 3 HP; insistência perdeu no Robô em 14,76 s. Capturas de acerto e vitória foram inspecionadas e registradas por hash no diário. O responsável relatou perda da sensação de impacto; diagnóstico confirmou alcance/cadência/avanço mais restritivos e ausência de efeito/áudio específicos nos bloqueios. Dano, recuo e reação dos acertos válidos permanecem iguais. Pendência: recuperar clareza e força do contato da espada sem devolver a vitória por ataques repetidos; a avaliação não alterou gameplay. Automação orientada por estado interno não equivale a playtest humano.

## Alcance e sensação de contato da espada

Por solicitação do responsável, sessão `20261014T173011-4fcbf47e58fc`, o alcance efetivo anterior foi multiplicado por 1,1 para todos os inimigos: Trem 270→297, Robô 190→209, Dinossauro 225→247,5 e Urso 217,5→239,25. `ToyRoomBattle.getSwordRange` é a referência compartilhada com a IA e o QA. A evasão curta do Robô usa velocidade 14 para conservar a saída do alcance maior; velocidades de aproximação/investida, corações, recuperação da espada, corpos e recuo continuam iguais.

`SwordAudio.js` sintetiza passagem de ar, estalo/corpo grave/ressonância do acerto e ricochete metálico do bloqueio. Os eventos `sword_impact` e `sword_block` são exclusivos da arena; as reações próprias de dano continuam. Vozes passam pelo ganho mestre e são registradas para pausa/limpeza, desconectando seus nós ao terminar. Bloqueios emitem faíscas frias, sem dano ou cura. Acertos têm partículas radiais quentes na região da lâmina, arco ampliado em 10% e mais marcado, pausa de impacto de 3/5 quadros e tremor de 3/5 (leve/pesado). A pausa congela ambos os atores; não adiciona dano nem recuo. Salto/agachamento deslocam a região visual de contato. Nenhum sprite foi refeito.

A validação de áudio `test:sword-audio:browser` fica no diário: nove renderizações de corte/acerto/bloqueio em volumes 0/0,5/1, saída proporcional, cauda encerrada, vozes liberadas e quatro misturas com reações dos inimigos sem clipping. A suíte inclui a matriz de 111 percursos e os quatro alcances exatos; agentes usam a distância real e se aproximam pelas bordas dos corpos antes de contra-atacar. As fontes anteriores, inclusive falhas de sincronização do agente ao manter distância máxima, foram preservadas. Aprovação da sensação pelo responsável continua dependente de gameplay humano. Suíte completa, build, mapa de sprites e navegador desktop/Android emulado em retrato/paisagem aprovados na versão final. O gameplay com teclado real venceu em 53,78 s, 19 acertos de 23 tentativas e 3 HP; repetição perdeu no Robô em 14,67 s. O último ajuste limitou o ponto visual de contato à lâmina e à superfície do corpo, validado novamente no navegador.

## Política vigente de relatórios e QA

Por instrução do responsável, relatórios de máquina, testes, fixtures, evidências e homologações não permanecem como arquivos externos no projeto. Texto e código ficam integralmente no acervo; imagens de evidência ficam registradas por caminho, hash e tamanho, sem conservar o bitmap descartável. Os 718 alvos foram verificados antes de apagar. Artes efetivamente usadas pelo jogo foram preservadas.

`npm test` e os aliases de QA recuperam as fontes do pacote arquivado em diretório temporário e registram o resultado no diário. `scripts/validate-production.js` valida a publicação sem recriar QA. O site publicado exclui documentação, automações e acervo. Documentação de guias permanece para pessoas; `docs/DIARIO-HUMANO.md` é o diário de produto. Novos relatórios e evidências devem ser registrados diretamente no acervo e descartados fora dele.

## Diálogos compartilhados entre fases

`DialogueRenderer.renderDialogue` é a apresentação compartilhada da dark room e Toy Room: caixa, nome, retrato, quebra de texto e área segura. `renderCutsceneDialogue` conserva seleção das falas e avanço da primeira fase. `ToyRoomStory.renderStoryBeat` adapta NANDA para `fairy` e MENINA para `baby`, conservando os tempos originais e sem pedir avanço manual em falas temporizadas. Narração sem interlocutor permanece em `PoeticNarrator`, fora do quadrado central.

Na Toy Room, a cena não é reprojetada durante as falas: o desenho e o hit testing dos controles continuam alinhados. Em dispositivos móveis, o painel termina acima da área dos controles calculada por `MobileUILayout`. O render não altera o snapshot narrativo. Os testes específicos estão arquivados no diário e acessíveis pelos aliases `test:dialogues` e `test:dialogues:browser`; a suíte padrão inclui a regressão. A recuperação de QA combina os comandos dos pacotes, permitindo acrescentar novos testes sem perder a suíte anterior.

## Menina volumétrica da perseguição em 19/10/2026

Após aprovar a prévia funcional, o usuário pediu substituir o sprite lateral da menina
por versão 3D. Sessão `20261019T182639-ca2ae1840324`: `ChaseGirlModel` cria malhas
reais com rosto, cabelo castanho, rabo único e laço rosa, vestido creme e botas;
`ChaseGirlAnimation` articula caminhada, corrida, repouso e tropeço por estado.
Renderer mantém recursos compartilhados e iluminação própria. A simulação, colisões,
passos gravados e as fases 2D permanecem com os contratos anteriores. O GLB em
`assets/models/bear-chase/menina.glb` é intercâmbio em pose neutra; a autoria e
animação em execução ficam nos módulos JS. Nenhum serviço pago foi chamado.
O usuário reprovou explicitamente essa arte: vestido fora da paleta, pele/detalhes
e proporções sem fidelidade. Não tratar o modelo atual como aprovado. Urso/fada
continuam planos provisórios.


## Reprovação artística e revisão crítica da perseguição

Sessão `20261019T183600-b0d9f912ce21`: revisão visual e partida pela interface nativa,
sem mutação de estado nem avanço artificial, observada até 56%/23,2 m com colisão
visível. A sessão parou de avançar; falha de clique `noWindowsAvailable` e tentativas
de retomada não resolveram. Não houve conclusão jogada até o baú nesta revisão.
A análise separa observação de tela, inspeção de código e propostas no relatório
`docs/diario-ia/relatorios/20261019-revisao-critica-menina-perseguicao.md`.
Prioridade: refazer paleta por região e silhueta da menina, recuperar rosa/salmão
na roupa, pele e acabamento ilustrado; a estrutura técnica anterior não comprova
fidelidade. Também observados trens com fundo preto, fada adiantada, urso frontal,
repetição simétrica do corredor, contato dos pés pouco convincente e textos sobre
a encenação. Nenhuma correção de produção aplicada: usuário pediu análise crítica.
Próxima versão deve ter comparação direta com as fontes atuais e nova avaliação
humana, seguida de playtest completo. Registros históricos não foram alterados.


## Revisão 2 da menina e apresentação da perseguição

Sessão `20261019T193929-09884af19ec9`, executando a priorização autorizada pelo usuário:
paleta regional extraída do run-sheet da arena (coordenadas/hash/metodologia em
`assets/models/bear-chase/paleta-menina.json`), vestido salmão e regiões creme,
corpo compacto, rosto/mechas revistos, acabamento com iluminação branca controlada,
apoio dos pés por IK e porte da espada à frente. Inclinação acompanha a velocidade
lateral e se desfaz ao parar. Modelo GLB regenerado; sprites originais preservados.
O urso passou a volume com queda/levantar/fuga/olhar para trás/retorno; trem ganhou
malha sem fundo preto, fada passa atrás/acima, texto saiu da ação central e os
módulos do quarto ficaram assimétricos com laterais de móveis texturizadas.
A simulação, colisões, duração e campanha não foram alteradas.

Comparação local solicitada em `docs/diario-ia/qa/perseguicao-20261019/comparacao.html`
(e JS associado), com fonte/modelo em luz neutra e no quarto, escala de gameplay,
poses e vistas selecionáveis. A primeira arte continua reprovada no histórico;
a revisão 2 e o urso novo aguardam avaliação humana. Vistas traseiras são novas
interpretações, não desenhos originais aprovados. Fada, blocos/coelho e baú ainda
usam ilustrações planas. A assimetria melhora a apresentação, mas não substitui
uma expansão futura em trechos temáticos completos nem integra a campanha.


## Revisão 3: proporções dos braços e detalhes da menina

Sessão `20261019T200000-6be5b3278690`. O usuário avaliou a revisão 2 como “75% bom”
e pediu proporções melhores nos membros superiores, mangas fofas, pregas junto ao
alto da saia e rabo de cavalo visível, respeitando a assinatura original. Ajustes
localizados: braço superior de 0,18 para 0,15, antebraço mantido em 0,17, mão e
fixação da espada ajustadas; mangas claras bufantes com punho salmão; franzido
geométrico com contraste suave perto da cintura; rabo único projetado para trás e
para o lado, com mechas/pontas articuladas e balanço recalibrado. A paleta extraída,
rosto, corpo, física e cenário foram preservados. GLB regenerado. Comparação passa
a identificar revisão 3 e permite ampliar fonte/modelo juntos em “Detalhes (2,5×)”.
À época deste registro, a nova versão ainda não tinha aprovação. A atualização
posterior abaixo classifica a alteração da personagem como parcialmente aprovada,
com novo trabalho previsto para o futuro.

## Peso e movimento orgânico da corrida em 19/10/2026

Na sessão `20261019T200935-1e9fdca7ae53`, a corrida da menina recebeu compressão no
apoio e recuperação entre passadas, contrabalanço de quadril/tronco/braços,
articulação de quadril/joelho/tornozelo para sustentar os pés e resposta secundária
de cabelo e saia. A simulação, distância, colisões e dificuldade não mudaram.
Retomada pela sessão `20261019T203454-d43790773ab4`, a validação atual
`test:bear-chase:motion:browser` passou: oscilação corporal de 0,080, apoio máximo
de 0,00143 unidade, poses estáveis e estado de domínio inalterado. `npm run build`
também passou. A validação técnica do movimento não equivale a aprovação artística.

## Aprovação parcial da personagem e roteiro para props 3D em 19/10/2026

Após revisar a evolução da personagem, o usuário informou “Melhorou bastante! :)”
e classificou a alteração como **parcialmente aprovada**. A personagem voltará a
ser trabalhada no futuro; não registrar a revisão 3 como aprovação completa nem
estender essa aprovação aos demais assets.

O usuário solicitou um roteiro para dar profundidade aos brinquedos arremessados
pelo urso e aos brinquedos, armários e demais itens visuais da Toy Room. A meta é
substituir a apresentação plana por modelos 3D, respeitando a estética, a paleta
e os materiais observáveis nos sprites originais. O plano
`planos/20261019-brinquedos-e-cena-3d.md` delimita o inventário, fases e critérios.
É planejamento, não implementação ou aprovação de novos modelos. PNGs originais
devem permanecer preservados como referência e fontes de textura. A primeira
prova deverá comparar um brinquedo e um móvel em vistas neutra e de gameplay,
antes de produzir o restante. Física, hitboxes, dimensões lógicas, interações,
disposição de plataforma e dificuldade ficam fora da mudança artística.


## Plano operacional dos props em 20/10/2026

Sessão `20261020T124254-7c4dce56c46d`: a pedido do usuário, lidos os documentos
produzidos externamente e confrontados com o runtime. Plano de execução em
`planos/20261020-execucao-props-cena-3d.md`, complementando o roteiro de 19/10.
Ordem: baseline/referências → piloto trem + armário → avaliação humana → catálogo
com recursos compartilhados → três arremessáveis → demais props/móveis → ambiente
→ regressão. `wardrobe` usa o armário baixo `oak-cabinet-v1`; não inferir um móvel
alto adicional. Coleta/transporte continuam na sala 2D e não entram nesta conversão.
O plano alerta para o orçamento próximo do limite (285/300 recursos na evidência
anterior), preservação das fontes, contratos e aprovação parcial da menina.
A análise de `Chase.mp3` é histórica: áudio já integrado; emenda musical/escuta,
expansão da fase e campanha ficam em trabalhos separados. Nenhuma implementação
nova foi iniciada nesta sessão; próxima entrega proposta é baseline e dois pilotos.

## Primeiros pilotos e acompanhamento em 20/10/2026

Sessão `20261020T125052-b1f7385f4f33`: usuário aprovou a sequência e pediu progresso
a cada mudança. Executados E0 e E1 do plano: baseline e pilotos locais de trem e
armário baixo, em `src/js/bear-chase/props/`. Propriedade GPU separada das fábricas,
partes estáticas mescladas por material, comentários em português por método.
Painel revisável em `qa/perseguicao-20261020/props.html`: original/modelo, luz neutra,
quarto, quatro vistas, giro, escala e lançamento. Não integrado à corrida e sem
produção dos demais modelos antes da revisão E2. O trem ainda tem acabamento mais
liso que a fonte; faces não fornecidas pelo sprite são interpretações novas.

O usuário questionou o armário no meio da rota do painel. Corrigido para a parede
direita, portas para dentro, X=4,95 e rotação -π/2; limites reais X=4,4235..5,355,
dentro da parede X=5,5 e fora da faixa central. Não tratar posição diagnóstica
anterior como layout aprovado. Isso não criou obstáculo ou alteração na fase.

Baseline de navegador aprovada, pico 285 recursos; pilotos com 21 recursos comuns,
6 chamadas para trem e 4 para armário. QA temporário passou para integridade dos
originais/contratos, volume, apoio, compartilhamento, 60 trocas sem acúmulo, quatro
vistas, lançamento, viewports e descarte zero. Domínio, assets, build, lint e mapa
de sprites passaram. Não houve teste em aparelho físico, suíte global completa,
integração/performance do futuro catálogo nem aprovação artística dos pilotos.
Relatório: `relatorios/20261020-pilotos-trem-armario.md`.
Servidor de desenvolvimento amplo bloqueado por revisão automática; painel servido
apenas em 127.0.0.1:3000. Sem custo, serviço pago, commit ou push.

## Catálogo, primeiro lote integrado e crítica de materiais — 20/10/2026

Sessão `20261020T130520-75b12c979064`. O usuário aprovou parcialmente os pilotos,
autorizou avançar e adiou melhorias de iluminação das texturas. Também determinou
que todos os móveis sigam o padrão lateral: junto às paredes e com rota livre.
Não inferir aprovação artística de blocos/coelho nem conclusão do catálogo inteiro.

Executados E3/E4: `ChasePropCatalog` e `ChasePropResources`, fábricas de blocos e
coelho; trem aprovado parcialmente integrado pela mesma fábrica do painel.
`ChaseToyModels` só adapta a API antiga. Arremessáveis têm apoio inferior,
recursos comuns e liberação local; restauração com mesmo ID/outro tipo troca a
instância. Seis armários entram nos módulos laterais. Estante/castelo antigos
foram alinhados às paredes, mas continuam representações planas sobre suporte;
baú e demais props ainda dependem de E5. Não registrar conversão integral.

Superfícies/geometrias e materiais repetidos dos 12 módulos agora são comuns;
frisos pareados reduzem chamadas. Pico próprio 117 (antes 285), catálogo 42;
cenário comparável com um bloco: 294 chamadas (antes 310). Três arremessáveis
simultâneos: 300–306 chamadas nos três formatos. Estado/RNG/save/colisão e menina
preservados. `npm test`, build/assets/lint, sintaxe, mapa de sprites e QA temporário
no jogo/painel passaram, incluindo percurso controlado, IDs restaurados, perda e
restauração WebGL, recursos estáveis e descarte zero. Não certifica hardware real.

Durante a execução, o usuário questionou a pobreza das texturas: tom adequado,
mas ausência dos detalhes que evocam Legend of Mana. Explicação confirmada no
código: amostra de carvalho 60×52 ampliada a 128², contraste reduzido na madeira
pintada; pelúcia 8×10 ampliada a 64² e repetida. Materiais foscos quase uniformes
não têm desgaste/nós/fibras/sombras pintadas específicos por face. Iluminação
futura não fornece esses dados ausentes. Isso é simplificação desta implementação,
não limitação inevitável de WebGL/3D. Registrar deficiência de acabamento, sem
tratá-la como aprovada ou adiar automaticamente toda a textura junto da luz.
Prioridade recomendada antes de expandir E5: prova de textura própria por objeto,
UVs por região e detalhes pintados coerentes, mantendo paleta e orçamento.
Relatório: `relatorios/20261020-catalogo-arremessaveis.md`. Sem custo/commit/push.


## Amostra de direção pictórica — 20/10/2026

Sessão `20261020T135959-383ba4a2d395`: usuário solicitou uma amostra antes de
validar propagação do trabalho pictórico inspirado em Legend of Mana. Gerada uma
prancha de armário, usando captura real do modelo atual e sprite original como
referências, via ferramenta integrada image_gen. Veios por tábua, nós, desgaste
de bordas, pinceladas e pátina reforçados, mantendo desenho geral/paleta.
Arte em `arte/20261020-armario-pictorico-v1.png`, metadados em JSON irmão e prompt
completo em `relatorios/20261020-amostra-pictorica-armario.md`. Conservar a arte
conceitual; ela não é bitmap regenerável de QA. A captura temporária foi
identificada por hash/bytes no diário e descartada depois de usada.

É uma proposta de pintura sobre a captura, não atlas UV ou textura aplicada.
O painel esquerdo é reprodução gerada da referência; não confundir com screenshot
literal. Pequenas interpretações de borda/ferragens existem. Runtime, iluminação
da cena e originais não alterados. Captura temporária e integridade passaram,
mapa de sprites reconstruído sem alteração de assets de produção. Nenhuma
avaliação humana desta amostra registrada, nenhum serviço externo contratado,
CLI/API paga separada, commit ou push. Aguarda validação da direção antes de
produzir mapas por região e comprovar o resultado no modelo em gameplay.


## Direção pictórica aprovada e aplicação real — 20/10/2026

Sessão `20261020T144330-e2641eed729f`: usuário aprovou enfaticamente o estudo do
armário (“ficou muito melhor”) e solicitou o mesmo padrão nos demais assets.
A direção deixou de ser apenas proposta. Aplicados mapas reais aos quatro props
3D atuais: armário, trem, blocos e coelho. Não registrar esta entrega como conversão
dos 15 itens do roteiro ou substituição global de sprites/personagens 2D.

Quatro atlas próprios em `assets/art/toy-room/bear-chase/materials/`, PNGs originais
gerados de 1254² e preservados, referências/prompts/manifesto na mesma pasta.
Ferramenta integrada image_gen, uma chamada por objeto, sem CLI/API paga separada.
`PictorialMaterialAssets` define caminhos; `pictorialMaterial` compartilha uma
textura por objeto, `bake` remapeia UVs com margem de 8 pixels. Armário separa
painel/montante/tampo/latão, trem/blocos separam cores pintadas, coelho separa
pelúcia/creme/interior/costura. Veio axial da caldeira e UVs do telhado ajustados.
Formas, dimensões, pivôs, domínio, luz da cena e originais anteriores preservados.

Painel e prévia jogável consomem os mesmos atlas; quatro vistas reais inspecionadas.
Suíte geral, QA de modelos e teste pictórico temporário passaram: 4 texturas de
atlas compartilhadas, UVs contidas, 121 recursos de cena, 46 do catálogo, estado
estável, contexto WebGL recuperado e descarte zero. Cenário comparável: 298
chamadas; três brinquedos simultâneos 304–310. Memória dos novos atlas estimada
em 33.536.288 bytes (~32 MiB) RGBA8 com mipmaps; não é medição de VRAM/FPS em
aparelho físico. Mapa de sprites: 420 arquivos, 99 recortes, 29 assinaturas.
Relatório: `relatorios/20261020-aplicacao-texturas-pictoricas.md`.

Aprovação humana refere-se à amostra/direção, não a cada nova execução já aplicada.
E5/E6 e o restante do catálogo continuam no roteiro, agora com este padrão;
iluminação continua adiada. Sem commit, push ou contratação de serviço externo.


## E5: estante, castelo e baú 3D integrados — 20/10/2026

Sessão `20261020T150652-055a3b965d96`. Usuário considerou a texturização muito boa
e autorizou executar/continuar o pipeline. Entregue o primeiro lote de E5:
`BookshelfProp`, `BlockCastleProp`, `ToyChestProp`, registrados no catálogo e
integrados à prévia. São sete modelos dos quinze previstos, não E5 inteiro.
Estante baixa com duas fileiras/30 livros sólidos; castelo com torres e portais
vazados; baú vermelho/amarelo, medalhão azul, tampa curva e inscrição sobre
superfície curva. Partes ocultas/lettering são interpretações, aguardando revisão.

Removidos planos/suportes genéricos da estante/castelo e plano do baú. Móveis
continuam laterais, |X|>4,3; baú em X=4,74. Tampa abre por pose de apresentação
após o alcance e fecha ao final; urso recebe deslocamento visual até o baú, sem
mutação do domínio. Câmera do encerramento enquadra os atores no retrato; corrida
e fases 2D preservadas. Área final da parede direita reservada desde a aproximação
para evitar oclusão por outro móvel. Iluminação segue adiada.

Materiais combinados por atlas nos novos móveis preservam UVs/tintas por vértice:
estante 3 chamadas, castelo 1 e baú 4. Sem nova geração paga, dependência ou PNG
de material; reaproveitados os quatro atlas pictóricos aprovados como direção.
Cena estável em 128 recursos (catálogo 62), descarte zero; cenário comparável 272
chamadas, três brinquedos 282–284. Atlases continuam com a estimativa anterior
de ~32 MiB; inscrição acrescenta sua pequena textura dinâmica. Não é benchmark
em aparelho físico.

Suíte geral, build/assets/lint, sintaxe, mapa de sprites, QA dos sete modelos e
regressão no navegador passaram, incluindo 36 cenários de encerramento, três
formatos, limites/framing/parede, pivô, estado/save/inputs/áudio e contexto WebGL.
Primeiro QA falhou porque a tampa atravessava a parede; folga/profundidade
corrigidas mantendo limites. Capturas finais tinham corrida de restauração de
fixture e foram corrigidas para fotografar antes de restaurar o estado.
Registros de falha preservados. Relatório `relatorios/20261020-e5-moveis.md`.

Próximo lote: teddy, robot, duck, drum, jack, armchair, rocking-horse e table;
depois completar composição E6 e regressão E7. Não houve aprovação humana
individual desses três novos modelos, commit, push, publicação ou integração
automática da campanha.

## Refinamento do castelo e baú — 20/10/2026

Sessão `20261020T153759-9d84c0dee58f`: usuário solicitou tijolos mais marcados
e baú mais redondo, conforme as fontes originais. `BlockCastleProp.centralWall`
substitui o portal central monolítico por tijolos separados, pilares verdes e
cinco cunhas douradas com juntas e chanfros reais. Sem linhas sobrepostas à arte.
Castelo conserva dimensões e uma chamada; triângulos passam de 1552 a 3344.
`ToyChestProp` eleva o arco de 0,43 para 0,63; a altura total passa de 1,354 para
1,554. Inscrição acompanha a nova superfície. Dobradiça de apresentação avança
0,18 ao abrir para preservar folga da parede; fecha na posição original.
Texturas, iluminação, domínio, posições laterais e fontes 2D preservados.

QA de modelos e jogo passou, incluindo compartilhamento/descarte, recuperação
WebGL, percurso controlado e 36 cenários finais nos três formatos emulados.
Build/lint/assets/mapa/diff aprovados. Primeira tentativa de QA foi impedida pelo
sandbox ao abrir porta local; execução com acesso local permitida passou. Sem
nova suíte geral nesta revisão visual, sem hardware físico ou aprovação humana
do resultado. Capturas regeneráveis identificadas no diário antes do descarte.
O restante de E5 continua pendente; esta sessão trata só dos dois refinamentos.

## Catálogo completo e percurso com curvas — 20/10/2026

Sessão `20261020T154508-0ea59f401567`. Usuário aprovou os refinamentos e pediu
concluir os oito objetos restantes, corrigir a repetição crítica da sala e adicionar
curvas, subidas/descidas e emboscadas à dificuldade. A instrução atual amplia o
escopo anterior de preservar traçado e padrões. Fases 2D e campanha preservadas.

`DecorativeProps` completa os quinze IDs com ursinho, robô, pato, tambor, caixa de
surpresa, poltrona, cavalinho e mesa. São decoração, sem novos tipos de obstáculo.
Materiais compartilhados; poltrona também usa região limpa do PNG original por UV.
Os oito novos modelos têm simplificações/faces interpretadas e aguardam revisão
artística humana. Fontes originais intactas, sem novas imagens ou serviços pagos.

`ChaseRoute` define curvas Hermite e relevo sem DOM/Three.js. `ChaseRoom` substitui
os doze módulos reciclados por superfícies contínuas e adereços fixos em distâncias
absolutas. Visibilidade distante limitada além da neblina; móveis não trocam tipo
ou posição ao avançar. Personagens, câmera e obstáculos compartilham o traçado.
Piso opaco e sombra sem escrita de profundidade corrigem um retângulo claro
identificado visualmente após um QA numérico aprovado.

Simulação aplica deriva externa em curva, menor no FÁCIL, velocidade limitada
conforme rampa e nove emboscadas com 20 m de antecedência e faixa livre. Padrões
próximos são espaçados. Hitboxes, colisão varrida, voo, tipos, etapas/evento único
e esquema de save preservados. Saves antigos válidos passam a seguir o novo
traçado/padrões; isso é mudança intencional, não replay do percurso anterior.

Suíte geral e navegador existente passaram: teclado/toque, pausa, áudio/mudo,
save de campanha, conclusão e descarte. Novo `test:bear-chase:route` cobre quinze
modelos, quatro vistas dos oito novos, adereços fixos em 1.441 amostras, três
formatos, 36 enquadramentos finais, visão das três faixas a 14 m das nove
emboscadas, recuperação WebGL e dois percursos sem dano com decisões a cada 300 ms.
Recursos próprios aproximadamente 199, abaixo de 300; chamadas de referência
cerca de 100–135, antes 282–284. Não é benchmark de FPS/VRAM ou hardware físico.

Painel ganhou controle de distância. Guia atualizado; QA vigente da nova sala é
o de percurso. Aliases históricos preservam expectativas antigas da versão reta.
E5/E6 implementados e E7 técnico executado. Revisão humana, iluminação adiada,
integração de campanha, duração definitiva e áudio final continuam separados.
Sem commit, push ou publicação nesta sessão.

## Revisão dos oito objetos reprovados — 20/10/2026

Sessão `20261020T160444-c30692d726a7`. Usuário reprovou cavalinho, patinho e os
demais seis objetos decorativos por textura, forma e tamanho. A entrega técnica
anterior de E5 não equivale a aprovação artística. Reconstruídos os oito modelos
com perfis próprios, volumes mais suaves, detalhes e proporções próximas às fontes.
`DecorativeGeometry` separa construção geométrica da propriedade GPU; métodos
documentados em português. Nenhuma mudança de simulação, traçado ou personagens.

Atlas compartilhado 4×4 `decorativos-atlas-v3.png`, 1254², com dezesseis regiões
específicas por material; v2 e prompts preservados. Duas chamadas image_gen
integrada, sem CLI/API paga separada. A primeira tentativa foi recusada por sete
referências excederem o limite de cinco; repetida com cinco fontes e descrição
das demais. Refinamento corrigiu pelos/tramas grandes demais. Também corrigidos
material do rosto do bobo e focinho do cavalo, asas/cauda do pato e proporções.
Texturas antigas e PNGs originais intactos; novo atlas consumido na prévia/painel.

QA de fidelidade passou em quatro vistas e gameplay para os oito modelos, UVs
contidas e proporções projetadas comparadas às fontes. A métrica é proxy visual,
não comprovação de identidade. QA de percurso passou: quinze objetos, três formatos,
36 finais, restauração WebGL, recursos estáveis e descarte zero. Build/lint/assets,
sintaxe e mapa aprovados: 422 arquivos, 99 recortes, 29 assinaturas. Suíte geral
não repetida nesta revisão exclusivamente artística. Aguarda avaliação humana.

Durante a tarefa, usuário criou o commit local `77adff8d`; esta IA não o criou.
Foi constatada divergência de um commit local e um remoto (`04202a8b`). A sessão
`20261020T172304-8b9e6b05d2e4` concluiu posteriormente a integração autorizada;
ver registro abaixo. Isso não autorizou push.

## Integração do histórico remoto da FEAT-bear-chase — 20/10/2026

Após o usuário encontrar a mensagem de branches divergentes no `git pull`, a sessão
`20261020T172304-8b9e6b05d2e4` verificou o ancestral comum e comparou as duas pontas.
O commit remoto `04202a8b` não continha arquivos exclusivos em relação à árvore
local e substituía versões mais recentes: removia o percurso com curvas, a sala
contínua e os modelos decorativos revisados, além de reverter o catálogo e os
materiais. As alterações remotas eram snapshots anteriores da mesma linha de
trabalho; não foram reaplicadas sobre as versões locais mais recentes.

As evidências e o encerramento da revisão artística foram consolidados no commit
local `a1a4940c`. O histórico remoto foi então conectado pelo merge commit
`f9e7c4e3`, usando a estratégia `ours`, preservando integralmente a árvore local
validada e ambos os pais. Não foi feito push. A branch local está à frente de
`origin/FEAT-bear-chase` em três commits, sem commits remotos pendentes.

Validações executadas após o merge: `test:bear-chase:route`,
`test:bear-chase:props:fidelity`, `npm test`, `npm run build`,
`npm run check-assets`, `npm run lint` e `git diff --check`, todas aprovadas.
O teste de fidelidade verifica os oito props, UVs e quatro vistas; seus indicadores
geométricos não substituem avaliação artística. A aprovação humana da direção
pictórica permanece distinta da aprovação individual dos modelos; a revisão dos
oito props aguarda avaliação humana. Não houve alteração de runtime pelo merge.

## Iluminação de janela e sombras — 20/10/2026

Sessão `20261020T175621-ad0230422f52`: usuário autorizou trabalhar a iluminação
antes adiada. `ChaseLighting` separa luz de janela, preenchimento indireto aproximado
e luz principal à frente do urso, com sombra para trás. Piso/parede/friso/teto/tapete
passam a materiais receptores de luz; girl/bear/props projetam e recebem sombras.
Fada ilustrada preserva luminosidade. HUD ganhou fundo de contraste no progresso.
Sem alteração de simulação, física, trajetória, modelos ou texturas de produção.

Três projetores reutilizáveis seguem janelas fixas, com troca apenas apagados.
Só a janela dominante e a luz principal geram sombras simultâneas. PCFShadowMap
compatível com Three.js r186; PCFSoftShadowMap é depreciado nessa versão local.
Indireta é aproximação por preenchimento/rebatimento; não há GI físico/path tracing.
Mapas 2048²/1024² em paisagem e 1024²/512² em retrato; até quatro mapas alocados.
Controlador libera explicitamente os mapas. Teto não projeta sombra para permitir
a luz global de apresentação solicitada, mas recebe iluminação.

QA inicial excedeu referência com 312 chamadas; reduzidos os produtores de mapas,
sem elevar o teto do teste. QA específico passou em doze cenas, 219–292 chamadas
e 208 recursos próprios, com diferença real entre pixels com/sem sombras, luz
frontal e projeção traseira do urso por raycast, continuidade e descarte zero.
Primeira fixture alternava shadowMap.enabled sem invalidar cache de shader;
corrigida para alternar receptores de sombra, preservando a falha histórica.
Regressão de percurso, build/lint/assets/mapa e sintaxe executados nesta revisão.
Sem benchmark em dispositivo físico ou aprovação artística humana.

Ao retomar o merge, já foi encontrado reconciliado externamente em `f9e7c4e3`,
com documentos em `8cf9291d` e referência origin alinhada. Comando de commit desta
IA retornou “nothing to commit” e não executou merge por estar encadeado com &&.
Não atribuir criação/envio desses commits a esta execução. Iluminação posterior
permanece em alterações locais, sem novo commit ou push desta IA.


## Revisão das sombras nas curvas e documentação — 20/10/2026

Sessão `20261020T181911-38cb8c0288e0`: inspeção visual e gameplay completo por
controlador com entradas automatizadas. Direcional frontal rasante fazia a parede
curva sombrear grande parte do piso. Luz elevada para 28; mapa próximo ajustado
para ±12,5/±24 e profundidade 0,5–80. Janelas com alcance/far 18, máscara permanente
e transição de força da sombra até zero antes da troca. Paredes continuam casters.
Métodos de ChaseLighting documentados em português com parâmetros, motivos dos
valores e ciclo de recursos; formatação expandida. PascalCase preserva convenção
dos módulos de classes; não foi solicitada renomeação global.

QA final: gameplay COMPLETE, zero colisões, 6.110 passos, pico 308 chamadas;
28 trocas suaves em 2.881 amostras e 210 pontos próximos dentro do mapa. QA de
iluminação em três formatos e regressão de percurso/WebGL/descarte aprovados.
Tentativas com 347/340 chamadas e uma amostra fora da margem preservadas como
falhas; limite de 310 não ampliado. Build/assets/mapa/sintaxe/diff verificados.
Relatório: `relatorios/20261020-sombras-curvas.md`. Sem aceite artístico humano,
GI físico ou benchmark em aparelhos. Nenhum ajuste de simulação/modelo/textura.

Commit `3a422243` apareceu externamente durante a sessão e absorveu parte do
trabalho existente. Esta IA não o criou e não fez push; ajustes/documentação
posteriores continuam locais até ação do responsável.


## Urso 3D pictórico e articulação — 20/10/2026

Sessão `20261020T183637-3798297026f3`: usuário reprovou simplificação do urso e
rigidez da corrida. Modelo revisto a partir de bear/idle/01 e walk/03 da arena:
cabeça larga, focinho curto, pelúcia ocre, laço vermelho em leque, patas e costura.
Atlas `urso-atlas-v2.png` gerado com image_gen integrada; v1 intermediária tem fibras
grandes e não é carregada. Prompts preservados. Originais da arena intactos.
ChaseBearAnimation separa apoios com joelhos/tornozelos, transferência de peso,
contrabalanço, cabeça/orelhas/laço, largada contínua e lançamento articulado.
Sem alteração do domínio, física, captura ou dificuldade. Sem bloqueio horizontal
físico dos pés; movimento é cinemático. Métodos documentados em português.

16 malhas mescladas por pivô, uma textura/material; 222 recursos próprios. QA do
rig: apoio vertical com erro máximo 0,01485, pose determinística/estado preservado
e continuidade exata da largada. Gameplay completo zero colisões, pico 302 chamadas;
regressão de percurso/três formatos/36 finais/WebGL/descarte e npm test passaram.
Build/assets/mapa/sintaxe/diff aprovados. Sem aprovação artística humana ou hardware
físico. Relatório `relatorios/20261020-urso-pictorico-corrida.md`.
Pedido seguinte autorizado: limpeza completa dos arquivos sem pertinência ao projeto
ou documentação, com preservação do acervo imutável e recuperação de artes aposentadas.


## Consolidação e limpeza autorizada — 20/10/2026

Sessão `20261020T184959-b352523a0674`: após concluir o urso, usuário pediu limpeza
completa de arquivos sem pertinência. Auditadas referências estáticas, caminhos
dinâmicos, manifestos e scripts de reconstrução. Retirados 16 assets intermediários
ou cópias sonoras idênticas das pastas ativas (35.522.252 bytes dessas cópias).
Conteúdo integral preservado em fontes imutáveis e conferido por hash/bytes antes
da exclusão; não contar esse valor como redução líquida do repositório, pois as
artes continuam recuperáveis no acervo. Dois prompts antigos também consolidados.
27 relatórios avulsos consolidados integralmente no diário; consultar pelo caminho
original via journal:search/show. Nenhum JSON de fontes/registros/pacotes/commits
anterior foi apagado ou reescrito. Um .DS_Store removido.

Mantidos originais/recortes usados por caminhos dinâmicos, fontes de reconstrução,
áudio de fallback src/audio/The Circle Game.mp3, GLB documentado, guias humanos,
planos pertinentes, imagem de direção aprovada, QA ativo, dependências e ambiente
local. Atlas atual do urso é v2, decorativos é v3; prompts atuais identificam as
fontes aposentadas por sourceId. Manifesto de recuperação e decisões:
`limpeza/20261020-manifesto.json`. Validação após limpeza aprovada: npm test, exploração/combate/retorno da arena
em três formatos e QA do urso. Build/assets/diff aprovados. Mapa final: 411 imagens,
99 recortes, 29 assinaturas. Metadados de 11 conjuntos de capturas e um levantamento
antigo de fontes também consolidados; fixtures efetivamente lidas pelo QA mantidas.
Capturas temporárias e caches locais descartados com identificação no manifesto.


## Ritmo crescente e câmera de perseguição — 20/10/2026

Sessão `20261020T190232-f53560bddf2a`. Usuário autorizou acelerar a corrida,
aproximar câmera/urso, encurtar lançamentos e adicionar balanço vertical leve.
`ChasePacing` centraliza curva suave: velocidade-base 8→12 após os primeiros 15%,
intervalo 3,5→1,75 s, voo 0,65→0,38 s. Rampas/tropeços continuam influenciando o
avanço. Aproximação do urso se intensifica nos últimos 6%; amortecimento aumenta
nesse trecho para evitar congelar a passada ao atingir o fim antes da captura.

Lançamentos conservam corredor livre e margem prevista de reação após pouso,
incluindo velocidade/rampa adiante. FÁCIL mantém urso um pouco mais distante para
conservar ataques finais com maior margem. Saídas sucessivas rápidas são adjacentes.
`flight` por obstáculo é opcional no save v1; ausente mantém o voo antigo. Render e
colisão consultam o mesmo valor. Sem alterações em hitboxes, largura ou controles.

`ChaseCamera` é cálculo puro: aproximação longitudinal 7,5→5,1 em paisagem e
9→6,8 em retrato, altura menor, alvo mais baixo/próximo e campo 57→60/62 graus.
Balanço vertical 0,018→0,04 unidade ligado à distância, sem oscilação durante pausa.
Folga adaptativa no retrato mantém os dois atores nas faixas distintas. Captura
começa no mesmo quadro de câmera, com transição ao baú. HUD deixou de prometer
90 segundos fixos. Pista permanece com 720 unidades; duração nominal total medida
87,57 s, incluindo as etapas narrativas existentes.

Validação: npm test passou e incorpora a regressão nova de ritmo. Seis percursos
NORMAL/EASY com decisões a cada quadro/300/400 ms terminaram sem colisões, baú único,
save/RNG estáveis e sem quadros parados no fim. Último lançamento ~673,6; aviso real
mínimo após pouso ~1,063 s NORMAL/~1,313 s FÁCIL nos percursos medidos. Isso não
homologa desafio humano. 33 comparações em três formatos confirmaram enquadramento
e crescimento projetado; gameplay pelo controlador: 5.254 passos, zero colisões,
pico 306 chamadas. Percurso/36 finais/WebGL/descarte e navegador teclado/toque,
pausa/save/áudio/mudo/campanha passaram. Build/assets/mapa/sintaxe/diff aprovados.
Falhas intermediárias de margem no FÁCIL e enquadramento/ampliação no retrato
preservadas; corrigidas sem relaxar as asserções. Sem benchmark físico ou aceite
humano de conforto do balanço. Sem commit/push nesta execução.

Próximo pedido autorizado e colocado na sequência pelo usuário: abertura da
perseguição em cutscene ilustrada, usando a cena inicial da menina na cama no
quarto escuro como referência de linguagem. Menina aproxima-se do urso em desenho;
transição para o 3D somente quando ele se levantar.

## Abertura ilustrada da perseguição e quase toque — 20/10/2026

Sessão `20261020T191907-12f396002561`: substituída por completo a apresentação 3D
das etapas BEAR_DOWN/GIRL_APPROACH/BEAR_RISE. `ChaseIntroRenderer` compõe Canvas 2D
com parede, janela, madeira, tapete, poltrona e fada existentes. Dois atlas próprios
gerados por image_gen integrada seguem a pintura da cena da cama e referências
da menina/urso: `cinematic/approach-atlas-v1.png` e `reach-atlas-v1.png`, com prompts.
Sem CLI/API paga externa. Os sprites anteriores e modelos da corrida permanecem.

Correção adicional do usuário: piso agora usa o mesmo recorte 186×48 do quarto,
sem comprimir muitas tábuas em faixas finas. Menina chega perto do urso caído,
inclina-se e estende a mão; ele reage antes do toque, levanta, vira e foge. Poses
ancoradas nos sapatos; proximidade relativa calculada para cada formato. Levantar
inicia após o gesto. Corte escuro de 0,25 s após ficar de pé e revelação de 0,4 s
na largada. Não se apresenta WebGL durante as três etapas ilustradas, nem durante
carregamento. Artes e 3D carregados antes de liberar a simulação. Sem outro RAF.

Pausa/restauração usam o relógio existente. Nenhuma mudança de duração das etapas,
domínio, física, dificuldade ou contrato de save nesta abertura. Ainda é a prévia
selecionada pelo debug; não houve integração nova da vitória da arena à campanha.

QA final: 39 cenas em três formatos, doze poses completas, ausência de chamadas
de apresentação 3D na abertura, quase toque antes da reação, fuga, pausa/save
determinísticos e quadros idênticos nos dois lados do corte escuro. Inspeção visual
identificou divisões irregulares da prancha; ajustados recortes e incluída rejeição
de recortes que cortem figuras. Capturas temporárias têm caminho/hash/bytes no
acervo e são descartadas. npm test e QA nativo de perseguição passaram após a
integração inicial (percurso completo sem colisões e recursos descartados). Após
os dois ajustes visuais, repetido QA específico; build/assets/mapa/sintaxe/diff
aprovados. Mapa final: 413 imagens, 99 recortes, 29 assinaturas. Sem benchmark
físico ou aprovação artística humana desta abertura. Sem commit/push.

## Vidas e derrota na perseguição — 20/10/2026

Sessão `20261020T194154-5efde8f4f4b3`. Usuário pediu trocar os textos superiores por
um indicador de vida, com derrota no terceiro tropeço; esclareceu seis no FÁCIL.
`ChaseHealth` centraliza limites (NORMAL 3, EASY 6), duração da queda e consulta das
etapas de derrota. Corações cheios/vazios substituem título, explicação e indicador
de porcentagem/distância. Cutscene ilustrada continua sem HUD de corrida.

Último impacto entra em FALLING imediatamente, antes de lançar novos objetos ou
emitir passos/captura. Distância, entrada lateral e obstáculos ficam congelados;
após 1,1 s entra em GAME_OVER, que congela o estado e nunca envia o urso ao baú.
Animação inclina o corpo para a frente, acomoda braços/pernas/espada e cabelo para
o lado. Câmera mira a menina no chão, música reduz ganho até parar e passos cessam.
HUD orienta nova tentativa pelo seletor. Campanha permanece isolada na prévia.

Snapshot v1 acrescenta dificuldade opcional. Saves anteriores mantêm a selecionada;
hits continua sendo a fonte das vidas, sem contador duplicado. Save antigo em
corrida com impactos acima do limite passa à queda ao retomar. Etapas novas são
validadas pelo restaurador e contagens negativas/fracionárias são rejeitadas.

QA: suíte geral passou e inclui regressão de vidas. Domínio verificou três/seis
impactos, imunidade, contato único, derrota real sem desviar, save/RNG, ausência de
captura e estado terminal congelado. QA final de navegador passou em 18 cenas e
três formatos, incluindo dificuldade restaurada, quadro estável, HUD limpo, pose
de queda e música em zero. QA nativo completou o percurso sem colisões, preservou
campanha, teclado/toque, pausa/save/áudio e descarte zero. Capturas inspecionadas.
Falhas intermediárias preservadas: baseline anterior bloqueava a alteração
autorizada de ChaseGirlAnimation; permitido somente esse módulo adicional, sem
retirar a proteção do modelo/artes/configuração. Duas poses intermediárias
falharam por extensão vertical da espada/cabelo; corrigidas sem relaxar limite.
Build/assets/mapa/sintaxe/diff aprovados. Sem aceite humano ou hardware físico.
Sem commit/push. Evidências regeneráveis descartadas após registrar metadados.

## Transição da vitória da arena para a fuga — manual

Sessão `20261020T213824-511c19289a0c`: usuário pediu que a vitória contra o urso
na arena conduza diretamente à fuga 3D, usando tela escura para ocultar a saída
da arena e revelando a abertura com o urso caído e a menina segurando a espada.
O manual `docs/bear-chase/MANUAL-TRANSICAO-VITORIA-ARENA-FUGA.md` especifica
sequência, limites, pontos de integração, persistência e critérios de validação.
`docs/README.md` aponta para o manual.

Sessão `20261020T214228-7726a1114289` — implementação e passagem:

1. A leitura de `ToyRoomArenaPhase`, `ToyRoomPhase`, `BearChasePhase` e
   `ToyRoomPersistence` confirmou que vitórias e derrotas convergiam para retorno
   à sala, que `startChasePreview()` era exclusiva do debug e que a perseguição
   não era salva pela campanha.
2. `ToyRoomArenaPhase.beginReturn()` agora registra destino `CHASE` somente em
   `VICTORY`. A arena congela entradas e combate, aplica fade escuro de 30 quadros
   (0,5 s a 60 Hz) e, sob preto, restaura exploração/progresso, sem banner nem
   retomada de música. `DEFEAT` mantém destino `ROOM`; saves antigos sem destino
   continuam no retorno normal.
3. `ToyRoomPhase.startChaseCampaign()` é separado da prévia. A campanha espera
   artes e renderer com tela preta; `BearChasePhase` revela o urso caído em 0,4 s,
   sem avançar simulação nem instalar controles antes do fim do fade. A abertura
   existente conserva a espada visível na pose inicial. A prévia mantém o fluxo
   anterior e não persiste estado.
4. O save opcional `toyRoomChaseCampaign` preserva estado versionado da fuga e
   posição musical. Restore exige arena concluída e arena inativa; saves antigos
   sem esse campo seguem aceitos. Falhas de construção/carregamento destroem a
   fuga parcial, restauram controles da sala e exibem mensagem explícita.
5. O QA dedicado foi escrito em `docs/diario-ia/` via pacotes
   `20261020T214948-2a414ce8a160` e `20261020T215027-6ecea4b4b828`; a primeira
   execução falhou por canvas de teste incompleto, corrigido antes da aprovação.
   Não resta fonte de QA temporária fora do diário.
6. `journal:qa -- script:test-arena-chase-transition.js`,
   `test:toy-room:arena`, `test:bear-chase`, build e `git diff --check` passaram.
   O teste dedicado cobre
   destino por resultado, espera do fade, início único, save/restore em
   `BEAR_DOWN`, isolamento da prévia e saves antigos.
7. No navegador, a sequência foi forçada até `VICTORY`. Os pixels centrais lidos
   durante o fade evoluíram de `[44,25,33]` para `[34,21,27]`, `[24,16,21]` e
   preto `[20,14,19]`. A cena Canvas 2D foi inspecionada visualmente e mostrou o
   urso caído e a espada na mão da menina. A sandbox do navegador bloqueou a
   criação de WebGL 2; a aplicação reportou a falha e voltou à sala com mensagem,
   confirmando recuperação, mas o caminho de sucesso do renderer 3D ainda precisa
   ser validado em ambiente com WebGL.

Documentação atualizada em `GUIA-PREVIA.md`, `MANUAL-TRANSICAO-VITORIA-ARENA-FUGA.md`
e `ARQUITETURA.md`; regenerar `REFERENCIA-METODOS.md` ainda pendente. Sem edição
de artes, mudança de física, commit ou push. A sessão de tela de entrada
`20261020T201327-774153dc7d03` permanece aberta e não foi alterada.

## Retomada da tela inicial e da integração arena–fuga — 20/10/2026

Sessão `20261020T235555-656a0ba53ace`, a pedido do usuário para continuar o trabalho
compartilhado de Codex e Copilot. A árvore inicial estava limpa em `fe6ef2cb`;
a tela inicial e a transição já estavam nesse commit. Esta retomada conclui as
pendências técnicas das sessões `20261020T201327-774153dc7d03` (Codex) e
`20261020T214228-7726a1114289` (Copilot), sem atribuir sua implementação a esta IA.
Seus encerramentos serão anexados com esta explicação; os eventos anteriores
permanecem imutáveis.

Tela inicial: `TitleScreen` coordena novo jogo/carregar/modo fácil/opções e
confirmação de reinício; `TitleScene` compõe o quarto e a menina lendo, com pernas
articuladas e respeito a movimento reduzido/visibilidade. Imagens existentes
preservadas. Qualidade gráfica continua desabilitada, explicitamente futura.
Prompts registram a resolução nativa do fundo, inferior ao canvas Full HD.

A transição agora foi exercitada com WebGL 2 via SwiftShader em Chrome isolado, em desktop e
móveis emulados retrato/paisagem: vitória preparada no controlador real, preto,
entrada bloqueada durante revelação, primeira imagem em Canvas 2D, save/restore
em BEAR_DOWN e três percursos até COMPLETE sem colisões, com chestApplied.
Não foi uma luta humana completa nem teste físico; o percurso usa decisões
calculadas e passos de simulação. A prévia também passou no QA de navegador
existente, com teclado/toque, áudio, pausa e descarte zero.

Corrigida falha observada na recuperação: `ui-feedback` é oculto por CSS, tornando
invisível o erro anteriormente escrito nele. `chase-error-dialog` agora mostra a
mensagem, recebe foco e permite voltar à sala; atalhos de teclado não atravessam
o diálogo. O teste injeta uma falha de construção e verifica a recuperação.
Menu exercitado em quatro formatos, teclado, modo fácil, opções e cancelamento
de reinício; capturas do menu e da abertura inspecionadas. A primeira revisão do
QA capturava o menu sobre a abertura por usar API direta sem fechar a tela inicial;
a fonte foi corrigida para usar o seletor real e as capturas foram repetidas.
Resultados antigos preservados, sem tratá-los como inspeção da abertura.

Referência de métodos e mapa regenerados; arquitetura e manual atualizados.
Mapa: 415 imagens, 99 recortes, 29 assinaturas. npm test após a correção, build/assets/lint/sintaxe/diff
aprovados. Fontes novas de QA em `qa/retomada-20261020/fluxo-browser.js` e pacotes
imutáveis, executadas via `journal:qa -- test:retomada:browser`. Capturas temporárias
identificadas por caminho/hash/tamanho nos logs, descartadas após inspeção.
Sem alteração de artes, física ou dificuldade, sem commit/push. Aceite artístico,
avaliação humana e aparelhos físicos permanecem pendentes.


## Jogabilidade real e auditoria NORMAL/EASY — 20/10/2026

Sessão `20261021T001312-2b30929c8c01`: duas campanhas desktop completas por
mouse/teclado nativos em tempo real, da tela inicial ao baú. Sem mutação de estado,
teleporte, avanço manual ou rollback no percurso real; o piloto consulta estado
e geometria, portanto não representa avaliação humana de dificuldade. Chrome
isolado com WebGL 2 por SwiftShader, 1200×720. NORMAL e EASY terminaram a fuga sem
impactos. EASY também verificou pausa/recarga no castelo, carregar o final,
confirmação/cancelamento, derrota intencional/retry da arena e seis impactos até
derrota da prévia, sem baú. Queda do quarto/voltar ao início e mudo exercitados.

Quarto: EASY conserva física/velocidades e só amplia pouso lateral em 4 unidades
e profundidade de 16 para 24; início do NORMAL já oferece janela de ~1,16 s,
contra ~1,22 s no EASY. No retorno final, ~100 contra ~152 ms no modelo fixo.
Há anomalia de prioridade: no salto urso→livros, saídas reais x≈269,5 pousaram
primeiro nos livros no NORMAL, mas reapoiaram no urso no EASY. Reproduzida com
teclado e em três passos fixos; não prova derrota inevitável, pois a menina pode
reapoiar nos livros depois. A assistência precisa de revisão de prioridade.

Arena: nenhuma diferença por modo. HP da menina 3, inimigos 3/4/4/8, IA, tempos,
velocidades, espada, defesa, dano e cura iguais. Diagnóstico separado comparou
4.162 pares de quadros idênticos até derrota por insistência/vitória com esquiva.
A fada da sala usa blend 0,20 no EASY contra 0,12 no NORMAL; a perseguição tem
3/6 vidas, imunidade 1,3/2 s, menor deriva e maior margem de reação no EASY.
Carregar mantém dificuldade salva; o botão Modo fácil só afeta novo jogo.

Pendências observadas: final da campanha ainda diz “Prévia concluída” sem saída
clara; derrota da fuga orienta reiniciar pelo debug, sem retry próprio da campanha.
Separar melhor os modos e rever assistência são recomendações, não mudanças
implementadas. Nenhum arquivo de produção/balanceamento foi alterado nesta auditoria;
alterações da retomada anterior preservadas. Falhas/correções do piloto e ajustes
direcionais reais ficaram registrados; não atribuir seus bloqueios ao jogo.
Testes de dificuldade, auditoria e navegador passaram. Suíte geral/build/assets
não repetidos nesta revisão sem alteração de produção. Capturas inspecionadas e
descartadas com metadados preservados. Sem playtest humano, aparelhos físicos,
commit ou push. Relatório completo: `journal:show -- 1ccfd5850edd27e2e9180c6b2caa8efe707f34747e66ed2d2d4a0b42bdc1aec1`.


## Distinção entre dificuldades e conclusão da perseguição em 20/10/2026

Sessão `20261021T010045-961198342758`, por pedido explícito atual do usuário. Retirado “prévia” do seletor e do resultado da fase; o final diz “Perseguição concluída!”. Nomes técnicos `startChasePreview` e `BEAR_CHASE_PREVIEW` continuam por compatibilidade com o acesso isolado de debug, sem redefinir a fase como incompleta.

Primeira fase (aproximação, fuga e retorno): EASY mantém os alcances, corrida e pouso anteriores. NORMAL corre a 2 px/quadro na aproximação, exige o centro dos pés dentro do apoio com margem de 4 px e usa tabelas próprias de alcance fixo. Sem mudar gravidade, impulso vertical, desenho/geometria dos apoios ou pausa/assistência do castelo. Não reintroduzir frenagem aérea na bailarina nem mira calculada pela posição do clique. Os três passos de tempo testados conservam saídas viáveis para os 38 apoios, com janelas menores no NORMAL.

Arena: `ArenaDifficulty` mantém NORMAL original. EASY recebe alcance efetivo 30% maior, caminhada inimiga a 80%, investida a 85%, esperas/retirada/recuperação mais longas e intervalo maior entre evasões; desativa a continuação extra após acerto inimigo. HP e telegráficos dos golpes permanecem iguais. Perfil reaplicado na apresentação restaurada.

Perseguição: EASY conserva exatamente os padrões anteriores. NORMAL lança três brinquedos a partir de 70% e quatro a partir de 80%. `ChasePatterns` deixa um corredor físico único, com folga para o centro da menina de 0,63 e 0,33 unidade respectivamente. Grupos densos ajustam largura/centro visual com escala uniforme, preservando proporções. Materiais dos brinquedos são reunidos por atlas com cores por vértice; isso reduziu o pico medido de 335 para 279 chamadas, sem elevar o limite de 310. Saves antigos continuam aceitos.

Validação: suíte `npm test`, 24 percursos de arena, regressão de 912 trajetórias EASY e 5.254 quadros idênticos de perseguição EASY, build/66 recursos/lint, mapa de sprites e diff. Campanha NORMAL completa em 382,67 s por mouse/teclado nativos, sem escrita em estado/avanço manual/rollback, sem derrotas e sem dano na perseguição. Inspeção WebGL em três formatos e dois percursos controlados completos sem dano. São testes automatizados no Chrome; sensação humana e aparelhos físicos não foram homologados. As falhas de fixtures/contratos anteriores e o pico gráfico intermediário estão preservados no diário, com correções e resultados finais. Fontes novas em `docs/diario-ia/qa/balanceamento-20261020/`; resultado nativo: `8c4332b483cdbb9318604c08eeb6675fb31149af1a963e7f2d1c8b2f556a9f80`; visual final: `b486b4d3b5a6376345235e4eb394341ced11dfb020ae55735d71788a3212b7d5`.

Pendências anteriores fora deste pedido: navegação após conclusão e retry próprio da perseguição de campanha. Nenhum commit/push nesta sessão. Alterações existentes da retomada/interface foram preservadas.


## Revisão da pressão final da perseguição em 20/10/2026

Sessão `20261021T013025-13c1559937cc`, por correção explícita do usuário após observar que quatro brinquedos ocupavam a tela. Esta orientação substitui a quantidade da seção anterior: NORMAL mantém até três brinquedos por lançamento, usando três entre 70% e 85%; nos 15% finais usa dois, a cada um segundo. EASY permanece igual.

Os pares finais deixam corredor amplo (folga de pelo menos 2,38 unidades para o centro do corpo) e alternam a saída entre faixas vizinhas. Nenhum ponto parado, inclusive nas bordas, permanece seguro entre dois pares consecutivos. A entrada em 85% dispara o primeiro par e as emboscadas deixam de interromper a cadência. A distância de lançamento cresce à frente da menina quando o urso se aproxima, preservando o aviso; grupos que já não caberiam com reação antes da chegada não são gerados. Os lançamentos válidos continuam no mesmo intervalo até o último grupo, que é enfrentado perto da captura.

Testes de domínio: 36 percursos, seis sementes e decisões até 400 ms, todos sem dano; oito pares finais no NORMAL, espaçados em um segundo, com aviso mínimo medido de 1,0977 s após pousar. Último grupo em 712,31/720 unidades. RNG/restauração e derrota sem desviar cobertos. EASY preserva os 5.254 quadros de uma perseguição completa comparados à fonte anterior. Suíte geral, build, 66 recursos, lint, mapa de sprites e referência de métodos passaram. Fontes atuais em `docs/diario-ia/qa/cadencia-final-20261020/`; aliases anteriores de balanceamento foram atualizados sem reescrever históricos. Resultado de navegador registrado no encerramento da sessão. Não houve alteração da arena, dos saltos ou de artes nesta revisão. Sem commit/push.

Navegador desta revisão: perseguição NORMAL completa em 90,05 s reais por seletor e teclado nativos, sem dano; 27 cenas controladas em três formatos e dois percursos controlados sem dano. Pico de 282 chamadas no NORMAL e 272 no EASY, abaixo de 310. Falhas iniciais de preparação do piloto (proteção dos botões e operação do seletor) foram corrigidas somente no QA e preservadas no acervo. Capturas inspecionadas, metadados arquivados e bitmaps temporários descartados. Resultado consolidado no pacote `20261021T014052-7d2c02d7ffef`.
