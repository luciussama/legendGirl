# Referência de métodos e funções

Inventário de `src/js`, gerado a partir da cópia local em 02/10/2026. Consulte o [manual](MANUAL-DESENVOLVIMENTO.md) para contratos, arquitetura e receitas.

As linhas referem-se ao snapshot local e mudam após edições. O inventário inclui declarações de funções, métodos escritos com sintaxe de método e funções atribuídas com parâmetros entre parênteses. Não é um parser completo de JavaScript: callbacks anônimos, aliases/reexportações e algumas lambdas de parâmetro simples não são contratos separados aqui. APIs retornadas por fábricas estão descritas no manual. A presença de uma função interna não a torna pública. Descrições por família são orientação de leitura; as tabelas do manual detalham os contratos centrais.

Regenerar na raiz: `node scripts/generate-method-reference.js`. Revise também as descrições e o manual após mudar contratos.

## src/js/assets/AssetManager.js

[Implementação](../src/js/assets/AssetManager.js). Dados/classes exportados: `AssetManager`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 4 | function Object() { [native code] } |
| `loadManifest(url = this.manifestUrl)` | Método declarado | 13 | Busca manifesto e atualiza status; rejeita falha. |
| `preload()` | Método declarado | 36 | Pré-carrega entradas de imagens do manifesto. |
| `loadImage(key, source)` | Método declarado | 42 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `removeSolidBackground(image, background = 'light')` | Método declarado | 82 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getRegion(key, region)` | Método declarado | 118 | Valida limites e cacheia recorte do atlas. |
| `normalizeCharacterPalette(image)` | Método declarado | 151 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `get(key)` | Método declarado | 173 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `has(key)` | Método declarado | 177 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getStatus(key)` | Método declarado | 181 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isReady(key)` | Método declarado | 185 | Consulta uma chave ou prontidão do manifesto; sem chave não certifica todas as imagens. |
| `clearRegionCache()` | Método declarado | 192 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `createAssetManager(options)` | Função | 197 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

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
| `registerActiveNode(node)` | Função | 69 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cleanup()` | Função atribuída | 72 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearActiveSounds()` | Função | 80 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMusicTrack()` | Função | 91 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `initAudio()` | Função | 123 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startMusic()` | Função | 146 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopMusic()` | Função | 165 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stopAllAudio()` | Função | 175 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playJumpSound()` | Função | 181 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLongJumpSound(progress = 0)` | Função | 204 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLevelUpChime(level = 0)` | Função | 241 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOpeningAmbience()` | Função | 265 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyVoiceBlip(freq = 920)` | Função | 283 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyLaugh()` | Função | 306 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playEscapePowerUp()` | Função | 334 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFallFailSound()` | Função | 361 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playTapeRipSound()` | Função | 384 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDramaticTumbleSound()` | Função | 419 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyThudSound()` | Função | 443 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyShockVoice()` | Função | 466 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyFrustratedSound()` | Função | 491 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPhase3StartFanfare()` | Função | 515 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `getToyRoomAudioElement()` | Função | 544 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `startToyRoomMusic()` | Função | 582 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopToyRoomMusic()` | Função | 603 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | Função | 614 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | Função | 629 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playPickUpSound()` | Função | 644 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDropSound()` | Função | 669 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOrganizeChime()` | Função | 692 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playToyRoomVictory()` | Função | 718 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `getAudioContext()` | API/lambda de objeto | 786 | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/cinematics/OpeningSequence.js

[Implementação](../src/js/cinematics/OpeningSequence.js). Dados/classes exportados: `OPENING_STORAGE_KEY`, `OPENING_DIALOGUE`, `OpeningSequence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({storage, onReveal = () => {}, onComplete = () => {}, onCue = () => {}} = {})` | Método declarado | 18 | function Object() { [native code] } |
| `hasCompleted()` | Método declarado | 28 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `start()` | Método declarado | 33 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `cancel()` | Método declarado | 40 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reset()` | Método declarado | 41 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | 45 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 48 | Reaplica a captura específica; confira referências e dados transitórios. |
| `update(dt)` | Método declarado | 57 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `renderFade(ctx, canvas)` | Método declarado | 73 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `render(ctx, canvas, {assets, drawRoom, lighting, fairyRenderer})` | Método declarado | 80 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

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
| `constructor(options = {})` | Método declarado | 10 | function Object() { [native code] } |
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
| `startToyRoomMusic()` | Método declarado | 231 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopToyRoomMusic()` | Método declarado | 237 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | Método declarado | 243 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | Método declarado | 249 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getToyRoomAudioElement()` | Método declarado | 255 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `playPickUpSound()` | Método declarado | 262 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDropSound()` | Método declarado | 268 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOrganizeChime(streak)` | Método declarado | 274 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playToyRoomVictory()` | Método declarado | 280 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `destroy()` | Método declarado | 286 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `createAudioController(options = {})` | Função | 298 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/CameraController.js

[Implementação](../src/js/controllers/CameraController.js). Dados/classes exportados: `CameraController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 8 | function Object() { [native code] } |
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
| `constructor()` | Método declarado | 3 | function Object() { [native code] } |
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
| `constructor(game, options = {})` | Método declarado | 8 | function Object() { [native code] } |
| `init()` | Método declarado | 26 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `triggerJump()` | Método declarado | 36 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handlePointerDown(event)` | Método declarado | 61 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyDown(event)` | Método declarado | 99 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | 136 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gamepadLoop()` | Método declarado | 174 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGamepadPollingLoop()` | Método declarado | 180 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleGamepadDisconnected(event)` | Método declarado | 186 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `destroy()` | Método declarado | 192 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `bindInput(game)` | Função | 210 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pollGamepad()` | API/lambda de objeto | 214 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | API/lambda de objeto | 215 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/controllers/MobileZoom.js

[Implementação](../src/js/controllers/MobileZoom.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `isMobileDevice(nav = globalThis.navigator)` | Função | 2 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getMobileZoomFrame({ enabled, width, height, bounds, anchor, margin = 24, stable = false, anticipate = false })` | Função | 8 | Retorna escala e translações de apresentação a partir dos limites/alvo. |
| `clamp(value, min, max)` | Função atribuída | 25 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/debug/AtlasDebugger.js

[Implementação](../src/js/debug/AtlasDebugger.js). Dados/classes exportados: `AtlasDebugger`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 10 | function Object() { [native code] } |
| `setAssets(assets)` | Método declarado | 21 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `validateAllRegions()` | Método declarado | 28 | Confere recortes do atlas contra imagens carregadas. |
| `initDOM()` | Método declarado | 83 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toggle(forceState = null)` | Método declarado | 176 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Método declarado | 187 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `createAtlasDebugger(options)` | Função | 298 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/effects/ArtFinish.js

[Implementação](../src/js/effects/ArtFinish.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `applyArtFinish(ctx, canvas)` | Função | 2 | Aplica dessaturação em coordenadas de tela. |

## src/js/effects/ParticleSystem.js

[Implementação](../src/js/effects/ParticleSystem.js). Dados/classes exportados: `ParticleSystem`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 10 | function Object() { [native code] } |
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
| `constructor()` | Método declarado | 5 | function Object() { [native code] } |
| `setAssets(assets)` | Método declarado | 6 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `resolveAnimationState(baby, state)` | Método declarado | 7 | Escolhe animação oficial conforme ação e flags do estado. |
| `renderPose(ctx, assets, pose, frameIndex, centerX, feetY, height, facing = 1, visualScale = 1)` | Método declarado | 73 | Desenha recorte ancorado no centro/pés, com escala visual. |
| `render(ctx, baby, state = {}, camX = 0, options = {})` | Método declarado | 91 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

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
| `getBackgroundViewport(ctx, canvas)` | Função | 12 | Inverte a matriz real para determinar os limites visíveis do fundo. |
| `constructor(options = {})` | Método declarado | 29 | function Object() { [native code] } |
| `setAssets(assets)` | Método declarado | 34 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `drawAtlasSceneryItem(ctx, assets, type, sx, item, floorY)` | Método declarado | 42 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderWall(ctx, canvas, camX = 0, options = {})` | Método declarado | 164 | Desenha parede, parallax, piso e rodapé com cobertura do viewport. |
| `renderScenery(ctx, canvas, scenery = defaultRoomScenery, camX = 0, options = {})` | Método declarado | 529 | Desenha objetos decorativos do piso. |
| `render(ctx, canvas, camX = 0, options = {})` | Método declarado | 1055 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/environment/LightingSystem.js

[Implementação](../src/js/environment/LightingSystem.js). Dados/classes exportados: `LightingSystem`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 16 | function Object() { [native code] } |
| `resize(width, height)` | Método declarado | 21 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(ctx, canvas, state = {}, baby = {}, fairy = {}, camX = 0, camY = 0, options = {})` | Método declarado | 27 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pool(x, y, rx, ry, strength)` | Função atribuída | 58 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createLightingSystem(options = {})` | Função | 176 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/environment/PlatformRenderer.js

[Implementação](../src/js/environment/PlatformRenderer.js). Dados/classes exportados: `PLATFORM_SURFACES`, `PlatformRenderer`, `platformRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 47 | function Object() { [native code] } |
| `setAssets(assets)` | Método declarado | 52 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `drawAtlasPlatformSprite(ctx, assets, style, sx, p, tick = 0)` | Método declarado | 60 | Recorta/calibra sprite de plataforma; não redefine colisões. |
| `renderPlatforms(ctx, canvas, camX = 0, options = {})` | Método declarado | 742 | Desenha apoios com atlas/alternativas e descarte visual. |
| `drawWoodBlock(bx, by, bw, bh, woodType = 0)` | Função atribuída | 1246 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawToyWindow(wx, wy, ww, wh)` | Função atribuída | 1375 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderExitDoor(ctx, canvas, camX = 0, options = {})` | Método declarado | 2543 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderTrueExitDoor(ctx, canvas, camX = 0, options = {})` | Método declarado | 2601 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderTutorialArrow(ctx, canvas, camX = 0, options = {})` | Método declarado | 2715 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

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
| `createGame(canvas, uiFeedback, callbacks = {})` | Função | 22 | Cria o coordenador e devolve a API de integração com a página. |
| `onComplete()` | API/lambda de objeto | 89 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginOpeningGameplay()` | Função | 97 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncStateToLocals()` | Função | 115 | Atualiza locais a partir de GameState após operações delegadas. |
| `syncLocalsToState()` | Função | 169 | Copia variáveis locais para GameState antes de delegações/captura. |
| `setLastInputDevice(dev)` | Função | 223 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getActivePromptDevice()` | Função | 228 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `startStandbyPreparation()` | Função | 232 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `confirmStandby()` | Função | 238 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetBabyPhysicsBody(targetX, targetY, facing = 1)` | Função | 245 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `triggerGameOver()` | Função | 251 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retryGame()` | Função | 257 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restartToTitle()` | Função | 265 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startToyRoomPhase()` | Função | 275 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleResize()` | Função | 305 | Dimensiona bitmap e canvases auxiliares a partir do layout CSS. |
| `startTruePortalTransition()` | Função | 368 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `showFailMessage()` | Função | 374 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startCastleCutscene()` | Função | 378 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advanceCutscene()` | Função | 384 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishCutscene()` | Função | 390 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startPlotTwistCutscene()` | Função | 397 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advancePlotTwist()` | Função | 403 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishPlotTwistAndStartTutorial()` | Função | 409 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetToStart(failedMidClimb = false, shouldPlayFailSound = true)` | Função | 415 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `doJump()` | Função | 422 | Seleciona salto ou avanço narrativo conforme o estado atual. |
| `spawnFairyFlightDust(fx, fy, fvx, fvy)` | Função | 557 | Cria partículas/efeitos no buffer correspondente. |
| `spawnFairySparkles(x, y, count = 2)` | Função | 561 | Cria partículas/efeitos no buffer correspondente. |
| `updateFairyParticles()` | Função | 565 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `spawnBabyJumpDust(bx, bw, by, bh, bvx)` | Função | 570 | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyJumpPuff(x, y, count = 5)` | Função | 574 | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyLandingPuff(x, y)` | Função | 578 | Cria partículas/efeitos no buffer correspondente. |
| `updateBabyJumpDust(dt = 1.0)` | Função | 582 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `drawBackgroundWall(camX)` | Função | 588 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawSceneryItems(camX)` | Função | 592 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawPlatforms(camX)` | Função | 596 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawExitDoor(camX)` | Função | 607 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawTrueExitDoor(camX)` | Função | 618 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBabyManaStyle(camX)` | Função | 628 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFairy(camX)` | Função | 634 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `applyDarkAtmosphereWithLights(camX, camY = 0)` | Função | 640 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawSpeedRibbons(camX)` | Função | 651 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBabyJumpDust(camX)` | Função | 655 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawEscapeBanner()` | Função | 660 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialoguePortrait(pCtx, charType, px, py, radius, mood = 'normal')` | Função | 664 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapDialogueText(pCtx, text, maxWidth)` | Função | 668 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawCutsceneDialogue(transform)` | Função | 672 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawTutorialArrow(camX)` | Função | 684 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `update(dt = 1.0)` | Função | 694 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `onLagBehind()` | API/lambda de objeto | 1459 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Função | 1468 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawRoom()` | API/lambda de objeto | 1473 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `togglePause()` | Função | 1579 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Função | 1595 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `saveProgress()` | Função | 1601 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restoreProgress(saved)` | Função | 1613 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `newCampaign()` | Função | 1638 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `saveOnHide()` | Função atribuída | 1654 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `recordCameraQa(transform = null)` | Função | 1660 | Emite observação optativa de câmera; ativada por cameraQa e callback de teste. |
| `loop(currentTime = performance.now())` | Função | 1675 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isGrounded()` | API/lambda de objeto | 1715 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isCutsceneActive()` | API/lambda de objeto | 1716 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGameOver()` | API/lambda de objeto | 1717 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isToyRoomMode()` | API/lambda de objeto | 1718 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | API/lambda de objeto | 1720 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | API/lambda de objeto | 1743 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | API/lambda de objeto | 1744 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setMasterVolume(v)` | API/lambda de objeto | 1745 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | API/lambda de objeto | 1746 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(m)` | API/lambda de objeto | 1747 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `isMuted()` | API/lambda de objeto | 1748 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | API/lambda de objeto | 1749 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isPaused()` | API/lambda de objeto | 1750 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `hasProgress()` | API/lambda de objeto | 1753 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `destroy()` | Método declarado | 1756 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `start()` | Método declarado | 1764 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `isGrounded()` | API/lambda de objeto | 1785 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isCutsceneActive()` | API/lambda de objeto | 1786 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGameOver()` | API/lambda de objeto | 1791 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isToyRoomMode()` | API/lambda de objeto | 1793 | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/input.js

[Implementação](../src/js/input.js).

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/main.js

[Implementação](../src/js/main.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `refreshCampaignMenu()` | Função | 28 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `openDownloadModal()` | Função | 64 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `closeDownloadModal()` | Função | 82 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `copyToClipboard(text, feedbackEl, successMsg = '✅ Copiado!')` | Função | 87 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fallbackCopy(text, feedbackEl, successMsg)` | Função | 103 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `showDownloadToast(message, isError = false)` | Função | 123 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `performStreamDownloadInModal()` | Função | 169 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updatePauseButtonState()` | Função | 331 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `toggleGamePause()` | Função | 348 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateSoundButtonState()` | Função | 363 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `onGameOver()` | API/lambda de objeto | 411 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onRestartToTitle()` | API/lambda de objeto | 423 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGame(event)` | Função | 444 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleRetry(event)` | Função | 473 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleRestart(event)` | Função | 505 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `addSafeAction(element, handler)` | Função | 538 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `safeHandler(event)` | Função atribuída | 541 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handleToyRoomSwitch(event)` | Função | 558 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollOverlayGamepad()` | Função | 663 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/state/CampaignProgress.js

[Implementação](../src/js/state/CampaignProgress.js). Dados/classes exportados: `CAMPAIGN_STORAGE_KEY`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `captureState(state)` | Função | 9 | Seleciona estado serializável da campanha. |
| `restoreState(state, saved)` | Função | 12 | Restaura valores preservando referências de objetos/arrays existentes. |
| `createCampaignProgress(storage)` | Função | 21 | Cria leitura, gravação e limpeza do progresso local com alternativa em memória. |
| `read()` | Método declarado | 26 | Lê e valida save da campanha; pode usar memória da sessão. |
| `write(data)` | Método declarado | 45 | Serializa save versionado e tenta gravar no storage. |
| `clear()` | Método declarado | 50 | Configura/reinicializa valores do componente; revise o escopo da mutação. |

## src/js/state/GameState.js

[Implementação](../src/js/state/GameState.js). Dados/classes exportados: `GameState`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, uiFeedback, callbacks = {})` | Método declarado | 12 | function Object() { [native code] } |
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

## src/js/toy-room/RoomEnvironmentRenderer.js

[Implementação](../src/js/toy-room/RoomEnvironmentRenderer.js). Dados/classes exportados: `RoomEnvironmentRenderer`, `roomEnvironmentRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderBackground(ctx, roomW, roomH, options = {})` | Método declarado | 20 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderPerspectiveFloor(ctx, tile, roomW, roomH)` | Método declarado | 126 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawArchedWindow(ctx, wx, wy)` | Método declarado | 162 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawEntrancePortal(ctx, dx, dy, environmentDoor = null)` | Método declarado | 218 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawCentralMandalaRug(ctx, cx, cy)` | Método declarado | 247 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFloralPlayMat(ctx, rx, ry)` | Método declarado | 294 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBedsideFringeRug(ctx, bx, by)` | Método declarado | 336 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawTrainTracks(ctx)` | Método declarado | 359 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFurniture(ctx, f, options = {})` | Método declarado | 401 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRenderer.js

[Implementação](../src/js/toy-room/ToyRenderer.js). Dados/classes exportados: `ToyRenderer`, `toyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToy(ctx, t, playerX = 0, playerY = 0, isCarrying = false, time = performance.now(), options = {})` | Método declarado | 19 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomEntities.js

[Implementação](../src/js/toy-room/ToyRoomEntities.js). Dados/classes exportados: `ToyRoomEntities`, `toyRoomEntities`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderPlayer(ctx, player, options = {})` | Método declarado | 11 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFairy(ctx, fairy, options = {})` | Método declarado | 19 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomPhase.js

[Implementação](../src/js/toy-room/ToyRoomPhase.js). Dados/classes exportados: `ToyRoomPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, audio, uiFeedback, onReturnToTitle, options = {})` | Método declarado | 15 | function Object() { [native code] } |
| `setupListeners()` | Método declarado | 336 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getCanvasCoordinates(e)` | Método declarado | 353 | Converte evento de ponteiro para coordenadas internas da sala. |
| `isActionButtonHit(coords)` | Método declarado | 371 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `handleKeyDown(e)` | Método declarado | 381 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyUp(e)` | Método declarado | 391 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerDown(e)` | Método declarado | 395 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerMove(e)` | Método declarado | 434 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerUp(e)` | Método declarado | 464 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `spawnSparkles(x, y, count = 12, hue = '#facc15')` | Método declarado | 484 | Cria partículas/efeitos no buffer correspondente. |
| `spawnConfetti(x, y, count = 35)` | Método declarado | 501 | Cria partículas/efeitos no buffer correspondente. |
| `triggerAction()` | Método declarado | 522 | Processa interação da sala: pegar, soltar ou organizar brinquedo. |
| `resolveCollisions(px, py, r)` | Método declarado | 616 | Resolve colisões da sala com móveis. |
| `update(dt = 1.0)` | Método declarado | 653 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | 844 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | 1000 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 1008 | Reaplica a captura específica; confira referências e dados transitórios. |
| `destroy()` | Método declarado | 1016 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `createToyRoom(canvas, audio, uiFeedback, onReturnToTitle, options)` | Função | 1033 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `update(dt)` | API/lambda de objeto | 1036 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | API/lambda de objeto | 1037 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `triggerAction()` | API/lambda de objeto | 1038 | Processa interação da sala: pegar, soltar ou organizar brinquedo. |
| `destroy()` | API/lambda de objeto | 1039 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/toy-room/ToyRoomUI.js

[Implementação](../src/js/toy-room/ToyRoomUI.js). Dados/classes exportados: `ToyRoomUI`, `toyRoomUI`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderUI(ctx, canvas, state)` | Método declarado | 17 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

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
| `drawPortrait(pCtx, charType, px, py, radius, mood = 'normal', tick = 0)` | Método declarado | 26 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapText(pCtx, text, maxWidth)` | Método declarado | 214 | Quebra texto conforme a largura medida pelo contexto. |
| `renderCutsceneDialogue(ctx, canvas, state = {}, options = {})` | Método declarado | 243 | Compõe falas, retratos, prompts e áreas seguras. |
| `drawDialoguePortrait(pCtx, charType, px, py, radius, mood)` | Função atribuída | 257 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapDialogueText(pCtx, text, maxWidth)` | Função atribuída | 258 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/ui/DialogueSafeArea.js

[Implementação](../src/js/ui/DialogueSafeArea.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `intersectCanvasSafeArea(canvas, rect, viewport, insets = {})` | Função | 6 | Converte interseção viewport/canvas e insets em coordenadas do bitmap. |
| `getDialogueSafeArea(canvas)` | Função | 16 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDialogueBoxY(safe, height, originalMargin, anchor = {}, mobile = isMobileDevice())` | Função | 39 | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/ui/HudRenderer.js

[Implementação](../src/js/ui/HudRenderer.js). Dados/classes exportados: `HudRenderer`, `hudRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderEscapeBanner(ctx, canvas, state = {}, cameraX = 0, baby = {})` | Método declarado | 19 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/ui/MobileDialogueRegion.js

[Implementação](../src/js/ui/MobileDialogueRegion.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getMobileDialogueRegions(safe, contentHeight)` | Função | 6 | Divide a área segura entre cena e painel de texto. |
| `renderMobileDialogueRegion(ctx, canvas, safe, contentHeight, anchor = {})` | Função | 22 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/ui/index.js

[Implementação](../src/js/ui/index.js).

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

Inventário: **46 módulos JavaScript**, **383 declarações nomeadas**.
