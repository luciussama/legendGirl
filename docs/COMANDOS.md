# Comandos, ferramentas e validação

Revisão: 15/10/2026. Fonte de comandos npm: [package.json](../package.json). Bibliotecas e pré-requisitos estão em [DEPENDENCIAS](DEPENDENCIAS.md); contratos de produção em [ARQUITETURA](ARQUITETURA.md).

## Ambiente e funcionamento

Use Node.js 24/npm, Python 3 com sqlite3 da biblioteca padrão, Git e rg. Execute npm ci na raiz com o lockfile versionado. Chrome/CDP é necessário apenas para QA de navegador; scripts de imagem usam pngjs/jpeg-js instalados pelo npm. Não há Puppeteer/Playwright nem engine externa.

`npm run dev` serve por padrão em localhost:3000 (PORT altera a porta). Produção no Pages usa arquivos estáticos. Os aliases de teste executam `scripts/run-qa-from-journal.py`: recuperam código/fixtures/referências do acervo em diretório temporário, vinculam dependências instaladas e registram saída e evidências no diário. Não recriam scripts/tests na árvore principal. Ausência de um script no workspace não significa ausência de seu alias de QA.

Para comandos de navegador reconhecidos pelo executor, ele inicia/encerra servidor temporário em porta livre e adapta URLs das fontes. Não é necessário manter npm run dev em paralelo para esses aliases. Disponibilize um Chrome dedicado com CDP na porta indicada pela automação (normalmente 9222):

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222 --user-data-dir=/tmp/legendgirl-qa
npm run journal:qa -- test:refact:browser desktop
npm run journal:qa -- test:refact:browser android
```

Feche somente a instância dedicada ao terminar. Emulação e avanço determinístico não equivalem a aparelho físico ou playtest humano. Para executar uma fonte recuperada manualmente sem o executor, os pré-requisitos/portas devem seguir seu cabeçalho.

## Todos os comandos npm

Os comandos test/verify/review recuperados pelo Python podem depender de navegador; confira o nome e o script recuperado. Geradores de assets e aplicação de seleções escrevem derivados e exigem revisão do escopo. A presença de um comando não autoriza aplicá-lo sobre artes aprovadas sem uma tarefa correspondente.

| Comando | Implementação / destino | Finalidade |
| --- | --- | --- |
| `npm run test:toy-room:battle` | `python3 scripts/run-qa-from-journal.py test:toy-room:battle` | Simulação do combate e transferência de corações. |
| `npm run test:mobile-ui` | `python3 scripts/run-qa-from-journal.py test:mobile-ui` | Áreas seguras e controles móveis. |
| `npm run test:difficulty` | `python3 scripts/run-qa-from-journal.py test:difficulty` | Parâmetros NORMAL/EASY e preservação dos comportamentos. |
| `npm run verify:dark-room` | `python3 scripts/run-qa-from-journal.py verify:dark-room` | Percurso/apoios, contato dos pés, personagem, partículas e guia. |
| `npm test` | `python3 scripts/run-qa-from-journal.py test && npm run test:arena:defesa && npm run test:saltos:progressao && npm run test:saltos:bailarina` | Suíte geral recuperada do diário: quarto, persistência, dispositivos, sala, diálogos, arena, balanceamento e contrato do tutorial. |
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
| `npm run journal:sync` | `python3 scripts/ai-journal.py sync` | Arquivar fontes atuais e reconstruir SQLite; --history inclui Git local. |
| `npm run journal:search` | `python3 scripts/ai-journal.py search` | Pesquisar termo literal; --all-versions inclui versões anteriores. |
| `npm run journal:begin` | `python3 scripts/ai-journal.py begin` | Abrir sessão com actor/title e devolver ID. |
| `npm run journal:finish` | `python3 scripts/ai-journal.py finish` | Encerrar sessão por ID com summary/check/file/pending. |
| `npm run test:journal` | `python3 scripts/run-qa-from-journal.py test:journal` | Integridade/consulta/execução do diário e regras de acervo. |
| `npm run journal:show` | `python3 scripts/ai-journal.py show` | Ler fonte imutável por ID, incluindo JSON comprimido. |
| `npm run journal:qa` | `python3 scripts/run-qa-from-journal.py` | Recuperar comando/script arquivado, executar temporariamente e registrar resultado. |
| `npm run journal:archive` | `python3 scripts/ai-journal.py archive` | Arquivar/verificar arquivos do manifesto antes de retirar cópias externas. |
| `npm run test:dialogues` | `python3 scripts/run-qa-from-journal.py test:dialogues` | Contrato dos diálogos compartilhados. |
| `npm run test:dialogues:browser` | `python3 scripts/run-qa-from-journal.py test:dialogues:browser` | Retratos, caixa, controles, persistência e áreas seguras. |
| `npm run test:toy-room:camera` | `python3 scripts/run-qa-from-journal.py test:toy-room:camera` | Alvo de câmera da exploração e falas/revelação. |
| `npm run test:damage-sprites` | `python3 scripts/run-qa-from-journal.py test:damage-sprites` | Quadros de dano e prioridade da reação. |
| `npm run test:damage-audio:browser` | `python3 scripts/run-qa-from-journal.py test:damage-audio:browser` | Reações e movimento sonoro, volume/mudo e liberação das vozes. |
| `npm run test:arena:refinements` | `python3 scripts/run-qa-from-journal.py test:arena:refinements` | Continuidade musical, intensidade e recuo. |
| `npm run test:debug-phases:browser` | `python3 scripts/run-qa-from-journal.py test:debug-phases:browser` | Três fases, trocas repetidas, isolamento de entrada e save preservado. |
| `npm run test:arena:enemies` | `python3 scripts/run-qa-from-journal.py test:arena:enemies` | Corpos sólidos, repertórios, IA e pressão progressiva. |
| `npm run test:arena:balance` | `python3 scripts/run-qa-from-journal.py test:arena:balance` | 111 percursos e condições de evasão/proteção/recuperação. |
| `npm run test:arena:defesa` | `python3 scripts/run-qa-from-journal.py test:arena:defesa` | Contato sem dano, bloqueio frontal, orientação, animação e diagonais. |
| `npm run test:saltos:progressao` | `python3 scripts/run-qa-from-journal.py test:saltos:progressao` | Progressão pós-clímax, aproximação sem frenagem artificial e viabilidade em NORMAL/EASY e três passos de tempo. |
| `npm run test:saltos:bailarina` | `python3 scripts/run-qa-from-journal.py test:saltos:bailarina` | Reproduz a frenagem anterior e verifica 24 saltos com saídas normais até a bailarina. |
| `npm run test:arena:defesa:browser` | `python3 scripts/run-qa-from-journal.py test:arena:defesa:browser` | Eventos reais de toque no Chrome isolado: defesa, salto diagonal e espada simultânea. |

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
| [ai-journal.py](../scripts/ai-journal.py) | CLI do diário, SQLite reconstruível, fontes/eventos/pacotes imutáveis e importação do histórico Git. |
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
| [prepare-battle-sprites.js](../scripts/prepare-battle-sprites.js) | Extrai quadros de batalha das pranchas/fontes e prepara manifesto. |
| [prepare-combat-corrections.js](../scripts/prepare-combat-corrections.js) | Prepara derivados das correções de combate já existentes. |
| [prepare-combat-remediation.js](../scripts/prepare-combat-remediation.js) | Prepara derivados das remediações visuais do combate. |
| [prepare-damage-sprites.js](../scripts/prepare-damage-sprites.js) | Extrai/exporta seis poses de dano por ator e gera DamageSpriteFrames. |
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
