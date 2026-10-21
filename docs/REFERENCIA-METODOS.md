# Referência de métodos e funções

Inventário de `src/js`, gerado a partir da cópia local. Consulte [arquitetura e entidades](ARQUITETURA.md), o [manual](MANUAL-DESENVOLVIMENTO.md) e os [comandos](COMANDOS.md).

As linhas referem-se ao snapshot local e mudam após edições. O inventário inclui funções, métodos, acessores e funções atribuídas com parâmetros entre parênteses, além dos contratos exportados/reexports. Não é um parser completo: callbacks anônimos e algumas lambdas de parâmetro simples não são declarações separadas aqui; funções exportadas continuam enumeradas no módulo. APIs de fábricas e proprietários de estado estão documentados na arquitetura e no manual. A presença de uma função interna não a torna pública.

Regenerar na raiz: `node scripts/generate-method-reference.js`. Revise também as descrições e o manual após mudar contratos.

## src/js/assets/AssetManager.js

[Implementação](../src/js/assets/AssetManager.js). Contratos exportados/reexportados: `AssetManager`, `createAssetManager`.

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

[Implementação](../src/js/assets/currentScenery.js). Contratos exportados/reexportados: `CURRENT_SCENERY`, `drawCurrentScenery`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawCurrentScenery(ctx,assets,type,x,floorY)` | Função | 22 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/assets/darkRoomAtlas.js

[Implementação](../src/js/assets/darkRoomAtlas.js). Contratos exportados/reexportados: `SHEET_WIDTH`, `SHEET_HEIGHT`, `SPRITESHEET_PATH`, `darkRoomAtlas`, `validateAtlasRegion`, `getDarkRoomAtlasRegion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `validateAtlasRegion(region, sheetW = SHEET_WIDTH, sheetH = SHEET_HEIGHT)` | Função | 280 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getDarkRoomAtlasRegion(key)` | Função | 289 | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/assets/index.js

[Implementação](../src/js/assets/index.js). Contratos exportados/reexportados: `AssetManager`, `createAssetManager`, `darkRoomAtlas`, `validateAtlasRegion`, `getDarkRoomAtlasRegion`, `SHEET_WIDTH`, `SHEET_HEIGHT`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/assets/officialCharacter.js

[Implementação](../src/js/assets/officialCharacter.js). Contratos exportados/reexportados: `OFFICIAL_SOURCE_SHA256`, `OFFICIAL_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/audio.js

[Implementação](../src/js/audio.js). Contratos exportados/reexportados: `createAudioSystem`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createAudioSystem()` | Função | 5 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `getDestination()` | Função | 15 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `updateMusicVolumes()` | Função | 29 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `setMasterVolume(vol)` | Função | 39 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | Função | 48 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(muted)` | Função | 52 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `toggleMute()` | Função | 61 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getIsMuted()` | Função | 65 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `registerActiveNode(node)` | Função | 75 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cleanup()` | Função atribuída | 78 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearActiveSounds()` | Função | 86 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMusicTrack()` | Função | 97 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `initAudio()` | Função | 129 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startMusic()` | Função | 152 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopMusic()` | Função | 171 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stopAllAudio()` | Função | 181 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playJumpSound()` | Função | 187 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLongJumpSound(progress = 0)` | Função | 210 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLevelUpChime(level = 0)` | Função | 247 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOpeningAmbience()` | Função | 271 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyVoiceBlip(freq = 920)` | Função | 289 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyLaugh()` | Função | 312 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playEscapePowerUp()` | Função | 340 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFallFailSound()` | Função | 367 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playTapeRipSound()` | Função | 390 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDramaticTumbleSound()` | Função | 425 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyThudSound()` | Função | 449 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyShockVoice()` | Função | 472 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyFrustratedSound()` | Função | 497 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPhase3StartFanfare()` | Função | 521 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `getToyRoomTrackUrls(track)` | Função | 552 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getToyRoomAudioElement()` | Função | 562 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setToyRoomMusicTrack(track)` | Função | 597 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `startToyRoomMusic({ fade = 1 } = {})` | Função | 616 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `setToyRoomMusicFade(value)` | Função | 640 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setToyRoomMusicIntensity(value)` | Função | 645 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPortalExitWhoosh()` | Função | 650 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playSoftMagicBurst()` | Função | 667 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopToyRoomMusic()` | Função | 682 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | Função | 693 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | Função | 708 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playPickUpSound()` | Função | 723 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDropSound()` | Função | 748 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOrganizeChime()` | Função | 771 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playToyRoomVictory()` | Função | 797 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playCombatSound(event, arena = false)` | Função | 830 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playArenaMusicBeat(beat)` | Função | 904 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopArenaMusic()` | Função | 922 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getAudioContext()` | API/lambda de objeto | 971 | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/bear-chase/BearChasePhase.js

[Implementação](../src/js/bear-chase/BearChasePhase.js). Contratos exportados/reexportados: `BearChasePhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ canvas, audio, enabled, difficulty = 'NORMAL', campaign = false, onCampaignError = null })` | Método declarado | 11 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `active()` | Acessor | 23 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `start(saved = null)` | Método declarado | 25 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | 48 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | 66 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `setPaused(value)` | Método declarado | 88 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | 92 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 94 | Reaplica a captura específica; confira referências e dados transitórios. |
| `destroy()` | Método declarado | 102 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseAudio.js

[Implementação](../src/js/bear-chase/ChaseAudio.js). Contratos exportados/reexportados: `ChaseAudio`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(audio)` | Método declarado | 8 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `unlock()` | Método declarado | 17 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `step(actor, gap)` | Método declarado | 30 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(state)` | Método declarado | 45 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `stopSteps()` | Método declarado | 67 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Método declarado | 72 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | 74 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 76 | Reaplica a captura específica; confira referências e dados transitórios. |
| `seek()` | Função atribuída | 78 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | 82 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseBearAnimation.js

[Implementação](../src/js/bear-chase/ChaseBearAnimation.js). Contratos exportados/reexportados: `ChaseBearAnimation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(model)` | Método declarado | 6 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `legPose(leg, z, footY, hipHeight)` | Método declarado | 9 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state)` | Método declarado | 18 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseBearModel.js

[Implementação](../src/js/bear-chase/ChaseBearModel.js). Contratos exportados/reexportados: `ChaseBearModel`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(own, texture)` | Método declarado | 7 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `joint(parent, name, x, y, z)` | Método declarado | 70 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `volume(parent, region, position, scale, tint = '#ffffff', rotation = [0,0,0])` | Método declarado | 75 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `seam(parent, points, radius)` | Método declarado | 84 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ribbon(parent, side)` | Método declarado | 90 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `collect(parent, source, region, tint)` | Método declarado | 104 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `bake()` | Método declarado | 119 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state)` | Método declarado | 136 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseCamera.js

[Implementação](../src/js/bear-chase/ChaseCamera.js). Contratos exportados/reexportados: `chaseCameraFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `chaseCameraFrame(state, portrait, aspect)` | Função | 10 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseConfig.js

[Implementação](../src/js/bear-chase/ChaseConfig.js). Contratos exportados/reexportados: `CHASE_CONFIG`, `clamp`, `damp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, low, high)` | Função | 12 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `damp(from, to, speed, dt)` | Função | 15 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseGirlAnimation.js

[Implementação](../src/js/bear-chase/ChaseGirlAnimation.js). Contratos exportados/reexportados: `ChaseGirlAnimation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(model)` | Método declarado | 6 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `legPose(leg,z,y,hipHeight)` | Método declarado | 8 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state)` | Método declarado | 16 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fall(state)` | Método declarado | 64 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseGirlModel.js

[Implementação](../src/js/bear-chase/ChaseGirlModel.js). Contratos exportados/reexportados: `ChaseGirlModel`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(own)` | Método declarado | 7 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `shade(geometry)` | Método declarado | 53 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `joint(parent,name,x,y,z)` | Método declarado | 62 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `volume(parent,material,position,scale)` | Método declarado | 66 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `limb(parent,material,length,end,start)` | Método declarado | 70 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildSleeve(parent)` | Método declarado | 75 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cloth(parent,material,profile,full)` | Método declarado | 90 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `silhouette(parent,material,points,depth,position)` | Método declarado | 111 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sweep(parent,material,points,radii)` | Método declarado | 118 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildHair()` | Método declarado | 135 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildFace()` | Método declarado | 160 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildSword()` | Método declarado | 171 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseGirlPalette.js

[Implementação](../src/js/bear-chase/ChaseGirlPalette.js). Contratos exportados/reexportados: `GIRL_PALETTE`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/bear-chase/ChaseHUD.js

[Implementação](../src/js/bear-chase/ChaseHUD.js). Contratos exportados/reexportados: `renderChaseHUD`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderLives(ctx, w, ui, state, difficulty)` | Função | 9 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderChaseHUD(ctx, canvas, state, error, audioError, difficulty = 'NORMAL')` | Função | 24 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/bear-chase/ChaseHealth.js

[Implementação](../src/js/bear-chase/ChaseHealth.js). Contratos exportados/reexportados: `CHASE_FALL_DURATION`, `chaseMaxLives`, `chaseLives`, `isChaseDefeat`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `chaseMaxLives(difficulty = 'NORMAL')` | Função | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chaseLives(state, difficulty = 'NORMAL')` | Função | 8 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isChaseDefeat(stage)` | Função | 13 | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/bear-chase/ChaseInput.js

[Implementação](../src/js/bear-chase/ChaseInput.js). Contratos exportados/reexportados: `ChaseInput`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, enabled, unlock)` | Método declarado | 6 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `install()` | Método declarado | 14 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onKeyDown(event)` | Método declarado | 26 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onKeyUp(event)` | Método declarado | 33 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onPointer(event)` | Método declarado | 35 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onRelease(event)` | Método declarado | 45 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sample()` | Método declarado | 47 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clear()` | Método declarado | 63 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `destroy()` | Método declarado | 70 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseIntroRenderer.js

[Implementação](../src/js/bear-chase/ChaseIntroRenderer.js). Contratos exportados/reexportados: `isChaseIntro`, `chaseIntroFade`, `ChaseIntroRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `isChaseIntro(stage)` | Função | 17 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `chaseIntroFade(state)` | Função | 22 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor()` | Método declarado | 31 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | 36 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `measureFrames(image, columns = [0, 490 / 1774, 920 / 1774, 1340 / 1774, 1], rows = [0, 505 / 887, 1])` | Método declarado | 49 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `picture(ctx, key, x, bottom, height)` | Método declarado | 82 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `backdrop(ctx, w, h)` | Método declarado | 88 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `floor(ctx, w, h, horizon, unit)` | Método declarado | 104 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actor(ctx, index, x, baseline, height, first, reaching = false)` | Método declarado | 121 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pose(canvas, state)` | Método declarado | 131 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(ctx, canvas, state)` | Método declarado | 151 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | 172 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseLighting.js

[Implementação](../src/js/bear-chase/ChaseLighting.js). Contratos exportados/reexportados: `ChaseLighting`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(owner)` | Método declarado | 27 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `windowMask()` | Método declarado | 98 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resize(portrait)` | Método declarado | 125 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `place(light, s, x, height, targetS, targetX, targetHeight = 0)` | Método declarado | 152 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(state, portrait)` | Método declarado | 176 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `prepareObject(root)` | Método declarado | 225 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dispose()` | Método declarado | 238 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChasePacing.js

[Implementação](../src/js/bear-chase/ChasePacing.js). Contratos exportados/reexportados: `smoothProgress`, `chaseIntensity`, `chasePacing`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smoothProgress(value)` | Função | 4 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chaseIntensity(distance)` | Função | 10 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chasePacing(distance, difficulty = 'NORMAL')` | Função | 19 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChasePatterns.js

[Implementação](../src/js/bear-chase/ChasePatterns.js). Contratos exportados/reexportados: `chasePattern`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `chasePattern(progress, difficulty, safeLane)` | Função | 4 | Distribui brinquedos por progresso e dificuldade; no NORMAL usa até três objetos e pares finais com corredor amplo. |

## src/js/bear-chase/ChaseRenderer3D.js

[Implementação](../src/js/bear-chase/ChaseRenderer3D.js). Contratos exportados/reexportados: `ChaseRenderer3D`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `imageFile(path)` | Função | 19 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor()` | Método declarado | 30 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `own(resource)` | Método declarado | 45 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `texture(image, crop = null)` | Método declarado | 47 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `material(texture, color = '#ffffff')` | Método declarado | 58 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mesh(parent, geometry, material, x, y, z)` | Método declarado | 63 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actor(texture, width, height)` | Método declarado | 67 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `load()` | Método declarado | 72 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareRoomResources()` | Método declarado | 121 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `placeOnRoute(object, distance, lateral, height=0, alignSlope=false)` | Método declarado | 125 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateToys(state)` | Método declarado | 131 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render(ctx, canvas, state)` | Método declarado | 158 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `presentCamera(state, portrait)` | Método declarado | 196 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | 209 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseRoom.js

[Implementação](../src/js/bear-chase/ChaseRoom.js). Contratos exportados/reexportados: `ChaseRoom`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(owner)` | Método declarado | 7 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `surface(material,l0,h0,l1,h1,name)` | Método declarado | 35 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `add(object,s,lateral,yaw,height=0,rug=false)` | Método declarado | 45 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(distance)` | Método declarado | 55 | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/bear-chase/ChaseRoute.js

[Implementação](../src/js/bear-chase/ChaseRoute.js). Contratos exportados/reexportados: `ROUTE_NODES`, `routeFrame`, `routePoint`, `ROUTE_AMBUSHES`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `coordinate(s, axis)` | Função | 8 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `routeFrame(s)` | Função | 17 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `routePoint(s,lateral=0,height=0)` | Função | 25 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseSimulation.js

[Implementação](../src/js/bear-chase/ChaseSimulation.js). Contratos exportados/reexportados: `createChaseState`, `restoreChaseState`, `hitsObstacle`, `stepChase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createChaseState()` | Função | 11 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `restoreChaseState(saved)` | Função | 20 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `random(state)` | Função | 43 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `hitsObstacle(obstacle, fromX, toX, fromZ, toZ)` | Função | 49 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dropPattern(state, events, pacing, speed, ambushZ = null, difficulty = 'NORMAL')` | Função | 56 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `followFairy(state, dt)` | Função | 86 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `advanceStage(state, events)` | Função | 94 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stepChase(state, input, dt = C.step, difficulty = 'NORMAL')` | Função | 105 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseToyModels.js

[Implementação](../src/js/bear-chase/ChaseToyModels.js). Contratos exportados/reexportados: `ChaseToyModels`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(catalog)` | Método declarado | 4 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `train()` | Método declarado | 6 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/BlockCastleProp.js

[Implementação](../src/js/bear-chase/props/BlockCastleProp.js). Contratos exportados/reexportados: `BlockCastleProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | 7 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `centralWall(parts, orange, yellow, green)` | Método declarado | 33 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `portal(parts, material, position, width, height, depth, radius, openingHeight)` | Método declarado | 60 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | 72 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/BlocksProp.js

[Implementação](../src/js/bear-chase/props/BlocksProp.js). Contratos exportados/reexportados: `BlocksProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | 7 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | 28 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/BookshelfProp.js

[Implementação](../src/js/bear-chase/props/BookshelfProp.js). Contratos exportados/reexportados: `BookshelfProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | 6 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | 32 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/BunnyProp.js

[Implementação](../src/js/bear-chase/props/BunnyProp.js). Contratos exportados/reexportados: `BunnyProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | 7 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `ellipsoid(parts, material, position, scale, tilt = 0)` | Método declarado | 38 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | 43 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/ChasePropCatalog.js

[Implementação](../src/js/bear-chase/props/ChasePropCatalog.js). Contratos exportados/reexportados: `ChasePropCatalog`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(images, externalResources = null)` | Método declarado | 15 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `register(id, factory, reference, rotation = 0, scale = 1)` | Método declarado | 29 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create(id)` | Método declarado | 37 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `release(root)` | Método declarado | 44 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dispose()` | Método declarado | 46 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/ChasePropResources.js

[Implementação](../src/js/bear-chase/props/ChasePropResources.js). Contratos exportados/reexportados: `ChasePropResources`, `PropParts`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(woodImage, externalResources = null, pictorialImages = {})` | Método declarado | 7 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `own(resource)` | Método declarado | 13 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `woodTexture(painted)` | Método declarado | 15 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fabricTexture(image)` | Método declarado | 30 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `material(name, color, wood = false, texture = null)` | Método declarado | 43 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pictorialMaterial(asset, region, tint = '#ffffff')` | Método declarado | 52 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fabricRegion(image)` | Método declarado | 72 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `bake(parts, name, combineAtlas = false)` | Método declarado | 79 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `combinedMaterial(source)` | Método declarado | 113 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dispose()` | Método declarado | 125 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor()` | Método declarado | 134 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `add(geometry, material, position, rotation = [0, 0, 0])` | Método declarado | 136 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `box(material, position, size, radius = .015)` | Método declarado | 140 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cylinder(material, position, top, bottom, height, rotation = [0, 0, 0], segments = 20, axialGrain = false)` | Método declarado | 161 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ring(material, position, radius, tube, rotation = [0, 0, 0])` | Método declarado | 170 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/DecorativeGeometry.js

[Implementação](../src/js/bear-chase/props/DecorativeGeometry.js). Contratos exportados/reexportados: `oval`, `profile`, `rounded`, `curve`, `rod`, `outline`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `oval(p,m,at,size,rotation=[0,0,0])` | Função | 4 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `profile(p,m,shape,depth,at=[0,0,0],bevel=.012)` | Função | 8 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rounded(p,m,at,size,radius=.05,bevel=.012)` | Função | 20 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `curve(p,m,points,radius=.012,closed=false)` | Função | 27 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rod(p,m,a,b,r=.018)` | Função | 32 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `outline(commands)` | Função | 38 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/DecorativeProps.js

[Implementação](../src/js/bear-chase/props/DecorativeProps.js). Contratos exportados/reexportados: `decorativeFactories`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `teddy(p,m)` | Função | 6 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `robot(p,m)` | Função | 21 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `duck(p,m)` | Função | 42 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drum(p,m)` | Função | 57 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `jack(p,m)` | Função | 65 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `armchair(p,m)` | Função | 84 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `horse(p,m)` | Função | 103 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `table(p,m)` | Função | 131 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `decorativeFactories(resources)` | Função | 140 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mat(region,tint)` | Função atribuída | 141 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/OakCabinetProp.js

[Implementação](../src/js/bear-chase/props/OakCabinetProp.js). Contratos exportados/reexportados: `OakCabinetProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | 6 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | 48 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/PictorialMaterialAssets.js

[Implementação](../src/js/bear-chase/props/PictorialMaterialAssets.js). Contratos exportados/reexportados: `PICTORIAL_ATLASES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/bear-chase/props/PilotPropResources.js

[Implementação](../src/js/bear-chase/props/PilotPropResources.js). Contratos exportados/reexportados: `PilotPropResources`, `PropParts`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/bear-chase/props/ToyChestProp.js

[Implementação](../src/js/bear-chase/props/ToyChestProp.js). Contratos exportados/reexportados: `ToyChestProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | 7 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `sidePanel(parts, material, x)` | Método declarado | 40 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `inscription(resources)` | Método declarado | 51 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | 68 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/TrainProp.js

[Implementação](../src/js/bear-chase/props/TrainProp.js). Contratos exportados/reexportados: `TrainProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | 6 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | 51 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/cinematics/OpeningSequence.js

[Implementação](../src/js/cinematics/OpeningSequence.js). Contratos exportados/reexportados: `OPENING_STORAGE_KEY`, `OPENING_DIALOGUE`, `OpeningSequence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({storage, onReveal = () => {}, onComplete = () => {}, onCue = () => {}} = {})` | Método declarado | 19 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `hasCompleted()` | Método declarado | 29 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `start()` | Método declarado | 34 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `cancel()` | Método declarado | 41 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reset()` | Método declarado | 42 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | 46 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 49 | Reaplica a captura específica; confira referências e dados transitórios. |
| `revealing()` | Acessor | 57 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | 58 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `renderFade(ctx, canvas)` | Método declarado | 74 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `render(ctx, canvas, {assets, drawRoom, lighting, fairyRenderer})` | Método declarado | 81 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/cinematics/ToyRoomIntroduction.js

[Implementação](../src/js/cinematics/ToyRoomIntroduction.js). Contratos exportados/reexportados: `TOY_ROOM_INTRO_STAGES`, `ToyRoomIntroduction`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `along(points, p)` | Função atribuída | 7 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor({ onComplete = () => {}, onEvent = () => {} } = {})` | Método declarado | 19 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `start(context)` | Método declarado | 25 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stage()` | Acessor | 33 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | 41 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `prepare({ phase, departure, audio })` | Método declarado | 57 | Prepara contexto visual da introdução; consulte dependências no módulo. |
| `dialogue()` | Acessor | 97 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraFrame(canvas)` | Método declarado | 108 | Calcula enquadramento narrativo da introdução conforme etapa e relógio. |
| `fairyPosition()` | Método declarado | 130 | Calcula posição visual da fada durante a introdução. |
| `render(ctx, canvas)` | Método declarado | 143 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialogue(ctx, canvas, text)` | Método declarado | 198 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `cancel()` | Método declarado | 226 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/config.js

[Implementação](../src/js/config.js). Contratos exportados/reexportados: `DEBUG_COLLISIONS`, `GAME_CONFIG`, `FLOOR_Y`, `createBabyState`, `CUTSCENE_DIALOGUE`, `getApproachJumpSpeed`, `getEscapeStats`, `getPhase3Stats`, `createFairyState`, `platforms`, `exitDoor`, `phase3Platforms`, `trueExitDoor`, `roomScenery`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createBabyState()` | Função | 12 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `getApproachJumpSpeed(platformIndex, difficulty = 'NORMAL')` | Função | 46 | Consulta o alcance fixo da aproximação por apoio e dificuldade, sem mirar pela posição do comando. |
| `getEscapeStats(level, difficulty = 'NORMAL')` | Função | 72 | Consulta impulso, corrida e efeitos da fuga; o alcance aéreo varia entre NORMAL e EASY. |
| `getPhase3Stats(level, fromFloor = false, difficulty = 'NORMAL')` | Função | 93 | Consulta atributos do retorno por nível e dificuldade; fromFloor distingue a entrada pelo chão. |
| `createFairyState()` | Função | 107 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/AndroidFraming.js

[Implementação](../src/js/controllers/AndroidFraming.js). Contratos exportados/reexportados: `androidFrameOffset`, `createAndroidFraming`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `androidFrameOffset({ enabled, height, cssHeight, bottomInset = 0, topInset = 0, feetY, topY })` | Função | 2 | Calcula elevação visual Android com reservas e proteção do topo. |
| `createAndroidFraming(canvas)` | Função | 12 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `offset(feetY, topY)` | Método declarado | 24 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/AudioController.js

[Implementação](../src/js/controllers/AudioController.js). Contratos exportados/reexportados: `AudioController`, `createAudioController`.

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
| `getAudioContext()` | Método declarado | 99 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(muted)` | Método declarado | 103 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `isMuted()` | Método declarado | 111 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | Método declarado | 115 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `initAudio()` | Método declarado | 120 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startMusic()` | Método declarado | 126 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `playOpeningAmbience()` | Método declarado | 132 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startMusicBox()` | Método declarado | 134 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopMusic()` | Método declarado | 140 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stopAllAudio()` | Método declarado | 146 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearActiveSounds()` | Método declarado | 152 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playJumpSound()` | Método declarado | 158 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLongJumpSound(progress)` | Método declarado | 164 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLevelUpChime(level)` | Método declarado | 170 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyVoiceBlip(freq)` | Método declarado | 176 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyLaugh()` | Método declarado | 182 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playEscapePowerUp()` | Método declarado | 188 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFallFailSound()` | Método declarado | 194 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playTapeRipSound()` | Método declarado | 200 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDramaticTumbleSound()` | Método declarado | 206 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyThudSound()` | Método declarado | 212 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyShockVoice()` | Método declarado | 218 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyFrustratedSound()` | Método declarado | 224 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPhase3StartFanfare()` | Método declarado | 230 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setToyRoomMusicFade(value)` | Método declarado | 236 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setToyRoomMusicIntensity(value)` | Método declarado | 237 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playArenaMusicBeat(beat)` | Método declarado | 238 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopArenaMusic()` | Método declarado | 239 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playArenaSound(event)` | Método declarado | 240 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setToyRoomMusicTrack(track)` | Método declarado | 241 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPortalExitWhoosh()` | Método declarado | 246 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playSoftMagicBurst()` | Método declarado | 247 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startToyRoomMusic(options)` | Método declarado | 249 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopToyRoomMusic()` | Método declarado | 255 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | Método declarado | 261 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | Método declarado | 267 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getToyRoomAudioElement()` | Método declarado | 273 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `playPickUpSound()` | Método declarado | 280 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDropSound()` | Método declarado | 286 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOrganizeChime(streak)` | Método declarado | 292 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playToyRoomVictory()` | Método declarado | 298 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playCombatSound(event)` | Método declarado | 304 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `destroy()` | Método declarado | 310 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `createAudioController(options = {})` | Função | 322 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/CameraController.js

[Implementação](../src/js/controllers/CameraController.js). Contratos exportados/reexportados: `CameraController`, `createCameraController`.

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

[Implementação](../src/js/controllers/CameraPresentation.js). Contratos exportados/reexportados: `getPhase3ScrollFrame`, `CameraPresentation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getPhase3ScrollFrame({ x, width, height })` | Função | 4 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `constructor()` | Método declarado | 17 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `reset()` | Método declarado | 18 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | 19 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 20 | Reaplica a captura específica; confira referências e dados transitórios. |
| `mobileFrame({ target, enabled, stable, anticipate, tick, width, height })` | Método declarado | 22 | Interpola entrada do enquadramento móvel. |
| `step(from, to, dimension)` | Função atribuída | 42 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame({ x, y, playerX, groundLead, targetY, onGround, active, narrative, tick, width, height, cssWidth, cssHeight, zoom })` | Método declarado | 52 | Calcula pose visual estável sem escrever na simulação. |
| `move(from, to, dimension, tolerance)` | Função atribuída | 65 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clamp(delta, limit)` | Função atribuída | 85 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/EscapeFairyGuide.js

[Implementação](../src/js/controllers/EscapeFairyGuide.js). Contratos exportados/reexportados: `getEscapeGuideTarget`, `updateEscapeFairyGuide`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getEscapeGuideTarget(baby, platforms, exitDoor)` | Função | 2 | Seleciona centro de chegada do próximo apoio ou porta. |
| `updateEscapeFairyGuide(fairy, target, dt = 1)` | Função | 12 | Atualiza posição/velocidade da guia com amortecimento crítico. |

## src/js/controllers/InputController.js

[Implementação](../src/js/controllers/InputController.js). Contratos exportados/reexportados: `InputController`, `bindInput`.

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

[Implementação](../src/js/controllers/MobileZoom.js). Contratos exportados/reexportados: `isMobileDevice`, `getMobileZoomFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `isMobileDevice(nav = globalThis.navigator)` | Função | 2 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getMobileZoomFrame({ enabled, width, height, bounds, anchor, margin = 24, stable = false, anticipate = false })` | Função | 8 | Retorna escala e translações de apresentação a partir dos limites/alvo. |
| `clamp(value, min, max)` | Função atribuída | 23 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/ViewportController.js

[Implementação](../src/js/controllers/ViewportController.js). Contratos exportados/reexportados: `createViewportController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createViewportController({ canvas, darkCanvas, lighting, host, onOrientation })` | Função | 2 | Cria resize com Canvas, iluminação, host e callback de orientação. |
| `resize()` | Função | 3 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/debug/AtlasDebugger.js

[Implementação](../src/js/debug/AtlasDebugger.js). Contratos exportados/reexportados: `AtlasDebugger`, `createAtlasDebugger`.

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

[Implementação](../src/js/debug/CameraQaObserver.js). Contratos exportados/reexportados: `createCameraQaObserver`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createCameraQaObserver({ host, snapshot })` | Função | 2 | Cria observador opcional ativado por cameraQa; lê snapshot sem alterar câmera. |
| `record(transform = null)` | Método declarado | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/effects/ArtFinish.js

[Implementação](../src/js/effects/ArtFinish.js). Contratos exportados/reexportados: `applyArtFinish`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `applyArtFinish(ctx, canvas)` | Função | 2 | Aplica dessaturação em coordenadas de tela. |

## src/js/effects/ParticleSystem.js

[Implementação](../src/js/effects/ParticleSystem.js). Contratos exportados/reexportados: `ParticleSystem`, `createParticleSystem`.

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

[Implementação](../src/js/effects/TransitionEffects.js). Contratos exportados/reexportados: `TransitionEffects`, `transitionEffects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderPortalWipe(ctx, canvas, cameraX, cameraY, trueExitDoor, transitionWipeAlpha, tick = 0, presentationTransform = null)` | Método declarado | 20 | Desenha transição do portal usando matriz de apresentação quando fornecida. |

## src/js/effects/index.js

[Implementação](../src/js/effects/index.js). Contratos exportados/reexportados: `ParticleSystem`, `createParticleSystem`, `TransitionEffects`, `transitionEffects`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/entities/BabyRenderer.js

[Implementação](../src/js/entities/BabyRenderer.js). Contratos exportados/reexportados: `BabyRenderer`, `babyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | 5 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | 6 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `resolveAnimationState(baby, state)` | Método declarado | 7 | Escolhe animação oficial conforme ação e flags do estado. |
| `renderPose(ctx, assets, pose, frameIndex, centerX, feetY, height, facing = 1, visualScale = 1)` | Método declarado | 74 | Desenha recorte ancorado no centro/pés, com escala visual. |
| `render(ctx, baby, state = {}, camX = 0, options = {})` | Método declarado | 92 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/entities/FairyRenderer.js

[Implementação](../src/js/entities/FairyRenderer.js). Contratos exportados/reexportados: `FairyRenderer`, `fairyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `render(ctx, fairy, state = {}, camX = 0, options = {})` | Método declarado | 18 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/entities/index.js

[Implementação](../src/js/entities/index.js). Contratos exportados/reexportados: `BabyRenderer`, `babyRenderer`, `FairyRenderer`, `fairyRenderer`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/environment/BackgroundRenderer.js

[Implementação](../src/js/environment/BackgroundRenderer.js). Contratos exportados/reexportados: `getBackgroundViewport`, `BackgroundRenderer`, `backgroundRenderer`.

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

[Implementação](../src/js/environment/LightingSystem.js). Contratos exportados/reexportados: `LightingSystem`, `createLightingSystem`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | 16 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `resize(width, height)` | Método declarado | 21 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(ctx, canvas, state = {}, baby = {}, fairy = {}, camX = 0, camY = 0, options = {})` | Método declarado | 27 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pool(x, y, rx, ry, strength)` | Função atribuída | 58 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createLightingSystem(options = {})` | Função | 176 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/environment/PlatformRenderer.js

[Implementação](../src/js/environment/PlatformRenderer.js). Contratos exportados/reexportados: `PLATFORM_SURFACES`, `PlatformRenderer`, `platformRenderer`.

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

[Implementação](../src/js/environment/StorybookPlatforms.js). Contratos exportados/reexportados: `drawContactEdge`, `drawStorybookPlatform`.

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

[Implementação](../src/js/environment/index.js). Contratos exportados/reexportados: `BackgroundRenderer`, `backgroundRenderer`, `PlatformRenderer`, `platformRenderer`, `LightingSystem`, `createLightingSystem`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/environment/nightWindows.js

[Implementação](../src/js/environment/nightWindows.js). Contratos exportados/reexportados: `NIGHT_WINDOWS`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/game.js

[Implementação](../src/js/game.js). Contratos exportados/reexportados: `createGame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createGame(canvas, uiFeedback, callbacks = {})` | Função | 34 | Cria o coordenador e devolve a API de integração com a página. |
| `onComplete()` | API/lambda de objeto | 71 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginToyRoomIntroduction()` | Função | 82 | Captura saída e cria sala de apresentação sem input antes da fase ativa. |
| `beginOpeningGameplay()` | Função | 109 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enterFirstJumpTutorial()` | Função | 127 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncViewportFromState()` | Função | 143 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncViewportToState()` | Função | 147 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setLastInputDevice(dev)` | Função | 151 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getActivePromptDevice()` | Função | 155 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `startStandbyPreparation()` | Função | 159 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `confirmStandby()` | Função | 165 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetBabyPhysicsBody(targetX, targetY, facing = 1)` | Função | 172 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `triggerGameOver()` | Função | 178 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retryGame()` | Função | 184 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restartToTitle()` | Função | 192 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startToyRoomIntroduction()` | Função | 205 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startToyRoomPhase({ fromIntroduction = false } = {})` | Função | 225 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleResize()` | Função | 269 | Dimensiona bitmap e canvases auxiliares a partir do layout CSS. |
| `startTruePortalTransition()` | Função | 286 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `showFailMessage()` | Função | 292 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startCastleCutscene()` | Função | 296 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advanceCutscene()` | Função | 302 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishCutscene()` | Função | 308 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startPlotTwistCutscene()` | Função | 315 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advancePlotTwist()` | Função | 321 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishPlotTwistAndStartTutorial()` | Função | 327 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetToStart(failedMidClimb = false, shouldPlayFailSound = true)` | Função | 333 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `doJump(inputSource)` | Função | 340 | Seleciona salto ou avanço narrativo conforme o estado atual. |
| `spawnFairyFlightDust(fx, fy, fvx, fvy)` | Função | 485 | Cria partículas/efeitos no buffer correspondente. |
| `spawnFairySparkles(x, y, count = 2)` | Função | 489 | Cria partículas/efeitos no buffer correspondente. |
| `updateFairyParticles()` | Função | 493 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `spawnBabyJumpDust(bx, bw, by, bh, bvx)` | Função | 498 | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyJumpPuff(x, y, count = 5)` | Função | 502 | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyLandingPuff(x, y)` | Função | 506 | Cria partículas/efeitos no buffer correspondente. |
| `updateBabyJumpDust(dt = 1.0)` | Função | 510 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `drawBackgroundWall(camX)` | Função | 516 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawSceneryItems(camX)` | Função | 520 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawPlatforms(camX)` | Função | 524 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawExitDoor(camX)` | Função | 535 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawTrueExitDoor(camX)` | Função | 546 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBabyManaStyle(camX)` | Função | 556 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFairy(camX)` | Função | 562 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `applyDarkAtmosphereWithLights(camX, camY = 0)` | Função | 568 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawSpeedRibbons(camX)` | Função | 579 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBabyJumpDust(camX)` | Função | 583 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawEscapeBanner()` | Função | 588 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialoguePortrait(pCtx, charType, px, py, radius, mood = 'normal')` | Função | 592 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapDialogueText(pCtx, text, maxWidth)` | Função | 596 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawCutsceneDialogue(transform)` | Função | 600 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawTutorialArrow(camX)` | Função | 613 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `update(dt = 1.0)` | Função | 623 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `onLagBehind()` | API/lambda de objeto | 1025 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Função | 1034 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `togglePause()` | Função | 1044 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Função | 1062 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `saveProgress()` | Função | 1068 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restoreProgress(saved)` | Função | 1080 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `newCampaign({ preserveProgress = false } = {})` | Função | 1104 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startDebugPhase(phase, difficulty = state.gameDifficulty)` | Função | 1124 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `saveOnHide()` | Função atribuída | 1158 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `recordCameraQa(transform = null)` | Função | 1176 | Emite observação optativa de câmera; ativada por cameraQa e callback de teste. |
| `loop(currentTime = performance.now())` | Função | 1180 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isFirstJumpTutorial()` | API/lambda de objeto | 1220 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGrounded()` | API/lambda de objeto | 1222 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isCutsceneActive()` | API/lambda de objeto | 1223 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGameOver()` | API/lambda de objeto | 1224 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isToyRoomMode()` | API/lambda de objeto | 1225 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | API/lambda de objeto | 1227 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | API/lambda de objeto | 1254 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | API/lambda de objeto | 1255 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setMasterVolume(v)` | API/lambda de objeto | 1256 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | API/lambda de objeto | 1257 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(m)` | API/lambda de objeto | 1258 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `isMuted()` | API/lambda de objeto | 1259 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | API/lambda de objeto | 1260 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isPaused()` | API/lambda de objeto | 1261 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `hasProgress()` | API/lambda de objeto | 1264 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `hasSavedCampaign()` | API/lambda de objeto | 1265 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDifficulty()` | API/lambda de objeto | 1266 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `destroy()` | Método declarado | 1269 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `start(difficulty = 'NORMAL')` | Método declarado | 1278 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `isGrounded()` | API/lambda de objeto | 1300 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isCutsceneActive()` | API/lambda de objeto | 1301 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGameOver()` | API/lambda de objeto | 1306 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isToyRoomMode()` | API/lambda de objeto | 1310 | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/input.js

[Implementação](../src/js/input.js). Contratos exportados/reexportados: `InputController`, `bindInput`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/main.js

[Implementação](../src/js/main.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `refreshCampaignMenu()` | Função | 32 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updatePauseButtonState()` | Função | 48 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `toggleGamePause()` | Função | 65 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateSoundButtonState()` | Função | 80 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `onGameOver()` | API/lambda de objeto | 128 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onRestartToTitle()` | API/lambda de objeto | 140 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGame(event)` | Função | 161 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleRetry(event)` | Função | 190 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleRestart(event)` | Função | 222 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `addSafeAction(element, handler)` | Função | 255 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `safeHandler(event)` | Função atribuída | 258 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handleToyRoomSwitch(event)` | Função | 275 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onNew()` | API/lambda de objeto | 314 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onLoad()` | API/lambda de objeto | 315 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setDebugPhaseMenuOpen(open, restoreFocus = false)` | Função atribuída | 325 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `pollOverlayGamepad()` | Função | 408 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/narrative/DarkRoomNarrative.js

[Implementação](../src/js/narrative/DarkRoomNarrative.js). Contratos exportados/reexportados: `updateStandbyNarrative`, `updateTransicaoStandbyNarrative`, `updateCasteloNarrative`, `updateReviravoltaNarrative`, `updateTutorialRetornoNarrative`, `updatePortalNarrative`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateStandbyNarrative(context, dt)` | Função | 5 | Mantém pose de espera, fada, partículas e foco narrativo de standby. |
| `updateTransicaoStandbyNarrative(context, dt)` | Função | 35 | Avança saída de standby, postura, alfa e retorno do enquadramento. |
| `updateCasteloNarrative(context, dt)` | Função | 89 | Sequencia encontro no castelo, diálogos e liberação da fuga. |
| `updateReviravoltaNarrative(context, dt)` | Função | 148 | Avança queda/checagem e diálogos da porta falsa; coordena atores e zoom. |
| `updateTutorialRetornoNarrative(context, dt)` | Função | 304 | Demonstra arco da fada e devolve controle no retorno. |
| `updatePortalNarrative(context, dt)` | Função | 348 | Avança aproximação/íris do portal e dispara introdução da Toy Room. |

## src/js/narrative/PoeticNarrator.js

[Implementação](../src/js/narrative/PoeticNarrator.js). Contratos exportados/reexportados: `POETIC_LINES`, `getPauseNarration`, `renderPoeticNarration`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getPauseNarration(state)` | Função | 14 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `renderPoeticNarration(ctx, canvas, text, options = {})` | Função | 21 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/rendering/DarkRoomRenderPipeline.js

[Implementação](../src/js/rendering/DarkRoomRenderPipeline.js). Contratos exportados/reexportados: `renderDarkRoom`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderDarkRoom(context)` | Função | 10 | Compõe apresentação, camadas e interface; update de simulação permanece em game.js. |
| `drawRoom()` | API/lambda de objeto | 18 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/runtime/RuntimeContext.js

[Implementação](../src/js/runtime/RuntimeContext.js). Contratos exportados/reexportados: `createRuntimeContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createRuntimeContext({ state, audio, camera, assets, input, effects, campaign })` | Função | 2 | Agrega referências existentes; não cria serviços nem executa lógica de jogo. |

## src/js/state/CampaignProgress.js

[Implementação](../src/js/state/CampaignProgress.js). Contratos exportados/reexportados: `CAMPAIGN_STORAGE_KEY`, `captureState`, `restoreState`, `createCampaignProgress`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `captureState(state)` | Função | 10 | Seleciona estado serializável da campanha. |
| `restoreState(state, saved)` | Função | 13 | Restaura valores preservando referências de objetos/arrays existentes. |
| `createCampaignProgress(storage)` | Função | 23 | Cria leitura, gravação e limpeza do progresso local com alternativa em memória. |
| `read()` | Método declarado | 28 | Lê e valida save da campanha; pode usar memória da sessão. |
| `write(data)` | Método declarado | 67 | Serializa save versionado e tenta gravar no storage. |
| `clear()` | Método declarado | 72 | Configura/reinicializa valores do componente; revise o escopo da mutação. |

## src/js/state/GameDifficulty.js

[Implementação](../src/js/state/GameDifficulty.js). Contratos exportados/reexportados: `normalizeDifficulty`, `EASY_LANDING_MARGIN`, `EASY_LANDING_DEPTH`, `easyLanding`, `toyGuideBlend`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `easyLanding(baby, x, width, y)` | Função | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyGuideBlend(difficulty, dt)` | Função | 11 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/state/GameState.js

[Implementação](../src/js/state/GameState.js). Contratos exportados/reexportados: `GameState`, `createGameState`.

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

[Implementação](../src/js/state/StateVariables.js). Contratos exportados/reexportados: `createDefaultStateVariables`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createDefaultStateVariables()` | Função | 6 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/toy-room/ArenaAudioProfile.js

[Implementação](../src/js/toy-room/ArenaAudioProfile.js). Contratos exportados/reexportados: `ArenaAudioProfile`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(audio)` | Método declarado | 3 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `transform()` | Método declarado | 4 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enter()` | Método declarado | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | 9 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `sound(event)` | Método declarado | 14 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `leave({ resume = true } = {})` | Método declarado | 18 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `snapshot()` | Método declarado | 24 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 25 | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ArenaBoss.js

[Implementação](../src/js/toy-room/ArenaBoss.js). Contratos exportados/reexportados: `ArenaBoss`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | 3 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `update(dt, battle)` | Método declarado | 4 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `snapshot()` | Método declarado | 15 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 16 | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ArenaCamera.js

[Implementação](../src/js/toy-room/ArenaCamera.js). Contratos exportados/reexportados: `ArenaCamera`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | 6 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `update(dt, player, enemy, jump = 0, impact = null)` | Método declarado | 7 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `envelope(player, enemy, jump)` | Método declarado | 19 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(layout, room, battle)` | Método declarado | 24 | Calcula pose visual estável sem escrever na simulação. |
| `snapshot()` | Método declarado | 44 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 45 | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ArenaCombatContact.js

[Implementação](../src/js/toy-room/ArenaCombatContact.js). Contratos exportados/reexportados: `arenaEnemyContact`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaEnemyContact(state, enemy)` | Função | 2 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaCombatRules.js

[Implementação](../src/js/toy-room/ArenaCombatRules.js). Contratos exportados/reexportados: `ARENA_SWORD`, `arenaEnemyImpactEnd`, `arenaEnemyGuarding`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaEnemyImpactEnd(enemy, tuning = { windup: 54, active: 18 })` | Função atribuída | 3 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaEnemyGuarding(enemy, tuning)` | Função | 6 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaDifficulty.js

[Implementação](../src/js/toy-room/ArenaDifficulty.js). Contratos exportados/reexportados: `arenaDifficulty`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaDifficulty(difficulty = 'NORMAL')` | Função | 15 | Seleciona os perfis originais do NORMAL ou alcance ampliado e menor agressividade no EASY. |

## src/js/toy-room/ArenaEnemies.js

[Implementação](../src/js/toy-room/ArenaEnemies.js). Contratos exportados/reexportados: `ARENA_ENEMIES`, `renderArenaEnemyPresence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderArenaEnemyPresence(ctx, enemy, ground)` | Função | 8 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ArenaEnemyAI.js

[Implementação](../src/js/toy-room/ArenaEnemyAI.js). Contratos exportados/reexportados: `selectArenaEnemyAttack`, `updateArenaEnemyAI`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | 15 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updatePlayerBehavior(battle, dt)` | Função | 17 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `selectArenaEnemyAttack(battle, distance, attacks)` | Função | 36 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateArenaEnemyAI(battle, dt)` | Função | 69 | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/toy-room/ArenaEnvironment.js

[Implementação](../src/js/toy-room/ArenaEnvironment.js). Contratos exportados/reexportados: `renderArenaEnvironment`, `renderArenaTemple`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderArenaEnvironment(ctx, room, arena, time = 0)` | Função | 4 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderArenaTemple(ctx, room, arena)` | Função | 39 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ArenaGirlAnimationFrames.js

[Implementação](../src/js/toy-room/ArenaGirlAnimationFrames.js). Contratos exportados/reexportados: `ARENA_GIRL_REFERENCE_HEIGHT`, `ARENA_GIRL_ANIMATION_FRAMES`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `original(pose, facing, anchors, faces)` | Função atribuída | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `atlas(file, x, y, width, height, anchorX, pixelUnit, faceX = anchorX)` | Função atribuída | 10 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaHUD.js

[Implementação](../src/js/toy-room/ArenaHUD.js). Contratos exportados/reexportados: `ARENA_ENEMY_NAMES`, `arenaHUDLayout`, `renderArenaHUD`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaHUDLayout(layout)` | Função | 6 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderArenaMobileControls(ctx, layout, room)` | Função | 15 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawAction(button, title, badge, special = false)` | Função atribuída | 40 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderArenaHUD(ctx, room, state, layout, boss = null)` | Função | 59 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `bar(b,hp,max,color,reverse)` | Função atribuída | 65 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaPlayerAnimation.js

[Implementação](../src/js/toy-room/ArenaPlayerAnimation.js). Contratos exportados/reexportados: `ARENA_ATTACK_VISUAL_DURATION`, `createPlayerAnimation`, `beginArenaPlayerAttack`, `updateArenaPlayerAnimation`, `sampleArenaPlayerAnimation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createPlayerAnimation(state = {}, player = {})` | Função | 7 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `beginArenaPlayerAttack(state, direction)` | Função | 17 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateArenaPlayerAnimation(state, player, dt)` | Função | 25 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `layer(pose,index=0,weight=1)` | Função atribuída | 50 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pair(from,to,weight)` | Função atribuída | 51 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cycle(pose,time,durations)` | Função | 53 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `poseLayers(pose,time,a,state)` | Função | 61 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sampleArenaPlayerAnimation(state, player)` | Função | 101 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaPlayerController.js

[Implementação](../src/js/toy-room/ArenaPlayerController.js). Contratos exportados/reexportados: `ARENA_TUNING`, `ArenaPlayerController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `update(battle, dt)` | Método declarado | 13 | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/toy-room/ArenaPlayerRenderer.js

[Implementação](../src/js/toy-room/ArenaPlayerRenderer.js). Contratos exportados/reexportados: `ArenaPlayerRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | 7 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | 8 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(ctx,room,state,ground)` | Método declarado | 19 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderSwordArc(ctx,sample,reachScale=1)` | Método declarado | 52 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ArenaScale.js

[Implementação](../src/js/toy-room/ArenaScale.js). Contratos exportados/reexportados: `ARENA_SCALE`, `ARENA_PLAYER_HEIGHT`, `arenaActorBounds`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaActorBounds(x, ground, jump = 0, height = ARENA_PLAYER_HEIGHT, width = height * 1.3)` | Função | 4 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/BattleAssets.js

[Implementação](../src/js/toy-room/BattleAssets.js). Contratos exportados/reexportados: `loadBattleManifest`, `loadBattleImages`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `loadBattleManifest()` | Função | 8 | Carrega o manifesto de remediação e substitui as sequências Hit pelos quadros nativos de dano. |
| `loadBattleImages(manifest, images)` | Função | 19 | Preenche o cache de imagens da batalha, com erro explícito para recursos ausentes. |

## src/js/toy-room/BattleConfig.js

[Implementação](../src/js/toy-room/BattleConfig.js). Contratos exportados/reexportados: `BATTLE_ORDER`, `BATTLE_PLAYER_VISUAL_SCALE`, `BATTLE_TUNING`, `BATTLE_TRANSITION_DURATION`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/BattleGirlFrames.js

[Implementação](../src/js/toy-room/BattleGirlFrames.js). Contratos exportados/reexportados: `BATTLE_GIRL_SOURCE_SHA256`, `BATTLE_GIRL_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/BattlePlayerBounds.js

[Implementação](../src/js/toy-room/BattlePlayerBounds.js). Contratos exportados/reexportados: `BATTLE_PLAYER_BOUNDS`, `BATTLE_ROCKET_GLOVE_BOUNDS`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/BattlePresentation.js

[Implementação](../src/js/toy-room/BattlePresentation.js). Contratos exportados/reexportados: `BATTLE_PLAYER_HALF_WIDTH`, `rocketPunchProjection`, `rocketPunchTouchesPlayer`, `renderRocketPunch`, `BATTLE_LASER_HEIGHT`, `BATTLE_CROUCH_FRAME`, `BATTLE_JUMP_VISUAL_SCALE`, `renderBattleCrouch`, `battlePlayerJumpOffset`, `laserProjection`, `BATTLE_TRAIN_BODY`, `trainDrive`, `renderTrainWalk`.

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

## src/js/toy-room/BattleRenderer.js

[Implementação](../src/js/toy-room/BattleRenderer.js). Contratos exportados/reexportados: `battleAnimationFrame`, `renderBattle`, `renderBattleImpact`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n, a, b)` | Função atribuída | 9 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `battleAnimationFrame(animation, enemy, duration, tuning = BATTLE_TUNING)` | Função | 12 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderBattle(battle)` | Função | 24 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `hearts(hp, max)` | Função atribuída | 126 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderBattleImpact(ctx, impact)` | Função | 159 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/DamageAudio.js

[Implementação](../src/js/toy-room/DamageAudio.js). Contratos exportados/reexportados: `DAMAGE_AUDIO_PROFILES`, `scheduleDamageSound`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `scheduleDamageSound(ctx, destination, register, actor, arena = false)` | Função | 10 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `connectVoice(source, nodes, start, end)` | Função atribuída | 14 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `envelope(volume, start, duration, attack = 0.004)` | Função atribuída | 24 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/DamageSpriteFrames.js

[Implementação](../src/js/toy-room/DamageSpriteFrames.js). Contratos exportados/reexportados: `DAMAGE_SPRITE_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/EnemyMovementAudio.js

[Implementação](../src/js/toy-room/EnemyMovementAudio.js). Contratos exportados/reexportados: `scheduleEnemyMovement`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `scheduleEnemyMovement(ctx,destination,register,actor)` | Função | 2 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ImpactFX.js

[Implementação](../src/js/toy-room/ImpactFX.js). Contratos exportados/reexportados: `ImpactFX`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | 4 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `emit(kind, x, y, heavy = false)` | Método declarado | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | 19 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render(ctx)` | Método declarado | 25 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | 39 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 40 | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/PlayerController.js

[Implementação](../src/js/toy-room/PlayerController.js). Contratos exportados/reexportados: `PlayerController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | 1 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(battle, dt)` | Método declarado | 5 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `faceEnemy()` | Função atribuída | 22 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/RoomEnvironmentRenderer.js

[Implementação](../src/js/toy-room/RoomEnvironmentRenderer.js). Contratos exportados/reexportados: `RoomEnvironmentRenderer`, `roomEnvironmentRenderer`.

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

## src/js/toy-room/SwordAudio.js

[Implementação](../src/js/toy-room/SwordAudio.js). Contratos exportados/reexportados: `scheduleSwordSound`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `scheduleSwordSound(ctx, destination, register, event)` | Função | 2 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `voice(source, nodes, duration, delay = 0)` | Função atribuída | 6 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `envelope(volume, duration, attack = 0.003, delay = 0)` | Função atribuída | 18 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `noise(volume, duration, frequency, end, attack = 0.003)` | Função atribuída | 25 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tone(frequency, end, volume, duration, type = 'sine', delay = 0)` | Função atribuída | 38 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyCarryPresentation.js

[Implementação](../src/js/toy-room/ToyCarryPresentation.js). Contratos exportados/reexportados: `CARRY_PROFILES`, `renderToyCarry`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToyCarry(ctx, player, options = {})` | Função | 17 | Compõe pose, brinquedo e contatos visuais usando CARRY_PROFILES; sem pose/item devolve false. |

## src/js/toy-room/ToyRenderer.js

[Implementação](../src/js/toy-room/ToyRenderer.js). Contratos exportados/reexportados: `ToyRenderer`, `toyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToy(ctx, t, playerX = 0, playerY = 0, isCarrying = false, time = performance.now(), options = {})` | Método declarado | 19 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomArenaBuilder.js

[Implementação](../src/js/toy-room/ToyRoomArenaBuilder.js). Contratos exportados/reexportados: `ToyRoomArenaBuilder`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `build({ furniture, ROOM_W = 1600 })` | Método declarado | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomArenaPhase.js

[Implementação](../src/js/toy-room/ToyRoomArenaPhase.js). Contratos exportados/reexportados: `ARENA_TRANSFORMATION_DURATION`, `ARENA_VICTORY_FADE_DURATION`, `ToyRoomArenaPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(room)` | Método declarado | 22 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `active()` | Acessor | 37 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `start()` | Método declarado | 39 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `configurePresentation()` | Método declarado | 50 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderHUD(ctx, layout, state)` | API/lambda de objeto | 65 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `onImpact(x, y, heavy)` | API/lambda de objeto | 73 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onBlock(x, y)` | API/lambda de objeto | 74 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderPlayer(ctx, state, ground)` | API/lambda de objeto | 79 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `restoreReality({ resumeAudio = true } = {})` | Método declarado | 84 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `finish()` | Método declarado | 103 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `beginReturn()` | Método declarado | 112 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt = 1)` | Método declarado | 123 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | 161 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | 199 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved, roomSave = null)` | Método declarado | 200 | Reaplica a captura específica; confira referências e dados transitórios. |
| `attack()` | Método declarado | 229 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `special()` | Método declarado | 240 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomBattle.js

[Implementação](../src/js/toy-room/ToyRoomBattle.js). Contratos exportados/reexportados: `transferHeart`, `ToyRoomBattle`, `BATTLE_ORDER`, `BATTLE_PLAYER_VISUAL_SCALE`, `BATTLE_TUNING`, `BATTLE_TRANSITION_DURATION`, `battleAnimationFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n, a, b)` | Função atribuída | 13 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `transferHeart(victim, attacker)` | Função | 16 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor(room, { loadAssets = true } = {})` | Método declarado | 24 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | 36 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `activate()` | Método declarado | 44 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `spawn()` | Método declarado | 63 | Cria partículas/efeitos no buffer correspondente. |
| `getEnemyCollisionDistance(actor)` | Método declarado | 71 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getSwordRange(actor = this.state.enemy.actor)` | Método declarado | 83 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `swordContactPoint(dx, facing)` | Método declarado | 89 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resolveActorBodies(side)` | Método declarado | 97 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaChest()` | Método declarado | 110 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginTransition(outgoing)` | Método declarado | 115 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `transitionPlacement(incoming)` | Método declarado | 126 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `input()` | Método declarado | 142 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attack()` | Método declarado | 160 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `faceEnemy()` | Método declarado | 181 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playCombatSound(sound)` | Método declarado | 190 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setEnemyState(state)` | Método declarado | 197 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `beginEnemyAttack(attack)` | Método declarado | 204 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyGuarding()` | Método declarado | 223 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginEnemyResponse()` | Método declarado | 227 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startImpact(target, x, y, direction, heavy)` | Método declarado | 235 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | 244 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `step(dt)` | Método declarado | 271 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyPose(e = this.state.enemy)` | Método declarado | 497 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Método declarado | 502 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderImpact(ctx, impact)` | Método declarado | 504 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | 506 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | 507 | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ToyRoomCamera.js

[Implementação](../src/js/toy-room/ToyRoomCamera.js). Contratos exportados/reexportados: `updateToyRoomCamera`, `getToyRoomCameraFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateToyRoomCamera({ target, canvas, width, height, cameraX, cameraY }, dt)` | Função | 5 | Calcula coordenadas da câmera da sala a partir do alvo narrativo explícito. |
| `getToyRoomCameraFrame({ target, canvas, cameraX, cameraY, mobilePresentation })` | Função | 25 | Calcula zoom e enquadramento da sala com alvo/câmera/layout atuais. |

## src/js/toy-room/ToyRoomCompanion.js

[Implementação](../src/js/toy-room/ToyRoomCompanion.js). Contratos exportados/reexportados: `updateToyRoomCompanion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateToyRoomCompanion({ player, fairy, toys, tutorial, story, gameDifficulty, guideToy }, dt)` | Função | 5 | Atualiza guia, tutorial, voo e rastro da fada; devolve o brinquedo-guia atual. |

## src/js/toy-room/ToyRoomEffects.js

[Implementação](../src/js/toy-room/ToyRoomEffects.js). Contratos exportados/reexportados: `spawnToyRoomSparkles`, `spawnToyRoomConfetti`, `initializeToyRoomSunMotes`, `updateToyRoomEffects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `spawnToyRoomSparkles(sparkles, x, y, count = 12, hue = '#facc15')` | Função | 2 | Cria partículas/efeitos no buffer correspondente. |
| `spawnToyRoomConfetti(confetti, x, y, count = 35)` | Função | 19 | Cria partículas/efeitos no buffer correspondente. |
| `initializeToyRoomSunMotes(sunMotes, width, height)` | Função | 41 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateToyRoomEffects({ chest, sparkles, confetti, footstepPuffs, sunMotes, width, height }, dt)` | Função | 56 | Avança coleções de partículas e animação do baú recebidas no quadro. |

## src/js/toy-room/ToyRoomEntities.js

[Implementação](../src/js/toy-room/ToyRoomEntities.js). Contratos exportados/reexportados: `ToyRoomEntities`, `toyRoomEntities`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderPlayer(ctx, player, options = {})` | Método declarado | 12 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFairy(ctx, fairy, options = {})` | Método declarado | 24 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomEnvironmentAssets.js

[Implementação](../src/js/toy-room/ToyRoomEnvironmentAssets.js). Contratos exportados/reexportados: `createToyRoomEnvironmentAssets`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomEnvironmentAssets(assets)` | Função | 2 | Resolve recortes ambientais existentes sem acessar regras ou estado da exploração. |

## src/js/toy-room/ToyRoomInitialEntities.js

[Implementação](../src/js/toy-room/ToyRoomInitialEntities.js). Contratos exportados/reexportados: `createToyRoomInitialEntities`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomInitialEntities()` | Função | 2 | Cria jogador, fada, móveis e brinquedos independentes por instância, preservando o catálogo. |

## src/js/toy-room/ToyRoomInputBindings.js

[Implementação](../src/js/toy-room/ToyRoomInputBindings.js). Contratos exportados/reexportados: `TOY_ROOM_INPUT`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/ToyRoomInputContext.js

[Implementação](../src/js/toy-room/ToyRoomInputContext.js). Contratos exportados/reexportados: `createToyRoomInputContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomInputContext(room)` | Função | 2 | Adapta entrada, Canvas e callbacks sem copiar os dados usados por HUD/combate. |
| `keysDown()` | Acessor | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `keysDown(value)` | Acessor | 6 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isTouchDevice()` | Acessor | 7 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isTouchDevice(value)` | Acessor | 8 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `actionBtnPressed()` | Acessor | 9 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actionBtnPressed(value)` | Acessor | 10 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `touchState()` | Acessor | 11 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gamepadState()` | Acessor | 12 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaTouchPointers()` | Acessor | 13 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaTouchButtons()` | Acessor | 14 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaSpecialButtons()` | Acessor | 15 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canvas()` | Acessor | 17 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | 18 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `mobile()` | Acessor | 19 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `device()` | Acessor | 20 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handlers()` | Acessor | 21 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `isEnabled()` | API/lambda de objeto | 28 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isLocked()` | API/lambda de objeto | 29 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isArenaCombat()` | API/lambda de objeto | 30 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `initAudio()` | API/lambda de objeto | 32 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `action()` | API/lambda de objeto | 33 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `special()` | API/lambda de objeto | 34 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomInputController.js

[Implementação](../src/js/toy-room/ToyRoomInputController.js). Contratos exportados/reexportados: `ToyRoomInputController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | 6 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setupListeners()` | Método declarado | 11 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getCanvasCoordinates(e)` | Método declarado | 31 | Converte evento de ponteiro para coordenadas internas da sala. |
| `isActionButtonHit(coords)` | Método declarado | 49 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `handleKeyDown(e)` | Método declarado | 53 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyUp(e)` | Método declarado | 65 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | 69 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onPointerDown(e)` | Método declarado | 107 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerMove(e)` | Método declarado | 176 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerUp(e)` | Método declarado | 216 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `clearInput()` | Método declarado | 244 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `refreshArenaTouchButtons()` | Método declarado | 255 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `removeListeners()` | Método declarado | 265 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomInteraction.js

[Implementação](../src/js/toy-room/ToyRoomInteraction.js). Contratos exportados/reexportados: `ToyRoomInteraction`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | 5 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `triggerAction()` | Método declarado | 7 | Processa interação da sala: pegar, soltar ou organizar brinquedo. |
| `updateProximity()` | Método declarado | 102 | Atualiza disponibilidade de interação antes do movimento e devolve o baú atual. |

## src/js/toy-room/ToyRoomInteractionContext.js

[Implementação](../src/js/toy-room/ToyRoomInteractionContext.js). Contratos exportados/reexportados: `createToyRoomInteractionContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomInteractionContext(room)` | Função | 2 | Fornece referências atuais e efeitos específicos para as decisões de interação. |
| `ACTION_DEBOUNCE_MS()` | Acessor | 4 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ROOM_H()` | Acessor | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ROOM_W()` | Acessor | 6 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arena()` | Acessor | 7 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `audio()` | Acessor | 8 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `battle()` | Acessor | 9 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canInteract()` | Acessor | 10 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canInteract(value)` | Acessor | 11 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture()` | Acessor | 12 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isInputEnabled(...args)` | API/lambda de objeto | 13 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isNearChest()` | Acessor | 14 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isNearChest(value)` | Acessor | 15 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `lastActionTime()` | Acessor | 16 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `lastActionTime(value)` | Acessor | 17 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount()` | Acessor | 18 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount(value)` | Acessor | 19 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | 20 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `spawnConfetti(...args)` | API/lambda de objeto | 21 | Cria partículas/efeitos no buffer correspondente. |
| `spawnSparkles(...args)` | API/lambda de objeto | 22 | Cria partículas/efeitos no buffer correspondente. |
| `story()` | Acessor | 23 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | 24 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tutorial()` | Acessor | 25 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `uiFeedback()` | Acessor | 26 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive()` | Acessor | 27 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive(value)` | Acessor | 28 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer()` | Acessor | 29 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer(value)` | Acessor | 30 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomMovement.js

[Implementação](../src/js/toy-room/ToyRoomMovement.js). Contratos exportados/reexportados: `updateToyRoomMovement`, `resolveToyRoomCollisions`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateToyRoomMovement({ player, keysDown, gamepadState, touchState, footstepPuffs, resolveCollisions }, dt)` | Função | 2 | Aplica prioridade das entradas, peso, orientação, passos e integração da exploração. |
| `resolveToyRoomCollisions({ width, height, furniture }, px, py, r)` | Função | 70 | Limita a posição e resolve móveis na ordem original, conservando o desempate de penetrações. |

## src/js/toy-room/ToyRoomOrientation.js

[Implementação](../src/js/toy-room/ToyRoomOrientation.js). Contratos exportados/reexportados: `nearestToyGuide`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `nearestToyGuide(player, toys, previous)` | Função | 2 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomPersistence.js

[Implementação](../src/js/toy-room/ToyRoomPersistence.js). Contratos exportados/reexportados: `ToyRoomPersistence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | 3 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `snapshot({ includeArena = true } = {})` | Método declarado | 5 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved, { preserveArena = false } = {})` | Método declarado | 17 | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ToyRoomPersistenceContext.js

[Implementação](../src/js/toy-room/ToyRoomPersistenceContext.js). Contratos exportados/reexportados: `createToyRoomPersistenceContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomPersistenceContext(room)` | Função | 2 | Adapta campos serializados e retomada dos subsistemas, inclusive após substituição dos atores. |
| `arena()` | Acessor | 4 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `battle()` | Acessor | 5 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chase()` | Acessor | 6 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chase(value)` | Acessor | 7 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraX()` | Acessor | 8 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraX(value)` | Acessor | 9 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraY()` | Acessor | 10 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraY(value)` | Acessor | 11 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearInput()` | API/lambda de objeto | 12 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `fairy()` | Acessor | 13 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fairy(value)` | Acessor | 14 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture()` | Acessor | 15 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture(value)` | Acessor | 16 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState()` | Acessor | 17 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState(value)` | Acessor | 18 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introAlpha()` | Acessor | 19 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introAlpha(value)` | Acessor | 20 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introBannerTimer()` | Acessor | 21 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introBannerTimer(value)` | Acessor | 22 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `lastActionTime()` | Acessor | 23 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `lastActionTime(value)` | Acessor | 24 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount()` | Acessor | 25 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount(value)` | Acessor | 26 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | 27 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `player(value)` | Acessor | 28 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startTutorial()` | API/lambda de objeto | 29 | Inicia orientação guiada da Toy Room se ainda não concluída. |
| `story()` | Acessor | 31 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted()` | Acessor | 32 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted(value)` | Acessor | 33 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | 34 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys(value)` | Acessor | 35 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tutorial()` | Acessor | 36 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive()` | Acessor | 37 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive(value)` | Acessor | 38 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer()` | Acessor | 39 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer(value)` | Acessor | 40 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomPhase.js

[Implementação](../src/js/toy-room/ToyRoomPhase.js). Contratos exportados/reexportados: `ToyRoomPhase`, `createToyRoom`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, audio, uiFeedback, onReturnToTitle, options = {})` | Método declarado | 34 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `inputController()` | Acessor | 115 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setupListeners()` | Método declarado | 122 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getCanvasCoordinates(e)` | Método declarado | 124 | Converte evento de ponteiro para coordenadas internas da sala. |
| `isActionButtonHit(coords)` | Método declarado | 126 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `handleKeyDown(e)` | Método declarado | 128 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyUp(e)` | Método declarado | 130 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | 132 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onPointerDown(e)` | Método declarado | 134 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerMove(e)` | Método declarado | 136 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerUp(e)` | Método declarado | 138 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `clearInput()` | Método declarado | 140 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `refreshArenaTouchButtons()` | Método declarado | 142 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `spawnSparkles(x, y, count = 12, hue = '#facc15')` | Método declarado | 144 | Cria partículas/efeitos no buffer correspondente. |
| `spawnConfetti(x, y, count = 35)` | Método declarado | 148 | Cria partículas/efeitos no buffer correspondente. |
| `interaction()` | Acessor | 152 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `triggerAction()` | Método declarado | 158 | Processa interação da sala: pegar, soltar ou organizar brinquedo. |
| `startChasePreview(saved = null)` | Método declarado | 161 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startChaseCampaign(saved = null)` | Método declarado | 173 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleCampaignChaseError(chase, message)` | Método declarado | 197 | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `resolveCollisions(px, py, r)` | Método declarado | 217 | Resolve colisões da sala com móveis. |
| `update(dt = 1.0)` | Método declarado | 224 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `resolveCollisions(x, y, radius)` | API/lambda de objeto | 260 | Resolve colisões da sala com móveis. |
| `updateCamera(dt)` | Método declarado | 281 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `getCameraFrame()` | Método declarado | 289 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `render(options = {})` | Método declarado | 296 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `startTutorial()` | Método declarado | 303 | Inicia orientação guiada da Toy Room se ainda não concluída. |
| `persistence()` | Acessor | 305 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `snapshot(options)` | Método declarado | 310 | Produz captura recuperável do estado específico deste componente. |
| `restore(saved, options)` | Método declarado | 312 | Reaplica a captura específica; confira referências e dados transitórios. |
| `destroy()` | Método declarado | 315 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `createToyRoom(canvas, audio, uiFeedback, onReturnToTitle, options)` | Função | 326 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `update(dt)` | API/lambda de objeto | 329 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | API/lambda de objeto | 330 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `triggerAction()` | API/lambda de objeto | 331 | Processa interação da sala: pegar, soltar ou organizar brinquedo. |
| `destroy()` | API/lambda de objeto | 332 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/toy-room/ToyRoomSceneFrame.js

[Implementação](../src/js/toy-room/ToyRoomSceneFrame.js). Contratos exportados/reexportados: `createToyRoomSceneFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomSceneFrame(room)` | Função | 2 | Monta dados e callbacks atuais para desenhar uma cena da sala. |
| `getCameraFrame()` | API/lambda de objeto | 25 | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/toy-room/ToyRoomSceneRenderer.js

[Implementação](../src/js/toy-room/ToyRoomSceneRenderer.js). Contratos exportados/reexportados: `renderToyRoomScene`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToyRoomScene(scene, options = {})` | Função | 7 | Compõe cenário, entidades por Y, efeitos, HUD e falas com os dados do quadro. |

## src/js/toy-room/ToyRoomStory.js

[Implementação](../src/js/toy-room/ToyRoomStory.js). Contratos exportados/reexportados: `createToyRoomStoryState`, `ToyRoomStory`, `drawToySword`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomStoryState()` | Função atribuída | 33 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `distance(a, b)` | Função atribuída | 47 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `outsideViewport(point, viewport, margin = 72)` | Função | 48 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getBeat(beats, elapsed)` | Função | 53 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `constructor({ world, actors, exploration, flow, controls, audio, presentation })` | Método declarado | 64 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `refreshReachablePoints()` | Método declarado | 79 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `recordViewport(frame)` | Método declarado | 86 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onToyStored(toy)` | Método declarado | 90 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | 107 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateReturns(dt)` | Método declarado | 144 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `beginInvestigation()` | Método declarado | 177 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateInvestigation(dt)` | Método declarado | 194 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateSwordGuide()` | Método declarado | 228 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateAfterMovement()` | Método declarado | 239 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `clearInput()` | Método declarado | 253 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `inputLocked()` | Acessor | 257 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `swordEquipped()` | Acessor | 262 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attack()` | Método declarado | 266 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `guidePosition()` | Método declarado | 274 | Retorna posição visual da fada acima do brinquedo-alvo do tutorial. |
| `cameraTarget()` | Método declarado | 281 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderWorldObject(ctx)` | Método declarado | 291 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderAttackSprite(ctx)` | Método declarado | 295 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderHeldObject(ctx)` | Método declarado | 302 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `narrativeBeat()` | Método declarado | 309 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderNarrative(ctx, canvas)` | Método declarado | 330 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryBeat(ctx, canvas, beat)` | Método declarado | 335 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `restore(saved)` | Método declarado | 342 | Reaplica a captura específica; confira referências e dados transitórios. |
| `snapshot()` | Método declarado | 358 | Produz captura recuperável do estado específico deste componente. |

## src/js/toy-room/ToyRoomStoryContext.js

[Implementação](../src/js/toy-room/ToyRoomStoryContext.js). Contratos exportados/reexportados: `createToyRoomStoryContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomStoryContext(room)` | Função | 7 | Restringe a narrativa a mundo, atores, exploração, fluxo, controles, áudio e apresentação. |
| `getDimensions()` | API/lambda de objeto | 10 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getPlayer()` | API/lambda de objeto | 11 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `resolvePosition(x, y, radius)` | API/lambda de objeto | 12 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getCameraFrame()` | API/lambda de objeto | 13 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getCameraBounds()` | API/lambda de objeto | 14 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `player()` | Acessor | 17 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `fairy()` | Acessor | 18 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `difficulty()` | Acessor | 19 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | 22 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture()` | Acessor | 23 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `returnToy(toy, point)` | Método declarado | 24 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `releaseCarriedToy()` | Método declarado | 28 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tutorialActive()` | Acessor | 36 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introductionActive()` | Acessor | 37 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clear()` | Método declarado | 40 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPickup()` | Método declarado | 55 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `useSwordTrack()` | Método declarado | 56 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `assets()` | Acessor | 59 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mobile()` | Acessor | 60 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomStoryRenderer.js

[Implementação](../src/js/toy-room/ToyRoomStoryRenderer.js). Contratos exportados/reexportados: `createStoryAttackFrames`, `drawToySword`, `renderStoryWorldObject`, `renderStoryAttackSprite`, `renderStoryHeldObject`, `renderStoryBeat`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createStoryAttackFrames(assets)` | Função | 9 | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `drawToySword(ctx, x, y, angle, scale = 1)` | Função | 19 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryWorldObject(ctx, state)` | Função | 51 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryAttackSprite(ctx, { state, player, attackFrames, attackDuration })` | Função | 55 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryHeldObject(ctx, { state, player, attackFrames, attackDuration })` | Função | 73 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryBeat(ctx, canvas, beat, { mobile, assets, tick })` | Função | 106 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomToyActions.js

[Implementação](../src/js/toy-room/ToyRoomToyActions.js). Contratos exportados/reexportados: `pickUpToy`, `storeToyInChest`, `releaseCarriedToy`, `returnToyToFloor`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `pickUpToy(player, toy)` | Função | 2 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `storeToyInChest(player, chest)` | Função | 7 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `releaseCarriedToy(player, point)` | Função | 16 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `returnToyToFloor(toy, point)` | Função | 24 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomTutorial.js

[Implementação](../src/js/toy-room/ToyRoomTutorial.js). Contratos exportados/reexportados: `ToyRoomTutorial`, `TOY_ROOM_INPUT`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | 6 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `start()` | Método declarado | 14 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `setDevice(device)` | Método declarado | 20 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `nearest()` | Método declarado | 21 | Seleciona brinquedo elegível mais próximo do jogador para orientar coleta. |
| `finish()` | Método declarado | 26 | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | 31 | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `guidePosition()` | Método declarado | 45 | Retorna posição visual da fada acima do brinquedo-alvo do tutorial. |
| `message()` | Acessor | 50 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(ctx,canvas,frame)` | Método declarado | 65 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomTutorialContext.js

[Implementação](../src/js/toy-room/ToyRoomTutorialContext.js). Contratos exportados/reexportados: `createToyRoomTutorialContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomTutorialContext(room)` | Função | 4 | Expõe oito campos atuais ao tutorial; setters somente para conclusão e modo. |
| `mobilePresentation()` | Acessor | 6 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | 7 | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `fairy()` | Acessor | 8 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | 9 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraX()` | Acessor | 10 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraY()` | Acessor | 11 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted()` | Acessor | 12 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted(value)` | Acessor | 13 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState()` | Acessor | 14 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState(value)` | Acessor | 15 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomTutorialRenderer.js

[Implementação](../src/js/toy-room/ToyRoomTutorialRenderer.js). Contratos exportados/reexportados: `renderToyRoomTutorial`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToyRoomTutorial(ctx, canvas, frame, { fairy, cameraX, cameraY, message, step, device })` | Função | 5 | Desenha mensagens e ponteiro da orientação sem receber tutorial nem sala. |

## src/js/toy-room/ToyRoomUI.js

[Implementação](../src/js/toy-room/ToyRoomUI.js). Contratos exportados/reexportados: `ToyRoomUI`, `toyRoomUI`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderUI(ctx, canvas, state)` | Método declarado | 20 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomWorldQueries.js

[Implementação](../src/js/toy-room/ToyRoomWorldQueries.js). Contratos exportados/reexportados: `createToyRoomWorldQueries`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomWorldQueries({ getDimensions, getPlayer, resolvePosition, getCameraFrame, getCameraBounds })` | Função | 2 | Cria consultas de piso/viewport com acessos explícitos às referências atuais. |
| `distance(a, b)` | Função atribuída | 3 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isFree(point, radius = 24)` | Função | 5 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `reachableFloor()` | Função | 10 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `viewport(frame = getCameraFrame())` | Função | 43 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/index.js

[Implementação](../src/js/toy-room/index.js). Contratos exportados/reexportados: `ToyRenderer`, `toyRenderer`, `RoomEnvironmentRenderer`, `roomEnvironmentRenderer`, `ToyRoomEntities`, `toyRoomEntities`, `ToyRoomUI`, `toyRoomUI`, `ToyRoomPhase`, `createToyRoom`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toyRoom.js

[Implementação](../src/js/toyRoom.js).

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/ui/DialogueRenderer.js

[Implementação](../src/js/ui/DialogueRenderer.js). Contratos exportados/reexportados: `DialogueRenderer`, `dialogueRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawPortrait(pCtx, charType, px, py, radius, mood = 'normal', tick = 0, options = {})` | Método declarado | 27 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapText(pCtx, text, maxWidth)` | Método declarado | 231 | Quebra texto conforme a largura medida pelo contexto. |
| `renderCutsceneDialogue(ctx, canvas, state = {}, options = {})` | Método declarado | 260 | Compõe falas, retratos, prompts e áreas seguras. |
| `renderDialogue(ctx, canvas, dialogue, options = {})` | Método declarado | 368 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialoguePortrait(pCtx, charType, px, py, radius, expression)` | Função atribuída | 374 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapDialogueText(pCtx, text, maxWidth)` | Função atribuída | 376 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/ui/DialogueSafeArea.js

[Implementação](../src/js/ui/DialogueSafeArea.js). Contratos exportados/reexportados: `intersectCanvasSafeArea`, `getDialogueSafeArea`, `getDialogueBoxY`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `intersectCanvasSafeArea(canvas, rect, viewport, insets = {})` | Função | 6 | Converte interseção viewport/canvas e insets em coordenadas do bitmap. |
| `getDialogueSafeArea(canvas)` | Função | 16 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDialogueBoxY(safe, height, originalMargin, anchor = {}, mobile = isMobileDevice())` | Função | 39 | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/ui/FirstJumpTutorial.js

[Implementação](../src/js/ui/FirstJumpTutorial.js). Contratos exportados/reexportados: `FIRST_JUMP_MESSAGES`, `getFirstJumpTutorialDevice`, `getFirstJumpFeedback`, `renderFirstJumpTutorial`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getFirstJumpTutorialDevice({ device, nav = globalThis.navigator, coarse } = {})` | Função | 10 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getFirstJumpFeedback(timeMs, reducedMotion = false)` | Função | 21 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `drawInputIcon(ctx, kind, x, y, unit, pulse)` | Função | 26 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFirstJumpTutorial(ctx, canvas, { state, baby, fairy, platform, cameraX, transform, device, timeMs = globalThis.performance?.now?.() \|\| 0, reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches \|\| false })` | Função | 52 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `project(x, y)` | Função atribuída | 61 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/ui/HudRenderer.js

[Implementação](../src/js/ui/HudRenderer.js). Contratos exportados/reexportados: `HudRenderer`, `hudRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderEscapeBanner(ctx, canvas, state = {}, cameraX = 0, baby = {})` | Método declarado | 21 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/ui/MobileDialogueRegion.js

[Implementação](../src/js/ui/MobileDialogueRegion.js). Contratos exportados/reexportados: `getMobileDialogueRegions`, `renderMobileDialogueRegion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getMobileDialogueRegions(safe, contentHeight)` | Função | 6 | Divide a área segura entre cena e painel de texto. |
| `renderMobileDialogueRegion(ctx, canvas, safe, contentHeight, anchor = {})` | Função | 22 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/ui/MobileUILayout.js

[Implementação](../src/js/ui/MobileUILayout.js). Contratos exportados/reexportados: `calculateMobileUILayout`, `getMobileUILayout`, `isActionControlHit`, `arenaMobileControlsLayout`, `hitArenaMobileControl`, `arenaDirectionVector`, `attachMobileUILayout`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | 4 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `calculateMobileUILayout(canvas, safe, scale = 1, mobile = true)` | Função | 7 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `contains(x, y)` | API/lambda de objeto | 22 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `joystickOrigin(x, y)` | API/lambda de objeto | 23 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getMobileUILayout(canvas)` | Função | 29 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isActionControlHit(layout, x, y)` | Função | 35 | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `arenaMobileControlsLayout(layout)` | Função | 40 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `hitArenaMobileControl(layout, x, y)` | Função | 66 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaDirectionVector(layout,x,y)` | Função | 86 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attachMobileUILayout(canvas, host = window)` | Função | 96 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update()` | Função atribuída | 97 | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/ui/TitleScene.js

[Implementação](../src/js/ui/TitleScene.js). Contratos exportados/reexportados: `TitleScene`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, overlay)` | Método declarado | 6 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | 19 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sync()` | Método declarado | 32 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tick(time)` | Método declarado | 42 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `leg(ctx, source, knee, angle, scale, origin)` | Método declarado | 50 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(time)` | Método declarado | 58 | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | 77 | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/ui/TitleScreen.js

[Implementação](../src/js/ui/TitleScreen.js). Contratos exportados/reexportados: `TitleScreen`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ game, onNew, onLoad })` | Método declarado | 6 | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `refresh()` | Método declarado | 31 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setEasy(enabled)` | Método declarado | 40 | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `requestNew()` | Método declarado | 47 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `navigate(event)` | Método declarado | 54 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `activateFocused()` | Método declarado | 63 | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/ui/index.js

[Implementação](../src/js/ui/index.js). Contratos exportados/reexportados: `HudRenderer`, `hudRenderer`, `DialogueRenderer`, `dialogueRenderer`, `renderFirstJumpTutorial`, `getFirstJumpFeedback`, `getFirstJumpTutorialDevice`, `FIRST_JUMP_MESSAGES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

Inventário: **148 módulos JavaScript**, **993 declarações nomeadas**.
