# Comandos, ferramentas e validação

Revisão: 29/10/2026. Fonte de comandos npm: [package.json](../package.json). Bibliotecas e pré-requisitos estão em [DEPENDENCIAS](DEPENDENCIAS.md); contratos de produção em [ARQUITETURA](ARQUITETURA.md).

## Ambiente e funcionamento

Use Node.js 24/npm, Python 3 com sqlite3 da biblioteca padrão, Git e rg. Execute npm ci na raiz com o lockfile versionado. Chrome/CDP é necessário apenas para QA de navegador; scripts de imagem usam pngjs/jpeg-js instalados pelo npm. Não há Puppeteer/Playwright; Three.js renderiza a fuga em WebGL 2.

`npm run dev` serve por padrão em localhost:3000 (PORT altera a porta). Produção no Pages usa arquivos estáticos. Os aliases de teste executam `scripts/run-qa-from-journal.py`: recuperam código/fixtures/referências do acervo em diretório temporário, vinculam dependências instaladas e registram saída e evidências no diário. Não recriam scripts/tests na árvore principal. Ausência de um script no workspace não significa ausência de seu alias de QA.

Para comandos de navegador reconhecidos pelo executor, ele inicia/encerra servidor temporário em porta livre e adapta URLs das fontes. Não é necessário manter npm run dev em paralelo para esses aliases. Disponibilize um Chrome dedicado com CDP na porta indicada pela automação (normalmente 9222):

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222 --user-data-dir=/tmp/legendgirl-qa
npm run journal:qa -- test:refact:browser desktop
npm run journal:qa -- test:refact:browser android
```

Feche somente a instância dedicada ao terminar. Emulação e avanço determinístico não equivalem a aparelho físico ou playtest humano. Para executar uma fonte recuperada manualmente sem o executor, os pré-requisitos/portas devem seguir seu cabeçalho.

## Todos os comandos npm

Perseguição 3D: `npm run test:bear-chase` verifica domínio/restauração e integra `npm test`;
`npm run test:bear-chase:browser` verifica a perseguição no jogo real e requer Chrome isolado
com CDP em 9222. Ambos executam fontes do diário em diretório temporário. Veja o
[guia da perseguição](bear-chase/GUIA-PREVIA.md) para abrir pelo seletor.

Os comandos test/verify/review recuperados pelo Python podem depender de navegador; confira o nome e o script recuperado. Geradores de assets e aplicação de seleções escrevem derivados e exigem revisão do escopo. A presença de um comando não autoriza aplicá-lo sobre artes aprovadas sem uma tarefa correspondente.

| Comando | Implementação / destino | Finalidade |
| --- | --- | --- |
| `npm run test:toy-room:battle` | `python3 scripts/run-qa-from-journal.py test:toy-room:battle` | Simulação do combate e transferência de corações. |
| `npm run test:mobile-ui` | `python3 scripts/run-qa-from-journal.py test:mobile-ui` | Áreas seguras e controles móveis. |
| `npm run test:difficulty` | `python3 scripts/run-qa-from-journal.py test:difficulty` | Parâmetros NORMAL/EASY e preservação dos comportamentos. |
| `npm run verify:dark-room` | `python3 scripts/run-qa-from-journal.py verify:dark-room` | Percurso/apoios, contato dos pés, personagem, partículas e guia. |
| `npm test` | `python3 scripts/run-qa-from-journal.py test && npm run test:arena:defesa && npm run test:saltos:progressao && npm run test:saltos:bailarina && npm run test:bear-chase && npm run test:campaign:defeats && npm run test:arena:especial && npm run test:arena:sons` | Suíte geral recuperada do diário: quarto, persistência, dispositivos, sala, diálogos, arena, balanceamento e contrato do tutorial. |
| `npm run test:pages` | `python3 scripts/run-qa-from-journal.py test:pages` | Validar referências das páginas e caminhos de publicação. |
| `npm run test:toy-room:story` | `python3 scripts/run-qa-from-journal.py test:toy-room:story` | Recorrência, investigação e aquisição da espada. |
| `npm run test:toy-room:visual` | `python3 scripts/run-qa-from-journal.py test:toy-room:visual` | Composição visual e recursos da sala. |
| `npm run dev` | `node server.js` | Iniciar o servidor Express para desenvolvimento. |
| `npm run build` | `node scripts/validate-production.js` | Validar recursos locais e caminhos relativos de index.html; não transpila nem gera dist. |
| `npm run start` | `node server.js` | Iniciar o mesmo servidor de dev. |
| `npm run lint` | `node --check server.js && node --check scripts/check-assets.js` | Verificar sintaxe de server.js e check-assets.js; não cobre todos os módulos. |
| `npm run check-assets` | `node scripts/check-assets.js` | Verificar os recursos registrados e sua existência. |
| `npm run review:dark-room` | `python3 scripts/run-qa-from-journal.py review:dark-room` | Revisão do percurso e da apresentação do quarto. |
| `npm run test:tutorial:browser` | `python3 scripts/run-qa-from-journal.py test:tutorial:browser` | Primeiro salto: espera, prompt, entradas, conclusão e página real. |
| `npm run test:toy-room:facing` | `python3 scripts/run-qa-from-journal.py test:toy-room:facing` | Direção de movimento e orientação horizontal na exploração. |
| `npm run test:toy-room:qa` | `python3 scripts/run-qa-from-journal.py test:toy-room:qa` | Gameplay automatizado de exploração e narrativa da sala. |
| `npm run prepare:battle-sprites` | `node scripts/prepare-battle-sprites.js` | Reextrair quadros e manifesto de batalha das fontes; altera derivados de produção. |
| `npm run verify:battle-sprites` | `python3 scripts/run-qa-from-journal.py verify:battle-sprites` | Integridade dos quadros/manifestos de batalha. |
| `npm run test:battle:polish` | `python3 scripts/run-qa-from-journal.py test:battle:polish` | Apresentação e refinamentos de combate. |
| `npm run review:battle:fairness` | `python3 scripts/run-qa-from-journal.py review:battle:fairness` | Revisão de legibilidade/justiça do combate. |
| `npm run test:battle:fairness` | `python3 scripts/run-qa-from-journal.py test:battle:fairness` | Regressão mecânica de oportunidades e contato. |
| `npm run test:toy-room:arena` | `python3 scripts/run-qa-from-journal.py test:toy-room:arena` | Transformação, perfis e estados de arena. |
| `npm run test:toy-room:arena:browser` | `python3 scripts/run-qa-from-journal.py test:toy-room:arena:browser` | Exploração, espada, quatro inimigos, save/load e retorno em perfis móveis/desktop. |
| `npm run test:arena:animation` | `python3 scripts/run-qa-from-journal.py test:arena:animation` | Poses e sincronização da menina na arena. |
| `npm run review:arena:animation` | `python3 scripts/run-qa-from-journal.py review:arena:animation` | Revisão visual das animações da arena. |
| `npm run review:sprites:catalog` | `node scripts/build-sprite-review.js` | Construir a ferramenta de classificação visual existente. |
| `npm run review:sprites:apply` | `node scripts/apply-sprite-review.js` | Simular aplicação por padrão; `-- --apply` aplica e `--include-referenced` amplia alvos. Revisar escopo/quarentena/diário antes de aplicar. |
| `npm run test:sprite-review` | `python3 scripts/run-qa-from-journal.py test:sprite-review` | Seleções e persistência da classificação visual. |
| `npm run test:sprite-review:browser` | `python3 scripts/run-qa-from-journal.py test:sprite-review:browser` | Interface de revisão de imagens no navegador. |
| `npm run test:sprite-cleanup` | `python3 scripts/run-qa-from-journal.py test:sprite-cleanup` | Recursos classificados/removidos e assinaturas retiradas. |
| `npm run test:current-art` | `python3 scripts/run-qa-from-journal.py test:current-art` | Presença/uso dos substitutos de cenário atuais. |
| `npm run test:current-art:browser` | `python3 scripts/run-qa-from-journal.py test:current-art:browser` | Percurso de plataformas e cenário atual no navegador. |
| `npm run docs:sprites` | `node scripts/build-sprite-guide.js` | Regenerar mapa, recortes, desenhos em código e inventário de arte. |
| `npm run journal:read` | `python3 scripts/ai-journal.py read` | Sincronizar e ler contexto, registros recentes e sessões abertas. |
| `npm run journal:sync` | `python3 scripts/ai-journal.py sync` | Capturar fontes atuais no SQLite incremental e exportar pendências em segmentos imutáveis; --history inclui Git local. |
| `npm run journal:search` | `python3 scripts/ai-journal.py search` | Pesquisar termo literal; --all-versions inclui versões anteriores. |
| `npm run journal:begin` | `python3 scripts/ai-journal.py begin` | Abrir sessão com actor/title e devolver ID. |
| `npm run journal:finish` | `python3 scripts/ai-journal.py finish` | Encerrar sessão por ID com summary/check/file/pending. |
| `npm run test:journal` | `python3 scripts/run-qa-from-journal.py test:journal` | Integridade/consulta/execução do diário e regras de acervo. |
| `npm run journal:show` | `python3 scripts/ai-journal.py show` | Ler fonte imutável por ID, incluindo JSON comprimido. |
| `npm run journal:qa` | `python3 scripts/run-qa-from-journal.py` | Recuperar comando/script arquivado, executar temporariamente e registrar resultado. |
| `npm run journal:archive` | `python3 scripts/ai-journal.py archive` | Arquivar/verificar arquivos do manifesto antes de retirar cópias externas. |
| `npm run journal:verify` | `python3 scripts/ai-journal.py verify` | Conferir integridade, hashes e referências do acervo. |
| `npm run journal:export` | `python3 scripts/ai-journal.py export` | Exportar envelopes pendentes para segmentos JSONL/gzip imutáveis. |
| `npm run journal:backup -- --output /tmp/diario-backup.sqlite3` | `python3 scripts/ai-journal.py backup` | Criar backup consistente sem sobrescrever o destino. |
| `npm run journal:extract -- CAMINHO --output /tmp/referencia.png` | `python3 scripts/ai-journal.py extract` | Recuperar fonte/anexo; usar --id quando houver múltiplas versões do anexo. |
| `npm run journal:migrate` | `python3 scripts/ai-journal.py migrate` | Migrar acervo legado e verificar restauração; --prune exige migração autorizada e preservação comprovada. |
| `npm run test:dialogues` | `python3 scripts/run-qa-from-journal.py test:dialogues` | Contrato dos diálogos compartilhados. |
| `npm run test:dialogues:browser` | `python3 scripts/run-qa-from-journal.py test:dialogues:browser` | Retratos, caixa, controles, persistência e áreas seguras. |
| `npm run test:toy-room:camera` | `python3 scripts/run-qa-from-journal.py test:toy-room:camera` | Alvo de câmera da exploração e falas/revelação. |
| `npm run test:damage-sprites` | `python3 scripts/run-qa-from-journal.py test:damage-sprites` | Quadros de dano e prioridade da reação. |
| `npm run test:damage-audio:browser` | `python3 scripts/run-qa-from-journal.py test:damage-audio:browser` | Reações e movimento sonoro, volume/mudo e liberação das vozes. |
| `npm run test:arena:refinements` | `python3 scripts/run-qa-from-journal.py test:arena:refinements` | Continuidade musical, intensidade e recuo. |
| `npm run test:debug-phases:browser` | `python3 scripts/run-qa-from-journal.py test:debug-phases:browser` | Seletor de fases, trocas repetidas, isolamento de entrada e save preservado. |
| `npm run test:arena:enemies` | `python3 scripts/run-qa-from-journal.py test:arena:enemies` | Corpos sólidos, repertórios, IA e pressão progressiva. |
| `npm run test:arena:balance` | `python3 scripts/run-qa-from-journal.py test:arena:balance` | 111 percursos e condições de evasão/proteção/recuperação. |
| `npm run test:arena:defesa` | `python3 scripts/run-qa-from-journal.py test:arena:defesa` | Contato sem dano, bloqueio frontal, orientação, animação e diagonais. |
| `npm run test:saltos:progressao` | `python3 scripts/run-qa-from-journal.py test:saltos:progressao` | Progressão pós-clímax, aproximação sem frenagem artificial e viabilidade em NORMAL/EASY e três passos de tempo. |
| `npm run test:saltos:bailarina` | `python3 scripts/run-qa-from-journal.py test:saltos:bailarina` | Reproduz a frenagem anterior e verifica 24 saltos com saídas normais até a bailarina. |
| `npm run test:arena:defesa:browser` | `python3 scripts/run-qa-from-journal.py test:arena:defesa:browser` | Eventos reais de toque no Chrome isolado: defesa, salto diagonal e espada simultânea. |

| `npm run test:bear-chase` | `python3 scripts/run-qa-from-journal.py test:bear-chase` | Domínio, sequência, padrões, vidas e restauração da fuga. |
| `npm run test:bear-chase:browser` | `python3 scripts/run-qa-from-journal.py test:bear-chase:browser` | Perseguição no jogo real com Chrome/CDP isolado. |

| `npm run test:campaign:defeats` | `python3 scripts/run-qa-from-journal.py test:campaign:defeats` | Contagem de derrotas, oferta/recusa/EASY, saves e retomadas locais. |

## Comandos adicionais preservados no diário

```sh
npm run journal:qa -- test:refact:browser desktop
npm run journal:qa -- test:refact:browser android
npm run journal:qa -- test:refact:contracts
npm run journal:qa -- test:refact:tutorial
npm run journal:qa -- test:sword-audio:browser
npm run journal:qa -- test:arena:balance
npm run journal:qa -- script:verify-full-browser.js desktop
npm run journal:qa -- script:verify-full-browser.js iphone
npm run journal:qa -- script:test-opening-sequence.js
npm run journal:qa -- script:test-physics-scenarios.js
```

Os dois primeiros comparam exatamente imagens, recursos de runtime e estados com a referência anterior à refatoração, incluindo saves. Mantêm a lista completa de recursos e identificam separadamente hashes de Markdown humano atualizado; PNGs, áudio, JSONs de produção e referências comportamentais não são flexibilizados. `test:refact:contracts` cobre contratos de carregamento; `test:refact:tutorial` cobre restrição de acessos, referências substituídas e reexport do mapeamento. O teste de áudio da espada valida corte/acerto/bloqueio e ganho. Os demais percursos não substituem os critérios específicos dessas comparações. Para descobrir uma fonte histórica, use journal:search e journal:show; não invente um alias a partir do nome de um relatório.

## Ferramentas que permanecem no projeto

| Arquivo | Responsabilidade / efeito |
| --- | --- |
| [ai-journal.py](../scripts/ai-journal.py) | CLI do diário, SQLite incremental, envelopes completos e segmentos JSONL/gzip imutáveis para Git/recuperação. Usa journal_store.py. |
| [journal_store.py](../scripts/journal_store.py) | Transações, envelopes imutáveis, importação/união de segmentos, hashes, verificação e exportação incremental. |
| [apply-sprite-review.js](../scripts/apply-sprite-review.js) | Aplica decisões da classificação visual; pode remover recursos conforme a seleção. |
| [build-dark-room-atlas.js](../scripts/build-dark-room-atlas.js) | Consolida sprites em prancha e metadados do quarto; sobrescreve derivados. |
| [build-sprite-guide.js](../scripts/build-sprite-guide.js) | Regenera os quatro mapas/inventário de arte; análise estática não identifica todos os usos dinâmicos. |
| [build-sprite-review.js](../scripts/build-sprite-review.js) | Gera catálogo/interface da classificação visual de sprites. |
| [build-tall-dresser.js](../scripts/build-tall-dresser.js) | Prepara ilustração derivada da cômoda alta. |
| [check-assets.js](../scripts/check-assets.js) | Valida recursos do manifesto principal. |
| [export-production-sprites.py](../scripts/export-production-sprites.py) | Exporta recursos de produção a partir dos metadados/fontes existentes. |
| [generate-battle-player-bounds.js](../scripts/generate-battle-player-bounds.js) | Deriva limites de poses/luva para apresentação/contato. |
| [generate-dream-girl-sprites.js](../scripts/generate-dream-girl-sprites.js) | Extrai a personagem oficial preservando pixels da fonte; gera atlas/metadados. |
| [generate-method-reference.js](../scripts/generate-method-reference.js) | Regenera a referência de contratos e declarações a partir de src/js. |
| [export-chase-girl.js](../scripts/export-chase-girl.js) | Exporta o modelo GLB da menina em pose neutra; não inclui animação. |
| [prepare-illustrated-girl.js](../scripts/prepare-illustrated-girl.js) | Prepara as pranchas e metadados da menina ilustrada a partir das fontes girl-v2. |
| [prepare-girl-locomotion.js](../scripts/prepare-girl-locomotion.js) | Deriva peças articuladas e metadados da pintura original; preserva a identidade das pernas e exige revisão das âncoras. |
| [prepare-dream-nightmare.js](../scripts/prepare-dream-nightmare.js) | Mede recortes/silhuetas das pedras, poses do despertar e amostras corporais; gera DreamNightmareArt.js, preservando os PNGs. |
| [prepare-dream-glider.js](../scripts/prepare-dream-glider.js) | Mede silhuetas opacas do planador e espinhos; gera DreamGliderArt.js. |
| [prepare-dream-art.js](../scripts/prepare-dream-art.js) | Mede escalada, contornos dos insetos e recortes/âncoras de folhas e abelhinha; gera DreamArt.js sem alterar PNGs ou física. |
| [prepare-chapter-art.js](../scripts/prepare-chapter-art.js) | Mede os recortes por alfa das atuações dos capítulos e gera ChapterArt.js; preserva os pixels das fontes. |
| [prepare-chase-palette.js](../scripts/prepare-chase-palette.js) | Deriva paleta e metadados das amostras da arte de arena; sobrescreve derivados. |
| [prepare-battle-sprites.js](../scripts/prepare-battle-sprites.js) | Extrai quadros de batalha das pranchas/fontes e prepara manifesto. |
| [prepare-combat-corrections.js](../scripts/prepare-combat-corrections.js) | Prepara derivados das correções de combate já existentes. |
| [prepare-combat-remediation.js](../scripts/prepare-combat-remediation.js) | Prepara derivados das remediações visuais do combate. |
| [prepare-damage-sprites.js](../scripts/prepare-damage-sprites.js) | Extrai/exporta seis poses de dano por ator e gera DamageSpriteFrames. |
| [prepare-garden-art.js](../scripts/prepare-garden-art.js) | Reconstrói pranchas base, frames.json, manifesto dedicado e GardenArt; sobrescreve a lista do manifesto. |
| [prepare-garden-contact.js](../scripts/prepare-garden-contact.js) | Mede solas de 28 poses e superfícies por coluna; gera GardenContactData usado pela física. Exige revisão de contato após mudar fontes. |
| [prepare-garden-insects.js](../scripts/prepare-garden-insects.js) | Extrai seis poses do atlas aprovado e gera runtime/insetos-v1.png e GardenInsectArt. |
| [prepare-garden-cinematic.js](../scripts/prepare-garden-cinematic.js) | Isola oito atuações, mede corpo/asas da abelha, gera GardenCinematicArt e atualiza o manifesto das cenas. |
| [prepare-garden-fear.js](../scripts/prepare-garden-fear.js) | Prepara quatro pranchas de medo completo e FEAR_FILES/FEAR_FRAMES; registra apoio original sem recalcular contato físico. |
| [prepare-garden-beetle.js](../scripts/prepare-garden-beetle.js) | Mede corpo/asas do besouro, gera GardenBeetleArt e inclui a fonte no manifesto. |
| [prepare-garden-picnic.js](../scripts/prepare-garden-picnic.js) | Recorta o piquenique lateral, gera GardenPicnicArt e registra a âncora no plano da toalha. |
| [prepare-garden-visuals.js](../scripts/prepare-garden-visuals.js) | Prepara seis recortes aquáticos e GardenVisualArt; decoração sem novos apoios. |
| [prepare-polish-sequence.js](../scripts/prepare-polish-sequence.js) | Prepara derivados das sequências de refinamento visual. |
| [recreate-production-assets.js](../scripts/recreate-production-assets.js) | Reconstrói assets de produção a partir das fontes; não é um comando de QA. |
| [refine-platform8.js](../scripts/refine-platform8.js) | Prepara a arte derivada específica da plataforma 8. |
| [run-qa-from-journal.py](../scripts/run-qa-from-journal.py) | Recuperação verificada de fontes, execução temporária, servidor opcional e arquivamento dos resultados. |
| [update-train-rod-remediation.js](../scripts/update-train-rod-remediation.js) | Atualiza a derivação existente das hastes/movimento do trem. |
| [validate-production.js](../scripts/validate-production.js) | Valida caminhos relativos dos recursos da página principal sem gerar QA. |

Os geradores não devem ser executados apenas para revisar documentação: alguns sobrescrevem PNGs/manifestos. Alteração visual exige guia de designers, mapa reconstruído e registro. Comandos antigos de QA só são executados pelo diário, em ambiente temporário.

## Servidor, página e publicação

`server.js` usa Express, PORT e SPRITE_REVIEW_SELECTION_PATH. Além dos estáticos, expõe GET de catálogo/escolhas e POST local de seleção de sprites; a [arquitetura](ARQUITETURA.md#página-estilos-e-revisão-visual-local) descreve validação e revisão otimista. Não oferece API de contas, progresso remoto ou IA. `index.html` e `src/css/` apresentam menu, controles, canvas e overlays; main.js instala os handlers e MobileUILayout alinha DOM/bitmap/controles. `metadata.json` declara metadados do host e não implementa uma capacidade de backend.

O workflow [deploy-pages.yml](../.github/workflows/deploy-pages.yml) usa Node 24, npm ci, check-assets/lint/build e rsync para _site; exclui documentação, scripts, testes e acervo. O gatilho é push em main ou disparo manual. Não executa npm test completo. `npm run build` não simula todo o pacote de deploy nem publica. Merge local e push são ações distintas.

## Registro e manutenção

Inicie pela leitura/pesquisa do diário, abra sessão, confira git status e preserve trabalho concorrente. Registre testes reais, arquivos e pendências ao encerrar. Código/fixtures/relatórios de QA novos são arquivados no diário e executados temporariamente; imagens regeneráveis mantêm somente identificação/hash/tamanho. Não registrar segredos ou reescrever evidências antigas.

Para a pressão final da perseguição: `npm run journal:qa -- test:cadencia-final` verifica quantidade, cadência, alternância, reação, save/RNG e preservação do EASY. `test:cadencia-final:visual:browser` e `test:cadencia-final:nativo:browser` usam o mesmo executor com Chrome isolado em CDP 9222; execute-os sequencialmente.

Para as correções recentes do quarto e do piso:

```sh
npm run journal:qa -- test:pousos:retorno
npm run journal:qa -- test:pousos:retorno:browser
npm run journal:qa -- test:apoios:irregulares
npm run journal:qa -- test:piso:correcao:browser
npm run journal:qa -- test:retomada:browser
npm run journal:qa -- script:test-arena-chase-transition.js
```

As regressões de pouso verificam cruzamento contínuo e exclusões, preservação do EASY e integração com o dt real. As de piso verificam upload, mipmaps, pixels de madeira e descarte no Chrome. O diagnóstico anterior à correção não substitui essas regressões; Chrome não homologa Safari. Fontes e resultados históricos são consultados pelo diário, sem recriar relatórios no projeto.

## Recuperação de painéis históricos

O executor restaura do acervo arquivos sob `scripts/`, `tests/` e `assets/`, além de código e fixtures `.js`, `.mjs`, `.cjs`, `.py`, `.html`, `.css` e `.json` sob `docs/diario-ia/qa/`. A recuperação ocorre somente no workspace temporário; relatórios Markdown e bitmaps de evidência não são restaurados. Em automações de navegador, as URLs locais também são adaptadas nos módulos `.mjs` e `.cjs` para a porta do servidor temporário. Um painel histórico ainda pode depender de recursos/requisitos próprios; consultar sua fonte antes de usar.

Os painéis de comparação da menina e dos props da perseguição foram arquivados e retirados da árvore ativa. O executor pode recuperar código/fixtures nos prefixos e formatos acima; consulte o pacote e o alias antes de executar, pois referências externas a esses prefixos não são restauradas automaticamente. Uma URL antiga não é uma página atual do servidor de produção. Relatórios e bitmaps de evidência não devem ser devolvidos à árvore ativa para reabrir esses painéis.

A verificação está em `npm run journal:qa -- test:docs:equalizacao`: confere cobertura/exports dos módulos, links locais, parâmetros da arena e versões do lockfile. Inclui os guias do jardim e de leitura. Ferramentas, aliases e imports diretos são conferidos contra a captura da árvore de produção arquivada com a automação, pois o executor acrescenta fontes e comandos históricos no workspace temporário. Ao acrescentar ferramentas/aliases, atualize essa captura no acervo. Resultados pertencem ao diário.

`npm run journal:qa -- test:campaign:defeats:browser` cobre a interface real em desktop/retrato/paisagem com derrotas preparadas, respostas nativas, soma entre fases, recarga, oferta, recusa e retomada. Requer Chrome de QA/CDP 9222. Não equivale a um playtest humano completo.

`npm run journal:qa -- test:arena:composicao` verifica bases, janela livre, projeção, camadas, origem do baú, HUD e enquadramento. `npm run journal:qa -- test:arena:composicao:browser` verifica o renderer real e a restauração em Chrome isolado/CDP 9222, com estados preparados em desktop/retrato/paisagem. As fontes permanecem arquivadas; não há diagnósticos avulsos para manter no projeto.

`npm run test:arena:especial` verifica dano, uso único, bloqueios de ativação, suspensão do combate, câmera e save durante o raio, nas duas dificuldades. `npm run test:arena:especial:browser` verifica teclado/touch, gamepad preparado e renderer real em três formatos no Chrome isolado/CDP 9222. As fontes são recuperadas do diário e executadas temporariamente.

`npm run journal:qa -- test:arena:saida-direta` verifica o último golpe, ausência de texto na vitória e restauração durante a saída. `npm run journal:qa -- test:arena:saida-direta:browser` cobre o corte até BEAR_DOWN sem legenda em três formatos, no Chrome isolado/CDP 9222. A fonte de `script:test-arena-chase-transition.js` também foi atualizada no acervo para a perseguição e a saída vigentes.

Após a consolidação das cópias antigas, os testes e painéis de QA devem ser executados pelos aliases ou por `journal:qa`. O executor também recupera as fixtures `.txt` usadas nas comparações históricas; não é necessário restaurar esses arquivos manualmente na árvore do projeto. O banco SQLite local só pode ser removido após exportar todas as pendências com `journal:sync`; clones restauram o acervo pelos segmentos compactados disponíveis. Use `journal:verify`, `journal:backup` e `journal:extract` para verificação, backup consistente e extração de anexos.

`npm run journal:qa -- test:arena:sons` verifica eventos dos ataques e lançamento único do especial com restore. `npm run journal:qa -- test:arena:sons:browser` usa Chrome isolado e servidor temporário para decodificar os dez MP3s, renderizar trechos offline e conferir ganho mestre, mudo, pausa e liberação de vozes.

`npm run test:arena:defesa` também verifica recuo animado, base estacionária nas nove ofensivas e retomada ao fim do golpe. `npm run journal:qa -- test:arena:defesa:estacionaria:browser` renderiza a sequência com os sprites reais em Chrome isolado.

`npm run journal:qa -- test:titulo:enquadramento:browser` verifica o quarto/poltrona fixos na tela inicial, o menu acessível e o reenquadramento em seis tamanhos e rotação, em Chrome isolado.

`npm run journal:qa -- test:fuga:carregamento:browser` atrasa um atlas para conferir a abertura como carregamento, a liberação após prontidão visual, piso na GPU em desktop/retrato/paisagem, alternativa linear e bloqueio por falha de piso/atlas. Usa Chrome isolado e servidor temporário.

Aliases de áudio integrados ao package.json: `npm run test:arena:sons` (incluído em `npm test`) e `npm run test:arena:sons:browser`. Os demais comandos específicos recentes permanecem acessíveis por `journal:qa`, conforme descrito acima.

QA da introdução ilustrada e da moldura narrativa superior: `npm run journal:qa -- test:toy-room:intro:browser` (Chrome isolado em porta livre; fontes e resultados preservados no acervo).

Revisão das cenas pelo seletor real, incluindo repetição e preservação do save: `npm run journal:qa -- test:seletor:cenas:browser` (Chrome isolado em porta livre).

Câmera exclusivamente lateral no quarto escuro: `npm run journal:qa -- test:camera:lateral:browser` (desktop e perfis Android/iPhone em retrato/paisagem, Chrome isolado).


Para validar a fada volumétrica e sua luz na perseguição: `npm run journal:qa -- test:bear-chase:fairy:browser`. A automação arquivada inicia Chrome isolado, mede luz/sombra em pixels, testa curvas e três formatos, percorre NORMAL/EASY, verifica orçamento e descarte. Os resultados ficam exclusivamente no diário de IA. Não equivale à homologação de FPS ou aparência no celular físico.

Para validar as superfícies do quarto e a união urso/livros com artes reais, teclado e toque: `npm run journal:qa -- test:contato:browser`. O executor recupera o QA no diretório temporário e registra a execução no diário.

### Menina ilustrada e baú aberto

- `node scripts/prepare-illustrated-girl.js`: reconstrói pranchas de execução e metadados a partir das fontes preservadas.
- `node scripts/prepare-chase-palette.js` e `node scripts/export-chase-girl.js`: atualizam a paleta rastreável e o GLB de intercâmbio.
- `npm run journal:qa -- test:menina:ilustrada:browser`: poses, mãos/brinquedos, coleta/save/baú e entrada dos quatro adversários em três formatos.
- `npm run journal:qa -- test:bear-chase:fairy:browser`: menina 3D, luz/sombras, órbita, orçamento, pausa/descarte e percursos NORMAL/EASY.

Os navegadores usam Chrome isolado; fontes e resultados pertencem ao diário.

### Jardim

- `node scripts/prepare-garden-art.js`: reconstrói recortes, pranchas de execução e manifesto dedicado.
- `npm run journal:qa -- test:garden`: terrenos/frenagem, dois pisões, formigas saltadoras, fatalidade NORMAL, recuperação EASY, nuvens, fada e saves.
- `npm run journal:qa -- test:garden:percurso`: percursos completos NORMAL/EASY; acrescente `--irregular` para variar dt.
- `npm run journal:qa -- test:garden:browser`: arte/controles reais, chão contínuo, três formatos, transição, save, pausa, resgates e descarte em Chrome isolado.

Para os encontros e cenas atuais, use também os comandos preservados no acervo:

- `npm run journal:qa -- test:capitulos:dominio`: tempos, avanço, facepalm silencioso, snapshots e migração do final do jardim. `test:capitulos:cenas:browser 390 844` confere a composição e a entrada no host. `test:capitulos:campanha:browser NORMAL 1200 720` percorre a campanha com os capítulos; aceita `EASY` e os formatos `390 844`/`844 390`.

- `npm run journal:qa -- test:epilogo:seletor`: conclusão da perseguição nas origens campanha/prévia, pausa e isolamento do save. `test:epilogo:seletor:browser NORMAL 1200 720` percorre pela bandeira até o epílogo e a entrada do jardim; aceita `EASY` e os formatos `390 844`/`844 390`.
- `npm run journal:qa -- test:jardim:encontros-v9`: repouso/arcos A/B, migração, dano/pisão, minhocas e besouros.
- `npm run journal:qa -- test:jardim:entrada:browser`: quadros intermediários da saída da abertura e da descida, além do estado final.
- `npm run journal:qa -- test:leitura:dominio`, `test:leitura:dirigido:browser` e `test:leitura:relogio:browser`: leitura automática, gestos completos, Enter modal, cenas vistas, pausa e isolamento de controles. As fixtures antigas `test:dialogos:padrao`/`browser` permanecem no histórico; gestos incompletos e esperas fixas não devem ser usados para certificar o contrato atual.
- `npm run journal:qa -- test:leitura:campanha:browser NORMAL 1200 720`: campanha contínua pela interface até o piquenique, em relógio real; aceita também `EASY`, `390 844` e `844 390`. Usa teclado/mouse, toque nativo nos saltos do quarto móvel e piloto de gamepad no jardim, com retries oficiais.
- `npm run journal:qa -- test:proporcao:rig`: proporções, contato dos pés, espada e pureza dos estados do modelo3D; `test:proporcao:glb` confere o derivado contra a fonte neutra. `test:proporcao:painel:browser final` desenha a prancha de vistas e corrida; `test:proporcao:cenas:browser 390 844` usa o renderer da perseguição em cenas preparadas. `test:proporcao:campanha:browser NORMAL 1200 720` executa a campanha contínua completa, com os mesmos argumentos de modo/tela da validação de leitura.
- `npm run journal:qa -- test:jardim:v9:integral:browser`: jardim em RAF real até o encerramento narrativo; piloto de gamepad, avanço opcional das falas e retries oficiais. Inicia Chrome isolado em porta livre.

`test:garden:percurso` e fixtures de passo controlado não medem duração humana ou desempenho do RAF. A simulação do jardim não integra automaticamente todos os contratos de `npm test`: execute os comandos específicos quando alterar esse domínio. A reconstrução de artes segue a ordem do [README de produção](../assets/art/garden/README.md#reconstrução-dos-derivados-atuais); não executar preparadores para uma revisão somente documental.

## Componentes da revisão local de sprites

Os módulos em `tools/sprite-review/` pertencem à ferramenta de manutenção e são coordenados pelos scripts de catálogo/aplicação e pelo servidor:

| Módulo | Responsabilidade |
| --- | --- |
| [catalog.js](../tools/sprite-review/catalog.js) | Levanta arquivos, consumidores, recortes e assinaturas desenhadas em código. |
| [store.js](../tools/sprite-review/store.js) | Lê catálogo/seleções, valida revisão e instala rotas locais de gravação. |
| [apply.js](../tools/sprite-review/apply.js) | Simula a aplicação e, com opção explícita, aplica seleções verificadas mantendo recuperação. |
| [review.js](../tools/sprite-review/review.js) | Interface de filtros, prévia e seleção; usa review.css e index.html próprios. |

A auditoria documental abrangente está no diário: `npm run journal:qa -- test:docs:atual` confere módulos, exports, classes, ferramentas, aliases, links locais e reprodução da referência gerada. `test:docs:equalizacao` complementa a revisão com parâmetros da arena e dependências do lockfile.

- `npm run journal:qa -- test:sonho:dominio` e `test:sonho:contratos`: travessias, escalada, vento, transporte, cadência irregular, saves e origem. `test:sonho:browser 1200 720 NORMAL` percorre a floresta com teclado nativo. `test:sonho:integracao:browser 390 844 EASY` valida toque simultâneo, retomada, passagem do sono e custo amostrado de desenho.

- `npm run journal:qa -- test:sonho:caules`: reprodução de captura da segunda haste, caule inferior, dois lados e saves. `test:sonho:caules:browser 1200 720 NORMAL` revisa a cena no navegador; aceita os três formatos usuais e EASY.

- `npm run journal:qa -- test:sonho:besouros`: embarque, voo curvo, transporte, saves, migração e retry. `test:sonho:besouros:browser 1200 720 NORMAL` verifica embarque e transferência por teclado a partir de save preparado; aceita outros formatos.

- `npm run journal:qa -- test:sonho:sprites:browser 1200 720 NORMAL`: revisão dirigida de folhas pintadas, abelhinha/cotonete, asas, apoio, pausa e descarte em navegador. Aceita também 390×844 EASY e 844×390 NORMAL como argumentos separados.

- `npm run journal:qa -- test:sonho:teias`: preservação do percurso aprovado, saltos entre seda, janelas do ciclo, dano/queda, galhos e saves. `test:sonho:teias:browser 1200 720 NORMAL` verifica o trecho por teclado; aceita retrato390×844 EASY e paisagem844×390 NORMAL.

- `npm run journal:qa -- test:sonho:escalada`: âncoras e contatos sobre pixels reais, quatro fases por distância e repouso. `test:sonho:escalada:browser 1200 720 NORMAL` valida subida dos dois lados de insetos, haste, transição ao lombo, pausa e save; aceita formatos móveis.

- `npm run journal:qa -- test:sonho:teias:mobile`: ajuda exclusiva para celular, altura de preparo, prioridade manual e equivalência do desktop/outros apoios. `test:sonho:teias:mobile:browser 390 844 NORMAL mobile` verifica por toque; o último argumento `desktop` testa a mesma janela sem ajuda.

- `npm run journal:qa -- test:sonho:planador`: percurso integral, voo com grandes altitudes, inércia, dano/reinício, migração e saves. `test:sonho:planador:browser 1200 720 NORMAL desktop` verifica a seção por teclado; formatos390×844 EASY e844×390 NORMAL usam `mobile`.


QA do fim do sonho: `npm run journal:qa -- test:sonho:pesadelo` verifica luz/sombra, derrota/retry, saves e captura/despertar; `test:sonho:pesadelo:browser 1200 720 NORMAL desktop` executa a cena por teclado. Para toque, usar390 844 EASY mobile ou844 390 NORMAL mobile. Fontes e resultados ficam somente no diário.

`test:sonho:pesadelo:arte` confere alfa, hashes, silhuetas e amostras corporais contra os pixels das fontes e reproduz o preparador. `test:sonho:pesadelo:integral` percorre o sonho inteiro em NORMAL/EASY e cadências fixa/irregular, comparando a física aérea ao código aprovado antes do corte novo. Ambos rodam por `npm run journal:qa -- ALIAS` no ambiente temporário.

`test:sonho:pesadelo:ciclo` verifica descarte durante a decodificação e ausência de novas cargas após destroy, sem renderizar ou criar arquivos de evidência.

## Perseguição furtiva ampliada

`npm run journal:qa -- test:sonho:furtividade` verifica prólogo, percurso, lama, saves e desfecho; `test:sonho:furtividade:saltos` compara a detecção aos polígonos de luz durante subidas dos relevos; `test:sonho:furtividade:arte` verifica trilha, alfa e recortes; `test:sonho:furtividade:integral` compara o percurso anterior à continuação. O alias de navegador preparado é `test:sonho:furtividade:browser 1200 720 NORMAL desktop` (390 844 EASY mobile e844 390 NORMAL mobile para emulações). Os aliases anteriores de pesadelo acompanham os testes vigentes. A disponibilidade e os resultados reais constam do diário.

`test:sonho:lagos` cobre quatro lagos, entrada sem botão, nado, seis poses de saída, duas margens e saves. `test:sonho:lagos:browser` percorre a fase final por controles nativos; `test:sonho:lagos:arte:browser` prepara pontos para inspecionar terreno, braçadas e margens. Os resultados reais e a versão executada constam do diário.

As regressões da iluminação e do corte na última margem estão no acervo: `npm run journal:qa -- test:sonho:luz` valida continuidade, pés no solo, save/load e despertar em NORMAL/EASY; `npm run journal:qa -- test:sonho:luz:browser 1200 720 NORMAL desktop` e `npm run journal:qa -- test:sonho:luz:browser 390 844 EASY mobile` compõem cenas dirigidas de luz, lama e final no Chrome isolado. Esses cenários dirigidos não representam uma campanha integral por entrada nativa.

`npm run journal:qa -- test:sonho:lama:oclusao:browser 1200 720 NORMAL desktop` verifica pixels submersos em64 combinações dos quatro lagos e duas margens, com controle sem recorte para reproduzir o vazamento. Use `390 844 EASY mobile` para inspecionar as mesmas cenas em retrato.

`npm run journal:qa -- test:sonho:lama:saida:browser 1200 720 NORMAL desktop` joga as duas margens e a última saída por teclado nativo, partindo de saves dirigidos válidos; `390 844 EASY mobile` usa toque nativo. `npm run journal:qa -- test:sonho:lama:apoios` confere âncoras em pixels opacos, palmas na terra, convergência aos pés e escala da pose final.

`npm run journal:qa -- test:sonho:entrada:cinematica` verifica salto, impacto, saves, migração nightmare7 e corte do final. `npm run journal:qa -- test:sonho:entrada:cinematica:browser 1200 720 NORMAL desktop` joga salto/impacto e final por teclado; `390 844 EASY mobile` usa toque. Inclui88 amostras raster, respingo real, proibição de câmera de gameplay no final, pausa e restauração do plano.

### Preparação dos sons fornecidos

`python3 scripts/prepare-game-sounds.py` reconstrói impacto e três loops de asas a partir dos originais preservados em `assets/audio/effects/`. Requer macOS/afconvert apenas na preparação. QA preservado: `npm run journal:qa -- test:sons:campanha` (marcos da lama e emissores) e `npm run journal:qa -- test:sons:campanha:browser` (decodificação, saída Web Audio e ciclo de vida). A validação técnica não substitui escuta humana.

Relevo antes dos lagos: `npm run journal:qa -- test:relevos:browser` joga os três saltos por teclado no Chrome com estados iniciais dirigidos e valida crista/câmera/descarte; aceita pasta temporária do diário, largura e altura como argumentos (padrão1200×720). `npm run journal:qa -- test:pulo:volume:browser` verifica ganho0,325 do pulo em quarto/arena/jardim/sonho, inclusive atualização das vozes.

`npm run journal:qa -- test:asas:v2:browser` verifica o novo WAV dos besouros, a separação dos canais de abelhas/rasantes, decodificação em três frequências e ciclo de vida dos sons. O preparo existente também reconstrói esse loop a partir de `assets/audio/effects/source/wings-bugs2.wav`.

`npm run journal:qa -- test:abelhas:audio:browser` verifica que todas as abelhas, incluindo rasantes, usam o novo `wings-bee.wav`, com a fonte dos besouros preservada, decodificação e ciclo de vida de áudio corretos. O alias test:asas:v2:browser acompanha essa mesma fonte atualizada.

Margens de toque do voo: `npm run journal:qa -- test:planador:toque` verifica dimensões CSS, bordas, densidades, arrasto e isolamento; `npm run journal:qa -- test:planador:toque:browser 390 844 mobile` usa toque nativo no Chrome em save dirigido do voo. Aceita `844 390 mobile` para paisagem e `desktop` no terceiro argumento para conferir isolamento em janela estreita. Capturas ficam temporariamente no diário.


Revisão da barata: npm run journal:qa -- test:barata:revisao verifica prefixo, pouso/save, juntas, impactos e tolerância EASY. test:barata:revisao:browser aceita1200 720ou390 844e percorre chegada, música, leitura, revelação/abrigo e captura no jogo. review:barata:browser renderiza quadros dirigidos para inspeção, sem inferir aprovação artística.


QA do acabamento do voo/pântano/mobile: `npm run journal:qa -- test:acabamento`; toque/cenas com Chrome local: `npm run journal:qa -- test:acabamento:toque:browser LARGURA ALTURA DIRETORIO_DE_EVIDENCIAS`; áudio e ganho dobrado: `npm run journal:qa -- test:acabamento:audio:browser`. Diretórios de evidência somente temporários no diário; registrar resultados e limpar após arquivamento. Esses comandos não certificam aprovação artística ou teste em aparelho físico.


Abertura do sonho: `npm run journal:qa -- test:sonho:abertura` valida prazos, saves/migrações, falas e física congelada. `npm run journal:qa -- test:sonho:abertura:browser LARGURA ALTURA DIRETORIO` percorre a cena por RAF e entradas nativas no Chrome local, incluindo áudio e pausa. `review:sonho:abertura:browser` renderiza momentos para inspeção. Evidências somente temporárias dentro do diário; arquivar e conferir antes da limpeza. Os aliases de planador/integral começam após a nova abertura para comparar a física anterior.

## Brinquedão e revisão da pose

`node scripts/prepare-brinquedao.js` gera recortes/máscaras de quatro módulos, quatro poses e referência do escorregador em BrinquedaoArt. Não modifica as pinturas originais. Depois executar `npm run docs:sprites`.

`npm run journal:qa -- test:brinquedao:dominio` verifica percursos NORMAL/EASY em três cadências, subpassos, embalo, três saltos obrigatórios, bolinhas, recuperação e snapshots. `npm run journal:qa -- test:brinquedao:browser LARGURA ALTURA DIRETORIO` percorre a entrada oficial e o circuito por RAF/teclado, com pausa, áudio e restauração; em retrato Android também testa toque diagonal. `review:brinquedao:browser` aceita os mesmos argumentos e prepara quadros dirigidos para inspeção. `review:sonho:pose:browser` confere a anatomia corrigida na abertura. Evidências temporárias somente no diário, com arquivamento/verificação antes da limpeza.

Gerador [scripts/prepare-brinquedao.js](../scripts/prepare-brinquedao.js): componentes completos e máscaras de apresentação, sem sobrescrever PNGs.

`npm run journal:qa -- test:brinquedao:transicao:browser LARGURA ALTURA DIRETORIO` parte de save válido no despertar, verifica pausa, falas, passagem ao convite de campanha e restauração completa da sala.

Continuação de camas elásticas: `npm run journal:qa -- test:brinquedao:elastico` cobre domínio2, seis impulsos/castelos, pontes, parede/rampa, controle obrigatório, derrota/retry e migração. `npm run journal:qa -- test:brinquedao:elastico:browser LARGURA ALTURA DIRETORIO` percorre toda a fase por RAF/teclado, salva sobre ponte frágil e confere Game Over e retry pelo botão. `review:brinquedao:elastico:browser` prepara quadros dirigidos nos três formatos. Os aliases test:brinquedao:dominio e test:brinquedao:browser passam a usar as fontes atuais dessa continuação; versões anteriores seguem preservadas.

`npm run journal:qa -- test:brinquedao:prefixo` compara o corpo e os relógios da corrida inicial com as fontes preservadas da entrega anterior, antes da entrada da continuação.

Recuperação inferior: `npm run journal:qa -- test:brinquedao:recuperacao` verifica apoios baixos, rebatidas alternadas, subidas/descidas, saída controlada, retorno às torres e migração2. `npm run journal:qa -- test:brinquedao:recuperacao:browser LARGURA ALTURA DIRETORIO` deixa a física produzir as rebatidas por RAF, salva no movimento e retoma a direção/pulo até um castelo. `review:brinquedao:recuperacao:browser` prepara os apoios e lonas para inspeção nos três formatos. Fontes/capturas somente no diário.


QA interno do Brinquedão pelo diário: `npm run journal:qa -- test:brinquedao:interior`; `npm run journal:qa -- test:brinquedao:interior:browser LARGURA ALTURA DIRETORIO`; `npm run journal:qa -- review:brinquedao:interior:browser LARGURA ALTURA DIRETORIO`. Percurso puro, teclado/RAF e quadros dirigidos, respectivamente. Fontes e evidências somente no diário.
