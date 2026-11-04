# Referência de métodos e funções

Inventário de `src/js`, gerado a partir da cópia local. Consulte [arquitetura e entidades](ARQUITETURA.md), o [manual](MANUAL-DESENVOLVIMENTO.md) e os [comandos](COMANDOS.md).

As linhas referem-se ao snapshot local e mudam após edições. O inventário inclui funções, métodos, acessores e funções atribuídas com parâmetros entre parênteses, além dos contratos exportados/reexports. Não é um parser completo: callbacks anônimos e algumas lambdas de parâmetro simples não são declarações separadas aqui; funções exportadas continuam enumeradas no módulo. APIs de fábricas e proprietários de estado estão documentados na arquitetura e no manual. A presença de uma função interna não a torna pública.

Regenerar na raiz: `node scripts/generate-method-reference.js`. Revise também as descrições e o manual após mudar contratos.

## src/js/assets/AssetManager.js

[Implementação](../src/js/assets/AssetManager.js). Contratos exportados/reexportados: `AssetManager`, `createAssetManager`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [8](../src/js/assets/AssetManager.js#L8) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `loadManifest(url = this.manifestUrl)` | Método declarado | [24](../src/js/assets/AssetManager.js#L24) | Busca manifesto e atualiza status; rejeita falha. |
| `preload()` | Método declarado | [52](../src/js/assets/AssetManager.js#L52) | Pré-carrega entradas de imagens do manifesto. |
| `loadImage(key, source)` | Método declarado | [61](../src/js/assets/AssetManager.js#L61) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `removeSolidBackground(image, background = 'light')` | Método declarado | [100](../src/js/assets/AssetManager.js#L100) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getRegion(key, region)` | Método declarado | [141](../src/js/assets/AssetManager.js#L141) | Valida limites e cacheia recorte do atlas. |
| `normalizeCharacterPalette(image)` | Método declarado | [177](../src/js/assets/AssetManager.js#L177) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `get(key)` | Método declarado | [204](../src/js/assets/AssetManager.js#L204) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `has(key)` | Método declarado | [211](../src/js/assets/AssetManager.js#L211) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getStatus(key)` | Método declarado | [218](../src/js/assets/AssetManager.js#L218) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isReady(key)` | Método declarado | [225](../src/js/assets/AssetManager.js#L225) | Consulta uma chave ou prontidão do manifesto; sem chave não certifica todas as imagens. |
| `clearRegionCache()` | Método declarado | [235](../src/js/assets/AssetManager.js#L235) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `createAssetManager(options)` | Função | [240](../src/js/assets/AssetManager.js#L240) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/assets/GirlLocomotionArt.js

[Implementação](../src/js/assets/GirlLocomotionArt.js). Contratos exportados/reexportados: `GIRL_LOCOMOTION_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/assets/currentScenery.js

[Implementação](../src/js/assets/currentScenery.js). Contratos exportados/reexportados: `CURRENT_SCENERY`, `drawCurrentScenery`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawCurrentScenery(ctx, assets, type, x, floorY)` | Função | [97](../src/js/assets/currentScenery.js#L97) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/assets/darkRoomAtlas.js

[Implementação](../src/js/assets/darkRoomAtlas.js). Contratos exportados/reexportados: `SHEET_WIDTH`, `SHEET_HEIGHT`, `SPRITESHEET_PATH`, `darkRoomAtlas`, `validateAtlasRegion`, `getDarkRoomAtlasRegion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `validateAtlasRegion(region, sheetW = SHEET_WIDTH, sheetH = SHEET_HEIGHT)` | Função | [280](../src/js/assets/darkRoomAtlas.js#L280) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getDarkRoomAtlasRegion(key)` | Função | [294](../src/js/assets/darkRoomAtlas.js#L294) | Consulta/calcula valor específico; forma exata definida pela implementação. |

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
| `createAudioSystem()` | Função | [18](../src/js/audio.js#L18) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `getDestination()` | Função | [32](../src/js/audio.js#L32) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `updateMusicVolumes()` | Função | [47](../src/js/audio.js#L47) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `setMasterVolume(vol)` | Função | [58](../src/js/audio.js#L58) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | Função | [68](../src/js/audio.js#L68) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(muted)` | Função | [73](../src/js/audio.js#L73) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `toggleMute()` | Função | [87](../src/js/audio.js#L87) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getIsMuted()` | Função | [92](../src/js/audio.js#L92) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `registerActiveNode(node)` | Função | [103](../src/js/audio.js#L103) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cleanup()` | Função atribuída | [106](../src/js/audio.js#L106) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearActiveSounds()` | Função | [115](../src/js/audio.js#L115) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMusicTrack()` | Função | [129](../src/js/audio.js#L129) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `initAudio()` | Função | [166](../src/js/audio.js#L166) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startMusic()` | Função | [196](../src/js/audio.js#L196) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopMusic()` | Função | [219](../src/js/audio.js#L219) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stopAllAudio()` | Função | [230](../src/js/audio.js#L230) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playJumpSound()` | Função | [237](../src/js/audio.js#L237) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLongJumpSound(progress = 0)` | Função | [245](../src/js/audio.js#L245) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLevelUpChime(level = 0)` | Função | [250](../src/js/audio.js#L250) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOpeningAmbience()` | Função | [275](../src/js/audio.js#L275) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyVoiceBlip(freq = 920)` | Função | [297](../src/js/audio.js#L297) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyLaugh()` | Função | [321](../src/js/audio.js#L321) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playEscapePowerUp()` | Função | [350](../src/js/audio.js#L350) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFallFailSound()` | Função | [378](../src/js/audio.js#L378) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playTapeRipSound()` | Função | [402](../src/js/audio.js#L402) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDramaticTumbleSound()` | Função | [438](../src/js/audio.js#L438) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyThudSound()` | Função | [463](../src/js/audio.js#L463) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyShockVoice()` | Função | [487](../src/js/audio.js#L487) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyFrustratedSound()` | Função | [513](../src/js/audio.js#L513) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPhase3StartFanfare()` | Função | [538](../src/js/audio.js#L538) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `getToyRoomTrackUrls(track)` | Função | [570](../src/js/audio.js#L570) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getToyRoomAudioElement()` | Função | [583](../src/js/audio.js#L583) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setToyRoomMusicTrack(track)` | Função | [621](../src/js/audio.js#L621) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `startToyRoomMusic({ fade = 1 } = {})` | Função | [642](../src/js/audio.js#L642) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `setToyRoomMusicFade(value)` | Função | [672](../src/js/audio.js#L672) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setToyRoomMusicIntensity(value)` | Função | [678](../src/js/audio.js#L678) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPortalExitWhoosh()` | Função | [684](../src/js/audio.js#L684) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playSoftMagicBurst()` | Função | [719](../src/js/audio.js#L719) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopToyRoomMusic()` | Função | [748](../src/js/audio.js#L748) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | Função | [760](../src/js/audio.js#L760) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | Função | [779](../src/js/audio.js#L779) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playPickUpSound()` | Função | [798](../src/js/audio.js#L798) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDropSound()` | Função | [824](../src/js/audio.js#L824) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOrganizeChime()` | Função | [848](../src/js/audio.js#L848) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playToyRoomVictory()` | Função | [875](../src/js/audio.js#L875) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playCombatSound(event, arena = false)` | Função | [928](../src/js/audio.js#L928) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playArenaMusicBeat(beat)` | Função | [1027](../src/js/audio.js#L1027) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopArenaMusic()` | Função | [1059](../src/js/audio.js#L1059) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getAudioContext()` | API/lambda de objeto | [1158](../src/js/audio.js#L1158) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/audio/GameSoundEffects.js

[Implementação](../src/js/audio/GameSoundEffects.js). Contratos exportados/reexportados: `GAME_SOUNDS`, `preloadGameSounds`, `GameSoundEffects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `preloadGameSounds(ctx, names = Object.keys(GAME_SOUNDS))` | Função | [11](../src/js/audio/GameSoundEffects.js#L11) | Decodifica WAVs fornecidos uma vez por contexto, sem enfileirar reprodução atrasada. |
| `constructor()` | Método declarado | [46](../src/js/audio/GameSoundEffects.js#L46) | Cria o conjunto limitado de vozes de efeitos gravados. |
| `play(ctx, destination, name, { volume = .65, rate = 1, loop = false, channel = null, pan = 0 } = {})` | Método declarado | [53](../src/js/audio/GameSoundEffects.js#L53) | Reproduz uma amostra já decodificada com ganho, taxa, canal e panorâmica. |
| `update(channel, volume, pan = 0, rate = 1)` | Método declarado | [101](../src/js/audio/GameSoundEffects.js#L101) | Atualiza ganho, panorâmica e taxa de uma voz ativa cancelando rampas anteriores. |
| `stop(channel = null, fade = 0)` | Método declarado | [111](../src/js/audio/GameSoundEffects.js#L111) | Encerra canais imediatamente ou com fade e libera suas conexões. |

## src/js/audio/InsectSoundscape.js

[Implementação](../src/js/audio/InsectSoundscape.js). Contratos exportados/reexportados: `insectEmitters`, `audibleInsects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `insectEmitters(state, scene = 'garden')` | Função | [6](../src/js/audio/InsectSoundscape.js#L6) | Consulta corpos e estados de voo de abelhas e besouros no jardim ou sonho. |
| `audibleInsects(state, scene)` | Função | [41](../src/js/audio/InsectSoundscape.js#L41) | Seleciona até três emissores por distância, energia de voo e panorâmica. |

## src/js/bear-chase/BearChasePhase.js

[Implementação](../src/js/bear-chase/BearChasePhase.js). Contratos exportados/reexportados: `BearChasePhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ canvas, audio, enabled, difficulty = 'NORMAL', campaign = false, onCampaignError = null })` | Método declarado | [27](../src/js/bear-chase/BearChasePhase.js#L27) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `active()` | Acessor | [58](../src/js/bear-chase/BearChasePhase.js#L58) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `start(saved = null)` | Método declarado | [62](../src/js/bear-chase/BearChasePhase.js#L62) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | [95](../src/js/bear-chase/BearChasePhase.js#L95) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [128](../src/js/bear-chase/BearChasePhase.js#L128) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `setPaused(value)` | Método declarado | [161](../src/js/bear-chase/BearChasePhase.js#L161) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `retry({ resume = false } = {})` | Método declarado | [168](../src/js/bear-chase/BearChasePhase.js#L168) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `snapshot()` | Método declarado | [193](../src/js/bear-chase/BearChasePhase.js#L193) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [202](../src/js/bear-chase/BearChasePhase.js#L202) | Reaplica a captura específica; confira referências e dados transitórios. |
| `destroy()` | Método declarado | [212](../src/js/bear-chase/BearChasePhase.js#L212) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseAudio.js

[Implementação](../src/js/bear-chase/ChaseAudio.js). Contratos exportados/reexportados: `ChaseAudio`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(audio)` | Método declarado | [11](../src/js/bear-chase/ChaseAudio.js#L11) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `unlock()` | Método declarado | [34](../src/js/bear-chase/ChaseAudio.js#L34) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `step(actor, gap)` | Método declarado | [53](../src/js/bear-chase/ChaseAudio.js#L53) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(state)` | Método declarado | [79](../src/js/bear-chase/ChaseAudio.js#L79) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `stopSteps()` | Método declarado | [112](../src/js/bear-chase/ChaseAudio.js#L112) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Método declarado | [122](../src/js/bear-chase/ChaseAudio.js#L122) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [130](../src/js/bear-chase/ChaseAudio.js#L130) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [137](../src/js/bear-chase/ChaseAudio.js#L137) | Reaplica a captura específica; confira referências e dados transitórios. |
| `seek()` | Função atribuída | [139](../src/js/bear-chase/ChaseAudio.js#L139) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [148](../src/js/bear-chase/ChaseAudio.js#L148) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseBearAnimation.js

[Implementação](../src/js/bear-chase/ChaseBearAnimation.js). Contratos exportados/reexportados: `ChaseBearAnimation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(model)` | Método declarado | [9](../src/js/bear-chase/ChaseBearAnimation.js#L9) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `legPose(leg, z, footY, hipHeight)` | Método declarado | [14](../src/js/bear-chase/ChaseBearAnimation.js#L14) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state)` | Método declarado | [25](../src/js/bear-chase/ChaseBearAnimation.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseBearModel.js

[Implementação](../src/js/bear-chase/ChaseBearModel.js). Contratos exportados/reexportados: `ChaseBearModel`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(own, texture)` | Método declarado | [9](../src/js/bear-chase/ChaseBearModel.js#L9) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `joint(parent, name, x, y, z)` | Método declarado | [103](../src/js/bear-chase/ChaseBearModel.js#L103) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `volume(parent, region, position, scale, tint = '#ffffff', rotation = [0, 0, 0])` | Método declarado | [112](../src/js/bear-chase/ChaseBearModel.js#L112) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `seam(parent, points, radius)` | Método declarado | [122](../src/js/bear-chase/ChaseBearModel.js#L122) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ribbon(parent, side)` | Método declarado | [128](../src/js/bear-chase/ChaseBearModel.js#L128) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `collect(parent, source, region, tint)` | Método declarado | [154](../src/js/bear-chase/ChaseBearModel.js#L154) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `bake()` | Método declarado | [182](../src/js/bear-chase/ChaseBearModel.js#L182) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state)` | Método declarado | [208](../src/js/bear-chase/ChaseBearModel.js#L208) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseCamera.js

[Implementação](../src/js/bear-chase/ChaseCamera.js). Contratos exportados/reexportados: `chaseCameraFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `chaseCameraFrame(state, portrait, aspect)` | Função | [19](../src/js/bear-chase/ChaseCamera.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseConfig.js

[Implementação](../src/js/bear-chase/ChaseConfig.js). Contratos exportados/reexportados: `CHASE_CONFIG`, `clamp`, `damp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, low, high)` | Função | [28](../src/js/bear-chase/ChaseConfig.js#L28) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `damp(from, to, speed, dt)` | Função | [33](../src/js/bear-chase/ChaseConfig.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseFairyModel.js

[Implementação](../src/js/bear-chase/ChaseFairyModel.js). Contratos exportados/reexportados: `ChaseFairyModel`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(own)` | Método declarado | [9](../src/js/bear-chase/ChaseFairyModel.js#L9) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `wingGeometry()` | Método declarado | [97](../src/js/bear-chase/ChaseFairyModel.js#L97) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `flightOffset(time, target)` | Método declarado | [138](../src/js/bear-chase/ChaseFairyModel.js#L138) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state, girlModel)` | Método declarado | [146](../src/js/bear-chase/ChaseFairyModel.js#L146) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseGirlAnimation.js

[Implementação](../src/js/bear-chase/ChaseGirlAnimation.js). Contratos exportados/reexportados: `ChaseGirlAnimation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(model)` | Método declarado | [10](../src/js/bear-chase/ChaseGirlAnimation.js#L10) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `legPose(leg, z, y)` | Método declarado | [24](../src/js/bear-chase/ChaseGirlAnimation.js#L24) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state)` | Método declarado | [49](../src/js/bear-chase/ChaseGirlAnimation.js#L49) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fall(state)` | Método declarado | [114](../src/js/bear-chase/ChaseGirlAnimation.js#L114) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseGirlModel.js

[Implementação](../src/js/bear-chase/ChaseGirlModel.js). Contratos exportados/reexportados: `ChaseGirlModel`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(own)` | Método declarado | [9](../src/js/bear-chase/ChaseGirlModel.js#L9) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `batchDetails(parent)` | Método declarado | [98](../src/js/bear-chase/ChaseGirlModel.js#L98) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `shade(geometry)` | Método declarado | [131](../src/js/bear-chase/ChaseGirlModel.js#L131) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `joint(parent, name, x, y, z)` | Método declarado | [142](../src/js/bear-chase/ChaseGirlModel.js#L142) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `volume(parent, material, position, scale)` | Método declarado | [150](../src/js/bear-chase/ChaseGirlModel.js#L150) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `limb(parent, material, length, end, start)` | Método declarado | [158](../src/js/bear-chase/ChaseGirlModel.js#L158) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildSleeve(parent)` | Método declarado | [172](../src/js/bear-chase/ChaseGirlModel.js#L172) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cloth(parent, material, profile, full)` | Método declarado | [197](../src/js/bear-chase/ChaseGirlModel.js#L197) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `silhouette(parent, material, points, depth, position)` | Método declarado | [239](../src/js/bear-chase/ChaseGirlModel.js#L239) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sweep(parent, material, points, radii)` | Método declarado | [263](../src/js/bear-chase/ChaseGirlModel.js#L263) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildHair()` | Método declarado | [294](../src/js/bear-chase/ChaseGirlModel.js#L294) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `curveFringe(mesh)` | Método declarado | [379](../src/js/bear-chase/ChaseGirlModel.js#L379) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `bow(parent, position, size)` | Método declarado | [385](../src/js/bear-chase/ChaseGirlModel.js#L385) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildDressDetails()` | Método declarado | [394](../src/js/bear-chase/ChaseGirlModel.js#L394) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildFace()` | Método declarado | [417](../src/js/bear-chase/ChaseGirlModel.js#L417) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildSword()` | Método declarado | [429](../src/js/bear-chase/ChaseGirlModel.js#L429) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseGirlPalette.js

[Implementação](../src/js/bear-chase/ChaseGirlPalette.js). Contratos exportados/reexportados: `GIRL_PALETTE`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/bear-chase/ChaseHUD.js

[Implementação](../src/js/bear-chase/ChaseHUD.js). Contratos exportados/reexportados: `renderChaseHUD`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderLives(ctx, w, ui, state, difficulty)` | Função | [18](../src/js/bear-chase/ChaseHUD.js#L18) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderChaseHUD(ctx, canvas, state, error, audioError, difficulty = 'NORMAL')` | Função | [43](../src/js/bear-chase/ChaseHUD.js#L43) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/bear-chase/ChaseHealth.js

[Implementação](../src/js/bear-chase/ChaseHealth.js). Contratos exportados/reexportados: `CHASE_FALL_DURATION`, `chaseMaxLives`, `chaseLives`, `isChaseDefeat`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `chaseMaxLives(difficulty = 'NORMAL')` | Função | [5](../src/js/bear-chase/ChaseHealth.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chaseLives(state, difficulty = 'NORMAL')` | Função | [10](../src/js/bear-chase/ChaseHealth.js#L10) | Deriva as vidas restantes dos impactos e do limite da dificuldade. |
| `isChaseDefeat(stage)` | Função | [15](../src/js/bear-chase/ChaseHealth.js#L15) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/bear-chase/ChaseInput.js

[Implementação](../src/js/bear-chase/ChaseInput.js). Contratos exportados/reexportados: `ChaseInput`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, enabled, unlock)` | Método declarado | [8](../src/js/bear-chase/ChaseInput.js#L8) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `install()` | Método declarado | [22](../src/js/bear-chase/ChaseInput.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onKeyDown(event)` | Método declarado | [37](../src/js/bear-chase/ChaseInput.js#L37) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onKeyUp(event)` | Método declarado | [46](../src/js/bear-chase/ChaseInput.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onPointer(event)` | Método declarado | [50](../src/js/bear-chase/ChaseInput.js#L50) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onRelease(event)` | Método declarado | [61](../src/js/bear-chase/ChaseInput.js#L61) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sample()` | Método declarado | [65](../src/js/bear-chase/ChaseInput.js#L65) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clear()` | Método declarado | [88](../src/js/bear-chase/ChaseInput.js#L88) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `destroy()` | Método declarado | [99](../src/js/bear-chase/ChaseInput.js#L99) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseIntroRenderer.js

[Implementação](../src/js/bear-chase/ChaseIntroRenderer.js). Contratos exportados/reexportados: `isChaseIntro`, `chaseIntroFade`, `ChaseIntroRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `isChaseIntro(stage)` | Função | [20](../src/js/bear-chase/ChaseIntroRenderer.js#L20) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `chaseIntroFade(state)` | Função | [25](../src/js/bear-chase/ChaseIntroRenderer.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor()` | Método declarado | [34](../src/js/bear-chase/ChaseIntroRenderer.js#L34) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [42](../src/js/bear-chase/ChaseIntroRenderer.js#L42) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `measureFrames(image, columns = [0, 490 / 1774, 920 / 1774, 1340 / 1774, 1], rows = [0, 505 / 887, 1])` | Método declarado | [57](../src/js/bear-chase/ChaseIntroRenderer.js#L57) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `picture(ctx, key, x, bottom, height)` | Método declarado | [115](../src/js/bear-chase/ChaseIntroRenderer.js#L115) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `backdrop(ctx, w, h)` | Método declarado | [122](../src/js/bear-chase/ChaseIntroRenderer.js#L122) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `floor(ctx, w, h, horizon, unit)` | Método declarado | [143](../src/js/bear-chase/ChaseIntroRenderer.js#L143) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actor(ctx, index, x, baseline, height, first, reaching = false)` | Método declarado | [166](../src/js/bear-chase/ChaseIntroRenderer.js#L166) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pose(canvas, state)` | Método declarado | [178](../src/js/bear-chase/ChaseIntroRenderer.js#L178) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(ctx, canvas, state)` | Método declarado | [214](../src/js/bear-chase/ChaseIntroRenderer.js#L214) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [252](../src/js/bear-chase/ChaseIntroRenderer.js#L252) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseLighting.js

[Implementação](../src/js/bear-chase/ChaseLighting.js). Contratos exportados/reexportados: `ChaseLighting`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(owner)` | Método declarado | [30](../src/js/bear-chase/ChaseLighting.js#L30) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `windowMask()` | Método declarado | [119](../src/js/bear-chase/ChaseLighting.js#L119) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resize(portrait)` | Método declarado | [146](../src/js/bear-chase/ChaseLighting.js#L146) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `place(light, s, x, height, targetS, targetX, targetHeight = 0)` | Método declarado | [173](../src/js/bear-chase/ChaseLighting.js#L173) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(state, portrait)` | Método declarado | [198](../src/js/bear-chase/ChaseLighting.js#L198) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `prepareObject(root)` | Método declarado | [251](../src/js/bear-chase/ChaseLighting.js#L251) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dispose()` | Método declarado | [264](../src/js/bear-chase/ChaseLighting.js#L264) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChasePacing.js

[Implementação](../src/js/bear-chase/ChasePacing.js). Contratos exportados/reexportados: `smoothProgress`, `chaseIntensity`, `chasePacing`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smoothProgress(value)` | Função | [7](../src/js/bear-chase/ChasePacing.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chaseIntensity(distance)` | Função | [13](../src/js/bear-chase/ChasePacing.js#L13) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chasePacing(distance, difficulty = 'NORMAL')` | Função | [22](../src/js/bear-chase/ChasePacing.js#L22) | Deriva ritmo por progresso/dificuldade e fixa pares a cada segundo no final do NORMAL. |

## src/js/bear-chase/ChasePatterns.js

[Implementação](../src/js/bear-chase/ChasePatterns.js). Contratos exportados/reexportados: `chasePattern`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `chasePattern(progress, difficulty, safeLane)` | Função | [6](../src/js/bear-chase/ChasePatterns.js#L6) | Distribui brinquedos por progresso e dificuldade; no NORMAL usa até três objetos e pares finais com corredor amplo. |

## src/js/bear-chase/ChaseRenderer3D.js

[Implementação](../src/js/bear-chase/ChaseRenderer3D.js). Contratos exportados/reexportados: `ChaseRenderer3D`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `imageFile(path)` | Função | [48](../src/js/bear-chase/ChaseRenderer3D.js#L48) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor()` | Método declarado | [64](../src/js/bear-chase/ChaseRenderer3D.js#L64) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `own(resource)` | Método declarado | [94](../src/js/bear-chase/ChaseRenderer3D.js#L94) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `texture(image, crop = null)` | Método declarado | [99](../src/js/bear-chase/ChaseRenderer3D.js#L99) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `floorTexture(image)` | Método declarado | [121](../src/js/bear-chase/ChaseRenderer3D.js#L121) | Prepara o recorte de madeira em DataTexture RGBA 256×64, com nove mipmaps explícitos e orientação preservada. |
| `floorIsVisible()` | Método declarado | [161](../src/js/bear-chase/ChaseRenderer3D.js#L161) | Renderiza uma amostra do piso fora da tela e confere o sinal de madeira na GPU. |
| `prepareFloor()` | Método declarado | [192](../src/js/bear-chase/ChaseRenderer3D.js#L192) | Valida o piso e tenta a mesma arte com filtro linear sem mipmaps quando necessário. |
| `prepareVisualResources()` | Método declarado | [210](../src/js/bear-chase/ChaseRenderer3D.js#L210) | Envia todos os mapas à GPU e aguarda compilação dos materiais antes de liberar a corrida. |
| `material(texture, color = '#ffffff')` | Método declarado | [225](../src/js/bear-chase/ChaseRenderer3D.js#L225) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mesh(parent, geometry, material, x, y, z)` | Método declarado | [235](../src/js/bear-chase/ChaseRenderer3D.js#L235) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actor(texture, width, height)` | Método declarado | [242](../src/js/bear-chase/ChaseRenderer3D.js#L242) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `load()` | Método declarado | [248](../src/js/bear-chase/ChaseRenderer3D.js#L248) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareRoomResources()` | Método declarado | [344](../src/js/bear-chase/ChaseRenderer3D.js#L344) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `placeOnRoute(object, distance, lateral, height = 0, alignSlope = false)` | Método declarado | [358](../src/js/bear-chase/ChaseRenderer3D.js#L358) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateToys(state)` | Método declarado | [367](../src/js/bear-chase/ChaseRenderer3D.js#L367) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render(ctx, canvas, state)` | Método declarado | [400](../src/js/bear-chase/ChaseRenderer3D.js#L400) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `presentCamera(state, portrait)` | Método declarado | [438](../src/js/bear-chase/ChaseRenderer3D.js#L438) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [454](../src/js/bear-chase/ChaseRenderer3D.js#L454) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseRoom.js

[Implementação](../src/js/bear-chase/ChaseRoom.js). Contratos exportados/reexportados: `ChaseRoom`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(owner)` | Método declarado | [10](../src/js/bear-chase/ChaseRoom.js#L10) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `surface(material, l0, h0, l1, h1, name)` | Método declarado | [49](../src/js/bear-chase/ChaseRoom.js#L49) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `add(object, s, lateral, yaw, height = 0, rug = false)` | Método declarado | [76](../src/js/bear-chase/ChaseRoom.js#L76) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(distance)` | Método declarado | [93](../src/js/bear-chase/ChaseRoom.js#L93) | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/bear-chase/ChaseRoute.js

[Implementação](../src/js/bear-chase/ChaseRoute.js). Contratos exportados/reexportados: `ROUTE_NODES`, `routeFrame`, `routePoint`, `ROUTE_AMBUSHES`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `coordinate(s, axis)` | Função | [20](../src/js/bear-chase/ChaseRoute.js#L20) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `routeFrame(s)` | Função | [35](../src/js/bear-chase/ChaseRoute.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `routePoint(s, lateral = 0, height = 0)` | Função | [53](../src/js/bear-chase/ChaseRoute.js#L53) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseSimulation.js

[Implementação](../src/js/bear-chase/ChaseSimulation.js). Contratos exportados/reexportados: `createChaseState`, `restoreChaseState`, `hitsObstacle`, `stepChase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createChaseState()` | Função | [25](../src/js/bear-chase/ChaseSimulation.js#L25) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `restoreChaseState(saved)` | Função | [56](../src/js/bear-chase/ChaseSimulation.js#L56) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `random(state)` | Função | [80](../src/js/bear-chase/ChaseSimulation.js#L80) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `hitsObstacle(obstacle, fromX, toX, fromZ, toZ)` | Função | [86](../src/js/bear-chase/ChaseSimulation.js#L86) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dropPattern(state, events, pacing, speed, ambushZ = null, difficulty = 'NORMAL')` | Função | [93](../src/js/bear-chase/ChaseSimulation.js#L93) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `followFairy(state, dt)` | Função | [141](../src/js/bear-chase/ChaseSimulation.js#L141) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `advanceStage(state, events)` | Função | [149](../src/js/bear-chase/ChaseSimulation.js#L149) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stepChase(state, input, dt = C.step, difficulty = 'NORMAL')` | Função | [169](../src/js/bear-chase/ChaseSimulation.js#L169) | Avança o domínio em segundos: sequência, movimento, colisão, vidas, lançamentos e eventos. |

## src/js/bear-chase/ChaseToyModels.js

[Implementação](../src/js/bear-chase/ChaseToyModels.js). Contratos exportados/reexportados: `ChaseToyModels`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(catalog)` | Método declarado | [4](../src/js/bear-chase/ChaseToyModels.js#L4) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `train()` | Método declarado | [8](../src/js/bear-chase/ChaseToyModels.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/BlockCastleProp.js

[Implementação](../src/js/bear-chase/props/BlockCastleProp.js). Contratos exportados/reexportados: `BlockCastleProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [9](../src/js/bear-chase/props/BlockCastleProp.js#L9) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `centralWall(parts, orange, yellow, green)` | Método declarado | [47](../src/js/bear-chase/props/BlockCastleProp.js#L47) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `portal(parts, material, position, width, height, depth, radius, openingHeight)` | Método declarado | [83](../src/js/bear-chase/props/BlockCastleProp.js#L83) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | [106](../src/js/bear-chase/props/BlockCastleProp.js#L106) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/BlocksProp.js

[Implementação](../src/js/bear-chase/props/BlocksProp.js). Contratos exportados/reexportados: `BlocksProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [9](../src/js/bear-chase/props/BlocksProp.js#L9) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | [38](../src/js/bear-chase/props/BlocksProp.js#L38) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/BookshelfProp.js

[Implementação](../src/js/bear-chase/props/BookshelfProp.js). Contratos exportados/reexportados: `BookshelfProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [8](../src/js/bear-chase/props/BookshelfProp.js#L8) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | [38](../src/js/bear-chase/props/BookshelfProp.js#L38) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/BunnyProp.js

[Implementação](../src/js/bear-chase/props/BunnyProp.js). Contratos exportados/reexportados: `BunnyProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [9](../src/js/bear-chase/props/BunnyProp.js#L9) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `ellipsoid(parts, material, position, scale, tilt = 0)` | Método declarado | [40](../src/js/bear-chase/props/BunnyProp.js#L40) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | [46](../src/js/bear-chase/props/BunnyProp.js#L46) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/ChasePropCatalog.js

[Implementação](../src/js/bear-chase/props/ChasePropCatalog.js). Contratos exportados/reexportados: `ChasePropCatalog`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(images, externalResources = null)` | Método declarado | [33](../src/js/bear-chase/props/ChasePropCatalog.js#L33) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `register(id, factory, reference, rotation = 0, scale = 1)` | Método declarado | [57](../src/js/bear-chase/props/ChasePropCatalog.js#L57) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create(id)` | Método declarado | [84](../src/js/bear-chase/props/ChasePropCatalog.js#L84) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `release(root)` | Método declarado | [91](../src/js/bear-chase/props/ChasePropCatalog.js#L91) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dispose()` | Método declarado | [95](../src/js/bear-chase/props/ChasePropCatalog.js#L95) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/ChasePropResources.js

[Implementação](../src/js/bear-chase/props/ChasePropResources.js). Contratos exportados/reexportados: `ChasePropResources`, `PropParts`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(woodImage, externalResources = null, pictorialImages = {})` | Método declarado | [9](../src/js/bear-chase/props/ChasePropResources.js#L9) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `own(resource)` | Método declarado | [18](../src/js/bear-chase/props/ChasePropResources.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `woodTexture(painted)` | Método declarado | [24](../src/js/bear-chase/props/ChasePropResources.js#L24) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fabricTexture(image)` | Método declarado | [44](../src/js/bear-chase/props/ChasePropResources.js#L44) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `material(name, color, wood = false, texture = null)` | Método declarado | [63](../src/js/bear-chase/props/ChasePropResources.js#L63) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pictorialMaterial(asset, region, tint = '#ffffff')` | Método declarado | [75](../src/js/bear-chase/props/ChasePropResources.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fabricRegion(image)` | Método declarado | [109](../src/js/bear-chase/props/ChasePropResources.js#L109) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `bake(parts, name, combineAtlas = false)` | Método declarado | [123](../src/js/bear-chase/props/ChasePropResources.js#L123) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `combinedMaterial(source)` | Método declarado | [178](../src/js/bear-chase/props/ChasePropResources.js#L178) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dispose()` | Método declarado | [196](../src/js/bear-chase/props/ChasePropResources.js#L196) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor()` | Método declarado | [212](../src/js/bear-chase/props/ChasePropResources.js#L212) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `add(geometry, material, position, rotation = [0, 0, 0])` | Método declarado | [216](../src/js/bear-chase/props/ChasePropResources.js#L216) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `box(material, position, size, radius = .015)` | Método declarado | [226](../src/js/bear-chase/props/ChasePropResources.js#L226) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cylinder(material, position, top, bottom, height, rotation = [0, 0, 0], segments = 20, axialGrain = false)` | Método declarado | [264](../src/js/bear-chase/props/ChasePropResources.js#L264) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ring(material, position, radius, tube, rotation = [0, 0, 0])` | Método declarado | [276](../src/js/bear-chase/props/ChasePropResources.js#L276) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/DecorativeGeometry.js

[Implementação](../src/js/bear-chase/props/DecorativeGeometry.js). Contratos exportados/reexportados: `oval`, `profile`, `rounded`, `curve`, `rod`, `outline`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `oval(p, m, at, size, rotation = [0, 0, 0])` | Função | [4](../src/js/bear-chase/props/DecorativeGeometry.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `profile(p, m, shape, depth, at = [0, 0, 0], bevel = .012)` | Função | [10](../src/js/bear-chase/props/DecorativeGeometry.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rounded(p, m, at, size, radius = .05, bevel = .012)` | Função | [37](../src/js/bear-chase/props/DecorativeGeometry.js#L37) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `curve(p, m, points, radius = .012, closed = false)` | Função | [52](../src/js/bear-chase/props/DecorativeGeometry.js#L52) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rod(p, m, a, b, r = .018)` | Função | [57](../src/js/bear-chase/props/DecorativeGeometry.js#L57) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `outline(commands)` | Função | [70](../src/js/bear-chase/props/DecorativeGeometry.js#L70) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/DecorativeProps.js

[Implementação](../src/js/bear-chase/props/DecorativeProps.js). Contratos exportados/reexportados: `decorativeFactories`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `teddy(p, m)` | Função | [15](../src/js/bear-chase/props/DecorativeProps.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `robot(p, m)` | Função | [49](../src/js/bear-chase/props/DecorativeProps.js#L49) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `duck(p, m)` | Função | [85](../src/js/bear-chase/props/DecorativeProps.js#L85) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drum(p, m)` | Função | [119](../src/js/bear-chase/props/DecorativeProps.js#L119) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `jack(p, m)` | Função | [136](../src/js/bear-chase/props/DecorativeProps.js#L136) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `armchair(p, m)` | Função | [192](../src/js/bear-chase/props/DecorativeProps.js#L192) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `horse(p, m)` | Função | [241](../src/js/bear-chase/props/DecorativeProps.js#L241) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `table(p, m)` | Função | [332](../src/js/bear-chase/props/DecorativeProps.js#L332) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `decorativeFactories(resources)` | Função | [351](../src/js/bear-chase/props/DecorativeProps.js#L351) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mat(region, tint)` | Função atribuída | [352](../src/js/bear-chase/props/DecorativeProps.js#L352) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | [405](../src/js/bear-chase/props/DecorativeProps.js#L405) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/OakCabinetProp.js

[Implementação](../src/js/bear-chase/props/OakCabinetProp.js). Contratos exportados/reexportados: `OakCabinetProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [8](../src/js/bear-chase/props/OakCabinetProp.js#L8) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | [51](../src/js/bear-chase/props/OakCabinetProp.js#L51) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

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
| `constructor(resources)` | Método declarado | [9](../src/js/bear-chase/props/ToyChestProp.js#L9) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `sidePanel(parts, material, x)` | Método declarado | [56](../src/js/bear-chase/props/ToyChestProp.js#L56) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `inscription(resources)` | Método declarado | [79](../src/js/bear-chase/props/ToyChestProp.js#L79) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | [114](../src/js/bear-chase/props/ToyChestProp.js#L114) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/TrainProp.js

[Implementação](../src/js/bear-chase/props/TrainProp.js). Contratos exportados/reexportados: `TrainProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [8](../src/js/bear-chase/props/TrainProp.js#L8) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | [54](../src/js/bear-chase/props/TrainProp.js#L54) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/brinquedao/BrinquedaoArt.js

[Implementação](../src/js/brinquedao/BrinquedaoArt.js). Contratos exportados/reexportados: `BRINQUEDAO_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/brinquedao/BrinquedaoAttractions.js

[Implementação](../src/js/brinquedao/BrinquedaoAttractions.js). Contratos exportados/reexportados: `prepareBrinquedaoAttractions`, `drawBrinquedaoCastles`, `drawBrinquedaoSpring`, `drawBrinquedaoElastic`, `drawBrinquedaoSideMats`, `drawBrinquedaoBridgeFish`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `prepareBrinquedaoAttractions(image)` | Função | [19](../src/js/brinquedao/BrinquedaoAttractions.js#L19) | Extrai as quatro pinturas completas e mede o contorno da rampa sem sobrescrever PNGs. |
| `drawBrinquedaoCastles(ctx, parts, left, right)` | Função | [46](../src/js/brinquedao/BrinquedaoAttractions.js#L46) | Compõe torres acolchoadas sob seus terraços físicos. |
| `drawBrinquedaoSpring(ctx, image, p, s)` | Função | [56](../src/js/brinquedao/BrinquedaoAttractions.js#L56) | Deforma a lona pelo relógio persistido do impacto, mantendo os pés físicos independentes. |
| `drawBrinquedaoElastic(ctx, parts, s, left, right)` | Função | [69](../src/js/brinquedao/BrinquedaoAttractions.js#L69) | Compõe o painel oblíquo e seu recuo após contato. |
| `drawBrinquedaoSideMats(ctx, parts, s, left, right)` | Função | [83](../src/js/brinquedao/BrinquedaoAttractions.js#L83) | Gira as lonas pintadas nas extremidades das calhas e apresenta compressão por impacto. |
| `drawBrinquedaoBridgeFish(ctx, parts, s, left, right, bottom = 0)` | Função | [100](../src/js/brinquedao/BrinquedaoAttractions.js#L100) | Desenha investidas curtas perto de Yuna; a pose é compartilhada com o contato físico. |

## src/js/brinquedao/BrinquedaoAudio.js

[Implementação](../src/js/brinquedao/BrinquedaoAudio.js). Contratos exportados/reexportados: `BrinquedaoAudio`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(host)` | Método declarado | [7](../src/js/brinquedao/BrinquedaoAudio.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `update(state, paused = false)` | Método declarado | [14](../src/js/brinquedao/BrinquedaoAudio.js#L14) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateWings()` | Método declarado | [18](../src/js/brinquedao/BrinquedaoAudio.js#L18) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `event(type)` | Método declarado | [21](../src/js/brinquedao/BrinquedaoAudio.js#L21) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/brinquedao/BrinquedaoCinematic.js

[Implementação](../src/js/brinquedao/BrinquedaoCinematic.js). Contratos exportados/reexportados: `drawBrinquedaoGirl`, `drawBrinquedaoFairy`, `renderBrinquedaoCinematic`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawBrinquedaoGirl(ctx, images, index, x, base, height, { flip = 1, tilt = 0, time = 0, seat = false } = {})` | Função | [19](../src/js/brinquedao/BrinquedaoCinematic.js#L19) | Apresenta a atuação completa com escala comum, pés e máscara da prancha. |
| `drawBrinquedaoFairy(ctx, image, x, y, height, time)` | Função | [41](../src/js/brinquedao/BrinquedaoCinematic.js#L41) | Compõe Nanda em tamanho habitual com batimento das asas. |
| `renderBrinquedaoCinematic(ctx, canvas, s, images, onAdvance)` | Função | [54](../src/js/brinquedao/BrinquedaoCinematic.js#L54) | Compõe piquenique, convite e jardim com enquadramento narrativo e leitura segura. |

## src/js/brinquedao/BrinquedaoExtension.js

[Implementação](../src/js/brinquedao/BrinquedaoExtension.js). Contratos exportados/reexportados: `BRINQUEDAO_EXTENSION_TRACKS`, `BRINQUEDAO_ELASTIC`, `brinquedaoDeathY`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `add(id, from, to, y, end, kind, extra = {})` | Função atribuída | [3](../src/js/brinquedao/BrinquedaoExtension.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `brinquedaoDeathY(x)` | Função | [55](../src/js/brinquedao/BrinquedaoExtension.js#L55) | Retorna o limite inferior de queda da região baixa ou dos castelos altos. |

## src/js/brinquedao/BrinquedaoFish.js

[Implementação](../src/js/brinquedao/BrinquedaoFish.js). Contratos exportados/reexportados: `BRINQUEDAO_FISH_ATTACK`, `brinquedaoFishSpecs`, `updateBrinquedaoFishAttack`, `brinquedaoFishPose`, `brinquedaoFishTouches`, `brinquedaoFishImpactAge`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `brinquedaoFishSpecs(bridge)` | Função | [16](../src/js/brinquedao/BrinquedaoFish.js#L16) | Define dois pontos fixos de ataque por ponte. |
| `updateBrinquedaoFishAttack(s)` | Função | [29](../src/js/brinquedao/BrinquedaoFish.js#L29) | Dispara a investida quando Yuna se aproxima e trava o alvo até o fim do salto. |
| `brinquedaoFishPose(spec, time, depth = 1600, attack = null)` | Função | [70](../src/js/brinquedao/BrinquedaoFish.js#L70) | Calcula o salto curto e o alvo travado no lançamento. |
| `brinquedaoFishTouches(player, fish)` | Função | [99](../src/js/brinquedao/BrinquedaoFish.js#L99) | Testa contato do corpo do peixe somente na janela ativa da investida. |
| `brinquedaoFishImpactAge(s)` | Função | [105](../src/js/brinquedao/BrinquedaoFish.js#L105) | Consulta o tempo desde o golpe para arremesso, proteção e rotação do corpo. |

## src/js/brinquedao/BrinquedaoGauntlet.js

[Implementação](../src/js/brinquedao/BrinquedaoGauntlet.js). Contratos exportados/reexportados: `BRINQUEDAO_GAUNTLET`, `BRINQUEDAO_REBOUNDS`, `brinquedaoBlockSolid`, `brinquedaoTriangleTouches`, `brinquedaoReboundPose`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `brinquedaoBlockSolid(i, index, time, difficulty = 'NORMAL')` | Função | [35](../src/js/brinquedao/BrinquedaoGauntlet.js#L35) | Consulta a onda de queda pelo relógio salvo e prazo do bloco. |
| `brinquedaoTriangleTouches(p)` | Função | [40](../src/js/brinquedao/BrinquedaoGauntlet.js#L40) | Testa tronco/pés contra o perfil triangular visível. |
| `brinquedaoReboundPose(index, u)` | Função | [50](../src/js/brinquedao/BrinquedaoGauntlet.js#L50) | Liga duas lonas pelo voo automático, independente dos controles. |

## src/js/brinquedao/BrinquedaoInterior.js

[Implementação](../src/js/brinquedao/BrinquedaoInterior.js). Contratos exportados/reexportados: `createBrinquedaoInterior`, `beginBrinquedaoInterior`, `retryBrinquedaoInterior`, `stepBrinquedaoInterior`, `validateBrinquedaoInterior`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(v, a, b)` | Função atribuída | [11](../src/js/brinquedao/BrinquedaoInterior.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `body()` | Função atribuída | [12](../src/js/brinquedao/BrinquedaoInterior.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createBrinquedaoInterior()` | Função | [23](../src/js/brinquedao/BrinquedaoInterior.js#L23) | Cria os quatro tubos, corpo da corrida e relógios dos desafios, sem peixes internos. |
| `beginBrinquedaoInterior(s)` | Função | [39](../src/js/brinquedao/BrinquedaoInterior.js#L39) | Encerra o movimento externo e abre o primeiro tubo antes da chegada. |
| `enterTube(i, leg)` | Função | [48](../src/js/brinquedao/BrinquedaoInterior.js#L48) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retryBrinquedaoInterior(s)` | Função | [58](../src/js/brinquedao/BrinquedaoInterior.js#L58) | Retoma o terceiro tubo após a queda dos blocos. |
| `finish(s, events)` | Função | [65](../src/js/brinquedao/BrinquedaoInterior.js#L65) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stepBrinquedaoInterior(s, input, seconds)` | Função | [84](../src/js/brinquedao/BrinquedaoInterior.js#L84) | Alterna curvas rápidas e piscinas manuais, integrando dano, proteção e conclusão. |
| `validateBrinquedaoInterior(s)` | Função | [216](../src/js/brinquedao/BrinquedaoInterior.js#L216) | Confere referências, relógios, corpo, dano e compatibilidade do estágio salvo. |

## src/js/brinquedao/BrinquedaoInteriorRenderer.js

[Implementação](../src/js/brinquedao/BrinquedaoInteriorRenderer.js). Contratos exportados/reexportados: `prepareBrinquedaoInterior`, `drawBrinquedaoInteriorDoor`, `renderBrinquedaoInterior`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `crops(image, set)` | Função | [33](../src/js/brinquedao/BrinquedaoInteriorRenderer.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareBrinquedaoInterior(images)` | Função | [50](../src/js/brinquedao/BrinquedaoInteriorRenderer.js#L50) | Recorta módulos de tubo e peixes completos em canvases reutilizáveis. |
| `drawBrinquedaoInteriorDoor(ctx, parts, kit)` | Função | [54](../src/js/brinquedao/BrinquedaoInteriorRenderer.js#L54) | Desenha a entrada acolchoada no antigo terraço final. |
| `pad(ctx, r, from, to, y)` | Função | [63](../src/js/brinquedao/BrinquedaoInteriorRenderer.js#L63) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `column(ctx, r, x, top, bottom)` | Função | [75](../src/js/brinquedao/BrinquedaoInteriorRenderer.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `portal(ctx, r, x, floor, incoming, shaft = true)` | Função | [80](../src/js/brinquedao/BrinquedaoInteriorRenderer.js#L80) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `block(ctx, r, x, y, w, index, age)` | Função | [88](../src/js/brinquedao/BrinquedaoInteriorRenderer.js#L88) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `triangle(ctx, r)` | Função | [92](../src/js/brinquedao/BrinquedaoInteriorRenderer.js#L92) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `finishGate(ctx, r)` | Função | [96](../src/js/brinquedao/BrinquedaoInteriorRenderer.js#L96) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `reboundRoom(ctx, r, preview = false)` | Função | [123](../src/js/brinquedao/BrinquedaoInteriorRenderer.js#L123) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `room(ctx, r, i, index, preview = false)` | Função | [137](../src/js/brinquedao/BrinquedaoInteriorRenderer.js#L137) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tube(ctx, r, index, center, worldW, worldH, front = false)` | Função | [166](../src/js/brinquedao/BrinquedaoInteriorRenderer.js#L166) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderBrinquedaoInterior(r, s, { touch = false, paused = false, onAdvance = () => {} } = {})` | Função | [182](../src/js/brinquedao/BrinquedaoInteriorRenderer.js#L182) | Compõe tubos translúcidos, piscinas em camadas, peixes, corações e controles. |

## src/js/brinquedao/BrinquedaoLevel.js

[Implementação](../src/js/brinquedao/BrinquedaoLevel.js). Contratos exportados/reexportados: `BRINQUEDAO`, `BRINQUEDAO_TRACKS`, `BRINQUEDAO_STEPS`, `BRINQUEDAO_FOUNDATIONS`, `BRINQUEDAO_BY_ID`, `BRINQUEDAO_CHECKPOINTS`, `BRINQUEDAO_SECTIONS`, `brinquedaoSurface`, `brinquedaoFoundationY`, `brinquedaoSupports`, `validateBrinquedaoStructure`, `brinquedaoSlope`, `brinquedaoMainAt`, `brinquedaoNearby`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `brinquedaoSurface(p, x)` | Função | [109](../src/js/brinquedao/BrinquedaoLevel.js#L109) | Consulta a altura do apoio e curvas com tangentes suaves nas extremidades. |
| `brinquedaoFoundationY(x)` | Função | [115](../src/js/brinquedao/BrinquedaoLevel.js#L115) | Consulta a altura da faixa de fundação para um apoio. |
| `springSupportSides(p)` | Função | [121](../src/js/brinquedao/BrinquedaoLevel.js#L121) | Resolve os lados de apoio configurados para cada lona, preservando ambos por padrão. |
| `supportAnchors(p)` | Função | [128](../src/js/brinquedao/BrinquedaoLevel.js#L128) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `brinquedaoSupports(p)` | Função | [156](../src/js/brinquedao/BrinquedaoLevel.js#L156) | Gera os apoios configurados por lado em cada estrutura e elimina os que um percurso sobreposto colocaria no vão central de uma ponte. |
| `validateBrinquedaoStructure()` | Função | [175](../src/js/brinquedao/BrinquedaoLevel.js#L175) | Valida apoios configurados, conexões contínuas, atalhos, degraus coincidentes e tangentes suaves nas curvas. |
| `brinquedaoSlope(p, x)` | Função | [209](../src/js/brinquedao/BrinquedaoLevel.js#L209) | Mede inclinação local para gravidade tangencial e pose da descida. |
| `brinquedaoMainAt(x)` | Função | [212](../src/js/brinquedao/BrinquedaoLevel.js#L212) | Localiza a pista principal correspondente à coordenada horizontal. |
| `brinquedaoNearby(left, right)` | Função | [215](../src/js/brinquedao/BrinquedaoLevel.js#L215) | Seleciona estruturas visíveis sem alterar sua simulação. |

## src/js/brinquedao/BrinquedaoLook.js

[Implementação](../src/js/brinquedao/BrinquedaoLook.js). Contratos exportados/reexportados: `BRINQUEDAO_LOOK_THEMES`, `BrinquedaoLook`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `canvas(w, h)` | Função | [31](../src/js/brinquedao/BrinquedaoLook.js#L31) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rounded(ctx, x, y, w, h, r, fill)` | Função | [38](../src/js/brinquedao/BrinquedaoLook.js#L38) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor(images, parts, inside)` | Método declarado | [47](../src/js/brinquedao/BrinquedaoLook.js#L47) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `copy(source)` | Método declarado | [87](../src/js/brinquedao/BrinquedaoLook.js#L87) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `grade(source, wash, inside)` | Método declarado | [95](../src/js/brinquedao/BrinquedaoLook.js#L95) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareFragile(part)` | Método declarado | [115](../src/js/brinquedao/BrinquedaoLook.js#L115) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareTube(source)` | Método declarado | [149](../src/js/brinquedao/BrinquedaoLook.js#L149) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `focus(ctx, pose, diameter)` | Método declarado | [164](../src/js/brinquedao/BrinquedaoLook.js#L164) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `block(ctx, image, x, y, w, index, age)` | Método declarado | [175](../src/js/brinquedao/BrinquedaoLook.js#L175) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `triangle(ctx, image, t, floor)` | Método declarado | [215](../src/js/brinquedao/BrinquedaoLook.js#L215) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `joint(ctx, x, y, angle = 0, launch = false)` | Método declarado | [249](../src/js/brinquedao/BrinquedaoLook.js#L249) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [281](../src/js/brinquedao/BrinquedaoLook.js#L281) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/brinquedao/BrinquedaoObstacles.js

[Implementação](../src/js/brinquedao/BrinquedaoObstacles.js). Contratos exportados/reexportados: `createBrinquedaoObstacles`, `brinquedaoBridgeSolid`, `contactBrinquedao`, `hitBrinquedaoElastic`, `launchBrinquedaoSky`, `validateBrinquedaoObstacles`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createBrinquedaoObstacles()` | Função | [16](../src/js/brinquedao/BrinquedaoObstacles.js#L16) | Cria relógios de pontes/lonas e contagens de impacto sem recursos de apresentação. |
| `brinquedaoBridgeSolid(s, p)` | Função | [44](../src/js/brinquedao/BrinquedaoObstacles.js#L44) | Consulta se a peça ainda oferece apoio após contato, incluindo tolerância EASY. |
| `contactBrinquedao(s, track, events)` | Função | [48](../src/js/brinquedao/BrinquedaoObstacles.js#L48) | Registra apoio, ativa ponte ou aplica impulso descendente da lona, com reforço por PULAR. |
| `hitBrinquedaoElastic(s, previous, events)` | Função | [76](../src/js/brinquedao/BrinquedaoObstacles.js#L76) | Exige cruzamento e altura do painel lateral para transferir energia à rampa. |
| `launchBrinquedaoSky(s, events)` | Função | [95](../src/js/brinquedao/BrinquedaoObstacles.js#L95) | Converte a saída real do lábio em velocidade horizontal e vertical, liberando controle aéreo. |
| `validateBrinquedaoObstacles(s)` | Função | [110](../src/js/brinquedao/BrinquedaoObstacles.js#L110) | Confere referências e relógios de contato, rejeitando apoio em ponte caída. |

## src/js/brinquedao/BrinquedaoPhase.js

[Implementação](../src/js/brinquedao/BrinquedaoPhase.js). Contratos exportados/reexportados: `BrinquedaoPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ canvas, audio, enabled = () => true, difficulty = 'NORMAL', campaign = false })` | Método declarado | [25](../src/js/brinquedao/BrinquedaoPhase.js#L25) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `active()` | Acessor | [51](../src/js/brinquedao/BrinquedaoPhase.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reading()` | Método declarado | [55](../src/js/brinquedao/BrinquedaoPhase.js#L55) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `advanceDialogue()` | Método declarado | [61](../src/js/brinquedao/BrinquedaoPhase.js#L61) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `start(saved = null)` | Método declarado | [71](../src/js/brinquedao/BrinquedaoPhase.js#L71) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt = 1)` | Método declarado | [88](../src/js/brinquedao/BrinquedaoPhase.js#L88) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [103](../src/js/brinquedao/BrinquedaoPhase.js#L103) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `onAdvance()` | API/lambda de objeto | [111](../src/js/brinquedao/BrinquedaoPhase.js#L111) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Método declarado | [115](../src/js/brinquedao/BrinquedaoPhase.js#L115) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [121](../src/js/brinquedao/BrinquedaoPhase.js#L121) | Produz captura recuperável do estado específico deste componente. |
| `retry()` | Método declarado | [129](../src/js/brinquedao/BrinquedaoPhase.js#L129) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [135](../src/js/brinquedao/BrinquedaoPhase.js#L135) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/brinquedao/BrinquedaoRecovery.js

[Implementação](../src/js/brinquedao/BrinquedaoRecovery.js). Contratos exportados/reexportados: `BRINQUEDAO_RECOVERY_TRACKS`, `BRINQUEDAO_SIDE_MATS`, `brinquedaoOutletReady`, `brinquedaoOutletFlight`, `brinquedaoRicochetAge`, `hitBrinquedaoSideMat`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `add(id, from, to, y, end, kind, extra = {})` | Função atribuída | [4](../src/js/brinquedao/BrinquedaoRecovery.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `brinquedaoOutletReady(s, group)` | Função | [70](../src/js/brinquedao/BrinquedaoRecovery.js#L70) | Consulta a abertura da saída após duas rebatidas da calha. |
| `brinquedaoOutletFlight(s)` | Função | [74](../src/js/brinquedao/BrinquedaoRecovery.js#L74) | Consulta o breve lançamento até a lona, preservando impulso e permitindo frenagem. |
| `brinquedaoRicochetAge(s)` | Função | [82](../src/js/brinquedao/BrinquedaoRecovery.js#L82) | Consulta o tempo desde a última rebatida para recuo e retomada gradual da direção. |
| `hitBrinquedaoSideMat(s, previous, events)` | Função | [88](../src/js/brinquedao/BrinquedaoRecovery.js#L88) | Exige cruzamento lateral e sobreposição ao corpo para devolver impulso sem teleporte. |

## src/js/brinquedao/BrinquedaoRenderer.js

[Implementação](../src/js/brinquedao/BrinquedaoRenderer.js). Contratos exportados/reexportados: `BrinquedaoRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas)` | Método declarado | [71](../src/js/brinquedao/BrinquedaoRenderer.js#L71) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [81](../src/js/brinquedao/BrinquedaoRenderer.js#L81) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `backdrop(s, frame)` | Método declarado | [99](../src/js/brinquedao/BrinquedaoRenderer.js#L99) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `controls()` | Método declarado | [137](../src/js/brinquedao/BrinquedaoRenderer.js#L137) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(s, touch = false)` | Método declarado | [141](../src/js/brinquedao/BrinquedaoRenderer.js#L141) | Calcula pose visual estável sem escrever na simulação. |
| `girl(ctx, s)` | Método declarado | [162](../src/js/brinquedao/BrinquedaoRenderer.js#L162) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(s, { ready = true, error = null, paused = false, touch = false, onAdvance = () => {} } = {})` | Método declarado | [193](../src/js/brinquedao/BrinquedaoRenderer.js#L193) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [318](../src/js/brinquedao/BrinquedaoRenderer.js#L318) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/brinquedao/BrinquedaoSimulation.js

[Implementação](../src/js/brinquedao/BrinquedaoSimulation.js). Contratos exportados/reexportados: `createBrinquedaoState`, `restoreBrinquedaoState`, `recoverBrinquedao`, `stepBrinquedao`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(v, a, b)` | Função atribuída | [44](../src/js/brinquedao/BrinquedaoSimulation.js#L44) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createBrinquedaoState(difficulty = 'NORMAL')` | Função | [46](../src/js/brinquedao/BrinquedaoSimulation.js#L46) | Cria domínio8 com ataques reativos, pontes rápidas e corrida de quatro tubos. |
| `restoreBrinquedaoState(saved, difficulty)` | Função | [81](../src/js/brinquedao/BrinquedaoSimulation.js#L81) | Valida domínio8/interior3 e migra saves1–7, convertendo piscinas e progresso antigo. |
| `recoverBrinquedao(s)` | Função | [184](../src/js/brinquedao/BrinquedaoSimulation.js#L184) | Retoma o último terraço após queda/derrota e rearma as pontes futuras. |
| `stepBrinquedao(s, input = {}, seconds = 0)` | Função | [208](../src/js/brinquedao/BrinquedaoSimulation.js#L208) | Integra embalo, saltos manuais, degraus, pistas, lonas, pontes e lançamentos em subpassos; detecta perda dos apoios e derrota. |

## src/js/brinquedao/BrinquedaoStory.js

[Implementação](../src/js/brinquedao/BrinquedaoStory.js). Contratos exportados/reexportados: `BRINQUEDAO_INTRO`, `advanceBrinquedaoStory`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `advanceBrinquedaoStory(s)` | Função | [46](../src/js/brinquedao/BrinquedaoStory.js#L46) | Avança uma fala ou encerra a leitura consumindo o gesto de pulo. |

## src/js/brinquedao/BrinquedaoTerrain.js

[Implementação](../src/js/brinquedao/BrinquedaoTerrain.js). Contratos exportados/reexportados: `prepareBrinquedaoParts`, `drawBrinquedaoSurfaceStrip`, `drawBrinquedaoTerrain`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `prepareBrinquedaoParts(image, slide)` | Função | [20](../src/js/brinquedao/BrinquedaoTerrain.js#L20) | Extrai módulos completos e mede o topo pintado para registrar o material. |
| `pillar(ctx, support, parts, viewportBottom)` | Função | [106](../src/js/brinquedao/BrinquedaoTerrain.js#L106) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `trackSupports(ctx, p, parts, viewportBottom)` | Função | [128](../src/js/brinquedao/BrinquedaoTerrain.js#L128) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `surfaceAt(part, x)` | Função | [132](../src/js/brinquedao/BrinquedaoTerrain.js#L132) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawPaddedEnd(ctx, part, p, x, side)` | Função | [139](../src/js/brinquedao/BrinquedaoTerrain.js#L139) | Finaliza as pontas dos atalhos com espuma arredondada dentro dos limites do apoio físico. |
| `drawBrinquedaoSurfaceStrip(ctx, part, sx, nextSx, x, nextX, y, nextY, k, height)` | Função | [166](../src/js/brinquedao/BrinquedaoTerrain.js#L166) | Compõe a faixa ilustrada com amostragem contínua e transformação afim pela tangente, sem modificar o apoio físico. |
| `stepJoint(ctx, parts, step, viewportBottom)` | Função | [177](../src/js/brinquedao/BrinquedaoTerrain.js#L177) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawBrinquedaoTerrain(ctx, parts, left, right, s, attractions, look = null, viewportBottom = null)` | Função | [206](../src/js/brinquedao/BrinquedaoTerrain.js#L206) | Projeta acolchoados, madeira, escorregadores e pilares além do limite visível sobre as curvas físicas. |
| `drawConnections(ctx, parts, look, left, right)` | Função | [271](../src/js/brinquedao/BrinquedaoTerrain.js#L271) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/brinquedao/BrinquedaoTubes.js

[Implementação](../src/js/brinquedao/BrinquedaoTubes.js). Contratos exportados/reexportados: `BRINQUEDAO_INSIDE`, `BRINQUEDAO_TUBES`, `brinquedaoTubePose`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `buildTube(index)` | Função | [62](../src/js/brinquedao/BrinquedaoTubes.js#L62) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `push(x, y)` | Função atribuída | [66](../src/js/brinquedao/BrinquedaoTubes.js#L66) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `line(point)` | Função atribuída | [75](../src/js/brinquedao/BrinquedaoTubes.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `brinquedaoTubePose(index, u)` | Função | [110](../src/js/brinquedao/BrinquedaoTubes.js#L110) | Consulta posição e tangente pelo comprimento amostrado da curva. |

## src/js/chapters/ChapterArt.js

[Implementação](../src/js/chapters/ChapterArt.js). Contratos exportados/reexportados: `CHAPTER_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/chapters/ChapterCard.js

[Implementação](../src/js/chapters/ChapterCard.js). Contratos exportados/reexportados: `renderChapterCard`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderChapterCard(ctx, canvas, { image, number, title, age = 0, duration = 5, onAdvance } = {})` | Função | [12](../src/js/chapters/ChapterCard.js#L12) | Desenha a gravura e o título na área segura; registra avanço da leitura sem avançar a fase por trás. |

## src/js/chapters/ToyRoomEpilogue.js

[Implementação](../src/js/chapters/ToyRoomEpilogue.js). Contratos exportados/reexportados: `TOY_ROOM_EPILOGUE`, `ToyRoomEpilogue`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ assets, audio, onComplete = () => {}, saved, campaign = true } = {})` | Método declarado | [57](../src/js/chapters/ToyRoomEpilogue.js#L57) | Recebe assets, áudio, callback, origem e save opcional; valida versão/índice/relógios e inicia a música da sala. |
| `beat()` | Acessor | [87](../src/js/chapters/ToyRoomEpilogue.js#L87) | Consulta o quadro corrente de TOY_ROOM_EPILOGUE sem avançar a sequência. |
| `snapshot()` | Método declarado | [94](../src/js/chapters/ToyRoomEpilogue.js#L94) | Captura versão 1, índice, idade e tempo; a inclusão no save depende da origem no host. |
| `advanceDialogue()` | Método declarado | [103](../src/js/chapters/ToyRoomEpilogue.js#L103) | Avança somente fala ou gravura; recusa o plano silencioso de facepalm e cenas encerradas. |
| `next()` | Método declarado | [111](../src/js/chapters/ToyRoomEpilogue.js#L111) | Troca o quadro e zera a idade; no último, encerra e chama onComplete uma vez. |
| `update(dt)` | Método declarado | [124](../src/js/chapters/ToyRoomEpilogue.js#L124) | Converte dt legado para segundos, avança relógios/fade musical e conclui quadros no tempo autorado. |
| `render(ctx, canvas)` | Método declarado | [133](../src/js/chapters/ToyRoomEpilogue.js#L133) | Compõe quarto arrumado, poses e fala na área segura; aproxima Nanda no facepalm e apresenta a gravura do capítulo 2. |
| `onAdvance()` | API/lambda de objeto | [144](../src/js/chapters/ToyRoomEpilogue.js#L144) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawGirl(index, alpha)` | Função atribuída | [193](../src/js/chapters/ToyRoomEpilogue.js#L193) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `onAdvance()` | API/lambda de objeto | [228](../src/js/chapters/ToyRoomEpilogue.js#L228) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/cinematics/OpeningSequence.js

[Implementação](../src/js/cinematics/OpeningSequence.js). Contratos exportados/reexportados: `OPENING_STORAGE_KEY`, `OPENING_DIALOGUE`, `OpeningSequence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ storage, onReveal = () => {}, onComplete = () => {}, onCue = () => {} } = {})` | Método declarado | [47](../src/js/cinematics/OpeningSequence.js#L47) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `hasCompleted()` | Método declarado | [70](../src/js/cinematics/OpeningSequence.js#L70) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `start({ replay = false } = {})` | Método declarado | [81](../src/js/cinematics/OpeningSequence.js#L81) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `cancel()` | Método declarado | [96](../src/js/cinematics/OpeningSequence.js#L96) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reset()` | Método declarado | [103](../src/js/cinematics/OpeningSequence.js#L103) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [116](../src/js/cinematics/OpeningSequence.js#L116) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [127](../src/js/cinematics/OpeningSequence.js#L127) | Reaplica a captura específica; confira referências e dados transitórios. |
| `advanceDialogue()` | Método declarado | [142](../src/js/cinematics/OpeningSequence.js#L142) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `revealing()` | Acessor | [155](../src/js/cinematics/OpeningSequence.js#L155) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [161](../src/js/cinematics/OpeningSequence.js#L161) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `renderFade(ctx, canvas)` | Método declarado | [195](../src/js/cinematics/OpeningSequence.js#L195) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `render(ctx, canvas, { assets, drawRoom, lighting, fairyRenderer })` | Método declarado | [208](../src/js/cinematics/OpeningSequence.js#L208) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `onAdvance()` | API/lambda de objeto | [224](../src/js/cinematics/OpeningSequence.js#L224) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onAdvance()` | API/lambda de objeto | [303](../src/js/cinematics/OpeningSequence.js#L303) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/cinematics/ToyRoomIntroduction.js

[Implementação](../src/js/cinematics/ToyRoomIntroduction.js). Contratos exportados/reexportados: `TOY_ROOM_INTRO_STAGES`, `ToyRoomIntroduction`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ onComplete = () => {}, onEvent = () => {} } = {})` | Método declarado | [70](../src/js/cinematics/ToyRoomIntroduction.js#L70) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `start(context)` | Método declarado | [82](../src/js/cinematics/ToyRoomIntroduction.js#L82) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stage()` | Acessor | [94](../src/js/cinematics/ToyRoomIntroduction.js#L94) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [112](../src/js/cinematics/ToyRoomIntroduction.js#L112) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `advanceDialogue()` | Método declarado | [135](../src/js/cinematics/ToyRoomIntroduction.js#L135) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `prepare({ assets, phase, departure, audio })` | Método declarado | [145](../src/js/cinematics/ToyRoomIntroduction.js#L145) | Prepara contexto visual da introdução; consulte dependências no módulo. |
| `dialogue()` | Acessor | [163](../src/js/cinematics/ToyRoomIntroduction.js#L163) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraFrame(canvas)` | Método declarado | [178](../src/js/cinematics/ToyRoomIntroduction.js#L178) | Calcula enquadramento narrativo da introdução conforme etapa e relógio. |
| `fairyPosition()` | Método declarado | [221](../src/js/cinematics/ToyRoomIntroduction.js#L221) | Calcula posição visual da fada durante a introdução. |
| `drawGirl(ctx)` | Método declarado | [237](../src/js/cinematics/ToyRoomIntroduction.js#L237) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFairy(ctx)` | Método declarado | [264](../src/js/cinematics/ToyRoomIntroduction.js#L264) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `render(ctx, canvas)` | Método declarado | [289](../src/js/cinematics/ToyRoomIntroduction.js#L289) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialogue(ctx, canvas, text)` | Método declarado | [332](../src/js/cinematics/ToyRoomIntroduction.js#L332) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `cancel()` | Método declarado | [341](../src/js/cinematics/ToyRoomIntroduction.js#L341) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/config.js

[Implementação](../src/js/config.js). Contratos exportados/reexportados: `DEBUG_COLLISIONS`, `GAME_CONFIG`, `FLOOR_Y`, `createBabyState`, `CUTSCENE_DIALOGUE`, `getApproachJumpSpeed`, `getEscapeStats`, `getPhase3Stats`, `createFairyState`, `platforms`, `exitDoor`, `phase3Platforms`, `trueExitDoor`, `roomScenery`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createBabyState()` | Função | [12](../src/js/config.js#L12) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `getApproachJumpSpeed(platformIndex, difficulty = 'NORMAL')` | Função | [46](../src/js/config.js#L46) | Consulta o alcance fixo da aproximação por apoio e dificuldade, sem mirar pela posição do comando. |
| `getEscapeStats(level, difficulty = 'NORMAL')` | Função | [72](../src/js/config.js#L72) | Consulta impulso, corrida e efeitos da fuga; o alcance aéreo varia entre NORMAL e EASY. |
| `getPhase3Stats(level, fromFloor = false, difficulty = 'NORMAL')` | Função | [94](../src/js/config.js#L94) | Consulta atributos do retorno por nível e dificuldade; fromFloor distingue a entrada pelo chão. |
| `createFairyState()` | Função | [108](../src/js/config.js#L108) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/AndroidFraming.js

[Implementação](../src/js/controllers/AndroidFraming.js). Contratos exportados/reexportados: `androidFrameOffset`, `createAndroidFraming`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `androidFrameOffset({ enabled, height, cssHeight, bottomInset = 0, topInset = 0, feetY, topY })` | Função | [2](../src/js/controllers/AndroidFraming.js#L2) | Calcula elevação visual Android com reservas e proteção do topo. |
| `createAndroidFraming(canvas)` | Função | [20](../src/js/controllers/AndroidFraming.js#L20) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `offset(feetY, topY)` | Método declarado | [36](../src/js/controllers/AndroidFraming.js#L36) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/AudioController.js

[Implementação](../src/js/controllers/AudioController.js). Contratos exportados/reexportados: `AudioController`, `createAudioController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [16](../src/js/controllers/AudioController.js#L16) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `init()` | Método declarado | [34](../src/js/controllers/AudioController.js#L34) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handleVisibilityChange()` | Método declarado | [47](../src/js/controllers/AudioController.js#L47) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleWindowBlur()` | Método declarado | [59](../src/js/controllers/AudioController.js#L59) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleWindowFocus()` | Método declarado | [68](../src/js/controllers/AudioController.js#L68) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onBackground()` | Método declarado | [77](../src/js/controllers/AudioController.js#L77) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onForeground()` | Método declarado | [94](../src/js/controllers/AudioController.js#L94) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setMasterVolume(volume)` | Método declarado | [114](../src/js/controllers/AudioController.js#L114) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | Método declarado | [125](../src/js/controllers/AudioController.js#L125) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getAudioContext()` | Método declarado | [133](../src/js/controllers/AudioController.js#L133) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(muted)` | Método declarado | [140](../src/js/controllers/AudioController.js#L140) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `isMuted()` | Método declarado | [151](../src/js/controllers/AudioController.js#L151) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | Método declarado | [159](../src/js/controllers/AudioController.js#L159) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `initAudio()` | Método declarado | [168](../src/js/controllers/AudioController.js#L168) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startMusic()` | Método declarado | [177](../src/js/controllers/AudioController.js#L177) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `playOpeningAmbience()` | Método declarado | [186](../src/js/controllers/AudioController.js#L186) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startMusicBox()` | Método declarado | [193](../src/js/controllers/AudioController.js#L193) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopMusic()` | Método declarado | [202](../src/js/controllers/AudioController.js#L202) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stopAllAudio()` | Método declarado | [211](../src/js/controllers/AudioController.js#L211) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearActiveSounds()` | Método declarado | [220](../src/js/controllers/AudioController.js#L220) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playJumpSound()` | Método declarado | [229](../src/js/controllers/AudioController.js#L229) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLongJumpSound(progress)` | Método declarado | [238](../src/js/controllers/AudioController.js#L238) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLevelUpChime(level)` | Método declarado | [247](../src/js/controllers/AudioController.js#L247) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyVoiceBlip(freq)` | Método declarado | [256](../src/js/controllers/AudioController.js#L256) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyLaugh()` | Método declarado | [265](../src/js/controllers/AudioController.js#L265) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playEscapePowerUp()` | Método declarado | [274](../src/js/controllers/AudioController.js#L274) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFallFailSound()` | Método declarado | [283](../src/js/controllers/AudioController.js#L283) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playTapeRipSound()` | Método declarado | [292](../src/js/controllers/AudioController.js#L292) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDramaticTumbleSound()` | Método declarado | [301](../src/js/controllers/AudioController.js#L301) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyThudSound()` | Método declarado | [310](../src/js/controllers/AudioController.js#L310) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playBabyShockVoice()` | Método declarado | [319](../src/js/controllers/AudioController.js#L319) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyFrustratedSound()` | Método declarado | [328](../src/js/controllers/AudioController.js#L328) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPhase3StartFanfare()` | Método declarado | [337](../src/js/controllers/AudioController.js#L337) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setToyRoomMusicFade(value)` | Método declarado | [346](../src/js/controllers/AudioController.js#L346) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setToyRoomMusicIntensity(value)` | Método declarado | [352](../src/js/controllers/AudioController.js#L352) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playArenaMusicBeat(beat)` | Método declarado | [358](../src/js/controllers/AudioController.js#L358) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopArenaMusic()` | Método declarado | [364](../src/js/controllers/AudioController.js#L364) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playArenaSound(event)` | Método declarado | [370](../src/js/controllers/AudioController.js#L370) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setToyRoomMusicTrack(track)` | Método declarado | [376](../src/js/controllers/AudioController.js#L376) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPortalExitWhoosh()` | Método declarado | [384](../src/js/controllers/AudioController.js#L384) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playSoftMagicBurst()` | Método declarado | [390](../src/js/controllers/AudioController.js#L390) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startToyRoomMusic(options)` | Método declarado | [397](../src/js/controllers/AudioController.js#L397) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopToyRoomMusic()` | Método declarado | [406](../src/js/controllers/AudioController.js#L406) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | Método declarado | [415](../src/js/controllers/AudioController.js#L415) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | Método declarado | [424](../src/js/controllers/AudioController.js#L424) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getToyRoomAudioElement()` | Método declarado | [433](../src/js/controllers/AudioController.js#L433) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `playPickUpSound()` | Método declarado | [443](../src/js/controllers/AudioController.js#L443) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDropSound()` | Método declarado | [452](../src/js/controllers/AudioController.js#L452) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOrganizeChime(streak)` | Método declarado | [461](../src/js/controllers/AudioController.js#L461) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playToyRoomVictory()` | Método declarado | [470](../src/js/controllers/AudioController.js#L470) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playCombatSound(event)` | Método declarado | [479](../src/js/controllers/AudioController.js#L479) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `destroy()` | Método declarado | [488](../src/js/controllers/AudioController.js#L488) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `createAudioController(options = {})` | Função | [500](../src/js/controllers/AudioController.js#L500) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/CameraController.js

[Implementação](../src/js/controllers/CameraController.js). Contratos exportados/reexportados: `CameraController`, `createCameraController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [16](../src/js/controllers/CameraController.js#L16) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `reset(x = 0, y = 0, zoom = 1.0)` | Método declarado | [30](../src/js/controllers/CameraController.js#L30) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setZoom(zoom, immediate = false)` | Método declarado | [41](../src/js/controllers/CameraController.js#L41) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setPosition(x, y, immediate = false)` | Método declarado | [51](../src/js/controllers/CameraController.js#L51) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `update(dt, state, canvas, callbacks = {})` | Método declarado | [69](../src/js/controllers/CameraController.js#L69) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `syncFromState(state)` | Método declarado | [202](../src/js/controllers/CameraController.js#L202) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncToState(state)` | Método declarado | [214](../src/js/controllers/CameraController.js#L214) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `applyTransform(ctx, canvas, baby, fairy, presentationY = this.y, presentationX = this.x, sourceX = this.x)` | Método declarado | [230](../src/js/controllers/CameraController.js#L230) | Compõe foco/zoom e diferença entre pose original e visual no contexto. |
| `createCameraController(options = {})` | Função | [245](../src/js/controllers/CameraController.js#L245) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/CameraPresentation.js

[Implementação](../src/js/controllers/CameraPresentation.js). Contratos exportados/reexportados: `getDarkRoomScrollFrame`, `getPhase3ScrollFrame`, `CameraPresentation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getDarkRoomScrollFrame({ x, width, height })` | Função | [6](../src/js/controllers/CameraPresentation.js#L6) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getPhase3ScrollFrame(viewport)` | Função | [21](../src/js/controllers/CameraPresentation.js#L21) | Calcula a rolagem visual do retorno pelo progresso horizontal do cenário, sem seguir salto ou pouso. |
| `constructor()` | Método declarado | [31](../src/js/controllers/CameraPresentation.js#L31) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `reset()` | Método declarado | [38](../src/js/controllers/CameraPresentation.js#L38) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [45](../src/js/controllers/CameraPresentation.js#L45) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [58](../src/js/controllers/CameraPresentation.js#L58) | Reaplica a captura específica; confira referências e dados transitórios. |
| `mobileFrame({ target, enabled, stable, anticipate, tick, width, height, fixed = false })` | Método declarado | [70](../src/js/controllers/CameraPresentation.js#L70) | Interpola entrada do enquadramento móvel. |
| `step(from, to, dimension)` | Função atribuída | [114](../src/js/controllers/CameraPresentation.js#L114) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame({ x, y, active, narrative, tick, width, height, cssWidth, cssHeight, zoom })` | Método declarado | [136](../src/js/controllers/CameraPresentation.js#L136) | Calcula pose visual estável sem escrever na simulação. |
| `move(from, to, dimension, cssDimension)` | Função atribuída | [166](../src/js/controllers/CameraPresentation.js#L166) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/EscapeFairyGuide.js

[Implementação](../src/js/controllers/EscapeFairyGuide.js). Contratos exportados/reexportados: `getEscapeGuideTarget`, `updateEscapeFairyGuide`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getEscapeGuideTarget(baby, platforms, exitDoor)` | Função | [2](../src/js/controllers/EscapeFairyGuide.js#L2) | Seleciona centro de chegada do próximo apoio ou porta. |
| `updateEscapeFairyGuide(fairy, target, dt = 1)` | Função | [20](../src/js/controllers/EscapeFairyGuide.js#L20) | Atualiza posição/velocidade da guia com amortecimento crítico. |

## src/js/controllers/InputController.js

[Implementação](../src/js/controllers/InputController.js). Contratos exportados/reexportados: `InputController`, `bindInput`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(game, options = {})` | Método declarado | [12](../src/js/controllers/InputController.js#L12) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `init()` | Método declarado | [36](../src/js/controllers/InputController.js#L36) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `triggerJump(source)` | Método declarado | [52](../src/js/controllers/InputController.js#L52) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handlePointerDown(event)` | Método declarado | [80](../src/js/controllers/InputController.js#L80) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyDown(event)` | Método declarado | [124](../src/js/controllers/InputController.js#L124) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | [167](../src/js/controllers/InputController.js#L167) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gamepadLoop()` | Método declarado | [219](../src/js/controllers/InputController.js#L219) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGamepadPollingLoop()` | Método declarado | [228](../src/js/controllers/InputController.js#L228) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleGamepadDisconnected(event)` | Método declarado | [237](../src/js/controllers/InputController.js#L237) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `destroy()` | Método declarado | [247](../src/js/controllers/InputController.js#L247) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `bindInput(game)` | Função | [266](../src/js/controllers/InputController.js#L266) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pollGamepad()` | API/lambda de objeto | [274](../src/js/controllers/InputController.js#L274) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | API/lambda de objeto | [278](../src/js/controllers/InputController.js#L278) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/controllers/MobileZoom.js

[Implementação](../src/js/controllers/MobileZoom.js). Contratos exportados/reexportados: `isMobileDevice`, `getDarkRoomMobileFrame`, `getMobileZoomFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `isMobileDevice(nav = globalThis.navigator)` | Função | [2](../src/js/controllers/MobileZoom.js#L2) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDarkRoomMobileFrame({ width, height, cameraY, floorY, layout, anticipate = false })` | Função | [9](../src/js/controllers/MobileZoom.js#L9) | Calcula composição fixa por viewport/safe area, com envelope autorado de salto e rodapé reservado ao toque; não consulta atores. |
| `getMobileZoomFrame({ enabled, width, height, bounds, anchor, margin = 24, stable = false, anticipate = false })` | Função | [38](../src/js/controllers/MobileZoom.js#L38) | Retorna escala e translações de apresentação a partir dos limites/alvo. |
| `clamp(value, min, max)` | Função atribuída | [78](../src/js/controllers/MobileZoom.js#L78) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/ViewportController.js

[Implementação](../src/js/controllers/ViewportController.js). Contratos exportados/reexportados: `createViewportController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createViewportController({ canvas, darkCanvas, lighting, host, onOrientation })` | Função | [2](../src/js/controllers/ViewportController.js#L2) | Cria resize com Canvas, iluminação, host e callback de orientação. |
| `resize()` | Função | [9](../src/js/controllers/ViewportController.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/debug/AtlasDebugger.js

[Implementação](../src/js/debug/AtlasDebugger.js). Contratos exportados/reexportados: `AtlasDebugger`, `createAtlasDebugger`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [19](../src/js/debug/AtlasDebugger.js#L19) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | [33](../src/js/debug/AtlasDebugger.js#L33) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `validateAllRegions()` | Método declarado | [40](../src/js/debug/AtlasDebugger.js#L40) | Confere recortes do atlas contra imagens carregadas. |
| `initDOM()` | Método declarado | [95](../src/js/debug/AtlasDebugger.js#L95) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toggle(forceState = null)` | Método declarado | [192](../src/js/debug/AtlasDebugger.js#L192) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Método declarado | [206](../src/js/debug/AtlasDebugger.js#L206) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `createAtlasDebugger(options)` | Função | [317](../src/js/debug/AtlasDebugger.js#L317) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/debug/CameraQaObserver.js

[Implementação](../src/js/debug/CameraQaObserver.js). Contratos exportados/reexportados: `createCameraQaObserver`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createCameraQaObserver({ host, snapshot })` | Função | [2](../src/js/debug/CameraQaObserver.js#L2) | Cria observador opcional ativado por cameraQa; lê snapshot sem alterar câmera. |
| `record(transform = null)` | Método declarado | [13](../src/js/debug/CameraQaObserver.js#L13) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/dream-forest/DreamArt.js

[Implementação](../src/js/dream-forest/DreamArt.js). Contratos exportados/reexportados: `DREAM_CLIMB`, `DREAM_INSECTS`, `DREAM_PROFILES`, `DREAM_LEAF`, `DREAM_BEE`, `DREAM_SPIDER`, `DREAM_BRANCH`, `DREAM_CLIMB_CYCLE`, `DREAM_CLIMB_CONTACTS`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/dream-forest/DreamAudio.js

[Implementação](../src/js/dream-forest/DreamAudio.js). Contratos exportados/reexportados: `DreamAudio`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(host)` | Método declarado | [16](../src/js/dream-forest/DreamAudio.js#L16) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `scream()` | Método declarado | [26](../src/js/dream-forest/DreamAudio.js#L26) | Agenda vocalização sintetizada de susto com formantes, volume do host e descarte das vozes. |
| `selectTrack(state)` | Método declarado | [65](../src/js/dream-forest/DreamAudio.js#L65) | Seleciona a faixa do sonho ou do piquenique pelo estágio antes de restaurar a posição musical. |
| `update(state, paused = false)` | Método declarado | [83](../src/js/dream-forest/DreamAudio.js#L83) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `clear()` | Método declarado | [108](../src/js/dream-forest/DreamAudio.js#L108) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `event(type, event = {})` | Método declarado | [116](../src/js/dream-forest/DreamAudio.js#L116) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/dream-forest/DreamBeetle.js

[Implementação](../src/js/dream-forest/DreamBeetle.js). Contratos exportados/reexportados: `prepareDreamBeetle`, `dreamBeetlePose`, `drawDreamBeetle`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `polygon(ctx, points)` | Função | [59](../src/js/dream-forest/DreamBeetle.js#L59) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canvas(width, height)` | Função | [65](../src/js/dream-forest/DreamBeetle.js#L65) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareDreamBeetle(image)` | Função | [72](../src/js/dream-forest/DreamBeetle.js#L72) | Recorta e mascara em cache cabeça e patas da pintura original, conservando o casco de apoio. |
| `dreamBeetlePose(time, energy = .3)` | Função | [108](../src/js/dream-forest/DreamBeetle.js#L108) | Calcula articulações contínuas de asas, patas e cabeça conforme o tempo e a energia do voo. |
| `part(ctx, p, angle)` | Função | [118](../src/js/dream-forest/DreamBeetle.js#L118) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawDreamBeetle(ctx, image, parts, frame, time)` | Função | [126](../src/js/dream-forest/DreamBeetle.js#L126) | Desenha asas membranosas e membros articulados em torno do dorso rígido usado pela física. |

## src/js/dream-forest/DreamClimb.js

[Implementação](../src/js/dream-forest/DreamClimb.js). Contratos exportados/reexportados: `dreamClimbContact`, `dreamClimbPose`, `drawDreamClimb`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(v, a, b)` | Função atribuída | [11](../src/js/dream-forest/DreamClimb.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dreamClimbContact(frame, y, side)` | Função | [13](../src/js/dream-forest/DreamClimb.js#L13) | Localiza o contato visual da mão na haste ou no contorno pintado do corpo do inseto, sem usar asas móveis. |
| `topContact(frame, x)` | Função | [29](../src/js/dream-forest/DreamClimb.js#L29) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dreamClimbPose(player, frame)` | Função | [39](../src/js/dream-forest/DreamClimb.js#L39) | Escolhe quatro poses pela distância escalada e duas para chegar ao topo, com mão ancorada e inclinação do corpo. |
| `drawDreamClimb(ctx, image, state)` | Função | [62](../src/js/dream-forest/DreamClimb.js#L62) | Desenha Yuna pela âncora da mão e conserva a pintura inteira, sem mudar a física ou a pose no lombo. |

## src/js/dream-forest/DreamGlider.js

[Implementação](../src/js/dream-forest/DreamGlider.js). Contratos exportados/reexportados: `DREAM_GLIDE`, `dreamGlideRoute`, `DREAM_GLIDE_THORNS`, `dreamGliderPose`, `dreamGliderContact`, `beginDreamGlide`, `stepDreamGlide`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamGlideRoute(x)` | Função | [25](../src/js/dream-forest/DreamGlider.js#L25) | Interpola alturas para posicionar obstáculos; não dirige a personagem. |
| `dreamGliderPose(p)` | Função | [53](../src/js/dream-forest/DreamGlider.js#L53) | Compartilha âncora, escala e inclinação da pintura com a colisão. |
| `dreamGliderContact(p)` | Função | [62](../src/js/dream-forest/DreamGlider.js#L62) | Compara alfa opaco do planador e dos galhos próximos, ignorando névoa. |
| `beginDreamGlide(s)` | Função | [83](../src/js/dream-forest/DreamGlider.js#L83) | Prepara caminhada e checkpoint do lançamento no galho. |
| `stepDreamGlide(s, input, dt, branch, surface, events, finish)` | Função | [96](../src/js/dream-forest/DreamGlider.js#L96) | Integra caminhada, rajada, voo pesado, queda/reinício e pouso. |

## src/js/dream-forest/DreamGliderArt.js

[Implementação](../src/js/dream-forest/DreamGliderArt.js). Contratos exportados/reexportados: `DREAM_GLIDER_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/dream-forest/DreamGliderRenderer.js

[Implementação](../src/js/dream-forest/DreamGliderRenderer.js). Contratos exportados/reexportados: `drawDreamGlideThorns`, `drawDreamLaunchLeaf`, `drawDreamGlider`, `renderDreamLanding`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawDreamGlideThorns(ctx, images, left, right, top, bottom)` | Função | [15](../src/js/dream-forest/DreamGliderRenderer.js#L15) | Desenha galhos espinhosos de cima/baixo sem indicadores de hitbox. |
| `drawDreamLaunchLeaf(ctx, images, branch, time)` | Função | [39](../src/js/dream-forest/DreamGliderRenderer.js#L39) | Apresenta a única folha ainda presa à ponta do galho. |
| `drawDreamGlider(ctx, images, state)` | Função | [49](../src/js/dream-forest/DreamGliderRenderer.js#L49) | Desenha menina e folha como pintura íntegra com mãos conectadas. |
| `renderDreamLanding(ctx, canvas, state, images)` | Função | [60](../src/js/dream-forest/DreamGliderRenderer.js#L60) | Compõe fim da sustentação, perda da folha, queda e amortecimento no chão em tela cheia. |

## src/js/dream-forest/DreamIllustratedSprites.js

[Implementação](../src/js/dream-forest/DreamIllustratedSprites.js). Contratos exportados/reexportados: `prepareDreamIllustrations`, `drawDreamLeaf`, `dreamBeeWingPose`, `drawDreamBee`, `drawDreamBranch`, `drawDreamWeb`, `drawDreamGrass`, `prepareDreamBackdrop`, `drawDreamBackdrop`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `canvas(width, height)` | Função | [15](../src/js/dream-forest/DreamIllustratedSprites.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sample(values, u)` | Função | [22](../src/js/dream-forest/DreamIllustratedSprites.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareDreamIllustrations(leafImage, branchImage)` | Função | [28](../src/js/dream-forest/DreamIllustratedSprites.js#L28) | Prepara em cache folhas e galhos pintados nas larguras existentes, registrados nas superfícies físicas. |
| `drawDreamLeaf(ctx, image, cache, f, bottom)` | Função | [132](../src/js/dream-forest/DreamIllustratedSprites.js#L132) | Desenha folha e caule ilustrados; prolonga a base abaixo do viewport sem alterar o apoio. |
| `dreamBeeWingPose(time)` | Função | [141](../src/js/dream-forest/DreamIllustratedSprites.js#L141) | Calcula abertura e rotação contínuas das asas da abelhinha do bem pelo relógio do sonho. |
| `drawDreamBee(ctx, image, f, time)` | Função | [149](../src/js/dream-forest/DreamIllustratedSprites.js#L149) | Pinta o corpo íntegro com cotonete e articula as asas como camada separada. |
| `drawDreamBranch(ctx, image, cache, f, bottom, top)` | Função | [167](../src/js/dream-forest/DreamIllustratedSprites.js#L167) | Pinta tronco ancorado e galho ao vento, registrado na superfície física sem linhas auxiliares. |
| `drawDreamWeb(ctx, image, f, time, puppet)` | Função | [183](../src/js/dream-forest/DreamIllustratedSprites.js#L183) | Desenha seda até a aranha móvel e sua pintura, compartilhando a posição da simulação. |
| `drawDreamGrass(ctx, image, cache, f, bottom)` | Função | [205](../src/js/dream-forest/DreamIllustratedSprites.js#L205) | Deforma material pintado de lâmina e caule na linha física da grama. |
| `prepareDreamBackdrop(image)` | Função | [230](../src/js/dream-forest/DreamIllustratedSprites.js#L230) | Prepara a pintura do fundo com dissolução das bordas, sem espelhamento. |
| `drawDreamBackdrop(ctx, image, width, height, x)` | Função | [244](../src/js/dream-forest/DreamIllustratedSprites.js#L244) | Compõe a faixa de floresta sem criar árvores bilaterais nas emendas. |

## src/js/dream-forest/DreamInput.js

[Implementação](../src/js/dream-forest/DreamInput.js). Contratos exportados/reexportados: `dreamControls`, `nightmareControls`, `dreamMobileWebInput`, `DreamInput`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamControls(canvas, { stage = null, mobile = isMobileDevice() } = {})` | Função | [19](../src/js/dream-forest/DreamInput.js#L19) | Compartilha D-pad amplo com oito direções e pulo em todos os estágios mobile. |
| `nightmareControls(canvas)` | Função | [60](../src/js/dream-forest/DreamInput.js#L60) | Compartilha D-pad mobile e mantém quatro alvos no desktop para a perseguição. |
| `dreamMobileWebInput(state, input, { mobile = isMobileDevice(), seconds = 1 / 60 } = {})` | Função | [90](../src/js/dream-forest/DreamInput.js#L90) | Somente em celular e teias: sobe até a altura de preparo com velocidade normal, preservando comandos manuais e entrada original nos outros casos. |
| `constructor(canvas, enabled, unlock, scene)` | Método declarado | [110](../src/js/dream-forest/DreamInput.js#L110) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `sample()` | Método declarado | [125](../src/js/dream-forest/DreamInput.js#L125) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/dream-forest/DreamLevel.js

[Implementação](../src/js/dream-forest/DreamLevel.js). Contratos exportados/reexportados: `DREAM`, `DREAM_SECTIONS`, `DREAM_OBJECTS`, `DREAM_WIDTH`, `DREAM_BY_ID`, `dreamNearby`, `dreamObjectFrame`, `dreamGrassX`, `dreamSurface`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamNearby(left, right)` | Função | [187](../src/js/dream-forest/DreamLevel.js#L187) | Consulta células espaciais para limitar física e pintura à vizinhança, sem depender do viewport. |
| `dreamObjectFrame(o, time, rides = {})` | Função | [194](../src/js/dream-forest/DreamLevel.js#L194) | Calcula o deslocamento determinístico de hastes e insetos a partir do relógio salvo. |
| `dreamGrassX(frame, y)` | Função | [258](../src/js/dream-forest/DreamLevel.js#L258) | Calcula a curva compartilhada da haste; a ponta recebe vento e o caule abaixo da lâmina mantém a base fixa. |
| `dreamSurface(frame, x, profiles = {})` | Função | [263](../src/js/dream-forest/DreamLevel.js#L263) | Consulta relevo da folha ou perfil alfa nativo do inseto para apoiar os pés sem régua auxiliar. |

## src/js/dream-forest/DreamMud.js

[Implementação](../src/js/dream-forest/DreamMud.js). Contratos exportados/reexportados: `DREAM_MUD_LAKES`, `mudWaterline`, `mudLakeAt`, `mudBankY`, `mudGround`, `createMudState`, `enterDreamMud`, `stepDreamMud`, `mudActor`, `mudOccludesPoint`, `mudCheckpoint`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(v, a, b)` | Função atribuída | [4](../src/js/dream-forest/DreamMud.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mudWaterline(lake, x)` | Função | [72](../src/js/dream-forest/DreamMud.js#L72) | Interpola a superfície curva do lago, compartilhada pela pintura frontal, corpo e oclusão. |
| `mudLakeAt(x)` | Função | [82](../src/js/dream-forest/DreamMud.js#L82) | Localiza a área líquida atravessável do lago pelas margens autoradas. |
| `mudBankY(lake, side)` | Função | [85](../src/js/dream-forest/DreamMud.js#L85) | Retorna a altura de apoio da margem de entrada ou saída. |
| `mudGround(x)` | Função | [89](../src/js/dream-forest/DreamMud.js#L89) | Mantém fundo sob a lama e conecta as margens à terra firme. |
| `createMudState()` | Função | [104](../src/js/dream-forest/DreamMud.js#L104) | Cria o estado serializável de entrada, nado, braçada e saída da lama. |
| `enterDreamMud(n, lake, { side = n.facing, submerged = false } = {})` | Função | [118](../src/js/dream-forest/DreamMud.js#L118) | Inicia o salto de entrada na lama ou uma retomada já submersa. |
| `stepDreamMud(n, input, dt)` | Função | [141](../src/js/dream-forest/DreamMud.js#L141) | Integra arco do salto, impacto/imersão, nado e saída própria das margens. |
| `mudActor(n)` | Função | [205](../src/js/dream-forest/DreamMud.js#L205) | Compartilha pose e âncora de pés, superfície ou mão entre desenho e detecção. |
| `mudOccludesPoint(point)` | Função | [261](../src/js/dream-forest/DreamMud.js#L261) | Oculta pixels abaixo da superfície opaca desenhada do lago. |
| `mudCheckpoint(index)` | Função | [266](../src/js/dream-forest/DreamMud.js#L266) | Retoma um dos setores de lama dentro de um lago, já protegida. |

## src/js/dream-forest/DreamNightmare.js

[Implementação](../src/js/dream-forest/DreamNightmare.js). Contratos exportados/reexportados: `NIGHTMARE`, `NIGHTMARE_INTRO`, `NIGHTMARE_WAKE`, `NIGHTMARE_ROCKS`, `nightmarePatrol`, `nightmareLights`, `nightmareRayEnd`, `nightmareBeam`, `nightmareVisibility`, `beginDreamNightmare`, `migrateNightmare`, `nightmareReading`, `advanceNightmareDialogue`, `validateNightmare`, `stepDreamNightmare`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(x, a, b)` | Função atribuída | [64](../src/js/dream-forest/DreamNightmare.js#L64) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `angleDifference(a, b)` | Função atribuída | [69](../src/js/dream-forest/DreamNightmare.js#L69) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `nightmarePatrol(n, stage = 'STEALTH', age = 0)` | Função | [72](../src/js/dream-forest/DreamNightmare.js#L72) | Deriva posição e mira da barata exclusivamente do relógio salvo. |
| `nightmareLights(n, difficulty = 'NORMAL', stage = 'STEALTH', age = 0)` | Função | [92](../src/js/dream-forest/DreamNightmare.js#L92) | Converte os olhos medidos na pintura nas duas origens físicas de luz. |
| `nightmareRayEnd(light, angle, limit = NIGHTMARE.range)` | Função | [111](../src/js/dream-forest/DreamNightmare.js#L111) | Encontra a primeira interseção de um raio com as silhuetas opacas das pedras. |
| `nightmareBeam(light)` | Função | [139](../src/js/dream-forest/DreamNightmare.js#L139) | Monta o polígono de luz visível incluindo tangentes e sombras das pedras. |
| `nightmareVisibility(n, difficulty = 'NORMAL', { onlyLight = false, detection = false } = {})` | Função | [154](../src/js/dream-forest/DreamNightmare.js#L154) | Consulta silhueta/oclusão e um núcleo lógico menor somente na captura EASY, mantendo a luz. |
| `beginDreamNightmare(s, { retry = false, checkpoint = 0 } = {})` | Função | [198](../src/js/dream-forest/DreamNightmare.js#L198) | Cria o domínio do trecho final na queda ou na retomada da primeira pedra. |
| `migrateNightmare(s)` | Função | [242](../src/js/dream-forest/DreamNightmare.js#L242) | Migra o trecho curto e os saves intermediários para o terreno contínuo e exposição à luz. |
| `nightmareReading(s)` | Função | [307](../src/js/dream-forest/DreamNightmare.js#L307) | Identifica quadros adiáveis sem permitir saltar a captura final ou o susto inicial. |
| `advanceNightmareDialogue(s)` | Função | [313](../src/js/dream-forest/DreamNightmare.js#L313) | Adianta uma leitura da furtividade ou do despertar, consumindo apenas um quadro. |
| `validateNightmare(s)` | Função | [342](../src/js/dream-forest/DreamNightmare.js#L342) | Valida relógio, corpo, leitura e coerência do grito/despertar no save. |
| `stepDreamNightmare(s, input = {}, seconds = 0)` | Função | [356](../src/js/dream-forest/DreamNightmare.js#L356) | Integra caminhada, luz/detecção, golpe fatal, captura autorada e despertar em subpassos. |

## src/js/dream-forest/DreamNightmareArt.js

[Implementação](../src/js/dream-forest/DreamNightmareArt.js). Contratos exportados/reexportados: `DREAM_NIGHTMARE_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/dream-forest/DreamNightmareCinematic.js

[Implementação](../src/js/dream-forest/DreamNightmareCinematic.js). Contratos exportados/reexportados: `nightmareCinematicShot`, `drawNightmareCinematicGirl`, `renderNightmareCinematic`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `nightmareCinematicShot(age, portrait = false)` | Função | [19](../src/js/dream-forest/DreamNightmareCinematic.js#L19) | Seleciona caminhada, reação, close da criatura e captura por relógio narrativo. |
| `drawNightmareCinematicGirl(ctx, image, index, x, base, height, time, { walking = false, tilt = 0 } = {})` | Função | [30](../src/js/dream-forest/DreamNightmareCinematic.js#L30) | Desenha atuações mantendo recorte, escala e âncora dos pés. |
| `renderNightmareCinematic(ctx, canvas, s, images, rig)` | Função | [58](../src/js/dream-forest/DreamNightmareCinematic.js#L58) | Compõe cenário e atores em planos próprios, sem câmera nem mapa de gameplay. |

## src/js/dream-forest/DreamNightmareEntrance.js

[Implementação](../src/js/dream-forest/DreamNightmareEntrance.js). Contratos exportados/reexportados: `nightmareEntranceMoment`, `renderNightmareEntrance`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `nightmareEntranceMoment(s)` | Função | [29](../src/js/dream-forest/DreamNightmareEntrance.js#L29) | Seleciona chegada, leitura, emergência, susto, fuga e abrigo pelo relógio salvo. |
| `foregroundTrees(ctx, image)` | Função | [45](../src/js/dream-forest/DreamNightmareEntrance.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderNightmareEntrance(ctx, canvas, s, images, rig, { onAdvance = () => {} } = {})` | Função | [68](../src/js/dream-forest/DreamNightmareEntrance.js#L68) | Compõe a entrada em planos próprios, com árvores em primeiro plano e diálogos padrão. |

## src/js/dream-forest/DreamNightmareLighting.js

[Implementação](../src/js/dream-forest/DreamNightmareLighting.js). Contratos exportados/reexportados: `DreamNightmareLighting`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [28](../src/js/dream-forest/DreamNightmareLighting.js#L28) | Cria o buffer transitório reutilizado da iluminação, sem estado persistente. |
| `surfaceEnd(light, angle)` | Método declarado | [33](../src/js/dream-forest/DreamNightmareLighting.js#L33) | Limita o raio visual ao primeiro abrigo, chão ou superfície curva da lama. |
| `begin(canvas, frame)` | Método declarado | [57](../src/js/dream-forest/DreamNightmareLighting.js#L57) | Prepara o buffer em meia resolução com a transformação fixa do viewport. |
| `air(ctx, canvas, frame, lights)` | Método declarado | [71](../src/js/dream-forest/DreamNightmareLighting.js#L71) | Compõe emissão extensa em camadas e penumbra com queda radial de intensidade. |
| `receiver(ctx, light, draw)` | Método declarado | [117](../src/js/dream-forest/DreamNightmareLighting.js#L117) | Aplica luz sobre a máscara dos abrigos, conservando a textura ilustrada. |
| `ground(ctx, lights)` | Método declarado | [158](../src/js/dream-forest/DreamNightmareLighting.js#L158) | Ilumina terra e relevos com manchas difusas orientadas pela superfície. |
| `water(ctx, lights, lake, time)` | Método declarado | [181](../src/js/dream-forest/DreamNightmareLighting.js#L181) | Projeta reflexos achatados e ondulações somente sobre a superfície líquida. |
| `destroy()` | Método declarado | [220](../src/js/dream-forest/DreamNightmareLighting.js#L220) | Libera o buffer de iluminação ao descartar a fase. |

## src/js/dream-forest/DreamNightmareRenderer.js

[Implementação](../src/js/dream-forest/DreamNightmareRenderer.js). Contratos exportados/reexportados: `DreamNightmareRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, shared)` | Método declarado | [84](../src/js/dream-forest/DreamNightmareRenderer.js#L84) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [96](../src/js/dream-forest/DreamNightmareRenderer.js#L96) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareTerrain()` | Método declarado | [145](../src/js/dream-forest/DreamNightmareRenderer.js#L145) | Registra a pintura dos barrancos no perfil físico e aplica ambiente comum ao piso, sem tarja de cor. |
| `frame(s)` | Método declarado | [232](../src/js/dream-forest/DreamNightmareRenderer.js#L232) | Calcula pose visual estável sem escrever na simulação. |
| `mudClip(ctx, lake)` | Método declarado | [247](../src/js/dream-forest/DreamNightmareRenderer.js#L247) | Recorta o corpo pela superfície curva da lama, sem depender do alfa da pintura frontal. |
| `girl(ctx, s)` | Método declarado | [258](../src/js/dream-forest/DreamNightmareRenderer.js#L258) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mudSplash(ctx, n)` | Método declarado | [348](../src/js/dream-forest/DreamNightmareRenderer.js#L348) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reach(ctx, s)` | Método declarado | [364](../src/js/dream-forest/DreamNightmareRenderer.js#L364) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `swampLayers(ctx, frame, front = false)` | Método declarado | [372](../src/js/dream-forest/DreamNightmareRenderer.js#L372) | Distribui troncos e tocos ilustrados em camadas que envolvem a criatura. |
| `forest(s, touch)` | Método declarado | [388](../src/js/dream-forest/DreamNightmareRenderer.js#L388) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `wake(s)` | Método declarado | [585](../src/js/dream-forest/DreamNightmareRenderer.js#L585) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(s, { paused = false, touch = false, onAdvance = () => {} } = {})` | Método declarado | [651](../src/js/dream-forest/DreamNightmareRenderer.js#L651) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [694](../src/js/dream-forest/DreamNightmareRenderer.js#L694) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/dream-forest/DreamOpening.js

[Implementação](../src/js/dream-forest/DreamOpening.js). Contratos exportados/reexportados: `DREAM_OPENING_BEATS`, `dreamOpeningBeat`, `advanceDreamOpening`, `stepDreamOpening`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamOpeningBeat(s)` | Função | [47](../src/js/dream-forest/DreamOpening.js#L47) | Consulta o momento autorado a partir do índice persistido da abertura. |
| `advanceDreamOpening(s)` | Função | [51](../src/js/dream-forest/DreamOpening.js#L51) | Dispensa uma fala visível preservando o mínimo de atuação do momento. |
| `stepDreamOpening(s, input, seconds)` | Função | [59](../src/js/dream-forest/DreamOpening.js#L59) | Avança os sete momentos e libera a travessia sem herdar o pulo da leitura. |

## src/js/dream-forest/DreamOpeningRenderer.js

[Implementação](../src/js/dream-forest/DreamOpeningRenderer.js). Contratos exportados/reexportados: `renderDreamOpening`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `openingLayout(ctx, canvas)` | Função | [23](../src/js/dream-forest/DreamOpeningRenderer.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actor(ctx, image, f, x, base, k, { flip = false, hand = null } = {})` | Função | [62](../src/js/dream-forest/DreamOpeningRenderer.js#L62) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderDreamOpening(ctx, canvas, s, images, { onAdvance = () => {} } = {})` | Função | [82](../src/js/dream-forest/DreamOpeningRenderer.js#L82) | Compõe Yuna, Nanda adormecida, mãos em contato, moldura e transição final. |

## src/js/dream-forest/DreamPhase.js

[Implementação](../src/js/dream-forest/DreamPhase.js). Contratos exportados/reexportados: `DreamPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ canvas, audio, enabled = () => true, difficulty = 'NORMAL', campaign = false })` | Método declarado | [35](../src/js/dream-forest/DreamPhase.js#L35) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `active()` | Acessor | [66](../src/js/dream-forest/DreamPhase.js#L66) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reading()` | Método declarado | [73](../src/js/dream-forest/DreamPhase.js#L73) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `advanceDialogue()` | Método declarado | [83](../src/js/dream-forest/DreamPhase.js#L83) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `start(saved = null)` | Método declarado | [95](../src/js/dream-forest/DreamPhase.js#L95) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt = 1)` | Método declarado | [117](../src/js/dream-forest/DreamPhase.js#L117) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [151](../src/js/dream-forest/DreamPhase.js#L151) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `onAdvance()` | API/lambda de objeto | [161](../src/js/dream-forest/DreamPhase.js#L161) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Método declarado | [169](../src/js/dream-forest/DreamPhase.js#L169) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [177](../src/js/dream-forest/DreamPhase.js#L177) | Produz captura recuperável do estado específico deste componente. |
| `retry()` | Método declarado | [187](../src/js/dream-forest/DreamPhase.js#L187) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [193](../src/js/dream-forest/DreamPhase.js#L193) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/dream-forest/DreamRenderer.js

[Implementação](../src/js/dream-forest/DreamRenderer.js). Contratos exportados/reexportados: `DreamRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas)` | Método declarado | [83](../src/js/dream-forest/DreamRenderer.js#L83) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [95](../src/js/dream-forest/DreamRenderer.js#L95) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(state)` | Método declarado | [130](../src/js/dream-forest/DreamRenderer.js#L130) | Calcula pose visual estável sem escrever na simulação. |
| `leaf(ctx, f, bottom = C.grassRoot)` | Método declarado | [142](../src/js/dream-forest/DreamRenderer.js#L142) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `grass(ctx, f, bottom = C.grassRoot)` | Método declarado | [146](../src/js/dream-forest/DreamRenderer.js#L146) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `insect(ctx, f, time)` | Método declarado | [153](../src/js/dream-forest/DreamRenderer.js#L153) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `girl(ctx, s)` | Método declarado | [172](../src/js/dream-forest/DreamRenderer.js#L172) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(state, { ready = true, error = null, paused = false, onAdvance = () => {}, touch = false } = {})` | Método declarado | [200](../src/js/dream-forest/DreamRenderer.js#L200) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [383](../src/js/dream-forest/DreamRenderer.js#L383) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/dream-forest/DreamRoach.js

[Implementação](../src/js/dream-forest/DreamRoach.js). Contratos exportados/reexportados: `ROACH_JOINTS`, `ROACH_STEP_SECONDS`, `solveRoachLeg`, `dreamRoachLegPoints`, `prepareDreamRoach`, `dreamRoachPose`, `dreamRoachPoint`, `drawDreamRoach`, `drawDreamRoachReach`, `destroyDreamRoach`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `path(ctx, points)` | Função | [264](../src/js/dream-forest/DreamRoach.js#L264) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canvas(w, h)` | Função | [270](../src/js/dream-forest/DreamRoach.js#L270) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `crop(image, polygon)` | Função | [277](../src/js/dream-forest/DreamRoach.js#L277) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clamp(n, a, b)` | Função atribuída | [294](../src/js/dream-forest/DreamRoach.js#L294) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `solveRoachLeg(j, target)` | Função | [302](../src/js/dream-forest/DreamRoach.js#L302) | Resolve duas juntas com comprimentos e flexão preservados, normalizando ângulos. |
| `dreamRoachLegPoints(j, a, b)` | Função | [321](../src/js/dream-forest/DreamRoach.js#L321) | Retorna quadril, joelho e ponta dos segmentos rígidos pelas rotações usadas no desenho. |
| `prepareLeg(image, j)` | Função | [334](../src/js/dream-forest/DreamRoach.js#L334) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `segment(side)` | Função atribuída | [341](../src/js/dream-forest/DreamRoach.js#L341) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareDreamRoach(image)` | Função | [377](../src/js/dream-forest/DreamRoach.js#L377) | Prepara doze segmentos rígidos e seis juntas protegidas, cabeça e antenas, sem editar PNGs. |
| `dreamRoachPose(time, velocity = 160)` | Função | [414](../src/js/dream-forest/DreamRoach.js#L414) | Deriva passadas em tripés, cabeça, antenas e oscilação corporal do relógio salvo. |
| `dreamRoachPoint(p, u, v, { head = false } = {})` | Função | [443](../src/js/dream-forest/DreamRoach.js#L443) | Transforma os olhos pela mesma junta de cabeça usada na pintura e retorna a posição física. |
| `begin(ctx, p, rig)` | Função | [463](../src/js/dream-forest/DreamRoach.js#L463) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `leg(ctx, j, a, b)` | Função | [468](../src/js/dream-forest/DreamRoach.js#L468) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawDreamRoach(ctx, rig, p, { reaching = false } = {})` | Função | [483](../src/js/dream-forest/DreamRoach.js#L483) | Compõe a barata original com seis patas articuladas e investigação da cabeça e antenas. |
| `drawDreamRoachReach(ctx, rig, p, target, q)` | Função | [508](../src/js/dream-forest/DreamRoach.js#L508) | Resolve duas juntas da pata frontal até a menina durante golpe e captura. |
| `destroyDreamRoach(rig)` | Função | [526](../src/js/dream-forest/DreamRoach.js#L526) | Libera as superfícies de Canvas usadas pela barata articulada. |

## src/js/dream-forest/DreamRoachEffects.js

[Implementação](../src/js/dream-forest/DreamRoachEffects.js). Contratos exportados/reexportados: `roachFootfall`, `roachScreenShake`, `drawRoachDust`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `roachFootfall(time, velocity = 160)` | Função | [8](../src/js/dream-forest/DreamRoachEffects.js#L8) | Consulta contato dos tripés no relógio determinístico de passadas. |
| `roachScreenShake(time, velocity = 160, stompAge = -1)` | Função | [20](../src/js/dream-forest/DreamRoachEffects.js#L20) | Produz tremor transitório da composição em pixels CSS sem mudar o frame físico. |
| `cloud(ctx, x, y, age, power, seed)` | Função | [31](../src/js/dream-forest/DreamRoachEffects.js#L31) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawRoachDust(ctx, rig, p, time, { stompAge = -1, stompPoint = null } = {})` | Função | [49](../src/js/dream-forest/DreamRoachEffects.js#L49) | Projeta poeira nos contatos das patas e na propagação do impacto final. |

## src/js/dream-forest/DreamSilence.js

[Implementação](../src/js/dream-forest/DreamSilence.js). Contratos exportados/reexportados: `DreamSilence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [7](../src/js/dream-forest/DreamSilence.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `update(ctx, volume)` | Método declarado | [14](../src/js/dream-forest/DreamSilence.js#L14) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `stop()` | Método declarado | [73](../src/js/dream-forest/DreamSilence.js#L73) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/dream-forest/DreamSimulation.js

[Implementação](../src/js/dream-forest/DreamSimulation.js). Contratos exportados/reexportados: `DREAM_INTRO`, `createDreamState`, `restoreDreamState`, `advanceDreamDialogue`, `retryDream`, `stepDream`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createDreamRides()` | Função | [41](../src/js/dream-forest/DreamSimulation.js#L41) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `boardDreamBeetle(s, id, events)` | Função | [46](../src/js/dream-forest/DreamSimulation.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `placeDreamCheckpoint(s)` | Função | [57](../src/js/dream-forest/DreamSimulation.js#L57) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createDreamState(difficulty = 'NORMAL')` | Função | [72](../src/js/dream-forest/DreamSimulation.js#L72) | Cria domínio5 do sonho: travessia aérea preservada e estado separado para furtividade, captura e despertar. |
| `restoreDreamState(saved, difficulty)` | Função | [114](../src/js/dream-forest/DreamSimulation.js#L114) | Valida estágio, números e IDs do sonho; reconstrói dados e conserva o bloqueio breve de reagarre, sem recursos de runtime. |
| `advanceDreamDialogue(s)` | Função | [188](../src/js/dream-forest/DreamSimulation.js#L188) | Adianta uma fala do sonho e consome o gesto antes de liberar movimento. |
| `retryDream(s)` | Função | [217](../src/js/dream-forest/DreamSimulation.js#L217) | Retoma uma folha e seus transportes; no pesadelo, retorna à primeira pedra sem repetir o voo. |
| `hitDreamSpider(s, near, events)` | Função | [237](../src/js/dream-forest/DreamSimulation.js#L237) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stepDream(s, input = {}, seconds = 0)` | Função | [267](../src/js/dream-forest/DreamSimulation.js#L267) | Avança subpassos1/120s: vento, aderência, escalada, salto, transporte, superfície medida, queda/recuperação e clareira. |

## src/js/dream-forest/DreamSpiderPuppet.js

[Implementação](../src/js/dream-forest/DreamSpiderPuppet.js). Contratos exportados/reexportados: `prepareDreamSpider`, `drawDreamSpider`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `prepareDreamSpider(image)` | Função | [79](../src/js/dream-forest/DreamSpiderPuppet.js#L79) | Prepara corpo e oito membros da pintura da aranha sem mudar sua física. |
| `path(c, ox, oy)` | Função atribuída | [101](../src/js/dream-forest/DreamSpiderPuppet.js#L101) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawDreamSpider(ctx, puppet, f, time)` | Função | [131](../src/js/dream-forest/DreamSpiderPuppet.js#L131) | Articula oito patas da aranha pelo relógio salvo ao trabalhar a seda. |

## src/js/dream-forest/DreamStealthLevel.js

[Implementação](../src/js/dream-forest/DreamStealthLevel.js). Contratos exportados/reexportados: `STEALTH_LEVEL`, `STEALTH_PLATFORMS`, `stealthGround`, `STEALTH_COVERS`, `STEALTH_MUD`, `stealthMudAt`, `stealthPose`, `stealthCheckpoint`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `stealthGround(x)` | Função | [36](../src/js/dream-forest/DreamStealthLevel.js#L36) | Retorna o chão contínuo, com topo pintado dos relevos e descida de terra até o caminho. |
| `stealthMudAt(x)` | Função | [104](../src/js/dream-forest/DreamStealthLevel.js#L104) | Exige que o corpo inteiro caiba dentro da poça para permitir submersão. |
| `stealthPose(n)` | Função | [108](../src/js/dream-forest/DreamStealthLevel.js#L108) | Compartilha o índice da pose abaixada entre pintura, salto e detecção dos olhos. |
| `stealthCheckpoint(index)` | Função | [112](../src/js/dream-forest/DreamStealthLevel.js#L112) | Retorna o abrigo de retomada por setor e conserva submersão nos setores de lama. |

## src/js/dream-forest/DreamWeb.js

[Implementação](../src/js/dream-forest/DreamWeb.js). Contratos exportados/reexportados: `dreamSpiderContact`, `dreamWebCanGrab`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamSpiderContact(frame, player)` | Função | [2](../src/js/dream-forest/DreamWeb.js#L2) | Detecta contato entre o corpo da menina e a silhueta da aranha, incluindo a abertura das patas. |
| `dreamWebCanGrab(frame, gripY)` | Função | [9](../src/js/dream-forest/DreamWeb.js#L9) | Permite agarrar somente a seda existente, com espaço para os pés acima da aranha. |

## src/js/effects/ArtFinish.js

[Implementação](../src/js/effects/ArtFinish.js). Contratos exportados/reexportados: `applyArtFinish`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `applyArtFinish(ctx, canvas)` | Função | [2](../src/js/effects/ArtFinish.js#L2) | Aplica dessaturação em coordenadas de tela. |

## src/js/effects/ParticleSystem.js

[Implementação](../src/js/effects/ParticleSystem.js). Contratos exportados/reexportados: `ParticleSystem`, `createParticleSystem`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [14](../src/js/effects/ParticleSystem.js#L14) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `clear()` | Método declarado | [22](../src/js/effects/ParticleSystem.js#L22) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `spawnBabyJumpDust(bx, bw, by, bh, bvx, isEscapeMode = false, escapeLevel = 0)` | Método declarado | [30](../src/js/effects/ParticleSystem.js#L30) | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyJumpPuff(x, y, count = 5)` | Método declarado | [60](../src/js/effects/ParticleSystem.js#L60) | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyLandingPuff(x, y, count = 5)` | Método declarado | [85](../src/js/effects/ParticleSystem.js#L85) | Cria partículas/efeitos no buffer correspondente. |
| `spawnPhase3Ribbons(baby, phase3Level, stats, tick)` | Método declarado | [109](../src/js/effects/ParticleSystem.js#L109) | Cria partículas/efeitos no buffer correspondente. |
| `spawnEscapeRibbons(baby, escapeLevel, stats, tick)` | Método declarado | [133](../src/js/effects/ParticleSystem.js#L133) | Cria partículas/efeitos no buffer correspondente. |
| `update(dt = 1.0)` | Método declarado | [157](../src/js/effects/ParticleSystem.js#L157) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateBabyJumpDust(dt = 1.0)` | Método declarado | [165](../src/js/effects/ParticleSystem.js#L165) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateSpeedRibbons(dt = 1.0)` | Método declarado | [182](../src/js/effects/ParticleSystem.js#L182) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `renderSpeedRibbons(ctx, canvas, camX)` | Método declarado | [197](../src/js/effects/ParticleSystem.js#L197) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderBabyJumpDust(ctx, canvas, camX)` | Método declarado | [217](../src/js/effects/ParticleSystem.js#L217) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `render(ctx, canvas, camX)` | Método declarado | [257](../src/js/effects/ParticleSystem.js#L257) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `createParticleSystem(options = {})` | Função | [263](../src/js/effects/ParticleSystem.js#L263) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

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
| `constructor()` | Método declarado | [17](../src/js/entities/BabyRenderer.js#L17) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | [23](../src/js/entities/BabyRenderer.js#L23) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `resolveAnimationState(baby, state)` | Método declarado | [29](../src/js/entities/BabyRenderer.js#L29) | Escolhe animação oficial conforme ação e flags do estado. |
| `renderPose(ctx, assets, pose, frameIndex, centerX, feetY, height, facing = 1, visualScale = 1)` | Método declarado | [147](../src/js/entities/BabyRenderer.js#L147) | Desenha recorte ancorado no centro/pés, com escala visual. |
| `render(ctx, baby, state = {}, camX = 0, options = {})` | Método declarado | [185](../src/js/entities/BabyRenderer.js#L185) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/entities/FairyRenderer.js

[Implementação](../src/js/entities/FairyRenderer.js). Contratos exportados/reexportados: `FairyRenderer`, `fairyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `render(ctx, fairy, state = {}, camX = 0, options = {})` | Método declarado | [20](../src/js/entities/FairyRenderer.js#L20) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/entities/GirlBodyLayers.js

[Implementação](../src/js/entities/GirlBodyLayers.js). Contratos exportados/reexportados: `applyGirlBodyTransform`, `drawGirlUpperBody`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `canvas(width, height)` | Função | [3](../src/js/entities/GirlBodyLayers.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `polygon(ctx, points)` | Função | [10](../src/js/entities/GirlBodyLayers.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `layers(assets, frame, body, carrying)` | Função | [17](../src/js/entities/GirlBodyLayers.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `copy()` | Função atribuída | [91](../src/js/entities/GirlBodyLayers.js#L91) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `applyGirlBodyTransform(ctx, pose)` | Função | [161](../src/js/entities/GirlBodyLayers.js#L161) | Aplica translação do quadril, oscilação e rotação do tronco também às mãos e ao brinquedo transportado. |
| `image(ctx, layer, frame)` | Função | [167](../src/js/entities/GirlBodyLayers.js#L167) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arm(ctx, parts, index, angle)` | Função | [171](../src/js/entities/GirlBodyLayers.js#L171) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clothes(ctx, parts, pose, alpha)` | Função | [184](../src/js/entities/GirlBodyLayers.js#L184) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawGirlUpperBody(ctx, assets, frame, body, idleFrame, idleBody, pose, amount, carrying)` | Função | [201](../src/js/entities/GirlBodyLayers.js#L201) | Compõe cabeça estabilizada, cabelo, braços em oposição e vestido com atraso; preserva uma única cabeça na mistura. |

## src/js/entities/GirlGait.js

[Implementação](../src/js/entities/GirlGait.js). Contratos exportados/reexportados: `girlGaitDirection`, `sampleGirlLocomotion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(v, a, b)` | Função atribuída | [2](../src/js/entities/GirlGait.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `curve(t, keys)` | Função | [7](../src/js/entities/GirlGait.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `girlGaitDirection()` | Função | [18](../src/js/entities/GirlGait.js#L18) | Mantém o perfil lateral coerente entre pernas e tronco; o chamador espelha esquerda/direita, sem girar só as pernas ao mover em profundidade. |
| `sampleGirlLocomotion(distance, carrying = false, amount = 1, direction = { x: 1, y: 0 })` | Função | [27](../src/js/entities/GirlGait.js#L27) | Amostra apoio, elevação, joelho, tronco, cabeça, braços e vestido por distância; transportar reduz a oscilação. |

## src/js/entities/GirlLocomotion.js

[Implementação](../src/js/entities/GirlLocomotion.js). Contratos exportados/reexportados: `drawGirlLocomotion`, `girlLocomotionDistance`, `renderGirlRun`, `sampleGirlLocomotion`, `girlGaitDirection`, `applyGirlBodyTransform`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, low, high)` | Função atribuída | [22](../src/js/entities/GirlLocomotion.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canvas(width, height)` | Função | [25](../src/js/entities/GirlLocomotion.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepare(assets)` | Função | [33](../src/js/entities/GirlLocomotion.js#L33) | Prepara contexto visual da introdução; consulte dependências no módulo. |
| `bodyLayer(data, assets, frame)` | Função | [47](../src/js/entities/GirlLocomotion.js#L47) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restingLegLayer(data, assets, frame)` | Função | [73](../src/js/entities/GirlLocomotion.js#L73) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `legParts(data, assets)` | Função | [95](../src/js/entities/GirlLocomotion.js#L95) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawLeg(ctx, parts, leg, index)` | Função | [159](../src/js/entities/GirlLocomotion.js#L159) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawGirlLocomotion(ctx, assets, frame, distance, carrying = false, amount = 1, direction = { x: 1, y: 0 })` | Função | [194](../src/js/entities/GirlLocomotion.js#L194) | Compõe repouso original e membros articulados com transição contínua; retorna false se faltarem fontes. |
| `girlLocomotionDistance(animTime, height, room = false)` | Função | [242](../src/js/entities/GirlLocomotion.js#L242) | Converte animTime legado para distância na pintura, com calibração distinta para quarto e sala. |
| `renderGirlRun(ctx, assets, actor, centerX, feetY, height, facing, visualScale = 1, room = false)` | Função | [247](../src/js/entities/GirlLocomotion.js#L247) | Ancora a menina nos pés, aplica escala/espelhamento e compartilha a atuação entre explorações, sem mudar corpos físicos. |

## src/js/entities/index.js

[Implementação](../src/js/entities/index.js). Contratos exportados/reexportados: `BabyRenderer`, `babyRenderer`, `FairyRenderer`, `fairyRenderer`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/environment/BackgroundRenderer.js

[Implementação](../src/js/environment/BackgroundRenderer.js). Contratos exportados/reexportados: `getBackgroundViewport`, `BackgroundRenderer`, `backgroundRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getBackgroundViewport(ctx, canvas)` | Função | [22](../src/js/environment/BackgroundRenderer.js#L22) | Inverte a matriz real para determinar os limites visíveis do fundo. |
| `constructor(options = {})` | Método declarado | [57](../src/js/environment/BackgroundRenderer.js#L57) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | [65](../src/js/environment/BackgroundRenderer.js#L65) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `drawAtlasSceneryItem(ctx, assets, type, sx, item, floorY)` | Método declarado | [73](../src/js/environment/BackgroundRenderer.js#L73) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderWall(ctx, canvas, camX = 0, options = {})` | Método declarado | [195](../src/js/environment/BackgroundRenderer.js#L195) | Desenha parede, parallax, piso e rodapé com cobertura do viewport. |
| `renderScenery(ctx, canvas, scenery = defaultRoomScenery, camX = 0, options = {})` | Método declarado | [585](../src/js/environment/BackgroundRenderer.js#L585) | Desenha objetos decorativos do piso. |
| `render(ctx, canvas, camX = 0, options = {})` | Método declarado | [762](../src/js/environment/BackgroundRenderer.js#L762) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/environment/DarkRoomContact.js

[Implementação](../src/js/environment/DarkRoomContact.js). Contratos exportados/reexportados: `DarkRoomContact`, `getDarkRoomFeet`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(renderer, assets)` | Método declarado | [12](../src/js/environment/DarkRoomContact.js#L12) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `prepare(platforms)` | Método declarado | [19](../src/js/environment/DarkRoomContact.js#L19) | Prepara contexto visual da introdução; consulte dependências no módulo. |
| `bounds(platform)` | Método declarado | [64](../src/js/environment/DarkRoomContact.js#L64) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `height(platform, feet)` | Método declarado | [75](../src/js/environment/DarkRoomContact.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resolve(baby, state, platforms, dt)` | Método declarado | [91](../src/js/environment/DarkRoomContact.js#L91) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getDarkRoomFeet(baby, state = {})` | Função | [147](../src/js/environment/DarkRoomContact.js#L147) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/environment/LightingSystem.js

[Implementação](../src/js/environment/LightingSystem.js). Contratos exportados/reexportados: `LightingSystem`, `createLightingSystem`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [24](../src/js/environment/LightingSystem.js#L24) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `resize(width, height)` | Método declarado | [33](../src/js/environment/LightingSystem.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(ctx, canvas, state = {}, baby = {}, fairy = {}, camX = 0, camY = 0, options = {})` | Método declarado | [43](../src/js/environment/LightingSystem.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pool(x, y, rx, ry, strength)` | Função atribuída | [76](../src/js/environment/LightingSystem.js#L76) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createLightingSystem(options = {})` | Função | [194](../src/js/environment/LightingSystem.js#L194) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/environment/PlatformRenderer.js

[Implementação](../src/js/environment/PlatformRenderer.js). Contratos exportados/reexportados: `PLATFORM_SURFACES`, `PlatformRenderer`, `platformRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [223](../src/js/environment/PlatformRenderer.js#L223) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | [231](../src/js/environment/PlatformRenderer.js#L231) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `drawAtlasPlatformSprite(ctx, assets, style, sx, p, tick = 0)` | Método declarado | [239](../src/js/environment/PlatformRenderer.js#L239) | Recorta/calibra sprite de plataforma; não redefine colisões. |
| `renderPlatforms(ctx, canvas, camX = 0, options = {})` | Método declarado | [999](../src/js/environment/PlatformRenderer.js#L999) | Desenha apoios com atlas/alternativas e descarte visual. |
| `renderExitDoor(ctx, canvas, camX = 0, options = {})` | Método declarado | [1532](../src/js/environment/PlatformRenderer.js#L1532) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderTrueExitDoor(ctx, canvas, camX = 0, options = {})` | Método declarado | [1590](../src/js/environment/PlatformRenderer.js#L1590) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderTutorialArrow(ctx, canvas, camX = 0, options = {})` | Método declarado | [1704](../src/js/environment/PlatformRenderer.js#L1704) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/environment/StorybookPlatforms.js

[Implementação](../src/js/environment/StorybookPlatforms.js). Contratos exportados/reexportados: `drawContactEdge`, `drawStorybookPlatform`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `gradient(ctx, y, h, colors)` | Função | [12](../src/js/environment/StorybookPlatforms.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `box(ctx, x, y, w, h, material = 'wood', radius = 3)` | Função | [18](../src/js/environment/StorybookPlatforms.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `line(ctx, points, color = INK, width = 1)` | Função | [43](../src/js/environment/StorybookPlatforms.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ellipse(ctx, x, y, rx, ry, color)` | Função | [51](../src/js/environment/StorybookPlatforms.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawContactEdge(ctx, x, y, w, material = 'wood', depth = 5)` | Função | [60](../src/js/environment/StorybookPlatforms.js#L60) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `book(ctx, x, y, w, h, material = 'purple')` | Função | [75](../src/js/environment/StorybookPlatforms.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawToy(ctx, p, w, assets, tick)` | Função | [89](../src/js/environment/StorybookPlatforms.js#L89) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawStorybookPlatform(ctx, assets, p, sx, tick = 0)` | Função | [345](../src/js/environment/StorybookPlatforms.js#L345) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

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
| `createGame(canvas, uiFeedback, callbacks = {})` | Função | [129](../src/js/game.js#L129) | Cria o coordenador e devolve a API de integração com a página. |
| `onGameOver()` | API/lambda de objeto | [153](../src/js/game.js#L153) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onComplete()` | API/lambda de objeto | [184](../src/js/game.js#L184) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginToyRoomIntroduction()` | Função | [197](../src/js/game.js#L197) | Captura saída e cria sala de apresentação sem input antes da fase ativa. |
| `beginOpeningGameplay()` | Função | [235](../src/js/game.js#L235) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enterFirstJumpTutorial()` | Função | [260](../src/js/game.js#L260) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncViewportFromState()` | Função | [277](../src/js/game.js#L277) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncViewportToState()` | Função | [282](../src/js/game.js#L282) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setLastInputDevice(dev)` | Função | [287](../src/js/game.js#L287) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getActivePromptDevice()` | Função | [292](../src/js/game.js#L292) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `startStandbyPreparation()` | Função | [297](../src/js/game.js#L297) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `confirmStandby()` | Função | [304](../src/js/game.js#L304) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetBabyPhysicsBody(targetX, targetY, facing = 1)` | Função | [312](../src/js/game.js#L312) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `triggerGameOver()` | Função | [319](../src/js/game.js#L319) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isGameOver()` | Função | [326](../src/js/game.js#L326) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `reportDefeat(phase)` | Função | [333](../src/js/game.js#L333) | Deduplica, salva e publica a derrota da fase ativa com a oferta de ajuda. |
| `retryGame()` | Função | [344](../src/js/game.js#L344) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `continueOnEasy()` | Função | [362](../src/js/game.js#L362) | Aplica EASY às instâncias atuais e retoma a seção/adversário/percurso com progresso preservado. |
| `declineEasyOffer()` | Função | [385](../src/js/game.js#L385) | Recusa a oferta sem alterar dificuldade, contagem ou progresso. |
| `restartToTitle()` | Função | [391](../src/js/game.js#L391) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startToyRoomIntroduction()` | Função | [405](../src/js/game.js#L405) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startToyRoomPhase({ fromIntroduction = false } = {})` | Função | [426](../src/js/game.js#L426) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `isInputEnabled()` | API/lambda de objeto | [449](../src/js/game.js#L449) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `handleResize()` | Função | [484](../src/js/game.js#L484) | Dimensiona bitmap e canvases auxiliares a partir do layout CSS. |
| `startTruePortalTransition()` | Função | [502](../src/js/game.js#L502) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `showFailMessage()` | Função | [509](../src/js/game.js#L509) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startCastleCutscene()` | Função | [514](../src/js/game.js#L514) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advanceCutscene()` | Função | [521](../src/js/game.js#L521) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishCutscene()` | Função | [528](../src/js/game.js#L528) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startPlotTwistCutscene()` | Função | [536](../src/js/game.js#L536) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advancePlotTwist()` | Função | [543](../src/js/game.js#L543) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishPlotTwistAndStartTutorial()` | Função | [550](../src/js/game.js#L550) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetToStart(failedMidClimb = false, shouldPlayFailSound = true)` | Função | [557](../src/js/game.js#L557) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `doJump(inputSource)` | Função | [565](../src/js/game.js#L565) | Seleciona salto ou avanço narrativo conforme o estado atual. |
| `spawnFairyFlightDust(fx, fy, fvx, fvy)` | Função | [711](../src/js/game.js#L711) | Cria partículas/efeitos no buffer correspondente. |
| `spawnFairySparkles(x, y, count = 2)` | Função | [716](../src/js/game.js#L716) | Cria partículas/efeitos no buffer correspondente. |
| `updateFairyParticles()` | Função | [721](../src/js/game.js#L721) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `spawnBabyJumpDust(bx, bw, by, bh, bvx)` | Função | [727](../src/js/game.js#L727) | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyJumpPuff(x, y, count = 5)` | Função | [732](../src/js/game.js#L732) | Cria partículas/efeitos no buffer correspondente. |
| `spawnBabyLandingPuff(x, y)` | Função | [737](../src/js/game.js#L737) | Cria partículas/efeitos no buffer correspondente. |
| `updateBabyJumpDust(dt = 1.0)` | Função | [742](../src/js/game.js#L742) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `drawBackgroundWall(camX)` | Função | [749](../src/js/game.js#L749) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawSceneryItems(camX)` | Função | [757](../src/js/game.js#L757) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawPlatforms(camX)` | Função | [764](../src/js/game.js#L764) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawExitDoor(camX)` | Função | [776](../src/js/game.js#L776) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawTrueExitDoor(camX)` | Função | [788](../src/js/game.js#L788) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBabyManaStyle(camX)` | Função | [799](../src/js/game.js#L799) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFairy(camX)` | Função | [809](../src/js/game.js#L809) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `applyDarkAtmosphereWithLights(camX, camY = 0)` | Função | [821](../src/js/game.js#L821) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawSpeedRibbons(camX)` | Função | [833](../src/js/game.js#L833) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBabyJumpDust(camX)` | Função | [838](../src/js/game.js#L838) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawEscapeBanner()` | Função | [844](../src/js/game.js#L844) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialoguePortrait(pCtx, charType, px, py, radius, mood = 'normal')` | Função | [849](../src/js/game.js#L849) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapDialogueText(pCtx, text, maxWidth)` | Função | [856](../src/js/game.js#L856) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawCutsceneDialogue(transform)` | Função | [861](../src/js/game.js#L861) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawTutorialArrow(camX)` | Função | [887](../src/js/game.js#L887) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `update(dt = 1.0)` | Função | [898](../src/js/game.js#L898) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `onLagBehind()` | API/lambda de objeto | [1293](../src/js/game.js#L1293) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Função | [1304](../src/js/game.js#L1304) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `togglePause()` | Função | [1359](../src/js/game.js#L1359) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Função | [1381](../src/js/game.js#L1381) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `saveProgress()` | Função | [1388](../src/js/game.js#L1388) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restoreProgress(saved)` | Função | [1405](../src/js/game.js#L1405) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `newCampaign({ preserveProgress = false } = {})` | Função | [1440](../src/js/game.js#L1440) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startDebugPhase(phase, difficulty = state.gameDifficulty)` | Função | [1476](../src/js/game.js#L1476) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `saveOnHide()` | Função atribuída | [1528](../src/js/game.js#L1528) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `recordCameraQa(transform = null)` | Função | [1569](../src/js/game.js#L1569) | Emite observação optativa de câmera; ativada por cameraQa e callback de teste. |
| `loop(currentTime = performance.now())` | Função | [1574](../src/js/game.js#L1574) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isFirstJumpTutorial()` | API/lambda de objeto | [1618](../src/js/game.js#L1618) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGrounded()` | API/lambda de objeto | [1620](../src/js/game.js#L1620) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isCutsceneActive()` | API/lambda de objeto | [1621](../src/js/game.js#L1621) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGameOver()` | API/lambda de objeto | [1622](../src/js/game.js#L1622) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isToyRoomMode()` | API/lambda de objeto | [1623](../src/js/game.js#L1623) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | API/lambda de objeto | [1625](../src/js/game.js#L1625) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `advanceDialogue(event)` | Função | [1629](../src/js/game.js#L1629) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `enabled()` | API/lambda de objeto | [1669](../src/js/game.js#L1669) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isModal()` | API/lambda de objeto | [1670](../src/js/game.js#L1670) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `pauseMusic()` | API/lambda de objeto | [1730](../src/js/game.js#L1730) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | API/lambda de objeto | [1732](../src/js/game.js#L1732) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setMasterVolume(v)` | API/lambda de objeto | [1734](../src/js/game.js#L1734) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | API/lambda de objeto | [1736](../src/js/game.js#L1736) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(m)` | API/lambda de objeto | [1738](../src/js/game.js#L1738) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `isMuted()` | API/lambda de objeto | [1740](../src/js/game.js#L1740) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | API/lambda de objeto | [1742](../src/js/game.js#L1742) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isPaused()` | API/lambda de objeto | [1744](../src/js/game.js#L1744) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `hasProgress()` | API/lambda de objeto | [1750](../src/js/game.js#L1750) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `hasSavedCampaign()` | API/lambda de objeto | [1752](../src/js/game.js#L1752) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDifficulty()` | API/lambda de objeto | [1754](../src/js/game.js#L1754) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `destroy()` | Método declarado | [1765](../src/js/game.js#L1765) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `start(difficulty = 'NORMAL')` | Método declarado | [1778](../src/js/game.js#L1778) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `isGrounded()` | API/lambda de objeto | [1802](../src/js/game.js#L1802) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isCutsceneActive()` | API/lambda de objeto | [1804](../src/js/game.js#L1804) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isToyRoomMode()` | API/lambda de objeto | [1822](../src/js/game.js#L1822) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/garden/GardenArt.js

[Implementação](../src/js/garden/GardenArt.js). Contratos exportados/reexportados: `GARDEN_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenAudio.js

[Implementação](../src/js/garden/GardenAudio.js). Contratos exportados/reexportados: `GardenAudio`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(host, { track = new URL('../../../assets/audio/Blues Shuffle Loop.mp3', import.meta.url), label = 'do jardim', wingScene = 'garden' } = {})` | Método declarado | [14](../src/js/garden/GardenAudio.js#L14) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `unlock()` | Método declarado | [37](../src/js/garden/GardenAudio.js#L37) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tone(frequency, duration = .25, volume = .035, slide = frequency)` | Método declarado | [45](../src/js/garden/GardenAudio.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `hurt()` | Método declarado | [71](../src/js/garden/GardenAudio.js#L71) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playMusic()` | Método declarado | [95](../src/js/garden/GardenAudio.js#L95) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `update(state, paused = false)` | Método declarado | [109](../src/js/garden/GardenAudio.js#L109) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `event(type, { mudTakeoff = false } = {})` | Método declarado | [122](../src/js/garden/GardenAudio.js#L122) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sample(name, volume, deduplicate = false)` | Método declarado | [133](../src/js/garden/GardenAudio.js#L133) | Dispara pulo ou lama com volume mestre, pausa, mudo e deduplicação curta da vocalização. |
| `updateWings(state)` | Método declarado | [144](../src/js/garden/GardenAudio.js#L144) | Mantém até três emissores próximos de asas e atualiza o ganho das amostras ativas. |
| `clear()` | Método declarado | [172](../src/js/garden/GardenAudio.js#L172) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `destroy()` | Método declarado | [186](../src/js/garden/GardenAudio.js#L186) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/garden/GardenBeeRenderer.js

[Implementação](../src/js/garden/GardenBeeRenderer.js). Contratos exportados/reexportados: `drawGardenBee`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawGardenBee(ctx, images, bee, time)` | Função | [12](../src/js/garden/GardenBeeRenderer.js#L12) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/garden/GardenBeetleArt.js

[Implementação](../src/js/garden/GardenBeetleArt.js). Contratos exportados/reexportados: `GARDEN_BEETLE`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenBeetleRenderer.js

[Implementação](../src/js/garden/GardenBeetleRenderer.js). Contratos exportados/reexportados: `drawGardenBeetle`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawGardenBeetle(ctx, images, beetle, time)` | Função | [5](../src/js/garden/GardenBeetleRenderer.js#L5) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/garden/GardenCinematic.js

[Implementação](../src/js/garden/GardenCinematic.js). Contratos exportados/reexportados: `gardenCinematicMoment`, `renderGardenCinematic`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dialogueBottom(canvas, textCanvas, end, seen)` | Função | [23](../src/js/garden/GardenCinematic.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenCinematicMoment(state)` | Função | [46](../src/js/garden/GardenCinematic.js#L46) | Seleciona atuação e plano pelo progresso narrativo, separado da câmera de gameplay e do relógio da fala. |
| `actor(ctx, images, index, x, base, height, time, breath = true)` | Função | [78](../src/js/garden/GardenCinematic.js#L78) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actorPair(ctx, images, a, b, x, base, height, time)` | Função | [87](../src/js/garden/GardenCinematic.js#L87) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sleepingActor(ctx, images, set, file, index, x, base, headScale, time)` | Função | [99](../src/js/garden/GardenCinematic.js#L99) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fairy(ctx, images, time, x, y, height = 145)` | Função | [108](../src/js/garden/GardenCinematic.js#L108) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderGardenCinematic(ctx, canvas, state, images)` | Função | [127](../src/js/garden/GardenCinematic.js#L127) | Compõe cenário, atores em camadas e quadro narrativo; apresenta sonolência e repouso das duas após a leitura. |

## src/js/garden/GardenCinematicArt.js

[Implementação](../src/js/garden/GardenCinematicArt.js). Contratos exportados/reexportados: `GARDEN_ACTING`, `GARDEN_BEE_LAYERS`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenContact.js

[Implementação](../src/js/garden/GardenContact.js). Contratos exportados/reexportados: `gardenFeet`, `gardenContactHeight`, `gardenGirlPose`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `gardenFeet(player, x = player.x)` | Função | [19](../src/js/garden/GardenContact.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenContactHeight(platform, player, x = player.x)` | Função | [30](../src/js/garden/GardenContact.js#L30) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenGirlPose(player, time = player.animationTime ?? 0)` | Função | [75](../src/js/garden/GardenContact.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/garden/GardenContactData.js

[Implementação](../src/js/garden/GardenContactData.js). Contratos exportados/reexportados: `GARDEN_CONTACT`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenDefeatPresentation.js

[Implementação](../src/js/garden/GardenDefeatPresentation.js). Contratos exportados/reexportados: `gardenDefeatFrame`, `advanceGardenDefeats`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | [1](../src/js/garden/GardenDefeatPresentation.js#L1) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenDefeatFrame(enemy, groundY = enemy.baseY)` | Função | [3](../src/js/garden/GardenDefeatPresentation.js#L3) | Calcula corpo comprimido ou queda visual de inseto derrotado por até 1,6 s, sem alterar coordenadas de colisão. |
| `advanceGardenDefeats(state, seconds)` | Função | [34](../src/js/garden/GardenDefeatPresentation.js#L34) | Avança uma vez por subpasso os relógios visuais dos corpos, inclusive fora da vizinhança e em encerramento. |

## src/js/garden/GardenEncounters.js

[Implementação](../src/js/garden/GardenEncounters.js). Contratos exportados/reexportados: `GARDEN_BEETLES`, `createGardenEncounters`, `tickGardenWorm`, `tickGardenBeetles`, `resetGardenPanic`, `tickGardenBee`, `sweptGardenContact`, `restoreGardenEncounters`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n, a, b)` | Função atribuída | [8](../src/js/garden/GardenEncounters.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createGardenEncounters()` | Função | [30](../src/js/garden/GardenEncounters.js#L30) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `tickGardenWorm(e, s, dt)` | Função | [86](../src/js/garden/GardenEncounters.js#L86) | Controla exposição da minhoca por proximidade com limites distintos para emergir e recolher; o buraco não remove chão. |
| `tickGardenBeetles(s, dt, events)` | Função | [94](../src/js/garden/GardenEncounters.js#L94) | Ativa corrida automática até o pouso seguro na outra margem dos rios; mantém seis segundos no encontro das nuvens finais. |
| `resetGardenPanic(s, targetX)` | Função | [147](../src/js/garden/GardenEncounters.js#L147) | Limpa perseguição/saída, rearma gatilhos futuros e recoloca abelhas vivas no repouso ao retomar. |
| `tickGardenBee(e, s, dt)` | Função | [168](../src/js/garden/GardenEncounters.js#L168) | Mantém repouso fixo, aviso de 0,5 s e rasantes A/B de 1,25 s, com intervalo de 1,8 s. |
| `sweptGardenContact(previous, player, old, enemy)` | Função | [212](../src/js/garden/GardenEncounters.js#L212) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restoreGardenEncounters(saved, version = 10)` | Função | [232](../src/js/garden/GardenEncounters.js#L232) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/garden/GardenFearArt.js

[Implementação](../src/js/garden/GardenFearArt.js). Contratos exportados/reexportados: `FEAR_FILES`, `FEAR_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenInput.js

[Implementação](../src/js/garden/GardenInput.js). Contratos exportados/reexportados: `gardenControls`, `GardenInput`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `gardenControls(canvas, safe = { left: 0, right: canvas.width, top: 0, bottom: canvas.height }, { mobile = isMobileDevice() } = {})` | Função | [8](../src/js/garden/GardenInput.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor(canvas, enabled, controls, unlock = () => {}, scene = () => null)` | Método declarado | [41](../src/js/garden/GardenInput.js#L41) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `install()` | Método declarado | [118](../src/js/garden/GardenInput.js#L118) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sample()` | Método declarado | [134](../src/js/garden/GardenInput.js#L134) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clear()` | Método declarado | [186](../src/js/garden/GardenInput.js#L186) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `destroy()` | Método declarado | [196](../src/js/garden/GardenInput.js#L196) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/garden/GardenInsectArt.js

[Implementação](../src/js/garden/GardenInsectArt.js). Contratos exportados/reexportados: `INSECT_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenLevel.js

[Implementação](../src/js/garden/GardenLevel.js). Contratos exportados/reexportados: `GARDEN`, `GARDEN_HOME`, `GARDEN_TERRAINS`, `GARDEN_WHEEL`, `GARDEN_FINAL_START`, `GARDEN_GOAL`, `GARDEN_WIDTH`, `GARDEN_WHEELS`, `GARDEN_AERIAL`, `GARDEN_PLATFORMS`, `GARDEN_ENEMIES`, `GARDEN_WATERS`, `GARDEN_SECTIONS`, `GARDEN_CHECKPOINTS`, `GARDEN_LEGACY_CHECKPOINTS`, `GARDEN_PLATFORM_BY_ID`, `gardenPlatforms`, `cloudStatus`, `gardenSection`, `gardenSurfaceY`, `gardenTerrainAt`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `width()` | Acessor | [5](../src/js/garden/GardenLevel.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `goal()` | Acessor | [9](../src/js/garden/GardenLevel.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `add(id, x, w, type = 'soil', y = 590, extra = {})` | Função atribuída | [74](../src/js/garden/GardenLevel.js#L74) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ground(id, x, w, type = 'soil')` | Função atribuída | [86](../src/js/garden/GardenLevel.js#L86) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemy(id, type, p, progress = 0)` | Função atribuída | [89](../src/js/garden/GardenLevel.js#L89) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `river(id, x, count, gap = 122, rise = 32, ant = false)` | Função | [105](../src/js/garden/GardenLevel.js#L105) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenPlatforms(time = 0, state = null, center = null, radius = 1000)` | Função | [454](../src/js/garden/GardenLevel.js#L454) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cloudStatus(platform, state, time = state?.time ?? 0)` | Função | [478](../src/js/garden/GardenLevel.js#L478) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenSection(x)` | Função | [505](../src/js/garden/GardenLevel.js#L505) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenSurfaceY(platform, x)` | Função | [510](../src/js/garden/GardenLevel.js#L510) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenTerrainAt(platform, x)` | Função | [517](../src/js/garden/GardenLevel.js#L517) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/garden/GardenNarrative.js

[Implementação](../src/js/garden/GardenNarrative.js). Contratos exportados/reexportados: `GARDEN_OPENING`, `GARDEN_ENDING`, `GARDEN_OPENING_DURATION`, `gardenNarrativeCard`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `card(speaker, text, duration)` | Função atribuída | [2](../src/js/garden/GardenNarrative.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenNarrativeCard(cards, age)` | Função | [35](../src/js/garden/GardenNarrative.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/garden/GardenPhase.js

[Implementação](../src/js/garden/GardenPhase.js). Contratos exportados/reexportados: `GardenPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ canvas, audio, enabled = () => true, difficulty = 'NORMAL', campaign = false })` | Método declarado | [22](../src/js/garden/GardenPhase.js#L22) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `enabled()` | API/lambda de objeto | [40](../src/js/garden/GardenPhase.js#L40) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isModal()` | API/lambda de objeto | [42](../src/js/garden/GardenPhase.js#L42) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `requestDialogueAdvance(event = {})` | Método declarado | [59](../src/js/garden/GardenPhase.js#L59) | No jardim, enfileira avanço de uma fala ou skip visto e bloqueia pulo até a liberação da entrada. |
| `reading()` | Método declarado | [73](../src/js/garden/GardenPhase.js#L73) | Consulta abertura ou encerramento ainda em leitura e o alvo de skip já visto; devolve null durante gameplay e sono concluído. |
| `active()` | Acessor | [84](../src/js/garden/GardenPhase.js#L84) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `start(saved = null)` | Método declarado | [88](../src/js/garden/GardenPhase.js#L88) | Restaura domínio opcional, recupera marcas de leitura, carrega recursos e instala entradas/listeners; publica erro de carga sem liberar movimento. |
| `update(dt = 1)` | Método declarado | [110](../src/js/garden/GardenPhase.js#L110) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [132](../src/js/garden/GardenPhase.js#L132) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `setPaused(value)` | Método declarado | [142](../src/js/garden/GardenPhase.js#L142) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [148](../src/js/garden/GardenPhase.js#L148) | Captura envelope versão 1 com cópia serializável do domínio; não inclui imagens, áudio ou listeners. |
| `retry()` | Método declarado | [155](../src/js/garden/GardenPhase.js#L155) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [161](../src/js/garden/GardenPhase.js#L161) | Descarta avanço de diálogo, eventos de foco/visibilidade, controles, áudio e renderer de forma idempotente. |

## src/js/garden/GardenPicnicArt.js

[Implementação](../src/js/garden/GardenPicnicArt.js). Contratos exportados/reexportados: `GARDEN_PICNIC`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/GardenRenderer.js

[Implementação](../src/js/garden/GardenRenderer.js). Contratos exportados/reexportados: `GardenRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas)` | Método declarado | [89](../src/js/garden/GardenRenderer.js#L89) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [98](../src/js/garden/GardenRenderer.js#L98) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `controls()` | Método declarado | [134](../src/js/garden/GardenRenderer.js#L134) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(state)` | Método declarado | [138](../src/js/garden/GardenRenderer.js#L138) | Calcula pose visual estável sem escrever na simulação. |
| `sprite(ctx, set, index, x, y, height, flip = 1, fear = false, agitation = 0, reaction = 0)` | Método declarado | [150](../src/js/garden/GardenRenderer.js#L150) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prop(ctx, index, x, y, w, h, setName = 'objetos')` | Método declarado | [165](../src/js/garden/GardenRenderer.js#L165) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `groundPattern(type)` | Método declarado | [172](../src/js/garden/GardenRenderer.js#L172) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `groundOutline(ctx, p, bottom)` | Método declarado | [209](../src/js/garden/GardenRenderer.js#L209) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `surfaceTile(type, part = 'middle')` | Método declarado | [226](../src/js/garden/GardenRenderer.js#L226) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `groundSurface(ctx, p, joinedLeft, joinedRight)` | Método declarado | [269](../src/js/garden/GardenRenderer.js#L269) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `terrainBodies(ctx, platforms, bottom)` | Método declarado | [314](../src/js/garden/GardenRenderer.js#L314) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `terrain(ctx, p, bottom, body = true)` | Método declarado | [350](../src/js/garden/GardenRenderer.js#L350) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `aquaticSprite(ctx, index, x, y, w, h, flip = 1)` | Método declarado | [399](../src/js/garden/GardenRenderer.js#L399) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rockFoot(ctx, p)` | Método declarado | [410](../src/js/garden/GardenRenderer.js#L410) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `riverLife(ctx, s, water, left, right, bottom)` | Método declarado | [418](../src/js/garden/GardenRenderer.js#L418) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `waterFront(ctx, s, left, right, bottom, platforms)` | Método declarado | [462](../src/js/garden/GardenRenderer.js#L462) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `groundJoins(ctx, platforms)` | Método declarado | [489](../src/js/garden/GardenRenderer.js#L489) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `grassFront(ctx, s, platforms)` | Método declarado | [508](../src/js/garden/GardenRenderer.js#L508) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `effort(ctx, s)` | Método declarado | [528](../src/js/garden/GardenRenderer.js#L528) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sceneryLayout()` | Método declarado | [551](../src/js/garden/GardenRenderer.js#L551) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `scenery(ctx, s, left, right)` | Método declarado | [606](../src/js/garden/GardenRenderer.js#L606) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fairy(ctx, s)` | Método declarado | [667](../src/js/garden/GardenRenderer.js#L667) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `insect(ctx, index, x, y, width, height, direction = 1)` | Método declarado | [689](../src/js/garden/GardenRenderer.js#L689) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `message(ctx, text, options)` | Método declarado | [701](../src/js/garden/GardenRenderer.js#L701) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `narrative(ctx, s)` | Método declarado | [723](../src/js/garden/GardenRenderer.js#L723) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(s, { ready = true, error = null, touch = false, paused = false } = {})` | Método declarado | [727](../src/js/garden/GardenRenderer.js#L727) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [1073](../src/js/garden/GardenRenderer.js#L1073) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/garden/GardenSimulation.js

[Implementação](../src/js/garden/GardenSimulation.js). Contratos exportados/reexportados: `createGardenState`, `retryGarden`, `restoreGardenState`, `stepGarden`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n, a, b)` | Função atribuída | [37](../src/js/garden/GardenSimulation.js#L37) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyRange(enemy)` | Função | [40](../src/js/garden/GardenSimulation.js#L40) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createGardenState(difficulty = 'NORMAL')` | Função | [48](../src/js/garden/GardenSimulation.js#L48) | Cria domínio v11 com jogador, encontros, nuvens, leitura, apresentação, fada e recuperação serializáveis. |
| `hurtPlayer(s, source, events)` | Função | [123](../src/js/garden/GardenSimulation.js#L123) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `recoverTarget(s, kind)` | Função | [142](../src/js/garden/GardenSimulation.js#L142) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginRecovery(s, kind, events)` | Função | [161](../src/js/garden/GardenSimulation.js#L161) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `defeat(s, kind, events)` | Função | [195](../src/js/garden/GardenSimulation.js#L195) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retryGarden(s, difficulty = s.difficulty)` | Função | [213](../src/js/garden/GardenSimulation.js#L213) | Retoma GAME_OVER no checkpoint, conserva inimigos vencidos e leitura, e rearma encontros futuros. |
| `restoreGardenState(saved, difficulty = 'NORMAL')` | Função | [256](../src/js/garden/GardenSimulation.js#L256) | Valida saves v1–v11 e migra geometria, encontros e leitura para o domínio atual sem serializar recursos. |
| `fairyTick(s, dt, platforms)` | Função | [448](../src/js/garden/GardenSimulation.js#L448) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyTick(e, s, dt)` | Função | [481](../src/js/garden/GardenSimulation.js#L481) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tick(s, input, dt, events)` | Função | [561](../src/js/garden/GardenSimulation.js#L561) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stepGarden(state, input = {}, seconds = 1 / 60, difficulty = state.difficulty)` | Função | [932](../src/js/garden/GardenSimulation.js#L932) | Converte entrada em subpassos de até 1/120 s; atualiza leitura, movimento, contato, encontros, recuperação e eventos. |

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
| `refreshCampaignMenu()` | Função | [41](../src/js/main.js#L41) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updatePauseButtonState()` | Função | [59](../src/js/main.js#L59) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `toggleGamePause()` | Função | [76](../src/js/main.js#L76) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateSoundButtonState()` | Função | [91](../src/js/main.js#L91) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `onGameOver({ phase = 'bedroom', offerEasy = false } = {})` | API/lambda de objeto | [139](../src/js/main.js#L139) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onRestartToTitle()` | API/lambda de objeto | [175](../src/js/main.js#L175) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGame(event)` | Função | [196](../src/js/main.js#L196) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleRetry(event)` | Função | [226](../src/js/main.js#L226) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleRestart(event)` | Função | [260](../src/js/main.js#L260) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `addSafeAction(element, handler)` | Função | [293](../src/js/main.js#L293) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `safeHandler(event)` | Função atribuída | [296](../src/js/main.js#L296) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handleToyRoomSwitch(event)` | Função | [313](../src/js/main.js#L313) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onNew()` | API/lambda de objeto | [353](../src/js/main.js#L353) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onLoad()` | API/lambda de objeto | [359](../src/js/main.js#L359) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setDebugPhaseMenuOpen(open, restoreFocus = false)` | Função atribuída | [384](../src/js/main.js#L384) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `pollOverlayGamepad()` | Função | [488](../src/js/main.js#L488) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/narrative/DarkRoomNarrative.js

[Implementação](../src/js/narrative/DarkRoomNarrative.js). Contratos exportados/reexportados: `updateStandbyNarrative`, `updateTransicaoStandbyNarrative`, `updateCasteloNarrative`, `updateReviravoltaNarrative`, `updateTutorialRetornoNarrative`, `updatePortalNarrative`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateStandbyNarrative(context, dt)` | Função | [13](../src/js/narrative/DarkRoomNarrative.js#L13) | Mantém pose de espera, fada, partículas e foco narrativo de standby. |
| `updateTransicaoStandbyNarrative(context, dt)` | Função | [66](../src/js/narrative/DarkRoomNarrative.js#L66) | Avança saída de standby, postura, alfa e retorno do enquadramento. |
| `updateCasteloNarrative(context, dt)` | Função | [138](../src/js/narrative/DarkRoomNarrative.js#L138) | Sequencia encontro no castelo, diálogos e liberação da fuga. |
| `updateReviravoltaNarrative(context, dt)` | Função | [215](../src/js/narrative/DarkRoomNarrative.js#L215) | Avança queda/checagem e diálogos da porta falsa; coordena atores e zoom. |
| `updateTutorialRetornoNarrative(context, dt)` | Função | [390](../src/js/narrative/DarkRoomNarrative.js#L390) | Demonstra arco da fada e devolve controle no retorno. |
| `updatePortalNarrative(context, dt)` | Função | [453](../src/js/narrative/DarkRoomNarrative.js#L453) | Avança aproximação/íris do portal e dispara introdução da Toy Room. |

## src/js/narrative/DialogueControls.js

[Implementação](../src/js/narrative/DialogueControls.js). Contratos exportados/reexportados: `dialogueControlsHeight`, `drawDialogueControls`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dialogueControlsHeight(scale = 1, canSkip = false)` | Função | [6](../src/js/narrative/DialogueControls.js#L6) | Reserva altura para os comandos de leitura e, quando permitido, para o botão separado de pular cena já vista. |
| `drawDialogueControls(ctx, canvas, { left, top, width, scale = 1, canSkip = false, color = '#846467', buttonColor = '#fff5e5' } = {})` | Função | [11](../src/js/narrative/DialogueControls.js#L11) | Desenha avanço automático, gesto de adiantar e alvo separado de skip; devolve os limites do botão. |

## src/js/narrative/DialogueFlow.js

[Implementação](../src/js/narrative/DialogueFlow.js). Contratos exportados/reexportados: `beginDialogueFrame`, `endDialogueFrame`, `offerDialogue`, `setDialogueBounds`, `getDialogueBounds`, `isDialogueModal`, `installDialogueAdvance`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `flow(canvas)` | Função | [4](../src/js/narrative/DialogueFlow.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginDialogueFrame(canvas)` | Função | [18](../src/js/narrative/DialogueFlow.js#L18) | Inicia o registro dos quadros de diálogo por canvas; composições aninhadas compartilham profundidade e não deixam entrada obsoleta. |
| `endDialogueFrame(canvas)` | Função | [29](../src/js/narrative/DialogueFlow.js#L29) | Encerra um nível da composição de diálogos sem avançar relógios narrativos ou físicos. |
| `offerDialogue(canvas, text, onAdvance)` | Função | [34](../src/js/narrative/DialogueFlow.js#L34) | Registra a fala visível e seu callback de avanço; quadros dispensados ficam ocultos e canvases de medição não criam entrada. |
| `setDialogueBounds(canvas, ctx, x, y, w, h)` | Função | [50](../src/js/narrative/DialogueFlow.js#L50) | Transforma os quatro cantos do quadro para pixels do canvas usados no hit-testing de leitura não modal. |
| `getDialogueBounds(canvas)` | Função | [77](../src/js/narrative/DialogueFlow.js#L77) | Consulta os limites do quadro de diálogo atualmente registrado nesse canvas. |
| `isDialogueModal(canvas)` | Função | [81](../src/js/narrative/DialogueFlow.js#L81) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `installDialogueAdvance(canvas, { enabled = () => true, /** * Avança o estado e dados do componente para a próxima etapa sem repetir o estado já consumido. */ advance = () => false, /** * Indica se a modal satisfaz as condições vigentes do fluxo. */ isModal = () => true } = {})` | Função | [85](../src/js/narrative/DialogueFlow.js#L85) | Instala pointerdown em captura; consome um gesto e avança uma fala, preservando controles fora do quadro não modal. |
| `blur()` | Função atribuída | [156](../src/js/narrative/DialogueFlow.js#L156) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/narrative/PoeticNarrator.js

[Implementação](../src/js/narrative/PoeticNarrator.js). Contratos exportados/reexportados: `POETIC_LINES`, `getPauseNarration`, `renderPoeticNarration`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getPauseNarration(state)` | Função | [30](../src/js/narrative/PoeticNarrator.js#L30) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `renderPoeticNarration(ctx, canvas, text, options = {})` | Função | [37](../src/js/narrative/PoeticNarrator.js#L37) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/rendering/DarkRoomRenderPipeline.js

[Implementação](../src/js/rendering/DarkRoomRenderPipeline.js). Contratos exportados/reexportados: `renderDarkRoom`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderDarkRoom(context)` | Função | [29](../src/js/rendering/DarkRoomRenderPipeline.js#L29) | Compõe apresentação, camadas e interface; update de simulação permanece em game.js. |
| `drawRoom()` | API/lambda de objeto | [87](../src/js/rendering/DarkRoomRenderPipeline.js#L87) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

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
| `captureState(state)` | Função | [15](../src/js/state/CampaignProgress.js#L15) | Seleciona estado serializável da campanha. |
| `restoreState(state, saved)` | Função | [18](../src/js/state/CampaignProgress.js#L18) | Restaura valores preservando referências de objetos/arrays existentes. |
| `createCampaignProgress(storage)` | Função | [28](../src/js/state/CampaignProgress.js#L28) | Cria leitura, gravação e limpeza do progresso local com alternativa em memória. |
| `read()` | Método declarado | [40](../src/js/state/CampaignProgress.js#L40) | Lê e valida save da campanha; pode usar memória da sessão. |
| `write(data)` | Método declarado | [89](../src/js/state/CampaignProgress.js#L89) | Serializa save versionado e tenta gravar no storage. |
| `clear()` | Método declarado | [107](../src/js/state/CampaignProgress.js#L107) | Configura/reinicializa valores do componente; revise o escopo da mutação. |

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
| `constructor(canvas, uiFeedback, callbacks = {})` | Método declarado | [18](../src/js/state/GameState.js#L18) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setLastInputDevice(dev)` | Método declarado | [31](../src/js/state/GameState.js#L31) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getActivePromptDevice()` | Método declarado | [41](../src/js/state/GameState.js#L41) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `spawnFairySparkles(x, y, count = 2)` | Método declarado | [63](../src/js/state/GameState.js#L63) | Cria partículas/efeitos no buffer correspondente. |
| `spawnFairyFlightDust(fx, fy, fvx, fvy)` | Método declarado | [88](../src/js/state/GameState.js#L88) | Cria partículas/efeitos no buffer correspondente. |
| `updateFairyParticles()` | Método declarado | [111](../src/js/state/GameState.js#L111) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `startStandbyPreparation(audio)` | Método declarado | [127](../src/js/state/GameState.js#L127) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `confirmStandby(audio)` | Método declarado | [166](../src/js/state/GameState.js#L166) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetBabyPhysicsBody(targetX, targetY, facing = 1)` | Método declarado | [188](../src/js/state/GameState.js#L188) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `triggerGameOver(audio)` | Método declarado | [214](../src/js/state/GameState.js#L214) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retryGame(audio)` | Método declarado | [242](../src/js/state/GameState.js#L242) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restartToTitle(audio)` | Método declarado | [260](../src/js/state/GameState.js#L260) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `showFailMessage()` | Método declarado | [291](../src/js/state/GameState.js#L291) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startCastleCutscene(audio)` | Método declarado | [310](../src/js/state/GameState.js#L310) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advanceCutscene(audio)` | Método declarado | [329](../src/js/state/GameState.js#L329) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishCutscene(audio)` | Método declarado | [344](../src/js/state/GameState.js#L344) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startPlotTwistCutscene(audio)` | Método declarado | [384](../src/js/state/GameState.js#L384) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advancePlotTwist(audio)` | Método declarado | [413](../src/js/state/GameState.js#L413) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishPlotTwistAndStartTutorial(audio)` | Método declarado | [432](../src/js/state/GameState.js#L432) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startTruePortalTransition(audio)` | Método declarado | [474](../src/js/state/GameState.js#L474) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetToStart(failedMidClimb = false, shouldPlayFailSound = true, audio)` | Método declarado | [499](../src/js/state/GameState.js#L499) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `createGameState(canvas, uiFeedback, callbacks)` | Função | [592](../src/js/state/GameState.js#L592) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/state/StateVariables.js

[Implementação](../src/js/state/StateVariables.js). Contratos exportados/reexportados: `createDefaultStateVariables`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createDefaultStateVariables()` | Função | [9](../src/js/state/StateVariables.js#L9) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/toy-room/ArenaAudioProfile.js

[Implementação](../src/js/toy-room/ArenaAudioProfile.js). Contratos exportados/reexportados: `ArenaAudioProfile`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(audio)` | Método declarado | [4](../src/js/toy-room/ArenaAudioProfile.js#L4) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `transform()` | Método declarado | [11](../src/js/toy-room/ArenaAudioProfile.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enter()` | Método declarado | [18](../src/js/toy-room/ArenaAudioProfile.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [24](../src/js/toy-room/ArenaAudioProfile.js#L24) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `sound(event)` | Método declarado | [33](../src/js/toy-room/ArenaAudioProfile.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `leave({ resume = true } = {})` | Método declarado | [38](../src/js/toy-room/ArenaAudioProfile.js#L38) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `snapshot()` | Método declarado | [50](../src/js/toy-room/ArenaAudioProfile.js#L50) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [58](../src/js/toy-room/ArenaAudioProfile.js#L58) | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ArenaBoss.js

[Implementação](../src/js/toy-room/ArenaBoss.js). Contratos exportados/reexportados: `ArenaBoss`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [4](../src/js/toy-room/ArenaBoss.js#L4) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `update(dt, battle)` | Método declarado | [9](../src/js/toy-room/ArenaBoss.js#L9) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `snapshot()` | Método declarado | [22](../src/js/toy-room/ArenaBoss.js#L22) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [29](../src/js/toy-room/ArenaBoss.js#L29) | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ArenaCamera.js

[Implementação](../src/js/toy-room/ArenaCamera.js). Contratos exportados/reexportados: `ArenaCamera`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [22](../src/js/toy-room/ArenaCamera.js#L22) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `update(dt, player, enemy, jump = 0, impact = null, battle = null)` | Método declarado | [30](../src/js/toy-room/ArenaCamera.js#L30) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `envelope(player, enemy, jump, battle = null, anticipate = false)` | Método declarado | [45](../src/js/toy-room/ArenaCamera.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(layout, room, battle)` | Método declarado | [73](../src/js/toy-room/ArenaCamera.js#L73) | Calcula pose visual estável sem escrever na simulação. |
| `snapshot()` | Método declarado | [104](../src/js/toy-room/ArenaCamera.js#L104) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [114](../src/js/toy-room/ArenaCamera.js#L114) | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ArenaCombatContact.js

[Implementação](../src/js/toy-room/ArenaCombatContact.js). Contratos exportados/reexportados: `arenaEnemyContact`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaEnemyContact(state, enemy)` | Função | [2](../src/js/toy-room/ArenaCombatContact.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaCombatRules.js

[Implementação](../src/js/toy-room/ArenaCombatRules.js). Contratos exportados/reexportados: `ARENA_SWORD`, `arenaEnemyImpactEnd`, `arenaEnemyGuarding`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaEnemyImpactEnd(enemy, tuning = { windup: 54, active: 18 })` | Função atribuída | [9](../src/js/toy-room/ArenaCombatRules.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaEnemyGuarding(enemy, tuning)` | Função | [15](../src/js/toy-room/ArenaCombatRules.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaDifficulty.js

[Implementação](../src/js/toy-room/ArenaDifficulty.js). Contratos exportados/reexportados: `arenaDifficulty`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaDifficulty(difficulty = 'NORMAL')` | Função | [26](../src/js/toy-room/ArenaDifficulty.js#L26) | Seleciona os perfis originais do NORMAL ou alcance ampliado e menor agressividade no EASY. |

## src/js/toy-room/ArenaEnemies.js

[Implementação](../src/js/toy-room/ArenaEnemies.js). Contratos exportados/reexportados: `ARENA_ENEMIES`, `renderArenaEnemyPresence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderArenaEnemyPresence(ctx, enemy, ground)` | Função | [69](../src/js/toy-room/ArenaEnemies.js#L69) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ArenaEnemyAI.js

[Implementação](../src/js/toy-room/ArenaEnemyAI.js). Contratos exportados/reexportados: `selectArenaEnemyAttack`, `updateArenaEnemyAI`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | [51](../src/js/toy-room/ArenaEnemyAI.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updatePlayerBehavior(battle, dt)` | Função | [53](../src/js/toy-room/ArenaEnemyAI.js#L53) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `selectArenaEnemyAttack(battle, distance, attacks)` | Função | [80](../src/js/toy-room/ArenaEnemyAI.js#L80) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateArenaEnemyAI(battle, dt)` | Função | [114](../src/js/toy-room/ArenaEnemyAI.js#L114) | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/toy-room/ArenaEnvironment.js

[Implementação](../src/js/toy-room/ArenaEnvironment.js). Contratos exportados/reexportados: `renderArenaEnvironment`, `renderArenaTemple`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderArenaRoom(ctx, room, arena)` | Função | [8](../src/js/toy-room/ArenaEnvironment.js#L8) | Compõe parede, madeira repetida e rodapé existentes, sem alterar colisões. |
| `renderArenaStructure(ctx, room, structure)` | Função | [57](../src/js/toy-room/ArenaEnvironment.js#L57) | Apoia o móvel na base visual do layout e reutiliza sua ilustração. |
| `renderArenaEnvironment(ctx, room, arena, time = 0)` | Função | [92](../src/js/toy-room/ArenaEnvironment.js#L92) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderArenaTemple(ctx, room, arena, foreground = false)` | Função | [118](../src/js/toy-room/ArenaEnvironment.js#L118) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ArenaGirlAnimationFrames.js

[Implementação](../src/js/toy-room/ArenaGirlAnimationFrames.js). Contratos exportados/reexportados: `ARENA_GIRL_REFERENCE_HEIGHT`, `ARENA_GIRL_ANIMATION_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/ArenaHUD.js

[Implementação](../src/js/toy-room/ArenaHUD.js). Contratos exportados/reexportados: `ARENA_ENEMY_NAMES`, `arenaHUDLayout`, `renderArenaHUD`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaHUDLayout(layout)` | Função | [16](../src/js/toy-room/ArenaHUD.js#L16) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderArenaMobileControls(ctx, layout, room, state)` | Função | [40](../src/js/toy-room/ArenaHUD.js#L40) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawAction(button, title, badge, special = false)` | Função atribuída | [102](../src/js/toy-room/ArenaHUD.js#L102) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderArenaHUD(ctx, room, state, layout, boss = null)` | Função | [128](../src/js/toy-room/ArenaHUD.js#L128) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `bar(b, hp, max, color, reverse)` | Função atribuída | [138](../src/js/toy-room/ArenaHUD.js#L138) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaPlayerAnimation.js

[Implementação](../src/js/toy-room/ArenaPlayerAnimation.js). Contratos exportados/reexportados: `ARENA_ATTACK_VISUAL_DURATION`, `createPlayerAnimation`, `beginArenaPlayerAttack`, `updateArenaPlayerAnimation`, `sampleArenaPlayerAnimation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createPlayerAnimation(state = {}, player = {})` | Função | [17](../src/js/toy-room/ArenaPlayerAnimation.js#L17) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `beginArenaPlayerAttack(state, direction)` | Função | [35](../src/js/toy-room/ArenaPlayerAnimation.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateArenaPlayerAnimation(state, player, dt)` | Função | [43](../src/js/toy-room/ArenaPlayerAnimation.js#L43) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `layer(pose, index = 0, weight = 1)` | Função atribuída | [74](../src/js/toy-room/ArenaPlayerAnimation.js#L74) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pair(from, to, weight)` | Função atribuída | [78](../src/js/toy-room/ArenaPlayerAnimation.js#L78) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cycle(pose, time, durations)` | Função | [86](../src/js/toy-room/ArenaPlayerAnimation.js#L86) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `poseLayers(pose, time, a, state)` | Função | [100](../src/js/toy-room/ArenaPlayerAnimation.js#L100) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sampleArenaPlayerAnimation(state, player)` | Função | [144](../src/js/toy-room/ArenaPlayerAnimation.js#L144) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaPlayerController.js

[Implementação](../src/js/toy-room/ArenaPlayerController.js). Contratos exportados/reexportados: `ARENA_TUNING`, `ArenaPlayerController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `update(battle, dt)` | Método declarado | [34](../src/js/toy-room/ArenaPlayerController.js#L34) | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/toy-room/ArenaPlayerRenderer.js

[Implementação](../src/js/toy-room/ArenaPlayerRenderer.js). Contratos exportados/reexportados: `ArenaPlayerRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [20](../src/js/toy-room/ArenaPlayerRenderer.js#L20) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [26](../src/js/toy-room/ArenaPlayerRenderer.js#L26) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(ctx, room, state, ground)` | Método declarado | [45](../src/js/toy-room/ArenaPlayerRenderer.js#L45) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderSpecialCloseup(ctx, canvas, state)` | Método declarado | [101](../src/js/toy-room/ArenaPlayerRenderer.js#L101) | Apresenta o close dramático usando a textura pré-carregada com as poses da menina. |
| `renderSwordArc(ctx, sample, reachScale = 1)` | Método declarado | [105](../src/js/toy-room/ArenaPlayerRenderer.js#L105) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ArenaScale.js

[Implementação](../src/js/toy-room/ArenaScale.js). Contratos exportados/reexportados: `ARENA_SCALE`, `ARENA_PLAYER_HEIGHT`, `arenaActorBounds`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaActorBounds(x, ground, jump = 0, height = ARENA_PLAYER_HEIGHT, width = height * 1.3)` | Função | [9](../src/js/toy-room/ArenaScale.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ArenaSoundEffects.js

[Implementação](../src/js/toy-room/ArenaSoundEffects.js). Contratos exportados/reexportados: `ARENA_SOUND_FILES`, `ArenaSoundEffects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [102](../src/js/toy-room/ArenaSoundEffects.js#L102) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `preload(ctx)` | Método declarado | [109](../src/js/toy-room/ArenaSoundEffects.js#L109) | Pré-carrega entradas de imagens do manifesto. |
| `stop(channel)` | Método declarado | [125](../src/js/toy-room/ArenaSoundEffects.js#L125) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `play(ctx, destination, event)` | Método declarado | [139](../src/js/toy-room/ArenaSoundEffects.js#L139) | Aciona o som/cue correspondente ou sua delegação de áudio. |

## src/js/toy-room/ArenaSpecialAttack.js

[Implementação](../src/js/toy-room/ArenaSpecialAttack.js). Contratos exportados/reexportados: `ARENA_SPECIAL`, `RAINBOW_COLORS`, `beginArenaSpecial`, `updateArenaSpecial`, `specialCameraFrame`, `renderSpecialSwordAura`, `renderArenaSpecialBeam`, `ARENA_SPECIAL_CLOSEUP_FILE`, `renderArenaSpecialCloseup`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `beginArenaSpecial(battle)` | Função | [17](../src/js/toy-room/ArenaSpecialAttack.js#L17) | Consome o uso único e inicia a carga da espada na arena quando a ativação é válida. |
| `updateArenaSpecial(battle, dt)` | Função | [46](../src/js/toy-room/ArenaSpecialAttack.js#L46) | Avança a encenação com física/IA suspensas e aplica dano único na chegada do raio. |
| `specialCameraFrame(frame, room, state)` | Função | [93](../src/js/toy-room/ArenaSpecialAttack.js#L93) | Aproxima do rosto durante a carga e retorna ao panorama antes do corte. |
| `renderSpecialSwordAura(ctx, state)` | Função | [111](../src/js/toy-room/ArenaSpecialAttack.js#L111) | Envolve a lâmina existente em sete cores e partículas sem redesenhar o sprite. |
| `renderArenaSpecialBeam(ctx, room, state, ground)` | Função | [153](../src/js/toy-room/ArenaSpecialAttack.js#L153) | Desenha a viagem do raio até o alvo e os anéis do impacto, sem alterar estado. |
| `renderArenaSpecialCloseup(ctx, canvas, state, image)` | Função | [200](../src/js/toy-room/ArenaSpecialAttack.js#L200) | Compõe um corte de anime com ambos os olhos, entrada/saída rápidas e energia; não avança a simulação. |

## src/js/toy-room/BattleAssets.js

[Implementação](../src/js/toy-room/BattleAssets.js). Contratos exportados/reexportados: `loadBattleManifest`, `loadBattleImages`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `loadBattleManifest()` | Função | [13](../src/js/toy-room/BattleAssets.js#L13) | Carrega o manifesto de remediação e substitui as sequências Hit pelos quadros nativos de dano. |
| `loadBattleImages(manifest, images)` | Função | [24](../src/js/toy-room/BattleAssets.js#L24) | Preenche o cache de imagens da batalha, com erro explícito para recursos ausentes. |

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
| `rocketPunchProjection(frame, reference, elapsed, signedDistance, target = null)` | Função | [16](../src/js/toy-room/BattlePresentation.js#L16) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rocketPunchTouchesPlayer(frame, reference, elapsed, signedDistance, target)` | Função | [81](../src/js/toy-room/BattlePresentation.js#L81) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderRocketPunch(ctx, image, frame, reference, elapsed, signedDistance, target = null)` | Função | [111](../src/js/toy-room/BattlePresentation.js#L111) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderBattleCrouch(ctx, image, player, attackTime, attackDirection)` | Função | [153](../src/js/toy-room/BattlePresentation.js#L153) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `playerModel(state, player, attackDirection)` | Função | [169](../src/js/toy-room/BattlePresentation.js#L169) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `battlePlayerJumpOffset(state, player, attackDirection)` | Função | [178](../src/js/toy-room/BattlePresentation.js#L178) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `laserProjection(state, player, enemy, attackDirection)` | Função | [182](../src/js/toy-room/BattlePresentation.js#L182) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `trainDrive(elapsed)` | Função | [219](../src/js/toy-room/BattlePresentation.js#L219) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderTrainWalk(ctx, body, parts, elapsed, transportScale = 1)` | Função | [234](../src/js/toy-room/BattlePresentation.js#L234) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/BattleRenderer.js

[Implementação](../src/js/toy-room/BattleRenderer.js). Contratos exportados/reexportados: `battleAnimationFrame`, `renderBattle`, `renderBattleImpact`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n, a, b)` | Função atribuída | [33](../src/js/toy-room/BattleRenderer.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `battleAnimationFrame(animation, enemy, duration, tuning = BATTLE_TUNING)` | Função | [36](../src/js/toy-room/BattleRenderer.js#L36) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderBattle(battle)` | Função | [52](../src/js/toy-room/BattleRenderer.js#L52) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `hearts(hp, max)` | Função atribuída | [225](../src/js/toy-room/BattleRenderer.js#L225) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderBattleImpact(ctx, impact)` | Função | [275](../src/js/toy-room/BattleRenderer.js#L275) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/DamageAudio.js

[Implementação](../src/js/toy-room/DamageAudio.js). Contratos exportados/reexportados: `DAMAGE_AUDIO_PROFILES`, `scheduleDamageSound`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `scheduleDamageSound(ctx, destination, register, actor, arena = false)` | Função | [45](../src/js/toy-room/DamageAudio.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `connectVoice(source, nodes, start, end)` | Função atribuída | [51](../src/js/toy-room/DamageAudio.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `envelope(volume, start, duration, attack = 0.004)` | Função atribuída | [68](../src/js/toy-room/DamageAudio.js#L68) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/DamageSpriteFrames.js

[Implementação](../src/js/toy-room/DamageSpriteFrames.js). Contratos exportados/reexportados: `DAMAGE_SPRITE_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/EnemyMovementAudio.js

[Implementação](../src/js/toy-room/EnemyMovementAudio.js). Contratos exportados/reexportados: `scheduleEnemyMovement`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `scheduleEnemyMovement(ctx, destination, register, actor)` | Função | [2](../src/js/toy-room/EnemyMovementAudio.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ImpactFX.js

[Implementação](../src/js/toy-room/ImpactFX.js). Contratos exportados/reexportados: `ImpactFX`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [5](../src/js/toy-room/ImpactFX.js#L5) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `emit(kind, x, y, heavy = false)` | Método declarado | [12](../src/js/toy-room/ImpactFX.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [37](../src/js/toy-room/ImpactFX.js#L37) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render(ctx)` | Método declarado | [49](../src/js/toy-room/ImpactFX.js#L49) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | [69](../src/js/toy-room/ImpactFX.js#L69) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [78](../src/js/toy-room/ImpactFX.js#L78) | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/PlayerController.js

[Implementação](../src/js/toy-room/PlayerController.js). Contratos exportados/reexportados: `PlayerController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | [5](../src/js/toy-room/PlayerController.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(battle, dt)` | Método declarado | [10](../src/js/toy-room/PlayerController.js#L10) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `faceEnemy()` | Função atribuída | [31](../src/js/toy-room/PlayerController.js#L31) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/RoomEnvironmentRenderer.js

[Implementação](../src/js/toy-room/RoomEnvironmentRenderer.js). Contratos exportados/reexportados: `RoomEnvironmentRenderer`, `roomEnvironmentRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderBackground(ctx, roomW, roomH, options = {})` | Método declarado | [37](../src/js/toy-room/RoomEnvironmentRenderer.js#L37) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawWoodStrip(ctx, image, x, y, width, height, plain = false)` | Método declarado | [164](../src/js/toy-room/RoomEnvironmentRenderer.js#L164) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawWoodTrim(ctx, image, roomW, roomH)` | Método declarado | [174](../src/js/toy-room/RoomEnvironmentRenderer.js#L174) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderPerspectiveFloor(ctx, tile, roomW, roomH)` | Método declarado | [190](../src/js/toy-room/RoomEnvironmentRenderer.js#L190) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawArchedWindow(ctx, wx, wy, windowImage = null)` | Método declarado | [227](../src/js/toy-room/RoomEnvironmentRenderer.js#L227) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawEntrancePortal(ctx, dx, dy, environmentDoor = null)` | Método declarado | [289](../src/js/toy-room/RoomEnvironmentRenderer.js#L289) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawCentralMandalaRug(ctx, cx, cy)` | Método declarado | [319](../src/js/toy-room/RoomEnvironmentRenderer.js#L319) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFloralPlayMat(ctx, rx, ry, rugImage = null)` | Método declarado | [367](../src/js/toy-room/RoomEnvironmentRenderer.js#L367) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBedsideFringeRug(ctx, bx, by, rugImage = null)` | Método declarado | [417](../src/js/toy-room/RoomEnvironmentRenderer.js#L417) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `traceTrainCircuit(ctx)` | Método declarado | [448](../src/js/toy-room/RoomEnvironmentRenderer.js#L448) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createWoodenTrackLayer(image)` | Método declarado | [453](../src/js/toy-room/RoomEnvironmentRenderer.js#L453) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `drawTrainTracks(ctx, trackImage = null)` | Método declarado | [516](../src/js/toy-room/RoomEnvironmentRenderer.js#L516) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFurniture(ctx, f, options = {})` | Método declarado | [561](../src/js/toy-room/RoomEnvironmentRenderer.js#L561) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/SwordAudio.js

[Implementação](../src/js/toy-room/SwordAudio.js). Contratos exportados/reexportados: `scheduleSwordSound`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `scheduleSwordSound(ctx, destination, register, event)` | Função | [2](../src/js/toy-room/SwordAudio.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `voice(source, nodes, duration, delay = 0)` | Função atribuída | [6](../src/js/toy-room/SwordAudio.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `envelope(volume, duration, attack = 0.003, delay = 0)` | Função atribuída | [23](../src/js/toy-room/SwordAudio.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `noise(volume, duration, frequency, end, attack = 0.003)` | Função atribuída | [31](../src/js/toy-room/SwordAudio.js#L31) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tone(frequency, end, volume, duration, type = 'sine', delay = 0)` | Função atribuída | [48](../src/js/toy-room/SwordAudio.js#L48) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyCarryPresentation.js

[Implementação](../src/js/toy-room/ToyCarryPresentation.js). Contratos exportados/reexportados: `CARRY_PROFILES`, `renderToyCarry`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `carriedSprite(toy, options)` | Função | [65](../src/js/toy-room/ToyCarryPresentation.js#L65) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderToyCarry(ctx, player, options = {})` | Função | [111](../src/js/toy-room/ToyCarryPresentation.js#L111) | Compõe pose, brinquedo e contatos visuais usando CARRY_PROFILES; sem pose/item devolve false. |
| `drawBody()` | Função atribuída | [145](../src/js/toy-room/ToyCarryPresentation.js#L145) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRenderer.js

[Implementação](../src/js/toy-room/ToyRenderer.js). Contratos exportados/reexportados: `ToyRenderer`, `toyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToy(ctx, t, playerX = 0, playerY = 0, isCarrying = false, time = performance.now(), options = {})` | Método declarado | [19](../src/js/toy-room/ToyRenderer.js#L19) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomArenaBuilder.js

[Implementação](../src/js/toy-room/ToyRoomArenaBuilder.js). Contratos exportados/reexportados: `ToyRoomArenaBuilder`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `build({ furniture, ROOM_W = 1600 })` | Método declarado | [6](../src/js/toy-room/ToyRoomArenaBuilder.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomArenaPhase.js

[Implementação](../src/js/toy-room/ToyRoomArenaPhase.js). Contratos exportados/reexportados: `ARENA_TRANSFORMATION_DURATION`, `ARENA_VICTORY_FADE_DURATION`, `ToyRoomArenaPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(room)` | Método declarado | [62](../src/js/toy-room/ToyRoomArenaPhase.js#L62) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `active()` | Acessor | [86](../src/js/toy-room/ToyRoomArenaPhase.js#L86) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `start()` | Método declarado | [91](../src/js/toy-room/ToyRoomArenaPhase.js#L91) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `configurePresentation()` | Método declarado | [109](../src/js/toy-room/ToyRoomArenaPhase.js#L109) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderHUD(ctx, layout, state)` | API/lambda de objeto | [126](../src/js/toy-room/ToyRoomArenaPhase.js#L126) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `onImpact(x, y, heavy)` | API/lambda de objeto | [137](../src/js/toy-room/ToyRoomArenaPhase.js#L137) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onBlock(x, y)` | API/lambda de objeto | [139](../src/js/toy-room/ToyRoomArenaPhase.js#L139) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `transportOrigin()` | API/lambda de objeto | [147](../src/js/toy-room/ToyRoomArenaPhase.js#L147) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderPlayer(ctx, state, ground)` | API/lambda de objeto | [155](../src/js/toy-room/ToyRoomArenaPhase.js#L155) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `restoreReality({ resumeAudio = true } = {})` | Método declarado | [160](../src/js/toy-room/ToyRoomArenaPhase.js#L160) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `finish()` | Método declarado | [192](../src/js/toy-room/ToyRoomArenaPhase.js#L192) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `beginReturn()` | Método declarado | [203](../src/js/toy-room/ToyRoomArenaPhase.js#L203) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt = 1)` | Método declarado | [219](../src/js/toy-room/ToyRoomArenaPhase.js#L219) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [277](../src/js/toy-room/ToyRoomArenaPhase.js#L277) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | [344](../src/js/toy-room/ToyRoomArenaPhase.js#L344) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved, roomSave = null)` | Método declarado | [356](../src/js/toy-room/ToyRoomArenaPhase.js#L356) | Reaplica a captura específica; confira referências e dados transitórios. |
| `attack()` | Método declarado | [420](../src/js/toy-room/ToyRoomArenaPhase.js#L420) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retry()` | Método declarado | [434](../src/js/toy-room/ToyRoomArenaPhase.js#L434) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `special()` | Método declarado | [443](../src/js/toy-room/ToyRoomArenaPhase.js#L443) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomBattle.js

[Implementação](../src/js/toy-room/ToyRoomBattle.js). Contratos exportados/reexportados: `transferHeart`, `ToyRoomBattle`, `BATTLE_ORDER`, `BATTLE_PLAYER_VISUAL_SCALE`, `BATTLE_TUNING`, `BATTLE_TRANSITION_DURATION`, `battleAnimationFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n, a, b)` | Função atribuída | [50](../src/js/toy-room/ToyRoomBattle.js#L50) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `transferHeart(victim, attacker)` | Função | [53](../src/js/toy-room/ToyRoomBattle.js#L53) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor(room, { loadAssets = true } = {})` | Método declarado | [62](../src/js/toy-room/ToyRoomBattle.js#L62) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [80](../src/js/toy-room/ToyRoomBattle.js#L80) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `activate()` | Método declarado | [89](../src/js/toy-room/ToyRoomBattle.js#L89) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `spawn()` | Método declarado | [140](../src/js/toy-room/ToyRoomBattle.js#L140) | Cria partículas/efeitos no buffer correspondente. |
| `getEnemyCollisionDistance(actor)` | Método declarado | [163](../src/js/toy-room/ToyRoomBattle.js#L163) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getSwordRange(actor = this.state.enemy.actor)` | Método declarado | [181](../src/js/toy-room/ToyRoomBattle.js#L181) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `swordContactPoint(dx, facing)` | Método declarado | [188](../src/js/toy-room/ToyRoomBattle.js#L188) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resolveActorBodies(side)` | Método declarado | [200](../src/js/toy-room/ToyRoomBattle.js#L200) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaChest()` | Método declarado | [226](../src/js/toy-room/ToyRoomBattle.js#L226) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginTransition(outgoing)` | Método declarado | [236](../src/js/toy-room/ToyRoomBattle.js#L236) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `transitionPlacement(incoming)` | Método declarado | [255](../src/js/toy-room/ToyRoomBattle.js#L255) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `input()` | Método declarado | [300](../src/js/toy-room/ToyRoomBattle.js#L300) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attack()` | Método declarado | [328](../src/js/toy-room/ToyRoomBattle.js#L328) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `faceEnemy()` | Método declarado | [349](../src/js/toy-room/ToyRoomBattle.js#L349) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playCombatSound(sound)` | Método declarado | [360](../src/js/toy-room/ToyRoomBattle.js#L360) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setEnemyState(state)` | Método declarado | [372](../src/js/toy-room/ToyRoomBattle.js#L372) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `beginEnemyAttack(attack)` | Método declarado | [380](../src/js/toy-room/ToyRoomBattle.js#L380) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyGuarding()` | Método declarado | [405](../src/js/toy-room/ToyRoomBattle.js#L405) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginEnemyResponse()` | Método declarado | [410](../src/js/toy-room/ToyRoomBattle.js#L410) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startImpact(target, x, y, direction, heavy)` | Método declarado | [419](../src/js/toy-room/ToyRoomBattle.js#L419) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | [446](../src/js/toy-room/ToyRoomBattle.js#L446) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `step(dt)` | Método declarado | [482](../src/js/toy-room/ToyRoomBattle.js#L482) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyPose(e = this.state.enemy)` | Método declarado | [775](../src/js/toy-room/ToyRoomBattle.js#L775) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Método declarado | [781](../src/js/toy-room/ToyRoomBattle.js#L781) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderImpact(ctx, impact)` | Método declarado | [786](../src/js/toy-room/ToyRoomBattle.js#L786) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | [791](../src/js/toy-room/ToyRoomBattle.js#L791) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [795](../src/js/toy-room/ToyRoomBattle.js#L795) | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ToyRoomCamera.js

[Implementação](../src/js/toy-room/ToyRoomCamera.js). Contratos exportados/reexportados: `updateToyRoomCamera`, `getToyRoomCameraFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateToyRoomCamera({ target, canvas, width, height, cameraX, cameraY }, dt)` | Função | [9](../src/js/toy-room/ToyRoomCamera.js#L9) | Calcula coordenadas da câmera da sala a partir do alvo narrativo explícito. |
| `getToyRoomCameraFrame({ target, canvas, cameraX, cameraY, mobilePresentation })` | Função | [40](../src/js/toy-room/ToyRoomCamera.js#L40) | Calcula zoom e enquadramento da sala com alvo/câmera/layout atuais. |

## src/js/toy-room/ToyRoomCompanion.js

[Implementação](../src/js/toy-room/ToyRoomCompanion.js). Contratos exportados/reexportados: `updateToyRoomCompanion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateToyRoomCompanion({ player, fairy, toys, tutorial, story, gameDifficulty, guideToy }, dt)` | Função | [9](../src/js/toy-room/ToyRoomCompanion.js#L9) | Atualiza guia, tutorial, voo e rastro da fada; devolve o brinquedo-guia atual. |

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
| `renderPlayer(ctx, player, options = {})` | Método declarado | [19](../src/js/toy-room/ToyRoomEntities.js#L19) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFairy(ctx, fairy, options = {})` | Método declarado | [35](../src/js/toy-room/ToyRoomEntities.js#L35) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

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
| `keysDown()` | Acessor | [6](../src/js/toy-room/ToyRoomInputContext.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `keysDown(value)` | Acessor | [10](../src/js/toy-room/ToyRoomInputContext.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isTouchDevice()` | Acessor | [14](../src/js/toy-room/ToyRoomInputContext.js#L14) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isTouchDevice(value)` | Acessor | [18](../src/js/toy-room/ToyRoomInputContext.js#L18) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `actionBtnPressed()` | Acessor | [22](../src/js/toy-room/ToyRoomInputContext.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actionBtnPressed(value)` | Acessor | [26](../src/js/toy-room/ToyRoomInputContext.js#L26) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `touchState()` | Acessor | [30](../src/js/toy-room/ToyRoomInputContext.js#L30) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gamepadState()` | Acessor | [34](../src/js/toy-room/ToyRoomInputContext.js#L34) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaTouchPointers()` | Acessor | [38](../src/js/toy-room/ToyRoomInputContext.js#L38) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaTouchButtons()` | Acessor | [42](../src/js/toy-room/ToyRoomInputContext.js#L42) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaSpecialButtons()` | Acessor | [46](../src/js/toy-room/ToyRoomInputContext.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canvas()` | Acessor | [51](../src/js/toy-room/ToyRoomInputContext.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | [55](../src/js/toy-room/ToyRoomInputContext.js#L55) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `mobile()` | Acessor | [59](../src/js/toy-room/ToyRoomInputContext.js#L59) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `device()` | Acessor | [63](../src/js/toy-room/ToyRoomInputContext.js#L63) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handlers()` | Acessor | [67](../src/js/toy-room/ToyRoomInputContext.js#L67) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `isEnabled()` | API/lambda de objeto | [78](../src/js/toy-room/ToyRoomInputContext.js#L78) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isLocked()` | API/lambda de objeto | [80](../src/js/toy-room/ToyRoomInputContext.js#L80) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isArenaCombat()` | API/lambda de objeto | [82](../src/js/toy-room/ToyRoomInputContext.js#L82) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `initAudio()` | API/lambda de objeto | [86](../src/js/toy-room/ToyRoomInputContext.js#L86) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `action()` | API/lambda de objeto | [90](../src/js/toy-room/ToyRoomInputContext.js#L90) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `special()` | API/lambda de objeto | [92](../src/js/toy-room/ToyRoomInputContext.js#L92) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomInputController.js

[Implementação](../src/js/toy-room/ToyRoomInputController.js). Contratos exportados/reexportados: `ToyRoomInputController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | [14](../src/js/toy-room/ToyRoomInputController.js#L14) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setupListeners()` | Método declarado | [20](../src/js/toy-room/ToyRoomInputController.js#L20) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getCanvasCoordinates(e)` | Método declarado | [41](../src/js/toy-room/ToyRoomInputController.js#L41) | Converte evento de ponteiro para coordenadas internas da sala. |
| `isActionButtonHit(coords)` | Método declarado | [66](../src/js/toy-room/ToyRoomInputController.js#L66) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `handleKeyDown(e)` | Método declarado | [71](../src/js/toy-room/ToyRoomInputController.js#L71) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyUp(e)` | Método declarado | [90](../src/js/toy-room/ToyRoomInputController.js#L90) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | [95](../src/js/toy-room/ToyRoomInputController.js#L95) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onPointerDown(e)` | Método declarado | [147](../src/js/toy-room/ToyRoomInputController.js#L147) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerMove(e)` | Método declarado | [219](../src/js/toy-room/ToyRoomInputController.js#L219) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerUp(e)` | Método declarado | [261](../src/js/toy-room/ToyRoomInputController.js#L261) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `clearInput()` | Método declarado | [292](../src/js/toy-room/ToyRoomInputController.js#L292) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `refreshArenaTouchButtons()` | Método declarado | [304](../src/js/toy-room/ToyRoomInputController.js#L304) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `removeListeners()` | Método declarado | [315](../src/js/toy-room/ToyRoomInputController.js#L315) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomInteraction.js

[Implementação](../src/js/toy-room/ToyRoomInteraction.js). Contratos exportados/reexportados: `ToyRoomInteraction`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | [9](../src/js/toy-room/ToyRoomInteraction.js#L9) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `triggerAction()` | Método declarado | [14](../src/js/toy-room/ToyRoomInteraction.js#L14) | Processa interação contextual da sala: pegar ou entregar ao baú; prioriza espada/combate e não oferece soltura manual. |
| `updateProximity()` | Método declarado | [108](../src/js/toy-room/ToyRoomInteraction.js#L108) | Atualiza disponibilidade de interação antes do movimento e devolve o baú atual. |

## src/js/toy-room/ToyRoomInteractionContext.js

[Implementação](../src/js/toy-room/ToyRoomInteractionContext.js). Contratos exportados/reexportados: `createToyRoomInteractionContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomInteractionContext(room)` | Função | [2](../src/js/toy-room/ToyRoomInteractionContext.js#L2) | Fornece referências atuais e efeitos específicos para as decisões de interação. |
| `ACTION_DEBOUNCE_MS()` | Acessor | [5](../src/js/toy-room/ToyRoomInteractionContext.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ROOM_H()` | Acessor | [9](../src/js/toy-room/ToyRoomInteractionContext.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ROOM_W()` | Acessor | [13](../src/js/toy-room/ToyRoomInteractionContext.js#L13) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arena()` | Acessor | [17](../src/js/toy-room/ToyRoomInteractionContext.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `audio()` | Acessor | [21](../src/js/toy-room/ToyRoomInteractionContext.js#L21) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `battle()` | Acessor | [25](../src/js/toy-room/ToyRoomInteractionContext.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canInteract()` | Acessor | [29](../src/js/toy-room/ToyRoomInteractionContext.js#L29) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canInteract(value)` | Acessor | [33](../src/js/toy-room/ToyRoomInteractionContext.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture()` | Acessor | [37](../src/js/toy-room/ToyRoomInteractionContext.js#L37) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isInputEnabled(...args)` | API/lambda de objeto | [41](../src/js/toy-room/ToyRoomInteractionContext.js#L41) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isNearChest()` | Acessor | [43](../src/js/toy-room/ToyRoomInteractionContext.js#L43) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isNearChest(value)` | Acessor | [47](../src/js/toy-room/ToyRoomInteractionContext.js#L47) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `lastActionTime()` | Acessor | [51](../src/js/toy-room/ToyRoomInteractionContext.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `lastActionTime(value)` | Acessor | [55](../src/js/toy-room/ToyRoomInteractionContext.js#L55) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount()` | Acessor | [59](../src/js/toy-room/ToyRoomInteractionContext.js#L59) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount(value)` | Acessor | [63](../src/js/toy-room/ToyRoomInteractionContext.js#L63) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | [67](../src/js/toy-room/ToyRoomInteractionContext.js#L67) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `spawnConfetti(...args)` | API/lambda de objeto | [71](../src/js/toy-room/ToyRoomInteractionContext.js#L71) | Cria partículas/efeitos no buffer correspondente. |
| `spawnSparkles(...args)` | API/lambda de objeto | [73](../src/js/toy-room/ToyRoomInteractionContext.js#L73) | Cria partículas/efeitos no buffer correspondente. |
| `story()` | Acessor | [75](../src/js/toy-room/ToyRoomInteractionContext.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | [79](../src/js/toy-room/ToyRoomInteractionContext.js#L79) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tutorial()` | Acessor | [83](../src/js/toy-room/ToyRoomInteractionContext.js#L83) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `uiFeedback()` | Acessor | [87](../src/js/toy-room/ToyRoomInteractionContext.js#L87) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive()` | Acessor | [91](../src/js/toy-room/ToyRoomInteractionContext.js#L91) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive(value)` | Acessor | [95](../src/js/toy-room/ToyRoomInteractionContext.js#L95) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer()` | Acessor | [99](../src/js/toy-room/ToyRoomInteractionContext.js#L99) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer(value)` | Acessor | [103](../src/js/toy-room/ToyRoomInteractionContext.js#L103) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomLighting.js

[Implementação](../src/js/toy-room/ToyRoomLighting.js). Contratos exportados/reexportados: `TOY_ROOM_WINDOWS`, `getToyRoomFloorLight`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getToyRoomFloorLight(x, y)` | Função | [13](../src/js/toy-room/ToyRoomLighting.js#L13) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/toy-room/ToyRoomMovement.js

[Implementação](../src/js/toy-room/ToyRoomMovement.js). Contratos exportados/reexportados: `updateToyRoomMovement`, `resolveToyRoomCollisions`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateToyRoomMovement({ player, keysDown, gamepadState, touchState, footstepPuffs, resolveCollisions }, dt)` | Função | [2](../src/js/toy-room/ToyRoomMovement.js#L2) | Aplica prioridade das entradas, peso, orientação, passos e integração da exploração. |
| `resolveToyRoomCollisions({ width, height, furniture }, px, py, r)` | Função | [85](../src/js/toy-room/ToyRoomMovement.js#L85) | Limita a posição e resolve móveis na ordem original, conservando o desempate de penetrações. |

## src/js/toy-room/ToyRoomOrientation.js

[Implementação](../src/js/toy-room/ToyRoomOrientation.js). Contratos exportados/reexportados: `nearestToyGuide`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `nearestToyGuide(player, toys, previous)` | Função | [2](../src/js/toy-room/ToyRoomOrientation.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomPersistence.js

[Implementação](../src/js/toy-room/ToyRoomPersistence.js). Contratos exportados/reexportados: `ToyRoomPersistence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | [4](../src/js/toy-room/ToyRoomPersistence.js#L4) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `snapshot({ includeArena = true } = {})` | Método declarado | [9](../src/js/toy-room/ToyRoomPersistence.js#L9) | Copia exploração, religa carregado por ID e inclui arena/perseguição/jardim/epílogo conforme origem e includeArena. |
| `restore(saved, { preserveArena = false } = {})` | Método declarado | [29](../src/js/toy-room/ToyRoomPersistence.js#L29) | Reaplica exploração e atores, limpa entrada e prioriza jardim, epílogo, perseguição, arena, batalha e tutorial; preserveArena evita reconstrução recursiva. |

## src/js/toy-room/ToyRoomPersistenceContext.js

[Implementação](../src/js/toy-room/ToyRoomPersistenceContext.js). Contratos exportados/reexportados: `createToyRoomPersistenceContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomPersistenceContext(room)` | Função | [2](../src/js/toy-room/ToyRoomPersistenceContext.js#L2) | Adapta campos serializados e retomada dos subsistemas, inclusive após substituição dos atores. |
| `brinq()` | Acessor | [5](../src/js/toy-room/ToyRoomPersistenceContext.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `brinq(value)` | Acessor | [9](../src/js/toy-room/ToyRoomPersistenceContext.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dream()` | Acessor | [15](../src/js/toy-room/ToyRoomPersistenceContext.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dream(value)` | Acessor | [19](../src/js/toy-room/ToyRoomPersistenceContext.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `epilogue()` | Acessor | [25](../src/js/toy-room/ToyRoomPersistenceContext.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `epilogue(value)` | Acessor | [29](../src/js/toy-room/ToyRoomPersistenceContext.js#L29) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arena()` | Acessor | [35](../src/js/toy-room/ToyRoomPersistenceContext.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `battle()` | Acessor | [39](../src/js/toy-room/ToyRoomPersistenceContext.js#L39) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `garden()` | Acessor | [43](../src/js/toy-room/ToyRoomPersistenceContext.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `garden(value)` | Acessor | [47](../src/js/toy-room/ToyRoomPersistenceContext.js#L47) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chase()` | Acessor | [53](../src/js/toy-room/ToyRoomPersistenceContext.js#L53) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chase(value)` | Acessor | [57](../src/js/toy-room/ToyRoomPersistenceContext.js#L57) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraX()` | Acessor | [61](../src/js/toy-room/ToyRoomPersistenceContext.js#L61) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraX(value)` | Acessor | [65](../src/js/toy-room/ToyRoomPersistenceContext.js#L65) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraY()` | Acessor | [69](../src/js/toy-room/ToyRoomPersistenceContext.js#L69) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraY(value)` | Acessor | [73](../src/js/toy-room/ToyRoomPersistenceContext.js#L73) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearInput()` | API/lambda de objeto | [77](../src/js/toy-room/ToyRoomPersistenceContext.js#L77) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `fairy()` | Acessor | [79](../src/js/toy-room/ToyRoomPersistenceContext.js#L79) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fairy(value)` | Acessor | [83](../src/js/toy-room/ToyRoomPersistenceContext.js#L83) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture()` | Acessor | [87](../src/js/toy-room/ToyRoomPersistenceContext.js#L87) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture(value)` | Acessor | [91](../src/js/toy-room/ToyRoomPersistenceContext.js#L91) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState()` | Acessor | [95](../src/js/toy-room/ToyRoomPersistenceContext.js#L95) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState(value)` | Acessor | [99](../src/js/toy-room/ToyRoomPersistenceContext.js#L99) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introAlpha()` | Acessor | [103](../src/js/toy-room/ToyRoomPersistenceContext.js#L103) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introAlpha(value)` | Acessor | [107](../src/js/toy-room/ToyRoomPersistenceContext.js#L107) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introBannerTimer()` | Acessor | [111](../src/js/toy-room/ToyRoomPersistenceContext.js#L111) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introBannerTimer(value)` | Acessor | [115](../src/js/toy-room/ToyRoomPersistenceContext.js#L115) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `lastActionTime()` | Acessor | [119](../src/js/toy-room/ToyRoomPersistenceContext.js#L119) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `lastActionTime(value)` | Acessor | [123](../src/js/toy-room/ToyRoomPersistenceContext.js#L123) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount()` | Acessor | [127](../src/js/toy-room/ToyRoomPersistenceContext.js#L127) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount(value)` | Acessor | [131](../src/js/toy-room/ToyRoomPersistenceContext.js#L131) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | [135](../src/js/toy-room/ToyRoomPersistenceContext.js#L135) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `player(value)` | Acessor | [139](../src/js/toy-room/ToyRoomPersistenceContext.js#L139) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startTutorial()` | API/lambda de objeto | [143](../src/js/toy-room/ToyRoomPersistenceContext.js#L143) | Inicia orientação guiada da Toy Room se ainda não concluída. |
| `story()` | Acessor | [147](../src/js/toy-room/ToyRoomPersistenceContext.js#L147) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted()` | Acessor | [151](../src/js/toy-room/ToyRoomPersistenceContext.js#L151) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted(value)` | Acessor | [155](../src/js/toy-room/ToyRoomPersistenceContext.js#L155) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | [159](../src/js/toy-room/ToyRoomPersistenceContext.js#L159) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys(value)` | Acessor | [163](../src/js/toy-room/ToyRoomPersistenceContext.js#L163) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tutorial()` | Acessor | [167](../src/js/toy-room/ToyRoomPersistenceContext.js#L167) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive()` | Acessor | [171](../src/js/toy-room/ToyRoomPersistenceContext.js#L171) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive(value)` | Acessor | [175](../src/js/toy-room/ToyRoomPersistenceContext.js#L175) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer()` | Acessor | [179](../src/js/toy-room/ToyRoomPersistenceContext.js#L179) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer(value)` | Acessor | [183](../src/js/toy-room/ToyRoomPersistenceContext.js#L183) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomPhase.js

[Implementação](../src/js/toy-room/ToyRoomPhase.js). Contratos exportados/reexportados: `ToyRoomPhase`, `createToyRoom`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, audio, uiFeedback, onReturnToTitle, options = {})` | Método declarado | [104](../src/js/toy-room/ToyRoomPhase.js#L104) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `inputController()` | Acessor | [201](../src/js/toy-room/ToyRoomPhase.js#L201) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setupListeners()` | Método declarado | [209](../src/js/toy-room/ToyRoomPhase.js#L209) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getCanvasCoordinates(e)` | Método declarado | [214](../src/js/toy-room/ToyRoomPhase.js#L214) | Converte evento de ponteiro para coordenadas internas da sala. |
| `isActionButtonHit(coords)` | Método declarado | [219](../src/js/toy-room/ToyRoomPhase.js#L219) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `handleKeyDown(e)` | Método declarado | [224](../src/js/toy-room/ToyRoomPhase.js#L224) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyUp(e)` | Método declarado | [229](../src/js/toy-room/ToyRoomPhase.js#L229) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | [234](../src/js/toy-room/ToyRoomPhase.js#L234) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onPointerDown(e)` | Método declarado | [239](../src/js/toy-room/ToyRoomPhase.js#L239) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerMove(e)` | Método declarado | [244](../src/js/toy-room/ToyRoomPhase.js#L244) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerUp(e)` | Método declarado | [249](../src/js/toy-room/ToyRoomPhase.js#L249) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `clearInput()` | Método declarado | [254](../src/js/toy-room/ToyRoomPhase.js#L254) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `refreshArenaTouchButtons()` | Método declarado | [259](../src/js/toy-room/ToyRoomPhase.js#L259) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `spawnSparkles(x, y, count = 12, hue = '#facc15')` | Método declarado | [264](../src/js/toy-room/ToyRoomPhase.js#L264) | Cria partículas/efeitos no buffer correspondente. |
| `spawnConfetti(x, y, count = 35)` | Método declarado | [269](../src/js/toy-room/ToyRoomPhase.js#L269) | Cria partículas/efeitos no buffer correspondente. |
| `interaction()` | Acessor | [274](../src/js/toy-room/ToyRoomPhase.js#L274) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `triggerAction()` | Método declarado | [280](../src/js/toy-room/ToyRoomPhase.js#L280) | Encaminha ação à exploração somente fora de epílogo, jardim e perseguição. |
| `startChasePreview(saved = null)` | Método declarado | [285](../src/js/toy-room/ToyRoomPhase.js#L285) | Inicia o acesso isolado de debug à perseguição, sem salvar essa fase na campanha. |
| `startChaseCampaign(saved = null)` | Método declarado | [312](../src/js/toy-room/ToyRoomPhase.js#L312) | Prepara a fuga da campanha sob fade, desliga entradas da sala e recupera falhas de preparação. |
| `handleCampaignChaseError(chase, message)` | Método declarado | [353](../src/js/toy-room/ToyRoomPhase.js#L353) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `startEpilogue(saved = null, { campaign = true } = {})` | Método declarado | [375](../src/js/toy-room/ToyRoomPhase.js#L375) | Descarta a perseguição, limpa entrada e inicia o epílogo recuperável; o callback abre o jardim com a mesma origem campanha/prévia. |
| `onComplete()` | API/lambda de objeto | [390](../src/js/toy-room/ToyRoomPhase.js#L390) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGarden(saved = null, { campaign = true } = {})` | Método declarado | [398](../src/js/toy-room/ToyRoomPhase.js#L398) | Encerra epílogo/perseguição, remove entradas da sala e inicia GardenPhase com recursos, física e áudio próprios; conserva a origem campanha/prévia. |
| `startDream(saved = null, { campaign = true } = {})` | Método declarado | [430](../src/js/toy-room/ToyRoomPhase.js#L430) | Descarta modos anteriores, entradas e áudio; abre o sonho2D com a origem campanha/prévia preservada. |
| `startBrinquedao(saved = null, { campaign = true } = {})` | Método declarado | [461](../src/js/toy-room/ToyRoomPhase.js#L461) | Descarta os modos anteriores, conserva a origem da campanha e abre convite e circuito. |
| `resolveCollisions(px, py, r)` | Método declarado | [493](../src/js/toy-room/ToyRoomPhase.js#L493) | Resolve colisões da sala com móveis. |
| `update(dt = 1.0)` | Método declarado | [502](../src/js/toy-room/ToyRoomPhase.js#L502) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateActiveMode(dt)` | Método declarado | [536](../src/js/toy-room/ToyRoomPhase.js#L536) | Seleciona epílogo, jardim, perseguição ou sala; após 150 ticks de COMPLETE abre o epílogo preservando campaign. |
| `resolveCollisions(x, y, radius)` | API/lambda de objeto | [626](../src/js/toy-room/ToyRoomPhase.js#L626) | Resolve colisões da sala com móveis. |
| `setDifficulty(difficulty)` | Método declarado | [660](../src/js/toy-room/ToyRoomPhase.js#L660) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `retryDefeat({ resume = false } = {})` | Método declarado | [676](../src/js/toy-room/ToyRoomPhase.js#L676) | Recupera a fase derrotada; a ajuda preserva o adversário ou percurso atual. |
| `updateCamera(dt)` | Método declarado | [728](../src/js/toy-room/ToyRoomPhase.js#L728) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `getCameraFrame()` | Método declarado | [742](../src/js/toy-room/ToyRoomPhase.js#L742) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `render(options = {})` | Método declarado | [753](../src/js/toy-room/ToyRoomPhase.js#L753) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `startTutorial()` | Método declarado | [791](../src/js/toy-room/ToyRoomPhase.js#L791) | Inicia orientação guiada da Toy Room se ainda não concluída. |
| `persistence()` | Acessor | [796](../src/js/toy-room/ToyRoomPhase.js#L796) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `snapshot(options)` | Método declarado | [802](../src/js/toy-room/ToyRoomPhase.js#L802) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved, options)` | Método declarado | [807](../src/js/toy-room/ToyRoomPhase.js#L807) | Reaplica a captura específica; confira referências e dados transitórios. |
| `destroy()` | Método declarado | [812](../src/js/toy-room/ToyRoomPhase.js#L812) | Descarta os modos posteriores e os recursos/listeners próprios da sala; encerra o epílogo ativo. |
| `createToyRoom(canvas, audio, uiFeedback, onReturnToTitle, options)` | Função | [834](../src/js/toy-room/ToyRoomPhase.js#L834) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `update(dt)` | API/lambda de objeto | [838](../src/js/toy-room/ToyRoomPhase.js#L838) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | API/lambda de objeto | [840](../src/js/toy-room/ToyRoomPhase.js#L840) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `triggerAction()` | API/lambda de objeto | [842](../src/js/toy-room/ToyRoomPhase.js#L842) | Encaminha ação à exploração somente fora de epílogo, jardim e perseguição. |
| `destroy()` | API/lambda de objeto | [844](../src/js/toy-room/ToyRoomPhase.js#L844) | Descarta os modos posteriores e os recursos/listeners próprios da sala; encerra o epílogo ativo. |

## src/js/toy-room/ToyRoomSceneFrame.js

[Implementação](../src/js/toy-room/ToyRoomSceneFrame.js). Contratos exportados/reexportados: `createToyRoomSceneFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomSceneFrame(room)` | Função | [2](../src/js/toy-room/ToyRoomSceneFrame.js#L2) | Monta dados e callbacks atuais para desenhar uma cena da sala. |
| `getCameraFrame()` | API/lambda de objeto | [26](../src/js/toy-room/ToyRoomSceneFrame.js#L26) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/toy-room/ToyRoomSceneRenderer.js

[Implementação](../src/js/toy-room/ToyRoomSceneRenderer.js). Contratos exportados/reexportados: `renderToyRoomScene`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToyRoomScene(scene, options = {})` | Função | [18](../src/js/toy-room/ToyRoomSceneRenderer.js#L18) | Compõe cenário, entidades por Y, efeitos, HUD e falas com os dados do quadro. |

## src/js/toy-room/ToyRoomShadows.js

[Implementação](../src/js/toy-room/ToyRoomShadows.js). Contratos exportados/reexportados: `prepareToyRoomShadows`, `getToyRoomShadowItems`, `renderToyRoomShadows`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `canvas(width, height)` | Função | [24](../src/js/toy-room/ToyRoomShadows.js#L24) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `contactStamp()` | Função | [31](../src/js/toy-room/ToyRoomShadows.js#L31) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `makeCaster(width, height, draw, rootX = 0, rootY = null)` | Função | [46](../src/js/toy-room/ToyRoomShadows.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `store(scene)` | Função | [138](../src/js/toy-room/ToyRoomShadows.js#L138) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `caster(data, scene, type, item)` | Função | [151](../src/js/toy-room/ToyRoomShadows.js#L151) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareToyRoomShadows(assets)` | Função | [189](../src/js/toy-room/ToyRoomShadows.js#L189) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getToyRoomShadowItems(scene)` | Função | [212](../src/js/toy-room/ToyRoomShadows.js#L212) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `renderToyRoomShadows(ctx, scene)` | Função | [231](../src/js/toy-room/ToyRoomShadows.js#L231) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomStory.js

[Implementação](../src/js/toy-room/ToyRoomStory.js). Contratos exportados/reexportados: `createToyRoomStoryState`, `ToyRoomStory`, `drawToySword`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomStoryState()` | Função atribuída | [95](../src/js/toy-room/ToyRoomStory.js#L95) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `distance(a, b)` | Função atribuída | [109](../src/js/toy-room/ToyRoomStory.js#L109) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `outsideViewport(point, viewport, margin = 72)` | Função | [111](../src/js/toy-room/ToyRoomStory.js#L111) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getBeat(beats, elapsed)` | Função | [116](../src/js/toy-room/ToyRoomStory.js#L116) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `constructor({ world, actors, exploration, flow, controls, audio, presentation })` | Método declarado | [128](../src/js/toy-room/ToyRoomStory.js#L128) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `refreshReachablePoints()` | Método declarado | [152](../src/js/toy-room/ToyRoomStory.js#L152) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `recordViewport(frame)` | Método declarado | [160](../src/js/toy-room/ToyRoomStory.js#L160) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onToyStored(toy)` | Método declarado | [165](../src/js/toy-room/ToyRoomStory.js#L165) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [187](../src/js/toy-room/ToyRoomStory.js#L187) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateReturns(dt)` | Método declarado | [225](../src/js/toy-room/ToyRoomStory.js#L225) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `beginInvestigation()` | Método declarado | [259](../src/js/toy-room/ToyRoomStory.js#L259) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateInvestigation(dt)` | Método declarado | [284](../src/js/toy-room/ToyRoomStory.js#L284) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateSwordGuide()` | Método declarado | [324](../src/js/toy-room/ToyRoomStory.js#L324) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateAfterMovement()` | Método declarado | [335](../src/js/toy-room/ToyRoomStory.js#L335) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `clearInput()` | Método declarado | [350](../src/js/toy-room/ToyRoomStory.js#L350) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `inputLocked()` | Acessor | [355](../src/js/toy-room/ToyRoomStory.js#L355) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `swordEquipped()` | Acessor | [361](../src/js/toy-room/ToyRoomStory.js#L361) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attack()` | Método declarado | [366](../src/js/toy-room/ToyRoomStory.js#L366) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canCollectToys()` | Acessor | [375](../src/js/toy-room/ToyRoomStory.js#L375) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `guidePosition()` | Método declarado | [380](../src/js/toy-room/ToyRoomStory.js#L380) | Retorna posição visual da fada acima do brinquedo-alvo do tutorial. |
| `cameraTarget()` | Método declarado | [398](../src/js/toy-room/ToyRoomStory.js#L398) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderWorldObject(ctx)` | Método declarado | [410](../src/js/toy-room/ToyRoomStory.js#L410) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderAttackSprite(ctx)` | Método declarado | [415](../src/js/toy-room/ToyRoomStory.js#L415) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderHeldObject(ctx)` | Método declarado | [425](../src/js/toy-room/ToyRoomStory.js#L425) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `advanceDialogue()` | Método declarado | [435](../src/js/toy-room/ToyRoomStory.js#L435) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `narrativeBeat()` | Método declarado | [454](../src/js/toy-room/ToyRoomStory.js#L454) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderNarrative(ctx, canvas)` | Método declarado | [478](../src/js/toy-room/ToyRoomStory.js#L478) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryBeat(ctx, canvas, beat)` | Método declarado | [484](../src/js/toy-room/ToyRoomStory.js#L484) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `restore(saved)` | Método declarado | [493](../src/js/toy-room/ToyRoomStory.js#L493) | Reaplica a captura específica; confira referências e dados transitórios. |
| `snapshot()` | Método declarado | [514](../src/js/toy-room/ToyRoomStory.js#L514) | Produz captura recuperável do estado específico deste componente. |

## src/js/toy-room/ToyRoomStoryContext.js

[Implementação](../src/js/toy-room/ToyRoomStoryContext.js). Contratos exportados/reexportados: `createToyRoomStoryContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomStoryContext(room)` | Função | [12](../src/js/toy-room/ToyRoomStoryContext.js#L12) | Restringe a narrativa a mundo, atores, exploração, fluxo, controles, áudio e apresentação. |
| `getDimensions()` | API/lambda de objeto | [16](../src/js/toy-room/ToyRoomStoryContext.js#L16) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getPlayer()` | API/lambda de objeto | [21](../src/js/toy-room/ToyRoomStoryContext.js#L21) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `resolvePosition(x, y, radius)` | API/lambda de objeto | [23](../src/js/toy-room/ToyRoomStoryContext.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getCameraFrame()` | API/lambda de objeto | [25](../src/js/toy-room/ToyRoomStoryContext.js#L25) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getCameraBounds()` | API/lambda de objeto | [27](../src/js/toy-room/ToyRoomStoryContext.js#L27) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `player()` | Acessor | [36](../src/js/toy-room/ToyRoomStoryContext.js#L36) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `fairy()` | Acessor | [40](../src/js/toy-room/ToyRoomStoryContext.js#L40) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `difficulty()` | Acessor | [44](../src/js/toy-room/ToyRoomStoryContext.js#L44) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | [50](../src/js/toy-room/ToyRoomStoryContext.js#L50) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture()` | Acessor | [54](../src/js/toy-room/ToyRoomStoryContext.js#L54) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `returnToy(toy, point)` | Método declarado | [58](../src/js/toy-room/ToyRoomStoryContext.js#L58) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `releaseCarriedToy()` | Método declarado | [64](../src/js/toy-room/ToyRoomStoryContext.js#L64) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tutorialActive()` | Acessor | [73](../src/js/toy-room/ToyRoomStoryContext.js#L73) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introductionActive()` | Acessor | [77](../src/js/toy-room/ToyRoomStoryContext.js#L77) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clear()` | Método declarado | [83](../src/js/toy-room/ToyRoomStoryContext.js#L83) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPickup()` | Método declarado | [99](../src/js/toy-room/ToyRoomStoryContext.js#L99) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `useSwordTrack()` | Método declarado | [103](../src/js/toy-room/ToyRoomStoryContext.js#L103) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `assets()` | Acessor | [109](../src/js/toy-room/ToyRoomStoryContext.js#L109) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mobile()` | Acessor | [113](../src/js/toy-room/ToyRoomStoryContext.js#L113) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomStoryRenderer.js

[Implementação](../src/js/toy-room/ToyRoomStoryRenderer.js). Contratos exportados/reexportados: `createStoryAttackFrames`, `drawToySword`, `renderStoryWorldObject`, `renderStoryAttackSprite`, `renderStoryHeldObject`, `renderStoryBeat`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createStoryAttackFrames(assets)` | Função | [23](../src/js/toy-room/ToyRoomStoryRenderer.js#L23) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `drawToySword(ctx, x, y, angle, scale = 1)` | Função | [40](../src/js/toy-room/ToyRoomStoryRenderer.js#L40) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryWorldObject(ctx, state)` | Função | [72](../src/js/toy-room/ToyRoomStoryRenderer.js#L72) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryAttackSprite(ctx, { state, player, attackFrames, attackDuration })` | Função | [76](../src/js/toy-room/ToyRoomStoryRenderer.js#L76) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryHeldObject(ctx, { state, player, attackFrames, attackDuration })` | Função | [109](../src/js/toy-room/ToyRoomStoryRenderer.js#L109) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryBeat(ctx, canvas, beat, { mobile, assets, tick })` | Função | [154](../src/js/toy-room/ToyRoomStoryRenderer.js#L154) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

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
| `constructor(context)` | Método declarado | [14](../src/js/toy-room/ToyRoomTutorial.js#L14) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `start()` | Método declarado | [23](../src/js/toy-room/ToyRoomTutorial.js#L23) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `setDevice(device)` | Método declarado | [35](../src/js/toy-room/ToyRoomTutorial.js#L35) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `nearest()` | Método declarado | [39](../src/js/toy-room/ToyRoomTutorial.js#L39) | Seleciona brinquedo elegível mais próximo do jogador para orientar coleta. |
| `finish()` | Método declarado | [45](../src/js/toy-room/ToyRoomTutorial.js#L45) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | [52](../src/js/toy-room/ToyRoomTutorial.js#L52) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `guidePosition()` | Método declarado | [71](../src/js/toy-room/ToyRoomTutorial.js#L71) | Retorna posição visual da fada acima do brinquedo-alvo do tutorial. |
| `message()` | Acessor | [80](../src/js/toy-room/ToyRoomTutorial.js#L80) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(ctx, canvas, frame)` | Método declarado | [96](../src/js/toy-room/ToyRoomTutorial.js#L96) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomTutorialContext.js

[Implementação](../src/js/toy-room/ToyRoomTutorialContext.js). Contratos exportados/reexportados: `createToyRoomTutorialContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomTutorialContext(room)` | Função | [4](../src/js/toy-room/ToyRoomTutorialContext.js#L4) | Expõe oito campos atuais ao tutorial; setters somente para conclusão e modo. |
| `mobilePresentation()` | Acessor | [7](../src/js/toy-room/ToyRoomTutorialContext.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | [11](../src/js/toy-room/ToyRoomTutorialContext.js#L11) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `fairy()` | Acessor | [15](../src/js/toy-room/ToyRoomTutorialContext.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | [19](../src/js/toy-room/ToyRoomTutorialContext.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraX()` | Acessor | [23](../src/js/toy-room/ToyRoomTutorialContext.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraY()` | Acessor | [27](../src/js/toy-room/ToyRoomTutorialContext.js#L27) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted()` | Acessor | [31](../src/js/toy-room/ToyRoomTutorialContext.js#L31) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted(value)` | Acessor | [35](../src/js/toy-room/ToyRoomTutorialContext.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState()` | Acessor | [39](../src/js/toy-room/ToyRoomTutorialContext.js#L39) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState(value)` | Acessor | [43](../src/js/toy-room/ToyRoomTutorialContext.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomTutorialRenderer.js

[Implementação](../src/js/toy-room/ToyRoomTutorialRenderer.js). Contratos exportados/reexportados: `renderToyRoomTutorial`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToyRoomTutorial(ctx, canvas, frame, { fairy, cameraX, cameraY, message, step, device })` | Função | [9](../src/js/toy-room/ToyRoomTutorialRenderer.js#L9) | Desenha mensagens e ponteiro da orientação sem receber tutorial nem sala. |

## src/js/toy-room/ToyRoomUI.js

[Implementação](../src/js/toy-room/ToyRoomUI.js). Contratos exportados/reexportados: `ToyRoomUI`, `toyRoomUI`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderUI(ctx, canvas, state)` | Método declarado | [25](../src/js/toy-room/ToyRoomUI.js#L25) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomWorldQueries.js

[Implementação](../src/js/toy-room/ToyRoomWorldQueries.js). Contratos exportados/reexportados: `createToyRoomWorldQueries`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomWorldQueries({ getDimensions, getPlayer, resolvePosition, getCameraFrame, getCameraBounds })` | Função | [2](../src/js/toy-room/ToyRoomWorldQueries.js#L2) | Cria consultas de piso/viewport com acessos explícitos às referências atuais. |
| `distance(a, b)` | Função atribuída | [9](../src/js/toy-room/ToyRoomWorldQueries.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isFree(point, radius = 24)` | Função | [12](../src/js/toy-room/ToyRoomWorldQueries.js#L12) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `reachableFloor()` | Função | [17](../src/js/toy-room/ToyRoomWorldQueries.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `viewport(frame = getCameraFrame())` | Função | [67](../src/js/toy-room/ToyRoomWorldQueries.js#L67) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

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
| `drawPortrait(pCtx, charType, px, py, radius, mood = 'normal', tick = 0, options = {})` | Método declarado | [48](../src/js/ui/DialogueRenderer.js#L48) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapText(pCtx, text, maxWidth)` | Método declarado | [270](../src/js/ui/DialogueRenderer.js#L270) | Quebra texto conforme a largura medida pelo contexto. |
| `renderCutsceneDialogue(ctx, canvas, state = {}, options = {})` | Método declarado | [300](../src/js/ui/DialogueRenderer.js#L300) | Compõe falas, retratos, prompts e áreas seguras. |
| `renderDialogue(ctx, canvas, dialogue, options = {})` | Método declarado | [423](../src/js/ui/DialogueRenderer.js#L423) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialoguePortrait(pCtx, charType, px, py, radius, expression)` | Função atribuída | [432](../src/js/ui/DialogueRenderer.js#L432) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapDialogueText(pCtx, text, maxWidth)` | Função atribuída | [434](../src/js/ui/DialogueRenderer.js#L434) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/ui/DialogueSafeArea.js

[Implementação](../src/js/ui/DialogueSafeArea.js). Contratos exportados/reexportados: `intersectCanvasSafeArea`, `getDialogueSafeArea`, `getDialogueBoxY`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `intersectCanvasSafeArea(canvas, rect, viewport, insets = {})` | Função | [8](../src/js/ui/DialogueSafeArea.js#L8) | Converte interseção viewport/canvas e insets em coordenadas do bitmap. |
| `getDialogueSafeArea(canvas)` | Função | [25](../src/js/ui/DialogueSafeArea.js#L25) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDialogueBoxY(safe, height, originalMargin, anchor = {}, mobile = isMobileDevice())` | Função | [62](../src/js/ui/DialogueSafeArea.js#L62) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/ui/FirstJumpTutorial.js

[Implementação](../src/js/ui/FirstJumpTutorial.js). Contratos exportados/reexportados: `renderDarkRoomTouchHint`, `FIRST_JUMP_MESSAGES`, `getFirstJumpTutorialDevice`, `getFirstJumpFeedback`, `renderFirstJumpTutorial`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderDarkRoomTouchHint(ctx, canvas, state)` | Função | [12](../src/js/ui/FirstJumpTutorial.js#L12) | Desenha indicação de pulo no rodapé móvel sem restringir a área de entrada nem duplicar o tutorial inicial. |
| `getFirstJumpTutorialDevice({ device, nav = globalThis.navigator, coarse } = {})` | Função | [44](../src/js/ui/FirstJumpTutorial.js#L44) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getFirstJumpFeedback(timeMs, reducedMotion = false)` | Função | [64](../src/js/ui/FirstJumpTutorial.js#L64) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `drawInputIcon(ctx, kind, x, y, unit, pulse)` | Função | [73](../src/js/ui/FirstJumpTutorial.js#L73) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFirstJumpTutorial(ctx, canvas, { state, baby, fairy, platform, cameraX, transform, device, timeMs = globalThis.performance?.now?.() \|\| 0, reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)') ?.matches \|\| false })` | Função | [141](../src/js/ui/FirstJumpTutorial.js#L141) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `project(x, y)` | Função atribuída | [164](../src/js/ui/FirstJumpTutorial.js#L164) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/ui/HudRenderer.js

[Implementação](../src/js/ui/HudRenderer.js). Contratos exportados/reexportados: `HudRenderer`, `hudRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderEscapeBanner(ctx, canvas, state = {}, cameraX = 0, baby = {})` | Método declarado | [25](../src/js/ui/HudRenderer.js#L25) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/ui/MobileDialogueRegion.js

[Implementação](../src/js/ui/MobileDialogueRegion.js). Contratos exportados/reexportados: `getMobileDialogueRegions`, `renderMobileDialogueRegion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getMobileDialogueRegions(safe, contentHeight, placement = 'bottom')` | Função | [8](../src/js/ui/MobileDialogueRegion.js#L8) | Divide a área segura entre cena e painel de texto. |
| `renderMobileDialogueRegion(ctx, canvas, safe, contentHeight, anchor = {}, placement = 'bottom')` | Função | [53](../src/js/ui/MobileDialogueRegion.js#L53) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/ui/MobileUILayout.js

[Implementação](../src/js/ui/MobileUILayout.js). Contratos exportados/reexportados: `calculateMobileUILayout`, `getMobileUILayout`, `isActionControlHit`, `arenaMobileControlsLayout`, `hitArenaMobileControl`, `arenaDirectionVector`, `attachMobileUILayout`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | [8](../src/js/ui/MobileUILayout.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `calculateMobileUILayout(canvas, safe, scale = 1, mobile = true)` | Função | [11](../src/js/ui/MobileUILayout.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `contains(x, y)` | API/lambda de objeto | [44](../src/js/ui/MobileUILayout.js#L44) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `joystickOrigin(x, y)` | API/lambda de objeto | [48](../src/js/ui/MobileUILayout.js#L48) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getMobileUILayout(canvas)` | Função | [55](../src/js/ui/MobileUILayout.js#L55) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isActionControlHit(layout, x, y)` | Função | [61](../src/js/ui/MobileUILayout.js#L61) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `arenaMobileControlsLayout(layout)` | Função | [66](../src/js/ui/MobileUILayout.js#L66) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `hitArenaMobileControl(layout, x, y)` | Função | [127](../src/js/ui/MobileUILayout.js#L127) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaDirectionVector(layout, x, y)` | Função | [147](../src/js/ui/MobileUILayout.js#L147) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attachMobileUILayout(canvas, host = window)` | Função | [165](../src/js/ui/MobileUILayout.js#L165) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update()` | Função atribuída | [166](../src/js/ui/MobileUILayout.js#L166) | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/ui/TitleScene.js

[Implementação](../src/js/ui/TitleScene.js). Contratos exportados/reexportados: `TITLE_SCENE_LAYOUT`, `titleSceneFrame`, `TitleScene`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `titleSceneFrame(width, height)` | Função | [13](../src/js/ui/TitleScene.js#L13) | Calcula uma câmera comum para o quarto da tela inicial, com foco na menina no retrato e poltrona fixa no tapete. |
| `constructor(canvas, overlay)` | Método declarado | [27](../src/js/ui/TitleScene.js#L27) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [49](../src/js/ui/TitleScene.js#L49) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sync()` | Método declarado | [68](../src/js/ui/TitleScene.js#L68) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tick(time)` | Método declarado | [78](../src/js/ui/TitleScene.js#L78) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `leg(ctx, source, knee, angle, scale, origin)` | Método declarado | [86](../src/js/ui/TitleScene.js#L86) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(time)` | Método declarado | [96](../src/js/ui/TitleScene.js#L96) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [146](../src/js/ui/TitleScene.js#L146) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/ui/TitleScreen.js

[Implementação](../src/js/ui/TitleScreen.js). Contratos exportados/reexportados: `TitleScreen`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ game, onNew, onLoad })` | Método declarado | [8](../src/js/ui/TitleScreen.js#L8) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `refresh()` | Método declarado | [53](../src/js/ui/TitleScreen.js#L53) | Atualiza disponibilidade de Carregar jogo a partir do save efetivo sem mudar a dificuldade escolhida. |
| `setEasy(enabled)` | Método declarado | [64](../src/js/ui/TitleScreen.js#L64) | Configura somente a próxima aventura; carregar mantém a dificuldade do save. |
| `requestNew()` | Método declarado | [72](../src/js/ui/TitleScreen.js#L72) | Abre confirmação se há progresso; cancelar preserva o save. |
| `navigate(event)` | Método declarado | [83](../src/js/ui/TitleScreen.js#L83) | Move foco com setas entre opções habilitadas e impede propagação ao jogo. |
| `activateFocused()` | Método declarado | [93](../src/js/ui/TitleScreen.js#L93) | Aciona o botão focado pelo gamepad sem atravessar os diálogos do menu. |

## src/js/ui/TouchGameControls.js

[Implementação](../src/js/ui/TouchGameControls.js). Contratos exportados/reexportados: `mobileGameControls`, `drawMobileGameControls`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `mobileGameControls(canvas, safe)` | Função | [2](../src/js/ui/TouchGameControls.js#L2) | Distribui oito direções em células contíguas de pelo menos56CSS e salto de96CSS. |
| `drawMobileGameControls(ctx, canvas, controls, { dark = false, jumpLabel = 'PULAR' } = {})` | Função | [55](../src/js/ui/TouchGameControls.js#L55) | Desenha D-pad unido, setas diagonais e salto respeitando a área segura. |

## src/js/ui/index.js

[Implementação](../src/js/ui/index.js). Contratos exportados/reexportados: `HudRenderer`, `hudRenderer`, `DialogueRenderer`, `dialogueRenderer`, `renderFirstJumpTutorial`, `getFirstJumpFeedback`, `getFirstJumpTutorialDevice`, `FIRST_JUMP_MESSAGES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

Inventário: **236 módulos JavaScript**, **1514 declarações nomeadas**.
