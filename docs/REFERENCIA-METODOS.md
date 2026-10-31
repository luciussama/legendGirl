# Referência de métodos e funções

Inventário de `src/js`, gerado a partir da cópia local. Consulte [arquitetura e entidades](ARQUITETURA.md), o [manual](MANUAL-DESENVOLVIMENTO.md) e os [comandos](COMANDOS.md).

As linhas referem-se ao snapshot local e mudam após edições. O inventário inclui funções, métodos, acessores e funções atribuídas com parâmetros entre parênteses, além dos contratos exportados/reexports. Não é um parser completo: callbacks anônimos e algumas lambdas de parâmetro simples não são declarações separadas aqui; funções exportadas continuam enumeradas no módulo. APIs de fábricas e proprietários de estado estão documentados na arquitetura e no manual. A presença de uma função interna não a torna pública.

Regenerar na raiz: `node scripts/generate-method-reference.js`. Revise também as descrições e o manual após mudar contratos.

## src/js/assets/AssetManager.js

[Implementação](../src/js/assets/AssetManager.js). Contratos exportados/reexportados: `AssetManager`, `createAssetManager`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [4](../src/js/assets/AssetManager.js#L4) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `loadManifest(url = this.manifestUrl)` | Método declarado | [13](../src/js/assets/AssetManager.js#L13) | Busca manifesto e atualiza status; rejeita falha. |
| `preload()` | Método declarado | [36](../src/js/assets/AssetManager.js#L36) | Pré-carrega entradas de imagens do manifesto. |
| `loadImage(key, source)` | Método declarado | [42](../src/js/assets/AssetManager.js#L42) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `removeSolidBackground(image, background = 'light')` | Método declarado | [78](../src/js/assets/AssetManager.js#L78) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getRegion(key, region)` | Método declarado | [114](../src/js/assets/AssetManager.js#L114) | Valida limites e cacheia recorte do atlas. |
| `normalizeCharacterPalette(image)` | Método declarado | [147](../src/js/assets/AssetManager.js#L147) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `get(key)` | Método declarado | [169](../src/js/assets/AssetManager.js#L169) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `has(key)` | Método declarado | [173](../src/js/assets/AssetManager.js#L173) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getStatus(key)` | Método declarado | [177](../src/js/assets/AssetManager.js#L177) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isReady(key)` | Método declarado | [181](../src/js/assets/AssetManager.js#L181) | Consulta uma chave ou prontidão do manifesto; sem chave não certifica todas as imagens. |
| `clearRegionCache()` | Método declarado | [188](../src/js/assets/AssetManager.js#L188) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `createAssetManager(options)` | Função | [193](../src/js/assets/AssetManager.js#L193) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/assets/GirlLocomotionArt.js

[Implementação](../src/js/assets/GirlLocomotionArt.js). Contratos exportados/reexportados: `GIRL_LOCOMOTION_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/assets/currentScenery.js

[Implementação](../src/js/assets/currentScenery.js). Contratos exportados/reexportados: `CURRENT_SCENERY`, `drawCurrentScenery`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawCurrentScenery(ctx,assets,type,x,floorY)` | Função | [22](../src/js/assets/currentScenery.js#L22) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/assets/darkRoomAtlas.js

[Implementação](../src/js/assets/darkRoomAtlas.js). Contratos exportados/reexportados: `SHEET_WIDTH`, `SHEET_HEIGHT`, `SPRITESHEET_PATH`, `darkRoomAtlas`, `validateAtlasRegion`, `getDarkRoomAtlasRegion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `validateAtlasRegion(region, sheetW = SHEET_WIDTH, sheetH = SHEET_HEIGHT)` | Função | [280](../src/js/assets/darkRoomAtlas.js#L280) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getDarkRoomAtlasRegion(key)` | Função | [289](../src/js/assets/darkRoomAtlas.js#L289) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/assets/illustratedGirl.js

[Implementação](../src/js/assets/illustratedGirl.js). Contratos exportados/reexportados: `GIRL_V2_REFERENCE_HEIGHT`, `GIRL_V2_SETS`, `GIRL_V2_FRAMES`, `GIRL_V2_FOOT_BOUNDS`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

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
| `createAudioSystem()` | Função | [6](../src/js/audio.js#L6) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `getDestination()` | Função | [18](../src/js/audio.js#L18) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `updateMusicVolumes()` | Função | [32](../src/js/audio.js#L32) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `setMasterVolume(vol)` | Função | [42](../src/js/audio.js#L42) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | Função | [51](../src/js/audio.js#L51) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(muted)` | Função | [55](../src/js/audio.js#L55) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `toggleMute()` | Função | [65](../src/js/audio.js#L65) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getIsMuted()` | Função | [69](../src/js/audio.js#L69) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `registerActiveNode(node)` | Função | [79](../src/js/audio.js#L79) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cleanup()` | Função atribuída | [82](../src/js/audio.js#L82) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearActiveSounds()` | Função | [90](../src/js/audio.js#L90) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMusicTrack()` | Função | [102](../src/js/audio.js#L102) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `initAudio()` | Função | [134](../src/js/audio.js#L134) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startMusic()` | Função | [159](../src/js/audio.js#L159) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopMusic()` | Função | [179](../src/js/audio.js#L179) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stopAllAudio()` | Função | [189](../src/js/audio.js#L189) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playJumpSound()` | Função | [195](../src/js/audio.js#L195) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLongJumpSound(progress = 0)` | Função | [218](../src/js/audio.js#L218) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLevelUpChime(level = 0)` | Função | [255](../src/js/audio.js#L255) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOpeningAmbience()` | Função | [279](../src/js/audio.js#L279) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyVoiceBlip(freq = 920)` | Função | [297](../src/js/audio.js#L297) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyLaugh()` | Função | [320](../src/js/audio.js#L320) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playEscapePowerUp()` | Função | [348](../src/js/audio.js#L348) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFallFailSound()` | Função | [375](../src/js/audio.js#L375) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playTapeRipSound()` | Função | [398](../src/js/audio.js#L398) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDramaticTumbleSound()` | Função | [433](../src/js/audio.js#L433) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyThudSound()` | Função | [457](../src/js/audio.js#L457) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyShockVoice()` | Função | [480](../src/js/audio.js#L480) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyFrustratedSound()` | Função | [505](../src/js/audio.js#L505) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPhase3StartFanfare()` | Função | [529](../src/js/audio.js#L529) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `getToyRoomTrackUrls(track)` | Função | [560](../src/js/audio.js#L560) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getToyRoomAudioElement()` | Função | [570](../src/js/audio.js#L570) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setToyRoomMusicTrack(track)` | Função | [605](../src/js/audio.js#L605) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `startToyRoomMusic({ fade = 1 } = {})` | Função | [624](../src/js/audio.js#L624) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `setToyRoomMusicFade(value)` | Função | [649](../src/js/audio.js#L649) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setToyRoomMusicIntensity(value)` | Função | [654](../src/js/audio.js#L654) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPortalExitWhoosh()` | Função | [659](../src/js/audio.js#L659) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playSoftMagicBurst()` | Função | [676](../src/js/audio.js#L676) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopToyRoomMusic()` | Função | [691](../src/js/audio.js#L691) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | Função | [702](../src/js/audio.js#L702) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | Função | [719](../src/js/audio.js#L719) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playPickUpSound()` | Função | [735](../src/js/audio.js#L735) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDropSound()` | Função | [760](../src/js/audio.js#L760) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOrganizeChime()` | Função | [783](../src/js/audio.js#L783) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playToyRoomVictory()` | Função | [809](../src/js/audio.js#L809) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playCombatSound(event, arena = false)` | Função | [842](../src/js/audio.js#L842) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playArenaMusicBeat(beat)` | Função | [932](../src/js/audio.js#L932) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopArenaMusic()` | Função | [950](../src/js/audio.js#L950) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getAudioContext()` | API/lambda de objeto | [1000](../src/js/audio.js#L1000) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/bear-chase/BearChasePhase.js

[Implementação](../src/js/bear-chase/BearChasePhase.js). Contratos exportados/reexportados: `BearChasePhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ canvas, audio, enabled, difficulty = 'NORMAL', campaign = false, onCampaignError = null })` | Método declarado | [11](../src/js/bear-chase/BearChasePhase.js#L11) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `active()` | Acessor | [23](../src/js/bear-chase/BearChasePhase.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `start(saved = null)` | Método declarado | [25](../src/js/bear-chase/BearChasePhase.js#L25) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | [51](../src/js/bear-chase/BearChasePhase.js#L51) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [77](../src/js/bear-chase/BearChasePhase.js#L77) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `setPaused(value)` | Método declarado | [106](../src/js/bear-chase/BearChasePhase.js#L106) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `retry({ resume = false } = {})` | Método declarado | [110](../src/js/bear-chase/BearChasePhase.js#L110) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `snapshot()` | Método declarado | [124](../src/js/bear-chase/BearChasePhase.js#L124) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [126](../src/js/bear-chase/BearChasePhase.js#L126) | Reaplica a captura específica; confira referências e dados transitórios. |
| `destroy()` | Método declarado | [134](../src/js/bear-chase/BearChasePhase.js#L134) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseAudio.js

[Implementação](../src/js/bear-chase/ChaseAudio.js). Contratos exportados/reexportados: `ChaseAudio`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(audio)` | Método declarado | [8](../src/js/bear-chase/ChaseAudio.js#L8) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `unlock()` | Método declarado | [17](../src/js/bear-chase/ChaseAudio.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `step(actor, gap)` | Método declarado | [30](../src/js/bear-chase/ChaseAudio.js#L30) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(state)` | Método declarado | [45](../src/js/bear-chase/ChaseAudio.js#L45) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `stopSteps()` | Método declarado | [67](../src/js/bear-chase/ChaseAudio.js#L67) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Método declarado | [72](../src/js/bear-chase/ChaseAudio.js#L72) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [74](../src/js/bear-chase/ChaseAudio.js#L74) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [76](../src/js/bear-chase/ChaseAudio.js#L76) | Reaplica a captura específica; confira referências e dados transitórios. |
| `seek()` | Função atribuída | [78](../src/js/bear-chase/ChaseAudio.js#L78) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [82](../src/js/bear-chase/ChaseAudio.js#L82) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseBearAnimation.js

[Implementação](../src/js/bear-chase/ChaseBearAnimation.js). Contratos exportados/reexportados: `ChaseBearAnimation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(model)` | Método declarado | [6](../src/js/bear-chase/ChaseBearAnimation.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `legPose(leg, z, footY, hipHeight)` | Método declarado | [9](../src/js/bear-chase/ChaseBearAnimation.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state)` | Método declarado | [18](../src/js/bear-chase/ChaseBearAnimation.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseBearModel.js

[Implementação](../src/js/bear-chase/ChaseBearModel.js). Contratos exportados/reexportados: `ChaseBearModel`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(own, texture)` | Método declarado | [7](../src/js/bear-chase/ChaseBearModel.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `joint(parent, name, x, y, z)` | Método declarado | [70](../src/js/bear-chase/ChaseBearModel.js#L70) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `volume(parent, region, position, scale, tint = '#ffffff', rotation = [0,0,0])` | Método declarado | [75](../src/js/bear-chase/ChaseBearModel.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `seam(parent, points, radius)` | Método declarado | [84](../src/js/bear-chase/ChaseBearModel.js#L84) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ribbon(parent, side)` | Método declarado | [90](../src/js/bear-chase/ChaseBearModel.js#L90) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `collect(parent, source, region, tint)` | Método declarado | [104](../src/js/bear-chase/ChaseBearModel.js#L104) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `bake()` | Método declarado | [119](../src/js/bear-chase/ChaseBearModel.js#L119) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state)` | Método declarado | [136](../src/js/bear-chase/ChaseBearModel.js#L136) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseCamera.js

[Implementação](../src/js/bear-chase/ChaseCamera.js). Contratos exportados/reexportados: `chaseCameraFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `chaseCameraFrame(state, portrait, aspect)` | Função | [10](../src/js/bear-chase/ChaseCamera.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseConfig.js

[Implementação](../src/js/bear-chase/ChaseConfig.js). Contratos exportados/reexportados: `CHASE_CONFIG`, `clamp`, `damp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, low, high)` | Função | [12](../src/js/bear-chase/ChaseConfig.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `damp(from, to, speed, dt)` | Função | [15](../src/js/bear-chase/ChaseConfig.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseFairyModel.js

[Implementação](../src/js/bear-chase/ChaseFairyModel.js). Contratos exportados/reexportados: `ChaseFairyModel`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(own)` | Método declarado | [7](../src/js/bear-chase/ChaseFairyModel.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `wingGeometry()` | Método declarado | [52](../src/js/bear-chase/ChaseFairyModel.js#L52) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `flightOffset(time, target)` | Método declarado | [75](../src/js/bear-chase/ChaseFairyModel.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state, girlModel)` | Método declarado | [82](../src/js/bear-chase/ChaseFairyModel.js#L82) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseGirlAnimation.js

[Implementação](../src/js/bear-chase/ChaseGirlAnimation.js). Contratos exportados/reexportados: `ChaseGirlAnimation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(model)` | Método declarado | [7](../src/js/bear-chase/ChaseGirlAnimation.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `legPose(leg,z,y)` | Método declarado | [13](../src/js/bear-chase/ChaseGirlAnimation.js#L13) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state)` | Método declarado | [27](../src/js/bear-chase/ChaseGirlAnimation.js#L27) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fall(state)` | Método declarado | [75](../src/js/bear-chase/ChaseGirlAnimation.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseGirlModel.js

[Implementação](../src/js/bear-chase/ChaseGirlModel.js). Contratos exportados/reexportados: `ChaseGirlModel`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(own)` | Método declarado | [7](../src/js/bear-chase/ChaseGirlModel.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `batchDetails(parent)` | Método declarado | [58](../src/js/bear-chase/ChaseGirlModel.js#L58) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `shade(geometry)` | Método declarado | [78](../src/js/bear-chase/ChaseGirlModel.js#L78) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `joint(parent,name,x,y,z)` | Método declarado | [87](../src/js/bear-chase/ChaseGirlModel.js#L87) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `volume(parent,material,position,scale)` | Método declarado | [91](../src/js/bear-chase/ChaseGirlModel.js#L91) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `limb(parent,material,length,end,start)` | Método declarado | [95](../src/js/bear-chase/ChaseGirlModel.js#L95) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildSleeve(parent)` | Método declarado | [100](../src/js/bear-chase/ChaseGirlModel.js#L100) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cloth(parent,material,profile,full)` | Método declarado | [115](../src/js/bear-chase/ChaseGirlModel.js#L115) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `silhouette(parent,material,points,depth,position)` | Método declarado | [136](../src/js/bear-chase/ChaseGirlModel.js#L136) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sweep(parent,material,points,radii)` | Método declarado | [143](../src/js/bear-chase/ChaseGirlModel.js#L143) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildHair()` | Método declarado | [160](../src/js/bear-chase/ChaseGirlModel.js#L160) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `curveFringe(mesh)` | Método declarado | [188](../src/js/bear-chase/ChaseGirlModel.js#L188) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `bow(parent,position,size)` | Método declarado | [194](../src/js/bear-chase/ChaseGirlModel.js#L194) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildDressDetails()` | Método declarado | [203](../src/js/bear-chase/ChaseGirlModel.js#L203) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildFace()` | Método declarado | [217](../src/js/bear-chase/ChaseGirlModel.js#L217) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildSword()` | Método declarado | [228](../src/js/bear-chase/ChaseGirlModel.js#L228) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseGirlPalette.js

[Implementação](../src/js/bear-chase/ChaseGirlPalette.js). Contratos exportados/reexportados: `GIRL_PALETTE`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/bear-chase/ChaseHUD.js

[Implementação](../src/js/bear-chase/ChaseHUD.js). Contratos exportados/reexportados: `renderChaseHUD`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderLives(ctx, w, ui, state, difficulty)` | Função | [9](../src/js/bear-chase/ChaseHUD.js#L9) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderChaseHUD(ctx, canvas, state, error, audioError, difficulty = 'NORMAL')` | Função | [24](../src/js/bear-chase/ChaseHUD.js#L24) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/bear-chase/ChaseHealth.js

[Implementação](../src/js/bear-chase/ChaseHealth.js). Contratos exportados/reexportados: `CHASE_FALL_DURATION`, `chaseMaxLives`, `chaseLives`, `isChaseDefeat`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `chaseMaxLives(difficulty = 'NORMAL')` | Função | [5](../src/js/bear-chase/ChaseHealth.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chaseLives(state, difficulty = 'NORMAL')` | Função | [8](../src/js/bear-chase/ChaseHealth.js#L8) | Deriva as vidas restantes dos impactos e do limite da dificuldade. |
| `isChaseDefeat(stage)` | Função | [13](../src/js/bear-chase/ChaseHealth.js#L13) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/bear-chase/ChaseInput.js

[Implementação](../src/js/bear-chase/ChaseInput.js). Contratos exportados/reexportados: `ChaseInput`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, enabled, unlock)` | Método declarado | [6](../src/js/bear-chase/ChaseInput.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `install()` | Método declarado | [14](../src/js/bear-chase/ChaseInput.js#L14) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onKeyDown(event)` | Método declarado | [26](../src/js/bear-chase/ChaseInput.js#L26) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onKeyUp(event)` | Método declarado | [33](../src/js/bear-chase/ChaseInput.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onPointer(event)` | Método declarado | [35](../src/js/bear-chase/ChaseInput.js#L35) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onRelease(event)` | Método declarado | [45](../src/js/bear-chase/ChaseInput.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sample()` | Método declarado | [47](../src/js/bear-chase/ChaseInput.js#L47) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clear()` | Método declarado | [63](../src/js/bear-chase/ChaseInput.js#L63) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `destroy()` | Método declarado | [70](../src/js/bear-chase/ChaseInput.js#L70) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseIntroRenderer.js

[Implementação](../src/js/bear-chase/ChaseIntroRenderer.js). Contratos exportados/reexportados: `isChaseIntro`, `chaseIntroFade`, `ChaseIntroRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `isChaseIntro(stage)` | Função | [17](../src/js/bear-chase/ChaseIntroRenderer.js#L17) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `chaseIntroFade(state)` | Função | [22](../src/js/bear-chase/ChaseIntroRenderer.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor()` | Método declarado | [31](../src/js/bear-chase/ChaseIntroRenderer.js#L31) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [36](../src/js/bear-chase/ChaseIntroRenderer.js#L36) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `measureFrames(image, columns = [0, 490 / 1774, 920 / 1774, 1340 / 1774, 1], rows = [0, 505 / 887, 1])` | Método declarado | [49](../src/js/bear-chase/ChaseIntroRenderer.js#L49) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `picture(ctx, key, x, bottom, height)` | Método declarado | [82](../src/js/bear-chase/ChaseIntroRenderer.js#L82) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `backdrop(ctx, w, h)` | Método declarado | [88](../src/js/bear-chase/ChaseIntroRenderer.js#L88) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `floor(ctx, w, h, horizon, unit)` | Método declarado | [104](../src/js/bear-chase/ChaseIntroRenderer.js#L104) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actor(ctx, index, x, baseline, height, first, reaching = false)` | Método declarado | [121](../src/js/bear-chase/ChaseIntroRenderer.js#L121) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pose(canvas, state)` | Método declarado | [131](../src/js/bear-chase/ChaseIntroRenderer.js#L131) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(ctx, canvas, state)` | Método declarado | [151](../src/js/bear-chase/ChaseIntroRenderer.js#L151) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [172](../src/js/bear-chase/ChaseIntroRenderer.js#L172) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseLighting.js

[Implementação](../src/js/bear-chase/ChaseLighting.js). Contratos exportados/reexportados: `ChaseLighting`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(owner)` | Método declarado | [28](../src/js/bear-chase/ChaseLighting.js#L28) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `windowMask()` | Método declarado | [106](../src/js/bear-chase/ChaseLighting.js#L106) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resize(portrait)` | Método declarado | [133](../src/js/bear-chase/ChaseLighting.js#L133) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `place(light, s, x, height, targetS, targetX, targetHeight = 0)` | Método declarado | [160](../src/js/bear-chase/ChaseLighting.js#L160) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(state, portrait)` | Método declarado | [185](../src/js/bear-chase/ChaseLighting.js#L185) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `prepareObject(root)` | Método declarado | [234](../src/js/bear-chase/ChaseLighting.js#L234) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dispose()` | Método declarado | [247](../src/js/bear-chase/ChaseLighting.js#L247) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChasePacing.js

[Implementação](../src/js/bear-chase/ChasePacing.js). Contratos exportados/reexportados: `smoothProgress`, `chaseIntensity`, `chasePacing`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smoothProgress(value)` | Função | [4](../src/js/bear-chase/ChasePacing.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chaseIntensity(distance)` | Função | [10](../src/js/bear-chase/ChasePacing.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chasePacing(distance, difficulty = 'NORMAL')` | Função | [19](../src/js/bear-chase/ChasePacing.js#L19) | Deriva ritmo por progresso/dificuldade e fixa pares a cada segundo no final do NORMAL. |

## src/js/bear-chase/ChasePatterns.js

[Implementação](../src/js/bear-chase/ChasePatterns.js). Contratos exportados/reexportados: `chasePattern`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `chasePattern(progress, difficulty, safeLane)` | Função | [4](../src/js/bear-chase/ChasePatterns.js#L4) | Distribui brinquedos por progresso e dificuldade; no NORMAL usa até três objetos e pares finais com corredor amplo. |

## src/js/bear-chase/ChaseRenderer3D.js

[Implementação](../src/js/bear-chase/ChaseRenderer3D.js). Contratos exportados/reexportados: `ChaseRenderer3D`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `imageFile(path)` | Função | [20](../src/js/bear-chase/ChaseRenderer3D.js#L20) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor()` | Método declarado | [30](../src/js/bear-chase/ChaseRenderer3D.js#L30) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `own(resource)` | Método declarado | [46](../src/js/bear-chase/ChaseRenderer3D.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `texture(image, crop = null)` | Método declarado | [48](../src/js/bear-chase/ChaseRenderer3D.js#L48) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `floorTexture(image)` | Método declarado | [65](../src/js/bear-chase/ChaseRenderer3D.js#L65) | Prepara o recorte de madeira em DataTexture RGBA 256×64, com nove mipmaps explícitos e orientação preservada. |
| `floorIsVisible()` | Método declarado | [93](../src/js/bear-chase/ChaseRenderer3D.js#L93) | Renderiza uma amostra do piso fora da tela e confere o sinal de madeira na GPU. |
| `prepareFloor()` | Método declarado | [114](../src/js/bear-chase/ChaseRenderer3D.js#L114) | Valida o piso e tenta a mesma arte com filtro linear sem mipmaps quando necessário. |
| `prepareVisualResources()` | Método declarado | [127](../src/js/bear-chase/ChaseRenderer3D.js#L127) | Envia todos os mapas à GPU e aguarda compilação dos materiais antes de liberar a corrida. |
| `material(texture, color = '#ffffff')` | Método declarado | [142](../src/js/bear-chase/ChaseRenderer3D.js#L142) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mesh(parent, geometry, material, x, y, z)` | Método declarado | [147](../src/js/bear-chase/ChaseRenderer3D.js#L147) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actor(texture, width, height)` | Método declarado | [151](../src/js/bear-chase/ChaseRenderer3D.js#L151) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `load()` | Método declarado | [156](../src/js/bear-chase/ChaseRenderer3D.js#L156) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareRoomResources()` | Método declarado | [210](../src/js/bear-chase/ChaseRenderer3D.js#L210) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `placeOnRoute(object, distance, lateral, height=0, alignSlope=false)` | Método declarado | [214](../src/js/bear-chase/ChaseRenderer3D.js#L214) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateToys(state)` | Método declarado | [220](../src/js/bear-chase/ChaseRenderer3D.js#L220) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render(ctx, canvas, state)` | Método declarado | [247](../src/js/bear-chase/ChaseRenderer3D.js#L247) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `presentCamera(state, portrait)` | Método declarado | [282](../src/js/bear-chase/ChaseRenderer3D.js#L282) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [295](../src/js/bear-chase/ChaseRenderer3D.js#L295) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseRoom.js

[Implementação](../src/js/bear-chase/ChaseRoom.js). Contratos exportados/reexportados: `ChaseRoom`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(owner)` | Método declarado | [7](../src/js/bear-chase/ChaseRoom.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `surface(material,l0,h0,l1,h1,name)` | Método declarado | [35](../src/js/bear-chase/ChaseRoom.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `add(object,s,lateral,yaw,height=0,rug=false)` | Método declarado | [45](../src/js/bear-chase/ChaseRoom.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(distance)` | Método declarado | [55](../src/js/bear-chase/ChaseRoom.js#L55) | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/bear-chase/ChaseRoute.js

[Implementação](../src/js/bear-chase/ChaseRoute.js). Contratos exportados/reexportados: `ROUTE_NODES`, `routeFrame`, `routePoint`, `ROUTE_AMBUSHES`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `coordinate(s, axis)` | Função | [8](../src/js/bear-chase/ChaseRoute.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `routeFrame(s)` | Função | [17](../src/js/bear-chase/ChaseRoute.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `routePoint(s,lateral=0,height=0)` | Função | [25](../src/js/bear-chase/ChaseRoute.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseSimulation.js

[Implementação](../src/js/bear-chase/ChaseSimulation.js). Contratos exportados/reexportados: `createChaseState`, `restoreChaseState`, `hitsObstacle`, `stepChase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createChaseState()` | Função | [11](../src/js/bear-chase/ChaseSimulation.js#L11) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `restoreChaseState(saved)` | Função | [20](../src/js/bear-chase/ChaseSimulation.js#L20) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `random(state)` | Função | [43](../src/js/bear-chase/ChaseSimulation.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `hitsObstacle(obstacle, fromX, toX, fromZ, toZ)` | Função | [49](../src/js/bear-chase/ChaseSimulation.js#L49) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dropPattern(state, events, pacing, speed, ambushZ = null, difficulty = 'NORMAL')` | Função | [56](../src/js/bear-chase/ChaseSimulation.js#L56) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `followFairy(state, dt)` | Função | [86](../src/js/bear-chase/ChaseSimulation.js#L86) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `advanceStage(state, events)` | Função | [94](../src/js/bear-chase/ChaseSimulation.js#L94) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stepChase(state, input, dt = C.step, difficulty = 'NORMAL')` | Função | [105](../src/js/bear-chase/ChaseSimulation.js#L105) | Avança o domínio em segundos: sequência, movimento, colisão, vidas, lançamentos e eventos. |

## src/js/bear-chase/ChaseToyModels.js

[Implementação](../src/js/bear-chase/ChaseToyModels.js). Contratos exportados/reexportados: `ChaseToyModels`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(catalog)` | Método declarado | [4](../src/js/bear-chase/ChaseToyModels.js#L4) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `train()` | Método declarado | [6](../src/js/bear-chase/ChaseToyModels.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/BlockCastleProp.js

[Implementação](../src/js/bear-chase/props/BlockCastleProp.js). Contratos exportados/reexportados: `BlockCastleProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [7](../src/js/bear-chase/props/BlockCastleProp.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `centralWall(parts, orange, yellow, green)` | Método declarado | [33](../src/js/bear-chase/props/BlockCastleProp.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `portal(parts, material, position, width, height, depth, radius, openingHeight)` | Método declarado | [60](../src/js/bear-chase/props/BlockCastleProp.js#L60) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | [72](../src/js/bear-chase/props/BlockCastleProp.js#L72) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/BlocksProp.js

[Implementação](../src/js/bear-chase/props/BlocksProp.js). Contratos exportados/reexportados: `BlocksProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [7](../src/js/bear-chase/props/BlocksProp.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | [28](../src/js/bear-chase/props/BlocksProp.js#L28) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/BookshelfProp.js

[Implementação](../src/js/bear-chase/props/BookshelfProp.js). Contratos exportados/reexportados: `BookshelfProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [6](../src/js/bear-chase/props/BookshelfProp.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | [32](../src/js/bear-chase/props/BookshelfProp.js#L32) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/BunnyProp.js

[Implementação](../src/js/bear-chase/props/BunnyProp.js). Contratos exportados/reexportados: `BunnyProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [7](../src/js/bear-chase/props/BunnyProp.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `ellipsoid(parts, material, position, scale, tilt = 0)` | Método declarado | [38](../src/js/bear-chase/props/BunnyProp.js#L38) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | [43](../src/js/bear-chase/props/BunnyProp.js#L43) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/ChasePropCatalog.js

[Implementação](../src/js/bear-chase/props/ChasePropCatalog.js). Contratos exportados/reexportados: `ChasePropCatalog`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(images, externalResources = null)` | Método declarado | [15](../src/js/bear-chase/props/ChasePropCatalog.js#L15) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `register(id, factory, reference, rotation = 0, scale = 1)` | Método declarado | [29](../src/js/bear-chase/props/ChasePropCatalog.js#L29) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create(id)` | Método declarado | [37](../src/js/bear-chase/props/ChasePropCatalog.js#L37) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `release(root)` | Método declarado | [44](../src/js/bear-chase/props/ChasePropCatalog.js#L44) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dispose()` | Método declarado | [46](../src/js/bear-chase/props/ChasePropCatalog.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/ChasePropResources.js

[Implementação](../src/js/bear-chase/props/ChasePropResources.js). Contratos exportados/reexportados: `ChasePropResources`, `PropParts`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(woodImage, externalResources = null, pictorialImages = {})` | Método declarado | [7](../src/js/bear-chase/props/ChasePropResources.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `own(resource)` | Método declarado | [13](../src/js/bear-chase/props/ChasePropResources.js#L13) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `woodTexture(painted)` | Método declarado | [15](../src/js/bear-chase/props/ChasePropResources.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fabricTexture(image)` | Método declarado | [30](../src/js/bear-chase/props/ChasePropResources.js#L30) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `material(name, color, wood = false, texture = null)` | Método declarado | [43](../src/js/bear-chase/props/ChasePropResources.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pictorialMaterial(asset, region, tint = '#ffffff')` | Método declarado | [52](../src/js/bear-chase/props/ChasePropResources.js#L52) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fabricRegion(image)` | Método declarado | [72](../src/js/bear-chase/props/ChasePropResources.js#L72) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `bake(parts, name, combineAtlas = false)` | Método declarado | [79](../src/js/bear-chase/props/ChasePropResources.js#L79) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `combinedMaterial(source)` | Método declarado | [113](../src/js/bear-chase/props/ChasePropResources.js#L113) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dispose()` | Método declarado | [125](../src/js/bear-chase/props/ChasePropResources.js#L125) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor()` | Método declarado | [134](../src/js/bear-chase/props/ChasePropResources.js#L134) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `add(geometry, material, position, rotation = [0, 0, 0])` | Método declarado | [136](../src/js/bear-chase/props/ChasePropResources.js#L136) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `box(material, position, size, radius = .015)` | Método declarado | [140](../src/js/bear-chase/props/ChasePropResources.js#L140) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cylinder(material, position, top, bottom, height, rotation = [0, 0, 0], segments = 20, axialGrain = false)` | Método declarado | [161](../src/js/bear-chase/props/ChasePropResources.js#L161) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ring(material, position, radius, tube, rotation = [0, 0, 0])` | Método declarado | [170](../src/js/bear-chase/props/ChasePropResources.js#L170) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/DecorativeGeometry.js

[Implementação](../src/js/bear-chase/props/DecorativeGeometry.js). Contratos exportados/reexportados: `oval`, `profile`, `rounded`, `curve`, `rod`, `outline`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `oval(p,m,at,size,rotation=[0,0,0])` | Função | [4](../src/js/bear-chase/props/DecorativeGeometry.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `profile(p,m,shape,depth,at=[0,0,0],bevel=.012)` | Função | [8](../src/js/bear-chase/props/DecorativeGeometry.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rounded(p,m,at,size,radius=.05,bevel=.012)` | Função | [20](../src/js/bear-chase/props/DecorativeGeometry.js#L20) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `curve(p,m,points,radius=.012,closed=false)` | Função | [27](../src/js/bear-chase/props/DecorativeGeometry.js#L27) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rod(p,m,a,b,r=.018)` | Função | [32](../src/js/bear-chase/props/DecorativeGeometry.js#L32) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `outline(commands)` | Função | [38](../src/js/bear-chase/props/DecorativeGeometry.js#L38) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/DecorativeProps.js

[Implementação](../src/js/bear-chase/props/DecorativeProps.js). Contratos exportados/reexportados: `decorativeFactories`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `teddy(p,m)` | Função | [6](../src/js/bear-chase/props/DecorativeProps.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `robot(p,m)` | Função | [21](../src/js/bear-chase/props/DecorativeProps.js#L21) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `duck(p,m)` | Função | [42](../src/js/bear-chase/props/DecorativeProps.js#L42) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drum(p,m)` | Função | [57](../src/js/bear-chase/props/DecorativeProps.js#L57) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `jack(p,m)` | Função | [65](../src/js/bear-chase/props/DecorativeProps.js#L65) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `armchair(p,m)` | Função | [84](../src/js/bear-chase/props/DecorativeProps.js#L84) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `horse(p,m)` | Função | [103](../src/js/bear-chase/props/DecorativeProps.js#L103) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `table(p,m)` | Função | [131](../src/js/bear-chase/props/DecorativeProps.js#L131) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `decorativeFactories(resources)` | Função | [140](../src/js/bear-chase/props/DecorativeProps.js#L140) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mat(region,tint)` | Função atribuída | [141](../src/js/bear-chase/props/DecorativeProps.js#L141) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/OakCabinetProp.js

[Implementação](../src/js/bear-chase/props/OakCabinetProp.js). Contratos exportados/reexportados: `OakCabinetProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [6](../src/js/bear-chase/props/OakCabinetProp.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | [48](../src/js/bear-chase/props/OakCabinetProp.js#L48) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

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
| `constructor(resources)` | Método declarado | [7](../src/js/bear-chase/props/ToyChestProp.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `sidePanel(parts, material, x)` | Método declarado | [40](../src/js/bear-chase/props/ToyChestProp.js#L40) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `inscription(resources)` | Método declarado | [51](../src/js/bear-chase/props/ToyChestProp.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | [68](../src/js/bear-chase/props/ToyChestProp.js#L68) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/TrainProp.js

[Implementação](../src/js/bear-chase/props/TrainProp.js). Contratos exportados/reexportados: `TrainProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [6](../src/js/bear-chase/props/TrainProp.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | [51](../src/js/bear-chase/props/TrainProp.js#L51) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/chapters/ChapterArt.js

[Implementação](../src/js/chapters/ChapterArt.js). Contratos exportados/reexportados: `CHAPTER_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/chapters/ChapterCard.js

[Implementação](../src/js/chapters/ChapterCard.js). Contratos exportados/reexportados: `renderChapterCard`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderChapterCard(ctx,canvas,{image,number,title,age=0,duration=5,onAdvance}={})` | Função | [5](../src/js/chapters/ChapterCard.js#L5) | Desenha a gravura e o título na área segura; registra avanço da leitura sem avançar a fase por trás. |

## src/js/chapters/ToyRoomEpilogue.js

[Implementação](../src/js/chapters/ToyRoomEpilogue.js). Contratos exportados/reexportados: `TOY_ROOM_EPILOGUE`, `ToyRoomEpilogue`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `beat()` | Acessor | [21](../src/js/chapters/ToyRoomEpilogue.js#L21) | Consulta o quadro corrente de TOY_ROOM_EPILOGUE sem avançar a sequência. |
| `drawGirl(index,alpha)` | Função atribuída | [38](../src/js/chapters/ToyRoomEpilogue.js#L38) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/cinematics/OpeningSequence.js

[Implementação](../src/js/cinematics/OpeningSequence.js). Contratos exportados/reexportados: `OPENING_STORAGE_KEY`, `OPENING_DIALOGUE`, `OpeningSequence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({storage, onReveal = () => {}, onComplete = () => {}, onCue = () => {}} = {})` | Método declarado | [22](../src/js/cinematics/OpeningSequence.js#L22) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `hasCompleted()` | Método declarado | [32](../src/js/cinematics/OpeningSequence.js#L32) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `start({ replay = false } = {})` | Método declarado | [37](../src/js/cinematics/OpeningSequence.js#L37) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `cancel()` | Método declarado | [45](../src/js/cinematics/OpeningSequence.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reset()` | Método declarado | [46](../src/js/cinematics/OpeningSequence.js#L46) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [50](../src/js/cinematics/OpeningSequence.js#L50) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [53](../src/js/cinematics/OpeningSequence.js#L53) | Reaplica a captura específica; confira referências e dados transitórios. |
| `advanceDialogue()` | Método declarado | [61](../src/js/cinematics/OpeningSequence.js#L61) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `revealing()` | Acessor | [68](../src/js/cinematics/OpeningSequence.js#L68) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [69](../src/js/cinematics/OpeningSequence.js#L69) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `renderFade(ctx, canvas)` | Método declarado | [88](../src/js/cinematics/OpeningSequence.js#L88) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `render(ctx, canvas, {assets, drawRoom, lighting, fairyRenderer})` | Método declarado | [95](../src/js/cinematics/OpeningSequence.js#L95) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/cinematics/ToyRoomIntroduction.js

[Implementação](../src/js/cinematics/ToyRoomIntroduction.js). Contratos exportados/reexportados: `TOY_ROOM_INTRO_STAGES`, `ToyRoomIntroduction`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ onComplete = () => {}, onEvent = () => {} } = {})` | Método declarado | [16](../src/js/cinematics/ToyRoomIntroduction.js#L16) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `start(context)` | Método declarado | [22](../src/js/cinematics/ToyRoomIntroduction.js#L22) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stage()` | Acessor | [30](../src/js/cinematics/ToyRoomIntroduction.js#L30) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [38](../src/js/cinematics/ToyRoomIntroduction.js#L38) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `advanceDialogue()` | Método declarado | [54](../src/js/cinematics/ToyRoomIntroduction.js#L54) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `prepare({ assets, phase, departure, audio })` | Método declarado | [61](../src/js/cinematics/ToyRoomIntroduction.js#L61) | Prepara contexto visual da introdução; consulte dependências no módulo. |
| `dialogue()` | Acessor | [71](../src/js/cinematics/ToyRoomIntroduction.js#L71) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraFrame(canvas)` | Método declarado | [83](../src/js/cinematics/ToyRoomIntroduction.js#L83) | Calcula enquadramento narrativo da introdução conforme etapa e relógio. |
| `fairyPosition()` | Método declarado | [109](../src/js/cinematics/ToyRoomIntroduction.js#L109) | Calcula posição visual da fada durante a introdução. |
| `drawGirl(ctx)` | Método declarado | [118](../src/js/cinematics/ToyRoomIntroduction.js#L118) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFairy(ctx)` | Método declarado | [135](../src/js/cinematics/ToyRoomIntroduction.js#L135) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `render(ctx, canvas)` | Método declarado | [152](../src/js/cinematics/ToyRoomIntroduction.js#L152) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialogue(ctx, canvas, text)` | Método declarado | [181](../src/js/cinematics/ToyRoomIntroduction.js#L181) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `cancel()` | Método declarado | [185](../src/js/cinematics/ToyRoomIntroduction.js#L185) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/config.js

[Implementação](../src/js/config.js). Contratos exportados/reexportados: `DEBUG_COLLISIONS`, `GAME_CONFIG`, `FLOOR_Y`, `createBabyState`, `CUTSCENE_DIALOGUE`, `getApproachJumpSpeed`, `getEscapeStats`, `getPhase3Stats`, `createFairyState`, `platforms`, `exitDoor`, `phase3Platforms`, `trueExitDoor`, `roomScenery`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createBabyState()` | Função | [12](../src/js/config.js#L12) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `getApproachJumpSpeed(platformIndex, difficulty = 'NORMAL')` | Função | [46](../src/js/config.js#L46) | Consulta o alcance fixo da aproximação por apoio e dificuldade, sem mirar pela posição do comando. |
| `getEscapeStats(level, difficulty = 'NORMAL')` | Função | [72](../src/js/config.js#L72) | Consulta impulso, corrida e efeitos da fuga; o alcance aéreo varia entre NORMAL e EASY. |
| `getPhase3Stats(level, fromFloor = false, difficulty = 'NORMAL')` | Função | [93](../src/js/config.js#L93) | Consulta atributos do retorno por nível e dificuldade; fromFloor distingue a entrada pelo chão. |
| `createFairyState()` | Função | [107](../src/js/config.js#L107) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/AndroidFraming.js

[Implementação](../src/js/controllers/AndroidFraming.js). Contratos exportados/reexportados: `androidFrameOffset`, `createAndroidFraming`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `androidFrameOffset({ enabled, height, cssHeight, bottomInset = 0, topInset = 0, feetY, topY })` | Função | [2](../src/js/controllers/AndroidFraming.js#L2) | Calcula elevação visual Android com reservas e proteção do topo. |
| `createAndroidFraming(canvas)` | Função | [12](../src/js/controllers/AndroidFraming.js#L12) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `offset(feetY, topY)` | Método declarado | [24](../src/js/controllers/AndroidFraming.js#L24) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/AudioController.js

[Implementação](../src/js/controllers/AudioController.js). Contratos exportados/reexportados: `AudioController`, `createAudioController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [10](../src/js/controllers/AudioController.js#L10) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `init()` | Método declarado | [24](../src/js/controllers/AudioController.js#L24) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handleVisibilityChange()` | Método declarado | [34](../src/js/controllers/AudioController.js#L34) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleWindowBlur()` | Método declarado | [43](../src/js/controllers/AudioController.js#L43) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleWindowFocus()` | Método declarado | [49](../src/js/controllers/AudioController.js#L49) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onBackground()` | Método declarado | [55](../src/js/controllers/AudioController.js#L55) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onForeground()` | Método declarado | [68](../src/js/controllers/AudioController.js#L68) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setMasterVolume(volume)` | Método declarado | [84](../src/js/controllers/AudioController.js#L84) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | Método declarado | [91](../src/js/controllers/AudioController.js#L91) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getAudioContext()` | Método declarado | [99](../src/js/controllers/AudioController.js#L99) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(muted)` | Método declarado | [103](../src/js/controllers/AudioController.js#L103) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `isMuted()` | Método declarado | [111](../src/js/controllers/AudioController.js#L111) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | Método declarado | [115](../src/js/controllers/AudioController.js#L115) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `initAudio()` | Método declarado | [120](../src/js/controllers/AudioController.js#L120) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startMusic()` | Método declarado | [126](../src/js/controllers/AudioController.js#L126) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `playOpeningAmbience()` | Método declarado | [132](../src/js/controllers/AudioController.js#L132) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startMusicBox()` | Método declarado | [134](../src/js/controllers/AudioController.js#L134) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopMusic()` | Método declarado | [140](../src/js/controllers/AudioController.js#L140) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stopAllAudio()` | Método declarado | [146](../src/js/controllers/AudioController.js#L146) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearActiveSounds()` | Método declarado | [152](../src/js/controllers/AudioController.js#L152) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playJumpSound()` | Método declarado | [158](../src/js/controllers/AudioController.js#L158) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLongJumpSound(progress)` | Método declarado | [164](../src/js/controllers/AudioController.js#L164) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLevelUpChime(level)` | Método declarado | [170](../src/js/controllers/AudioController.js#L170) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyVoiceBlip(freq)` | Método declarado | [176](../src/js/controllers/AudioController.js#L176) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyLaugh()` | Método declarado | [182](../src/js/controllers/AudioController.js#L182) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playEscapePowerUp()` | Método declarado | [188](../src/js/controllers/AudioController.js#L188) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFallFailSound()` | Método declarado | [194](../src/js/controllers/AudioController.js#L194) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playTapeRipSound()` | Método declarado | [200](../src/js/controllers/AudioController.js#L200) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDramaticTumbleSound()` | Método declarado | [206](../src/js/controllers/AudioController.js#L206) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyThudSound()` | Método declarado | [212](../src/js/controllers/AudioController.js#L212) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyShockVoice()` | Método declarado | [218](../src/js/controllers/AudioController.js#L218) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyFrustratedSound()` | Método declarado | [224](../src/js/controllers/AudioController.js#L224) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPhase3StartFanfare()` | Método declarado | [230](../src/js/controllers/AudioController.js#L230) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setToyRoomMusicFade(value)` | Método declarado | [236](../src/js/controllers/AudioController.js#L236) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setToyRoomMusicIntensity(value)` | Método declarado | [237](../src/js/controllers/AudioController.js#L237) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playArenaMusicBeat(beat)` | Método declarado | [238](../src/js/controllers/AudioController.js#L238) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopArenaMusic()` | Método declarado | [239](../src/js/controllers/AudioController.js#L239) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playArenaSound(event)` | Método declarado | [240](../src/js/controllers/AudioController.js#L240) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setToyRoomMusicTrack(track)` | Método declarado | [241](../src/js/controllers/AudioController.js#L241) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPortalExitWhoosh()` | Método declarado | [246](../src/js/controllers/AudioController.js#L246) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playSoftMagicBurst()` | Método declarado | [247](../src/js/controllers/AudioController.js#L247) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startToyRoomMusic(options)` | Método declarado | [249](../src/js/controllers/AudioController.js#L249) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopToyRoomMusic()` | Método declarado | [255](../src/js/controllers/AudioController.js#L255) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | Método declarado | [261](../src/js/controllers/AudioController.js#L261) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | Método declarado | [267](../src/js/controllers/AudioController.js#L267) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getToyRoomAudioElement()` | Método declarado | [273](../src/js/controllers/AudioController.js#L273) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `playPickUpSound()` | Método declarado | [280](../src/js/controllers/AudioController.js#L280) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDropSound()` | Método declarado | [286](../src/js/controllers/AudioController.js#L286) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOrganizeChime(streak)` | Método declarado | [292](../src/js/controllers/AudioController.js#L292) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playToyRoomVictory()` | Método declarado | [298](../src/js/controllers/AudioController.js#L298) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playCombatSound(event)` | Método declarado | [304](../src/js/controllers/AudioController.js#L304) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `destroy()` | Método declarado | [310](../src/js/controllers/AudioController.js#L310) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `createAudioController(options = {})` | Função | [322](../src/js/controllers/AudioController.js#L322) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/CameraController.js

[Implementação](../src/js/controllers/CameraController.js). Contratos exportados/reexportados: `CameraController`, `createCameraController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [10](../src/js/controllers/CameraController.js#L10) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `reset(x = 0, y = 0, zoom = 1.0)` | Método declarado | [20](../src/js/controllers/CameraController.js#L20) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setZoom(zoom, immediate = false)` | Método declarado | [28](../src/js/controllers/CameraController.js#L28) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setPosition(x, y, immediate = false)` | Método declarado | [35](../src/js/controllers/CameraController.js#L35) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `update(dt, state, canvas, callbacks = {})` | Método declarado | [53](../src/js/controllers/CameraController.js#L53) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `syncFromState(state)` | Método declarado | [178](../src/js/controllers/CameraController.js#L178) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncToState(state)` | Método declarado | [187](../src/js/controllers/CameraController.js#L187) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `applyTransform(ctx, canvas, baby, fairy, presentationY = this.y, presentationX = this.x, sourceX = this.x)` | Método declarado | [203](../src/js/controllers/CameraController.js#L203) | Compõe foco/zoom e diferença entre pose original e visual no contexto. |
| `createCameraController(options = {})` | Função | [218](../src/js/controllers/CameraController.js#L218) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/CameraPresentation.js

[Implementação](../src/js/controllers/CameraPresentation.js). Contratos exportados/reexportados: `getDarkRoomScrollFrame`, `getPhase3ScrollFrame`, `CameraPresentation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getDarkRoomScrollFrame({ x, width, height })` | Função | [4](../src/js/controllers/CameraPresentation.js#L4) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getPhase3ScrollFrame(viewport)` | Função | [12](../src/js/controllers/CameraPresentation.js#L12) | Calcula a rolagem visual do retorno pelo progresso horizontal do cenário, sem seguir salto ou pouso. |
| `constructor()` | Método declarado | [18](../src/js/controllers/CameraPresentation.js#L18) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `reset()` | Método declarado | [19](../src/js/controllers/CameraPresentation.js#L19) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [20](../src/js/controllers/CameraPresentation.js#L20) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [21](../src/js/controllers/CameraPresentation.js#L21) | Reaplica a captura específica; confira referências e dados transitórios. |
| `mobileFrame({ target, enabled, stable, anticipate, tick, width, height, fixed = false })` | Método declarado | [23](../src/js/controllers/CameraPresentation.js#L23) | Interpola entrada do enquadramento móvel. |
| `step(from, to, dimension)` | Função atribuída | [43](../src/js/controllers/CameraPresentation.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame({ x, y, active, narrative, tick, width, height, cssWidth, cssHeight, zoom })` | Método declarado | [54](../src/js/controllers/CameraPresentation.js#L54) | Calcula pose visual estável sem escrever na simulação. |
| `move(from, to, dimension, cssDimension)` | Função atribuída | [62](../src/js/controllers/CameraPresentation.js#L62) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/EscapeFairyGuide.js

[Implementação](../src/js/controllers/EscapeFairyGuide.js). Contratos exportados/reexportados: `getEscapeGuideTarget`, `updateEscapeFairyGuide`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getEscapeGuideTarget(baby, platforms, exitDoor)` | Função | [2](../src/js/controllers/EscapeFairyGuide.js#L2) | Seleciona centro de chegada do próximo apoio ou porta. |
| `updateEscapeFairyGuide(fairy, target, dt = 1)` | Função | [12](../src/js/controllers/EscapeFairyGuide.js#L12) | Atualiza posição/velocidade da guia com amortecimento crítico. |

## src/js/controllers/InputController.js

[Implementação](../src/js/controllers/InputController.js). Contratos exportados/reexportados: `InputController`, `bindInput`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(game, options = {})` | Método declarado | [8](../src/js/controllers/InputController.js#L8) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `init()` | Método declarado | [28](../src/js/controllers/InputController.js#L28) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `triggerJump(source)` | Método declarado | [38](../src/js/controllers/InputController.js#L38) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handlePointerDown(event)` | Método declarado | [63](../src/js/controllers/InputController.js#L63) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyDown(event)` | Método declarado | [103](../src/js/controllers/InputController.js#L103) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | [142](../src/js/controllers/InputController.js#L142) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gamepadLoop()` | Método declarado | [191](../src/js/controllers/InputController.js#L191) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGamepadPollingLoop()` | Método declarado | [197](../src/js/controllers/InputController.js#L197) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleGamepadDisconnected(event)` | Método declarado | [203](../src/js/controllers/InputController.js#L203) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `destroy()` | Método declarado | [210](../src/js/controllers/InputController.js#L210) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `bindInput(game)` | Função | [229](../src/js/controllers/InputController.js#L229) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pollGamepad()` | API/lambda de objeto | [233](../src/js/controllers/InputController.js#L233) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | API/lambda de objeto | [234](../src/js/controllers/InputController.js#L234) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/controllers/MobileZoom.js

[Implementação](../src/js/controllers/MobileZoom.js). Contratos exportados/reexportados: `isMobileDevice`, `getDarkRoomMobileFrame`, `getMobileZoomFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `isMobileDevice(nav = globalThis.navigator)` | Função | [2](../src/js/controllers/MobileZoom.js#L2) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDarkRoomMobileFrame({ width, height, cameraY, floorY, layout, anticipate = false })` | Função | [9](../src/js/controllers/MobileZoom.js#L9) | Calcula composição fixa por viewport/safe area, com envelope autorado de salto e rodapé reservado ao toque; não consulta atores. |
| `getMobileZoomFrame({ enabled, width, height, bounds, anchor, margin = 24, stable = false, anticipate = false })` | Função | [28](../src/js/controllers/MobileZoom.js#L28) | Retorna escala e translações de apresentação a partir dos limites/alvo. |
| `clamp(value, min, max)` | Função atribuída | [43](../src/js/controllers/MobileZoom.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/ViewportController.js

[Implementação](../src/js/controllers/ViewportController.js). Contratos exportados/reexportados: `createViewportController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createViewportController({ canvas, darkCanvas, lighting, host, onOrientation })` | Função | [2](../src/js/controllers/ViewportController.js#L2) | Cria resize com Canvas, iluminação, host e callback de orientação. |
| `resize()` | Função | [3](../src/js/controllers/ViewportController.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/debug/AtlasDebugger.js

[Implementação](../src/js/debug/AtlasDebugger.js). Contratos exportados/reexportados: `AtlasDebugger`, `createAtlasDebugger`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [10](../src/js/debug/AtlasDebugger.js#L10) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | [21](../src/js/debug/AtlasDebugger.js#L21) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `validateAllRegions()` | Método declarado | [28](../src/js/debug/AtlasDebugger.js#L28) | Confere recortes do atlas contra imagens carregadas. |
| `initDOM()` | Método declarado | [83](../src/js/debug/AtlasDebugger.js#L83) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toggle(forceState = null)` | Método declarado | [176](../src/js/debug/AtlasDebugger.js#L176) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Método declarado | [187](../src/js/debug/AtlasDebugger.js#L187) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `createAtlasDebugger(options)` | Função | [298](../src/js/debug/AtlasDebugger.js#L298) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/debug/CameraQaObserver.js

[Implementação](../src/js/debug/CameraQaObserver.js). Contratos exportados/reexportados: `createCameraQaObserver`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createCameraQaObserver({ host, snapshot })` | Função | [2](../src/js/debug/CameraQaObserver.js#L2) | Cria observador opcional ativado por cameraQa; lê snapshot sem alterar câmera. |
| `record(transform = null)` | Método declarado | [5](../src/js/debug/CameraQaObserver.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/dream-forest/DreamArt.js

[Implementação](../src/js/dream-forest/DreamArt.js). Contratos exportados/reexportados: `DREAM_CLIMB`, `DREAM_INSECTS`, `DREAM_PROFILES`, `DREAM_LEAF`, `DREAM_BEE`, `DREAM_SPIDER`, `DREAM_BRANCH`, `DREAM_CLIMB_CYCLE`, `DREAM_CLIMB_CONTACTS`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/dream-forest/DreamAudio.js

[Implementação](../src/js/dream-forest/DreamAudio.js). Contratos exportados/reexportados: `DreamAudio`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(host)` | Método declarado | [4](../src/js/dream-forest/DreamAudio.js#L4) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `scream()` | Método declarado | [6](../src/js/dream-forest/DreamAudio.js#L6) | Agenda vocalização sintetizada de susto com formantes, volume do host e descarte das vozes. |
| `selectTrack(state)` | Método declarado | [10](../src/js/dream-forest/DreamAudio.js#L10) | Seleciona a faixa do sonho ou do piquenique pelo estágio antes de restaurar a posição musical. |
| `update(state,paused=false)` | Método declarado | [12](../src/js/dream-forest/DreamAudio.js#L12) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `event(type)` | Método declarado | [13](../src/js/dream-forest/DreamAudio.js#L13) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/dream-forest/DreamBeetle.js

[Implementação](../src/js/dream-forest/DreamBeetle.js). Contratos exportados/reexportados: `prepareDreamBeetle`, `dreamBeetlePose`, `drawDreamBeetle`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `polygon(ctx,points)` | Função | [9](../src/js/dream-forest/DreamBeetle.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canvas(width,height)` | Função | [10](../src/js/dream-forest/DreamBeetle.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareDreamBeetle(image)` | Função | [12](../src/js/dream-forest/DreamBeetle.js#L12) | Recorta e mascara em cache cabeça e patas da pintura original, conservando o casco de apoio. |
| `dreamBeetlePose(time,energy=.3)` | Função | [19](../src/js/dream-forest/DreamBeetle.js#L19) | Calcula articulações contínuas de asas, patas e cabeça conforme o tempo e a energia do voo. |
| `part(ctx,p,angle)` | Função | [20](../src/js/dream-forest/DreamBeetle.js#L20) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawDreamBeetle(ctx,image,parts,frame,time)` | Função | [22](../src/js/dream-forest/DreamBeetle.js#L22) | Desenha asas membranosas e membros articulados em torno do dorso rígido usado pela física. |

## src/js/dream-forest/DreamClimb.js

[Implementação](../src/js/dream-forest/DreamClimb.js). Contratos exportados/reexportados: `dreamClimbContact`, `dreamClimbPose`, `drawDreamClimb`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(v,a,b)` | Função atribuída | [3](../src/js/dream-forest/DreamClimb.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dreamClimbContact(frame,y,side)` | Função | [5](../src/js/dream-forest/DreamClimb.js#L5) | Localiza o contato visual da mão na haste ou no contorno pintado do corpo do inseto, sem usar asas móveis. |
| `topContact(frame,x)` | Função | [12](../src/js/dream-forest/DreamClimb.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dreamClimbPose(player,frame)` | Função | [14](../src/js/dream-forest/DreamClimb.js#L14) | Escolhe quatro poses pela distância escalada e duas para chegar ao topo, com mão ancorada e inclinação do corpo. |
| `drawDreamClimb(ctx,image,state)` | Função | [23](../src/js/dream-forest/DreamClimb.js#L23) | Desenha Yuna pela âncora da mão e conserva a pintura inteira, sem mudar a física ou a pose no lombo. |

## src/js/dream-forest/DreamGlider.js

[Implementação](../src/js/dream-forest/DreamGlider.js). Contratos exportados/reexportados: `DREAM_GLIDE`, `dreamGlideRoute`, `DREAM_GLIDE_THORNS`, `dreamGliderPose`, `dreamGliderContact`, `beginDreamGlide`, `stepDreamGlide`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamGlideRoute(x)` | Função | [5](../src/js/dream-forest/DreamGlider.js#L5) | Interpola alturas para posicionar obstáculos; não dirige a personagem. |
| `dreamGliderPose(p)` | Função | [10](../src/js/dream-forest/DreamGlider.js#L10) | Compartilha âncora, escala e inclinação da pintura com a colisão. |
| `dreamGliderContact(p)` | Função | [12](../src/js/dream-forest/DreamGlider.js#L12) | Compara alfa opaco do planador e dos galhos próximos, ignorando névoa. |
| `beginDreamGlide(s)` | Função | [14](../src/js/dream-forest/DreamGlider.js#L14) | Prepara caminhada e checkpoint do lançamento no galho. |
| `stepDreamGlide(s,input,dt,branch,surface,events,finish)` | Função | [16](../src/js/dream-forest/DreamGlider.js#L16) | Integra caminhada, rajada, voo pesado, queda/reinício e pouso. |

## src/js/dream-forest/DreamGliderArt.js

[Implementação](../src/js/dream-forest/DreamGliderArt.js). Contratos exportados/reexportados: `DREAM_GLIDER_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/dream-forest/DreamGliderRenderer.js

[Implementação](../src/js/dream-forest/DreamGliderRenderer.js). Contratos exportados/reexportados: `drawDreamGlideThorns`, `drawDreamLaunchLeaf`, `drawDreamGlider`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawDreamGlideThorns(ctx,images,left,right,top,bottom)` | Função | [4](../src/js/dream-forest/DreamGliderRenderer.js#L4) | Desenha galhos espinhosos de cima/baixo sem indicadores de hitbox. |
| `drawDreamLaunchLeaf(ctx,images,branch,time)` | Função | [6](../src/js/dream-forest/DreamGliderRenderer.js#L6) | Apresenta a única folha ainda presa à ponta do galho. |
| `drawDreamGlider(ctx,images,state)` | Função | [8](../src/js/dream-forest/DreamGliderRenderer.js#L8) | Desenha menina e folha como pintura íntegra com mãos conectadas. |

## src/js/dream-forest/DreamIllustratedSprites.js

[Implementação](../src/js/dream-forest/DreamIllustratedSprites.js). Contratos exportados/reexportados: `prepareDreamIllustrations`, `drawDreamLeaf`, `dreamBeeWingPose`, `drawDreamBee`, `drawDreamBranch`, `drawDreamWeb`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `canvas(width,height)` | Função | [3](../src/js/dream-forest/DreamIllustratedSprites.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sample(values,u)` | Função | [4](../src/js/dream-forest/DreamIllustratedSprites.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareDreamIllustrations(leafImage,branchImage)` | Função | [6](../src/js/dream-forest/DreamIllustratedSprites.js#L6) | Prepara em cache folhas e galhos pintados nas larguras existentes, registrados nas superfícies físicas. |
| `drawDreamLeaf(ctx,image,cache,f,bottom)` | Função | [22](../src/js/dream-forest/DreamIllustratedSprites.js#L22) | Desenha folha e caule ilustrados; prolonga a base abaixo do viewport sem alterar o apoio. |
| `dreamBeeWingPose(time)` | Função | [28](../src/js/dream-forest/DreamIllustratedSprites.js#L28) | Calcula abertura e rotação contínuas das asas da abelhinha do bem pelo relógio do sonho. |
| `drawDreamBee(ctx,image,f,time)` | Função | [30](../src/js/dream-forest/DreamIllustratedSprites.js#L30) | Pinta o corpo íntegro com cotonete e articula as asas como camada separada. |
| `drawDreamBranch(ctx,image,cache,f,bottom,top)` | Função | [37](../src/js/dream-forest/DreamIllustratedSprites.js#L37) | Pinta tronco ancorado e galho ao vento, registrado na superfície física sem linhas auxiliares. |
| `drawDreamWeb(ctx,image,f,time)` | Função | [43](../src/js/dream-forest/DreamIllustratedSprites.js#L43) | Desenha seda até a aranha móvel e sua pintura, compartilhando a posição da simulação. |

## src/js/dream-forest/DreamInput.js

[Implementação](../src/js/dream-forest/DreamInput.js). Contratos exportados/reexportados: `dreamControls`, `nightmareControls`, `dreamMobileWebInput`, `DreamInput`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamControls(canvas)` | Função | [6](../src/js/dream-forest/DreamInput.js#L6) | Posiciona os quatro comandos de direção/escalada e PULAR dentro da área segura. |
| `nightmareControls(canvas)` | Função | [9](../src/js/dream-forest/DreamInput.js#L9) | Distribui andar, mergulhar e pular em quatro botões inferiores com toque simultâneo. |
| `dreamMobileWebInput(state,input,{mobile=isMobileDevice(),seconds=1/60}={})` | Função | [12](../src/js/dream-forest/DreamInput.js#L12) | Somente em celular e teias: sobe até a altura de preparo com velocidade normal, preservando comandos manuais e entrada original nos outros casos. |
| `constructor(canvas,enabled,unlock,scene)` | Método declarado | [21](../src/js/dream-forest/DreamInput.js#L21) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `sample()` | Método declarado | [22](../src/js/dream-forest/DreamInput.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/dream-forest/DreamLevel.js

[Implementação](../src/js/dream-forest/DreamLevel.js). Contratos exportados/reexportados: `DREAM`, `DREAM_SECTIONS`, `DREAM_OBJECTS`, `DREAM_WIDTH`, `DREAM_BY_ID`, `dreamNearby`, `dreamObjectFrame`, `dreamGrassX`, `dreamSurface`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamNearby(left,right)` | Função | [49](../src/js/dream-forest/DreamLevel.js#L49) | Consulta células espaciais para limitar física e pintura à vizinhança, sem depender do viewport. |
| `dreamObjectFrame(o,time,rides={})` | Função | [51](../src/js/dream-forest/DreamLevel.js#L51) | Calcula o deslocamento determinístico de hastes e insetos a partir do relógio salvo. |
| `dreamGrassX(frame,y)` | Função | [70](../src/js/dream-forest/DreamLevel.js#L70) | Calcula a curva compartilhada da haste; a ponta recebe vento e o caule abaixo da lâmina mantém a base fixa. |
| `dreamSurface(frame,x,profiles={})` | Função | [72](../src/js/dream-forest/DreamLevel.js#L72) | Consulta relevo da folha ou perfil alfa nativo do inseto para apoiar os pés sem régua auxiliar. |

## src/js/dream-forest/DreamNightmare.js

[Implementação](../src/js/dream-forest/DreamNightmare.js). Contratos exportados/reexportados: `NIGHTMARE`, `NIGHTMARE_INTRO`, `NIGHTMARE_WAKE`, `NIGHTMARE_ROCKS`, `nightmarePatrol`, `nightmareLights`, `nightmareRayEnd`, `nightmareBeam`, `nightmareVisibility`, `beginDreamNightmare`, `migrateNightmare`, `nightmareReading`, `advanceNightmareDialogue`, `validateNightmare`, `stepDreamNightmare`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(x,a,b)` | Função atribuída | [17](../src/js/dream-forest/DreamNightmare.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `angleDifference(a,b)` | Função atribuída | [19](../src/js/dream-forest/DreamNightmare.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `nightmarePatrol(n,stage='STEALTH',age=0)` | Função | [22](../src/js/dream-forest/DreamNightmare.js#L22) | Deriva posição e mira da barata exclusivamente do relógio salvo. |
| `nightmareLights(n,difficulty='NORMAL',stage='STEALTH',age=0)` | Função | [29](../src/js/dream-forest/DreamNightmare.js#L29) | Converte os olhos medidos na pintura nas duas origens físicas de luz. |
| `nightmareRayEnd(light,angle,limit=NIGHTMARE.range)` | Função | [35](../src/js/dream-forest/DreamNightmare.js#L35) | Encontra a primeira interseção de um raio com as silhuetas opacas das pedras. |
| `nightmareBeam(light)` | Função | [50](../src/js/dream-forest/DreamNightmare.js#L50) | Monta o polígono de luz visível incluindo tangentes e sombras das pedras. |
| `nightmareVisibility(n,difficulty='NORMAL',{onlyLight=false}={})` | Função | [56](../src/js/dream-forest/DreamNightmare.js#L56) | Confere amostras opacas da pose atual e distingue corpo iluminado de abrigo real. |
| `beginDreamNightmare(s,{retry=false,checkpoint=0}={})` | Função | [64](../src/js/dream-forest/DreamNightmare.js#L64) | Cria o domínio do trecho final na queda ou na retomada da primeira pedra. |
| `migrateNightmare(s)` | Função | [70](../src/js/dream-forest/DreamNightmare.js#L70) | Migra o trecho curto e os saves intermediários para o terreno contínuo e exposição à luz. |
| `nightmareReading(s)` | Função | [78](../src/js/dream-forest/DreamNightmare.js#L78) | Identifica quadros adiáveis sem permitir saltar a captura final ou o susto inicial. |
| `advanceNightmareDialogue(s)` | Função | [80](../src/js/dream-forest/DreamNightmare.js#L80) | Adianta uma leitura da furtividade ou do despertar, consumindo apenas um quadro. |
| `validateNightmare(s)` | Função | [87](../src/js/dream-forest/DreamNightmare.js#L87) | Valida relógio, corpo, leitura e coerência do grito/despertar no save. |
| `stepDreamNightmare(s,input={},seconds=0)` | Função | [95](../src/js/dream-forest/DreamNightmare.js#L95) | Integra caminhada, luz/detecção, golpe fatal, captura autorada e despertar em subpassos. |

## src/js/dream-forest/DreamNightmareArt.js

[Implementação](../src/js/dream-forest/DreamNightmareArt.js). Contratos exportados/reexportados: `DREAM_NIGHTMARE_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/dream-forest/DreamNightmareRenderer.js

[Implementação](../src/js/dream-forest/DreamNightmareRenderer.js). Contratos exportados/reexportados: `DreamNightmareRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas,shared)` | Método declarado | [17](../src/js/dream-forest/DreamNightmareRenderer.js#L17) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [19](../src/js/dream-forest/DreamNightmareRenderer.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(s)` | Método declarado | [30](../src/js/dream-forest/DreamNightmareRenderer.js#L30) | Calcula pose visual estável sem escrever na simulação. |
| `girl(ctx,s)` | Método declarado | [32](../src/js/dream-forest/DreamNightmareRenderer.js#L32) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reach(ctx,s)` | Método declarado | [43](../src/js/dream-forest/DreamNightmareRenderer.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `forest(s,touch)` | Método declarado | [45](../src/js/dream-forest/DreamNightmareRenderer.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `wake(s)` | Método declarado | [90](../src/js/dream-forest/DreamNightmareRenderer.js#L90) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(s,{paused=false,touch=false,onAdvance=()=>{}}={})` | Método declarado | [101](../src/js/dream-forest/DreamNightmareRenderer.js#L101) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [102](../src/js/dream-forest/DreamNightmareRenderer.js#L102) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/dream-forest/DreamPhase.js

[Implementação](../src/js/dream-forest/DreamPhase.js). Contratos exportados/reexportados: `DreamPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({canvas,audio,enabled=()=>true,difficulty='NORMAL',campaign=false})` | Método declarado | [8](../src/js/dream-forest/DreamPhase.js#L8) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `active()` | Acessor | [9](../src/js/dream-forest/DreamPhase.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reading()` | Método declarado | [10](../src/js/dream-forest/DreamPhase.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `advanceDialogue()` | Método declarado | [11](../src/js/dream-forest/DreamPhase.js#L11) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `start(saved=null)` | Método declarado | [12](../src/js/dream-forest/DreamPhase.js#L12) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt=1)` | Método declarado | [13](../src/js/dream-forest/DreamPhase.js#L13) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [14](../src/js/dream-forest/DreamPhase.js#L14) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `setPaused(value)` | Método declarado | [15](../src/js/dream-forest/DreamPhase.js#L15) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [16](../src/js/dream-forest/DreamPhase.js#L16) | Produz captura recuperável do estado específico deste componente. |
| `retry()` | Método declarado | [17](../src/js/dream-forest/DreamPhase.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [18](../src/js/dream-forest/DreamPhase.js#L18) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/dream-forest/DreamRenderer.js

[Implementação](../src/js/dream-forest/DreamRenderer.js). Contratos exportados/reexportados: `DreamRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas)` | Método declarado | [18](../src/js/dream-forest/DreamRenderer.js#L18) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [19](../src/js/dream-forest/DreamRenderer.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(state)` | Método declarado | [21](../src/js/dream-forest/DreamRenderer.js#L21) | Calcula pose visual estável sem escrever na simulação. |
| `leaf(ctx,f,bottom=C.grassRoot)` | Método declarado | [23](../src/js/dream-forest/DreamRenderer.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stem(ctx,f,bottom)` | Método declarado | [25](../src/js/dream-forest/DreamRenderer.js#L25) | Desenha a continuação natural do caule abaixo do viewport, conectada à lâmina e sem régua auxiliar. |
| `grass(ctx,f,bottom=C.grassRoot)` | Método declarado | [27](../src/js/dream-forest/DreamRenderer.js#L27) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `insect(ctx,f,time)` | Método declarado | [28](../src/js/dream-forest/DreamRenderer.js#L28) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `girl(ctx,s)` | Método declarado | [29](../src/js/dream-forest/DreamRenderer.js#L29) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(state,{ready=true,error=null,paused=false,onAdvance=()=>{},touch=false}={})` | Método declarado | [32](../src/js/dream-forest/DreamRenderer.js#L32) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [57](../src/js/dream-forest/DreamRenderer.js#L57) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/dream-forest/DreamRoach.js

[Implementação](../src/js/dream-forest/DreamRoach.js). Contratos exportados/reexportados: `ROACH_JOINTS`, `prepareDreamRoach`, `dreamRoachPose`, `dreamRoachPoint`, `drawDreamRoach`, `drawDreamRoachReach`, `destroyDreamRoach`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `path(ctx,points)` | Função | [16](../src/js/dream-forest/DreamRoach.js#L16) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canvas(w,h)` | Função | [17](../src/js/dream-forest/DreamRoach.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `crop(image,polygon)` | Função | [18](../src/js/dream-forest/DreamRoach.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareDreamRoach(image)` | Função | [20](../src/js/dream-forest/DreamRoach.js#L20) | Prepara máscaras da pintura para doze segmentos de patas, cabeça e antenas, sem editar PNGs. |
| `dreamRoachPose(time,velocity=160)` | Função | [31](../src/js/dream-forest/DreamRoach.js#L31) | Deriva passadas em tripés, cabeça, antenas e oscilação corporal do relógio salvo. |
| `dreamRoachPoint(p,u,v,{head=false}={})` | Função | [33](../src/js/dream-forest/DreamRoach.js#L33) | Transforma os olhos pela mesma junta de cabeça usada na pintura e retorna a posição física. |
| `begin(ctx,p,rig)` | Função | [34](../src/js/dream-forest/DreamRoach.js#L34) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `leg(ctx,j,a,b)` | Função | [35](../src/js/dream-forest/DreamRoach.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawDreamRoach(ctx,rig,p,{reaching=false}={})` | Função | [37](../src/js/dream-forest/DreamRoach.js#L37) | Compõe a barata original com seis patas articuladas e investigação da cabeça e antenas. |
| `drawDreamRoachReach(ctx,rig,p,target,q)` | Função | [39](../src/js/dream-forest/DreamRoach.js#L39) | Resolve duas juntas da pata frontal até a menina durante golpe e captura. |
| `destroyDreamRoach(rig)` | Função | [41](../src/js/dream-forest/DreamRoach.js#L41) | Libera as superfícies de Canvas usadas pela barata articulada. |

## src/js/dream-forest/DreamSimulation.js

[Implementação](../src/js/dream-forest/DreamSimulation.js). Contratos exportados/reexportados: `DREAM_INTRO`, `createDreamState`, `restoreDreamState`, `advanceDreamDialogue`, `retryDream`, `stepDream`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createDreamRides()` | Função | [12](../src/js/dream-forest/DreamSimulation.js#L12) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `boardDreamBeetle(s,id,events)` | Função | [13](../src/js/dream-forest/DreamSimulation.js#L13) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `placeDreamCheckpoint(s)` | Função | [14](../src/js/dream-forest/DreamSimulation.js#L14) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createDreamState(difficulty='NORMAL')` | Função | [16](../src/js/dream-forest/DreamSimulation.js#L16) | Cria domínio5 do sonho: travessia aérea preservada e estado separado para furtividade, captura e despertar. |
| `restoreDreamState(saved,difficulty)` | Função | [18](../src/js/dream-forest/DreamSimulation.js#L18) | Valida estágio, números e IDs do sonho; reconstrói dados e conserva o bloqueio breve de reagarre, sem recursos de runtime. |
| `advanceDreamDialogue(s)` | Função | [47](../src/js/dream-forest/DreamSimulation.js#L47) | Adianta uma fala do sonho e consome o gesto antes de liberar movimento. |
| `retryDream(s)` | Função | [49](../src/js/dream-forest/DreamSimulation.js#L49) | Retoma uma folha e seus transportes; no pesadelo, retorna à primeira pedra sem repetir o voo. |
| `hitDreamSpider(s,near,events)` | Função | [51](../src/js/dream-forest/DreamSimulation.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stepDream(s,input={},seconds=0)` | Função | [62](../src/js/dream-forest/DreamSimulation.js#L62) | Avança subpassos1/120s: vento, aderência, escalada, salto, transporte, superfície medida, queda/recuperação e clareira. |

## src/js/dream-forest/DreamStealthLevel.js

[Implementação](../src/js/dream-forest/DreamStealthLevel.js). Contratos exportados/reexportados: `STEALTH_LEVEL`, `STEALTH_PLATFORMS`, `stealthGround`, `STEALTH_COVERS`, `STEALTH_MUD`, `stealthMudAt`, `stealthPose`, `stealthCheckpoint`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `stealthGround(x)` | Função | [7](../src/js/dream-forest/DreamStealthLevel.js#L7) | Retorna o chão contínuo, com topo pintado dos relevos e descida de terra até o caminho. |
| `stealthMudAt(x)` | Função | [21](../src/js/dream-forest/DreamStealthLevel.js#L21) | Exige que o corpo inteiro caiba dentro da poça para permitir submersão. |
| `stealthPose(n)` | Função | [23](../src/js/dream-forest/DreamStealthLevel.js#L23) | Compartilha o índice da pose abaixada entre pintura, salto e detecção dos olhos. |
| `stealthCheckpoint(index)` | Função | [25](../src/js/dream-forest/DreamStealthLevel.js#L25) | Retorna o abrigo de retomada por setor e conserva submersão nos setores de lama. |

## src/js/dream-forest/DreamWeb.js

[Implementação](../src/js/dream-forest/DreamWeb.js). Contratos exportados/reexportados: `dreamSpiderContact`, `dreamWebCanGrab`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamSpiderContact(frame,player)` | Função | [2](../src/js/dream-forest/DreamWeb.js#L2) | Detecta contato entre o corpo da menina e a silhueta da aranha, incluindo a abertura das patas. |
| `dreamWebCanGrab(frame,gripY)` | Função | [7](../src/js/dream-forest/DreamWeb.js#L7) | Permite agarrar somente a seda existente, com espaço para os pés acima da aranha. |

## src/js/effects/ArtFinish.js

[Implementação](../src/js/effects/ArtFinish.js). Contratos exportados/reexportados: `applyArtFinish`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `applyArtFinish(ctx, canvas)` | Função | [2](../src/js/effects/ArtFinish.js#L2) | Aplica dessaturação em coordenadas de tela. |

## src/js/effects/ParticleSystem.js

[Implementação](../src/js/effects/ParticleSystem.js). Contratos exportados/reexportados: `ParticleSystem`, `createParticleSystem`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [10](../src/js/effects/ParticleSystem.js#L10) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `clear()` | Método declarado | [18](../src/js/effects/ParticleSystem.js#L18) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `spawnBabyJumpDust(bx, bw, by, bh, bvx, isEscapeMode = false, escapeLevel = 0)` | Método declarado | [26](../src/js/effects/ParticleSystem.js#L26) | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyJumpPuff(x, y, count = 5)` | Método declarado | [56](../src/js/effects/ParticleSystem.js#L56) | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyLandingPuff(x, y, count = 5)` | Método declarado | [81](../src/js/effects/ParticleSystem.js#L81) | Cria partículas/efeitos no buffer correspondente. |
| `spawnPhase3Ribbons(baby, phase3Level, stats, tick)` | Método declarado | [105](../src/js/effects/ParticleSystem.js#L105) | Cria partículas/efeitos no buffer correspondente. |
| `spawnEscapeRibbons(baby, escapeLevel, stats, tick)` | Método declarado | [129](../src/js/effects/ParticleSystem.js#L129) | Cria partículas/efeitos no buffer correspondente. |
| `update(dt = 1.0)` | Método declarado | [153](../src/js/effects/ParticleSystem.js#L153) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateBabyJumpDust(dt = 1.0)` | Método declarado | [158](../src/js/effects/ParticleSystem.js#L158) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateSpeedRibbons(dt = 1.0)` | Método declarado | [172](../src/js/effects/ParticleSystem.js#L172) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `renderSpeedRibbons(ctx, canvas, camX)` | Método declarado | [187](../src/js/effects/ParticleSystem.js#L187) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderBabyJumpDust(ctx, canvas, camX)` | Método declarado | [207](../src/js/effects/ParticleSystem.js#L207) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `render(ctx, canvas, camX)` | Método declarado | [247](../src/js/effects/ParticleSystem.js#L247) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `createParticleSystem(options = {})` | Função | [253](../src/js/effects/ParticleSystem.js#L253) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/effects/TransitionEffects.js

[Implementação](../src/js/effects/TransitionEffects.js). Contratos exportados/reexportados: `TransitionEffects`, `transitionEffects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderPortalWipe(ctx, canvas, cameraX, cameraY, trueExitDoor, transitionWipeAlpha, tick = 0, presentationTransform = null)` | Método declarado | [20](../src/js/effects/TransitionEffects.js#L20) | Desenha transição do portal usando matriz de apresentação quando fornecida. |

## src/js/effects/index.js

[Implementação](../src/js/effects/index.js). Contratos exportados/reexportados: `ParticleSystem`, `createParticleSystem`, `TransitionEffects`, `transitionEffects`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/entities/BabyRenderer.js

[Implementação](../src/js/entities/BabyRenderer.js). Contratos exportados/reexportados: `BabyRenderer`, `babyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [7](../src/js/entities/BabyRenderer.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | [8](../src/js/entities/BabyRenderer.js#L8) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `resolveAnimationState(baby, state)` | Método declarado | [9](../src/js/entities/BabyRenderer.js#L9) | Escolhe animação oficial conforme ação e flags do estado. |
| `renderPose(ctx, assets, pose, frameIndex, centerX, feetY, height, facing = 1, visualScale = 1)` | Método declarado | [76](../src/js/entities/BabyRenderer.js#L76) | Desenha recorte ancorado no centro/pés, com escala visual. |
| `render(ctx, baby, state = {}, camX = 0, options = {})` | Método declarado | [106](../src/js/entities/BabyRenderer.js#L106) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/entities/FairyRenderer.js

[Implementação](../src/js/entities/FairyRenderer.js). Contratos exportados/reexportados: `FairyRenderer`, `fairyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `render(ctx, fairy, state = {}, camX = 0, options = {})` | Método declarado | [18](../src/js/entities/FairyRenderer.js#L18) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/entities/GirlBodyLayers.js

[Implementação](../src/js/entities/GirlBodyLayers.js). Contratos exportados/reexportados: `applyGirlBodyTransform`, `drawGirlUpperBody`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `canvas(width, height)` | Função | [3](../src/js/entities/GirlBodyLayers.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `polygon(ctx, points)` | Função | [7](../src/js/entities/GirlBodyLayers.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `layers(assets, frame, body, carrying)` | Função | [12](../src/js/entities/GirlBodyLayers.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `copy()` | Função atribuída | [24](../src/js/entities/GirlBodyLayers.js#L24) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `applyGirlBodyTransform(ctx, pose)` | Função | [47](../src/js/entities/GirlBodyLayers.js#L47) | Aplica translação do quadril, oscilação e rotação do tronco também às mãos e ao brinquedo transportado. |
| `image(ctx, layer, frame)` | Função | [51](../src/js/entities/GirlBodyLayers.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arm(ctx, parts, index, angle)` | Função | [53](../src/js/entities/GirlBodyLayers.js#L53) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clothes(ctx, parts, pose, alpha)` | Função | [60](../src/js/entities/GirlBodyLayers.js#L60) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawGirlUpperBody(ctx, assets, frame, body, idleFrame, idleBody, pose, amount, carrying)` | Função | [71](../src/js/entities/GirlBodyLayers.js#L71) | Compõe cabeça estabilizada, cabelo, braços em oposição e vestido com atraso; preserva uma única cabeça na mistura. |

## src/js/entities/GirlGait.js

[Implementação](../src/js/entities/GirlGait.js). Contratos exportados/reexportados: `girlGaitDirection`, `sampleGirlLocomotion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(v, a, b)` | Função atribuída | [2](../src/js/entities/GirlGait.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `curve(t, keys)` | Função | [7](../src/js/entities/GirlGait.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `girlGaitDirection()` | Função | [18](../src/js/entities/GirlGait.js#L18) | Mantém o perfil lateral coerente entre pernas e tronco; o chamador espelha esquerda/direita, sem girar só as pernas ao mover em profundidade. |
| `sampleGirlLocomotion(distance, carrying = false, amount = 1, direction = { x: 1, y: 0 })` | Função | [24](../src/js/entities/GirlGait.js#L24) | Amostra apoio, elevação, joelho, tronco, cabeça, braços e vestido por distância; transportar reduz a oscilação. |

## src/js/entities/GirlLocomotion.js

[Implementação](../src/js/entities/GirlLocomotion.js). Contratos exportados/reexportados: `drawGirlLocomotion`, `girlLocomotionDistance`, `renderGirlRun`, `sampleGirlLocomotion`, `girlGaitDirection`, `applyGirlBodyTransform`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, low, high)` | Função atribuída | [8](../src/js/entities/GirlLocomotion.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canvas(width, height)` | Função | [11](../src/js/entities/GirlLocomotion.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepare(assets)` | Função | [17](../src/js/entities/GirlLocomotion.js#L17) | Prepara contexto visual da introdução; consulte dependências no módulo. |
| `bodyLayer(data, assets, frame)` | Função | [26](../src/js/entities/GirlLocomotion.js#L26) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restingLegLayer(data, assets, frame)` | Função | [46](../src/js/entities/GirlLocomotion.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `legParts(data, assets)` | Função | [59](../src/js/entities/GirlLocomotion.js#L59) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawLeg(ctx, parts, leg, index)` | Função | [92](../src/js/entities/GirlLocomotion.js#L92) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawGirlLocomotion(ctx, assets, frame, distance, carrying = false, amount = 1, direction = { x: 1, y: 0 })` | Função | [112](../src/js/entities/GirlLocomotion.js#L112) | Compõe repouso original e membros articulados com transição contínua; retorna false se faltarem fontes. |
| `girlLocomotionDistance(animTime, height, room = false)` | Função | [142](../src/js/entities/GirlLocomotion.js#L142) | Converte animTime legado para distância na pintura, com calibração distinta para quarto e sala. |
| `renderGirlRun(ctx, assets, actor, centerX, feetY, height, facing, visualScale = 1, room = false)` | Função | [147](../src/js/entities/GirlLocomotion.js#L147) | Ancora a menina nos pés, aplica escala/espelhamento e compartilha a atuação entre explorações, sem mudar corpos físicos. |

## src/js/entities/index.js

[Implementação](../src/js/entities/index.js). Contratos exportados/reexportados: `BabyRenderer`, `babyRenderer`, `FairyRenderer`, `fairyRenderer`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/environment/BackgroundRenderer.js

[Implementação](../src/js/environment/BackgroundRenderer.js). Contratos exportados/reexportados: `getBackgroundViewport`, `BackgroundRenderer`, `backgroundRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getBackgroundViewport(ctx, canvas)` | Função | [13](../src/js/environment/BackgroundRenderer.js#L13) | Inverte a matriz real para determinar os limites visíveis do fundo. |
| `constructor(options = {})` | Método declarado | [30](../src/js/environment/BackgroundRenderer.js#L30) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | [35](../src/js/environment/BackgroundRenderer.js#L35) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `drawAtlasSceneryItem(ctx, assets, type, sx, item, floorY)` | Método declarado | [43](../src/js/environment/BackgroundRenderer.js#L43) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderWall(ctx, canvas, camX = 0, options = {})` | Método declarado | [165](../src/js/environment/BackgroundRenderer.js#L165) | Desenha parede, parallax, piso e rodapé com cobertura do viewport. |
| `renderScenery(ctx, canvas, scenery = defaultRoomScenery, camX = 0, options = {})` | Método declarado | [530](../src/js/environment/BackgroundRenderer.js#L530) | Desenha objetos decorativos do piso. |
| `render(ctx, canvas, camX = 0, options = {})` | Método declarado | [707](../src/js/environment/BackgroundRenderer.js#L707) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/environment/DarkRoomContact.js

[Implementação](../src/js/environment/DarkRoomContact.js). Contratos exportados/reexportados: `DarkRoomContact`, `getDarkRoomFeet`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(renderer, assets)` | Método declarado | [5](../src/js/environment/DarkRoomContact.js#L5) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `prepare(platforms)` | Método declarado | [10](../src/js/environment/DarkRoomContact.js#L10) | Prepara contexto visual da introdução; consulte dependências no módulo. |
| `bounds(platform)` | Método declarado | [34](../src/js/environment/DarkRoomContact.js#L34) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `height(platform, feet)` | Método declarado | [41](../src/js/environment/DarkRoomContact.js#L41) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resolve(baby, state, platforms, dt)` | Método declarado | [56](../src/js/environment/DarkRoomContact.js#L56) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getDarkRoomFeet(baby, state = {})` | Função | [99](../src/js/environment/DarkRoomContact.js#L99) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/environment/LightingSystem.js

[Implementação](../src/js/environment/LightingSystem.js). Contratos exportados/reexportados: `LightingSystem`, `createLightingSystem`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [16](../src/js/environment/LightingSystem.js#L16) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `resize(width, height)` | Método declarado | [21](../src/js/environment/LightingSystem.js#L21) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(ctx, canvas, state = {}, baby = {}, fairy = {}, camX = 0, camY = 0, options = {})` | Método declarado | [27](../src/js/environment/LightingSystem.js#L27) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pool(x, y, rx, ry, strength)` | Função atribuída | [58](../src/js/environment/LightingSystem.js#L58) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createLightingSystem(options = {})` | Função | [176](../src/js/environment/LightingSystem.js#L176) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/environment/PlatformRenderer.js

[Implementação](../src/js/environment/PlatformRenderer.js). Contratos exportados/reexportados: `PLATFORM_SURFACES`, `PlatformRenderer`, `platformRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [49](../src/js/environment/PlatformRenderer.js#L49) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | [54](../src/js/environment/PlatformRenderer.js#L54) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `drawAtlasPlatformSprite(ctx, assets, style, sx, p, tick = 0)` | Método declarado | [62](../src/js/environment/PlatformRenderer.js#L62) | Recorta/calibra sprite de plataforma; não redefine colisões. |
| `renderPlatforms(ctx, canvas, camX = 0, options = {})` | Método declarado | [744](../src/js/environment/PlatformRenderer.js#L744) | Desenha apoios com atlas/alternativas e descarte visual. |
| `renderExitDoor(ctx, canvas, camX = 0, options = {})` | Método declarado | [1274](../src/js/environment/PlatformRenderer.js#L1274) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderTrueExitDoor(ctx, canvas, camX = 0, options = {})` | Método declarado | [1332](../src/js/environment/PlatformRenderer.js#L1332) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderTutorialArrow(ctx, canvas, camX = 0, options = {})` | Método declarado | [1446](../src/js/environment/PlatformRenderer.js#L1446) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/environment/StorybookPlatforms.js

[Implementação](../src/js/environment/StorybookPlatforms.js). Contratos exportados/reexportados: `drawContactEdge`, `drawStorybookPlatform`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `gradient(ctx,y,h,colors)` | Função | [11](../src/js/environment/StorybookPlatforms.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `box(ctx,x,y,w,h,material='wood',radius=3)` | Função | [15](../src/js/environment/StorybookPlatforms.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `line(ctx,points,color=INK,width=1)` | Função | [31](../src/js/environment/StorybookPlatforms.js#L31) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ellipse(ctx,x,y,rx,ry,color)` | Função | [35](../src/js/environment/StorybookPlatforms.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawContactEdge(ctx,x,y,w,material='wood',depth=5)` | Função | [39](../src/js/environment/StorybookPlatforms.js#L39) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `book(ctx,x,y,w,h,material='purple')` | Função | [47](../src/js/environment/StorybookPlatforms.js#L47) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawToy(ctx,p,w,assets,tick)` | Função | [54](../src/js/environment/StorybookPlatforms.js#L54) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawStorybookPlatform(ctx,assets,p,sx,tick=0)` | Função | [179](../src/js/environment/StorybookPlatforms.js#L179) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

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
| `createGame(canvas, uiFeedback, callbacks = {})` | Função | [36](../src/js/game.js#L36) | Cria o coordenador e devolve a API de integração com a página. |
| `onComplete()` | API/lambda de objeto | [77](../src/js/game.js#L77) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginToyRoomIntroduction()` | Função | [87](../src/js/game.js#L87) | Captura saída e cria sala de apresentação sem input antes da fase ativa. |
| `beginOpeningGameplay()` | Função | [114](../src/js/game.js#L114) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enterFirstJumpTutorial()` | Função | [132](../src/js/game.js#L132) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncViewportFromState()` | Função | [148](../src/js/game.js#L148) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncViewportToState()` | Função | [152](../src/js/game.js#L152) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setLastInputDevice(dev)` | Função | [156](../src/js/game.js#L156) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getActivePromptDevice()` | Função | [160](../src/js/game.js#L160) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `startStandbyPreparation()` | Função | [164](../src/js/game.js#L164) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `confirmStandby()` | Função | [170](../src/js/game.js#L170) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetBabyPhysicsBody(targetX, targetY, facing = 1)` | Função | [177](../src/js/game.js#L177) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `triggerGameOver()` | Função | [183](../src/js/game.js#L183) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isGameOver()` | Função | [190](../src/js/game.js#L190) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `reportDefeat(phase)` | Função | [197](../src/js/game.js#L197) | Deduplica, salva e publica a derrota da fase ativa com a oferta de ajuda. |
| `retryGame()` | Função | [204](../src/js/game.js#L204) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `continueOnEasy()` | Função | [222](../src/js/game.js#L222) | Aplica EASY às instâncias atuais e retoma a seção/adversário/percurso com progresso preservado. |
| `declineEasyOffer()` | Função | [240](../src/js/game.js#L240) | Recusa a oferta sem alterar dificuldade, contagem ou progresso. |
| `restartToTitle()` | Função | [245](../src/js/game.js#L245) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startToyRoomIntroduction()` | Função | [258](../src/js/game.js#L258) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startToyRoomPhase({ fromIntroduction = false } = {})` | Função | [278](../src/js/game.js#L278) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `isInputEnabled()` | API/lambda de objeto | [297](../src/js/game.js#L297) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `handleResize()` | Função | [324](../src/js/game.js#L324) | Dimensiona bitmap e canvases auxiliares a partir do layout CSS. |
| `startTruePortalTransition()` | Função | [341](../src/js/game.js#L341) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `showFailMessage()` | Função | [347](../src/js/game.js#L347) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startCastleCutscene()` | Função | [351](../src/js/game.js#L351) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advanceCutscene()` | Função | [357](../src/js/game.js#L357) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishCutscene()` | Função | [363](../src/js/game.js#L363) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startPlotTwistCutscene()` | Função | [370](../src/js/game.js#L370) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advancePlotTwist()` | Função | [376](../src/js/game.js#L376) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishPlotTwistAndStartTutorial()` | Função | [382](../src/js/game.js#L382) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetToStart(failedMidClimb = false, shouldPlayFailSound = true)` | Função | [388](../src/js/game.js#L388) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `doJump(inputSource)` | Função | [395](../src/js/game.js#L395) | Seleciona salto ou avanço narrativo conforme o estado atual. |
| `spawnFairyFlightDust(fx, fy, fvx, fvy)` | Função | [540](../src/js/game.js#L540) | Cria partículas/efeitos no buffer correspondente. |
| `spawnFairySparkles(x, y, count = 2)` | Função | [544](../src/js/game.js#L544) | Cria partículas/efeitos no buffer correspondente. |
| `updateFairyParticles()` | Função | [548](../src/js/game.js#L548) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `spawnBabyJumpDust(bx, bw, by, bh, bvx)` | Função | [553](../src/js/game.js#L553) | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyJumpPuff(x, y, count = 5)` | Função | [557](../src/js/game.js#L557) | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyLandingPuff(x, y)` | Função | [561](../src/js/game.js#L561) | Cria partículas/efeitos no buffer correspondente. |
| `updateBabyJumpDust(dt = 1.0)` | Função | [565](../src/js/game.js#L565) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `drawBackgroundWall(camX)` | Função | [571](../src/js/game.js#L571) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawSceneryItems(camX)` | Função | [575](../src/js/game.js#L575) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawPlatforms(camX)` | Função | [579](../src/js/game.js#L579) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawExitDoor(camX)` | Função | [590](../src/js/game.js#L590) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawTrueExitDoor(camX)` | Função | [601](../src/js/game.js#L601) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBabyManaStyle(camX)` | Função | [611](../src/js/game.js#L611) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFairy(camX)` | Função | [617](../src/js/game.js#L617) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `applyDarkAtmosphereWithLights(camX, camY = 0)` | Função | [623](../src/js/game.js#L623) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawSpeedRibbons(camX)` | Função | [634](../src/js/game.js#L634) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBabyJumpDust(camX)` | Função | [638](../src/js/game.js#L638) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawEscapeBanner()` | Função | [643](../src/js/game.js#L643) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialoguePortrait(pCtx, charType, px, py, radius, mood = 'normal')` | Função | [647](../src/js/game.js#L647) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapDialogueText(pCtx, text, maxWidth)` | Função | [651](../src/js/game.js#L651) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawCutsceneDialogue(transform)` | Função | [655](../src/js/game.js#L655) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawTutorialArrow(camX)` | Função | [668](../src/js/game.js#L668) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `update(dt = 1.0)` | Função | [678](../src/js/game.js#L678) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `onLagBehind()` | API/lambda de objeto | [1070](../src/js/game.js#L1070) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Função | [1079](../src/js/game.js#L1079) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `togglePause()` | Função | [1089](../src/js/game.js#L1089) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Função | [1109](../src/js/game.js#L1109) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `saveProgress()` | Função | [1115](../src/js/game.js#L1115) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restoreProgress(saved)` | Função | [1127](../src/js/game.js#L1127) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `newCampaign({ preserveProgress = false } = {})` | Função | [1151](../src/js/game.js#L1151) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startDebugPhase(phase, difficulty = state.gameDifficulty)` | Função | [1171](../src/js/game.js#L1171) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `saveOnHide()` | Função atribuída | [1207](../src/js/game.js#L1207) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `recordCameraQa(transform = null)` | Função | [1225](../src/js/game.js#L1225) | Emite observação optativa de câmera; ativada por cameraQa e callback de teste. |
| `loop(currentTime = performance.now())` | Função | [1229](../src/js/game.js#L1229) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isFirstJumpTutorial()` | API/lambda de objeto | [1269](../src/js/game.js#L1269) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGrounded()` | API/lambda de objeto | [1271](../src/js/game.js#L1271) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isCutsceneActive()` | API/lambda de objeto | [1272](../src/js/game.js#L1272) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGameOver()` | API/lambda de objeto | [1273](../src/js/game.js#L1273) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isToyRoomMode()` | API/lambda de objeto | [1274](../src/js/game.js#L1274) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | API/lambda de objeto | [1276](../src/js/game.js#L1276) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `advanceDialogue(event)` | Função | [1280](../src/js/game.js#L1280) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `pauseMusic()` | API/lambda de objeto | [1326](../src/js/game.js#L1326) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | API/lambda de objeto | [1327](../src/js/game.js#L1327) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setMasterVolume(v)` | API/lambda de objeto | [1328](../src/js/game.js#L1328) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | API/lambda de objeto | [1329](../src/js/game.js#L1329) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(m)` | API/lambda de objeto | [1330](../src/js/game.js#L1330) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `isMuted()` | API/lambda de objeto | [1331](../src/js/game.js#L1331) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | API/lambda de objeto | [1332](../src/js/game.js#L1332) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isPaused()` | API/lambda de objeto | [1333](../src/js/game.js#L1333) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `hasProgress()` | API/lambda de objeto | [1336](../src/js/game.js#L1336) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `hasSavedCampaign()` | API/lambda de objeto | [1337](../src/js/game.js#L1337) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDifficulty()` | API/lambda de objeto | [1338](../src/js/game.js#L1338) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `destroy()` | Método declarado | [1343](../src/js/game.js#L1343) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `start(difficulty = 'NORMAL')` | Método declarado | [1354](../src/js/game.js#L1354) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `isGrounded()` | API/lambda de objeto | [1376](../src/js/game.js#L1376) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isCutsceneActive()` | API/lambda de objeto | [1377](../src/js/game.js#L1377) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isToyRoomMode()` | API/lambda de objeto | [1386](../src/js/game.js#L1386) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/garden/GardenArt.js

[Implementação](../src/js/garden/GardenArt.js). Contratos exportados/reexportados: `GARDEN_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenAudio.js

[Implementação](../src/js/garden/GardenAudio.js). Contratos exportados/reexportados: `GardenAudio`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(host,{track=new URL('../../../assets/audio/Blues Shuffle Loop.mp3',import.meta.url),label='do jardim'}={})` | Método declarado | [4](../src/js/garden/GardenAudio.js#L4) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `unlock()` | Método declarado | [9](../src/js/garden/GardenAudio.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tone(frequency,duration=.25,volume=.035,slide=frequency)` | Método declarado | [10](../src/js/garden/GardenAudio.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `hurt()` | Método declarado | [12](../src/js/garden/GardenAudio.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playMusic()` | Método declarado | [23](../src/js/garden/GardenAudio.js#L23) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `update(state,paused=false)` | Método declarado | [28](../src/js/garden/GardenAudio.js#L28) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `event(type)` | Método declarado | [35](../src/js/garden/GardenAudio.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clear()` | Método declarado | [36](../src/js/garden/GardenAudio.js#L36) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `destroy()` | Método declarado | [37](../src/js/garden/GardenAudio.js#L37) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/garden/GardenBeeRenderer.js

[Implementação](../src/js/garden/GardenBeeRenderer.js). Contratos exportados/reexportados: `drawGardenBee`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawGardenBee(ctx,images,bee,time)` | Função | [5](../src/js/garden/GardenBeeRenderer.js#L5) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/garden/GardenBeetleArt.js

[Implementação](../src/js/garden/GardenBeetleArt.js). Contratos exportados/reexportados: `GARDEN_BEETLE`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenBeetleRenderer.js

[Implementação](../src/js/garden/GardenBeetleRenderer.js). Contratos exportados/reexportados: `drawGardenBeetle`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawGardenBeetle(ctx,images,beetle,time)` | Função | [3](../src/js/garden/GardenBeetleRenderer.js#L3) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/garden/GardenCinematic.js

[Implementação](../src/js/garden/GardenCinematic.js). Contratos exportados/reexportados: `gardenCinematicMoment`, `renderGardenCinematic`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dialogueBottom(canvas,textCanvas,end,seen)` | Função | [9](../src/js/garden/GardenCinematic.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenCinematicMoment(state)` | Função | [20](../src/js/garden/GardenCinematic.js#L20) | Seleciona atuação e plano pelo progresso narrativo, separado da câmera de gameplay e do relógio da fala. |
| `actor(ctx,images,index,x,base,height,time,breath=true)` | Função | [29](../src/js/garden/GardenCinematic.js#L29) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actorPair(ctx,images,a,b,x,base,height,time)` | Função | [35](../src/js/garden/GardenCinematic.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sleepingActor(ctx,images,set,file,index,x,base,headScale,time)` | Função | [40](../src/js/garden/GardenCinematic.js#L40) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fairy(ctx,images,time,x,y,height=145)` | Função | [45](../src/js/garden/GardenCinematic.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderGardenCinematic(ctx,canvas,state,images)` | Função | [56](../src/js/garden/GardenCinematic.js#L56) | Compõe cenário, atores em camadas e quadro narrativo; apresenta sonolência e repouso das duas após a leitura. |

## src/js/garden/GardenCinematicArt.js

[Implementação](../src/js/garden/GardenCinematicArt.js). Contratos exportados/reexportados: `GARDEN_ACTING`, `GARDEN_BEE_LAYERS`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenContact.js

[Implementação](../src/js/garden/GardenContact.js). Contratos exportados/reexportados: `gardenFeet`, `gardenContactHeight`, `gardenGirlPose`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `gardenFeet(player,x=player.x)` | Função | [9](../src/js/garden/GardenContact.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenContactHeight(platform,player,x=player.x)` | Função | [14](../src/js/garden/GardenContact.js#L14) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenGirlPose(player,time=player.animationTime??0)` | Função | [32](../src/js/garden/GardenContact.js#L32) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/garden/GardenContactData.js

[Implementação](../src/js/garden/GardenContactData.js). Contratos exportados/reexportados: `GARDEN_CONTACT`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenDefeatPresentation.js

[Implementação](../src/js/garden/GardenDefeatPresentation.js). Contratos exportados/reexportados: `gardenDefeatFrame`, `advanceGardenDefeats`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value,min,max)` | Função atribuída | [1](../src/js/garden/GardenDefeatPresentation.js#L1) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenDefeatFrame(enemy,groundY=enemy.baseY)` | Função | [3](../src/js/garden/GardenDefeatPresentation.js#L3) | Calcula corpo comprimido ou queda visual de inseto derrotado por até 1,6 s, sem alterar coordenadas de colisão. |
| `advanceGardenDefeats(state,seconds)` | Função | [11](../src/js/garden/GardenDefeatPresentation.js#L11) | Avança uma vez por subpasso os relógios visuais dos corpos, inclusive fora da vizinhança e em encerramento. |

## src/js/garden/GardenEncounters.js

[Implementação](../src/js/garden/GardenEncounters.js). Contratos exportados/reexportados: `GARDEN_BEETLES`, `createGardenEncounters`, `tickGardenWorm`, `tickGardenBeetles`, `resetGardenPanic`, `tickGardenBee`, `sweptGardenContact`, `restoreGardenEncounters`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n,a,b)` | Função atribuída | [3](../src/js/garden/GardenEncounters.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createGardenEncounters()` | Função | [12](../src/js/garden/GardenEncounters.js#L12) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `tickGardenWorm(e,s,dt)` | Função | [16](../src/js/garden/GardenEncounters.js#L16) | Controla exposição da minhoca por proximidade com limites distintos para emergir e recolher; o buraco não remove chão. |
| `tickGardenBeetles(s,dt,events)` | Função | [22](../src/js/garden/GardenEncounters.js#L22) | Ativa corrida automática até o pouso seguro na outra margem dos rios; mantém seis segundos no encontro das nuvens finais. |
| `resetGardenPanic(s,targetX)` | Função | [37](../src/js/garden/GardenEncounters.js#L37) | Limpa perseguição/saída, rearma gatilhos futuros e recoloca abelhas vivas no repouso ao retomar. |
| `tickGardenBee(e,s,dt)` | Função | [42](../src/js/garden/GardenEncounters.js#L42) | Mantém repouso fixo, aviso de 0,5 s e rasantes A/B de 1,25 s, com intervalo de 1,8 s. |
| `sweptGardenContact(previous,player,old,enemy)` | Função | [62](../src/js/garden/GardenEncounters.js#L62) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restoreGardenEncounters(saved,version=10)` | Função | [68](../src/js/garden/GardenEncounters.js#L68) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/garden/GardenFearArt.js

[Implementação](../src/js/garden/GardenFearArt.js). Contratos exportados/reexportados: `FEAR_FILES`, `FEAR_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenInput.js

[Implementação](../src/js/garden/GardenInput.js). Contratos exportados/reexportados: `gardenControls`, `GardenInput`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `gardenControls(canvas,safe={left:0,right:canvas.width,bottom:canvas.height})` | Função | [2](../src/js/garden/GardenInput.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor(canvas,enabled,controls,unlock=()=>{},scene=()=>null)` | Método declarado | [8](../src/js/garden/GardenInput.js#L8) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `install()` | Método declarado | [16](../src/js/garden/GardenInput.js#L16) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sample()` | Método declarado | [17](../src/js/garden/GardenInput.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clear()` | Método declarado | [18](../src/js/garden/GardenInput.js#L18) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `destroy()` | Método declarado | [19](../src/js/garden/GardenInput.js#L19) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/garden/GardenInsectArt.js

[Implementação](../src/js/garden/GardenInsectArt.js). Contratos exportados/reexportados: `INSECT_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenLevel.js

[Implementação](../src/js/garden/GardenLevel.js). Contratos exportados/reexportados: `GARDEN`, `GARDEN_HOME`, `GARDEN_TERRAINS`, `GARDEN_WHEEL`, `GARDEN_FINAL_START`, `GARDEN_GOAL`, `GARDEN_WIDTH`, `GARDEN_WHEELS`, `GARDEN_AERIAL`, `GARDEN_PLATFORMS`, `GARDEN_ENEMIES`, `GARDEN_WATERS`, `GARDEN_SECTIONS`, `GARDEN_CHECKPOINTS`, `GARDEN_LEGACY_CHECKPOINTS`, `GARDEN_PLATFORM_BY_ID`, `gardenPlatforms`, `cloudStatus`, `gardenSection`, `gardenSurfaceY`, `gardenTerrainAt`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `add(id,x,w,type='soil',y=590,extra={})` | Função atribuída | [7](../src/js/garden/GardenLevel.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ground(id,x,w,type='soil')` | Função atribuída | [8](../src/js/garden/GardenLevel.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemy(id,type,p,progress=0)` | Função atribuída | [9](../src/js/garden/GardenLevel.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `river(id,x,count,gap=122,rise=32,ant=false)` | Função | [10](../src/js/garden/GardenLevel.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenPlatforms(time=0,state=null,center=null,radius=1000)` | Função | [110](../src/js/garden/GardenLevel.js#L110) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cloudStatus(platform,state,time=state?.time??0)` | Função | [117](../src/js/garden/GardenLevel.js#L117) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenSection(x)` | Função | [124](../src/js/garden/GardenLevel.js#L124) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenSurfaceY(platform,x)` | Função | [127](../src/js/garden/GardenLevel.js#L127) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenTerrainAt(platform,x)` | Função | [134](../src/js/garden/GardenLevel.js#L134) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/garden/GardenNarrative.js

[Implementação](../src/js/garden/GardenNarrative.js). Contratos exportados/reexportados: `GARDEN_OPENING`, `GARDEN_ENDING`, `GARDEN_OPENING_DURATION`, `gardenNarrativeCard`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `card(speaker,text,duration)` | Função atribuída | [2](../src/js/garden/GardenNarrative.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenNarrativeCard(cards,age)` | Função | [31](../src/js/garden/GardenNarrative.js#L31) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/garden/GardenPhase.js

[Implementação](../src/js/garden/GardenPhase.js). Contratos exportados/reexportados: `GardenPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({canvas,audio,enabled=()=>true,difficulty='NORMAL',campaign=false})` | Método declarado | [8](../src/js/garden/GardenPhase.js#L8) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `requestDialogueAdvance(event={})` | Método declarado | [15](../src/js/garden/GardenPhase.js#L15) | No jardim, enfileira avanço de uma fala ou skip visto e bloqueia pulo até a liberação da entrada. |
| `reading()` | Método declarado | [22](../src/js/garden/GardenPhase.js#L22) | Consulta abertura ou encerramento ainda em leitura e o alvo de skip já visto; devolve null durante gameplay e sono concluído. |
| `active()` | Acessor | [23](../src/js/garden/GardenPhase.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `start(saved=null)` | Método declarado | [24](../src/js/garden/GardenPhase.js#L24) | Restaura domínio opcional, recupera marcas de leitura, carrega recursos e instala entradas/listeners; publica erro de carga sem liberar movimento. |
| `update(dt=1)` | Método declarado | [25](../src/js/garden/GardenPhase.js#L25) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [26](../src/js/garden/GardenPhase.js#L26) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `setPaused(value)` | Método declarado | [27](../src/js/garden/GardenPhase.js#L27) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [28](../src/js/garden/GardenPhase.js#L28) | Captura envelope versão 1 com cópia serializável do domínio; não inclui imagens, áudio ou listeners. |
| `retry()` | Método declarado | [29](../src/js/garden/GardenPhase.js#L29) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [30](../src/js/garden/GardenPhase.js#L30) | Descarta avanço de diálogo, eventos de foco/visibilidade, controles, áudio e renderer de forma idempotente. |

## src/js/garden/GardenPicnicArt.js

[Implementação](../src/js/garden/GardenPicnicArt.js). Contratos exportados/reexportados: `GARDEN_PICNIC`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenRenderer.js

[Implementação](../src/js/garden/GardenRenderer.js). Contratos exportados/reexportados: `GardenRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas)` | Método declarado | [31](../src/js/garden/GardenRenderer.js#L31) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [32](../src/js/garden/GardenRenderer.js#L32) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `controls()` | Método declarado | [39](../src/js/garden/GardenRenderer.js#L39) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(state)` | Método declarado | [41](../src/js/garden/GardenRenderer.js#L41) | Calcula pose visual estável sem escrever na simulação. |
| `sprite(ctx,set,index,x,y,height,flip=1,fear=false,agitation=0,reaction=0)` | Método declarado | [42](../src/js/garden/GardenRenderer.js#L42) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prop(ctx,index,x,y,w,h,setName='objetos')` | Método declarado | [53](../src/js/garden/GardenRenderer.js#L53) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `groundPattern(type)` | Método declarado | [55](../src/js/garden/GardenRenderer.js#L55) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `groundOutline(ctx,p,bottom)` | Método declarado | [71](../src/js/garden/GardenRenderer.js#L71) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `surfaceTile(type,part='middle')` | Método declarado | [80](../src/js/garden/GardenRenderer.js#L80) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `groundSurface(ctx,p,joinedLeft,joinedRight)` | Método declarado | [94](../src/js/garden/GardenRenderer.js#L94) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `terrainBodies(ctx,platforms,bottom)` | Método declarado | [117](../src/js/garden/GardenRenderer.js#L117) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `terrain(ctx,p,bottom,body=true)` | Método declarado | [126](../src/js/garden/GardenRenderer.js#L126) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `aquaticSprite(ctx,index,x,y,w,h,flip=1)` | Método declarado | [137](../src/js/garden/GardenRenderer.js#L137) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rockFoot(ctx,p)` | Método declarado | [142](../src/js/garden/GardenRenderer.js#L142) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `riverLife(ctx,s,water,left,right,bottom)` | Método declarado | [147](../src/js/garden/GardenRenderer.js#L147) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `waterFront(ctx,s,left,right,bottom,platforms)` | Método declarado | [163](../src/js/garden/GardenRenderer.js#L163) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `groundJoins(ctx,platforms)` | Método declarado | [178](../src/js/garden/GardenRenderer.js#L178) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `grassFront(ctx,s,platforms)` | Método declarado | [186](../src/js/garden/GardenRenderer.js#L186) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `effort(ctx,s)` | Método declarado | [194](../src/js/garden/GardenRenderer.js#L194) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sceneryLayout()` | Método declarado | [202](../src/js/garden/GardenRenderer.js#L202) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `scenery(ctx,s,left,right)` | Método declarado | [217](../src/js/garden/GardenRenderer.js#L217) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fairy(ctx,s)` | Método declarado | [223](../src/js/garden/GardenRenderer.js#L223) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `insect(ctx,index,x,y,width,height,direction=1)` | Método declarado | [229](../src/js/garden/GardenRenderer.js#L229) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `message(ctx,text,options)` | Método declarado | [235](../src/js/garden/GardenRenderer.js#L235) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `narrative(ctx,s)` | Método declarado | [240](../src/js/garden/GardenRenderer.js#L240) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(s,{ready=true,error=null,touch=false,paused=false}={})` | Método declarado | [241](../src/js/garden/GardenRenderer.js#L241) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [323](../src/js/garden/GardenRenderer.js#L323) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/garden/GardenSimulation.js

[Implementação](../src/js/garden/GardenSimulation.js). Contratos exportados/reexportados: `createGardenState`, `retryGarden`, `restoreGardenState`, `stepGarden`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n,a,b)` | Função atribuída | [6](../src/js/garden/GardenSimulation.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyRange(enemy)` | Função | [9](../src/js/garden/GardenSimulation.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createGardenState(difficulty='NORMAL')` | Função | [14](../src/js/garden/GardenSimulation.js#L14) | Cria domínio v11 com jogador, encontros, nuvens, leitura, apresentação, fada e recuperação serializáveis. |
| `hurtPlayer(s,source,events)` | Função | [22](../src/js/garden/GardenSimulation.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `recoverTarget(s,kind)` | Função | [30](../src/js/garden/GardenSimulation.js#L30) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginRecovery(s,kind,events)` | Função | [38](../src/js/garden/GardenSimulation.js#L38) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `defeat(s,kind,events)` | Função | [46](../src/js/garden/GardenSimulation.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retryGarden(s,difficulty=s.difficulty)` | Função | [52](../src/js/garden/GardenSimulation.js#L52) | Retoma GAME_OVER no checkpoint, conserva inimigos vencidos e leitura, e rearma encontros futuros. |
| `restoreGardenState(saved,difficulty='NORMAL')` | Função | [61](../src/js/garden/GardenSimulation.js#L61) | Valida saves v1–v11 e migra geometria, encontros e leitura para o domínio atual sem serializar recursos. |
| `fairyTick(s,dt,platforms)` | Função | [113](../src/js/garden/GardenSimulation.js#L113) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyTick(e,s,dt)` | Função | [127](../src/js/garden/GardenSimulation.js#L127) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tick(s,input,dt,events)` | Função | [166](../src/js/garden/GardenSimulation.js#L166) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stepGarden(state,input={},seconds=1/60,difficulty=state.difficulty)` | Função | [291](../src/js/garden/GardenSimulation.js#L291) | Converte entrada em subpassos de até 1/120 s; atualiza leitura, movimento, contato, encontros, recuperação e eventos. |

## src/js/garden/GardenVisualArt.js

[Implementação](../src/js/garden/GardenVisualArt.js). Contratos exportados/reexportados: `AQUATIC_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/input.js

[Implementação](../src/js/input.js). Contratos exportados/reexportados: `InputController`, `bindInput`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/main.js

[Implementação](../src/js/main.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `refreshCampaignMenu()` | Função | [33](../src/js/main.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updatePauseButtonState()` | Função | [49](../src/js/main.js#L49) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `toggleGamePause()` | Função | [66](../src/js/main.js#L66) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateSoundButtonState()` | Função | [81](../src/js/main.js#L81) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `onGameOver({ phase = 'bedroom', offerEasy = false } = {})` | API/lambda de objeto | [129](../src/js/main.js#L129) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onRestartToTitle()` | API/lambda de objeto | [155](../src/js/main.js#L155) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGame(event)` | Função | [176](../src/js/main.js#L176) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleRetry(event)` | Função | [205](../src/js/main.js#L205) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleRestart(event)` | Função | [239](../src/js/main.js#L239) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `addSafeAction(element, handler)` | Função | [272](../src/js/main.js#L272) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `safeHandler(event)` | Função atribuída | [275](../src/js/main.js#L275) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handleToyRoomSwitch(event)` | Função | [292](../src/js/main.js#L292) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onNew()` | API/lambda de objeto | [331](../src/js/main.js#L331) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onLoad()` | API/lambda de objeto | [332](../src/js/main.js#L332) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setDebugPhaseMenuOpen(open, restoreFocus = false)` | Função atribuída | [356](../src/js/main.js#L356) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `pollOverlayGamepad()` | Função | [449](../src/js/main.js#L449) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/narrative/DarkRoomNarrative.js

[Implementação](../src/js/narrative/DarkRoomNarrative.js). Contratos exportados/reexportados: `updateStandbyNarrative`, `updateTransicaoStandbyNarrative`, `updateCasteloNarrative`, `updateReviravoltaNarrative`, `updateTutorialRetornoNarrative`, `updatePortalNarrative`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateStandbyNarrative(context, dt)` | Função | [5](../src/js/narrative/DarkRoomNarrative.js#L5) | Mantém pose de espera, fada, partículas e foco narrativo de standby. |
| `updateTransicaoStandbyNarrative(context, dt)` | Função | [37](../src/js/narrative/DarkRoomNarrative.js#L37) | Avança saída de standby, postura, alfa e retorno do enquadramento. |
| `updateCasteloNarrative(context, dt)` | Função | [91](../src/js/narrative/DarkRoomNarrative.js#L91) | Sequencia encontro no castelo, diálogos e liberação da fuga. |
| `updateReviravoltaNarrative(context, dt)` | Função | [150](../src/js/narrative/DarkRoomNarrative.js#L150) | Avança queda/checagem e diálogos da porta falsa; coordena atores e zoom. |
| `updateTutorialRetornoNarrative(context, dt)` | Função | [306](../src/js/narrative/DarkRoomNarrative.js#L306) | Demonstra arco da fada e devolve controle no retorno. |
| `updatePortalNarrative(context, dt)` | Função | [350](../src/js/narrative/DarkRoomNarrative.js#L350) | Avança aproximação/íris do portal e dispara introdução da Toy Room. |

## src/js/narrative/DialogueControls.js

[Implementação](../src/js/narrative/DialogueControls.js). Contratos exportados/reexportados: `dialogueControlsHeight`, `drawDialogueControls`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dialogueControlsHeight(scale=1,canSkip=false)` | Função | [4](../src/js/narrative/DialogueControls.js#L4) | Reserva altura para os comandos de leitura e, quando permitido, para o botão separado de pular cena já vista. |
| `drawDialogueControls(ctx,canvas,{left,top,width,scale=1,canSkip=false,color='#846467',buttonColor='#fff5e5'}={})` | Função | [7](../src/js/narrative/DialogueControls.js#L7) | Desenha avanço automático, gesto de adiantar e alvo separado de skip; devolve os limites do botão. |

## src/js/narrative/DialogueFlow.js

[Implementação](../src/js/narrative/DialogueFlow.js). Contratos exportados/reexportados: `beginDialogueFrame`, `endDialogueFrame`, `offerDialogue`, `setDialogueBounds`, `getDialogueBounds`, `isDialogueModal`, `installDialogueAdvance`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `flow(canvas)` | Função | [3](../src/js/narrative/DialogueFlow.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginDialogueFrame(canvas)` | Função | [4](../src/js/narrative/DialogueFlow.js#L4) | Inicia o registro dos quadros de diálogo por canvas; composições aninhadas compartilham profundidade e não deixam entrada obsoleta. |
| `endDialogueFrame(canvas)` | Função | [5](../src/js/narrative/DialogueFlow.js#L5) | Encerra um nível da composição de diálogos sem avançar relógios narrativos ou físicos. |
| `offerDialogue(canvas,text,onAdvance)` | Função | [7](../src/js/narrative/DialogueFlow.js#L7) | Registra a fala visível e seu callback de avanço; quadros dispensados ficam ocultos e canvases de medição não criam entrada. |
| `setDialogueBounds(canvas,ctx,x,y,w,h)` | Função | [13](../src/js/narrative/DialogueFlow.js#L13) | Transforma os quatro cantos do quadro para pixels do canvas usados no hit-testing de leitura não modal. |
| `getDialogueBounds(canvas)` | Função | [18](../src/js/narrative/DialogueFlow.js#L18) | Consulta os limites do quadro de diálogo atualmente registrado nesse canvas. |
| `isDialogueModal(canvas)` | Função | [19](../src/js/narrative/DialogueFlow.js#L19) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `installDialogueAdvance(canvas,{enabled=()=>true,advance=()=>false,isModal=()=>true}={})` | Função | [20](../src/js/narrative/DialogueFlow.js#L20) | Instala pointerdown em captura; consome um gesto e avança uma fala, preservando controles fora do quadro não modal. |
| `blur()` | Função atribuída | [44](../src/js/narrative/DialogueFlow.js#L44) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/narrative/PoeticNarrator.js

[Implementação](../src/js/narrative/PoeticNarrator.js). Contratos exportados/reexportados: `POETIC_LINES`, `getPauseNarration`, `renderPoeticNarration`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getPauseNarration(state)` | Função | [19](../src/js/narrative/PoeticNarrator.js#L19) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `renderPoeticNarration(ctx, canvas, text, options = {})` | Função | [26](../src/js/narrative/PoeticNarrator.js#L26) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/rendering/DarkRoomRenderPipeline.js

[Implementação](../src/js/rendering/DarkRoomRenderPipeline.js). Contratos exportados/reexportados: `renderDarkRoom`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderDarkRoom(context)` | Função | [10](../src/js/rendering/DarkRoomRenderPipeline.js#L10) | Compõe apresentação, camadas e interface; update de simulação permanece em game.js. |
| `drawRoom()` | API/lambda de objeto | [18](../src/js/rendering/DarkRoomRenderPipeline.js#L18) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/runtime/RuntimeContext.js

[Implementação](../src/js/runtime/RuntimeContext.js). Contratos exportados/reexportados: `createRuntimeContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createRuntimeContext({ state, audio, camera, assets, input, effects, campaign })` | Função | [2](../src/js/runtime/RuntimeContext.js#L2) | Agrega referências existentes; não cria serviços nem executa lógica de jogo. |

## src/js/state/CampaignDefeats.js

[Implementação](../src/js/state/CampaignDefeats.js). Contratos exportados/reexportados: `recordCampaignDefeat`, `clearCampaignDefeat`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `recordCampaignDefeat(state)` | Função | [2](../src/js/state/CampaignDefeats.js#L2) | Conta uma derrota completa por tentativa e oferece EASY a cada terceira perda no NORMAL. |
| `clearCampaignDefeat(state)` | Função | [11](../src/js/state/CampaignDefeats.js#L11) | Libera a próxima tentativa e limpa a oferta pendente sem zerar a contagem da campanha. |

## src/js/state/CampaignProgress.js

[Implementação](../src/js/state/CampaignProgress.js). Contratos exportados/reexportados: `CAMPAIGN_STORAGE_KEY`, `captureState`, `restoreState`, `createCampaignProgress`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `captureState(state)` | Função | [10](../src/js/state/CampaignProgress.js#L10) | Seleciona estado serializável da campanha. |
| `restoreState(state, saved)` | Função | [13](../src/js/state/CampaignProgress.js#L13) | Restaura valores preservando referências de objetos/arrays existentes. |
| `createCampaignProgress(storage)` | Função | [23](../src/js/state/CampaignProgress.js#L23) | Cria leitura, gravação e limpeza do progresso local com alternativa em memória. |
| `read()` | Método declarado | [28](../src/js/state/CampaignProgress.js#L28) | Lê e valida save da campanha; pode usar memória da sessão. |
| `write(data)` | Método declarado | [72](../src/js/state/CampaignProgress.js#L72) | Serializa save versionado e tenta gravar no storage. |
| `clear()` | Método declarado | [77](../src/js/state/CampaignProgress.js#L77) | Configura/reinicializa valores do componente; revise o escopo da mutação. |

## src/js/state/GameDifficulty.js

[Implementação](../src/js/state/GameDifficulty.js). Contratos exportados/reexportados: `normalizeDifficulty`, `EASY_LANDING_MARGIN`, `EASY_LANDING_DEPTH`, `easyLanding`, `toyGuideBlend`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `easyLanding(baby, x, width, y)` | Função | [5](../src/js/state/GameDifficulty.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyGuideBlend(difficulty, dt)` | Função | [11](../src/js/state/GameDifficulty.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/state/GameState.js

[Implementação](../src/js/state/GameState.js). Contratos exportados/reexportados: `GameState`, `createGameState`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, uiFeedback, callbacks = {})` | Método declarado | [12](../src/js/state/GameState.js#L12) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setLastInputDevice(dev)` | Método declarado | [21](../src/js/state/GameState.js#L21) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getActivePromptDevice()` | Método declarado | [27](../src/js/state/GameState.js#L27) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `spawnFairySparkles(x, y, count = 2)` | Método declarado | [44](../src/js/state/GameState.js#L44) | Cria partículas/efeitos no buffer correspondente. |
| `spawnFairyFlightDust(fx, fy, fvx, fvy)` | Método declarado | [66](../src/js/state/GameState.js#L66) | Cria partículas/efeitos no buffer correspondente. |
| `updateFairyParticles()` | Método declarado | [86](../src/js/state/GameState.js#L86) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `startStandbyPreparation(audio)` | Método declarado | [99](../src/js/state/GameState.js#L99) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `confirmStandby(audio)` | Método declarado | [135](../src/js/state/GameState.js#L135) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetBabyPhysicsBody(targetX, targetY, facing = 1)` | Método declarado | [153](../src/js/state/GameState.js#L153) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `triggerGameOver(audio)` | Método declarado | [175](../src/js/state/GameState.js#L175) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retryGame(audio)` | Método declarado | [200](../src/js/state/GameState.js#L200) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restartToTitle(audio)` | Método declarado | [215](../src/js/state/GameState.js#L215) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `showFailMessage()` | Método declarado | [243](../src/js/state/GameState.js#L243) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startCastleCutscene(audio)` | Método declarado | [259](../src/js/state/GameState.js#L259) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advanceCutscene(audio)` | Método declarado | [275](../src/js/state/GameState.js#L275) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishCutscene(audio)` | Método declarado | [287](../src/js/state/GameState.js#L287) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startPlotTwistCutscene(audio)` | Método declarado | [324](../src/js/state/GameState.js#L324) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advancePlotTwist(audio)` | Método declarado | [350](../src/js/state/GameState.js#L350) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishPlotTwistAndStartTutorial(audio)` | Método declarado | [366](../src/js/state/GameState.js#L366) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startTruePortalTransition(audio)` | Método declarado | [405](../src/js/state/GameState.js#L405) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetToStart(failedMidClimb = false, shouldPlayFailSound = true, audio)` | Método declarado | [427](../src/js/state/GameState.js#L427) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `createGameState(canvas, uiFeedback, callbacks)` | Função | [514](../src/js/state/GameState.js#L514) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/state/StateVariables.js

[Implementação](../src/js/state/StateVariables.js). Contratos exportados/reexportados: `createDefaultStateVariables`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createDefaultStateVariables()` | Função | [6](../src/js/state/StateVariables.js#L6) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/toy-room/ArenaAudioProfile.js

[Implementação](../src/js/toy-room/ArenaAudioProfile.js). Contratos exportados/reexportados: `ArenaAudioProfile`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(audio)` | Método declarado | [3](../src/js/toy-room/ArenaAudioProfile.js#L3) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `transform()` | Método declarado | [4](../src/js/toy-room/ArenaAudioProfile.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enter()` | Método declarado | [5](../src/js/toy-room/ArenaAudioProfile.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [9](../src/js/toy-room/ArenaAudioProfile.js#L9) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `sound(event)` | Método declarado | [14](../src/js/toy-room/ArenaAudioProfile.js#L14) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `leave({ resume = true } = {})` | Método declarado | [18](../src/js/toy-room/ArenaAudioProfile.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `snapshot()` | Método declarado | [24](../src/js/toy-room/ArenaAudioProfile.js#L24) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [25](../src/js/toy-room/ArenaAudioProfile.js#L25) | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ArenaBoss.js

[Implementação](../src/js/toy-room/ArenaBoss.js). Contratos exportados/reexportados: `ArenaBoss`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [3](../src/js/toy-room/ArenaBoss.js#L3) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `update(dt, battle)` | Método declarado | [4](../src/js/toy-room/ArenaBoss.js#L4) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `snapshot()` | Método declarado | [15](../src/js/toy-room/ArenaBoss.js#L15) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [16](../src/js/toy-room/ArenaBoss.js#L16) | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ArenaCamera.js

[Implementação](../src/js/toy-room/ArenaCamera.js). Contratos exportados/reexportados: `ArenaCamera`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [10](../src/js/toy-room/ArenaCamera.js#L10) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `update(dt, player, enemy, jump = 0, impact = null, battle = null)` | Método declarado | [11](../src/js/toy-room/ArenaCamera.js#L11) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `envelope(player, enemy, jump, battle = null, anticipate = false)` | Método declarado | [25](../src/js/toy-room/ArenaCamera.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(layout, room, battle)` | Método declarado | [42](../src/js/toy-room/ArenaCamera.js#L42) | Calcula pose visual estável sem escrever na simulação. |
| `snapshot()` | Método declarado | [65](../src/js/toy-room/ArenaCamera.js#L65) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [66](../src/js/toy-room/ArenaCamera.js#L66) | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ArenaCombatContact.js

[Implementação](../src/js/toy-room/ArenaCombatContact.js). Contratos exportados/reexportados: `arenaEnemyContact`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaEnemyContact(state, enemy)` | Função | [2](../src/js/toy-room/ArenaCombatContact.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaCombatRules.js

[Implementação](../src/js/toy-room/ArenaCombatRules.js). Contratos exportados/reexportados: `ARENA_SWORD`, `arenaEnemyImpactEnd`, `arenaEnemyGuarding`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaEnemyImpactEnd(enemy, tuning = { windup: 54, active: 18 })` | Função atribuída | [3](../src/js/toy-room/ArenaCombatRules.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaEnemyGuarding(enemy, tuning)` | Função | [6](../src/js/toy-room/ArenaCombatRules.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaDifficulty.js

[Implementação](../src/js/toy-room/ArenaDifficulty.js). Contratos exportados/reexportados: `arenaDifficulty`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaDifficulty(difficulty = 'NORMAL')` | Função | [15](../src/js/toy-room/ArenaDifficulty.js#L15) | Seleciona os perfis originais do NORMAL ou alcance ampliado e menor agressividade no EASY. |

## src/js/toy-room/ArenaEnemies.js

[Implementação](../src/js/toy-room/ArenaEnemies.js). Contratos exportados/reexportados: `ARENA_ENEMIES`, `renderArenaEnemyPresence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderArenaEnemyPresence(ctx, enemy, ground)` | Função | [8](../src/js/toy-room/ArenaEnemies.js#L8) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ArenaEnemyAI.js

[Implementação](../src/js/toy-room/ArenaEnemyAI.js). Contratos exportados/reexportados: `selectArenaEnemyAttack`, `updateArenaEnemyAI`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | [15](../src/js/toy-room/ArenaEnemyAI.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updatePlayerBehavior(battle, dt)` | Função | [17](../src/js/toy-room/ArenaEnemyAI.js#L17) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `selectArenaEnemyAttack(battle, distance, attacks)` | Função | [36](../src/js/toy-room/ArenaEnemyAI.js#L36) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateArenaEnemyAI(battle, dt)` | Função | [69](../src/js/toy-room/ArenaEnemyAI.js#L69) | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/toy-room/ArenaEnvironment.js

[Implementação](../src/js/toy-room/ArenaEnvironment.js). Contratos exportados/reexportados: `renderArenaEnvironment`, `renderArenaTemple`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderArenaRoom(ctx, room, arena)` | Função | [6](../src/js/toy-room/ArenaEnvironment.js#L6) | Compõe parede, madeira repetida e rodapé existentes, sem alterar colisões. |
| `renderArenaStructure(ctx, room, structure)` | Função | [42](../src/js/toy-room/ArenaEnvironment.js#L42) | Apoia o móvel na base visual do layout e reutiliza sua ilustração. |
| `renderArenaEnvironment(ctx, room, arena, time = 0)` | Função | [61](../src/js/toy-room/ArenaEnvironment.js#L61) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderArenaTemple(ctx, room, arena, foreground = false)` | Função | [83](../src/js/toy-room/ArenaEnvironment.js#L83) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ArenaGirlAnimationFrames.js

[Implementação](../src/js/toy-room/ArenaGirlAnimationFrames.js). Contratos exportados/reexportados: `ARENA_GIRL_REFERENCE_HEIGHT`, `ARENA_GIRL_ANIMATION_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/ArenaHUD.js

[Implementação](../src/js/toy-room/ArenaHUD.js). Contratos exportados/reexportados: `ARENA_ENEMY_NAMES`, `arenaHUDLayout`, `renderArenaHUD`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaHUDLayout(layout)` | Função | [6](../src/js/toy-room/ArenaHUD.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderArenaMobileControls(ctx, layout, room, state)` | Função | [16](../src/js/toy-room/ArenaHUD.js#L16) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawAction(button, title, badge, special = false)` | Função atribuída | [41](../src/js/toy-room/ArenaHUD.js#L41) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderArenaHUD(ctx, room, state, layout, boss = null)` | Função | [60](../src/js/toy-room/ArenaHUD.js#L60) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `bar(b,hp,max,color,reverse)` | Função atribuída | [67](../src/js/toy-room/ArenaHUD.js#L67) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaPlayerAnimation.js

[Implementação](../src/js/toy-room/ArenaPlayerAnimation.js). Contratos exportados/reexportados: `ARENA_ATTACK_VISUAL_DURATION`, `createPlayerAnimation`, `beginArenaPlayerAttack`, `updateArenaPlayerAnimation`, `sampleArenaPlayerAnimation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createPlayerAnimation(state = {}, player = {})` | Função | [8](../src/js/toy-room/ArenaPlayerAnimation.js#L8) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `beginArenaPlayerAttack(state, direction)` | Função | [18](../src/js/toy-room/ArenaPlayerAnimation.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateArenaPlayerAnimation(state, player, dt)` | Função | [26](../src/js/toy-room/ArenaPlayerAnimation.js#L26) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `layer(pose,index=0,weight=1)` | Função atribuída | [51](../src/js/toy-room/ArenaPlayerAnimation.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pair(from,to,weight)` | Função atribuída | [52](../src/js/toy-room/ArenaPlayerAnimation.js#L52) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cycle(pose,time,durations)` | Função | [54](../src/js/toy-room/ArenaPlayerAnimation.js#L54) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `poseLayers(pose,time,a,state)` | Função | [62](../src/js/toy-room/ArenaPlayerAnimation.js#L62) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sampleArenaPlayerAnimation(state, player)` | Função | [102](../src/js/toy-room/ArenaPlayerAnimation.js#L102) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaPlayerController.js

[Implementação](../src/js/toy-room/ArenaPlayerController.js). Contratos exportados/reexportados: `ARENA_TUNING`, `ArenaPlayerController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `update(battle, dt)` | Método declarado | [13](../src/js/toy-room/ArenaPlayerController.js#L13) | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/toy-room/ArenaPlayerRenderer.js

[Implementação](../src/js/toy-room/ArenaPlayerRenderer.js). Contratos exportados/reexportados: `ArenaPlayerRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [8](../src/js/toy-room/ArenaPlayerRenderer.js#L8) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [9](../src/js/toy-room/ArenaPlayerRenderer.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(ctx,room,state,ground)` | Método declarado | [21](../src/js/toy-room/ArenaPlayerRenderer.js#L21) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderSpecialCloseup(ctx,canvas,state)` | Método declarado | [55](../src/js/toy-room/ArenaPlayerRenderer.js#L55) | Apresenta o close dramático usando a textura pré-carregada com as poses da menina. |
| `renderSwordArc(ctx,sample,reachScale=1)` | Método declarado | [58](../src/js/toy-room/ArenaPlayerRenderer.js#L58) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ArenaScale.js

[Implementação](../src/js/toy-room/ArenaScale.js). Contratos exportados/reexportados: `ARENA_SCALE`, `ARENA_PLAYER_HEIGHT`, `arenaActorBounds`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaActorBounds(x, ground, jump = 0, height = ARENA_PLAYER_HEIGHT, width = height * 1.3)` | Função | [4](../src/js/toy-room/ArenaScale.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaSoundEffects.js

[Implementação](../src/js/toy-room/ArenaSoundEffects.js). Contratos exportados/reexportados: `ARENA_SOUND_FILES`, `ArenaSoundEffects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [22](../src/js/toy-room/ArenaSoundEffects.js#L22) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `preload(ctx)` | Método declarado | [24](../src/js/toy-room/ArenaSoundEffects.js#L24) | Pré-carrega entradas de imagens do manifesto. |
| `stop(channel)` | Método declarado | [38](../src/js/toy-room/ArenaSoundEffects.js#L38) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `play(ctx, destination, event)` | Método declarado | [46](../src/js/toy-room/ArenaSoundEffects.js#L46) | Aciona o som/cue correspondente ou sua delegação de áudio. |

## src/js/toy-room/ArenaSpecialAttack.js

[Implementação](../src/js/toy-room/ArenaSpecialAttack.js). Contratos exportados/reexportados: `ARENA_SPECIAL`, `RAINBOW_COLORS`, `beginArenaSpecial`, `updateArenaSpecial`, `specialCameraFrame`, `renderSpecialSwordAura`, `renderArenaSpecialBeam`, `ARENA_SPECIAL_CLOSEUP_FILE`, `renderArenaSpecialCloseup`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `beginArenaSpecial(battle)` | Função | [7](../src/js/toy-room/ArenaSpecialAttack.js#L7) | Consome o uso único e inicia a carga da espada na arena quando a ativação é válida. |
| `updateArenaSpecial(battle, dt)` | Função | [25](../src/js/toy-room/ArenaSpecialAttack.js#L25) | Avança a encenação com física/IA suspensas e aplica dano único na chegada do raio. |
| `specialCameraFrame(frame, room, state)` | Função | [58](../src/js/toy-room/ArenaSpecialAttack.js#L58) | Aproxima do rosto durante a carga e retorna ao panorama antes do corte. |
| `renderSpecialSwordAura(ctx, state)` | Função | [73](../src/js/toy-room/ArenaSpecialAttack.js#L73) | Envolve a lâmina existente em sete cores e partículas sem redesenhar o sprite. |
| `renderArenaSpecialBeam(ctx, room, state, ground)` | Função | [100](../src/js/toy-room/ArenaSpecialAttack.js#L100) | Desenha a viagem do raio até o alvo e os anéis do impacto, sem alterar estado. |
| `renderArenaSpecialCloseup(ctx, canvas, state, image)` | Função | [129](../src/js/toy-room/ArenaSpecialAttack.js#L129) | Compõe um corte de anime com ambos os olhos, entrada/saída rápidas e energia; não avança a simulação. |

## src/js/toy-room/BattleAssets.js

[Implementação](../src/js/toy-room/BattleAssets.js). Contratos exportados/reexportados: `loadBattleManifest`, `loadBattleImages`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `loadBattleManifest()` | Função | [8](../src/js/toy-room/BattleAssets.js#L8) | Carrega o manifesto de remediação e substitui as sequências Hit pelos quadros nativos de dano. |
| `loadBattleImages(manifest, images)` | Função | [19](../src/js/toy-room/BattleAssets.js#L19) | Preenche o cache de imagens da batalha, com erro explícito para recursos ausentes. |

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
| `rocketPunchProjection(frame, reference, elapsed, signedDistance, target=null)` | Função | [9](../src/js/toy-room/BattlePresentation.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rocketPunchTouchesPlayer(frame, reference, elapsed, signedDistance, target)` | Função | [51](../src/js/toy-room/BattlePresentation.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderRocketPunch(ctx, image, frame, reference, elapsed, signedDistance,target=null)` | Função | [81](../src/js/toy-room/BattlePresentation.js#L81) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderBattleCrouch(ctx,image,player,attackTime,attackDirection)` | Função | [103](../src/js/toy-room/BattlePresentation.js#L103) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `playerModel(state,player,attackDirection)` | Função | [114](../src/js/toy-room/BattlePresentation.js#L114) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `battlePlayerJumpOffset(state,player,attackDirection)` | Função | [120](../src/js/toy-room/BattlePresentation.js#L120) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `laserProjection(state,player,enemy,attackDirection)` | Função | [124](../src/js/toy-room/BattlePresentation.js#L124) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `trainDrive(elapsed)` | Função | [142](../src/js/toy-room/BattlePresentation.js#L142) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderTrainWalk(ctx,body,parts,elapsed,transportScale=1)` | Função | [146](../src/js/toy-room/BattlePresentation.js#L146) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/BattleRenderer.js

[Implementação](../src/js/toy-room/BattleRenderer.js). Contratos exportados/reexportados: `battleAnimationFrame`, `renderBattle`, `renderBattleImpact`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n, a, b)` | Função atribuída | [9](../src/js/toy-room/BattleRenderer.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `battleAnimationFrame(animation, enemy, duration, tuning = BATTLE_TUNING)` | Função | [12](../src/js/toy-room/BattleRenderer.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderBattle(battle)` | Função | [24](../src/js/toy-room/BattleRenderer.js#L24) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `hearts(hp, max)` | Função atribuída | [137](../src/js/toy-room/BattleRenderer.js#L137) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderBattleImpact(ctx, impact)` | Função | [170](../src/js/toy-room/BattleRenderer.js#L170) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/DamageAudio.js

[Implementação](../src/js/toy-room/DamageAudio.js). Contratos exportados/reexportados: `DAMAGE_AUDIO_PROFILES`, `scheduleDamageSound`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `scheduleDamageSound(ctx, destination, register, actor, arena = false)` | Função | [10](../src/js/toy-room/DamageAudio.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `connectVoice(source, nodes, start, end)` | Função atribuída | [15](../src/js/toy-room/DamageAudio.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `envelope(volume, start, duration, attack = 0.004)` | Função atribuída | [25](../src/js/toy-room/DamageAudio.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/DamageSpriteFrames.js

[Implementação](../src/js/toy-room/DamageSpriteFrames.js). Contratos exportados/reexportados: `DAMAGE_SPRITE_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/EnemyMovementAudio.js

[Implementação](../src/js/toy-room/EnemyMovementAudio.js). Contratos exportados/reexportados: `scheduleEnemyMovement`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `scheduleEnemyMovement(ctx,destination,register,actor)` | Função | [2](../src/js/toy-room/EnemyMovementAudio.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ImpactFX.js

[Implementação](../src/js/toy-room/ImpactFX.js). Contratos exportados/reexportados: `ImpactFX`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [4](../src/js/toy-room/ImpactFX.js#L4) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `emit(kind, x, y, heavy = false)` | Método declarado | [5](../src/js/toy-room/ImpactFX.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [19](../src/js/toy-room/ImpactFX.js#L19) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render(ctx)` | Método declarado | [25](../src/js/toy-room/ImpactFX.js#L25) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | [39](../src/js/toy-room/ImpactFX.js#L39) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [40](../src/js/toy-room/ImpactFX.js#L40) | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/PlayerController.js

[Implementação](../src/js/toy-room/PlayerController.js). Contratos exportados/reexportados: `PlayerController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | [3](../src/js/toy-room/PlayerController.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(battle, dt)` | Método declarado | [7](../src/js/toy-room/PlayerController.js#L7) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `faceEnemy()` | Função atribuída | [24](../src/js/toy-room/PlayerController.js#L24) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/RoomEnvironmentRenderer.js

[Implementação](../src/js/toy-room/RoomEnvironmentRenderer.js). Contratos exportados/reexportados: `RoomEnvironmentRenderer`, `roomEnvironmentRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderBackground(ctx, roomW, roomH, options = {})` | Método declarado | [31](../src/js/toy-room/RoomEnvironmentRenderer.js#L31) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawWoodStrip(ctx, image, x, y, width, height, plain = false)` | Método declarado | [157](../src/js/toy-room/RoomEnvironmentRenderer.js#L157) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawWoodTrim(ctx, image, roomW, roomH)` | Método declarado | [166](../src/js/toy-room/RoomEnvironmentRenderer.js#L166) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderPerspectiveFloor(ctx, tile, roomW, roomH)` | Método declarado | [181](../src/js/toy-room/RoomEnvironmentRenderer.js#L181) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawArchedWindow(ctx, wx, wy, windowImage = null)` | Método declarado | [217](../src/js/toy-room/RoomEnvironmentRenderer.js#L217) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawEntrancePortal(ctx, dx, dy, environmentDoor = null)` | Método declarado | [278](../src/js/toy-room/RoomEnvironmentRenderer.js#L278) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawCentralMandalaRug(ctx, cx, cy)` | Método declarado | [307](../src/js/toy-room/RoomEnvironmentRenderer.js#L307) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFloralPlayMat(ctx, rx, ry, rugImage = null)` | Método declarado | [354](../src/js/toy-room/RoomEnvironmentRenderer.js#L354) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBedsideFringeRug(ctx, bx, by, rugImage = null)` | Método declarado | [403](../src/js/toy-room/RoomEnvironmentRenderer.js#L403) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `traceTrainCircuit(ctx)` | Método declarado | [433](../src/js/toy-room/RoomEnvironmentRenderer.js#L433) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createWoodenTrackLayer(image)` | Método declarado | [437](../src/js/toy-room/RoomEnvironmentRenderer.js#L437) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `drawTrainTracks(ctx, trackImage = null)` | Método declarado | [494](../src/js/toy-room/RoomEnvironmentRenderer.js#L494) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFurniture(ctx, f, options = {})` | Método declarado | [539](../src/js/toy-room/RoomEnvironmentRenderer.js#L539) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/SwordAudio.js

[Implementação](../src/js/toy-room/SwordAudio.js). Contratos exportados/reexportados: `scheduleSwordSound`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `scheduleSwordSound(ctx, destination, register, event)` | Função | [2](../src/js/toy-room/SwordAudio.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `voice(source, nodes, duration, delay = 0)` | Função atribuída | [6](../src/js/toy-room/SwordAudio.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `envelope(volume, duration, attack = 0.003, delay = 0)` | Função atribuída | [18](../src/js/toy-room/SwordAudio.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `noise(volume, duration, frequency, end, attack = 0.003)` | Função atribuída | [25](../src/js/toy-room/SwordAudio.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tone(frequency, end, volume, duration, type = 'sine', delay = 0)` | Função atribuída | [38](../src/js/toy-room/SwordAudio.js#L38) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyCarryPresentation.js

[Implementação](../src/js/toy-room/ToyCarryPresentation.js). Contratos exportados/reexportados: `CARRY_PROFILES`, `renderToyCarry`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `carriedSprite(toy, options)` | Função | [20](../src/js/toy-room/ToyCarryPresentation.js#L20) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderToyCarry(ctx, player, options = {})` | Função | [38](../src/js/toy-room/ToyCarryPresentation.js#L38) | Compõe pose, brinquedo e contatos visuais usando CARRY_PROFILES; sem pose/item devolve false. |
| `drawBody()` | Função atribuída | [57](../src/js/toy-room/ToyCarryPresentation.js#L57) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRenderer.js

[Implementação](../src/js/toy-room/ToyRenderer.js). Contratos exportados/reexportados: `ToyRenderer`, `toyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToy(ctx, t, playerX = 0, playerY = 0, isCarrying = false, time = performance.now(), options = {})` | Método declarado | [19](../src/js/toy-room/ToyRenderer.js#L19) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomArenaBuilder.js

[Implementação](../src/js/toy-room/ToyRoomArenaBuilder.js). Contratos exportados/reexportados: `ToyRoomArenaBuilder`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `build({ furniture, ROOM_W = 1600 })` | Método declarado | [5](../src/js/toy-room/ToyRoomArenaBuilder.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomArenaPhase.js

[Implementação](../src/js/toy-room/ToyRoomArenaPhase.js). Contratos exportados/reexportados: `ARENA_TRANSFORMATION_DURATION`, `ARENA_VICTORY_FADE_DURATION`, `ToyRoomArenaPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(room)` | Método declarado | [23](../src/js/toy-room/ToyRoomArenaPhase.js#L23) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `active()` | Acessor | [38](../src/js/toy-room/ToyRoomArenaPhase.js#L38) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `start()` | Método declarado | [40](../src/js/toy-room/ToyRoomArenaPhase.js#L40) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `configurePresentation()` | Método declarado | [51](../src/js/toy-room/ToyRoomArenaPhase.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderHUD(ctx, layout, state)` | API/lambda de objeto | [66](../src/js/toy-room/ToyRoomArenaPhase.js#L66) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `onImpact(x, y, heavy)` | API/lambda de objeto | [74](../src/js/toy-room/ToyRoomArenaPhase.js#L74) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onBlock(x, y)` | API/lambda de objeto | [75](../src/js/toy-room/ToyRoomArenaPhase.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `transportOrigin()` | API/lambda de objeto | [78](../src/js/toy-room/ToyRoomArenaPhase.js#L78) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderPlayer(ctx, state, ground)` | API/lambda de objeto | [81](../src/js/toy-room/ToyRoomArenaPhase.js#L81) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `restoreReality({ resumeAudio = true } = {})` | Método declarado | [86](../src/js/toy-room/ToyRoomArenaPhase.js#L86) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `finish()` | Método declarado | [105](../src/js/toy-room/ToyRoomArenaPhase.js#L105) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `beginReturn()` | Método declarado | [114](../src/js/toy-room/ToyRoomArenaPhase.js#L114) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt = 1)` | Método declarado | [125](../src/js/toy-room/ToyRoomArenaPhase.js#L125) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [171](../src/js/toy-room/ToyRoomArenaPhase.js#L171) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | [209](../src/js/toy-room/ToyRoomArenaPhase.js#L209) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved, roomSave = null)` | Método declarado | [210](../src/js/toy-room/ToyRoomArenaPhase.js#L210) | Reaplica a captura específica; confira referências e dados transitórios. |
| `attack()` | Método declarado | [239](../src/js/toy-room/ToyRoomArenaPhase.js#L239) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retry()` | Método declarado | [250](../src/js/toy-room/ToyRoomArenaPhase.js#L250) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `special()` | Método declarado | [257](../src/js/toy-room/ToyRoomArenaPhase.js#L257) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomBattle.js

[Implementação](../src/js/toy-room/ToyRoomBattle.js). Contratos exportados/reexportados: `transferHeart`, `ToyRoomBattle`, `BATTLE_ORDER`, `BATTLE_PLAYER_VISUAL_SCALE`, `BATTLE_TUNING`, `BATTLE_TRANSITION_DURATION`, `battleAnimationFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n, a, b)` | Função atribuída | [14](../src/js/toy-room/ToyRoomBattle.js#L14) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `transferHeart(victim, attacker)` | Função | [17](../src/js/toy-room/ToyRoomBattle.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor(room, { loadAssets = true } = {})` | Método declarado | [25](../src/js/toy-room/ToyRoomBattle.js#L25) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [37](../src/js/toy-room/ToyRoomBattle.js#L37) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `activate()` | Método declarado | [45](../src/js/toy-room/ToyRoomBattle.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `spawn()` | Método declarado | [65](../src/js/toy-room/ToyRoomBattle.js#L65) | Cria partículas/efeitos no buffer correspondente. |
| `getEnemyCollisionDistance(actor)` | Método declarado | [73](../src/js/toy-room/ToyRoomBattle.js#L73) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getSwordRange(actor = this.state.enemy.actor)` | Método declarado | [85](../src/js/toy-room/ToyRoomBattle.js#L85) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `swordContactPoint(dx, facing)` | Método declarado | [91](../src/js/toy-room/ToyRoomBattle.js#L91) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resolveActorBodies(side)` | Método declarado | [99](../src/js/toy-room/ToyRoomBattle.js#L99) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaChest()` | Método declarado | [119](../src/js/toy-room/ToyRoomBattle.js#L119) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginTransition(outgoing)` | Método declarado | [124](../src/js/toy-room/ToyRoomBattle.js#L124) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `transitionPlacement(incoming)` | Método declarado | [135](../src/js/toy-room/ToyRoomBattle.js#L135) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `input()` | Método declarado | [162](../src/js/toy-room/ToyRoomBattle.js#L162) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attack()` | Método declarado | [180](../src/js/toy-room/ToyRoomBattle.js#L180) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `faceEnemy()` | Método declarado | [201](../src/js/toy-room/ToyRoomBattle.js#L201) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playCombatSound(sound)` | Método declarado | [210](../src/js/toy-room/ToyRoomBattle.js#L210) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setEnemyState(state)` | Método declarado | [217](../src/js/toy-room/ToyRoomBattle.js#L217) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `beginEnemyAttack(attack)` | Método declarado | [224](../src/js/toy-room/ToyRoomBattle.js#L224) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyGuarding()` | Método declarado | [244](../src/js/toy-room/ToyRoomBattle.js#L244) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginEnemyResponse()` | Método declarado | [248](../src/js/toy-room/ToyRoomBattle.js#L248) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startImpact(target, x, y, direction, heavy)` | Método declarado | [256](../src/js/toy-room/ToyRoomBattle.js#L256) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | [265](../src/js/toy-room/ToyRoomBattle.js#L265) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `step(dt)` | Método declarado | [296](../src/js/toy-room/ToyRoomBattle.js#L296) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyPose(e = this.state.enemy)` | Método declarado | [527](../src/js/toy-room/ToyRoomBattle.js#L527) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Método declarado | [532](../src/js/toy-room/ToyRoomBattle.js#L532) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderImpact(ctx, impact)` | Método declarado | [534](../src/js/toy-room/ToyRoomBattle.js#L534) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | [536](../src/js/toy-room/ToyRoomBattle.js#L536) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [537](../src/js/toy-room/ToyRoomBattle.js#L537) | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ToyRoomCamera.js

[Implementação](../src/js/toy-room/ToyRoomCamera.js). Contratos exportados/reexportados: `updateToyRoomCamera`, `getToyRoomCameraFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateToyRoomCamera({ target, canvas, width, height, cameraX, cameraY }, dt)` | Função | [5](../src/js/toy-room/ToyRoomCamera.js#L5) | Calcula coordenadas da câmera da sala a partir do alvo narrativo explícito. |
| `getToyRoomCameraFrame({ target, canvas, cameraX, cameraY, mobilePresentation })` | Função | [25](../src/js/toy-room/ToyRoomCamera.js#L25) | Calcula zoom e enquadramento da sala com alvo/câmera/layout atuais. |

## src/js/toy-room/ToyRoomCompanion.js

[Implementação](../src/js/toy-room/ToyRoomCompanion.js). Contratos exportados/reexportados: `updateToyRoomCompanion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateToyRoomCompanion({ player, fairy, toys, tutorial, story, gameDifficulty, guideToy }, dt)` | Função | [5](../src/js/toy-room/ToyRoomCompanion.js#L5) | Atualiza guia, tutorial, voo e rastro da fada; devolve o brinquedo-guia atual. |

## src/js/toy-room/ToyRoomEffects.js

[Implementação](../src/js/toy-room/ToyRoomEffects.js). Contratos exportados/reexportados: `spawnToyRoomSparkles`, `spawnToyRoomConfetti`, `initializeToyRoomSunMotes`, `updateToyRoomEffects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `spawnToyRoomSparkles(sparkles, x, y, count = 12, hue = '#facc15')` | Função | [2](../src/js/toy-room/ToyRoomEffects.js#L2) | Cria partículas/efeitos no buffer correspondente. |
| `spawnToyRoomConfetti(confetti, x, y, count = 35)` | Função | [19](../src/js/toy-room/ToyRoomEffects.js#L19) | Cria partículas/efeitos no buffer correspondente. |
| `initializeToyRoomSunMotes(sunMotes, width, height)` | Função | [41](../src/js/toy-room/ToyRoomEffects.js#L41) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateToyRoomEffects({ chest, sparkles, confetti, footstepPuffs, sunMotes, width, height }, dt)` | Função | [56](../src/js/toy-room/ToyRoomEffects.js#L56) | Avança coleções de partículas e animação do baú recebidas no quadro. |

## src/js/toy-room/ToyRoomEntities.js

[Implementação](../src/js/toy-room/ToyRoomEntities.js). Contratos exportados/reexportados: `ToyRoomEntities`, `toyRoomEntities`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderPlayer(ctx, player, options = {})` | Método declarado | [13](../src/js/toy-room/ToyRoomEntities.js#L13) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFairy(ctx, fairy, options = {})` | Método declarado | [28](../src/js/toy-room/ToyRoomEntities.js#L28) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomEnvironmentAssets.js

[Implementação](../src/js/toy-room/ToyRoomEnvironmentAssets.js). Contratos exportados/reexportados: `createToyRoomEnvironmentAssets`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomEnvironmentAssets(assets)` | Função | [2](../src/js/toy-room/ToyRoomEnvironmentAssets.js#L2) | Resolve recortes ambientais existentes sem acessar regras ou estado da exploração. |

## src/js/toy-room/ToyRoomInitialEntities.js

[Implementação](../src/js/toy-room/ToyRoomInitialEntities.js). Contratos exportados/reexportados: `createToyRoomInitialEntities`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomInitialEntities()` | Função | [2](../src/js/toy-room/ToyRoomInitialEntities.js#L2) | Cria jogador, fada, móveis e brinquedos independentes por instância, preservando o catálogo. |

## src/js/toy-room/ToyRoomInputBindings.js

[Implementação](../src/js/toy-room/ToyRoomInputBindings.js). Contratos exportados/reexportados: `TOY_ROOM_INPUT`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/ToyRoomInputContext.js

[Implementação](../src/js/toy-room/ToyRoomInputContext.js). Contratos exportados/reexportados: `createToyRoomInputContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomInputContext(room)` | Função | [2](../src/js/toy-room/ToyRoomInputContext.js#L2) | Adapta entrada, Canvas e callbacks sem copiar os dados usados por HUD/combate. |
| `keysDown()` | Acessor | [5](../src/js/toy-room/ToyRoomInputContext.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `keysDown(value)` | Acessor | [6](../src/js/toy-room/ToyRoomInputContext.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isTouchDevice()` | Acessor | [7](../src/js/toy-room/ToyRoomInputContext.js#L7) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isTouchDevice(value)` | Acessor | [8](../src/js/toy-room/ToyRoomInputContext.js#L8) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `actionBtnPressed()` | Acessor | [9](../src/js/toy-room/ToyRoomInputContext.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actionBtnPressed(value)` | Acessor | [10](../src/js/toy-room/ToyRoomInputContext.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `touchState()` | Acessor | [11](../src/js/toy-room/ToyRoomInputContext.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gamepadState()` | Acessor | [12](../src/js/toy-room/ToyRoomInputContext.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaTouchPointers()` | Acessor | [13](../src/js/toy-room/ToyRoomInputContext.js#L13) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaTouchButtons()` | Acessor | [14](../src/js/toy-room/ToyRoomInputContext.js#L14) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaSpecialButtons()` | Acessor | [15](../src/js/toy-room/ToyRoomInputContext.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canvas()` | Acessor | [17](../src/js/toy-room/ToyRoomInputContext.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | [18](../src/js/toy-room/ToyRoomInputContext.js#L18) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `mobile()` | Acessor | [19](../src/js/toy-room/ToyRoomInputContext.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `device()` | Acessor | [20](../src/js/toy-room/ToyRoomInputContext.js#L20) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handlers()` | Acessor | [21](../src/js/toy-room/ToyRoomInputContext.js#L21) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `isEnabled()` | API/lambda de objeto | [28](../src/js/toy-room/ToyRoomInputContext.js#L28) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isLocked()` | API/lambda de objeto | [29](../src/js/toy-room/ToyRoomInputContext.js#L29) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isArenaCombat()` | API/lambda de objeto | [30](../src/js/toy-room/ToyRoomInputContext.js#L30) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `initAudio()` | API/lambda de objeto | [32](../src/js/toy-room/ToyRoomInputContext.js#L32) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `action()` | API/lambda de objeto | [33](../src/js/toy-room/ToyRoomInputContext.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `special()` | API/lambda de objeto | [34](../src/js/toy-room/ToyRoomInputContext.js#L34) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomInputController.js

[Implementação](../src/js/toy-room/ToyRoomInputController.js). Contratos exportados/reexportados: `ToyRoomInputController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | [6](../src/js/toy-room/ToyRoomInputController.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setupListeners()` | Método declarado | [11](../src/js/toy-room/ToyRoomInputController.js#L11) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getCanvasCoordinates(e)` | Método declarado | [31](../src/js/toy-room/ToyRoomInputController.js#L31) | Converte evento de ponteiro para coordenadas internas da sala. |
| `isActionButtonHit(coords)` | Método declarado | [49](../src/js/toy-room/ToyRoomInputController.js#L49) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `handleKeyDown(e)` | Método declarado | [53](../src/js/toy-room/ToyRoomInputController.js#L53) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyUp(e)` | Método declarado | [71](../src/js/toy-room/ToyRoomInputController.js#L71) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | [75](../src/js/toy-room/ToyRoomInputController.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onPointerDown(e)` | Método declarado | [113](../src/js/toy-room/ToyRoomInputController.js#L113) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerMove(e)` | Método declarado | [182](../src/js/toy-room/ToyRoomInputController.js#L182) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerUp(e)` | Método declarado | [222](../src/js/toy-room/ToyRoomInputController.js#L222) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `clearInput()` | Método declarado | [250](../src/js/toy-room/ToyRoomInputController.js#L250) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `refreshArenaTouchButtons()` | Método declarado | [261](../src/js/toy-room/ToyRoomInputController.js#L261) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `removeListeners()` | Método declarado | [271](../src/js/toy-room/ToyRoomInputController.js#L271) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomInteraction.js

[Implementação](../src/js/toy-room/ToyRoomInteraction.js). Contratos exportados/reexportados: `ToyRoomInteraction`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | [5](../src/js/toy-room/ToyRoomInteraction.js#L5) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `triggerAction()` | Método declarado | [7](../src/js/toy-room/ToyRoomInteraction.js#L7) | Processa interação contextual da sala: pegar ou entregar ao baú; prioriza espada/combate e não oferece soltura manual. |
| `updateProximity()` | Método declarado | [95](../src/js/toy-room/ToyRoomInteraction.js#L95) | Atualiza disponibilidade de interação antes do movimento e devolve o baú atual. |

## src/js/toy-room/ToyRoomInteractionContext.js

[Implementação](../src/js/toy-room/ToyRoomInteractionContext.js). Contratos exportados/reexportados: `createToyRoomInteractionContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomInteractionContext(room)` | Função | [2](../src/js/toy-room/ToyRoomInteractionContext.js#L2) | Fornece referências atuais e efeitos específicos para as decisões de interação. |
| `ACTION_DEBOUNCE_MS()` | Acessor | [4](../src/js/toy-room/ToyRoomInteractionContext.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ROOM_H()` | Acessor | [5](../src/js/toy-room/ToyRoomInteractionContext.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ROOM_W()` | Acessor | [6](../src/js/toy-room/ToyRoomInteractionContext.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arena()` | Acessor | [7](../src/js/toy-room/ToyRoomInteractionContext.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `audio()` | Acessor | [8](../src/js/toy-room/ToyRoomInteractionContext.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `battle()` | Acessor | [9](../src/js/toy-room/ToyRoomInteractionContext.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canInteract()` | Acessor | [10](../src/js/toy-room/ToyRoomInteractionContext.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canInteract(value)` | Acessor | [11](../src/js/toy-room/ToyRoomInteractionContext.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture()` | Acessor | [12](../src/js/toy-room/ToyRoomInteractionContext.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isInputEnabled(...args)` | API/lambda de objeto | [13](../src/js/toy-room/ToyRoomInteractionContext.js#L13) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isNearChest()` | Acessor | [14](../src/js/toy-room/ToyRoomInteractionContext.js#L14) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isNearChest(value)` | Acessor | [15](../src/js/toy-room/ToyRoomInteractionContext.js#L15) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `lastActionTime()` | Acessor | [16](../src/js/toy-room/ToyRoomInteractionContext.js#L16) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `lastActionTime(value)` | Acessor | [17](../src/js/toy-room/ToyRoomInteractionContext.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount()` | Acessor | [18](../src/js/toy-room/ToyRoomInteractionContext.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount(value)` | Acessor | [19](../src/js/toy-room/ToyRoomInteractionContext.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | [20](../src/js/toy-room/ToyRoomInteractionContext.js#L20) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `spawnConfetti(...args)` | API/lambda de objeto | [21](../src/js/toy-room/ToyRoomInteractionContext.js#L21) | Cria partículas/efeitos no buffer correspondente. |
| `spawnSparkles(...args)` | API/lambda de objeto | [22](../src/js/toy-room/ToyRoomInteractionContext.js#L22) | Cria partículas/efeitos no buffer correspondente. |
| `story()` | Acessor | [23](../src/js/toy-room/ToyRoomInteractionContext.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | [24](../src/js/toy-room/ToyRoomInteractionContext.js#L24) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tutorial()` | Acessor | [25](../src/js/toy-room/ToyRoomInteractionContext.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `uiFeedback()` | Acessor | [26](../src/js/toy-room/ToyRoomInteractionContext.js#L26) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive()` | Acessor | [27](../src/js/toy-room/ToyRoomInteractionContext.js#L27) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive(value)` | Acessor | [28](../src/js/toy-room/ToyRoomInteractionContext.js#L28) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer()` | Acessor | [29](../src/js/toy-room/ToyRoomInteractionContext.js#L29) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer(value)` | Acessor | [30](../src/js/toy-room/ToyRoomInteractionContext.js#L30) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomLighting.js

[Implementação](../src/js/toy-room/ToyRoomLighting.js). Contratos exportados/reexportados: `TOY_ROOM_WINDOWS`, `getToyRoomFloorLight`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getToyRoomFloorLight(x, y)` | Função | [7](../src/js/toy-room/ToyRoomLighting.js#L7) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/toy-room/ToyRoomMovement.js

[Implementação](../src/js/toy-room/ToyRoomMovement.js). Contratos exportados/reexportados: `updateToyRoomMovement`, `resolveToyRoomCollisions`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateToyRoomMovement({ player, keysDown, gamepadState, touchState, footstepPuffs, resolveCollisions }, dt)` | Função | [2](../src/js/toy-room/ToyRoomMovement.js#L2) | Aplica prioridade das entradas, peso, orientação, passos e integração da exploração. |
| `resolveToyRoomCollisions({ width, height, furniture }, px, py, r)` | Função | [78](../src/js/toy-room/ToyRoomMovement.js#L78) | Limita a posição e resolve móveis na ordem original, conservando o desempate de penetrações. |

## src/js/toy-room/ToyRoomOrientation.js

[Implementação](../src/js/toy-room/ToyRoomOrientation.js). Contratos exportados/reexportados: `nearestToyGuide`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `nearestToyGuide(player, toys, previous)` | Função | [2](../src/js/toy-room/ToyRoomOrientation.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomPersistence.js

[Implementação](../src/js/toy-room/ToyRoomPersistence.js). Contratos exportados/reexportados: `ToyRoomPersistence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | [3](../src/js/toy-room/ToyRoomPersistence.js#L3) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `snapshot({ includeArena = true } = {})` | Método declarado | [5](../src/js/toy-room/ToyRoomPersistence.js#L5) | Copia exploração, religa carregado por ID e inclui arena/perseguição/jardim/epílogo conforme origem e includeArena. |
| `restore(saved, { preserveArena = false } = {})` | Método declarado | [20](../src/js/toy-room/ToyRoomPersistence.js#L20) | Reaplica exploração e atores, limpa entrada e prioriza jardim, epílogo, perseguição, arena, batalha e tutorial; preserveArena evita reconstrução recursiva. |

## src/js/toy-room/ToyRoomPersistenceContext.js

[Implementação](../src/js/toy-room/ToyRoomPersistenceContext.js). Contratos exportados/reexportados: `createToyRoomPersistenceContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomPersistenceContext(room)` | Função | [2](../src/js/toy-room/ToyRoomPersistenceContext.js#L2) | Adapta campos serializados e retomada dos subsistemas, inclusive após substituição dos atores. |
| `dream()` | Acessor | [4](../src/js/toy-room/ToyRoomPersistenceContext.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `epilogue()` | Acessor | [5](../src/js/toy-room/ToyRoomPersistenceContext.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `epilogue(value)` | Acessor | [6](../src/js/toy-room/ToyRoomPersistenceContext.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arena()` | Acessor | [8](../src/js/toy-room/ToyRoomPersistenceContext.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `battle()` | Acessor | [9](../src/js/toy-room/ToyRoomPersistenceContext.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `garden()` | Acessor | [10](../src/js/toy-room/ToyRoomPersistenceContext.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `garden(value)` | Acessor | [11](../src/js/toy-room/ToyRoomPersistenceContext.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chase()` | Acessor | [13](../src/js/toy-room/ToyRoomPersistenceContext.js#L13) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chase(value)` | Acessor | [14](../src/js/toy-room/ToyRoomPersistenceContext.js#L14) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraX()` | Acessor | [15](../src/js/toy-room/ToyRoomPersistenceContext.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraX(value)` | Acessor | [16](../src/js/toy-room/ToyRoomPersistenceContext.js#L16) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraY()` | Acessor | [17](../src/js/toy-room/ToyRoomPersistenceContext.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraY(value)` | Acessor | [18](../src/js/toy-room/ToyRoomPersistenceContext.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearInput()` | API/lambda de objeto | [19](../src/js/toy-room/ToyRoomPersistenceContext.js#L19) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `fairy()` | Acessor | [20](../src/js/toy-room/ToyRoomPersistenceContext.js#L20) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fairy(value)` | Acessor | [21](../src/js/toy-room/ToyRoomPersistenceContext.js#L21) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture()` | Acessor | [22](../src/js/toy-room/ToyRoomPersistenceContext.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture(value)` | Acessor | [23](../src/js/toy-room/ToyRoomPersistenceContext.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState()` | Acessor | [24](../src/js/toy-room/ToyRoomPersistenceContext.js#L24) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState(value)` | Acessor | [25](../src/js/toy-room/ToyRoomPersistenceContext.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introAlpha()` | Acessor | [26](../src/js/toy-room/ToyRoomPersistenceContext.js#L26) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introAlpha(value)` | Acessor | [27](../src/js/toy-room/ToyRoomPersistenceContext.js#L27) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introBannerTimer()` | Acessor | [28](../src/js/toy-room/ToyRoomPersistenceContext.js#L28) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introBannerTimer(value)` | Acessor | [29](../src/js/toy-room/ToyRoomPersistenceContext.js#L29) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `lastActionTime()` | Acessor | [30](../src/js/toy-room/ToyRoomPersistenceContext.js#L30) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `lastActionTime(value)` | Acessor | [31](../src/js/toy-room/ToyRoomPersistenceContext.js#L31) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount()` | Acessor | [32](../src/js/toy-room/ToyRoomPersistenceContext.js#L32) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount(value)` | Acessor | [33](../src/js/toy-room/ToyRoomPersistenceContext.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | [34](../src/js/toy-room/ToyRoomPersistenceContext.js#L34) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `player(value)` | Acessor | [35](../src/js/toy-room/ToyRoomPersistenceContext.js#L35) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startTutorial()` | API/lambda de objeto | [36](../src/js/toy-room/ToyRoomPersistenceContext.js#L36) | Inicia orientação guiada da Toy Room se ainda não concluída. |
| `story()` | Acessor | [38](../src/js/toy-room/ToyRoomPersistenceContext.js#L38) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted()` | Acessor | [39](../src/js/toy-room/ToyRoomPersistenceContext.js#L39) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted(value)` | Acessor | [40](../src/js/toy-room/ToyRoomPersistenceContext.js#L40) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | [41](../src/js/toy-room/ToyRoomPersistenceContext.js#L41) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys(value)` | Acessor | [42](../src/js/toy-room/ToyRoomPersistenceContext.js#L42) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tutorial()` | Acessor | [43](../src/js/toy-room/ToyRoomPersistenceContext.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive()` | Acessor | [44](../src/js/toy-room/ToyRoomPersistenceContext.js#L44) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive(value)` | Acessor | [45](../src/js/toy-room/ToyRoomPersistenceContext.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer()` | Acessor | [46](../src/js/toy-room/ToyRoomPersistenceContext.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer(value)` | Acessor | [47](../src/js/toy-room/ToyRoomPersistenceContext.js#L47) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomPhase.js

[Implementação](../src/js/toy-room/ToyRoomPhase.js). Contratos exportados/reexportados: `ToyRoomPhase`, `createToyRoom`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, audio, uiFeedback, onReturnToTitle, options = {})` | Método declarado | [39](../src/js/toy-room/ToyRoomPhase.js#L39) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `inputController()` | Acessor | [123](../src/js/toy-room/ToyRoomPhase.js#L123) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setupListeners()` | Método declarado | [130](../src/js/toy-room/ToyRoomPhase.js#L130) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getCanvasCoordinates(e)` | Método declarado | [132](../src/js/toy-room/ToyRoomPhase.js#L132) | Converte evento de ponteiro para coordenadas internas da sala. |
| `isActionButtonHit(coords)` | Método declarado | [134](../src/js/toy-room/ToyRoomPhase.js#L134) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `handleKeyDown(e)` | Método declarado | [136](../src/js/toy-room/ToyRoomPhase.js#L136) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyUp(e)` | Método declarado | [138](../src/js/toy-room/ToyRoomPhase.js#L138) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | [140](../src/js/toy-room/ToyRoomPhase.js#L140) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onPointerDown(e)` | Método declarado | [142](../src/js/toy-room/ToyRoomPhase.js#L142) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerMove(e)` | Método declarado | [144](../src/js/toy-room/ToyRoomPhase.js#L144) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerUp(e)` | Método declarado | [146](../src/js/toy-room/ToyRoomPhase.js#L146) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `clearInput()` | Método declarado | [148](../src/js/toy-room/ToyRoomPhase.js#L148) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `refreshArenaTouchButtons()` | Método declarado | [150](../src/js/toy-room/ToyRoomPhase.js#L150) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `spawnSparkles(x, y, count = 12, hue = '#facc15')` | Método declarado | [152](../src/js/toy-room/ToyRoomPhase.js#L152) | Cria partículas/efeitos no buffer correspondente. |
| `spawnConfetti(x, y, count = 35)` | Método declarado | [156](../src/js/toy-room/ToyRoomPhase.js#L156) | Cria partículas/efeitos no buffer correspondente. |
| `interaction()` | Acessor | [160](../src/js/toy-room/ToyRoomPhase.js#L160) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `triggerAction()` | Método declarado | [166](../src/js/toy-room/ToyRoomPhase.js#L166) | Encaminha ação à exploração somente fora de epílogo, jardim e perseguição. |
| `startChasePreview(saved = null)` | Método declarado | [169](../src/js/toy-room/ToyRoomPhase.js#L169) | Inicia o acesso isolado de debug à perseguição, sem salvar essa fase na campanha. |
| `startChaseCampaign(saved = null)` | Método declarado | [183](../src/js/toy-room/ToyRoomPhase.js#L183) | Prepara a fuga da campanha sob fade, desliga entradas da sala e recupera falhas de preparação. |
| `handleCampaignChaseError(chase, message)` | Método declarado | [209](../src/js/toy-room/ToyRoomPhase.js#L209) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `startEpilogue(saved=null,{campaign=true}={})` | Método declarado | [230](../src/js/toy-room/ToyRoomPhase.js#L230) | Descarta a perseguição, limpa entrada e inicia o epílogo recuperável; o callback abre o jardim com a mesma origem campanha/prévia. |
| `startGarden(saved = null, { campaign = true } = {})` | Método declarado | [237](../src/js/toy-room/ToyRoomPhase.js#L237) | Encerra epílogo/perseguição, remove entradas da sala e inicia GardenPhase com recursos, física e áudio próprios; conserva a origem campanha/prévia. |
| `startDream(saved=null,{campaign=true}={})` | Método declarado | [249](../src/js/toy-room/ToyRoomPhase.js#L249) | Descarta modos anteriores, entradas e áudio; abre o sonho2D com a origem campanha/prévia preservada. |
| `resolveCollisions(px, py, r)` | Método declarado | [257](../src/js/toy-room/ToyRoomPhase.js#L257) | Resolve colisões da sala com móveis. |
| `update(dt = 1.0)` | Método declarado | [264](../src/js/toy-room/ToyRoomPhase.js#L264) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateActiveMode(dt)` | Método declarado | [281](../src/js/toy-room/ToyRoomPhase.js#L281) | Seleciona epílogo, jardim, perseguição ou sala; após 150 ticks de COMPLETE abre o epílogo preservando campaign. |
| `resolveCollisions(x, y, radius)` | API/lambda de objeto | [329](../src/js/toy-room/ToyRoomPhase.js#L329) | Resolve colisões da sala com móveis. |
| `setDifficulty(difficulty)` | Método declarado | [351](../src/js/toy-room/ToyRoomPhase.js#L351) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `retryDefeat({ resume = false } = {})` | Método declarado | [360](../src/js/toy-room/ToyRoomPhase.js#L360) | Recupera a fase derrotada; a ajuda preserva o adversário ou percurso atual. |
| `updateCamera(dt)` | Método declarado | [386](../src/js/toy-room/ToyRoomPhase.js#L386) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `getCameraFrame()` | Método declarado | [394](../src/js/toy-room/ToyRoomPhase.js#L394) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `render(options = {})` | Método declarado | [401](../src/js/toy-room/ToyRoomPhase.js#L401) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `startTutorial()` | Método declarado | [413](../src/js/toy-room/ToyRoomPhase.js#L413) | Inicia orientação guiada da Toy Room se ainda não concluída. |
| `persistence()` | Acessor | [415](../src/js/toy-room/ToyRoomPhase.js#L415) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `snapshot(options)` | Método declarado | [420](../src/js/toy-room/ToyRoomPhase.js#L420) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved, options)` | Método declarado | [422](../src/js/toy-room/ToyRoomPhase.js#L422) | Reaplica a captura específica; confira referências e dados transitórios. |
| `destroy()` | Método declarado | [425](../src/js/toy-room/ToyRoomPhase.js#L425) | Descarta os modos posteriores e os recursos/listeners próprios da sala; encerra o epílogo ativo. |
| `createToyRoom(canvas, audio, uiFeedback, onReturnToTitle, options)` | Função | [439](../src/js/toy-room/ToyRoomPhase.js#L439) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `update(dt)` | API/lambda de objeto | [442](../src/js/toy-room/ToyRoomPhase.js#L442) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | API/lambda de objeto | [443](../src/js/toy-room/ToyRoomPhase.js#L443) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `triggerAction()` | API/lambda de objeto | [444](../src/js/toy-room/ToyRoomPhase.js#L444) | Encaminha ação à exploração somente fora de epílogo, jardim e perseguição. |
| `destroy()` | API/lambda de objeto | [445](../src/js/toy-room/ToyRoomPhase.js#L445) | Descarta os modos posteriores e os recursos/listeners próprios da sala; encerra o epílogo ativo. |

## src/js/toy-room/ToyRoomSceneFrame.js

[Implementação](../src/js/toy-room/ToyRoomSceneFrame.js). Contratos exportados/reexportados: `createToyRoomSceneFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomSceneFrame(room)` | Função | [2](../src/js/toy-room/ToyRoomSceneFrame.js#L2) | Monta dados e callbacks atuais para desenhar uma cena da sala. |
| `getCameraFrame()` | API/lambda de objeto | [25](../src/js/toy-room/ToyRoomSceneFrame.js#L25) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/toy-room/ToyRoomSceneRenderer.js

[Implementação](../src/js/toy-room/ToyRoomSceneRenderer.js). Contratos exportados/reexportados: `renderToyRoomScene`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToyRoomScene(scene, options = {})` | Função | [8](../src/js/toy-room/ToyRoomSceneRenderer.js#L8) | Compõe cenário, entidades por Y, efeitos, HUD e falas com os dados do quadro. |

## src/js/toy-room/ToyRoomShadows.js

[Implementação](../src/js/toy-room/ToyRoomShadows.js). Contratos exportados/reexportados: `prepareToyRoomShadows`, `getToyRoomShadowItems`, `renderToyRoomShadows`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `canvas(width, height)` | Função | [12](../src/js/toy-room/ToyRoomShadows.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `contactStamp()` | Função | [17](../src/js/toy-room/ToyRoomShadows.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `makeCaster(width, height, draw, rootX = 0, rootY = null)` | Função | [28](../src/js/toy-room/ToyRoomShadows.js#L28) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `store(scene)` | Função | [84](../src/js/toy-room/ToyRoomShadows.js#L84) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `caster(data, scene, type, item)` | Função | [91](../src/js/toy-room/ToyRoomShadows.js#L91) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareToyRoomShadows(assets)` | Função | [107](../src/js/toy-room/ToyRoomShadows.js#L107) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getToyRoomShadowItems(scene)` | Função | [118](../src/js/toy-room/ToyRoomShadows.js#L118) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `renderToyRoomShadows(ctx, scene)` | Função | [127](../src/js/toy-room/ToyRoomShadows.js#L127) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomStory.js

[Implementação](../src/js/toy-room/ToyRoomStory.js). Contratos exportados/reexportados: `createToyRoomStoryState`, `ToyRoomStory`, `drawToySword`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomStoryState()` | Função atribuída | [32](../src/js/toy-room/ToyRoomStory.js#L32) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `distance(a, b)` | Função atribuída | [46](../src/js/toy-room/ToyRoomStory.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `outsideViewport(point, viewport, margin = 72)` | Função | [47](../src/js/toy-room/ToyRoomStory.js#L47) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getBeat(beats, elapsed)` | Função | [52](../src/js/toy-room/ToyRoomStory.js#L52) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `constructor({ world, actors, exploration, flow, controls, audio, presentation })` | Método declarado | [63](../src/js/toy-room/ToyRoomStory.js#L63) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `refreshReachablePoints()` | Método declarado | [78](../src/js/toy-room/ToyRoomStory.js#L78) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `recordViewport(frame)` | Método declarado | [85](../src/js/toy-room/ToyRoomStory.js#L85) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onToyStored(toy)` | Método declarado | [89](../src/js/toy-room/ToyRoomStory.js#L89) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [106](../src/js/toy-room/ToyRoomStory.js#L106) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateReturns(dt)` | Método declarado | [143](../src/js/toy-room/ToyRoomStory.js#L143) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `beginInvestigation()` | Método declarado | [176](../src/js/toy-room/ToyRoomStory.js#L176) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateInvestigation(dt)` | Método declarado | [192](../src/js/toy-room/ToyRoomStory.js#L192) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateSwordGuide()` | Método declarado | [228](../src/js/toy-room/ToyRoomStory.js#L228) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateAfterMovement()` | Método declarado | [236](../src/js/toy-room/ToyRoomStory.js#L236) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `clearInput()` | Método declarado | [250](../src/js/toy-room/ToyRoomStory.js#L250) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `inputLocked()` | Acessor | [254](../src/js/toy-room/ToyRoomStory.js#L254) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `swordEquipped()` | Acessor | [259](../src/js/toy-room/ToyRoomStory.js#L259) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attack()` | Método declarado | [263](../src/js/toy-room/ToyRoomStory.js#L263) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canCollectToys()` | Acessor | [272](../src/js/toy-room/ToyRoomStory.js#L272) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `guidePosition()` | Método declarado | [276](../src/js/toy-room/ToyRoomStory.js#L276) | Retorna posição visual da fada acima do brinquedo-alvo do tutorial. |
| `cameraTarget()` | Método declarado | [287](../src/js/toy-room/ToyRoomStory.js#L287) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderWorldObject(ctx)` | Método declarado | [297](../src/js/toy-room/ToyRoomStory.js#L297) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderAttackSprite(ctx)` | Método declarado | [301](../src/js/toy-room/ToyRoomStory.js#L301) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderHeldObject(ctx)` | Método declarado | [308](../src/js/toy-room/ToyRoomStory.js#L308) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `advanceDialogue()` | Método declarado | [315](../src/js/toy-room/ToyRoomStory.js#L315) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `narrativeBeat()` | Método declarado | [325](../src/js/toy-room/ToyRoomStory.js#L325) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderNarrative(ctx, canvas)` | Método declarado | [346](../src/js/toy-room/ToyRoomStory.js#L346) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryBeat(ctx, canvas, beat)` | Método declarado | [351](../src/js/toy-room/ToyRoomStory.js#L351) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `restore(saved)` | Método declarado | [358](../src/js/toy-room/ToyRoomStory.js#L358) | Reaplica a captura específica; confira referências e dados transitórios. |
| `snapshot()` | Método declarado | [374](../src/js/toy-room/ToyRoomStory.js#L374) | Produz captura recuperável do estado específico deste componente. |

## src/js/toy-room/ToyRoomStoryContext.js

[Implementação](../src/js/toy-room/ToyRoomStoryContext.js). Contratos exportados/reexportados: `createToyRoomStoryContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomStoryContext(room)` | Função | [7](../src/js/toy-room/ToyRoomStoryContext.js#L7) | Restringe a narrativa a mundo, atores, exploração, fluxo, controles, áudio e apresentação. |
| `getDimensions()` | API/lambda de objeto | [10](../src/js/toy-room/ToyRoomStoryContext.js#L10) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getPlayer()` | API/lambda de objeto | [11](../src/js/toy-room/ToyRoomStoryContext.js#L11) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `resolvePosition(x, y, radius)` | API/lambda de objeto | [12](../src/js/toy-room/ToyRoomStoryContext.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getCameraFrame()` | API/lambda de objeto | [13](../src/js/toy-room/ToyRoomStoryContext.js#L13) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getCameraBounds()` | API/lambda de objeto | [14](../src/js/toy-room/ToyRoomStoryContext.js#L14) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `player()` | Acessor | [17](../src/js/toy-room/ToyRoomStoryContext.js#L17) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `fairy()` | Acessor | [18](../src/js/toy-room/ToyRoomStoryContext.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `difficulty()` | Acessor | [19](../src/js/toy-room/ToyRoomStoryContext.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | [22](../src/js/toy-room/ToyRoomStoryContext.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture()` | Acessor | [23](../src/js/toy-room/ToyRoomStoryContext.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `returnToy(toy, point)` | Método declarado | [24](../src/js/toy-room/ToyRoomStoryContext.js#L24) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `releaseCarriedToy()` | Método declarado | [28](../src/js/toy-room/ToyRoomStoryContext.js#L28) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tutorialActive()` | Acessor | [36](../src/js/toy-room/ToyRoomStoryContext.js#L36) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introductionActive()` | Acessor | [37](../src/js/toy-room/ToyRoomStoryContext.js#L37) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clear()` | Método declarado | [40](../src/js/toy-room/ToyRoomStoryContext.js#L40) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPickup()` | Método declarado | [55](../src/js/toy-room/ToyRoomStoryContext.js#L55) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `useSwordTrack()` | Método declarado | [56](../src/js/toy-room/ToyRoomStoryContext.js#L56) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `assets()` | Acessor | [59](../src/js/toy-room/ToyRoomStoryContext.js#L59) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mobile()` | Acessor | [60](../src/js/toy-room/ToyRoomStoryContext.js#L60) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomStoryRenderer.js

[Implementação](../src/js/toy-room/ToyRoomStoryRenderer.js). Contratos exportados/reexportados: `createStoryAttackFrames`, `drawToySword`, `renderStoryWorldObject`, `renderStoryAttackSprite`, `renderStoryHeldObject`, `renderStoryBeat`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createStoryAttackFrames(assets)` | Função | [10](../src/js/toy-room/ToyRoomStoryRenderer.js#L10) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `drawToySword(ctx, x, y, angle, scale = 1)` | Função | [24](../src/js/toy-room/ToyRoomStoryRenderer.js#L24) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryWorldObject(ctx, state)` | Função | [56](../src/js/toy-room/ToyRoomStoryRenderer.js#L56) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryAttackSprite(ctx, { state, player, attackFrames, attackDuration })` | Função | [60](../src/js/toy-room/ToyRoomStoryRenderer.js#L60) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryHeldObject(ctx, { state, player, attackFrames, attackDuration })` | Função | [85](../src/js/toy-room/ToyRoomStoryRenderer.js#L85) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryBeat(ctx, canvas, beat, { mobile, assets, tick })` | Função | [120](../src/js/toy-room/ToyRoomStoryRenderer.js#L120) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomToyActions.js

[Implementação](../src/js/toy-room/ToyRoomToyActions.js). Contratos exportados/reexportados: `pickUpToy`, `storeToyInChest`, `releaseCarriedToy`, `returnToyToFloor`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `pickUpToy(player, toy)` | Função | [2](../src/js/toy-room/ToyRoomToyActions.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `storeToyInChest(player, chest)` | Função | [7](../src/js/toy-room/ToyRoomToyActions.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `releaseCarriedToy(player, point)` | Função | [16](../src/js/toy-room/ToyRoomToyActions.js#L16) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `returnToyToFloor(toy, point)` | Função | [24](../src/js/toy-room/ToyRoomToyActions.js#L24) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomTutorial.js

[Implementação](../src/js/toy-room/ToyRoomTutorial.js). Contratos exportados/reexportados: `ToyRoomTutorial`, `TOY_ROOM_INPUT`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | [6](../src/js/toy-room/ToyRoomTutorial.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `start()` | Método declarado | [14](../src/js/toy-room/ToyRoomTutorial.js#L14) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `setDevice(device)` | Método declarado | [20](../src/js/toy-room/ToyRoomTutorial.js#L20) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `nearest()` | Método declarado | [21](../src/js/toy-room/ToyRoomTutorial.js#L21) | Seleciona brinquedo elegível mais próximo do jogador para orientar coleta. |
| `finish()` | Método declarado | [26](../src/js/toy-room/ToyRoomTutorial.js#L26) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | [31](../src/js/toy-room/ToyRoomTutorial.js#L31) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `guidePosition()` | Método declarado | [45](../src/js/toy-room/ToyRoomTutorial.js#L45) | Retorna posição visual da fada acima do brinquedo-alvo do tutorial. |
| `message()` | Acessor | [50](../src/js/toy-room/ToyRoomTutorial.js#L50) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(ctx,canvas,frame)` | Método declarado | [65](../src/js/toy-room/ToyRoomTutorial.js#L65) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomTutorialContext.js

[Implementação](../src/js/toy-room/ToyRoomTutorialContext.js). Contratos exportados/reexportados: `createToyRoomTutorialContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomTutorialContext(room)` | Função | [4](../src/js/toy-room/ToyRoomTutorialContext.js#L4) | Expõe oito campos atuais ao tutorial; setters somente para conclusão e modo. |
| `mobilePresentation()` | Acessor | [6](../src/js/toy-room/ToyRoomTutorialContext.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | [7](../src/js/toy-room/ToyRoomTutorialContext.js#L7) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `fairy()` | Acessor | [8](../src/js/toy-room/ToyRoomTutorialContext.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | [9](../src/js/toy-room/ToyRoomTutorialContext.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraX()` | Acessor | [10](../src/js/toy-room/ToyRoomTutorialContext.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraY()` | Acessor | [11](../src/js/toy-room/ToyRoomTutorialContext.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted()` | Acessor | [12](../src/js/toy-room/ToyRoomTutorialContext.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted(value)` | Acessor | [13](../src/js/toy-room/ToyRoomTutorialContext.js#L13) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState()` | Acessor | [14](../src/js/toy-room/ToyRoomTutorialContext.js#L14) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState(value)` | Acessor | [15](../src/js/toy-room/ToyRoomTutorialContext.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomTutorialRenderer.js

[Implementação](../src/js/toy-room/ToyRoomTutorialRenderer.js). Contratos exportados/reexportados: `renderToyRoomTutorial`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToyRoomTutorial(ctx, canvas, frame, { fairy, cameraX, cameraY, message, step, device })` | Função | [5](../src/js/toy-room/ToyRoomTutorialRenderer.js#L5) | Desenha mensagens e ponteiro da orientação sem receber tutorial nem sala. |

## src/js/toy-room/ToyRoomUI.js

[Implementação](../src/js/toy-room/ToyRoomUI.js). Contratos exportados/reexportados: `ToyRoomUI`, `toyRoomUI`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderUI(ctx, canvas, state)` | Método declarado | [20](../src/js/toy-room/ToyRoomUI.js#L20) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomWorldQueries.js

[Implementação](../src/js/toy-room/ToyRoomWorldQueries.js). Contratos exportados/reexportados: `createToyRoomWorldQueries`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomWorldQueries({ getDimensions, getPlayer, resolvePosition, getCameraFrame, getCameraBounds })` | Função | [2](../src/js/toy-room/ToyRoomWorldQueries.js#L2) | Cria consultas de piso/viewport com acessos explícitos às referências atuais. |
| `distance(a, b)` | Função atribuída | [3](../src/js/toy-room/ToyRoomWorldQueries.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isFree(point, radius = 24)` | Função | [5](../src/js/toy-room/ToyRoomWorldQueries.js#L5) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `reachableFloor()` | Função | [10](../src/js/toy-room/ToyRoomWorldQueries.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `viewport(frame = getCameraFrame())` | Função | [43](../src/js/toy-room/ToyRoomWorldQueries.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

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
| `drawPortrait(pCtx, charType, px, py, radius, mood = 'normal', tick = 0, options = {})` | Método declarado | [30](../src/js/ui/DialogueRenderer.js#L30) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapText(pCtx, text, maxWidth)` | Método declarado | [244](../src/js/ui/DialogueRenderer.js#L244) | Quebra texto conforme a largura medida pelo contexto. |
| `renderCutsceneDialogue(ctx, canvas, state = {}, options = {})` | Método declarado | [273](../src/js/ui/DialogueRenderer.js#L273) | Compõe falas, retratos, prompts e áreas seguras. |
| `renderDialogue(ctx, canvas, dialogue, options = {})` | Método declarado | [381](../src/js/ui/DialogueRenderer.js#L381) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialoguePortrait(pCtx, charType, px, py, radius, expression)` | Função atribuída | [388](../src/js/ui/DialogueRenderer.js#L388) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapDialogueText(pCtx, text, maxWidth)` | Função atribuída | [390](../src/js/ui/DialogueRenderer.js#L390) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/ui/DialogueSafeArea.js

[Implementação](../src/js/ui/DialogueSafeArea.js). Contratos exportados/reexportados: `intersectCanvasSafeArea`, `getDialogueSafeArea`, `getDialogueBoxY`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `intersectCanvasSafeArea(canvas, rect, viewport, insets = {})` | Função | [6](../src/js/ui/DialogueSafeArea.js#L6) | Converte interseção viewport/canvas e insets em coordenadas do bitmap. |
| `getDialogueSafeArea(canvas)` | Função | [16](../src/js/ui/DialogueSafeArea.js#L16) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDialogueBoxY(safe, height, originalMargin, anchor = {}, mobile = isMobileDevice())` | Função | [39](../src/js/ui/DialogueSafeArea.js#L39) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/ui/FirstJumpTutorial.js

[Implementação](../src/js/ui/FirstJumpTutorial.js). Contratos exportados/reexportados: `renderDarkRoomTouchHint`, `FIRST_JUMP_MESSAGES`, `getFirstJumpTutorialDevice`, `getFirstJumpFeedback`, `renderFirstJumpTutorial`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderDarkRoomTouchHint(ctx, canvas, state)` | Função | [6](../src/js/ui/FirstJumpTutorial.js#L6) | Desenha indicação de pulo no rodapé móvel sem restringir a área de entrada nem duplicar o tutorial inicial. |
| `getFirstJumpTutorialDevice({ device, nav = globalThis.navigator, coarse } = {})` | Função | [24](../src/js/ui/FirstJumpTutorial.js#L24) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getFirstJumpFeedback(timeMs, reducedMotion = false)` | Função | [35](../src/js/ui/FirstJumpTutorial.js#L35) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `drawInputIcon(ctx, kind, x, y, unit, pulse)` | Função | [40](../src/js/ui/FirstJumpTutorial.js#L40) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFirstJumpTutorial(ctx, canvas, { state, baby, fairy, platform, cameraX, transform, device, timeMs = globalThis.performance?.now?.() \|\| 0, reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches \|\| false })` | Função | [66](../src/js/ui/FirstJumpTutorial.js#L66) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `project(x, y)` | Função atribuída | [75](../src/js/ui/FirstJumpTutorial.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/ui/HudRenderer.js

[Implementação](../src/js/ui/HudRenderer.js). Contratos exportados/reexportados: `HudRenderer`, `hudRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderEscapeBanner(ctx, canvas, state = {}, cameraX = 0, baby = {})` | Método declarado | [21](../src/js/ui/HudRenderer.js#L21) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/ui/MobileDialogueRegion.js

[Implementação](../src/js/ui/MobileDialogueRegion.js). Contratos exportados/reexportados: `getMobileDialogueRegions`, `renderMobileDialogueRegion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getMobileDialogueRegions(safe, contentHeight, placement = 'bottom')` | Função | [6](../src/js/ui/MobileDialogueRegion.js#L6) | Divide a área segura entre cena e painel de texto. |
| `renderMobileDialogueRegion(ctx, canvas, safe, contentHeight, anchor = {}, placement = 'bottom')` | Função | [33](../src/js/ui/MobileDialogueRegion.js#L33) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/ui/MobileUILayout.js

[Implementação](../src/js/ui/MobileUILayout.js). Contratos exportados/reexportados: `calculateMobileUILayout`, `getMobileUILayout`, `isActionControlHit`, `arenaMobileControlsLayout`, `hitArenaMobileControl`, `arenaDirectionVector`, `attachMobileUILayout`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | [4](../src/js/ui/MobileUILayout.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `calculateMobileUILayout(canvas, safe, scale = 1, mobile = true)` | Função | [7](../src/js/ui/MobileUILayout.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `contains(x, y)` | API/lambda de objeto | [22](../src/js/ui/MobileUILayout.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `joystickOrigin(x, y)` | API/lambda de objeto | [23](../src/js/ui/MobileUILayout.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getMobileUILayout(canvas)` | Função | [29](../src/js/ui/MobileUILayout.js#L29) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isActionControlHit(layout, x, y)` | Função | [35](../src/js/ui/MobileUILayout.js#L35) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `arenaMobileControlsLayout(layout)` | Função | [40](../src/js/ui/MobileUILayout.js#L40) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `hitArenaMobileControl(layout, x, y)` | Função | [66](../src/js/ui/MobileUILayout.js#L66) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaDirectionVector(layout,x,y)` | Função | [86](../src/js/ui/MobileUILayout.js#L86) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attachMobileUILayout(canvas, host = window)` | Função | [96](../src/js/ui/MobileUILayout.js#L96) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update()` | Função atribuída | [97](../src/js/ui/MobileUILayout.js#L97) | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/ui/TitleScene.js

[Implementação](../src/js/ui/TitleScene.js). Contratos exportados/reexportados: `TITLE_SCENE_LAYOUT`, `titleSceneFrame`, `TitleScene`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `titleSceneFrame(width, height)` | Função | [8](../src/js/ui/TitleScene.js#L8) | Calcula uma câmera comum para o quarto da tela inicial, com foco na menina no retrato e poltrona fixa no tapete. |
| `constructor(canvas, overlay)` | Método declarado | [19](../src/js/ui/TitleScene.js#L19) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [32](../src/js/ui/TitleScene.js#L32) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sync()` | Método declarado | [45](../src/js/ui/TitleScene.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tick(time)` | Método declarado | [55](../src/js/ui/TitleScene.js#L55) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `leg(ctx, source, knee, angle, scale, origin)` | Método declarado | [63](../src/js/ui/TitleScene.js#L63) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(time)` | Método declarado | [71](../src/js/ui/TitleScene.js#L71) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [92](../src/js/ui/TitleScene.js#L92) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/ui/TitleScreen.js

[Implementação](../src/js/ui/TitleScreen.js). Contratos exportados/reexportados: `TitleScreen`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ game, onNew, onLoad })` | Método declarado | [6](../src/js/ui/TitleScreen.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `refresh()` | Método declarado | [31](../src/js/ui/TitleScreen.js#L31) | Atualiza disponibilidade de Carregar jogo a partir do save efetivo sem mudar a dificuldade escolhida. |
| `setEasy(enabled)` | Método declarado | [40](../src/js/ui/TitleScreen.js#L40) | Configura somente a próxima aventura; carregar mantém a dificuldade do save. |
| `requestNew()` | Método declarado | [47](../src/js/ui/TitleScreen.js#L47) | Abre confirmação se há progresso; cancelar preserva o save. |
| `navigate(event)` | Método declarado | [54](../src/js/ui/TitleScreen.js#L54) | Move foco com setas entre opções habilitadas e impede propagação ao jogo. |
| `activateFocused()` | Método declarado | [63](../src/js/ui/TitleScreen.js#L63) | Aciona o botão focado pelo gamepad sem atravessar os diálogos do menu. |

## src/js/ui/index.js

[Implementação](../src/js/ui/index.js). Contratos exportados/reexportados: `HudRenderer`, `hudRenderer`, `DialogueRenderer`, `dialogueRenderer`, `renderFirstJumpTutorial`, `getFirstJumpFeedback`, `getFirstJumpTutorialDevice`, `FIRST_JUMP_MESSAGES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

Inventário: **205 módulos JavaScript**, **1309 declarações nomeadas**.
