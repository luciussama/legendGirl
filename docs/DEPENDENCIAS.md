# Dicionário de bibliotecas e dependências

Revisão: 06/10/2026. Fontes: package.json, package-lock.json, imports locais, server.js e workflow. Versões abaixo são as resolvidas no lockfile; os intervalos declarados não são versões fixas. Não houve atualização de pacotes nesta revisão. Consulte o [manual do desenvolvedor](MANUAL-DESENVOLVIMENTO.md).

## Dependências npm diretas

São as três dependências declaradas. Não há devDependencies nem biblioteca de engine/frontend carregada pelo jogo. Os pacotes de imagem são ferramentas Node de arte/QA, embora declarados em dependencies.

| Biblioteca | Intervalo / versão resolvida | Descrição resumida | Onde é usada |
| --- | --- | --- | --- |
| express | ^4.21.2 / 4.22.3 | Servidor HTTP e middleware estático. | server.js: express(), express.static() e listen(); desenvolvimento local. GitHub Pages serve arquivos sem esse servidor. |
| jpeg-js | ^0.4.4 / 0.4.4 | Decodifica/codifica JPEG em JavaScript. | Scripts de geração/recriação de arte e verificação da personagem; não roda no navegador. |
| pngjs | ^7.0.0 / 7.0.0 | Lê/escreve PNG e buffers de pixels. | Scripts de assets, capturas e verificações visuais; não roda no navegador. |

### Imports diretos por arquivo

**express**

- [server.js](../server.js)

**jpeg-js**

- [scripts/generate-dream-girl-sprites.js](../scripts/generate-dream-girl-sprites.js)
- [scripts/recreate-production-assets.js](../scripts/recreate-production-assets.js)
- [scripts/test-official-character.js](../scripts/test-official-character.js)

**pngjs**

- [scripts/build-dark-room-atlas.js](../scripts/build-dark-room-atlas.js)
- [scripts/build-tall-dresser.js](../scripts/build-tall-dresser.js)
- [scripts/capture-reviewed-dresser.js](../scripts/capture-reviewed-dresser.js)
- [scripts/capture-reviewed-escape-transition.js](../scripts/capture-reviewed-escape-transition.js)
- [scripts/capture-reviewed-music-box.js](../scripts/capture-reviewed-music-box.js)
- [scripts/gameplay-inspection.js](../scripts/gameplay-inspection.js)
- [scripts/generate-dream-girl-sprites.js](../scripts/generate-dream-girl-sprites.js)
- [scripts/generate-review-evidence.js](../scripts/generate-review-evidence.js)
- [scripts/recreate-production-assets.js](../scripts/recreate-production-assets.js)
- [scripts/refine-platform8.js](../scripts/refine-platform8.js)
- [scripts/software-canvas.js](../scripts/software-canvas.js)
- [scripts/test-audit-measure.js](../scripts/test-audit-measure.js)
- [scripts/test-foot-contact.js](../scripts/test-foot-contact.js)
- [scripts/test-official-character.js](../scripts/test-official-character.js)
- [scripts/test-opening-sequence.js](../scripts/test-opening-sequence.js)
- [scripts/verify-visual-layers.js](../scripts/verify-visual-layers.js)

## Dependências transitivas

Entram automaticamente pelo Express. Não são imports diretos do código do jogo. A coluna “solicitada por” aponta o pacote consumidor no lockfile; disponibilidade de um middleware não significa uso configurado pela aplicação (por exemplo, body-parser/cookies). Não alterar esses pacotes isoladamente sem revisar o lockfile.

| Biblioteca | Versão | Descrição resumida | Solicitada por |
| --- | --- | --- | --- |
| accepts | 1.3.8 | Negociação de tipo, idioma e codificação HTTP. | express |
| array-flatten | 1.1.1 | Achata arrays de handlers. | express |
| body-parser | 1.20.8 | Decodifica corpos de requisições; não configurado diretamente pelo servidor atual. | express |
| bytes | 3.1.2 | Converte tamanhos em bytes. | body-parser, raw-body |
| call-bind-apply-helpers | 1.0.2 | Auxilia chamadas e bindings de funções. | call-bound, dunder-proto, get-intrinsic |
| call-bound | 1.0.4 | Obtém métodos nativos com binding seguro. | side-channel-map, side-channel-weakmap |
| content-disposition | 0.5.4 | Monta cabeçalhos de nome/disposição de arquivos. | express |
| content-type | 1.0.5 | Analisa tipo de conteúdo HTTP. | body-parser, express |
| cookie | 0.7.2 | Analisa e serializa cookies. | express |
| cookie-signature | 1.0.7 | Assina valores de cookies. | express |
| debug | 2.6.9 | Logs internos condicionais. | body-parser, express, finalhandler, send |
| depd | 2.0.0 | Avisos de APIs obsoletas. | body-parser, express, http-errors, send |
| destroy | 1.2.0 | Encerra streams. | body-parser, send |
| dunder-proto | 1.0.1 | Acesso compatível a protótipos. | get-proto |
| ee-first | 1.1.1 | Detecta o primeiro evento de emissores. | on-finished |
| encodeurl | 2.0.0 | Codifica URLs HTTP. | express, finalhandler, send, serve-static |
| es-define-property | 1.0.1 | Compatibilidade de definição de propriedades. | get-intrinsic, qs |
| es-errors | 1.3.0 | Referências a tipos de erro nativos. | call-bind-apply-helpers, dunder-proto, es-object-atoms, get-intrinsic, side-channel, side-channel-list, side-channel-map, side-channel-weakmap |
| es-object-atoms | 1.1.2 | Operações básicas de objetos. | get-intrinsic, get-proto |
| escape-html | 1.0.3 | Escapa conteúdo HTML. | express, finalhandler, send, serve-static |
| etag | 1.8.1 | Calcula identificadores de cache HTTP. | express, send |
| finalhandler | 1.3.2 | Finaliza requisições e erros sem handler. | express |
| forwarded | 0.2.0 | Analisa cabeçalhos de encaminhamento. | proxy-addr |
| fresh | 0.5.2 | Verifica validade de cache HTTP. | express, send |
| function-bind | 1.1.2 | Compatibilidade de binding de funções. | call-bind-apply-helpers, get-intrinsic, hasown |
| get-intrinsic | 1.3.0 | Obtém funções/objetos intrínsecos. | call-bound, side-channel-map, side-channel-weakmap |
| get-proto | 1.0.1 | Consulta protótipo de objetos. | get-intrinsic |
| gopd | 1.2.0 | Obtém descritores de propriedade. | dunder-proto, get-intrinsic |
| has-symbols | 1.1.0 | Detecta suporte a símbolos. | get-intrinsic |
| hasown | 2.0.4 | Verifica propriedades próprias. | get-intrinsic |
| http-errors | 2.0.1 | Cria erros com status HTTP. | body-parser, express, raw-body, send |
| iconv-lite | 0.4.24 | Converte codificações de texto. | body-parser, raw-body |
| inherits | 2.0.4 | Auxilia herança de construtores de dependências. | http-errors |
| ipaddr.js | 1.9.1 | Analisa endereços IPv4/IPv6. | proxy-addr |
| math-intrinsics | 1.1.0 | Referências a operações matemáticas nativas. | get-intrinsic |
| media-typer | 0.3.0 | Analisa tipo/subtipo de mídia. | type-is |
| merge-descriptors | 1.0.3 | Combina descritores de objetos. | express |
| methods | 1.1.2 | Enumera métodos HTTP. | express |
| mime | 1.6.0 | Determina MIME pela extensão. | send |
| mime-db | 1.52.0 | Base de tipos MIME. | mime-types |
| mime-types | 2.1.35 | Consulta e formata tipos MIME. | accepts, type-is |
| ms | 2.0.0 | Converte durações textuais/numéricas. | debug |
| negotiator | 0.6.3 | Negocia variantes de respostas HTTP. | accepts |
| object-inspect | 1.13.4 | Representação textual de objetos. | side-channel, side-channel-list, side-channel-map, side-channel-weakmap |
| on-finished | 2.4.1 | Detecta término de resposta HTTP. | body-parser, express, finalhandler, send |
| parseurl | 1.3.3 | Analisa URL de requisição. | express, finalhandler, serve-static |
| path-to-regexp | 0.1.13 | Compila padrões de rotas. | express |
| proxy-addr | 2.0.8 | Resolve endereço de cliente/proxy. | express |
| qs | 6.16.0 | Analisa e serializa query strings. | body-parser, express |
| range-parser | 1.2.1 | Analisa requisições de intervalos de bytes. | express, send |
| raw-body | 2.5.3 | Lê corpo bruto de requisição. | body-parser |
| safe-buffer | 5.2.1 | Compatibilidade de Buffer. | content-disposition, express |
| safer-buffer | 2.1.2 | Operações seguras de Buffer. | iconv-lite |
| send | 0.19.2 | Entrega arquivos com cache e intervalos. | express, serve-static |
| ms (aninhado em send) | 2.1.3 | Converte durações textuais/numéricas. | send |
| serve-static | 1.16.3 | Middleware de arquivos estáticos. | express |
| setprototypeof | 1.2.0 | Compatibilidade de mudança de protótipo. | express, http-errors |
| side-channel | 1.1.1 | Armazena metadados associados a objetos. | qs |
| side-channel-list | 1.0.1 | Canal auxiliar baseado em lista. | side-channel |
| side-channel-map | 1.0.1 | Canal auxiliar baseado em Map. | side-channel, side-channel-weakmap |
| side-channel-weakmap | 1.0.2 | Canal auxiliar baseado em WeakMap. | side-channel |
| statuses | 2.0.2 | Mapeia códigos/mensagens HTTP. | express, finalhandler, http-errors, send |
| toidentifier | 1.0.1 | Converte texto em identificador. | http-errors |
| type-is | 1.6.18 | Verifica tipos de conteúdo da requisição. | body-parser, express |
| unpipe | 1.0.0 | Desconecta streams. | body-parser, finalhandler, raw-body |
| utils-merge | 1.0.1 | Combina propriedades de objetos. | express |
| vary | 1.1.2 | Manipula cabeçalho HTTP Vary. | express |

## Bibliotecas nativas Node.js

Não são instaladas pelo npm. Imports com ou sem prefixo node: referem-se ao runtime.

| API | Descrição resumida | Uso no projeto |
| --- | --- | --- |
| fs / fs/promises | Arquivos e diretórios. | Scripts de assets, relatórios, inventário e testes. |
| path / url | Caminhos e URLs de módulos. | server.js, geração de documentação e scripts. |
| assert / assert/strict | Asserções. | Testes mecânicos, visuais e de persistência. |
| crypto | Hashes. | Integridade da personagem/assets e comparações. |
| child_process | Processos externos. | Scripts que coordenam validações e ferramentas locais. |
| Buffer | Bytes e base64. | PNG/JPEG, capturas CDP e leitura de arquivos. |
| fetch / WebSocket | HTTP e conexão bidirecional nativos. | Scripts de navegador conectados ao Chrome/CDP; não usa Puppeteer/Playwright. |

## APIs nativas do navegador

| API | Descrição resumida | Onde é usada |
| --- | --- | --- |
| Canvas 2D / DOMMatrix | Desenho e matrizes. | game.js, renderizadores, câmera, iluminação, HUD e Toy Room. |
| Web Audio API | Síntese, volume e reprodução. | audio.js, AudioController e cues das cinematics. |
| DOM / CustomEvent / PointerEvent | Interface e eventos. | main.js, InputController, ToyRoomPhase e introdução. |
| Gamepad API | Lê controle padrão. | InputController (Dark Room) e ToyRoomPhase.pollGamepad(). |
| localStorage | Save/preferências locais. | CampaignProgress, OpeningSequence e integração de áudio/menu. |
| requestAnimationFrame / performance.now / timers | Loop e relógios. | game.js, input, animações, cooldowns e UI; fonte de não determinismo nos comparadores. |
| ResizeObserver / visualViewport / getBoundingClientRect | Layout e área disponível. | game.js, ViewportController, AndroidFraming e áreas seguras de diálogo. |
| fetch / Image | Manifesto e imagens. | AssetManager e carregamento de recursos. |

## Ferramentas e serviços de desenvolvimento

| Ferramenta | Uso |
| --- | --- |
| Node.js 24 / npm | Versão configurada na CI; npm ci reproduz lockfile. |
| Chrome + Chrome DevTools Protocol (CDP) | Scripts de navegador usam HTTP :9222, WebSocket e Runtime/Page/Input/Emulation; servidor local geralmente :3000. Chrome e abas são pré-condições, não pacotes npm. |
| GitHub Actions | Pipeline deploy-pages.yml: checkout@v4, setup-node@v4, configure-pages@v5, upload-pages-artifact@v3 e deploy-pages@v4. |
| GitHub Pages / rsync | Publicação estática em _site após validar recursos; rsync é ferramenta do runner. |

As bibliotecas internas (GameState, renderizadores, contextos, controllers e cinematics) estão no [manual](MANUAL-DESENVOLVIMENTO.md) e na [referência de funções](REFERENCIA-METODOS.md); não são dependências externas. A documentação descreve a cópia local e não certifica publicação dessas mudanças.
