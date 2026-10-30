# Contexto compartilhado vigente

Atualizado em 29/10/2026. Auditoria documental `20261030T010558-6e5d44689fc7`, após a consolidação `20261030T005517-c73d09c5cf21` (identificadores UTC; data local 29/10).

## Regras obrigatórias para as próximas sessões

O usuário determinou que **a documentação DEVE ser atualizada a cada nova implementação autorizada** e que **a preparação de cada commit solicitado DEVE excluir relatórios, imagens de aprovação e outros arquivos dispensáveis**, com preservação prévia conforme o acervo. A regra completa e os limites de preservação estão na [entrada obrigatória do diário](README.md#regras-obrigatórias-de-documentação-e-commit). Consultá-la antes de implementar ou preparar commits.

## Estado e autorização atuais

Checkout atual na `main`. A entrega da `FEAT-Capitulos` foi commitada em `2033b962` e integrada sem conflitos pelo merge `e537799a68ac05333664b76c9911276d5b86595b`. As duas branches foram enviadas ao origin, sem force-push. A árvore do merge era idêntica à fonte validada. A publicação dos capítulos concluiu com sucesso pelo CI/CD e os recursos publicados foram comparados ao checkout. Um commit documental de fechamento registra estes resultados. Autorização explícita de gameplay, commit, merge e sincronização na sessão `20261030T011448-c93153dd9260`.

O usuário disse “Gostei” após a correção do encerramento pela bandeira e pediu documentação, próximos passos e limpeza. A entrega narrativa está aprovada. A instrução de escopo continua sendo: “Então conclui as cenas e deixe preparado para posteriormente fazermos a fase 3D do jardim”. Nenhuma implementação autorizada das cenas ficou pendente; o jardim 3D do sonho ainda não foi iniciado.

Fontes humanas vigentes: [roteiro dos capítulos](../capitulos/ROTEIRO.md), [diário de produto](../DIARIO-HUMANO.md), [manual](../MANUAL-DESENVOLVIMENTO.md), [arquitetura](../ARQUITETURA.md). Consultar [padrão de diálogos](padroes/DIALOGOS-E-CENAS.md) antes de alterar leitura ou atuação. Instruções atuais do usuário e `AGENTS.md` prevalecem sobre registros históricos.

## Entrega aprovada

- Após levantar da cama, música em 33,5 s; gravura “CAPÍTULO 1 - Quarto de brinquedos” entre 36 e 41 s; término da abertura em 42,5 s. Cinco falas anteriores preservadas.
- Depois da perseguição concluída, espera de 150 ticks (2,5 s na base de 60 Hz), quarto arrumado e baú fechado, menina cansada, fala de Nanda, narração poética e pergunta sobre pegar os brinquedos novamente. Facepalm silencioso de Nanda com aproximação narrativa, seguido da gravura “CAPÍTULO 2 - DIA DE PIQUENIQUE NO JARDIM”. Texto integral no roteiro.
- Jardim 2D existente preservado até o piquenique. Quatro quadros novos mostram mais pão na chapa e suco de laranja, sonolência e Yuna e Nanda adormecendo juntas. O repouso animado é o final atual.
- Gravuras de cinco segundos; falas do epílogo de 7/6/7/8 s; facepalm obrigatório de 4,5 s; quatro quadros finais de sete segundos. Avanço automático e um gesto por fala, com consumo da entrada e pausa. O facepalm não é abreviado pelo comando de leitura.
- Quatro pinturas novas em `assets/art/chapters/`, com proveniência, hashes e aprovação registrados. `scripts/prepare-chapter-art.js` gera sete recortes por alfa em `ChapterArt.js`; conservar fontes e gerador. Nenhuma arte anterior foi substituída.

Componentes principais: `ChapterCard`, `ChapterArt`, `ToyRoomEpilogue`, `OpeningSequence`, coordenação em `game.js`/`ToyRoomPhase`, persistência da sala e módulos narrativos do jardim. Física, hitboxes, dificuldade e câmeras de gameplay foram preservadas.

## Correção do seletor e persistência

O usuário relatou ausência do epílogo e confirmou entrada pela bandeira. A condição antiga exigia `chase.campaign`; a prévia usa `campaign:false`. Agora qualquer perseguição em `COMPLETE` abre a cena após a mesma espera. A origem acompanha perseguição → epílogo → jardim. A prévia continua separada da campanha e não serializa seus campos narrativos no save oficial. Iniciar outra perseguição limpa epílogo e temporizador anteriores.

`toyRoomEpilogue` de campanha guarda índice, idade e tempo. Restauração verifica jardim antes de epílogo e perseguição. Domínio do jardim na revisão 11, configuração `GARDEN.version` ainda 7 e envelope `GardenPhase` versão 1: não confundir esses contratos. Saves concluídos das revisões 8–10 retomam os quadros novos a partir do índice 10, sem repetir a travessia ou as falas anteriores.

Ponto de integração futuro: `state.stage === 'COMPLETE'` e `state.story.endingDone === true`, no último quadro de `GARDEN_ENDING`; estado incluído em `GardenPhase.snapshot()`/`toyRoomGarden`. O futuro coordenador poderá recebê-lo por `ToyRoomPhase.updateActiveMode`. Ainda não existe transição para uma fase 3D nem botão provisório de saída.

## Próximos passos planejados — ainda não executados

1. Construir, quando solicitado, um protótipo curto do sonho: Yuna minúscula, jardim 3D, grama alta e uma formiga gigante. Validar controles, câmera e percepção de escala em desktop/celular.
2. Definir patrulha, detecção, perseguição e perda de contato; tornar claro quando a grama esconde Yuna. Calibrar retomada após ser encontrada. Somente fugir e esconder-se: sem espada, ataques ou pisão ofensivo.
3. Integrar o sono à fase com carga sob demanda, ciclo próprio de simulação/entrada, pausa, save/restore e descarte. Preservar o ponto de retomada dos saves anteriores e o isolamento da bandeira.
4. Após validar a base, acrescentar besouros, abelhas e minhocas gigantes com comportamentos distintos e ampliar a travessia. Duração, mapa final, fracasso e desfecho ainda precisam ser definidos; não inventar um capítulo 3.
5. Revisar identidade, atuação, áudio, controles de toque e desempenho; validar transição desde o piquenique e restauração em desktop, retrato e paisagem, incluindo aparelho real/Safari quando disponíveis.

O jardim 2D atual e a perseguição 3D do urso não são a futura fase do sonho. Não iniciar essa fase a partir de uma fila histórica antiga ou tratar este planejamento como implementação concluída.

## Verificação existente e limites

As sessões `20261029T194006-cb9fba0ee45b` (capítulos) e `20261029T203010-13f749acf27a` (seletor) guardam os resultados completos. Resumo para retomada:

- Capítulos: domínio e cenas dirigidas passaram, incluindo tempos, consumo da entrada, facepalm, snapshots e migração. Seis campanhas contínuas NORMAL/EASY × 1200×720/390×844/844×390 chegaram do Novo jogo ao sono. Esses percursos antecedem a correção do seletor; não atribuir sua execução à fonte posterior.
- Seletor: reprodução falhou antes e passou depois; seis percursos pela bandeira nos mesmos modos/telas chegaram ao epílogo e à entrada do jardim, com pausa/retomada e campanha salva comparada byte a byte. Zero retries/erros JS. Não equivalem a novas campanhas completas desde o despertar.
- `npm test` completo passou após a correção. Build, 82 recursos do manifesto, lint e diff passaram. Catálogo reconstruído: 484 imagens, 249 recortes catalogados e 29 assinaturas; referência com 186 módulos e 1197 declarações. Não somar automaticamente os sete recortes de atuação ao total do catálogo.
- Teste físico/Safari e avaliação externa de áudio/conforto/desempenho continuam sem homologação. A aprovação humana das cenas foi recebida agora e substitui a antiga pendência de aprovação desta entrega.

Pacotes de retomada: `26af7467b00c43b19c13c906fdf2ab05` (capítulos e arte); `5fa3cfc55b5e43fb91a8529cda9d2c00` (piloto das campanhas); `f0de6c1436154ce990277b3b93c4f42f` (fonte após correção); `5749fa8c5a614cbf87904109d91d8812` (regressão do seletor); `29010f5b88554b929cd1d090bc15047a` (piloto browser do seletor); `f1decb91b05141598c63986dd47048c4` (resultados e temporários da correção). Usar `journal:show` para recuperar fontes e registros completos antes de repetir QA.

## Consolidação e limpeza

O contexto anterior acumulava 339.795 bytes com filas e checkpoints superados. Sua íntegra foi preservada e recuperada byte a byte antes desta consolidação: fonte `d40d46904e71c588bb54973b85c7edb81dcae0db765db35182a855a21f921bf1`, SHA-256 `84bf888823cbf1c9c0628d0b3d25fdb2e4970dd5d51886db9f6b27d8ba8da0a3`, pacote `3449ceedb770485fb1f5327c7fed463e`.

O mesmo pacote preserva integralmente a antiga quarentena local de revisão de sprites, metadado Finder e consultas temporárias desta consolidação. Só cópias verificadas são removidas. Artes de produção, ferramentas, dependências, banco, segmentos e fontes de QA em uso permanecem. Históricos imutáveis não foram reescritos; nenhum relatório de máquina novo fica fora do acervo.

Nesta consolidação documental, build, check-assets (82), lint e diff passaram. A equalização documental inicialmente apontou contratos ausentes na linha de `GirlLocomotion` na arquitetura; a documentação recebeu `girlGaitDirection` e `applyGirlBodyTransform`, já existentes no código. Também foram documentados o gerador de recortes dos capítulos e seu uso de pngjs. Nova execução passou: 186 módulos, 19 documentos e 706 links locais. Os dois resultados ficam no diário; nenhuma campanha foi repetida nesta revisão documental. Limpeza concluída de 38 cópias locais preservadas no pacote acima (34 arquivos da quarentena, um metadado Finder e três consultas temporárias).

Quatro sessões antigas de 26–27/10 continuam abertas e pertencem a outras avaliações; não encerrá-las por inferência nem tomar suas filas como pendências desta entrega. Para histórico anterior (caminhada, câmera, jardim, combate e publicação), pesquisar o diário e recuperar a versão preservada deste contexto quando necessário.


## Auditoria documental de todo o projeto — 29/10/2026

Pedido atual: confrontar a documentação com todas as funcionalidades e métodos criados, além de registrar as duas regras obrigatórias acima. Sem implementação de gameplay, commit ou publicação.

Revisados código de `src/js`, ferramentas de `scripts`/`tools`, servidor, manifestos, dependências/lockfile, workflow e documentação humana. Índice e arquitetura corrigidos para epílogo em ambas as origens e jardim v11; manual ganhou visão funcional e 32 classes faltantes, completando 70. Referência regenerada: 186 módulos e 1197 declarações, linhas navegáveis e descrições específicas de atuação, leitura, capítulos, persistência e ciclo de vida. O gerador conserva essas descrições em futuras reconstruções. Corrigidos também o manual da transição arena–fuga e o README da arte de abertura, que ainda informava 37,5 s em vez de 42,5 s. Ferramentas de locomoção/revisão e imports diretos documentados.

QA novo `test:docs:atual`, pacote vigente `a7489e39137847bf822a2ec8f4bda348`: cobre catálogo único dos módulos, exports, todas as classes declaradas, ferramentas/aliases, imports de dependências, links locais em 36 documentos e reprodução exata da referência. Passou com 186 módulos, 454 contratos, 70 classes, 39 ferramentas, 68 aliases e 5414 links locais na execução final. A primeira tentativa identificou a ausência do link da ferramenta `prepare-illustrated-girl.js`, corrigida. A checagem anterior `test:docs:equalizacao` também passou, incluindo parâmetros da arena e lockfile. Build, check-assets (82), lint, sintaxe do gerador e diff também passaram nesta auditoria. Resultados integrais e fontes ficam no acervo; não há relatórios ou fixtures novos fora dele. Não foram repetidas campanhas por se tratar de documentação e do gerador documental.


## Gameplay geral e integração concluídos — 29/10/2026

Sessão `20261030T011448-c93153dd9260`. Todas as tarefas autorizadas anteriores estão concluídas; o sonho3D continua futuro. Usuário autorizou commit, merge na main e envio ao GitHub após gameplay geral aprovado.

Executadas seis campanhas novas e contínuas pela interface até o sono/endingDone, na fonte atual congelada em `5a9b3c8d3c2e45b48e26015a990d51d3` (200 arquivos, hashes reconferidos após as partidas). NORMAL/EASY × desktop1200×720/retrato390×844/paisagem844×390, seis exit0, sem erroJS ou recursoHTTP ausente. Teclado/mouse,39toques NORMAL e40EASY nos quartos móveis, piloto de gamepad no jardim e Enter existente para leitura; sem teleporte, edição de estado ou avanço manual da simulação. Capítulo1 e epílogo0/2/4/5 observados em todas. EASY inclui pausa/recarga oficiais no castelo.129capturas identificadas; selecionadas de capítulo1, narração do epílogo, facepalm e sono foram visualmente inspecionadas.

EASY:716,333/719,396/729,614s, zero derrotas anteriores ao jardim e zero retries de fuga/jardim. NORMAL:764,782/765,978/778,605s, zero derrotas anteriores/na fuga e dois retries oficiais do jardim em cada formato. Ordem desktop/retrato/paisagem; tempos incluem tentativas e não são duração humana garantida. Resultados completos: EASY `b7e81685b5cc479abdf0fc9acae889f6`, `c565267ab97e41fa9253572598f0302f`, `59af1e7fb396490d8631edb4f314407d`; NORMAL `bf4b5fa55911420fb41c2778f3be3578`, `4ccf8c922c2a4b74a98f3834dab00480`, `3b097521915a4915a95310a43e74b324`.

npm test completo, capítulos/domínio, epílogo/seletor, auditoria documental, build,82recursos,lint e diff passaram. A limpeza obrigatória preservou/exportou/verificou e removeu67temporários próprios, sendo60bitmaps regeneráveis identificados por caminho/hash/tamanho e7textos integrais; pacote `f045cefddd6a40778b3dd3c396c324eb`. Nada de QA avulso será commitado; artes e documentação de produção mantidas. Aparelho físico/Safari continuam fora desta homologação automatizada.


### Publicação confirmada

GitHub Actions [40986294112](https://github.com/luciussama/legendGirl/actions/runs/40986294112) terminou com `success` para o SHA completo do merge e publicou em https://luciussama.github.io/legendGirl/ . Verificação HTTP de18recursos (HTML, manifestos, coordenadores/cenas/persistência e quatro PNGs novos): todos200 e bytes idênticos ao checkout. Resultado completo no pacote `22a07edf75d5443b94f66e44c0edd0fd`. Não foi necessário modificar o runtime durante esta validação. O fechamento documental não altera os recursos do jogo.

A versão está disponível para teste humano no celular. Safari/aparelho físico e escuta externa continuam sem homologação pela IA. O jardim3D do sonho permanece preparado no roteiro, para implementação futura. Nenhuma tarefa autorizada de implementação, documentação ou integração desta entrega ficou pendente.
