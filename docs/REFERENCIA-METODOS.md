# Referência de métodos e funções

Inventário de `src/js`, gerado a partir da cópia local em 06/10/2026. Consulte o [manual](MANUAL-DESENVOLVIMENTO.md) para contratos, arquitetura e receitas.

As linhas referem-se ao snapshot local e mudam após edições. O inventário inclui declarações de funções, métodos escritos com sintaxe de método e funções atribuídas com parâmetros entre parênteses. Não é um parser completo de JavaScript: callbacks anônimos, aliases/reexportações e algumas lambdas de parâmetro simples não são contratos separados aqui. APIs retornadas por fábricas estão descritas no manual. A presença de uma função interna não a torna pública. Descrições por família são orientação de leitura; as tabelas do manual detalham os contratos centrais.

Regenerar na raiz: `node scripts/generate-method-reference.js`. Revise também as descrições e o manual após mudar contratos.

## src/js/assets/AssetManager.js

[Implementação](../src/js/assets/AssetManager.js). Dados/classes exportados: `AssetManager`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 4 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `loadManifest(url = this.manifestUrl)` | Método declarado | 13 | Busca manifesto e atualiza status; rejeita falha. |
| `preload()` | Método declarado | 36 | Pré-carrega entradas de imagens do manifesto. |
| `loadImage(key, source)` | Método declarado | 42 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `removeSolidBackground(image, background = 'light')` | Método declarado | 78 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getRegion(key, region)` | Método declarado | 114 | Valida limites e cacheia recorte do atlas. |
| `normalizeCharacterPalette(image)` | Método declarado | 147 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `get(key)` | Método declarado | 169 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `has(key)` | Método declarado | 173 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getStatus(key)` | Método declarado | 177 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isReady(key)` | Método declarado | 181 | Consulta uma chave ou prontidão do manifesto; sem chave não certifica todas as imagens. |
| `clearRegionCache()` | Método declarado | 188 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `createAssetManager(options)` | Função | 193 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/assets/currentScenery.js

[Implementação](../src/js/assets/currentScenery.js). Dados/classes exportados: `CURRENT_SCENERY`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawCurrentScenery(ctx,assets,type,x,floorY)` | Função | 22 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/assets/darkRoomAtlas.js

[Implementação](../src/js/assets/darkRoomAtlas.js). Dados/classes exportados: `SHEET_WIDTH`, `SHEET_HEIGHT`, `SPRITESHEET_PATH`, `darkRoomAtlas`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `validateAtlasRegion(region, sheetW = SHEET_WIDTH, sheetH = SHEET_HEIGHT)` | Função | 280 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getDarkRoomAtlasRegion(key)` | Função | 289 | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/assets/index.js

[Implementação](../src/js/assets/index.js).

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/assets/officialCharacter.js

[Implementação](../src/js/assets/officialCharacter.js). Dados/classes exportados: `OFFICIAL_SOURCE_SHA256`, `OFFICIAL_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/audio.js

[Implementação](../src/js/audio.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createAudioSystem()` | Função | 1 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `getDestination()` | Função | 11 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `updateMusicVolumes()` | Função | 25 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `setMasterVolume(vol)` | Função | 35 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | Função | 44 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(muted)` | Função | 48 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `toggleMute()` | Função | 57 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getIsMuted()` | Função | 61 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `registerActiveNode(node)` | Função | 70 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cleanup()` | Função atribuída | 73 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearActiveSounds()` | Função | 81 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMusicTrack()` | Função | 92 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `initAudio()` | Função | 124 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startMusic()` | Função | 147 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopMusic()` | Função | 166 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stopAllAudio()` | Função | 176 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playJumpSound()` | Função | 182 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLongJumpSound(progress = 0)` | Função | 205 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLevelUpChime(level = 0)` | Função | 242 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOpeningAmbience()` | Função | 266 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyVoiceBlip(freq = 920)` | Função | 284 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyLaugh()` | Função | 307 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playEscapePowerUp()` | Função | 335 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFallFailSound()` | Função | 362 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playTapeRipSound()` | Função | 385 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDramaticTumbleSound()` | Função | 420 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyThudSound()` | Função | 444 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyShockVoice()` | Função | 467 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyFrustratedSound()` | Função | 492 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPhase3StartFanfare()` | Função | 516 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `getToyRoomTrackUrls(track)` | Função | 547 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getToyRoomAudioElement()` | Função | 557 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setToyRoomMusicTrack(track)` | Função | 592 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `startToyRoomMusic({ fade = 1 } = {})` | Função | 611 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `setToyRoomMusicFade(value)` | Função | 635 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPortalExitWhoosh()` | Função | 640 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playSoftMagicBurst()` | Função | 657 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopToyRoomMusic()` | Função | 672 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | Função | 683 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | Função | 698 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playPickUpSound()` | Função | 713 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDropSound()` | Função | 738 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOrganizeChime()` | Função | 761 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playToyRoomVictory()` | Função | 787 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playCombatSound(event, arena = false)` | Função | 820 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playArenaMusicBeat(beat)` | Função | 881 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopArenaMusic()` | Função | 901 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getAudioContext()` | API/lambda de objeto | 949 | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/cinematics/OpeningSequence.js

[Implementação](../src/js/cinematics/OpeningSequence.js). Dados/classes exportados: `OPENING_STORAGE_KEY`, `OPENING_DIALOGUE`, `OpeningSequence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({storage, onReveal = () => {}, onComplete = () => {}, onCue = () => {}} = {})` | Método declarado | 19 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `hasCompleted()` | Método declarado | 29 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `start()` | Método declarado | 34 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `cancel()` | Método declarado | 41 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reset()` | Método declarado | 42 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | 46 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 49 | Reaplica a captura específica; confira referências e dados transitórios. |
| `update(dt)` | Método declarado | 58 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `renderFade(ctx, canvas)` | Método declarado | 74 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `render(ctx, canvas, {assets, drawRoom, lighting, fairyRenderer})` | Método declarado | 81 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/cinematics/ToyRoomIntroduction.js

[Implementação](../src/js/cinematics/ToyRoomIntroduction.js). Dados/classes exportados: `TOY_ROOM_INTRO_STAGES`, `ToyRoomIntroduction`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `along(points, p)` | Função atribuída | 7 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor({ onComplete = () => {}, onEvent = () => {} } = {})` | Método declarado | 19 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `start(context)` | Método declarado | 25 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | 41 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `prepare({ phase, departure, audio })` | Método declarado | 57 | Prepara contexto visual da introdução; consulte dependências no módulo. |
| `cameraFrame(canvas)` | Método declarado | 108 | Calcula enquadramento narrativo da introdução conforme etapa e relógio. |
| `fairyPosition()` | Método declarado | 130 | Calcula posição visual da fada durante a introdução. |
| `render(ctx, canvas)` | Método declarado | 143 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialogue(ctx, canvas, text)` | Método declarado | 198 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `cancel()` | Método declarado | 226 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/config.js

[Implementação](../src/js/config.js). Dados/classes exportados: `DEBUG_COLLISIONS`, `GAME_CONFIG`, `FLOOR_Y`, `CUTSCENE_DIALOGUE`, `platforms`, `exitDoor`, `phase3Platforms`, `trueExitDoor`, `roomScenery`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createBabyState()` | Função | 12 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `getEscapeStats(level)` | Função | 46 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getPhase3Stats(level)` | Função | 67 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `createFairyState()` | Função | 81 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/AndroidFraming.js

[Implementação](../src/js/controllers/AndroidFraming.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `androidFrameOffset({ enabled, height, cssHeight, bottomInset = 0, topInset = 0, feetY, topY })` | Função | 2 | Calcula elevação visual Android com reservas e proteção do topo. |
| `createAndroidFraming(canvas)` | Função | 12 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `offset(feetY, topY)` | Método declarado | 24 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/AudioController.js

[Implementação](../src/js/controllers/AudioController.js). Dados/classes exportados: `AudioController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 10 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `init()` | Método declarado | 24 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handleVisibilityChange()` | Método declarado | 34 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleWindowBlur()` | Método declarado | 43 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleWindowFocus()` | Método declarado | 49 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onBackground()` | Método declarado | 55 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onForeground()` | Método declarado | 68 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setMasterVolume(volume)` | Método declarado | 84 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | Método declarado | 91 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(muted)` | Método declarado | 98 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `isMuted()` | Método declarado | 106 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | Método declarado | 110 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `initAudio()` | Método declarado | 115 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startMusic()` | Método declarado | 121 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `playOpeningAmbience()` | Método declarado | 127 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startMusicBox()` | Método declarado | 129 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopMusic()` | Método declarado | 135 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stopAllAudio()` | Método declarado | 141 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearActiveSounds()` | Método declarado | 147 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playJumpSound()` | Método declarado | 153 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLongJumpSound(progress)` | Método declarado | 159 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLevelUpChime(level)` | Método declarado | 165 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyVoiceBlip(freq)` | Método declarado | 171 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyLaugh()` | Método declarado | 177 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playEscapePowerUp()` | Método declarado | 183 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFallFailSound()` | Método declarado | 189 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playTapeRipSound()` | Método declarado | 195 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDramaticTumbleSound()` | Método declarado | 201 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyThudSound()` | Método declarado | 207 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyShockVoice()` | Método declarado | 213 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyFrustratedSound()` | Método declarado | 219 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPhase3StartFanfare()` | Método declarado | 225 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setToyRoomMusicFade(value)` | Método declarado | 231 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setToyRoomMusicTrack(track)` | Método declarado | 232 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPortalExitWhoosh()` | Método declarado | 237 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playSoftMagicBurst()` | Método declarado | 238 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startToyRoomMusic(options)` | Método declarado | 240 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopToyRoomMusic()` | Método declarado | 246 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | Método declarado | 252 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | Método declarado | 258 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getToyRoomAudioElement()` | Método declarado | 264 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `playPickUpSound()` | Método declarado | 271 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDropSound()` | Método declarado | 277 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOrganizeChime(streak)` | Método declarado | 283 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playToyRoomVictory()` | Método declarado | 289 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playCombatSound(event)` | Método declarado | 295 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `destroy()` | Método declarado | 301 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `createAudioController(options = {})` | Função | 313 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/CameraController.js

[Implementação](../src/js/controllers/CameraController.js). Dados/classes exportados: `CameraController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 8 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `reset(x = 0, y = 0, zoom = 1.0)` | Método declarado | 19 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setZoom(zoom, immediate = false)` | Método declarado | 27 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setPosition(x, y, immediate = false)` | Método declarado | 34 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `update(dt, state, canvas, callbacks = {})` | Método declarado | 52 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `syncFromState(state)` | Método declarado | 201 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncToState(state)` | Método declarado | 210 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `applyTransform(ctx, canvas, baby, fairy, presentationY = this.y, presentationX = this.x, sourceX = this.x)` | Método declarado | 226 | Compõe foco/zoom e diferença entre pose original e visual no contexto. |
| `createCameraController(options = {})` | Função | 241 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/CameraPresentation.js

[Implementação](../src/js/controllers/CameraPresentation.js). Dados/classes exportados: `CameraPresentation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | 3 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `reset()` | Método declarado | 4 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | 5 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 6 | Reaplica a captura específica; confira referências e dados transitórios. |
| `mobileFrame({ target, enabled, stable, anticipate, tick, width, height })` | Método declarado | 8 | Interpola entrada do enquadramento móvel. |
| `step(from, to, dimension)` | Função atribuída | 28 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame({ x, y, playerX, groundLead, targetY, onGround, active, narrative, tick, width, height, cssWidth, cssHeight, zoom })` | Método declarado | 38 | Calcula pose visual estável sem escrever na simulação. |
| `move(from, to, dimension, tolerance)` | Função atribuída | 51 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clamp(delta, limit)` | Função atribuída | 71 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/EscapeFairyGuide.js

[Implementação](../src/js/controllers/EscapeFairyGuide.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getEscapeGuideTarget(baby, platforms, exitDoor)` | Função | 2 | Seleciona centro de chegada do próximo apoio ou porta. |
| `updateEscapeFairyGuide(fairy, target, dt = 1)` | Função | 12 | Atualiza posição/velocidade da guia com amortecimento crítico. |

## src/js/controllers/InputController.js

[Implementação](../src/js/controllers/InputController.js). Dados/classes exportados: `InputController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(game, options = {})` | Método declarado | 8 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `init()` | Método declarado | 28 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `triggerJump(source)` | Método declarado | 38 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handlePointerDown(event)` | Método declarado | 63 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyDown(event)` | Método declarado | 103 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | 142 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gamepadLoop()` | Método declarado | 191 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGamepadPollingLoop()` | Método declarado | 197 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleGamepadDisconnected(event)` | Método declarado | 203 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `destroy()` | Método declarado | 210 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `bindInput(game)` | Função | 229 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pollGamepad()` | API/lambda de objeto | 233 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | API/lambda de objeto | 234 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/controllers/MobileZoom.js

[Implementação](../src/js/controllers/MobileZoom.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `isMobileDevice(nav = globalThis.navigator)` | Função | 2 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getMobileZoomFrame({ enabled, width, height, bounds, anchor, margin = 24, stable = false, anticipate = false })` | Função | 8 | Retorna escala e translações de apresentação a partir dos limites/alvo. |
| `clamp(value, min, max)` | Função atribuída | 25 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/ViewportController.js

[Implementação](../src/js/controllers/ViewportController.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createViewportController({ canvas, darkCanvas, lighting, host, onOrientation })` | Função | 2 | Cria resize com Canvas, iluminação, host e callback de orientação. |
| `resize()` | Função | 3 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/debug/AtlasDebugger.js

[Implementação](../src/js/debug/AtlasDebugger.js). Dados/classes exportados: `AtlasDebugger`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 10 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | 21 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `validateAllRegions()` | Método declarado | 28 | Confere recortes do atlas contra imagens carregadas. |
| `initDOM()` | Método declarado | 83 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toggle(forceState = null)` | Método declarado | 176 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Método declarado | 187 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `createAtlasDebugger(options)` | Função | 298 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/debug/CameraQaObserver.js

[Implementação](../src/js/debug/CameraQaObserver.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createCameraQaObserver({ host, snapshot })` | Função | 2 | Cria observador opcional ativado por cameraQa; lê snapshot sem alterar câmera. |
| `record(transform = null)` | Método declarado | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/effects/ArtFinish.js

[Implementação](../src/js/effects/ArtFinish.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `applyArtFinish(ctx, canvas)` | Função | 2 | Aplica dessaturação em coordenadas de tela. |

## src/js/effects/ParticleSystem.js

[Implementação](../src/js/effects/ParticleSystem.js). Dados/classes exportados: `ParticleSystem`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 10 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `clear()` | Método declarado | 18 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `spawnBabyJumpDust(bx, bw, by, bh, bvx, isEscapeMode = false, escapeLevel = 0)` | Método declarado | 26 | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyJumpPuff(x, y, count = 5)` | Método declarado | 56 | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyLandingPuff(x, y, count = 5)` | Método declarado | 81 | Cria partículas/efeitos no buffer correspondente. |
| `spawnPhase3Ribbons(baby, phase3Level, stats, tick)` | Método declarado | 105 | Cria partículas/efeitos no buffer correspondente. |
| `spawnEscapeRibbons(baby, escapeLevel, stats, tick)` | Método declarado | 129 | Cria partículas/efeitos no buffer correspondente. |
| `update(dt = 1.0)` | Método declarado | 153 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateBabyJumpDust(dt = 1.0)` | Método declarado | 158 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateSpeedRibbons(dt = 1.0)` | Método declarado | 172 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `renderSpeedRibbons(ctx, canvas, camX)` | Método declarado | 187 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderBabyJumpDust(ctx, canvas, camX)` | Método declarado | 207 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `render(ctx, canvas, camX)` | Método declarado | 247 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `createParticleSystem(options = {})` | Função | 253 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/effects/TransitionEffects.js

[Implementação](../src/js/effects/TransitionEffects.js). Dados/classes exportados: `TransitionEffects`, `transitionEffects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderPortalWipe(ctx, canvas, cameraX, cameraY, trueExitDoor, transitionWipeAlpha, tick = 0, presentationTransform = null)` | Método declarado | 20 | Desenha transição do portal usando matriz de apresentação quando fornecida. |

## src/js/effects/index.js

[Implementação](../src/js/effects/index.js).

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/entities/BabyRenderer.js

[Implementação](../src/js/entities/BabyRenderer.js). Dados/classes exportados: `BabyRenderer`, `babyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | 5 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | 6 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `resolveAnimationState(baby, state)` | Método declarado | 7 | Escolhe animação oficial conforme ação e flags do estado. |
| `renderPose(ctx, assets, pose, frameIndex, centerX, feetY, height, facing = 1, visualScale = 1)` | Método declarado | 74 | Desenha recorte ancorado no centro/pés, com escala visual. |
| `render(ctx, baby, state = {}, camX = 0, options = {})` | Método declarado | 92 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/entities/FairyRenderer.js

[Implementação](../src/js/entities/FairyRenderer.js). Dados/classes exportados: `FairyRenderer`, `fairyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `render(ctx, fairy, state = {}, camX = 0, options = {})` | Método declarado | 18 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/entities/index.js

[Implementação](../src/js/entities/index.js).

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/environment/BackgroundRenderer.js

[Implementação](../src/js/environment/BackgroundRenderer.js). Dados/classes exportados: `BackgroundRenderer`, `backgroundRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getBackgroundViewport(ctx, canvas)` | Função | 13 | Inverte a matriz real para determinar os limites visíveis do fundo. |
| `constructor(options = {})` | Método declarado | 30 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | 35 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `drawAtlasSceneryItem(ctx, assets, type, sx, item, floorY)` | Método declarado | 43 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderWall(ctx, canvas, camX = 0, options = {})` | Método declarado | 165 | Desenha parede, parallax, piso e rodapé com cobertura do viewport. |
| `renderScenery(ctx, canvas, scenery = defaultRoomScenery, camX = 0, options = {})` | Método declarado | 530 | Desenha objetos decorativos do piso. |
| `render(ctx, canvas, camX = 0, options = {})` | Método declarado | 707 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/environment/LightingSystem.js

[Implementação](../src/js/environment/LightingSystem.js). Dados/classes exportados: `LightingSystem`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 16 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `resize(width, height)` | Método declarado | 21 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(ctx, canvas, state = {}, baby = {}, fairy = {}, camX = 0, camY = 0, options = {})` | Método declarado | 27 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pool(x, y, rx, ry, strength)` | Função atribuída | 58 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createLightingSystem(options = {})` | Função | 176 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/environment/PlatformRenderer.js

[Implementação](../src/js/environment/PlatformRenderer.js). Dados/classes exportados: `PLATFORM_SURFACES`, `PlatformRenderer`, `platformRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 49 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | 54 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `drawAtlasPlatformSprite(ctx, assets, style, sx, p, tick = 0)` | Método declarado | 62 | Recorta/calibra sprite de plataforma; não redefine colisões. |
| `renderPlatforms(ctx, canvas, camX = 0, options = {})` | Método declarado | 744 | Desenha apoios com atlas/alternativas e descarte visual. |
| `renderExitDoor(ctx, canvas, camX = 0, options = {})` | Método declarado | 1274 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderTrueExitDoor(ctx, canvas, camX = 0, options = {})` | Método declarado | 1332 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderTutorialArrow(ctx, canvas, camX = 0, options = {})` | Método declarado | 1446 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/environment/StorybookPlatforms.js

[Implementação](../src/js/environment/StorybookPlatforms.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `gradient(ctx,y,h,colors)` | Função | 11 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `box(ctx,x,y,w,h,material='wood',radius=3)` | Função | 15 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `line(ctx,points,color=INK,width=1)` | Função | 31 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ellipse(ctx,x,y,rx,ry,color)` | Função | 35 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawContactEdge(ctx,x,y,w,material='wood',depth=5)` | Função | 39 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `book(ctx,x,y,w,h,material='purple')` | Função | 47 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawToy(ctx,p,w,assets,tick)` | Função | 54 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawStorybookPlatform(ctx,assets,p,sx,tick=0)` | Função | 179 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/environment/index.js

[Implementação](../src/js/environment/index.js).

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/environment/nightWindows.js

[Implementação](../src/js/environment/nightWindows.js). Dados/classes exportados: `NIGHT_WINDOWS`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/game.js

[Implementação](../src/js/game.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createGame(canvas, uiFeedback, callbacks = {})` | Função | 33 | Cria o coordenador e devolve a API de integração com a página. |
| `onComplete()` | API/lambda de objeto | 71 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginToyRoomIntroduction()` | Função | 82 | Captura saída e cria sala de apresentação sem input antes da fase ativa. |
| `beginOpeningGameplay()` | Função | 129 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enterFirstJumpTutorial()` | Função | 147 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncStateToLocals()` | Função | 161 | Atualiza locais a partir de GameState após operações delegadas. |
| `syncLocalsToState()` | Função | 211 | Copia variáveis locais para GameState antes de delegações/captura. |
| `setLastInputDevice(dev)` | Função | 261 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getActivePromptDevice()` | Função | 265 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `startStandbyPreparation()` | Função | 269 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `confirmStandby()` | Função | 275 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetBabyPhysicsBody(targetX, targetY, facing = 1)` | Função | 282 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `triggerGameOver()` | Função | 288 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retryGame()` | Função | 294 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restartToTitle()` | Função | 302 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startToyRoomIntroduction()` | Função | 314 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startToyRoomPhase({ fromIntroduction = false } = {})` | Função | 334 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleResize()` | Função | 378 | Dimensiona bitmap e canvases auxiliares a partir do layout CSS. |
| `startTruePortalTransition()` | Função | 424 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `showFailMessage()` | Função | 430 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startCastleCutscene()` | Função | 434 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advanceCutscene()` | Função | 440 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishCutscene()` | Função | 446 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startPlotTwistCutscene()` | Função | 453 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advancePlotTwist()` | Função | 459 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishPlotTwistAndStartTutorial()` | Função | 465 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetToStart(failedMidClimb = false, shouldPlayFailSound = true)` | Função | 471 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `doJump(inputSource)` | Função | 478 | Seleciona salto ou avanço narrativo conforme o estado atual. |
| `spawnFairyFlightDust(fx, fy, fvx, fvy)` | Função | 625 | Cria partículas/efeitos no buffer correspondente. |
| `spawnFairySparkles(x, y, count = 2)` | Função | 629 | Cria partículas/efeitos no buffer correspondente. |
| `updateFairyParticles()` | Função | 633 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `spawnBabyJumpDust(bx, bw, by, bh, bvx)` | Função | 638 | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyJumpPuff(x, y, count = 5)` | Função | 642 | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyLandingPuff(x, y)` | Função | 646 | Cria partículas/efeitos no buffer correspondente. |
| `updateBabyJumpDust(dt = 1.0)` | Função | 650 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `drawBackgroundWall(camX)` | Função | 656 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawSceneryItems(camX)` | Função | 660 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawPlatforms(camX)` | Função | 664 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawExitDoor(camX)` | Função | 675 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawTrueExitDoor(camX)` | Função | 686 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBabyManaStyle(camX)` | Função | 696 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFairy(camX)` | Função | 702 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `applyDarkAtmosphereWithLights(camX, camY = 0)` | Função | 708 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawSpeedRibbons(camX)` | Função | 719 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBabyJumpDust(camX)` | Função | 723 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawEscapeBanner()` | Função | 728 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialoguePortrait(pCtx, charType, px, py, radius, mood = 'normal')` | Função | 732 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapDialogueText(pCtx, text, maxWidth)` | Função | 736 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawCutsceneDialogue(transform)` | Função | 740 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawTutorialArrow(camX)` | Função | 753 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `get(target, name)` | API/lambda de objeto | 815 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `set(target, name, value)` | API/lambda de objeto | 816 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `update(dt = 1.0)` | Função | 823 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `onLagBehind()` | API/lambda de objeto | 1222 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Função | 1231 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `togglePause()` | Função | 1240 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Função | 1257 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `saveProgress()` | Função | 1263 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restoreProgress(saved)` | Função | 1275 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `newCampaign()` | Função | 1301 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `saveOnHide()` | Função atribuída | 1318 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `recordCameraQa(transform = null)` | Função | 1336 | Emite observação optativa de câmera; ativada por cameraQa e callback de teste. |
| `loop(currentTime = performance.now())` | Função | 1340 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isFirstJumpTutorial()` | API/lambda de objeto | 1380 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGrounded()` | API/lambda de objeto | 1382 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isCutsceneActive()` | API/lambda de objeto | 1383 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGameOver()` | API/lambda de objeto | 1384 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isToyRoomMode()` | API/lambda de objeto | 1385 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | API/lambda de objeto | 1387 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | API/lambda de objeto | 1414 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | API/lambda de objeto | 1415 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setMasterVolume(v)` | API/lambda de objeto | 1416 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | API/lambda de objeto | 1417 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(m)` | API/lambda de objeto | 1418 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `isMuted()` | API/lambda de objeto | 1419 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | API/lambda de objeto | 1420 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isPaused()` | API/lambda de objeto | 1421 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `hasProgress()` | API/lambda de objeto | 1424 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDifficulty()` | API/lambda de objeto | 1425 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `destroy()` | Método declarado | 1428 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `start(difficulty = 'NORMAL')` | Método declarado | 1437 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `isGrounded()` | API/lambda de objeto | 1460 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isCutsceneActive()` | API/lambda de objeto | 1461 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGameOver()` | API/lambda de objeto | 1466 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isToyRoomMode()` | API/lambda de objeto | 1469 | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/input.js

[Implementação](../src/js/input.js).

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/main.js

[Implementação](../src/js/main.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `refreshCampaignMenu()` | Função | 31 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updatePauseButtonState()` | Função | 55 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `toggleGamePause()` | Função | 72 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateSoundButtonState()` | Função | 87 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `onGameOver()` | API/lambda de objeto | 135 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onRestartToTitle()` | API/lambda de objeto | 147 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGame(event)` | Função | 168 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleRetry(event)` | Função | 197 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleRestart(event)` | Função | 229 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `addSafeAction(element, handler)` | Função | 262 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `safeHandler(event)` | Função atribuída | 265 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handleToyRoomSwitch(event)` | Função | 282 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollOverlayGamepad()` | Função | 388 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/narrative/DarkRoomNarrative.js

[Implementação](../src/js/narrative/DarkRoomNarrative.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateStandbyNarrative(context, dt)` | Função | 5 | Mantém pose de espera, fada, partículas e foco narrativo de standby. |
| `updateTransicaoStandbyNarrative(context, dt)` | Função | 35 | Avança saída de standby, postura, alfa e retorno do enquadramento. |
| `updateCasteloNarrative(context, dt)` | Função | 89 | Sequencia encontro no castelo, diálogos e liberação da fuga. |
| `updateReviravoltaNarrative(context, dt)` | Função | 148 | Avança queda/checagem e diálogos da porta falsa; coordena atores e zoom. |
| `updateTutorialRetornoNarrative(context, dt)` | Função | 304 | Demonstra arco da fada e devolve controle no retorno. |
| `updatePortalNarrative(context, dt)` | Função | 348 | Avança aproximação/íris do portal e dispara introdução da Toy Room. |

## src/js/narrative/PoeticNarrator.js

[Implementação](../src/js/narrative/PoeticNarrator.js). Dados/classes exportados: `POETIC_LINES`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getPauseNarration(state)` | Função | 14 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `renderPoeticNarration(ctx, canvas, text, options = {})` | Função | 21 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/rendering/DarkRoomRenderPipeline.js

[Implementação](../src/js/rendering/DarkRoomRenderPipeline.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderDarkRoom(context)` | Função | 9 | Compõe apresentação, camadas e interface; update de simulação permanece em game.js. |
| `drawRoom()` | API/lambda de objeto | 17 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/runtime/RuntimeContext.js

[Implementação](../src/js/runtime/RuntimeContext.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createRuntimeContext({ state, audio, camera, assets, input, effects, campaign })` | Função | 2 | Agrega referências existentes; não cria serviços nem executa lógica de jogo. |

## src/js/state/CampaignProgress.js

[Implementação](../src/js/state/CampaignProgress.js). Dados/classes exportados: `CAMPAIGN_STORAGE_KEY`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `captureState(state)` | Função | 10 | Seleciona estado serializável da campanha. |
| `restoreState(state, saved)` | Função | 13 | Restaura valores preservando referências de objetos/arrays existentes. |
| `createCampaignProgress(storage)` | Função | 23 | Cria leitura, gravação e limpeza do progresso local com alternativa em memória. |
| `read()` | Método declarado | 28 | Lê e valida save da campanha; pode usar memória da sessão. |
| `write(data)` | Método declarado | 67 | Serializa save versionado e tenta gravar no storage. |
| `clear()` | Método declarado | 72 | Configura/reinicializa valores do componente; revise o escopo da mutação. |

## src/js/state/GameDifficulty.js

[Implementação](../src/js/state/GameDifficulty.js). Dados/classes exportados: `normalizeDifficulty`, `EASY_LANDING_MARGIN`, `EASY_LANDING_DEPTH`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `easyLanding(baby, x, width, y)` | Função | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyGuideBlend(difficulty, dt)` | Função | 11 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/state/GameState.js

[Implementação](../src/js/state/GameState.js). Dados/classes exportados: `GameState`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, uiFeedback, callbacks = {})` | Método declarado | 12 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setLastInputDevice(dev)` | Método declarado | 21 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getActivePromptDevice()` | Método declarado | 27 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `spawnFairySparkles(x, y, count = 2)` | Método declarado | 44 | Cria partículas/efeitos no buffer correspondente. |
| `spawnFairyFlightDust(fx, fy, fvx, fvy)` | Método declarado | 66 | Cria partículas/efeitos no buffer correspondente. |
| `updateFairyParticles()` | Método declarado | 86 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `startStandbyPreparation(audio)` | Método declarado | 99 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `confirmStandby(audio)` | Método declarado | 134 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetBabyPhysicsBody(targetX, targetY, facing = 1)` | Método declarado | 152 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `triggerGameOver(audio)` | Método declarado | 174 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retryGame(audio)` | Método declarado | 199 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restartToTitle(audio)` | Método declarado | 214 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `showFailMessage()` | Método declarado | 242 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startCastleCutscene(audio)` | Método declarado | 258 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advanceCutscene(audio)` | Método declarado | 274 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishCutscene(audio)` | Método declarado | 286 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startPlotTwistCutscene(audio)` | Método declarado | 323 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advancePlotTwist(audio)` | Método declarado | 349 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishPlotTwistAndStartTutorial(audio)` | Método declarado | 365 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startTruePortalTransition(audio)` | Método declarado | 404 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetToStart(failedMidClimb = false, shouldPlayFailSound = true, audio)` | Método declarado | 426 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `createGameState(canvas, uiFeedback, callbacks)` | Função | 513 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/state/StateVariables.js

[Implementação](../src/js/state/StateVariables.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createDefaultStateVariables()` | Função | 6 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/toy-room/ArenaAudioProfile.js

[Implementação](../src/js/toy-room/ArenaAudioProfile.js). Dados/classes exportados: `ArenaAudioProfile`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(audio)` | Método declarado | 3 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `transform()` | Método declarado | 4 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enter()` | Método declarado | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | 9 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `sound(event)` | Método declarado | 14 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `leave({ resume = true } = {})` | Método declarado | 18 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `snapshot()` | Método declarado | 23 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 24 | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ArenaBoss.js

[Implementação](../src/js/toy-room/ArenaBoss.js). Dados/classes exportados: `ArenaBoss`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | 3 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `update(dt, battle)` | Método declarado | 4 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `snapshot()` | Método declarado | 15 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 16 | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ArenaCamera.js

[Implementação](../src/js/toy-room/ArenaCamera.js). Dados/classes exportados: `ArenaCamera`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | 5 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `update(dt, player, enemy, jump = 0, impact = null)` | Método declarado | 6 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `envelope(player, enemy, jump)` | Método declarado | 18 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(layout, room, battle)` | Método declarado | 23 | Calcula pose visual estável sem escrever na simulação. |
| `snapshot()` | Método declarado | 38 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 39 | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ArenaCombatContact.js

[Implementação](../src/js/toy-room/ArenaCombatContact.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaEnemyContact(state, enemy)` | Função | 2 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaEnemies.js

[Implementação](../src/js/toy-room/ArenaEnemies.js). Dados/classes exportados: `ARENA_ENEMIES`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderArenaEnemyPresence(ctx, enemy, ground)` | Função | 8 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ArenaEnvironment.js

[Implementação](../src/js/toy-room/ArenaEnvironment.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderArenaEnvironment(ctx, room, arena, time = 0)` | Função | 4 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderArenaTemple(ctx, room, arena)` | Função | 39 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ArenaGirlAnimationFrames.js

[Implementação](../src/js/toy-room/ArenaGirlAnimationFrames.js). Dados/classes exportados: `ARENA_GIRL_REFERENCE_HEIGHT`, `ARENA_GIRL_ANIMATION_FRAMES`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `original(pose, facing, anchors, faces)` | Função atribuída | 4 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `atlas(file, x, y, width, height, anchorX, pixelUnit, faceX = anchorX)` | Função atribuída | 9 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaHUD.js

[Implementação](../src/js/toy-room/ArenaHUD.js). Dados/classes exportados: `ARENA_ENEMY_NAMES`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaHUDLayout(layout)` | Função | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderArenaMobileControls(ctx, layout, room)` | Função | 14 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawAction(button, title, badge, special = false)` | Função atribuída | 31 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderArenaHUD(ctx, room, state, layout, boss = null)` | Função | 50 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `bar(b,hp,max,color,reverse)` | Função atribuída | 56 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaPlayerAnimation.js

[Implementação](../src/js/toy-room/ArenaPlayerAnimation.js). Dados/classes exportados: `ARENA_ATTACK_VISUAL_DURATION`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createPlayerAnimation(state = {}, player = {})` | Função | 6 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `beginArenaPlayerAttack(state, direction)` | Função | 15 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateArenaPlayerAnimation(state, player, dt)` | Função | 23 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `layer(pose,index=0,weight=1)` | Função atribuída | 45 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pair(from,to,weight)` | Função atribuída | 46 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cycle(pose,time,durations)` | Função | 48 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `poseLayers(pose,time,a,state)` | Função | 56 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sampleArenaPlayerAnimation(state, player)` | Função | 87 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaPlayerController.js

[Implementação](../src/js/toy-room/ArenaPlayerController.js). Dados/classes exportados: `ARENA_TUNING`, `ArenaPlayerController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `update(battle, dt)` | Método declarado | 8 | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/toy-room/ArenaPlayerRenderer.js

[Implementação](../src/js/toy-room/ArenaPlayerRenderer.js). Dados/classes exportados: `ArenaPlayerRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | 7 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | 8 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(ctx,room,state,ground)` | Método declarado | 19 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderSwordArc(ctx,sample)` | Método declarado | 52 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ArenaScale.js

[Implementação](../src/js/toy-room/ArenaScale.js). Dados/classes exportados: `ARENA_SCALE`, `ARENA_PLAYER_HEIGHT`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaActorBounds(x, ground, jump = 0, height = ARENA_PLAYER_HEIGHT, width = height * 1.3)` | Função | 4 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/BattleGirlFrames.js

[Implementação](../src/js/toy-room/BattleGirlFrames.js). Dados/classes exportados: `BATTLE_GIRL_SOURCE_SHA256`, `BATTLE_GIRL_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/BattlePlayerBounds.js

[Implementação](../src/js/toy-room/BattlePlayerBounds.js). Dados/classes exportados: `BATTLE_PLAYER_BOUNDS`, `BATTLE_ROCKET_GLOVE_BOUNDS`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/BattlePresentation.js

[Implementação](../src/js/toy-room/BattlePresentation.js). Dados/classes exportados: `BATTLE_PLAYER_HALF_WIDTH`, `BATTLE_LASER_HEIGHT`, `BATTLE_CROUCH_FRAME`, `BATTLE_JUMP_VISUAL_SCALE`, `BATTLE_TRAIN_BODY`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `rocketPunchProjection(frame, reference, elapsed, signedDistance, target=null)` | Função | 9 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rocketPunchTouchesPlayer(frame, reference, elapsed, signedDistance, target)` | Função | 51 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderRocketPunch(ctx, image, frame, reference, elapsed, signedDistance,target=null)` | Função | 81 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderBattleCrouch(ctx,image,player,attackTime,attackDirection)` | Função | 103 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `playerModel(state,player,attackDirection)` | Função | 114 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `battlePlayerJumpOffset(state,player,attackDirection)` | Função | 120 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `laserProjection(state,player,enemy,attackDirection)` | Função | 124 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `trainDrive(elapsed)` | Função | 142 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderTrainWalk(ctx,body,parts,elapsed,transportScale=1)` | Função | 146 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ImpactFX.js

[Implementação](../src/js/toy-room/ImpactFX.js). Dados/classes exportados: `ImpactFX`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | 4 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `emit(kind, x, y, heavy = false)` | Método declarado | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | 17 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render(ctx)` | Método declarado | 23 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | 32 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 33 | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/PlayerController.js

[Implementação](../src/js/toy-room/PlayerController.js). Dados/classes exportados: `PlayerController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | 1 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(battle, dt)` | Método declarado | 5 | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/toy-room/RoomEnvironmentRenderer.js

[Implementação](../src/js/toy-room/RoomEnvironmentRenderer.js). Dados/classes exportados: `RoomEnvironmentRenderer`, `roomEnvironmentRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderBackground(ctx, roomW, roomH, options = {})` | Método declarado | 29 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawWoodStrip(ctx, image, x, y, width, height, plain = false)` | Método declarado | 156 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawWoodTrim(ctx, image, roomW, roomH)` | Método declarado | 165 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderPerspectiveFloor(ctx, tile, roomW, roomH)` | Método declarado | 180 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawArchedWindow(ctx, wx, wy, windowImage = null)` | Método declarado | 216 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawEntrancePortal(ctx, dx, dy, environmentDoor = null)` | Método declarado | 277 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawCentralMandalaRug(ctx, cx, cy)` | Método declarado | 306 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFloralPlayMat(ctx, rx, ry, rugImage = null)` | Método declarado | 353 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBedsideFringeRug(ctx, bx, by, rugImage = null)` | Método declarado | 402 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `traceTrainCircuit(ctx)` | Método declarado | 432 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createWoodenTrackLayer(image)` | Método declarado | 436 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `drawTrainTracks(ctx, trackImage = null)` | Método declarado | 493 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFurniture(ctx, f, options = {})` | Método declarado | 538 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyCarryPresentation.js

[Implementação](../src/js/toy-room/ToyCarryPresentation.js). Dados/classes exportados: `CARRY_PROFILES`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToyCarry(ctx, player, options = {})` | Função | 17 | Compõe pose, brinquedo e contatos visuais usando CARRY_PROFILES; sem pose/item devolve false. |

## src/js/toy-room/ToyRenderer.js

[Implementação](../src/js/toy-room/ToyRenderer.js). Dados/classes exportados: `ToyRenderer`, `toyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToy(ctx, t, playerX = 0, playerY = 0, isCarrying = false, time = performance.now(), options = {})` | Método declarado | 19 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomArenaBuilder.js

[Implementação](../src/js/toy-room/ToyRoomArenaBuilder.js). Dados/classes exportados: `ToyRoomArenaBuilder`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `build({ furniture, ROOM_W = 1600 })` | Método declarado | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomArenaPhase.js

[Implementação](../src/js/toy-room/ToyRoomArenaPhase.js). Dados/classes exportados: `ARENA_TRANSFORMATION_DURATION`, `ToyRoomArenaPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(room)` | Método declarado | 20 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `start()` | Método declarado | 37 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `configurePresentation()` | Método declarado | 48 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderHUD(ctx, layout, state)` | API/lambda de objeto | 62 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `onImpact(x, y, heavy)` | API/lambda de objeto | 70 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderPlayer(ctx, state, ground)` | API/lambda de objeto | 75 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `restoreReality()` | Método declarado | 79 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `finish()` | Método declarado | 98 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `beginReturn()` | Método declarado | 107 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt = 1)` | Método declarado | 115 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | 144 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | 174 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved, roomSave = null)` | Método declarado | 175 | Reaplica a captura específica; confira referências e dados transitórios. |
| `attack()` | Método declarado | 204 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `special()` | Método declarado | 215 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomBattle.js

[Implementação](../src/js/toy-room/ToyRoomBattle.js). Dados/classes exportados: `BATTLE_ORDER`, `BATTLE_PLAYER_VISUAL_SCALE`, `BATTLE_TUNING`, `BATTLE_TRANSITION_DURATION`, `ToyRoomBattle`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n, a, b)` | Função atribuída | 17 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `battleAnimationFrame(animation, enemy, duration)` | Função | 20 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `transferHeart(victim, attacker)` | Função | 32 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor(room, { loadAssets = true } = {})` | Método declarado | 40 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | 52 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `activate()` | Método declarado | 72 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `spawn()` | Método declarado | 91 | Cria partículas/efeitos no buffer correspondente. |
| `arenaChest()` | Método declarado | 100 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginTransition(outgoing)` | Método declarado | 105 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `transitionPlacement(incoming)` | Método declarado | 116 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `input()` | Método declarado | 132 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attack()` | Método declarado | 148 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playCombatSound(sound)` | Método declarado | 165 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setEnemyState(state)` | Método declarado | 172 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `beginEnemyAttack(attack)` | Método declarado | 179 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startImpact(target, x, y, direction, heavy)` | Método declarado | 194 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | 203 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `step(dt)` | Método declarado | 221 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyPose(e = this.state.enemy)` | Método declarado | 347 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Método declarado | 352 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `hearts(hp, max)` | Função atribuída | 453 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderImpact(ctx, impact)` | Método declarado | 485 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | 508 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 509 | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ToyRoomEntities.js

[Implementação](../src/js/toy-room/ToyRoomEntities.js). Dados/classes exportados: `ToyRoomEntities`, `toyRoomEntities`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderPlayer(ctx, player, options = {})` | Método declarado | 12 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFairy(ctx, fairy, options = {})` | Método declarado | 24 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomOrientation.js

[Implementação](../src/js/toy-room/ToyRoomOrientation.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `nearestToyGuide(player, toys, previous)` | Função | 2 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomPhase.js

[Implementação](../src/js/toy-room/ToyRoomPhase.js). Dados/classes exportados: `ToyRoomPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, audio, uiFeedback, onReturnToTitle, options = {})` | Método declarado | 22 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setupListeners()` | Método declarado | 355 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getCanvasCoordinates(e)` | Método declarado | 374 | Converte evento de ponteiro para coordenadas internas da sala. |
| `isActionButtonHit(coords)` | Método declarado | 392 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `handleKeyDown(e)` | Método declarado | 396 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyUp(e)` | Método declarado | 408 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | 412 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onPointerDown(e)` | Método declarado | 450 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerMove(e)` | Método declarado | 518 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerUp(e)` | Método declarado | 550 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `clearInput()` | Método declarado | 575 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `refreshArenaTouchButtons()` | Método declarado | 586 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `spawnSparkles(x, y, count = 12, hue = '#facc15')` | Método declarado | 591 | Cria partículas/efeitos no buffer correspondente. |
| `spawnConfetti(x, y, count = 35)` | Método declarado | 608 | Cria partículas/efeitos no buffer correspondente. |
| `triggerAction()` | Método declarado | 629 | Processa interação da sala: pegar, soltar ou organizar brinquedo. |
| `resolveCollisions(px, py, r)` | Método declarado | 731 | Resolve colisões da sala com móveis. |
| `update(dt = 1.0)` | Método declarado | 768 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render(options = {})` | Método declarado | 992 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `startTutorial()` | Método declarado | 1179 | Inicia orientação guiada da Toy Room se ainda não concluída. |
| `snapshot({ includeArena = true } = {})` | Método declarado | 1181 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved, { preserveArena = false } = {})` | Método declarado | 1192 | Reaplica a captura específica; confira referências e dados transitórios. |
| `destroy()` | Método declarado | 1217 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `createToyRoom(canvas, audio, uiFeedback, onReturnToTitle, options)` | Função | 1238 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `update(dt)` | API/lambda de objeto | 1241 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | API/lambda de objeto | 1242 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `triggerAction()` | API/lambda de objeto | 1243 | Processa interação da sala: pegar, soltar ou organizar brinquedo. |
| `destroy()` | API/lambda de objeto | 1244 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/toy-room/ToyRoomStory.js

[Implementação](../src/js/toy-room/ToyRoomStory.js). Dados/classes exportados: `createToyRoomStoryState`, `ToyRoomStory`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomStoryState()` | Função atribuída | 34 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `distance(a, b)` | Função atribuída | 48 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isFree(room, point, radius = 24)` | Função | 51 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `reachableFloor(room)` | Função | 56 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getWorldViewport(room)` | Função | 87 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `outsideViewport(point, viewport, margin = 72)` | Função | 112 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getBeat(beats, elapsed)` | Função | 117 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `drawToySword(ctx, x, y, angle, scale = 1)` | Função | 126 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `constructor(room)` | Método declarado | 159 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `refreshReachablePoints()` | Método declarado | 174 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `recordViewport(frame)` | Método declarado | 181 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onToyStored(toy)` | Método declarado | 191 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | 208 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateReturns(dt)` | Método declarado | 245 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `beginInvestigation()` | Método declarado | 284 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateInvestigation(dt)` | Método declarado | 301 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateSwordGuide()` | Método declarado | 343 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateAfterMovement()` | Método declarado | 354 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `clearInput()` | Método declarado | 375 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `attack()` | Método declarado | 399 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `guidePosition()` | Método declarado | 407 | Retorna posição visual da fada acima do brinquedo-alvo do tutorial. |
| `cameraTarget()` | Método declarado | 414 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderWorldObject(ctx)` | Método declarado | 420 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderAttackSprite(ctx)` | Método declarado | 425 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderHeldObject(ctx)` | Método declarado | 444 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderNarrative(ctx, canvas)` | Método declarado | 478 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryBeat(ctx, canvas, beat)` | Método declarado | 500 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `restore(saved)` | Método declarado | 514 | Reaplica a captura específica; confira referências e dados transitórios. |
| `snapshot()` | Método declarado | 530 | Produz captura recuperável do estado específico deste componente. |

## src/js/toy-room/ToyRoomTutorial.js

[Implementação](../src/js/toy-room/ToyRoomTutorial.js). Dados/classes exportados: `TOY_ROOM_INPUT`, `ToyRoomTutorial`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(phase)` | Método declarado | 5 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `start()` | Método declarado | 13 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `setDevice(device)` | Método declarado | 19 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `nearest()` | Método declarado | 20 | Seleciona brinquedo elegível mais próximo do jogador para orientar coleta. |
| `finish()` | Método declarado | 25 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | 30 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `guidePosition()` | Método declarado | 44 | Retorna posição visual da fada acima do brinquedo-alvo do tutorial. |
| `render(ctx,canvas,frame)` | Método declarado | 64 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomUI.js

[Implementação](../src/js/toy-room/ToyRoomUI.js). Dados/classes exportados: `ToyRoomUI`, `toyRoomUI`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderUI(ctx, canvas, state)` | Método declarado | 20 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/index.js

[Implementação](../src/js/toy-room/index.js).

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toyRoom.js

[Implementação](../src/js/toyRoom.js).

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/ui/DialogueRenderer.js

[Implementação](../src/js/ui/DialogueRenderer.js). Dados/classes exportados: `DialogueRenderer`, `dialogueRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawPortrait(pCtx, charType, px, py, radius, mood = 'normal', tick = 0, options = {})` | Método declarado | 27 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapText(pCtx, text, maxWidth)` | Método declarado | 231 | Quebra texto conforme a largura medida pelo contexto. |
| `renderCutsceneDialogue(ctx, canvas, state = {}, options = {})` | Método declarado | 260 | Compõe falas, retratos, prompts e áreas seguras. |
| `renderDialogue(ctx, canvas, dialogue, options = {})` | Método declarado | 368 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialoguePortrait(pCtx, charType, px, py, radius, expression)` | Função atribuída | 374 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapDialogueText(pCtx, text, maxWidth)` | Função atribuída | 376 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/ui/DialogueSafeArea.js

[Implementação](../src/js/ui/DialogueSafeArea.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `intersectCanvasSafeArea(canvas, rect, viewport, insets = {})` | Função | 6 | Converte interseção viewport/canvas e insets em coordenadas do bitmap. |
| `getDialogueSafeArea(canvas)` | Função | 16 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDialogueBoxY(safe, height, originalMargin, anchor = {}, mobile = isMobileDevice())` | Função | 39 | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/ui/FirstJumpTutorial.js

[Implementação](../src/js/ui/FirstJumpTutorial.js). Dados/classes exportados: `FIRST_JUMP_MESSAGES`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getFirstJumpTutorialDevice({ device, nav = globalThis.navigator, coarse } = {})` | Função | 10 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getFirstJumpFeedback(timeMs, reducedMotion = false)` | Função | 21 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `drawInputIcon(ctx, kind, x, y, unit, pulse)` | Função | 26 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFirstJumpTutorial(ctx, canvas, { state, baby, fairy, platform, cameraX, transform, device, timeMs = globalThis.performance?.now?.() \|\| 0, reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches \|\| false })` | Função | 52 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `project(x, y)` | Função atribuída | 61 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/ui/HudRenderer.js

[Implementação](../src/js/ui/HudRenderer.js). Dados/classes exportados: `HudRenderer`, `hudRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderEscapeBanner(ctx, canvas, state = {}, cameraX = 0, baby = {})` | Método declarado | 21 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/ui/MobileDialogueRegion.js

[Implementação](../src/js/ui/MobileDialogueRegion.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getMobileDialogueRegions(safe, contentHeight)` | Função | 6 | Divide a área segura entre cena e painel de texto. |
| `renderMobileDialogueRegion(ctx, canvas, safe, contentHeight, anchor = {})` | Função | 22 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/ui/MobileUILayout.js

[Implementação](../src/js/ui/MobileUILayout.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | 4 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `calculateMobileUILayout(canvas, safe, scale = 1, mobile = true)` | Função | 7 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `contains(x, y)` | API/lambda de objeto | 22 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `joystickOrigin(x, y)` | API/lambda de objeto | 23 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getMobileUILayout(canvas)` | Função | 29 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isActionControlHit(layout, x, y)` | Função | 35 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `arenaMobileControlsLayout(layout)` | Função | 40 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `hitArenaMobileControl(layout, x, y)` | Função | 65 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attachMobileUILayout(canvas, host = window)` | Função | 79 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update()` | Função atribuída | 80 | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/ui/index.js

[Implementação](../src/js/ui/index.js).

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

Inventário: **81 módulos JavaScript**, **585 declarações nomeadas**.
