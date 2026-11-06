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

## src/js/assets/girlLocomotionArt.js

[Implementação](../src/js/assets/girlLocomotionArt.js). Contratos exportados/reexportados: `GIRL_LOCOMOTION_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

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
| `createAudioSystem()` | Função | [7](../src/js/audio.js#L7) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `getDestination()` | Função | [21](../src/js/audio.js#L21) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `updateMusicVolumes()` | Função | [39](../src/js/audio.js#L39) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `setMasterVolume(vol)` | Função | [53](../src/js/audio.js#L53) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | Função | [66](../src/js/audio.js#L66) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(muted)` | Função | [71](../src/js/audio.js#L71) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `toggleMute()` | Função | [88](../src/js/audio.js#L88) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getIsMuted()` | Função | [93](../src/js/audio.js#L93) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `registerActiveNode(node)` | Função | [104](../src/js/audio.js#L104) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cleanup()` | Função atribuída | [107](../src/js/audio.js#L107) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearActiveSounds()` | Função | [116](../src/js/audio.js#L116) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMusicTrack()` | Função | [130](../src/js/audio.js#L130) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `initAudio()` | Função | [169](../src/js/audio.js#L169) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startMusic()` | Função | [196](../src/js/audio.js#L196) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopMusic()` | Função | [217](../src/js/audio.js#L217) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stopAllAudio()` | Função | [228](../src/js/audio.js#L228) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playJumpSound()` | Função | [235](../src/js/audio.js#L235) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLongJumpSound(progress = 0)` | Função | [243](../src/js/audio.js#L243) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLevelUpChime(level = 0)` | Função | [248](../src/js/audio.js#L248) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOpeningAmbience()` | Função | [273](../src/js/audio.js#L273) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyVoiceBlip(freq = 920)` | Função | [295](../src/js/audio.js#L295) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyLaugh()` | Função | [319](../src/js/audio.js#L319) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playEscapePowerUp()` | Função | [348](../src/js/audio.js#L348) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFallFailSound()` | Função | [376](../src/js/audio.js#L376) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playTapeRipSound()` | Função | [400](../src/js/audio.js#L400) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDramaticTumbleSound()` | Função | [436](../src/js/audio.js#L436) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPlayerThudSound()` | Função | [461](../src/js/audio.js#L461) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPlayerShockVoice()` | Função | [485](../src/js/audio.js#L485) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyFrustratedSound()` | Função | [511](../src/js/audio.js#L511) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPhase3StartFanfare()` | Função | [536](../src/js/audio.js#L536) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `getToyRoomTrackUrls(track)` | Função | [568](../src/js/audio.js#L568) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getToyRoomAudioElement()` | Função | [579](../src/js/audio.js#L579) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setToyRoomMusicTrack(track)` | Função | [621](../src/js/audio.js#L621) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `startToyRoomMusic({ fade = 1 } = {})` | Função | [644](../src/js/audio.js#L644) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `setToyRoomMusicFade(value)` | Função | [673](../src/js/audio.js#L673) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setToyRoomMusicIntensity(value)` | Função | [679](../src/js/audio.js#L679) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPortalExitWhoosh()` | Função | [685](../src/js/audio.js#L685) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playSoftMagicBurst()` | Função | [725](../src/js/audio.js#L725) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopToyRoomMusic()` | Função | [754](../src/js/audio.js#L754) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | Função | [766](../src/js/audio.js#L766) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | Função | [785](../src/js/audio.js#L785) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playPickUpSound()` | Função | [802](../src/js/audio.js#L802) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDropSound()` | Função | [828](../src/js/audio.js#L828) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOrganizeChime()` | Função | [852](../src/js/audio.js#L852) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playToyRoomVictory()` | Função | [879](../src/js/audio.js#L879) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playCombatSound(event, arena = false)` | Função | [933](../src/js/audio.js#L933) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playArenaMusicBeat(beat)` | Função | [1050](../src/js/audio.js#L1050) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopArenaMusic()` | Função | [1082](../src/js/audio.js#L1082) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playArenaSound(event)` | API/lambda de objeto | [1165](../src/js/audio.js#L1165) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `getAudioContext()` | API/lambda de objeto | [1181](../src/js/audio.js#L1181) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/audio/GameSoundEffects.js

[Implementação](../src/js/audio/GameSoundEffects.js). Contratos exportados/reexportados: `GAME_SOUNDS`, `preloadGameSounds`, `GameSoundEffects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `preloadGameSounds(ctx, names = Object.keys(GAME_SOUNDS))` | Função | [11](../src/js/audio/GameSoundEffects.js#L11) | Decodifica WAVs fornecidos uma vez por contexto, sem enfileirar reprodução atrasada. |
| `constructor()` | Método declarado | [47](../src/js/audio/GameSoundEffects.js#L47) | Cria o conjunto limitado de vozes de efeitos gravados. |
| `play(ctx, destination, name, { volume = 0.65, rate = 1, loop = false, channel = null, pan = 0 } = {},)` | Método declarado | [54](../src/js/audio/GameSoundEffects.js#L54) | Reproduz uma amostra já decodificada com ganho, taxa, canal e panorâmica. |
| `update(channel, volume, pan = 0, rate = 1)` | Método declarado | [99](../src/js/audio/GameSoundEffects.js#L99) | Atualiza ganho, panorâmica e taxa de uma voz ativa cancelando rampas anteriores. |
| `stop(channel = null, fade = 0)` | Método declarado | [109](../src/js/audio/GameSoundEffects.js#L109) | Encerra canais imediatamente ou com fade e libera suas conexões. |

## src/js/audio/insectSoundscape.js

[Implementação](../src/js/audio/insectSoundscape.js). Contratos exportados/reexportados: `insectEmitters`, `audibleInsects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `insectEmitters(state, scene = 'garden')` | Função | [3](../src/js/audio/insectSoundscape.js#L3) | Consulta corpos e estados de voo de abelhas e besouros no jardim ou sonho. |
| `audibleInsects(state, scene)` | Função | [41](../src/js/audio/insectSoundscape.js#L41) | Seleciona até três emissores por distância, energia de voo e panorâmica. |

## src/js/bear-chase/BearChasePhase.js

[Implementação](../src/js/bear-chase/BearChasePhase.js). Contratos exportados/reexportados: `BearChasePhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ canvas, audio, enabled, difficulty = 'NORMAL', campaign = false, onCampaignError = null, })` | Método declarado | [11](../src/js/bear-chase/BearChasePhase.js#L11) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `active()` | Acessor | [42](../src/js/bear-chase/BearChasePhase.js#L42) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `start(saved = null)` | Método declarado | [46](../src/js/bear-chase/BearChasePhase.js#L46) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | [77](../src/js/bear-chase/BearChasePhase.js#L77) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [123](../src/js/bear-chase/BearChasePhase.js#L123) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `setPaused(value)` | Método declarado | [174](../src/js/bear-chase/BearChasePhase.js#L174) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `retry({ resume = false } = {})` | Método declarado | [181](../src/js/bear-chase/BearChasePhase.js#L181) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `snapshot()` | Método declarado | [204](../src/js/bear-chase/BearChasePhase.js#L204) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [213](../src/js/bear-chase/BearChasePhase.js#L213) | Reaplica a captura específica; confira referências e dados transitórios. |
| `destroy()` | Método declarado | [225](../src/js/bear-chase/BearChasePhase.js#L225) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseAudio.js

[Implementação](../src/js/bear-chase/ChaseAudio.js). Contratos exportados/reexportados: `ChaseAudio`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(audio)` | Método declarado | [8](../src/js/bear-chase/ChaseAudio.js#L8) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `unlock()` | Método declarado | [31](../src/js/bear-chase/ChaseAudio.js#L31) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `step(actor, gap)` | Método declarado | [55](../src/js/bear-chase/ChaseAudio.js#L55) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(state)` | Método declarado | [81](../src/js/bear-chase/ChaseAudio.js#L81) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `stopSteps()` | Método declarado | [125](../src/js/bear-chase/ChaseAudio.js#L125) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Método declarado | [136](../src/js/bear-chase/ChaseAudio.js#L136) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [144](../src/js/bear-chase/ChaseAudio.js#L144) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [151](../src/js/bear-chase/ChaseAudio.js#L151) | Reaplica a captura específica; confira referências e dados transitórios. |
| `seek()` | Função atribuída | [153](../src/js/bear-chase/ChaseAudio.js#L153) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [165](../src/js/bear-chase/ChaseAudio.js#L165) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseBearAnimation.js

[Implementação](../src/js/bear-chase/ChaseBearAnimation.js). Contratos exportados/reexportados: `ChaseBearAnimation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(model)` | Método declarado | [6](../src/js/bear-chase/ChaseBearAnimation.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `legPose(leg, z, footY, hipHeight)` | Método declarado | [11](../src/js/bear-chase/ChaseBearAnimation.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state)` | Método declarado | [24](../src/js/bear-chase/ChaseBearAnimation.js#L24) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseBearModel.js

[Implementação](../src/js/bear-chase/ChaseBearModel.js). Contratos exportados/reexportados: `ChaseBearModel`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(own, texture)` | Método declarado | [7](../src/js/bear-chase/ChaseBearModel.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `joint(parent, name, x, y, z)` | Método declarado | [129](../src/js/bear-chase/ChaseBearModel.js#L129) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `volume(parent, region, position, scale, tint = '#ffffff', rotation = [0, 0, 0])` | Método declarado | [138](../src/js/bear-chase/ChaseBearModel.js#L138) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `seam(parent, points, radius)` | Método declarado | [147](../src/js/bear-chase/ChaseBearModel.js#L147) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ribbon(parent, side)` | Método declarado | [153](../src/js/bear-chase/ChaseBearModel.js#L153) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `collect(parent, source, region, tint)` | Método declarado | [184](../src/js/bear-chase/ChaseBearModel.js#L184) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `bake()` | Método declarado | [218](../src/js/bear-chase/ChaseBearModel.js#L218) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state)` | Método declarado | [244](../src/js/bear-chase/ChaseBearModel.js#L244) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseFairyModel.js

[Implementação](../src/js/bear-chase/ChaseFairyModel.js). Contratos exportados/reexportados: `ChaseFairyModel`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(own)` | Método declarado | [7](../src/js/bear-chase/ChaseFairyModel.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `wingGeometry()` | Método declarado | [110](../src/js/bear-chase/ChaseFairyModel.js#L110) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `flightOffset(time, target)` | Método declarado | [155](../src/js/bear-chase/ChaseFairyModel.js#L155) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state, girlModel)` | Método declarado | [166](../src/js/bear-chase/ChaseFairyModel.js#L166) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseGirlAnimation.js

[Implementação](../src/js/bear-chase/ChaseGirlAnimation.js). Contratos exportados/reexportados: `ChaseGirlAnimation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(model)` | Método declarado | [7](../src/js/bear-chase/ChaseGirlAnimation.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `legPose(leg, z, y)` | Método declarado | [21](../src/js/bear-chase/ChaseGirlAnimation.js#L21) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(state)` | Método declarado | [59](../src/js/bear-chase/ChaseGirlAnimation.js#L59) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fall(state)` | Método declarado | [154](../src/js/bear-chase/ChaseGirlAnimation.js#L154) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseGirlModel.js

[Implementação](../src/js/bear-chase/ChaseGirlModel.js). Contratos exportados/reexportados: `ChaseGirlModel`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(own)` | Método declarado | [7](../src/js/bear-chase/ChaseGirlModel.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `batchDetails(parent)` | Método declarado | [155](../src/js/bear-chase/ChaseGirlModel.js#L155) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `shade(geometry)` | Método declarado | [188](../src/js/bear-chase/ChaseGirlModel.js#L188) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `joint(parent, name, x, y, z)` | Método declarado | [203](../src/js/bear-chase/ChaseGirlModel.js#L203) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `volume(parent, material, position, scale)` | Método declarado | [211](../src/js/bear-chase/ChaseGirlModel.js#L211) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `limb(parent, material, length, end, start)` | Método declarado | [219](../src/js/bear-chase/ChaseGirlModel.js#L219) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildSleeve(parent)` | Método declarado | [240](../src/js/bear-chase/ChaseGirlModel.js#L240) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cloth(parent, material, profile, full)` | Método declarado | [265](../src/js/bear-chase/ChaseGirlModel.js#L265) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `silhouette(parent, material, points, depth, position)` | Método declarado | [321](../src/js/bear-chase/ChaseGirlModel.js#L321) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sweep(parent, material, points, radii)` | Método declarado | [349](../src/js/bear-chase/ChaseGirlModel.js#L349) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildHair()` | Método declarado | [384](../src/js/bear-chase/ChaseGirlModel.js#L384) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `curveFringe(mesh)` | Método declarado | [548](../src/js/bear-chase/ChaseGirlModel.js#L548) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `bow(parent, position, size)` | Método declarado | [555](../src/js/bear-chase/ChaseGirlModel.js#L555) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildDressDetails()` | Método declarado | [584](../src/js/bear-chase/ChaseGirlModel.js#L584) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildFace()` | Método declarado | [620](../src/js/bear-chase/ChaseGirlModel.js#L620) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `buildSword()` | Método declarado | [669](../src/js/bear-chase/ChaseGirlModel.js#L669) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseInput.js

[Implementação](../src/js/bear-chase/ChaseInput.js). Contratos exportados/reexportados: `ChaseInput`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, enabled, unlock)` | Método declarado | [6](../src/js/bear-chase/ChaseInput.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `install()` | Método declarado | [20](../src/js/bear-chase/ChaseInput.js#L20) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onKeyDown(event)` | Método declarado | [36](../src/js/bear-chase/ChaseInput.js#L36) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onKeyUp(event)` | Método declarado | [45](../src/js/bear-chase/ChaseInput.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onPointer(event)` | Método declarado | [49](../src/js/bear-chase/ChaseInput.js#L49) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onRelease(event)` | Método declarado | [61](../src/js/bear-chase/ChaseInput.js#L61) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sample()` | Método declarado | [65](../src/js/bear-chase/ChaseInput.js#L65) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clear()` | Método declarado | [92](../src/js/bear-chase/ChaseInput.js#L92) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `destroy()` | Método declarado | [104](../src/js/bear-chase/ChaseInput.js#L104) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseIntroRenderer.js

[Implementação](../src/js/bear-chase/ChaseIntroRenderer.js). Contratos exportados/reexportados: `isChaseIntro`, `chaseIntroFade`, `ChaseIntroRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `isChaseIntro(stage)` | Função | [17](../src/js/bear-chase/ChaseIntroRenderer.js#L17) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `chaseIntroFade(state)` | Função | [22](../src/js/bear-chase/ChaseIntroRenderer.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor()` | Método declarado | [32](../src/js/bear-chase/ChaseIntroRenderer.js#L32) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [40](../src/js/bear-chase/ChaseIntroRenderer.js#L40) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `measureFrames(image, columns = [0, 490 / 1774, 920 / 1774, 1340 / 1774, 1], rows = [0, 505 / 887, 1],)` | Método declarado | [60](../src/js/bear-chase/ChaseIntroRenderer.js#L60) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `picture(ctx, key, x, bottom, height)` | Método declarado | [124](../src/js/bear-chase/ChaseIntroRenderer.js#L124) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `backdrop(ctx, w, h)` | Método declarado | [131](../src/js/bear-chase/ChaseIntroRenderer.js#L131) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `floor(ctx, w, h, horizon, unit)` | Método declarado | [152](../src/js/bear-chase/ChaseIntroRenderer.js#L152) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actor(ctx, index, x, baseline, height, first, reaching = false)` | Método declarado | [175](../src/js/bear-chase/ChaseIntroRenderer.js#L175) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pose(canvas, state)` | Método declarado | [195](../src/js/bear-chase/ChaseIntroRenderer.js#L195) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(ctx, canvas, state)` | Método declarado | [254](../src/js/bear-chase/ChaseIntroRenderer.js#L254) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [312](../src/js/bear-chase/ChaseIntroRenderer.js#L312) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseLighting.js

[Implementação](../src/js/bear-chase/ChaseLighting.js). Contratos exportados/reexportados: `ChaseLighting`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(owner)` | Método declarado | [28](../src/js/bear-chase/ChaseLighting.js#L28) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `windowMask()` | Método declarado | [117](../src/js/bear-chase/ChaseLighting.js#L117) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resize(portrait)` | Método declarado | [144](../src/js/bear-chase/ChaseLighting.js#L144) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `place(light, s, x, height, targetS, targetX, targetHeight = 0)` | Método declarado | [171](../src/js/bear-chase/ChaseLighting.js#L171) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(state, portrait)` | Método declarado | [196](../src/js/bear-chase/ChaseLighting.js#L196) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `prepareObject(root)` | Método declarado | [250](../src/js/bear-chase/ChaseLighting.js#L250) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dispose()` | Método declarado | [263](../src/js/bear-chase/ChaseLighting.js#L263) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/ChaseRenderer3D.js

[Implementação](../src/js/bear-chase/ChaseRenderer3D.js). Contratos exportados/reexportados: `ChaseRenderer3D`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `imageFile(path)` | Função | [20](../src/js/bear-chase/ChaseRenderer3D.js#L20) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor()` | Método declarado | [36](../src/js/bear-chase/ChaseRenderer3D.js#L36) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `own(resource)` | Método declarado | [66](../src/js/bear-chase/ChaseRenderer3D.js#L66) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `texture(image, crop = null)` | Método declarado | [71](../src/js/bear-chase/ChaseRenderer3D.js#L71) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `plasterTexture()` | Método declarado | [88](../src/js/bear-chase/ChaseRenderer3D.js#L88) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `floorTexture(image)` | Método declarado | [123](../src/js/bear-chase/ChaseRenderer3D.js#L123) | Prepara o recorte de madeira em DataTexture RGBA 256×64, com nove mipmaps explícitos e orientação preservada. |
| `floorIsVisible()` | Método declarado | [167](../src/js/bear-chase/ChaseRenderer3D.js#L167) | Renderiza uma amostra do piso fora da tela e confere o sinal de madeira na GPU. |
| `prepareFloor()` | Método declarado | [197](../src/js/bear-chase/ChaseRenderer3D.js#L197) | Valida o piso e tenta a mesma arte com filtro linear sem mipmaps quando necessário. |
| `prepareVisualResources()` | Método declarado | [216](../src/js/bear-chase/ChaseRenderer3D.js#L216) | Envia todos os mapas à GPU e aguarda compilação dos materiais antes de liberar a corrida. |
| `material(texture, color = '#ffffff')` | Método declarado | [234](../src/js/bear-chase/ChaseRenderer3D.js#L234) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mesh(parent, geometry, material, x, y, z)` | Método declarado | [246](../src/js/bear-chase/ChaseRenderer3D.js#L246) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actor(texture, width, height)` | Método declarado | [253](../src/js/bear-chase/ChaseRenderer3D.js#L253) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `load()` | Método declarado | [266](../src/js/bear-chase/ChaseRenderer3D.js#L266) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareRoomResources()` | Método declarado | [374](../src/js/bear-chase/ChaseRenderer3D.js#L374) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `placeOnRoute(object, distance, lateral, height = 0, alignSlope = false)` | Método declarado | [390](../src/js/bear-chase/ChaseRenderer3D.js#L390) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateToys(state)` | Método declarado | [399](../src/js/bear-chase/ChaseRenderer3D.js#L399) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render(ctx, canvas, state)` | Método declarado | [439](../src/js/bear-chase/ChaseRenderer3D.js#L439) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `presentCamera(state, portrait)` | Método declarado | [488](../src/js/bear-chase/ChaseRenderer3D.js#L488) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [501](../src/js/bear-chase/ChaseRenderer3D.js#L501) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/bear-chase/ChaseRoom.js

[Implementação](../src/js/bear-chase/ChaseRoom.js). Contratos exportados/reexportados: `ChaseRoom`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(owner)` | Método declarado | [7](../src/js/bear-chase/ChaseRoom.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `surface(material, l0, h0, l1, h1, name)` | Método declarado | [46](../src/js/bear-chase/ChaseRoom.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `add(object, s, lateral, yaw, height = 0, rug = false)` | Método declarado | [73](../src/js/bear-chase/ChaseRoom.js#L73) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(distance)` | Método declarado | [90](../src/js/bear-chase/ChaseRoom.js#L90) | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/bear-chase/ChaseToyModels.js

[Implementação](../src/js/bear-chase/ChaseToyModels.js). Contratos exportados/reexportados: `ChaseToyModels`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(catalog)` | Método declarado | [4](../src/js/bear-chase/ChaseToyModels.js#L4) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `train()` | Método declarado | [8](../src/js/bear-chase/ChaseToyModels.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/chaseCamera.js

[Implementação](../src/js/bear-chase/chaseCamera.js). Contratos exportados/reexportados: `chaseCameraFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `chaseCameraFrame(state, portrait, aspect)` | Função | [10](../src/js/bear-chase/chaseCamera.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/chaseConfig.js

[Implementação](../src/js/bear-chase/chaseConfig.js). Contratos exportados/reexportados: `CHASE_CONFIG`, `clamp`, `damp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, low, high)` | Função | [28](../src/js/bear-chase/chaseConfig.js#L28) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `damp(from, to, speed, dt)` | Função | [33](../src/js/bear-chase/chaseConfig.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/chaseGirlPalette.js

[Implementação](../src/js/bear-chase/chaseGirlPalette.js). Contratos exportados/reexportados: `GIRL_PALETTE`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/bear-chase/chaseHUD.js

[Implementação](../src/js/bear-chase/chaseHUD.js). Contratos exportados/reexportados: `renderChaseHUD`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderLives(ctx, w, ui, state, difficulty)` | Função | [14](../src/js/bear-chase/chaseHUD.js#L14) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderChaseHUD(ctx, canvas, state, error, audioError, difficulty = 'NORMAL')` | Função | [39](../src/js/bear-chase/chaseHUD.js#L39) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/bear-chase/chaseHealth.js

[Implementação](../src/js/bear-chase/chaseHealth.js). Contratos exportados/reexportados: `CHASE_FALL_DURATION`, `chaseMaxLives`, `chaseLives`, `isChaseDefeat`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `chaseMaxLives(difficulty = 'NORMAL')` | Função | [5](../src/js/bear-chase/chaseHealth.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chaseLives(state, difficulty = 'NORMAL')` | Função | [10](../src/js/bear-chase/chaseHealth.js#L10) | Deriva as vidas restantes dos impactos e do limite da dificuldade. |
| `isChaseDefeat(stage)` | Função | [15](../src/js/bear-chase/chaseHealth.js#L15) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/bear-chase/chasePacing.js

[Implementação](../src/js/bear-chase/chasePacing.js). Contratos exportados/reexportados: `smoothProgress`, `chaseIntensity`, `chasePacing`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smoothProgress(value)` | Função | [4](../src/js/bear-chase/chasePacing.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chaseIntensity(distance)` | Função | [10](../src/js/bear-chase/chasePacing.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chasePacing(distance, difficulty = 'NORMAL')` | Função | [19](../src/js/bear-chase/chasePacing.js#L19) | Deriva ritmo por progresso/dificuldade e fixa pares a cada segundo no final do NORMAL. |

## src/js/bear-chase/chasePatterns.js

[Implementação](../src/js/bear-chase/chasePatterns.js). Contratos exportados/reexportados: `chasePattern`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `chasePattern(progress, difficulty, safeLane)` | Função | [4](../src/js/bear-chase/chasePatterns.js#L4) | Distribui brinquedos por progresso e dificuldade; no NORMAL usa até três objetos e pares finais com corredor amplo. |

## src/js/bear-chase/chaseRoute.js

[Implementação](../src/js/bear-chase/chaseRoute.js). Contratos exportados/reexportados: `ROUTE_NODES`, `routeFrame`, `routePoint`, `ROUTE_AMBUSHES`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `coordinate(s, axis)` | Função | [20](../src/js/bear-chase/chaseRoute.js#L20) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `routeFrame(s)` | Função | [40](../src/js/bear-chase/chaseRoute.js#L40) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `routePoint(s, lateral = 0, height = 0)` | Função | [58](../src/js/bear-chase/chaseRoute.js#L58) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/chaseSimulation.js

[Implementação](../src/js/bear-chase/chaseSimulation.js). Contratos exportados/reexportados: `createChaseState`, `restoreChaseState`, `hitsObstacle`, `stepChase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createChaseState()` | Função | [20](../src/js/bear-chase/chaseSimulation.js#L20) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `restoreChaseState(saved)` | Função | [51](../src/js/bear-chase/chaseSimulation.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `random(state)` | Função | [110](../src/js/bear-chase/chaseSimulation.js#L110) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `hitsObstacle(obstacle, fromX, toX, fromZ, toZ)` | Função | [116](../src/js/bear-chase/chaseSimulation.js#L116) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dropPattern(state, events, pacing, speed, ambushZ = null, difficulty = 'NORMAL')` | Função | [129](../src/js/bear-chase/chaseSimulation.js#L129) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `followFairy(state, dt)` | Função | [174](../src/js/bear-chase/chaseSimulation.js#L174) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `advanceStage(state, events)` | Função | [182](../src/js/bear-chase/chaseSimulation.js#L182) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stepChase(state, input, dt = C.step, difficulty = 'NORMAL')` | Função | [202](../src/js/bear-chase/chaseSimulation.js#L202) | Avança o domínio em segundos: sequência, movimento, colisão, vidas, lançamentos e eventos. |

## src/js/bear-chase/props/BlockCastleProp.js

[Implementação](../src/js/bear-chase/props/BlockCastleProp.js). Contratos exportados/reexportados: `BlockCastleProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [7](../src/js/bear-chase/props/BlockCastleProp.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `centralWall(parts, orange, yellow, green)` | Método declarado | [46](../src/js/bear-chase/props/BlockCastleProp.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `portal(parts, material, position, width, height, depth, radius, openingHeight)` | Método declarado | [82](../src/js/bear-chase/props/BlockCastleProp.js#L82) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | [105](../src/js/bear-chase/props/BlockCastleProp.js#L105) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/BlocksProp.js

[Implementação](../src/js/bear-chase/props/BlocksProp.js). Contratos exportados/reexportados: `BlocksProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [7](../src/js/bear-chase/props/BlocksProp.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | [36](../src/js/bear-chase/props/BlocksProp.js#L36) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/BookshelfProp.js

[Implementação](../src/js/bear-chase/props/BookshelfProp.js). Contratos exportados/reexportados: `BookshelfProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [6](../src/js/bear-chase/props/BookshelfProp.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | [38](../src/js/bear-chase/props/BookshelfProp.js#L38) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/BunnyProp.js

[Implementação](../src/js/bear-chase/props/BunnyProp.js). Contratos exportados/reexportados: `BunnyProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [7](../src/js/bear-chase/props/BunnyProp.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `ellipsoid(parts, material, position, scale, tilt = 0)` | Método declarado | [40](../src/js/bear-chase/props/BunnyProp.js#L40) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | [46](../src/js/bear-chase/props/BunnyProp.js#L46) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/ChasePropCatalog.js

[Implementação](../src/js/bear-chase/props/ChasePropCatalog.js). Contratos exportados/reexportados: `ChasePropCatalog`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(images, externalResources = null)` | Método declarado | [15](../src/js/bear-chase/props/ChasePropCatalog.js#L15) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `register(id, factory, reference, rotation = 0, scale = 1)` | Método declarado | [58](../src/js/bear-chase/props/ChasePropCatalog.js#L58) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create(id)` | Método declarado | [84](../src/js/bear-chase/props/ChasePropCatalog.js#L84) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `release(root)` | Método declarado | [91](../src/js/bear-chase/props/ChasePropCatalog.js#L91) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dispose()` | Método declarado | [95](../src/js/bear-chase/props/ChasePropCatalog.js#L95) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/ChasePropResources.js

[Implementação](../src/js/bear-chase/props/ChasePropResources.js). Contratos exportados/reexportados: `ChasePropResources`, `PropParts`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(woodImage, externalResources = null, pictorialImages = {})` | Método declarado | [7](../src/js/bear-chase/props/ChasePropResources.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `own(resource)` | Método declarado | [16](../src/js/bear-chase/props/ChasePropResources.js#L16) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `woodTexture(painted)` | Método declarado | [22](../src/js/bear-chase/props/ChasePropResources.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fabricTexture(image)` | Método declarado | [42](../src/js/bear-chase/props/ChasePropResources.js#L42) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `material(name, color, wood = false, texture = null)` | Método declarado | [61](../src/js/bear-chase/props/ChasePropResources.js#L61) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pictorialMaterial(asset, region, tint = '#ffffff')` | Método declarado | [80](../src/js/bear-chase/props/ChasePropResources.js#L80) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fabricRegion(image)` | Método declarado | [121](../src/js/bear-chase/props/ChasePropResources.js#L121) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `bake(parts, name, combineAtlas = false)` | Método declarado | [142](../src/js/bear-chase/props/ChasePropResources.js#L142) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `combinedMaterial(source)` | Método declarado | [194](../src/js/bear-chase/props/ChasePropResources.js#L194) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dispose()` | Método declarado | [213](../src/js/bear-chase/props/ChasePropResources.js#L213) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor()` | Método declarado | [229](../src/js/bear-chase/props/ChasePropResources.js#L229) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `add(geometry, material, position, rotation = [0, 0, 0])` | Método declarado | [233](../src/js/bear-chase/props/ChasePropResources.js#L233) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `box(material, position, size, radius = 0.015)` | Método declarado | [243](../src/js/bear-chase/props/ChasePropResources.js#L243) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cylinder(material, position, top, bottom, height, rotation = [0, 0, 0], segments = 20, axialGrain = false,)` | Método declarado | [281](../src/js/bear-chase/props/ChasePropResources.js#L281) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ring(material, position, radius, tube, rotation = [0, 0, 0])` | Método declarado | [302](../src/js/bear-chase/props/ChasePropResources.js#L302) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/OakCabinetProp.js

[Implementação](../src/js/bear-chase/props/OakCabinetProp.js). Contratos exportados/reexportados: `OakCabinetProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [6](../src/js/bear-chase/props/OakCabinetProp.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | [51](../src/js/bear-chase/props/OakCabinetProp.js#L51) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/ToyChestProp.js

[Implementação](../src/js/bear-chase/props/ToyChestProp.js). Contratos exportados/reexportados: `ToyChestProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [7](../src/js/bear-chase/props/ToyChestProp.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `sidePanel(parts, material, x)` | Método declarado | [58](../src/js/bear-chase/props/ToyChestProp.js#L58) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `inscription(resources)` | Método declarado | [81](../src/js/bear-chase/props/ToyChestProp.js#L81) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | [117](../src/js/bear-chase/props/ToyChestProp.js#L117) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/TrainProp.js

[Implementação](../src/js/bear-chase/props/TrainProp.js). Contratos exportados/reexportados: `TrainProp`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(resources)` | Método declarado | [6](../src/js/bear-chase/props/TrainProp.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `create()` | Método declarado | [56](../src/js/bear-chase/props/TrainProp.js#L56) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/decorativeGeometry.js

[Implementação](../src/js/bear-chase/props/decorativeGeometry.js). Contratos exportados/reexportados: `oval`, `profile`, `rounded`, `curve`, `rod`, `outline`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `oval(p, m, at, size, rotation = [0, 0, 0])` | Função | [4](../src/js/bear-chase/props/decorativeGeometry.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `profile(p, m, shape, depth, at = [0, 0, 0], bevel = 0.012)` | Função | [10](../src/js/bear-chase/props/decorativeGeometry.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rounded(p, m, at, size, radius = 0.05, bevel = 0.012)` | Função | [41](../src/js/bear-chase/props/decorativeGeometry.js#L41) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `curve(p, m, points, radius = 0.012, closed = false)` | Função | [60](../src/js/bear-chase/props/decorativeGeometry.js#L60) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rod(p, m, a, b, r = 0.018)` | Função | [69](../src/js/bear-chase/props/decorativeGeometry.js#L69) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `outline(commands)` | Função | [80](../src/js/bear-chase/props/decorativeGeometry.js#L80) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/bear-chase/props/decorativeProps.js

[Implementação](../src/js/bear-chase/props/decorativeProps.js). Contratos exportados/reexportados: `decorativeFactories`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `teddy(p, m)` | Função | [6](../src/js/bear-chase/props/decorativeProps.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `robot(p, m)` | Função | [51](../src/js/bear-chase/props/decorativeProps.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `duck(p, m)` | Função | [93](../src/js/bear-chase/props/decorativeProps.js#L93) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drum(p, m)` | Função | [138](../src/js/bear-chase/props/decorativeProps.js#L138) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `jack(p, m)` | Função | [161](../src/js/bear-chase/props/decorativeProps.js#L161) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `armchair(p, m)` | Função | [234](../src/js/bear-chase/props/decorativeProps.js#L234) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `horse(p, m)` | Função | [305](../src/js/bear-chase/props/decorativeProps.js#L305) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `table(p, m)` | Função | [406](../src/js/bear-chase/props/decorativeProps.js#L406) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `decorativeFactories(resources)` | Função | [426](../src/js/bear-chase/props/decorativeProps.js#L426) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mat(region, tint)` | Função atribuída | [427](../src/js/bear-chase/props/decorativeProps.js#L427) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `create()` | Método declarado | [485](../src/js/bear-chase/props/decorativeProps.js#L485) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/bear-chase/props/pictorialMaterialAssets.js

[Implementação](../src/js/bear-chase/props/pictorialMaterialAssets.js). Contratos exportados/reexportados: `PICTORIAL_ATLASES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/bear-chase/props/pilotPropResources.js

[Implementação](../src/js/bear-chase/props/pilotPropResources.js). Contratos exportados/reexportados: `PilotPropResources`, `PropParts`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/brinquedao/BrinquedaoAudio.js

[Implementação](../src/js/brinquedao/BrinquedaoAudio.js). Contratos exportados/reexportados: `BrinquedaoAudio`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(host)` | Método declarado | [5](../src/js/brinquedao/BrinquedaoAudio.js#L5) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `update(state, paused = false)` | Método declarado | [12](../src/js/brinquedao/BrinquedaoAudio.js#L12) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateWings()` | Método declarado | [19](../src/js/brinquedao/BrinquedaoAudio.js#L19) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `event(type)` | Método declarado | [23](../src/js/brinquedao/BrinquedaoAudio.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/brinquedao/BrinquedaoLook.js

[Implementação](../src/js/brinquedao/BrinquedaoLook.js). Contratos exportados/reexportados: `BRINQUEDAO_LOOK_THEMES`, `BrinquedaoLook`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `canvas(w, h)` | Função | [32](../src/js/brinquedao/BrinquedaoLook.js#L32) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rounded(ctx, x, y, w, h, r, fill)` | Função | [39](../src/js/brinquedao/BrinquedaoLook.js#L39) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor(images, parts, inside)` | Método declarado | [48](../src/js/brinquedao/BrinquedaoLook.js#L48) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `copy(source)` | Método declarado | [89](../src/js/brinquedao/BrinquedaoLook.js#L89) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `grade(source, wash, inside)` | Método declarado | [96](../src/js/brinquedao/BrinquedaoLook.js#L96) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareFragile(part)` | Método declarado | [116](../src/js/brinquedao/BrinquedaoLook.js#L116) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareTube(source)` | Método declarado | [150](../src/js/brinquedao/BrinquedaoLook.js#L150) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `focus(ctx, pose, diameter)` | Método declarado | [165](../src/js/brinquedao/BrinquedaoLook.js#L165) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `block(ctx, image, x, y, w, index, age)` | Método declarado | [176](../src/js/brinquedao/BrinquedaoLook.js#L176) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `triangle(ctx, image, t, floor)` | Método declarado | [216](../src/js/brinquedao/BrinquedaoLook.js#L216) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `joint(ctx, x, y, angle = 0, launch = false)` | Método declarado | [250](../src/js/brinquedao/BrinquedaoLook.js#L250) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [292](../src/js/brinquedao/BrinquedaoLook.js#L292) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/brinquedao/BrinquedaoPhase.js

[Implementação](../src/js/brinquedao/BrinquedaoPhase.js). Contratos exportados/reexportados: `BrinquedaoPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ canvas, audio, enabled = () => true, difficulty = 'NORMAL', campaign = false })` | Método declarado | [15](../src/js/brinquedao/BrinquedaoPhase.js#L15) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `active()` | Acessor | [41](../src/js/brinquedao/BrinquedaoPhase.js#L41) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reading()` | Método declarado | [45](../src/js/brinquedao/BrinquedaoPhase.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `advanceDialogue()` | Método declarado | [54](../src/js/brinquedao/BrinquedaoPhase.js#L54) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `start(saved = null)` | Método declarado | [64](../src/js/brinquedao/BrinquedaoPhase.js#L64) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt = 1)` | Método declarado | [82](../src/js/brinquedao/BrinquedaoPhase.js#L82) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [98](../src/js/brinquedao/BrinquedaoPhase.js#L98) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `onAdvance()` | API/lambda de objeto | [109](../src/js/brinquedao/BrinquedaoPhase.js#L109) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Método declarado | [113](../src/js/brinquedao/BrinquedaoPhase.js#L113) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [119](../src/js/brinquedao/BrinquedaoPhase.js#L119) | Produz captura recuperável do estado específico deste componente. |
| `retry()` | Método declarado | [127](../src/js/brinquedao/BrinquedaoPhase.js#L127) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [133](../src/js/brinquedao/BrinquedaoPhase.js#L133) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/brinquedao/BrinquedaoRenderer.js

[Implementação](../src/js/brinquedao/BrinquedaoRenderer.js). Contratos exportados/reexportados: `BrinquedaoRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas)` | Método declarado | [44](../src/js/brinquedao/BrinquedaoRenderer.js#L44) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [54](../src/js/brinquedao/BrinquedaoRenderer.js#L54) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `backdrop(s, frame)` | Método declarado | [91](../src/js/brinquedao/BrinquedaoRenderer.js#L91) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `controls()` | Método declarado | [133](../src/js/brinquedao/BrinquedaoRenderer.js#L133) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(s, touch = false)` | Método declarado | [137](../src/js/brinquedao/BrinquedaoRenderer.js#L137) | Calcula pose visual estável sem escrever na simulação. |
| `girl(ctx, s)` | Método declarado | [165](../src/js/brinquedao/BrinquedaoRenderer.js#L165) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(s, { ready = true, error = null, paused = false, touch = false, onAdvance = () => {} } = {},)` | Método declarado | [207](../src/js/brinquedao/BrinquedaoRenderer.js#L207) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [397](../src/js/brinquedao/BrinquedaoRenderer.js#L397) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/brinquedao/brinquedaoArt.js

[Implementação](../src/js/brinquedao/brinquedaoArt.js). Contratos exportados/reexportados: `BRINQUEDAO_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/brinquedao/brinquedaoAttractions.js

[Implementação](../src/js/brinquedao/brinquedaoAttractions.js). Contratos exportados/reexportados: `prepareBrinquedaoAttractions`, `drawBrinquedaoCastles`, `drawBrinquedaoSpring`, `drawBrinquedaoElastic`, `drawBrinquedaoSideMats`, `drawBrinquedaoBridgeFish`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `prepareBrinquedaoAttractions(image)` | Função | [7](../src/js/brinquedao/brinquedaoAttractions.js#L7) | Extrai as quatro pinturas completas e mede o contorno da rampa sem sobrescrever PNGs. |
| `drawBrinquedaoCastles(ctx, parts, left, right)` | Função | [33](../src/js/brinquedao/brinquedaoAttractions.js#L33) | Compõe torres acolchoadas sob seus terraços físicos. |
| `drawBrinquedaoSpring(ctx, image, p, s)` | Função | [43](../src/js/brinquedao/brinquedaoAttractions.js#L43) | Deforma a lona pelo relógio persistido do impacto, mantendo os pés físicos independentes. |
| `drawBrinquedaoElastic(ctx, parts, s, left, right)` | Função | [56](../src/js/brinquedao/brinquedaoAttractions.js#L56) | Compõe o painel oblíquo e seu recuo após contato. |
| `drawBrinquedaoSideMats(ctx, parts, s, left, right)` | Função | [70](../src/js/brinquedao/brinquedaoAttractions.js#L70) | Gira as lonas pintadas nas extremidades das calhas e apresenta compressão por impacto. |
| `drawBrinquedaoBridgeFish(ctx, parts, s, left, right, bottom = 0)` | Função | [96](../src/js/brinquedao/brinquedaoAttractions.js#L96) | Desenha investidas curtas perto de Yuna; a pose é compartilhada com o contato físico. |

## src/js/brinquedao/brinquedaoCinematic.js

[Implementação](../src/js/brinquedao/brinquedaoCinematic.js). Contratos exportados/reexportados: `drawBrinquedaoGirl`, `drawBrinquedaoFairy`, `renderBrinquedaoCinematic`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smooth(t)` | Função atribuída | [6](../src/js/brinquedao/brinquedaoCinematic.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawBrinquedaoGirl(ctx, images, index, x, base, height, { flip = 1, tilt = 0, time = 0, seat = false } = {},)` | Função | [11](../src/js/brinquedao/brinquedaoCinematic.js#L11) | Apresenta a atuação completa com escala comum, pés e máscara da prancha. |
| `drawBrinquedaoFairy(ctx, image, x, y, height, time)` | Função | [36](../src/js/brinquedao/brinquedaoCinematic.js#L36) | Compõe Nanda em tamanho habitual com batimento das asas. |
| `renderBrinquedaoCinematic(ctx, canvas, s, images, onAdvance)` | Função | [79](../src/js/brinquedao/brinquedaoCinematic.js#L79) | Compõe piquenique, convite e jardim com enquadramento narrativo e leitura segura. |

## src/js/brinquedao/brinquedaoExtension.js

[Implementação](../src/js/brinquedao/brinquedaoExtension.js). Contratos exportados/reexportados: `BRINQUEDAO_EXTENSION_TRACKS`, `BRINQUEDAO_ELASTIC`, `brinquedaoDeathY`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `add(id, from, to, y, end, kind, extra = {})` | Função atribuída | [3](../src/js/brinquedao/brinquedaoExtension.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `brinquedaoDeathY(x)` | Função | [74](../src/js/brinquedao/brinquedaoExtension.js#L74) | Retorna o limite inferior de queda da região baixa ou dos castelos altos. |

## src/js/brinquedao/brinquedaoFish.js

[Implementação](../src/js/brinquedao/brinquedaoFish.js). Contratos exportados/reexportados: `BRINQUEDAO_FISH_ATTACK`, `brinquedaoFishSpecs`, `updateBrinquedaoFishAttack`, `brinquedaoFishPose`, `brinquedaoFishTouches`, `brinquedaoFishImpactAge`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `brinquedaoFishSpecs(bridge)` | Função | [13](../src/js/brinquedao/brinquedaoFish.js#L13) | Define dois pontos fixos de ataque por ponte. |
| `updateBrinquedaoFishAttack(s)` | Função | [26](../src/js/brinquedao/brinquedaoFish.js#L26) | Dispara a investida quando Yuna se aproxima e trava o alvo até o fim do salto. |
| `brinquedaoFishPose(spec, time, depth = 1600, attack = null)` | Função | [76](../src/js/brinquedao/brinquedaoFish.js#L76) | Calcula o salto curto e o alvo travado no lançamento. |
| `brinquedaoFishTouches(player, fish)` | Função | [111](../src/js/brinquedao/brinquedaoFish.js#L111) | Testa contato do corpo do peixe somente na janela ativa da investida. |
| `brinquedaoFishImpactAge(s)` | Função | [117](../src/js/brinquedao/brinquedaoFish.js#L117) | Consulta o tempo desde o golpe para arremesso, proteção e rotação do corpo. |

## src/js/brinquedao/brinquedaoGauntlet.js

[Implementação](../src/js/brinquedao/brinquedaoGauntlet.js). Contratos exportados/reexportados: `BRINQUEDAO_GAUNTLET`, `BRINQUEDAO_REBOUNDS`, `brinquedaoBlockSolid`, `brinquedaoTriangleTouches`, `brinquedaoReboundPose`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `brinquedaoBlockSolid(i, index, time, difficulty = 'NORMAL')` | Função | [37](../src/js/brinquedao/brinquedaoGauntlet.js#L37) | Consulta a onda de queda pelo relógio salvo e prazo do bloco. |
| `brinquedaoTriangleTouches(p)` | Função | [45](../src/js/brinquedao/brinquedaoGauntlet.js#L45) | Testa tronco/pés contra o perfil triangular visível. |
| `brinquedaoReboundPose(index, u)` | Função | [55](../src/js/brinquedao/brinquedaoGauntlet.js#L55) | Liga duas lonas pelo voo automático, independente dos controles. |

## src/js/brinquedao/brinquedaoInterior.js

[Implementação](../src/js/brinquedao/brinquedaoInterior.js). Contratos exportados/reexportados: `createBrinquedaoInterior`, `beginBrinquedaoInterior`, `retryBrinquedaoInterior`, `stepBrinquedaoInterior`, `validateBrinquedaoInterior`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(v, a, b)` | Função atribuída | [9](../src/js/brinquedao/brinquedaoInterior.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `body()` | Função atribuída | [10](../src/js/brinquedao/brinquedaoInterior.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createBrinquedaoInterior()` | Função | [21](../src/js/brinquedao/brinquedaoInterior.js#L21) | Cria os quatro tubos, corpo da corrida e relógios dos desafios, sem peixes internos. |
| `beginBrinquedaoInterior(s)` | Função | [37](../src/js/brinquedao/brinquedaoInterior.js#L37) | Encerra o movimento externo e abre o primeiro tubo antes da chegada. |
| `enterTube(i, leg)` | Função | [46](../src/js/brinquedao/brinquedaoInterior.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retryBrinquedaoInterior(s)` | Função | [56](../src/js/brinquedao/brinquedaoInterior.js#L56) | Retoma o terceiro tubo após a queda dos blocos. |
| `finish(s, events)` | Função | [63](../src/js/brinquedao/brinquedaoInterior.js#L63) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stepBrinquedaoInterior(s, input, seconds)` | Função | [82](../src/js/brinquedao/brinquedaoInterior.js#L82) | Alterna curvas rápidas e piscinas manuais, integrando dano, proteção e conclusão. |
| `validateBrinquedaoInterior(s)` | Função | [218](../src/js/brinquedao/brinquedaoInterior.js#L218) | Confere referências, relógios, corpo, dano e compatibilidade do estágio salvo. |

## src/js/brinquedao/brinquedaoInteriorRenderer.js

[Implementação](../src/js/brinquedao/brinquedaoInteriorRenderer.js). Contratos exportados/reexportados: `prepareBrinquedaoInterior`, `drawBrinquedaoInteriorDoor`, `renderBrinquedaoInterior`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `crops(image, set)` | Função | [22](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareBrinquedaoInterior(images)` | Função | [39](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L39) | Recorta módulos de tubo e peixes completos em canvases reutilizáveis. |
| `drawBrinquedaoInteriorDoor(ctx, parts, kit)` | Função | [46](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L46) | Desenha a entrada acolchoada no antigo terraço final. |
| `pad(ctx, r, from, to, y)` | Função | [61](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L61) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `column(ctx, r, x, top, bottom)` | Função | [73](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L73) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `portal(ctx, r, x, floor, incoming, shaft = true)` | Função | [77](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L77) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `block(ctx, r, x, y, w, index, age)` | Função | [96](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L96) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `triangle(ctx, r)` | Função | [108](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L108) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `finishGate(ctx, r)` | Função | [112](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L112) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `reboundRoom(ctx, r, preview = false)` | Função | [139](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L139) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `room(ctx, r, i, index, preview = false)` | Função | [162](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L162) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tubeQuad(ctx, image, sx, sw, corners)` | Função | [206](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L206) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tube(ctx, r, index, center, worldW, worldH, front = false)` | Função | [232](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L232) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderBrinquedaoInterior(r, s, { touch = false, paused = false, onAdvance = () => {} } = {},)` | Função | [257](../src/js/brinquedao/brinquedaoInteriorRenderer.js#L257) | Compõe tubos translúcidos, piscinas em camadas, peixes, corações e controles. |

## src/js/brinquedao/brinquedaoLevel.js

[Implementação](../src/js/brinquedao/brinquedaoLevel.js). Contratos exportados/reexportados: `BRINQUEDAO`, `BRINQUEDAO_TRACKS`, `BRINQUEDAO_STEPS`, `BRINQUEDAO_FOUNDATIONS`, `BRINQUEDAO_BY_ID`, `BRINQUEDAO_CHECKPOINTS`, `BRINQUEDAO_SECTIONS`, `brinquedaoSurface`, `brinquedaoFoundationY`, `brinquedaoSupports`, `validateBrinquedaoStructure`, `brinquedaoSlope`, `brinquedaoMainAt`, `brinquedaoNearby`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `brinquedaoSurface(p, x)` | Função | [137](../src/js/brinquedao/brinquedaoLevel.js#L137) | Consulta a altura do apoio e curvas com tangentes suaves nas extremidades. |
| `brinquedaoFoundationY(x)` | Função | [148](../src/js/brinquedao/brinquedaoLevel.js#L148) | Consulta a altura da faixa de fundação para um apoio. |
| `springSupportSides(p)` | Função | [154](../src/js/brinquedao/brinquedaoLevel.js#L154) | Resolve os lados de apoio configurados para cada lona, preservando ambos por padrão. |
| `supportAnchors(p)` | Função | [166](../src/js/brinquedao/brinquedaoLevel.js#L166) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `brinquedaoSupports(p)` | Função | [210](../src/js/brinquedao/brinquedaoLevel.js#L210) | Gera os apoios configurados por lado em cada estrutura e elimina os que um percurso sobreposto colocaria no vão central de uma ponte. |
| `validateBrinquedaoStructure()` | Função | [234](../src/js/brinquedao/brinquedaoLevel.js#L234) | Valida apoios configurados, conexões contínuas, atalhos, degraus coincidentes e tangentes suaves nas curvas. |
| `brinquedaoSlope(p, x)` | Função | [308](../src/js/brinquedao/brinquedaoLevel.js#L308) | Mede inclinação local para gravidade tangencial e pose da descida. |
| `brinquedaoMainAt(x)` | Função | [311](../src/js/brinquedao/brinquedaoLevel.js#L311) | Localiza a pista principal correspondente à coordenada horizontal. |
| `brinquedaoNearby(left, right)` | Função | [314](../src/js/brinquedao/brinquedaoLevel.js#L314) | Seleciona estruturas visíveis sem alterar sua simulação. |

## src/js/brinquedao/brinquedaoObstacles.js

[Implementação](../src/js/brinquedao/brinquedaoObstacles.js). Contratos exportados/reexportados: `createBrinquedaoObstacles`, `brinquedaoBridgeSolid`, `contactBrinquedao`, `hitBrinquedaoElastic`, `launchBrinquedaoSky`, `validateBrinquedaoObstacles`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createBrinquedaoObstacles()` | Função | [6](../src/js/brinquedao/brinquedaoObstacles.js#L6) | Cria relógios de pontes/lonas e contagens de impacto sem recursos de apresentação. |
| `brinquedaoBridgeSolid(s, p)` | Função | [41](../src/js/brinquedao/brinquedaoObstacles.js#L41) | Consulta se a peça ainda oferece apoio após contato, incluindo tolerância EASY. |
| `contactBrinquedao(s, track, events)` | Função | [49](../src/js/brinquedao/brinquedaoObstacles.js#L49) | Registra apoio, ativa ponte ou aplica impulso descendente da lona, com reforço por PULAR. |
| `hitBrinquedaoElastic(s, previous, events)` | Função | [77](../src/js/brinquedao/brinquedaoObstacles.js#L77) | Exige cruzamento e altura do painel lateral para transferir energia à rampa. |
| `launchBrinquedaoSky(s, events)` | Função | [103](../src/js/brinquedao/brinquedaoObstacles.js#L103) | Converte a saída real do lábio em velocidade horizontal e vertical, liberando controle aéreo. |
| `validateBrinquedaoObstacles(s)` | Função | [118](../src/js/brinquedao/brinquedaoObstacles.js#L118) | Confere referências e relógios de contato, rejeitando apoio em ponte caída. |

## src/js/brinquedao/brinquedaoRecovery.js

[Implementação](../src/js/brinquedao/brinquedaoRecovery.js). Contratos exportados/reexportados: `BRINQUEDAO_RECOVERY_TRACKS`, `BRINQUEDAO_SIDE_MATS`, `brinquedaoOutletReady`, `brinquedaoOutletFlight`, `brinquedaoRicochetAge`, `hitBrinquedaoSideMat`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `add(id, from, to, y, end, kind, extra = {})` | Função atribuída | [4](../src/js/brinquedao/brinquedaoRecovery.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `brinquedaoOutletReady(s, group)` | Função | [79](../src/js/brinquedao/brinquedaoRecovery.js#L79) | Consulta a abertura da saída após duas rebatidas da calha. |
| `brinquedaoOutletFlight(s)` | Função | [83](../src/js/brinquedao/brinquedaoRecovery.js#L83) | Consulta o breve lançamento até a lona, preservando impulso e permitindo frenagem. |
| `brinquedaoRicochetAge(s)` | Função | [97](../src/js/brinquedao/brinquedaoRecovery.js#L97) | Consulta o tempo desde a última rebatida para recuo e retomada gradual da direção. |
| `hitBrinquedaoSideMat(s, previous, events)` | Função | [102](../src/js/brinquedao/brinquedaoRecovery.js#L102) | Exige cruzamento lateral e sobreposição ao corpo para devolver impulso sem teleporte. |

## src/js/brinquedao/brinquedaoSimulation.js

[Implementação](../src/js/brinquedao/brinquedaoSimulation.js). Contratos exportados/reexportados: `createBrinquedaoState`, `restoreBrinquedaoState`, `recoverBrinquedao`, `stepBrinquedao`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(v, a, b)` | Função atribuída | [39](../src/js/brinquedao/brinquedaoSimulation.js#L39) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createBrinquedaoState(difficulty = 'NORMAL')` | Função | [41](../src/js/brinquedao/brinquedaoSimulation.js#L41) | Cria domínio8 com ataques reativos, pontes rápidas e corrida de quatro tubos. |
| `restoreBrinquedaoState(saved, difficulty)` | Função | [76](../src/js/brinquedao/brinquedaoSimulation.js#L76) | Valida domínio8/interior3 e migra saves1–7, convertendo piscinas e progresso antigo. |
| `recoverBrinquedao(s)` | Função | [236](../src/js/brinquedao/brinquedaoSimulation.js#L236) | Retoma o último terraço após queda/derrota e rearma as pontes futuras. |
| `stepBrinquedao(s, input = {}, seconds = 0)` | Função | [260](../src/js/brinquedao/brinquedaoSimulation.js#L260) | Integra embalo, saltos manuais, degraus, pistas, lonas, pontes e lançamentos em subpassos; detecta perda dos apoios e derrota. |

## src/js/brinquedao/brinquedaoStory.js

[Implementação](../src/js/brinquedao/brinquedaoStory.js). Contratos exportados/reexportados: `BRINQUEDAO_INTRO`, `advanceBrinquedaoStory`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `advanceBrinquedaoStory(s)` | Função | [49](../src/js/brinquedao/brinquedaoStory.js#L49) | Avança uma fala ou encerra a leitura consumindo o gesto de pulo. |

## src/js/brinquedao/brinquedaoTerrain.js

[Implementação](../src/js/brinquedao/brinquedaoTerrain.js). Contratos exportados/reexportados: `prepareBrinquedaoParts`, `drawBrinquedaoPillar`, `drawBrinquedaoSurfaceStrip`, `drawBrinquedaoTerrain`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `prepareBrinquedaoParts(image, slide)` | Função | [14](../src/js/brinquedao/brinquedaoTerrain.js#L14) | Extrai módulos completos e mede o topo pintado para registrar o material. |
| `drawBrinquedaoPillar(ctx, support, parts, viewportBottom)` | Função | [96](../src/js/brinquedao/brinquedaoTerrain.js#L96) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `trackSupports(ctx, p, parts, viewportBottom)` | Função | [136](../src/js/brinquedao/brinquedaoTerrain.js#L136) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `surfaceAt(part, x)` | Função | [141](../src/js/brinquedao/brinquedaoTerrain.js#L141) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawPaddedEnd(ctx, part, p, x, side)` | Função | [148](../src/js/brinquedao/brinquedaoTerrain.js#L148) | Finaliza as pontas dos atalhos com espuma arredondada dentro dos limites do apoio físico. |
| `drawBrinquedaoSurfaceStrip(ctx, part, sx, nextSx, x, nextX, y, nextY, k, height)` | Função | [176](../src/js/brinquedao/brinquedaoTerrain.js#L176) | Compõe a faixa ilustrada com amostragem contínua e transformação afim pela tangente, sem modificar o apoio físico. |
| `stepJoint(ctx, parts, step, viewportBottom)` | Função | [202](../src/js/brinquedao/brinquedaoTerrain.js#L202) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawBrinquedaoTerrain(ctx, parts, left, right, s, attractions, look = null, viewportBottom = null,)` | Função | [230](../src/js/brinquedao/brinquedaoTerrain.js#L230) | Projeta acolchoados, madeira, escorregadores e pilares além do limite visível sobre as curvas físicas. |
| `drawConnections(ctx, parts, look, left, right)` | Função | [364](../src/js/brinquedao/brinquedaoTerrain.js#L364) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/brinquedao/brinquedaoTubes.js

[Implementação](../src/js/brinquedao/brinquedaoTubes.js). Contratos exportados/reexportados: `BRINQUEDAO_INSIDE`, `BRINQUEDAO_TUBES`, `brinquedaoTubePose`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `buildTube(index)` | Função | [62](../src/js/brinquedao/brinquedaoTubes.js#L62) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `push(x, y)` | Função atribuída | [66](../src/js/brinquedao/brinquedaoTubes.js#L66) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `line(point)` | Função atribuída | [75](../src/js/brinquedao/brinquedaoTubes.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `brinquedaoTubePose(index, u)` | Função | [124](../src/js/brinquedao/brinquedaoTubes.js#L124) | Consulta posição e tangente pelo comprimento amostrado da curva. |

## src/js/chapters/ToyRoomEpilogue.js

[Implementação](../src/js/chapters/ToyRoomEpilogue.js). Contratos exportados/reexportados: `TOY_ROOM_EPILOGUE`, `ToyRoomEpilogue`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smooth(value)` | Função atribuída | [5](../src/js/chapters/ToyRoomEpilogue.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor({ assets, audio, onComplete = () => {}, saved, campaign = true } = {})` | Método declarado | [50](../src/js/chapters/ToyRoomEpilogue.js#L50) | Recebe assets, áudio, callback, origem e save opcional; valida versão/índice/relógios e inicia a música da sala. |
| `beat()` | Acessor | [84](../src/js/chapters/ToyRoomEpilogue.js#L84) | Consulta o quadro corrente de TOY_ROOM_EPILOGUE sem avançar a sequência. |
| `snapshot()` | Método declarado | [91](../src/js/chapters/ToyRoomEpilogue.js#L91) | Captura versão 1, índice, idade e tempo; a inclusão no save depende da origem no host. |
| `advanceDialogue()` | Método declarado | [100](../src/js/chapters/ToyRoomEpilogue.js#L100) | Avança somente fala ou gravura; recusa o plano silencioso de facepalm e cenas encerradas. |
| `next()` | Método declarado | [108](../src/js/chapters/ToyRoomEpilogue.js#L108) | Troca o quadro e zera a idade; no último, encerra e chama onComplete uma vez. |
| `update(dt)` | Método declarado | [121](../src/js/chapters/ToyRoomEpilogue.js#L121) | Converte dt legado para segundos, avança relógios/fade musical e conclui quadros no tempo autorado. |
| `render(ctx, canvas)` | Método declarado | [130](../src/js/chapters/ToyRoomEpilogue.js#L130) | Compõe quarto arrumado, poses e fala na área segura; aproxima Nanda no facepalm e apresenta a gravura do capítulo 2. |
| `onAdvance()` | API/lambda de objeto | [141](../src/js/chapters/ToyRoomEpilogue.js#L141) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawGirl(index, alpha)` | Função atribuída | [193](../src/js/chapters/ToyRoomEpilogue.js#L193) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `onAdvance()` | API/lambda de objeto | [256](../src/js/chapters/ToyRoomEpilogue.js#L256) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/chapters/chapterArt.js

[Implementação](../src/js/chapters/chapterArt.js). Contratos exportados/reexportados: `CHAPTER_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/chapters/chapterCard.js

[Implementação](../src/js/chapters/chapterCard.js). Contratos exportados/reexportados: `renderChapterCard`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderChapterCard(ctx, canvas, { image, number, title, age = 0, duration = 5, onAdvance } = {},)` | Função | [5](../src/js/chapters/chapterCard.js#L5) | Desenha a gravura e o título na área segura; registra avanço da leitura sem avançar a fase por trás. |

## src/js/cinematics/OpeningSequence.js

[Implementação](../src/js/cinematics/OpeningSequence.js). Contratos exportados/reexportados: `OPENING_STORAGE_KEY`, `OPENING_DIALOGUE`, `OpeningSequence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smooth(t)` | Função atribuída | [11](../src/js/cinematics/OpeningSequence.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor({ storage, onReveal = () => {}, onComplete = () => {}, onCue = () => {} } = {})` | Método declarado | [29](../src/js/cinematics/OpeningSequence.js#L29) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `hasCompleted()` | Método declarado | [47](../src/js/cinematics/OpeningSequence.js#L47) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `start({ replay = false } = {})` | Método declarado | [58](../src/js/cinematics/OpeningSequence.js#L58) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `cancel()` | Método declarado | [71](../src/js/cinematics/OpeningSequence.js#L71) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reset()` | Método declarado | [78](../src/js/cinematics/OpeningSequence.js#L78) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [91](../src/js/cinematics/OpeningSequence.js#L91) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [102](../src/js/cinematics/OpeningSequence.js#L102) | Reaplica a captura específica; confira referências e dados transitórios. |
| `advanceDialogue()` | Método declarado | [117](../src/js/cinematics/OpeningSequence.js#L117) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `revealing()` | Acessor | [130](../src/js/cinematics/OpeningSequence.js#L130) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [136](../src/js/cinematics/OpeningSequence.js#L136) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `renderFade(ctx, canvas)` | Método declarado | [171](../src/js/cinematics/OpeningSequence.js#L171) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `render(ctx, canvas, { assets, drawRoom, lighting, fairyRenderer })` | Método declarado | [187](../src/js/cinematics/OpeningSequence.js#L187) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `onAdvance()` | API/lambda de objeto | [198](../src/js/cinematics/OpeningSequence.js#L198) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onAdvance()` | API/lambda de objeto | [307](../src/js/cinematics/OpeningSequence.js#L307) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/cinematics/ToyRoomIntroduction.js

[Implementação](../src/js/cinematics/ToyRoomIntroduction.js). Contratos exportados/reexportados: `TOY_ROOM_INTRO_STAGES`, `ToyRoomIntroduction`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smooth(p)` | Função atribuída | [2](../src/js/cinematics/ToyRoomIntroduction.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor({ onComplete = () => {}, onEvent = () => {} } = {})` | Método declarado | [73](../src/js/cinematics/ToyRoomIntroduction.js#L73) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `start(context)` | Método declarado | [82](../src/js/cinematics/ToyRoomIntroduction.js#L82) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stage()` | Acessor | [94](../src/js/cinematics/ToyRoomIntroduction.js#L94) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [113](../src/js/cinematics/ToyRoomIntroduction.js#L113) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `advanceDialogue()` | Método declarado | [136](../src/js/cinematics/ToyRoomIntroduction.js#L136) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `prepare({ assets, phase, departure, audio })` | Método declarado | [146](../src/js/cinematics/ToyRoomIntroduction.js#L146) | Prepara contexto visual da introdução; consulte dependências no módulo. |
| `dialogue()` | Acessor | [159](../src/js/cinematics/ToyRoomIntroduction.js#L159) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraFrame(canvas)` | Método declarado | [170](../src/js/cinematics/ToyRoomIntroduction.js#L170) | Calcula enquadramento narrativo da introdução conforme etapa e relógio. |
| `fairyPosition()` | Método declarado | [215](../src/js/cinematics/ToyRoomIntroduction.js#L215) | Calcula posição visual da fada durante a introdução. |
| `drawGirl(ctx)` | Método declarado | [227](../src/js/cinematics/ToyRoomIntroduction.js#L227) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFairy(ctx)` | Método declarado | [261](../src/js/cinematics/ToyRoomIntroduction.js#L261) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `render(ctx, canvas)` | Método declarado | [317](../src/js/cinematics/ToyRoomIntroduction.js#L317) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialogue(ctx, canvas, text)` | Método declarado | [357](../src/js/cinematics/ToyRoomIntroduction.js#L357) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `cancel()` | Método declarado | [372](../src/js/cinematics/ToyRoomIntroduction.js#L372) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/config.js

[Implementação](../src/js/config.js). Contratos exportados/reexportados: `DEBUG_COLLISIONS`, `GAME_CONFIG`, `FLOOR_Y`, `createPlayerState`, `CUTSCENE_DIALOGUE`, `getApproachJumpSpeed`, `getEscapeStats`, `getPhase3Stats`, `createFairyState`, `platforms`, `exitDoor`, `phase3Platforms`, `trueExitDoor`, `roomScenery`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createPlayerState()` | Função | [12](../src/js/config.js#L12) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `getApproachJumpSpeed(platformIndex, difficulty = 'NORMAL')` | Função | [46](../src/js/config.js#L46) | Consulta o alcance fixo da aproximação por apoio e dificuldade, sem mirar pela posição do comando. |
| `getEscapeStats(level, difficulty = 'NORMAL')` | Função | [71](../src/js/config.js#L71) | Consulta impulso, corrida e efeitos da fuga; o alcance aéreo varia entre NORMAL e EASY. |
| `getPhase3Stats(level, fromFloor = false, difficulty = 'NORMAL')` | Função | [94](../src/js/config.js#L94) | Consulta atributos do retorno por nível e dificuldade; fromFloor distingue a entrada pelo chão. |
| `createFairyState()` | Função | [110](../src/js/config.js#L110) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/AudioController.js

[Implementação](../src/js/controllers/AudioController.js). Contratos exportados/reexportados: `AudioController`, `createAudioController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [14](../src/js/controllers/AudioController.js#L14) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `init()` | Método declarado | [32](../src/js/controllers/AudioController.js#L32) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handleVisibilityChange()` | Método declarado | [45](../src/js/controllers/AudioController.js#L45) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleWindowBlur()` | Método declarado | [57](../src/js/controllers/AudioController.js#L57) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleWindowFocus()` | Método declarado | [66](../src/js/controllers/AudioController.js#L66) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onBackground()` | Método declarado | [75](../src/js/controllers/AudioController.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onForeground()` | Método declarado | [92](../src/js/controllers/AudioController.js#L92) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setMasterVolume(volume)` | Método declarado | [112](../src/js/controllers/AudioController.js#L112) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | Método declarado | [123](../src/js/controllers/AudioController.js#L123) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getAudioContext()` | Método declarado | [131](../src/js/controllers/AudioController.js#L131) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(muted)` | Método declarado | [138](../src/js/controllers/AudioController.js#L138) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `isMuted()` | Método declarado | [149](../src/js/controllers/AudioController.js#L149) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | Método declarado | [160](../src/js/controllers/AudioController.js#L160) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `initAudio()` | Método declarado | [169](../src/js/controllers/AudioController.js#L169) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startMusic()` | Método declarado | [178](../src/js/controllers/AudioController.js#L178) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `playOpeningAmbience()` | Método declarado | [187](../src/js/controllers/AudioController.js#L187) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startMusicBox()` | Método declarado | [194](../src/js/controllers/AudioController.js#L194) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopMusic()` | Método declarado | [203](../src/js/controllers/AudioController.js#L203) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stopAllAudio()` | Método declarado | [212](../src/js/controllers/AudioController.js#L212) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearActiveSounds()` | Método declarado | [221](../src/js/controllers/AudioController.js#L221) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playJumpSound()` | Método declarado | [230](../src/js/controllers/AudioController.js#L230) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLongJumpSound(progress)` | Método declarado | [239](../src/js/controllers/AudioController.js#L239) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playLevelUpChime(level)` | Método declarado | [248](../src/js/controllers/AudioController.js#L248) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyVoiceBlip(freq)` | Método declarado | [257](../src/js/controllers/AudioController.js#L257) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyLaugh()` | Método declarado | [266](../src/js/controllers/AudioController.js#L266) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playEscapePowerUp()` | Método declarado | [275](../src/js/controllers/AudioController.js#L275) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFallFailSound()` | Método declarado | [284](../src/js/controllers/AudioController.js#L284) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playTapeRipSound()` | Método declarado | [293](../src/js/controllers/AudioController.js#L293) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDramaticTumbleSound()` | Método declarado | [302](../src/js/controllers/AudioController.js#L302) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPlayerThudSound()` | Método declarado | [311](../src/js/controllers/AudioController.js#L311) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPlayerShockVoice()` | Método declarado | [320](../src/js/controllers/AudioController.js#L320) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playFairyFrustratedSound()` | Método declarado | [329](../src/js/controllers/AudioController.js#L329) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playPhase3StartFanfare()` | Método declarado | [338](../src/js/controllers/AudioController.js#L338) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setToyRoomMusicFade(value)` | Método declarado | [347](../src/js/controllers/AudioController.js#L347) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setToyRoomMusicIntensity(value)` | Método declarado | [353](../src/js/controllers/AudioController.js#L353) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playArenaMusicBeat(beat)` | Método declarado | [359](../src/js/controllers/AudioController.js#L359) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `stopArenaMusic()` | Método declarado | [365](../src/js/controllers/AudioController.js#L365) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playArenaSound(event)` | Método declarado | [371](../src/js/controllers/AudioController.js#L371) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setToyRoomMusicTrack(track)` | Método declarado | [377](../src/js/controllers/AudioController.js#L377) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPortalExitWhoosh()` | Método declarado | [385](../src/js/controllers/AudioController.js#L385) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playSoftMagicBurst()` | Método declarado | [391](../src/js/controllers/AudioController.js#L391) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startToyRoomMusic(options)` | Método declarado | [398](../src/js/controllers/AudioController.js#L398) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `stopToyRoomMusic()` | Método declarado | [407](../src/js/controllers/AudioController.js#L407) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pauseMusic()` | Método declarado | [416](../src/js/controllers/AudioController.js#L416) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | Método declarado | [425](../src/js/controllers/AudioController.js#L425) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getToyRoomAudioElement()` | Método declarado | [434](../src/js/controllers/AudioController.js#L434) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `playPickUpSound()` | Método declarado | [444](../src/js/controllers/AudioController.js#L444) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playDropSound()` | Método declarado | [453](../src/js/controllers/AudioController.js#L453) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playOrganizeChime(streak)` | Método declarado | [462](../src/js/controllers/AudioController.js#L462) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playToyRoomVictory()` | Método declarado | [471](../src/js/controllers/AudioController.js#L471) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `playCombatSound(event)` | Método declarado | [480](../src/js/controllers/AudioController.js#L480) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `destroy()` | Método declarado | [489](../src/js/controllers/AudioController.js#L489) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `createAudioController(options = {})` | Função | [501](../src/js/controllers/AudioController.js#L501) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/CameraController.js

[Implementação](../src/js/controllers/CameraController.js). Contratos exportados/reexportados: `CameraController`, `createCameraController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [14](../src/js/controllers/CameraController.js#L14) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `reset(x = 0, y = 0, zoom = 1.0)` | Método declarado | [28](../src/js/controllers/CameraController.js#L28) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setZoom(zoom, immediate = false)` | Método declarado | [39](../src/js/controllers/CameraController.js#L39) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `setPosition(x, y, immediate = false)` | Método declarado | [49](../src/js/controllers/CameraController.js#L49) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `update(dt, state, canvas, callbacks = {})` | Método declarado | [67](../src/js/controllers/CameraController.js#L67) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `syncFromState(state)` | Método declarado | [203](../src/js/controllers/CameraController.js#L203) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncToState(state)` | Método declarado | [215](../src/js/controllers/CameraController.js#L215) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `applyTransform(ctx, canvas, player, fairy, presentationY = this.y, presentationX = this.x, sourceX = this.x,)` | Método declarado | [231](../src/js/controllers/CameraController.js#L231) | Compõe foco/zoom e diferença entre pose original e visual no contexto. |
| `createCameraController(options = {})` | Função | [254](../src/js/controllers/CameraController.js#L254) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/controllers/CameraPresentation.js

[Implementação](../src/js/controllers/CameraPresentation.js). Contratos exportados/reexportados: `getDarkRoomScrollFrame`, `getPhase3ScrollFrame`, `CameraPresentation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getDarkRoomScrollFrame({ x, width, height })` | Função | [4](../src/js/controllers/CameraPresentation.js#L4) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getPhase3ScrollFrame(viewport)` | Função | [16](../src/js/controllers/CameraPresentation.js#L16) | Calcula a rolagem visual do retorno pelo progresso horizontal do cenário, sem seguir salto ou pouso. |
| `constructor()` | Método declarado | [26](../src/js/controllers/CameraPresentation.js#L26) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `reset()` | Método declarado | [33](../src/js/controllers/CameraPresentation.js#L33) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [40](../src/js/controllers/CameraPresentation.js#L40) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [57](../src/js/controllers/CameraPresentation.js#L57) | Reaplica a captura específica; confira referências e dados transitórios. |
| `mobileFrame({ target, enabled, stable, anticipate, tick, width, height, fixed = false })` | Método declarado | [73](../src/js/controllers/CameraPresentation.js#L73) | Interpola entrada do enquadramento móvel. |
| `step(from, to, dimension)` | Função atribuída | [108](../src/js/controllers/CameraPresentation.js#L108) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame({ x, y, active, narrative, tick, width, height, cssWidth, cssHeight, zoom })` | Método declarado | [130](../src/js/controllers/CameraPresentation.js#L130) | Calcula pose visual estável sem escrever na simulação. |
| `move(from, to, dimension, cssDimension)` | Função atribuída | [150](../src/js/controllers/CameraPresentation.js#L150) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/InputController.js

[Implementação](../src/js/controllers/InputController.js). Contratos exportados/reexportados: `InputController`, `bindInput`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(game, options = {})` | Método declarado | [12](../src/js/controllers/InputController.js#L12) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `init()` | Método declarado | [36](../src/js/controllers/InputController.js#L36) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `triggerJump(source)` | Método declarado | [52](../src/js/controllers/InputController.js#L52) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handlePointerDown(event)` | Método declarado | [89](../src/js/controllers/InputController.js#L89) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyDown(event)` | Método declarado | [147](../src/js/controllers/InputController.js#L147) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | [194](../src/js/controllers/InputController.js#L194) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gamepadLoop()` | Método declarado | [246](../src/js/controllers/InputController.js#L246) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGamepadPollingLoop()` | Método declarado | [255](../src/js/controllers/InputController.js#L255) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleGamepadDisconnected(event)` | Método declarado | [264](../src/js/controllers/InputController.js#L264) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `destroy()` | Método declarado | [274](../src/js/controllers/InputController.js#L274) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `bindInput(game)` | Função | [293](../src/js/controllers/InputController.js#L293) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pollGamepad()` | API/lambda de objeto | [301](../src/js/controllers/InputController.js#L301) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | API/lambda de objeto | [305](../src/js/controllers/InputController.js#L305) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/controllers/androidFraming.js

[Implementação](../src/js/controllers/androidFraming.js). Contratos exportados/reexportados: `androidFrameOffset`, `createAndroidFraming`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `androidFrameOffset({ enabled, height, cssHeight, bottomInset = 0, topInset = 0, feetY, topY, })` | Função | [2](../src/js/controllers/androidFraming.js#L2) | Calcula elevação visual Android com reservas e proteção do topo. |
| `createAndroidFraming(canvas)` | Função | [20](../src/js/controllers/androidFraming.js#L20) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `offset(feetY, topY)` | Método declarado | [38](../src/js/controllers/androidFraming.js#L38) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/escapeFairyGuide.js

[Implementação](../src/js/controllers/escapeFairyGuide.js). Contratos exportados/reexportados: `getEscapeGuideTarget`, `updateEscapeFairyGuide`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getEscapeGuideTarget(player, platforms, exitDoor)` | Função | [2](../src/js/controllers/escapeFairyGuide.js#L2) | Seleciona centro de chegada do próximo apoio ou porta. |
| `updateEscapeFairyGuide(fairy, target, dt = 1)` | Função | [21](../src/js/controllers/escapeFairyGuide.js#L21) | Atualiza posição/velocidade da guia com amortecimento crítico. |

## src/js/controllers/mobileZoom.js

[Implementação](../src/js/controllers/mobileZoom.js). Contratos exportados/reexportados: `isMobileDevice`, `getDarkRoomMobileFrame`, `getMobileZoomFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `isMobileDevice(nav = globalThis.navigator)` | Função | [2](../src/js/controllers/mobileZoom.js#L2) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDarkRoomMobileFrame({ width, height, cameraY, floorY, layout, anticipate = false, })` | Função | [11](../src/js/controllers/mobileZoom.js#L11) | Calcula composição fixa por viewport/safe area, com envelope autorado de salto e rodapé reservado ao toque; não consulta atores. |
| `getMobileZoomFrame({ enabled, width, height, bounds, anchor, margin = 24, stable = false, anticipate = false, })` | Função | [42](../src/js/controllers/mobileZoom.js#L42) | Retorna escala e translações de apresentação a partir dos limites/alvo. |
| `clamp(value, min, max)` | Função atribuída | [88](../src/js/controllers/mobileZoom.js#L88) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/controllers/viewportController.js

[Implementação](../src/js/controllers/viewportController.js). Contratos exportados/reexportados: `createViewportController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createViewportController({ canvas, darkCanvas, lighting, host, onOrientation })` | Função | [2](../src/js/controllers/viewportController.js#L2) | Cria resize com Canvas, iluminação, host e callback de orientação. |
| `resize()` | Função | [3](../src/js/controllers/viewportController.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/debug/AtlasDebugger.js

[Implementação](../src/js/debug/AtlasDebugger.js). Contratos exportados/reexportados: `AtlasDebugger`, `createAtlasDebugger`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [19](../src/js/debug/AtlasDebugger.js#L19) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | [33](../src/js/debug/AtlasDebugger.js#L33) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `validateAllRegions()` | Método declarado | [40](../src/js/debug/AtlasDebugger.js#L40) | Confere recortes do atlas contra imagens carregadas. |
| `initDOM()` | Método declarado | [98](../src/js/debug/AtlasDebugger.js#L98) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toggle(forceState = null)` | Método declarado | [196](../src/js/debug/AtlasDebugger.js#L196) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Método declarado | [210](../src/js/debug/AtlasDebugger.js#L210) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `createAtlasDebugger(options)` | Função | [331](../src/js/debug/AtlasDebugger.js#L331) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/debug/cameraQaObserver.js

[Implementação](../src/js/debug/cameraQaObserver.js). Contratos exportados/reexportados: `createCameraQaObserver`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createCameraQaObserver({ host, snapshot })` | Função | [2](../src/js/debug/cameraQaObserver.js#L2) | Cria observador opcional ativado por cameraQa; lê snapshot sem alterar câmera. |
| `record(transform = null)` | Método declarado | [9](../src/js/debug/cameraQaObserver.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/dream-forest/DreamAudio.js

[Implementação](../src/js/dream-forest/DreamAudio.js). Contratos exportados/reexportados: `DreamAudio`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(host)` | Método declarado | [10](../src/js/dream-forest/DreamAudio.js#L10) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `scream()` | Método declarado | [20](../src/js/dream-forest/DreamAudio.js#L20) | Agenda vocalização sintetizada de susto com formantes, volume do host e descarte das vozes. |
| `selectTrack(state)` | Método declarado | [60](../src/js/dream-forest/DreamAudio.js#L60) | Seleciona a faixa do sonho ou do piquenique pelo estágio antes de restaurar a posição musical. |
| `update(state, paused = false)` | Método declarado | [91](../src/js/dream-forest/DreamAudio.js#L91) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `clear()` | Método declarado | [122](../src/js/dream-forest/DreamAudio.js#L122) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `event(type, event = {})` | Método declarado | [130](../src/js/dream-forest/DreamAudio.js#L130) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/dream-forest/DreamInput.js

[Implementação](../src/js/dream-forest/DreamInput.js). Contratos exportados/reexportados: `dreamControls`, `nightmareControls`, `dreamMobileWebInput`, `DreamInput`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamControls(canvas, { stage = null, mobile = isMobileDevice() } = {})` | Função | [7](../src/js/dream-forest/DreamInput.js#L7) | Compartilha D-pad amplo com oito direções e pulo em todos os estágios mobile. |
| `nightmareControls(canvas)` | Função | [45](../src/js/dream-forest/DreamInput.js#L45) | Compartilha D-pad mobile e mantém quatro alvos no desktop para a perseguição. |
| `dreamMobileWebInput(state, input, { mobile = isMobileDevice(), seconds = 1 / 60 } = {},)` | Função | [75](../src/js/dream-forest/DreamInput.js#L75) | Somente em celular e teias: sobe até a altura de preparo com velocidade normal, preservando comandos manuais e entrada original nos outros casos. |
| `constructor(canvas, enabled, unlock, scene)` | Método declarado | [99](../src/js/dream-forest/DreamInput.js#L99) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `sample()` | Método declarado | [114](../src/js/dream-forest/DreamInput.js#L114) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `has(name)` | Função atribuída | [121](../src/js/dream-forest/DreamInput.js#L121) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/dream-forest/DreamNightmareLighting.js

[Implementação](../src/js/dream-forest/DreamNightmareLighting.js). Contratos exportados/reexportados: `DreamNightmareLighting`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `surfaceHeight(x)` | Função atribuída | [5](../src/js/dream-forest/DreamNightmareLighting.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor()` | Método declarado | [25](../src/js/dream-forest/DreamNightmareLighting.js#L25) | Cria o buffer transitório reutilizado da iluminação, sem estado persistente. |
| `surfaceEnd(light, angle)` | Método declarado | [30](../src/js/dream-forest/DreamNightmareLighting.js#L30) | Limita o raio visual ao primeiro abrigo, chão ou superfície curva da lama. |
| `begin(canvas, frame)` | Método declarado | [58](../src/js/dream-forest/DreamNightmareLighting.js#L58) | Prepara o buffer em meia resolução com a transformação fixa do viewport. |
| `air(ctx, canvas, frame, lights)` | Método declarado | [79](../src/js/dream-forest/DreamNightmareLighting.js#L79) | Compõe emissão extensa em camadas e penumbra com queda radial de intensidade. |
| `receiver(ctx, light, draw)` | Método declarado | [134](../src/js/dream-forest/DreamNightmareLighting.js#L134) | Aplica luz sobre a máscara dos abrigos, conservando a textura ilustrada. |
| `ground(ctx, lights)` | Método declarado | [179](../src/js/dream-forest/DreamNightmareLighting.js#L179) | Ilumina terra e relevos com manchas difusas orientadas pela superfície. |
| `water(ctx, lights, lake, time)` | Método declarado | [207](../src/js/dream-forest/DreamNightmareLighting.js#L207) | Projeta reflexos achatados e ondulações somente sobre a superfície líquida. |
| `destroy()` | Método declarado | [252](../src/js/dream-forest/DreamNightmareLighting.js#L252) | Libera o buffer de iluminação ao descartar a fase. |

## src/js/dream-forest/DreamNightmareRenderer.js

[Implementação](../src/js/dream-forest/DreamNightmareRenderer.js). Contratos exportados/reexportados: `DreamNightmareRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smooth(t)` | Função atribuída | [34](../src/js/dream-forest/DreamNightmareRenderer.js#L34) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor(canvas, shared)` | Método declarado | [44](../src/js/dream-forest/DreamNightmareRenderer.js#L44) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [56](../src/js/dream-forest/DreamNightmareRenderer.js#L56) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareTerrain()` | Método declarado | [138](../src/js/dream-forest/DreamNightmareRenderer.js#L138) | Registra a pintura dos barrancos no perfil físico e aplica ambiente comum ao piso, sem tarja de cor. |
| `frame(s)` | Método declarado | [253](../src/js/dream-forest/DreamNightmareRenderer.js#L253) | Calcula pose visual estável sem escrever na simulação. |
| `mudClip(ctx, lake)` | Método declarado | [270](../src/js/dream-forest/DreamNightmareRenderer.js#L270) | Recorta o corpo pela superfície curva da lama, sem depender do alfa da pintura frontal. |
| `girl(ctx, s)` | Método declarado | [281](../src/js/dream-forest/DreamNightmareRenderer.js#L281) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mudSplash(ctx, n)` | Método declarado | [401](../src/js/dream-forest/DreamNightmareRenderer.js#L401) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reach(ctx, s)` | Método declarado | [427](../src/js/dream-forest/DreamNightmareRenderer.js#L427) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `swampLayers(ctx, frame, front = false)` | Método declarado | [442](../src/js/dream-forest/DreamNightmareRenderer.js#L442) | Distribui troncos e tocos ilustrados em camadas que envolvem a criatura. |
| `forest(s, touch)` | Método declarado | [462](../src/js/dream-forest/DreamNightmareRenderer.js#L462) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `wake(s)` | Método declarado | [754](../src/js/dream-forest/DreamNightmareRenderer.js#L754) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(s, { paused = false, touch = false, onAdvance = () => {} } = {})` | Método declarado | [872](../src/js/dream-forest/DreamNightmareRenderer.js#L872) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [915](../src/js/dream-forest/DreamNightmareRenderer.js#L915) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/dream-forest/DreamPhase.js

[Implementação](../src/js/dream-forest/DreamPhase.js). Contratos exportados/reexportados: `DreamPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ canvas, audio, enabled = () => true, difficulty = 'NORMAL', campaign = false })` | Método declarado | [20](../src/js/dream-forest/DreamPhase.js#L20) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `active()` | Acessor | [53](../src/js/dream-forest/DreamPhase.js#L53) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `reading()` | Método declarado | [60](../src/js/dream-forest/DreamPhase.js#L60) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `advanceDialogue()` | Método declarado | [74](../src/js/dream-forest/DreamPhase.js#L74) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `start(saved = null)` | Método declarado | [86](../src/js/dream-forest/DreamPhase.js#L86) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt = 1)` | Método declarado | [109](../src/js/dream-forest/DreamPhase.js#L109) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [147](../src/js/dream-forest/DreamPhase.js#L147) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `onAdvance()` | API/lambda de objeto | [160](../src/js/dream-forest/DreamPhase.js#L160) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Método declarado | [168](../src/js/dream-forest/DreamPhase.js#L168) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [176](../src/js/dream-forest/DreamPhase.js#L176) | Produz captura recuperável do estado específico deste componente. |
| `retry()` | Método declarado | [186](../src/js/dream-forest/DreamPhase.js#L186) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [192](../src/js/dream-forest/DreamPhase.js#L192) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/dream-forest/DreamRenderer.js

[Implementação](../src/js/dream-forest/DreamRenderer.js). Contratos exportados/reexportados: `DreamRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas)` | Método declarado | [53](../src/js/dream-forest/DreamRenderer.js#L53) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [65](../src/js/dream-forest/DreamRenderer.js#L65) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(state)` | Método declarado | [118](../src/js/dream-forest/DreamRenderer.js#L118) | Calcula pose visual estável sem escrever na simulação. |
| `leaf(ctx, f, bottom = C.grassRoot)` | Método declarado | [133](../src/js/dream-forest/DreamRenderer.js#L133) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `grass(ctx, f, bottom = C.grassRoot)` | Método declarado | [137](../src/js/dream-forest/DreamRenderer.js#L137) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `insect(ctx, f, time)` | Método declarado | [144](../src/js/dream-forest/DreamRenderer.js#L144) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `girl(ctx, s)` | Método declarado | [163](../src/js/dream-forest/DreamRenderer.js#L163) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(state, { ready = true, error = null, paused = false, onAdvance = () => {}, touch = false } = {},)` | Método declarado | [223](../src/js/dream-forest/DreamRenderer.js#L223) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [484](../src/js/dream-forest/DreamRenderer.js#L484) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/dream-forest/DreamSilence.js

[Implementação](../src/js/dream-forest/DreamSilence.js). Contratos exportados/reexportados: `DreamSilence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [7](../src/js/dream-forest/DreamSilence.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `update(ctx, volume)` | Método declarado | [14](../src/js/dream-forest/DreamSilence.js#L14) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `stop()` | Método declarado | [73](../src/js/dream-forest/DreamSilence.js#L73) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/dream-forest/dreamArt.js

[Implementação](../src/js/dream-forest/dreamArt.js). Contratos exportados/reexportados: `DREAM_CLIMB`, `DREAM_INSECTS`, `DREAM_PROFILES`, `DREAM_LEAF`, `DREAM_BEE`, `DREAM_SPIDER`, `DREAM_BRANCH`, `DREAM_CLIMB_CYCLE`, `DREAM_CLIMB_CONTACTS`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/dream-forest/dreamBeetle.js

[Implementação](../src/js/dream-forest/dreamBeetle.js). Contratos exportados/reexportados: `prepareDreamBeetle`, `dreamBeetlePose`, `drawDreamBeetle`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `polygon(ctx, points)` | Função | [58](../src/js/dream-forest/dreamBeetle.js#L58) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canvas(width, height)` | Função | [64](../src/js/dream-forest/dreamBeetle.js#L64) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareDreamBeetle(image)` | Função | [71](../src/js/dream-forest/dreamBeetle.js#L71) | Recorta e mascara em cache cabeça e patas da pintura original, conservando o casco de apoio. |
| `dreamBeetlePose(time, energy = 0.3)` | Função | [107](../src/js/dream-forest/dreamBeetle.js#L107) | Calcula articulações contínuas de asas, patas e cabeça conforme o tempo e a energia do voo. |
| `part(ctx, p, angle)` | Função | [119](../src/js/dream-forest/dreamBeetle.js#L119) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawDreamBeetle(ctx, image, parts, frame, time)` | Função | [127](../src/js/dream-forest/dreamBeetle.js#L127) | Desenha asas membranosas e membros articulados em torno do dorso rígido usado pela física. |

## src/js/dream-forest/dreamClimb.js

[Implementação](../src/js/dream-forest/dreamClimb.js). Contratos exportados/reexportados: `dreamClimbContact`, `dreamClimbPose`, `drawDreamClimb`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(v, a, b)` | Função atribuída | [3](../src/js/dream-forest/dreamClimb.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dreamClimbContact(frame, y, side)` | Função | [5](../src/js/dream-forest/dreamClimb.js#L5) | Localiza o contato visual da mão na haste ou no contorno pintado do corpo do inseto, sem usar asas móveis. |
| `topContact(frame, x)` | Função | [21](../src/js/dream-forest/dreamClimb.js#L21) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dreamClimbPose(player, frame)` | Função | [33](../src/js/dream-forest/dreamClimb.js#L33) | Escolhe quatro poses pela distância escalada e duas para chegar ao topo, com mão ancorada e inclinação do corpo. |
| `drawDreamClimb(ctx, image, state)` | Função | [60](../src/js/dream-forest/dreamClimb.js#L60) | Desenha Yuna pela âncora da mão e conserva a pintura inteira, sem mudar a física ou a pose no lombo. |

## src/js/dream-forest/dreamGlider.js

[Implementação](../src/js/dream-forest/dreamGlider.js). Contratos exportados/reexportados: `DREAM_GLIDE`, `dreamGlideRoute`, `DREAM_GLIDE_THORNS`, `dreamGliderPose`, `dreamGliderContact`, `beginDreamGlide`, `stepDreamGlide`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamGlideRoute(x)` | Função | [25](../src/js/dream-forest/dreamGlider.js#L25) | Interpola alturas para posicionar obstáculos; não dirige a personagem. |
| `dreamGliderPose(p)` | Função | [61](../src/js/dream-forest/dreamGlider.js#L61) | Compartilha âncora, escala e inclinação da pintura com a colisão. |
| `dreamGliderContact(p)` | Função | [70](../src/js/dream-forest/dreamGlider.js#L70) | Compara alfa opaco do planador e dos galhos próximos, ignorando névoa. |
| `beginDreamGlide(s)` | Função | [103](../src/js/dream-forest/dreamGlider.js#L103) | Prepara caminhada e checkpoint do lançamento no galho. |
| `stepDreamGlide(s, input, dt, branch, surface, events, finish)` | Função | [116](../src/js/dream-forest/dreamGlider.js#L116) | Integra caminhada, rajada, voo pesado, queda/reinício e pouso. |

## src/js/dream-forest/dreamGliderArt.js

[Implementação](../src/js/dream-forest/dreamGliderArt.js). Contratos exportados/reexportados: `DREAM_GLIDER_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/dream-forest/dreamGliderRenderer.js

[Implementação](../src/js/dream-forest/dreamGliderRenderer.js). Contratos exportados/reexportados: `drawDreamGlideThorns`, `drawDreamLaunchLeaf`, `drawDreamGlider`, `renderDreamLanding`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawDreamGlideThorns(ctx, images, left, right, top, bottom)` | Função | [6](../src/js/dream-forest/dreamGliderRenderer.js#L6) | Desenha galhos espinhosos de cima/baixo sem indicadores de hitbox. |
| `drawDreamLaunchLeaf(ctx, images, branch, time)` | Função | [30](../src/js/dream-forest/dreamGliderRenderer.js#L30) | Apresenta a única folha ainda presa à ponta do galho. |
| `drawDreamGlider(ctx, images, state)` | Função | [40](../src/js/dream-forest/dreamGliderRenderer.js#L40) | Desenha menina e folha como pintura íntegra com mãos conectadas. |
| `renderDreamLanding(ctx, canvas, state, images)` | Função | [51](../src/js/dream-forest/dreamGliderRenderer.js#L51) | Compõe fim da sustentação, perda da folha, queda e amortecimento no chão em tela cheia. |

## src/js/dream-forest/dreamIllustratedSprites.js

[Implementação](../src/js/dream-forest/dreamIllustratedSprites.js). Contratos exportados/reexportados: `prepareDreamIllustrations`, `drawDreamLeaf`, `dreamBeeWingPose`, `drawDreamBee`, `drawDreamBranch`, `drawDreamWeb`, `drawDreamGrass`, `prepareDreamBackdrop`, `drawDreamBackdrop`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `canvas(width, height)` | Função | [6](../src/js/dream-forest/dreamIllustratedSprites.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sample(values, u)` | Função | [13](../src/js/dream-forest/dreamIllustratedSprites.js#L13) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareDreamIllustrations(leafImage, branchImage)` | Função | [19](../src/js/dream-forest/dreamIllustratedSprites.js#L19) | Prepara em cache folhas e galhos pintados nas larguras existentes, registrados nas superfícies físicas. |
| `drawDreamLeaf(ctx, image, cache, f, bottom)` | Função | [141](../src/js/dream-forest/dreamIllustratedSprites.js#L141) | Desenha folha e caule ilustrados; prolonga a base abaixo do viewport sem alterar o apoio. |
| `dreamBeeWingPose(time)` | Função | [160](../src/js/dream-forest/dreamIllustratedSprites.js#L160) | Calcula abertura e rotação contínuas das asas da abelhinha do bem pelo relógio do sonho. |
| `drawDreamBee(ctx, image, f, time)` | Função | [168](../src/js/dream-forest/dreamIllustratedSprites.js#L168) | Pinta o corpo íntegro com cotonete e articula as asas como camada separada. |
| `drawDreamBranch(ctx, image, cache, f, bottom, top)` | Função | [196](../src/js/dream-forest/dreamIllustratedSprites.js#L196) | Pinta tronco ancorado e galho ao vento, registrado na superfície física sem linhas auxiliares. |
| `drawDreamWeb(ctx, image, f, time, puppet)` | Função | [212](../src/js/dream-forest/dreamIllustratedSprites.js#L212) | Desenha seda até a aranha móvel e sua pintura, compartilhando a posição da simulação. |
| `drawDreamGrass(ctx, image, cache, f, bottom)` | Função | [234](../src/js/dream-forest/dreamIllustratedSprites.js#L234) | Deforma material pintado de lâmina e caule na linha física da grama. |
| `prepareDreamBackdrop(image)` | Função | [259](../src/js/dream-forest/dreamIllustratedSprites.js#L259) | Prepara a pintura do fundo com dissolução das bordas, sem espelhamento. |
| `drawDreamBackdrop(ctx, image, width, height, x)` | Função | [273](../src/js/dream-forest/dreamIllustratedSprites.js#L273) | Compõe a faixa de floresta sem criar árvores bilaterais nas emendas. |

## src/js/dream-forest/dreamLevel.js

[Implementação](../src/js/dream-forest/dreamLevel.js). Contratos exportados/reexportados: `DREAM`, `DREAM_SECTIONS`, `DREAM_OBJECTS`, `DREAM_WIDTH`, `DREAM_BY_ID`, `dreamNearby`, `dreamObjectFrame`, `dreamGrassX`, `dreamSurface`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamNearby(left, right)` | Função | [199](../src/js/dream-forest/dreamLevel.js#L199) | Consulta células espaciais para limitar física e pintura à vizinhança, sem depender do viewport. |
| `dreamObjectFrame(o, time, rides = {})` | Função | [206](../src/js/dream-forest/dreamLevel.js#L206) | Calcula o deslocamento determinístico de hastes e insetos a partir do relógio salvo. |
| `dreamGrassX(frame, y)` | Função | [287](../src/js/dream-forest/dreamLevel.js#L287) | Calcula a curva compartilhada da haste; a ponta recebe vento e o caule abaixo da lâmina mantém a base fixa. |
| `dreamSurface(frame, x, profiles = {})` | Função | [292](../src/js/dream-forest/dreamLevel.js#L292) | Consulta relevo da folha ou perfil alfa nativo do inseto para apoiar os pés sem régua auxiliar. |

## src/js/dream-forest/dreamMud.js

[Implementação](../src/js/dream-forest/dreamMud.js). Contratos exportados/reexportados: `DREAM_MUD_LAKES`, `mudWaterline`, `mudLakeAt`, `mudBankY`, `mudGround`, `createMudState`, `enterDreamMud`, `stepDreamMud`, `mudActor`, `mudOccludesPoint`, `mudCheckpoint`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(v, a, b)` | Função atribuída | [2](../src/js/dream-forest/dreamMud.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `smooth(t)` | Função atribuída | [3](../src/js/dream-forest/dreamMud.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mudWaterline(lake, x)` | Função | [75](../src/js/dream-forest/dreamMud.js#L75) | Interpola a superfície curva do lago, compartilhada pela pintura frontal, corpo e oclusão. |
| `mudLakeAt(x)` | Função | [85](../src/js/dream-forest/dreamMud.js#L85) | Localiza a área líquida atravessável do lago pelas margens autoradas. |
| `mudBankY(lake, side)` | Função | [88](../src/js/dream-forest/dreamMud.js#L88) | Retorna a altura de apoio da margem de entrada ou saída. |
| `mudGround(x)` | Função | [92](../src/js/dream-forest/dreamMud.js#L92) | Mantém fundo sob a lama e conecta as margens à terra firme. |
| `createMudState()` | Função | [107](../src/js/dream-forest/dreamMud.js#L107) | Cria o estado serializável de entrada, nado, braçada e saída da lama. |
| `enterDreamMud(n, lake, { side = n.facing, submerged = false } = {})` | Função | [121](../src/js/dream-forest/dreamMud.js#L121) | Inicia o salto de entrada na lama ou uma retomada já submersa. |
| `stepDreamMud(n, input, dt)` | Função | [141](../src/js/dream-forest/dreamMud.js#L141) | Integra arco do salto, impacto/imersão, nado e saída própria das margens. |
| `mudActor(n)` | Função | [211](../src/js/dream-forest/dreamMud.js#L211) | Compartilha pose e âncora de pés, superfície ou mão entre desenho e detecção. |
| `mudOccludesPoint(point)` | Função | [277](../src/js/dream-forest/dreamMud.js#L277) | Oculta pixels abaixo da superfície opaca desenhada do lago. |
| `mudCheckpoint(index)` | Função | [282](../src/js/dream-forest/dreamMud.js#L282) | Retoma um dos setores de lama dentro de um lago, já protegida. |

## src/js/dream-forest/dreamNightmare.js

[Implementação](../src/js/dream-forest/dreamNightmare.js). Contratos exportados/reexportados: `NIGHTMARE`, `NIGHTMARE_INTRO`, `NIGHTMARE_WAKE`, `NIGHTMARE_ROCKS`, `nightmarePatrol`, `nightmareLights`, `nightmareRayEnd`, `nightmareBeam`, `nightmareVisibility`, `beginDreamNightmare`, `migrateNightmare`, `nightmareReading`, `advanceNightmareDialogue`, `validateNightmare`, `stepDreamNightmare`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(x, a, b)` | Função atribuída | [64](../src/js/dream-forest/dreamNightmare.js#L64) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `smooth(t)` | Função atribuída | [65](../src/js/dream-forest/dreamNightmare.js#L65) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `angleDifference(a, b)` | Função atribuída | [69](../src/js/dream-forest/dreamNightmare.js#L69) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `nightmarePatrol(n, stage = 'STEALTH', age = 0)` | Função | [72](../src/js/dream-forest/dreamNightmare.js#L72) | Deriva posição e mira da barata exclusivamente do relógio salvo. |
| `nightmareLights(n, difficulty = 'NORMAL', stage = 'STEALTH', age = 0)` | Função | [99](../src/js/dream-forest/dreamNightmare.js#L99) | Converte os olhos medidos na pintura nas duas origens físicas de luz. |
| `nightmareRayEnd(light, angle, limit = NIGHTMARE.range)` | Função | [115](../src/js/dream-forest/dreamNightmare.js#L115) | Encontra a primeira interseção de um raio com as silhuetas opacas das pedras. |
| `nightmareBeam(light)` | Função | [147](../src/js/dream-forest/dreamNightmare.js#L147) | Monta o polígono de luz visível incluindo tangentes e sombras das pedras. |
| `nightmareVisibility(n, difficulty = 'NORMAL', { onlyLight = false, detection = false } = {},)` | Função | [166](../src/js/dream-forest/dreamNightmare.js#L166) | Consulta silhueta/oclusão e um núcleo lógico menor somente na captura EASY, mantendo a luz. |
| `beginDreamNightmare(s, { retry = false, checkpoint = 0 } = {})` | Função | [214](../src/js/dream-forest/dreamNightmare.js#L214) | Cria o domínio do trecho final na queda ou na retomada da primeira pedra. |
| `migrateNightmare(s)` | Função | [262](../src/js/dream-forest/dreamNightmare.js#L262) | Migra o trecho curto e os saves intermediários para o terreno contínuo e exposição à luz. |
| `nightmareReading(s)` | Função | [340](../src/js/dream-forest/dreamNightmare.js#L340) | Identifica quadros adiáveis sem permitir saltar a captura final ou o susto inicial. |
| `advanceNightmareDialogue(s)` | Função | [349](../src/js/dream-forest/dreamNightmare.js#L349) | Adianta uma leitura da furtividade ou do despertar, consumindo apenas um quadro. |
| `validateNightmare(s)` | Função | [378](../src/js/dream-forest/dreamNightmare.js#L378) | Valida relógio, corpo, leitura e coerência do grito/despertar no save. |
| `stepDreamNightmare(s, input = {}, seconds = 0)` | Função | [495](../src/js/dream-forest/dreamNightmare.js#L495) | Integra caminhada, luz/detecção, golpe fatal, captura autorada e despertar em subpassos. |

## src/js/dream-forest/dreamNightmareArt.js

[Implementação](../src/js/dream-forest/dreamNightmareArt.js). Contratos exportados/reexportados: `DREAM_NIGHTMARE_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/dream-forest/dreamNightmareCinematic.js

[Implementação](../src/js/dream-forest/dreamNightmareCinematic.js). Contratos exportados/reexportados: `nightmareCinematicShot`, `drawNightmareCinematicGirl`, `renderNightmareCinematic`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smooth(t)` | Função atribuída | [9](../src/js/dream-forest/dreamNightmareCinematic.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `nightmareCinematicShot(age, portrait = false)` | Função | [14](../src/js/dream-forest/dreamNightmareCinematic.js#L14) | Seleciona caminhada, reação, close da criatura e captura por relógio narrativo. |
| `drawNightmareCinematicGirl(ctx, image, index, x, base, height, time, { walking = false, tilt = 0 } = {},)` | Função | [48](../src/js/dream-forest/dreamNightmareCinematic.js#L48) | Desenha atuações mantendo recorte, escala e âncora dos pés. |
| `renderNightmareCinematic(ctx, canvas, s, images, rig)` | Função | [82](../src/js/dream-forest/dreamNightmareCinematic.js#L82) | Compõe cenário e atores em planos próprios, sem câmera nem mapa de gameplay. |

## src/js/dream-forest/dreamNightmareEntrance.js

[Implementação](../src/js/dream-forest/dreamNightmareEntrance.js). Contratos exportados/reexportados: `nightmareEntranceMoment`, `renderNightmareEntrance`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smooth(t)` | Função atribuída | [8](../src/js/dream-forest/dreamNightmareEntrance.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `nightmareEntranceMoment(s)` | Função | [13](../src/js/dream-forest/dreamNightmareEntrance.js#L13) | Seleciona chegada, leitura, emergência, susto, fuga e abrigo pelo relógio salvo. |
| `foregroundTrees(ctx, image)` | Função | [31](../src/js/dream-forest/dreamNightmareEntrance.js#L31) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderNightmareEntrance(ctx, canvas, s, images, rig, { onAdvance = () => {} } = {},)` | Função | [54](../src/js/dream-forest/dreamNightmareEntrance.js#L54) | Compõe a entrada em planos próprios, com árvores em primeiro plano e diálogos padrão. |

## src/js/dream-forest/dreamOpening.js

[Implementação](../src/js/dream-forest/dreamOpening.js). Contratos exportados/reexportados: `DREAM_OPENING_BEATS`, `dreamOpeningBeat`, `advanceDreamOpening`, `stepDreamOpening`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamOpeningBeat(s)` | Função | [50](../src/js/dream-forest/dreamOpening.js#L50) | Consulta o momento autorado a partir do índice persistido da abertura. |
| `advanceDreamOpening(s)` | Função | [54](../src/js/dream-forest/dreamOpening.js#L54) | Dispensa uma fala visível preservando o mínimo de atuação do momento. |
| `stepDreamOpening(s, input, seconds)` | Função | [62](../src/js/dream-forest/dreamOpening.js#L62) | Avança os sete momentos e libera a travessia sem herdar o pulo da leitura. |

## src/js/dream-forest/dreamOpeningRenderer.js

[Implementação](../src/js/dream-forest/dreamOpeningRenderer.js). Contratos exportados/reexportados: `renderDreamOpening`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smooth(t)` | Função atribuída | [6](../src/js/dream-forest/dreamOpeningRenderer.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `openingLayout(ctx, canvas)` | Função | [12](../src/js/dream-forest/dreamOpeningRenderer.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actor(ctx, image, f, x, base, k, { flip = false, hand = null } = {})` | Função | [59](../src/js/dream-forest/dreamOpeningRenderer.js#L59) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderDreamOpening(ctx, canvas, s, images, { onAdvance = () => {} } = {})` | Função | [76](../src/js/dream-forest/dreamOpeningRenderer.js#L76) | Compõe Yuna, Nanda adormecida, mãos em contato, moldura e transição final. |

## src/js/dream-forest/dreamRoach.js

[Implementação](../src/js/dream-forest/dreamRoach.js). Contratos exportados/reexportados: `ROACH_JOINTS`, `ROACH_STEP_SECONDS`, `solveRoachLeg`, `dreamRoachLegPoints`, `prepareDreamRoach`, `dreamRoachPose`, `dreamRoachPoint`, `drawDreamRoach`, `drawDreamRoachReach`, `destroyDreamRoach`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `path(ctx, points)` | Função | [266](../src/js/dream-forest/dreamRoach.js#L266) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canvas(w, h)` | Função | [272](../src/js/dream-forest/dreamRoach.js#L272) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `crop(image, polygon)` | Função | [279](../src/js/dream-forest/dreamRoach.js#L279) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clamp(n, a, b)` | Função atribuída | [296](../src/js/dream-forest/dreamRoach.js#L296) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `smooth(t)` | Função atribuída | [297](../src/js/dream-forest/dreamRoach.js#L297) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `solveRoachLeg(j, target)` | Função | [304](../src/js/dream-forest/dreamRoach.js#L304) | Resolve duas juntas com comprimentos e flexão preservados, normalizando ângulos. |
| `dreamRoachLegPoints(j, a, b)` | Função | [323](../src/js/dream-forest/dreamRoach.js#L323) | Retorna quadril, joelho e ponta dos segmentos rígidos pelas rotações usadas no desenho. |
| `prepareLeg(image, j)` | Função | [339](../src/js/dream-forest/dreamRoach.js#L339) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `segment(side)` | Função atribuída | [346](../src/js/dream-forest/dreamRoach.js#L346) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareDreamRoach(image)` | Função | [382](../src/js/dream-forest/dreamRoach.js#L382) | Prepara doze segmentos rígidos e seis juntas protegidas, cabeça e antenas, sem editar PNGs. |
| `dreamRoachPose(time, velocity = 160)` | Função | [419](../src/js/dream-forest/dreamRoach.js#L419) | Deriva passadas em tripés, cabeça, antenas e oscilação corporal do relógio salvo. |
| `dreamRoachPoint(p, u, v, { head = false } = {})` | Função | [458](../src/js/dream-forest/dreamRoach.js#L458) | Transforma os olhos pela mesma junta de cabeça usada na pintura e retorna a posição física. |
| `begin(ctx, p, rig)` | Função | [476](../src/js/dream-forest/dreamRoach.js#L476) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `leg(ctx, j, a, b)` | Função | [484](../src/js/dream-forest/dreamRoach.js#L484) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawDreamRoach(ctx, rig, p, { reaching = false } = {})` | Função | [499](../src/js/dream-forest/dreamRoach.js#L499) | Compõe a barata original com seis patas articuladas e investigação da cabeça e antenas. |
| `drawDreamRoachReach(ctx, rig, p, target, q)` | Função | [522](../src/js/dream-forest/dreamRoach.js#L522) | Resolve duas juntas da pata frontal até a menina durante golpe e captura. |
| `destroyDreamRoach(rig)` | Função | [540](../src/js/dream-forest/dreamRoach.js#L540) | Libera as superfícies de Canvas usadas pela barata articulada. |

## src/js/dream-forest/dreamRoachEffects.js

[Implementação](../src/js/dream-forest/dreamRoachEffects.js). Contratos exportados/reexportados: `roachFootfall`, `roachScreenShake`, `drawRoachDust`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(v)` | Função atribuída | [2](../src/js/dream-forest/dreamRoachEffects.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `roachFootfall(time, velocity = 160)` | Função | [4](../src/js/dream-forest/dreamRoachEffects.js#L4) | Consulta contato dos tripés no relógio determinístico de passadas. |
| `roachScreenShake(time, velocity = 160, stompAge = -1)` | Função | [16](../src/js/dream-forest/dreamRoachEffects.js#L16) | Produz tremor transitório da composição em pixels CSS sem mudar o frame físico. |
| `cloud(ctx, x, y, age, power, seed)` | Função | [27](../src/js/dream-forest/dreamRoachEffects.js#L27) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawRoachDust(ctx, rig, p, time, { stompAge = -1, stompPoint = null } = {})` | Função | [45](../src/js/dream-forest/dreamRoachEffects.js#L45) | Projeta poeira nos contatos das patas e na propagação do impacto final. |

## src/js/dream-forest/dreamSimulation.js

[Implementação](../src/js/dream-forest/dreamSimulation.js). Contratos exportados/reexportados: `DREAM_INTRO`, `createDreamState`, `restoreDreamState`, `advanceDreamDialogue`, `retryDream`, `stepDream`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createDreamRides()` | Função | [29](../src/js/dream-forest/dreamSimulation.js#L29) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `boardDreamBeetle(s, id, events)` | Função | [33](../src/js/dream-forest/dreamSimulation.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `placeDreamCheckpoint(s)` | Função | [43](../src/js/dream-forest/dreamSimulation.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createDreamState(difficulty = 'NORMAL')` | Função | [58](../src/js/dream-forest/dreamSimulation.js#L58) | Cria domínio5 do sonho: travessia aérea preservada e estado separado para furtividade, captura e despertar. |
| `restoreDreamState(saved, difficulty)` | Função | [100](../src/js/dream-forest/dreamSimulation.js#L100) | Valida estágio, números e IDs do sonho; reconstrói dados e conserva o bloqueio breve de reagarre, sem recursos de runtime. |
| `advanceDreamDialogue(s)` | Função | [291](../src/js/dream-forest/dreamSimulation.js#L291) | Adianta uma fala do sonho e consome o gesto antes de liberar movimento. |
| `retryDream(s)` | Função | [320](../src/js/dream-forest/dreamSimulation.js#L320) | Retoma uma folha e seus transportes; no pesadelo, retorna à primeira pedra sem repetir o voo. |
| `hitDreamSpider(s, near, events)` | Função | [339](../src/js/dream-forest/dreamSimulation.js#L339) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stepDream(s, input = {}, seconds = 0)` | Função | [372](../src/js/dream-forest/dreamSimulation.js#L372) | Avança subpassos1/120s: vento, aderência, escalada, salto, transporte, superfície medida, queda/recuperação e clareira. |

## src/js/dream-forest/dreamSpiderPuppet.js

[Implementação](../src/js/dream-forest/dreamSpiderPuppet.js). Contratos exportados/reexportados: `prepareDreamSpider`, `drawDreamSpider`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `prepareDreamSpider(image)` | Função | [78](../src/js/dream-forest/dreamSpiderPuppet.js#L78) | Prepara corpo e oito membros da pintura da aranha sem mudar sua física. |
| `path(c, ox, oy)` | Função atribuída | [100](../src/js/dream-forest/dreamSpiderPuppet.js#L100) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawDreamSpider(ctx, puppet, f, time)` | Função | [132](../src/js/dream-forest/dreamSpiderPuppet.js#L132) | Articula oito patas da aranha pelo relógio salvo ao trabalhar a seda. |

## src/js/dream-forest/dreamStealthLevel.js

[Implementação](../src/js/dream-forest/dreamStealthLevel.js). Contratos exportados/reexportados: `STEALTH_LEVEL`, `STEALTH_PLATFORMS`, `stealthGround`, `STEALTH_COVERS`, `STEALTH_MUD`, `stealthMudAt`, `stealthPose`, `stealthCheckpoint`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `stealthGround(x)` | Função | [35](../src/js/dream-forest/dreamStealthLevel.js#L35) | Retorna o chão contínuo, com topo pintado dos relevos e descida de terra até o caminho. |
| `top(position)` | Função atribuída | [42](../src/js/dream-forest/dreamStealthLevel.js#L42) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stealthMudAt(x)` | Função | [115](../src/js/dream-forest/dreamStealthLevel.js#L115) | Exige que o corpo inteiro caiba dentro da poça para permitir submersão. |
| `stealthPose(n)` | Função | [119](../src/js/dream-forest/dreamStealthLevel.js#L119) | Compartilha o índice da pose abaixada entre pintura, salto e detecção dos olhos. |
| `stealthCheckpoint(index)` | Função | [123](../src/js/dream-forest/dreamStealthLevel.js#L123) | Retorna o abrigo de retomada por setor e conserva submersão nos setores de lama. |

## src/js/dream-forest/dreamWeb.js

[Implementação](../src/js/dream-forest/dreamWeb.js). Contratos exportados/reexportados: `dreamSpiderContact`, `dreamWebCanGrab`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dreamSpiderContact(frame, player)` | Função | [2](../src/js/dream-forest/dreamWeb.js#L2) | Detecta contato entre o corpo da menina e a silhueta da aranha, incluindo a abertura das patas. |
| `dreamWebCanGrab(frame, gripY)` | Função | [9](../src/js/dream-forest/dreamWeb.js#L9) | Permite agarrar somente a seda existente, com espaço para os pés acima da aranha. |

## src/js/effects/ParticleSystem.js

[Implementação](../src/js/effects/ParticleSystem.js). Contratos exportados/reexportados: `ParticleSystem`, `createParticleSystem`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [14](../src/js/effects/ParticleSystem.js#L14) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `clear()` | Método declarado | [22](../src/js/effects/ParticleSystem.js#L22) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `spawnPlayerJumpDust(bx, bw, by, bh, bvx, isEscapeMode = false, escapeLevel = 0)` | Método declarado | [30](../src/js/effects/ParticleSystem.js#L30) | Cria partículas/efeitos no buffer correspondente. |
| `spawnPlayerJumpPuff(x, y, count = 5)` | Método declarado | [60](../src/js/effects/ParticleSystem.js#L60) | Cria partículas/efeitos no buffer correspondente. |
| `spawnPlayerLandingPuff(x, y, count = 5)` | Método declarado | [85](../src/js/effects/ParticleSystem.js#L85) | Cria partículas/efeitos no buffer correspondente. |
| `spawnPhase3Ribbons(player, phase3Level, stats, tick)` | Método declarado | [109](../src/js/effects/ParticleSystem.js#L109) | Cria partículas/efeitos no buffer correspondente. |
| `spawnEscapeRibbons(player, escapeLevel, stats, tick)` | Método declarado | [136](../src/js/effects/ParticleSystem.js#L136) | Cria partículas/efeitos no buffer correspondente. |
| `update(dt = 1.0)` | Método declarado | [163](../src/js/effects/ParticleSystem.js#L163) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updatePlayerJumpDust(dt = 1.0)` | Método declarado | [171](../src/js/effects/ParticleSystem.js#L171) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateSpeedRibbons(dt = 1.0)` | Método declarado | [188](../src/js/effects/ParticleSystem.js#L188) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `renderSpeedRibbons(ctx, canvas, camX)` | Método declarado | [203](../src/js/effects/ParticleSystem.js#L203) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderPlayerJumpDust(ctx, canvas, camX)` | Método declarado | [223](../src/js/effects/ParticleSystem.js#L223) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `render(ctx, canvas, camX)` | Método declarado | [263](../src/js/effects/ParticleSystem.js#L263) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `createParticleSystem(options = {})` | Função | [269](../src/js/effects/ParticleSystem.js#L269) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/effects/TransitionEffects.js

[Implementação](../src/js/effects/TransitionEffects.js). Contratos exportados/reexportados: `TransitionEffects`, `transitionEffects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderPortalWipe(ctx, canvas, cameraX, cameraY, trueExitDoor, transitionWipeAlpha, tick = 0, presentationTransform = null,)` | Método declarado | [20](../src/js/effects/TransitionEffects.js#L20) | Desenha transição do portal usando matriz de apresentação quando fornecida. |

## src/js/effects/artFinish.js

[Implementação](../src/js/effects/artFinish.js). Contratos exportados/reexportados: `applyArtFinish`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `applyArtFinish(ctx, canvas)` | Função | [2](../src/js/effects/artFinish.js#L2) | Aplica dessaturação em coordenadas de tela. |

## src/js/effects/index.js

[Implementação](../src/js/effects/index.js). Contratos exportados/reexportados: `ParticleSystem`, `createParticleSystem`, `TransitionEffects`, `transitionEffects`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/entities/FairyRenderer.js

[Implementação](../src/js/entities/FairyRenderer.js). Contratos exportados/reexportados: `FairyRenderer`, `fairyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `render(ctx, fairy, state = {}, camX = 0, options = {})` | Método declarado | [18](../src/js/entities/FairyRenderer.js#L18) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/entities/GirlRenderer.js

[Implementação](../src/js/entities/GirlRenderer.js). Contratos exportados/reexportados: `GirlRenderer`, `girlRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [10](../src/js/entities/GirlRenderer.js#L10) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | [16](../src/js/entities/GirlRenderer.js#L16) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `resolveAnimationState(player, state)` | Método declarado | [22](../src/js/entities/GirlRenderer.js#L22) | Escolhe animação oficial conforme ação e flags do estado. |
| `renderPose(ctx, assets, pose, frameIndex, centerX, feetY, height, facing = 1, visualScale = 1)` | Método declarado | [141](../src/js/entities/GirlRenderer.js#L141) | Desenha recorte ancorado no centro/pés, com escala visual. |
| `render(ctx, player, state = {}, camX = 0, options = {})` | Método declarado | [201](../src/js/entities/GirlRenderer.js#L201) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/entities/girlBodyLayers.js

[Implementação](../src/js/entities/girlBodyLayers.js). Contratos exportados/reexportados: `applyGirlBodyTransform`, `drawGirlUpperBody`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `canvas(width, height)` | Função | [3](../src/js/entities/girlBodyLayers.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `polygon(ctx, points)` | Função | [10](../src/js/entities/girlBodyLayers.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `layers(assets, frame, body, carrying)` | Função | [17](../src/js/entities/girlBodyLayers.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `copy()` | Função atribuída | [97](../src/js/entities/girlBodyLayers.js#L97) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `applyGirlBodyTransform(ctx, pose)` | Função | [165](../src/js/entities/girlBodyLayers.js#L165) | Aplica translação do quadril, oscilação e rotação do tronco também às mãos e ao brinquedo transportado. |
| `image(ctx, layer, frame)` | Função | [171](../src/js/entities/girlBodyLayers.js#L171) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arm(ctx, parts, index, angle)` | Função | [175](../src/js/entities/girlBodyLayers.js#L175) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clothes(ctx, parts, pose, alpha)` | Função | [188](../src/js/entities/girlBodyLayers.js#L188) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawGirlUpperBody(ctx, assets, frame, body, idleFrame, idleBody, pose, amount, carrying,)` | Função | [205](../src/js/entities/girlBodyLayers.js#L205) | Compõe cabeça estabilizada, cabelo, braços em oposição e vestido com atraso; preserva uma única cabeça na mistura. |

## src/js/entities/girlGait.js

[Implementação](../src/js/entities/girlGait.js). Contratos exportados/reexportados: `girlGaitDirection`, `sampleGirlLocomotion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(v, a, b)` | Função atribuída | [2](../src/js/entities/girlGait.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `smooth(t)` | Função atribuída | [3](../src/js/entities/girlGait.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `smoother(t)` | Função atribuída | [4](../src/js/entities/girlGait.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `curve(t, keys)` | Função | [7](../src/js/entities/girlGait.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `girlGaitDirection()` | Função | [19](../src/js/entities/girlGait.js#L19) | Mantém o perfil lateral coerente entre pernas e tronco; o chamador espelha esquerda/direita, sem girar só as pernas ao mover em profundidade. |
| `sampleGirlLocomotion(distance, carrying = false, amount = 1, direction = { x: 1, y: 0, },)` | Função | [28](../src/js/entities/girlGait.js#L28) | Amostra apoio, elevação, joelho, tronco, cabeça, braços e vestido por distância; transportar reduz a oscilação. |

## src/js/entities/girlLocomotion.js

[Implementação](../src/js/entities/girlLocomotion.js). Contratos exportados/reexportados: `drawGirlLocomotion`, `girlLocomotionDistance`, `renderGirlRun`, `sampleGirlLocomotion`, `girlGaitDirection`, `applyGirlBodyTransform`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, low, high)` | Função atribuída | [8](../src/js/entities/girlLocomotion.js#L8) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `smooth(value)` | Função atribuída | [9](../src/js/entities/girlLocomotion.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canvas(width, height)` | Função | [11](../src/js/entities/girlLocomotion.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepare(assets)` | Função | [19](../src/js/entities/girlLocomotion.js#L19) | Prepara contexto visual da introdução; consulte dependências no módulo. |
| `bodyLayer(data, assets, frame)` | Função | [33](../src/js/entities/girlLocomotion.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restingLegLayer(data, assets, frame)` | Função | [63](../src/js/entities/girlLocomotion.js#L63) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `legParts(data, assets)` | Função | [82](../src/js/entities/girlLocomotion.js#L82) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawLeg(ctx, parts, leg, index)` | Função | [147](../src/js/entities/girlLocomotion.js#L147) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawGirlLocomotion(ctx, assets, frame, distance, carrying = false, amount = 1, direction = { x: 1, y: 0, },)` | Função | [180](../src/js/entities/girlLocomotion.js#L180) | Compõe repouso original e membros articulados com transição contínua; retorna false se faltarem fontes. |
| `girlLocomotionDistance(animTime, height, room = false)` | Função | [243](../src/js/entities/girlLocomotion.js#L243) | Converte animTime legado para distância na pintura, com calibração distinta para quarto e sala. |
| `renderGirlRun(ctx, assets, actor, centerX, feetY, height, facing, visualScale = 1, room = false,)` | Função | [248](../src/js/entities/girlLocomotion.js#L248) | Ancora a menina nos pés, aplica escala/espelhamento e compartilha a atuação entre explorações, sem mudar corpos físicos. |

## src/js/entities/index.js

[Implementação](../src/js/entities/index.js). Contratos exportados/reexportados: `GirlRenderer`, `girlRenderer`, `FairyRenderer`, `fairyRenderer`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/environment/BackgroundRenderer.js

[Implementação](../src/js/environment/BackgroundRenderer.js). Contratos exportados/reexportados: `getBackgroundViewport`, `BackgroundRenderer`, `backgroundRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getBackgroundViewport(ctx, canvas)` | Função | [13](../src/js/environment/BackgroundRenderer.js#L13) | Inverte a matriz real para determinar os limites visíveis do fundo. |
| `constructor(options = {})` | Método declarado | [47](../src/js/environment/BackgroundRenderer.js#L47) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | [55](../src/js/environment/BackgroundRenderer.js#L55) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `drawAtlasSceneryItem(ctx, assets, type, sx, item, floorY)` | Método declarado | [63](../src/js/environment/BackgroundRenderer.js#L63) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderWall(ctx, canvas, camX = 0, options = {})` | Método declarado | [186](../src/js/environment/BackgroundRenderer.js#L186) | Desenha parede, parallax, piso e rodapé com cobertura do viewport. |
| `renderScenery(ctx, canvas, scenery = defaultRoomScenery, camX = 0, options = {})` | Método declarado | [605](../src/js/environment/BackgroundRenderer.js#L605) | Desenha objetos decorativos do piso. |
| `render(ctx, canvas, camX = 0, options = {})` | Método declarado | [784](../src/js/environment/BackgroundRenderer.js#L784) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/environment/DarkRoomContact.js

[Implementação](../src/js/environment/DarkRoomContact.js). Contratos exportados/reexportados: `DarkRoomContact`, `getDarkRoomFeet`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(renderer, assets)` | Método declarado | [9](../src/js/environment/DarkRoomContact.js#L9) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `prepare(platforms)` | Método declarado | [16](../src/js/environment/DarkRoomContact.js#L16) | Prepara contexto visual da introdução; consulte dependências no módulo. |
| `bounds(platform)` | Método declarado | [61](../src/js/environment/DarkRoomContact.js#L61) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `height(platform, feet)` | Método declarado | [74](../src/js/environment/DarkRoomContact.js#L74) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resolve(player, state, platforms, dt)` | Método declarado | [90](../src/js/environment/DarkRoomContact.js#L90) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getDarkRoomFeet(player, state = {})` | Função | [158](../src/js/environment/DarkRoomContact.js#L158) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/environment/LightingSystem.js

[Implementação](../src/js/environment/LightingSystem.js). Contratos exportados/reexportados: `LightingSystem`, `createLightingSystem`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [25](../src/js/environment/LightingSystem.js#L25) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `resize(width, height)` | Método declarado | [36](../src/js/environment/LightingSystem.js#L36) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `apply(ctx, canvas, state = {}, player = {}, fairy = {}, camX = 0, camY = 0, options = {})` | Método declarado | [46](../src/js/environment/LightingSystem.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pool(x, y, rx, ry, strength)` | Função atribuída | [90](../src/js/environment/LightingSystem.js#L90) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createLightingSystem(options = {})` | Função | [223](../src/js/environment/LightingSystem.js#L223) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/environment/PlatformRenderer.js

[Implementação](../src/js/environment/PlatformRenderer.js). Contratos exportados/reexportados: `PLATFORM_SURFACES`, `PlatformRenderer`, `platformRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(options = {})` | Método declarado | [239](../src/js/environment/PlatformRenderer.js#L239) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setAssets(assets)` | Método declarado | [247](../src/js/environment/PlatformRenderer.js#L247) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `drawAtlasPlatformSprite(ctx, assets, style, sx, p, tick = 0)` | Método declarado | [255](../src/js/environment/PlatformRenderer.js#L255) | Recorta/calibra sprite de plataforma; não redefine colisões. |
| `renderPlatforms(ctx, canvas, camX = 0, options = {})` | Método declarado | [1025](../src/js/environment/PlatformRenderer.js#L1025) | Desenha apoios com atlas/alternativas e descarte visual. |
| `renderExitDoor(ctx, canvas, camX = 0, options = {})` | Método declarado | [1564](../src/js/environment/PlatformRenderer.js#L1564) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderTrueExitDoor(ctx, canvas, camX = 0, options = {})` | Método declarado | [1623](../src/js/environment/PlatformRenderer.js#L1623) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderTutorialArrow(ctx, canvas, camX = 0, options = {})` | Método declarado | [1776](../src/js/environment/PlatformRenderer.js#L1776) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/environment/index.js

[Implementação](../src/js/environment/index.js). Contratos exportados/reexportados: `BackgroundRenderer`, `backgroundRenderer`, `PlatformRenderer`, `platformRenderer`, `LightingSystem`, `createLightingSystem`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/environment/nightWindows.js

[Implementação](../src/js/environment/nightWindows.js). Contratos exportados/reexportados: `NIGHT_WINDOWS`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/environment/storybookPlatforms.js

[Implementação](../src/js/environment/storybookPlatforms.js). Contratos exportados/reexportados: `drawContactEdge`, `drawStorybookPlatform`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `gradient(ctx, y, h, colors)` | Função | [12](../src/js/environment/storybookPlatforms.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `box(ctx, x, y, w, h, material = 'wood', radius = 3)` | Função | [18](../src/js/environment/storybookPlatforms.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `line(ctx, points, color = INK, width = 1)` | Função | [48](../src/js/environment/storybookPlatforms.js#L48) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ellipse(ctx, x, y, rx, ry, color)` | Função | [56](../src/js/environment/storybookPlatforms.js#L56) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawContactEdge(ctx, x, y, w, material = 'wood', depth = 5)` | Função | [65](../src/js/environment/storybookPlatforms.js#L65) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `book(ctx, x, y, w, h, material = 'purple')` | Função | [86](../src/js/environment/storybookPlatforms.js#L86) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawToy(ctx, p, w, assets, tick)` | Função | [106](../src/js/environment/storybookPlatforms.js#L106) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawStorybookPlatform(ctx, assets, p, sx, tick = 0)` | Função | [430](../src/js/environment/storybookPlatforms.js#L430) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/game.js

[Implementação](../src/js/game.js). Contratos exportados/reexportados: `createGame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createGame(canvas, uiFeedback, callbacks = {})` | Função | [54](../src/js/game.js#L54) | Cria o coordenador e devolve a API de integração com a página. |
| `onGameOver()` | API/lambda de objeto | [79](../src/js/game.js#L79) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onComplete()` | API/lambda de objeto | [104](../src/js/game.js#L104) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onEvent(name)` | API/lambda de objeto | [109](../src/js/game.js#L109) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginToyRoomIntroduction()` | Função | [117](../src/js/game.js#L117) | Captura saída e cria sala de apresentação sem input antes da fase ativa. |
| `onCue(name)` | API/lambda de objeto | [142](../src/js/game.js#L142) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginOpeningGameplay()` | Função | [154](../src/js/game.js#L154) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enterFirstJumpTutorial()` | Função | [179](../src/js/game.js#L179) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncViewportFromState()` | Função | [196](../src/js/game.js#L196) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `syncViewportToState()` | Função | [201](../src/js/game.js#L201) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setLastInputDevice(dev)` | Função | [206](../src/js/game.js#L206) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getActivePromptDevice()` | Função | [211](../src/js/game.js#L211) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `startStandbyPreparation()` | Função | [216](../src/js/game.js#L216) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `confirmStandby()` | Função | [223](../src/js/game.js#L223) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetPlayerPhysicsBody(targetX, targetY, facing = 1)` | Função | [231](../src/js/game.js#L231) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `triggerGameOver()` | Função | [238](../src/js/game.js#L238) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isGameOver()` | Função | [245](../src/js/game.js#L245) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `reportDefeat(phase)` | Função | [262](../src/js/game.js#L262) | Deduplica, salva e publica a derrota da fase ativa com a oferta de ajuda. |
| `retryGame()` | Função | [273](../src/js/game.js#L273) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `continueOnEasy()` | Função | [291](../src/js/game.js#L291) | Aplica EASY às instâncias atuais e retoma a seção/adversário/percurso com progresso preservado. |
| `declineEasyOffer()` | Função | [315](../src/js/game.js#L315) | Recusa a oferta sem alterar dificuldade, contagem ou progresso. |
| `restartToTitle()` | Função | [321](../src/js/game.js#L321) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startToyRoomIntroduction()` | Função | [335](../src/js/game.js#L335) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startToyRoomPhase({ fromIntroduction = false } = {})` | Função | [356](../src/js/game.js#L356) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `isInputEnabled()` | API/lambda de objeto | [382](../src/js/game.js#L382) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `onOrientation(portrait)` | API/lambda de objeto | [412](../src/js/game.js#L412) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handleResize()` | Função | [418](../src/js/game.js#L418) | Dimensiona bitmap e canvases auxiliares a partir do layout CSS. |
| `startTruePortalTransition()` | Função | [436](../src/js/game.js#L436) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `showFailMessage()` | Função | [443](../src/js/game.js#L443) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startCastleCutscene()` | Função | [448](../src/js/game.js#L448) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advanceCutscene()` | Função | [455](../src/js/game.js#L455) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishCutscene()` | Função | [462](../src/js/game.js#L462) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startPlotTwistCutscene()` | Função | [470](../src/js/game.js#L470) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advancePlotTwist()` | Função | [477](../src/js/game.js#L477) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishPlotTwistAndStartTutorial()` | Função | [484](../src/js/game.js#L484) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetToStart(failedMidClimb = false, shouldPlayFailSound = true)` | Função | [491](../src/js/game.js#L491) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `doJump(inputSource)` | Função | [499](../src/js/game.js#L499) | Seleciona salto ou avanço narrativo conforme o estado atual. |
| `spawnFairyFlightDust(fx, fy, fvx, fvy)` | Função | [662](../src/js/game.js#L662) | Cria partículas/efeitos no buffer correspondente. |
| `spawnFairySparkles(x, y, count = 2)` | Função | [667](../src/js/game.js#L667) | Cria partículas/efeitos no buffer correspondente. |
| `updateFairyParticles()` | Função | [672](../src/js/game.js#L672) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `spawnPlayerJumpDust(bx, bw, by, bh, bvx)` | Função | [678](../src/js/game.js#L678) | Cria partículas/efeitos no buffer correspondente. |
| `spawnPlayerJumpPuff(x, y, count = 5)` | Função | [683](../src/js/game.js#L683) | Cria partículas/efeitos no buffer correspondente. |
| `spawnPlayerLandingPuff(x, y)` | Função | [688](../src/js/game.js#L688) | Cria partículas/efeitos no buffer correspondente. |
| `updatePlayerJumpDust(dt = 1.0)` | Função | [693](../src/js/game.js#L693) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `drawBackgroundWall(camX)` | Função | [700](../src/js/game.js#L700) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawSceneryItems(camX)` | Função | [708](../src/js/game.js#L708) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawPlatforms(camX)` | Função | [715](../src/js/game.js#L715) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawExitDoor(camX)` | Função | [727](../src/js/game.js#L727) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawTrueExitDoor(camX)` | Função | [739](../src/js/game.js#L739) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawPlayerManaStyle(camX)` | Função | [750](../src/js/game.js#L750) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFairy(camX)` | Função | [760](../src/js/game.js#L760) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `applyDarkAtmosphereWithLights(camX, camY = 0)` | Função | [772](../src/js/game.js#L772) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawSpeedRibbons(camX)` | Função | [784](../src/js/game.js#L784) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawPlayerJumpDust(camX)` | Função | [789](../src/js/game.js#L789) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawEscapeBanner()` | Função | [795](../src/js/game.js#L795) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialoguePortrait(pCtx, charType, px, py, radius, mood = 'normal')` | Função | [800](../src/js/game.js#L800) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapDialogueText(pCtx, text, maxWidth)` | Função | [807](../src/js/game.js#L807) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawCutsceneDialogue(transform)` | Função | [812](../src/js/game.js#L812) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawTutorialArrow(camX)` | Função | [837](../src/js/game.js#L837) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `update(dt = 1.0)` | Função | [848](../src/js/game.js#L848) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `onLagBehind()` | API/lambda de objeto | [1280](../src/js/game.js#L1280) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Função | [1290](../src/js/game.js#L1290) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `togglePause()` | Função | [1345](../src/js/game.js#L1345) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setPaused(value)` | Função | [1367](../src/js/game.js#L1367) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `saveProgress()` | Função | [1374](../src/js/game.js#L1374) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restoreProgress(saved)` | Função | [1393](../src/js/game.js#L1393) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `newCampaign({ preserveProgress = false } = {})` | Função | [1434](../src/js/game.js#L1434) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startDebugPhase(phase, difficulty = state.gameDifficulty)` | Função | [1470](../src/js/game.js#L1470) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `saveOnHide()` | Função atribuída | [1536](../src/js/game.js#L1536) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `snapshot(transform)` | API/lambda de objeto | [1544](../src/js/game.js#L1544) | Produz captura recuperável do estado específico deste componente. |
| `recordCameraQa(transform = null)` | Função | [1584](../src/js/game.js#L1584) | Emite observação optativa de câmera; ativada por cameraQa e callback de teste. |
| `loop(currentTime = performance.now())` | Função | [1589](../src/js/game.js#L1589) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isFirstJumpTutorial()` | API/lambda de objeto | [1633](../src/js/game.js#L1633) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGrounded()` | API/lambda de objeto | [1635](../src/js/game.js#L1635) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isCutsceneActive()` | API/lambda de objeto | [1645](../src/js/game.js#L1645) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isGameOver()` | API/lambda de objeto | [1655](../src/js/game.js#L1655) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isToyRoomMode()` | API/lambda de objeto | [1656](../src/js/game.js#L1656) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | API/lambda de objeto | [1658](../src/js/game.js#L1658) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `advanceDialogue(event)` | Função | [1662](../src/js/game.js#L1662) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `enabled()` | API/lambda de objeto | [1702](../src/js/game.js#L1702) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isModal()` | API/lambda de objeto | [1703](../src/js/game.js#L1703) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `pauseMusic()` | API/lambda de objeto | [1773](../src/js/game.js#L1773) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resumeMusic()` | API/lambda de objeto | [1775](../src/js/game.js#L1775) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setMasterVolume(v)` | API/lambda de objeto | [1777](../src/js/game.js#L1777) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getMasterVolume()` | API/lambda de objeto | [1779](../src/js/game.js#L1779) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setMuted(m)` | API/lambda de objeto | [1781](../src/js/game.js#L1781) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `isMuted()` | API/lambda de objeto | [1783](../src/js/game.js#L1783) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `toggleMute()` | API/lambda de objeto | [1785](../src/js/game.js#L1785) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isPaused()` | API/lambda de objeto | [1787](../src/js/game.js#L1787) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `hasProgress()` | API/lambda de objeto | [1793](../src/js/game.js#L1793) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `hasSavedCampaign()` | API/lambda de objeto | [1795](../src/js/game.js#L1795) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDifficulty()` | API/lambda de objeto | [1797](../src/js/game.js#L1797) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `destroy()` | Método declarado | [1812](../src/js/game.js#L1812) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |
| `start(difficulty = 'NORMAL')` | Método declarado | [1825](../src/js/game.js#L1825) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `isGrounded()` | API/lambda de objeto | [1849](../src/js/game.js#L1849) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isCutsceneActive()` | API/lambda de objeto | [1860](../src/js/game.js#L1860) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isToyRoomMode()` | API/lambda de objeto | [1887](../src/js/game.js#L1887) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/garden/GardenAudio.js

[Implementação](../src/js/garden/GardenAudio.js). Contratos exportados/reexportados: `GardenAudio`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(host, { track = new URL('../../../assets/audio/Blues Shuffle Loop.mp3', import.meta.url), label = 'do jardim', wingScene = 'garden', } = {},)` | Método declarado | [7](../src/js/garden/GardenAudio.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `unlock()` | Método declarado | [33](../src/js/garden/GardenAudio.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tone(frequency, duration = 0.25, volume = 0.035, slide = frequency)` | Método declarado | [41](../src/js/garden/GardenAudio.js#L41) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `hurt()` | Método declarado | [68](../src/js/garden/GardenAudio.js#L68) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playMusic()` | Método declarado | [102](../src/js/garden/GardenAudio.js#L102) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `update(state, paused = false)` | Método declarado | [118](../src/js/garden/GardenAudio.js#L118) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `event(type, { mudTakeoff = false } = {})` | Método declarado | [131](../src/js/garden/GardenAudio.js#L131) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sample(name, volume, deduplicate = false)` | Método declarado | [140](../src/js/garden/GardenAudio.js#L140) | Dispara pulo ou lama com volume mestre, pausa, mudo e deduplicação curta da vocalização. |
| `updateWings(state)` | Método declarado | [152](../src/js/garden/GardenAudio.js#L152) | Mantém até três emissores próximos de asas e atualiza o ganho das amostras ativas. |
| `clear()` | Método declarado | [187](../src/js/garden/GardenAudio.js#L187) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `destroy()` | Método declarado | [201](../src/js/garden/GardenAudio.js#L201) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/garden/GardenInput.js

[Implementação](../src/js/garden/GardenInput.js). Contratos exportados/reexportados: `gardenControls`, `GardenInput`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `gardenControls(canvas, safe = { left: 0, right: canvas.width, top: 0, bottom: canvas.height, }, { mobile = isMobileDevice() } = {},)` | Função | [4](../src/js/garden/GardenInput.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor(canvas, enabled, controls, unlock = () => {}, scene = () => null)` | Método declarado | [39](../src/js/garden/GardenInput.js#L39) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `install()` | Método declarado | [122](../src/js/garden/GardenInput.js#L122) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sample()` | Método declarado | [139](../src/js/garden/GardenInput.js#L139) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `has(name)` | Função atribuída | [147](../src/js/garden/GardenInput.js#L147) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `clear()` | Método declarado | [200](../src/js/garden/GardenInput.js#L200) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `destroy()` | Método declarado | [210](../src/js/garden/GardenInput.js#L210) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/garden/GardenPhase.js

[Implementação](../src/js/garden/GardenPhase.js). Contratos exportados/reexportados: `GardenPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ canvas, audio, enabled = () => true, difficulty = 'NORMAL', campaign = false })` | Método declarado | [14](../src/js/garden/GardenPhase.js#L14) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `enabled()` | API/lambda de objeto | [26](../src/js/garden/GardenPhase.js#L26) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isModal()` | API/lambda de objeto | [28](../src/js/garden/GardenPhase.js#L28) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `advance(event)` | API/lambda de objeto | [30](../src/js/garden/GardenPhase.js#L30) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `requestDialogueAdvance(event = {})` | Método declarado | [51](../src/js/garden/GardenPhase.js#L51) | No jardim, enfileira avanço de uma fala ou skip visto e bloqueia pulo até a liberação da entrada. |
| `reading()` | Método declarado | [66](../src/js/garden/GardenPhase.js#L66) | Consulta abertura ou encerramento ainda em leitura e o alvo de skip já visto; devolve null durante gameplay e sono concluído. |
| `active()` | Acessor | [81](../src/js/garden/GardenPhase.js#L81) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `start(saved = null)` | Método declarado | [85](../src/js/garden/GardenPhase.js#L85) | Restaura domínio opcional, recupera marcas de leitura, carrega recursos e instala entradas/listeners; publica erro de carga sem liberar movimento. |
| `update(dt = 1)` | Método declarado | [108](../src/js/garden/GardenPhase.js#L108) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [139](../src/js/garden/GardenPhase.js#L139) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `setPaused(value)` | Método declarado | [156](../src/js/garden/GardenPhase.js#L156) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `snapshot()` | Método declarado | [165](../src/js/garden/GardenPhase.js#L165) | Captura envelope versão 1 com cópia serializável do domínio; não inclui imagens, áudio ou listeners. |
| `retry()` | Método declarado | [172](../src/js/garden/GardenPhase.js#L172) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `destroy()` | Método declarado | [178](../src/js/garden/GardenPhase.js#L178) | Descarta avanço de diálogo, eventos de foco/visibilidade, controles, áudio e renderer de forma idempotente. |

## src/js/garden/GardenRenderer.js

[Implementação](../src/js/garden/GardenRenderer.js). Contratos exportados/reexportados: `GardenRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas)` | Método declarado | [57](../src/js/garden/GardenRenderer.js#L57) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [66](../src/js/garden/GardenRenderer.js#L66) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `controls()` | Método declarado | [129](../src/js/garden/GardenRenderer.js#L129) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(state)` | Método declarado | [133](../src/js/garden/GardenRenderer.js#L133) | Calcula pose visual estável sem escrever na simulação. |
| `sprite(ctx, set, index, x, y, height, flip = 1, fear = false, agitation = 0, reaction = 0)` | Método declarado | [145](../src/js/garden/GardenRenderer.js#L145) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prop(ctx, index, x, y, w, h, setName = 'objetos')` | Método declarado | [170](../src/js/garden/GardenRenderer.js#L170) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `groundPattern(type)` | Método declarado | [177](../src/js/garden/GardenRenderer.js#L177) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `groundOutline(ctx, p, bottom)` | Método declarado | [225](../src/js/garden/GardenRenderer.js#L225) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `surfaceTile(type, part = 'middle')` | Método declarado | [246](../src/js/garden/GardenRenderer.js#L246) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `groundSurface(ctx, p, joinedLeft, joinedRight)` | Método declarado | [300](../src/js/garden/GardenRenderer.js#L300) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `terrainBodies(ctx, platforms, bottom)` | Método declarado | [371](../src/js/garden/GardenRenderer.js#L371) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `terrain(ctx, p, bottom, body = true)` | Método declarado | [413](../src/js/garden/GardenRenderer.js#L413) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `aquaticSprite(ctx, index, x, y, w, h, flip = 1)` | Método declarado | [479](../src/js/garden/GardenRenderer.js#L479) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rockFoot(ctx, p)` | Método declarado | [490](../src/js/garden/GardenRenderer.js#L490) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `riverLife(ctx, s, water, left, right, bottom)` | Método declarado | [509](../src/js/garden/GardenRenderer.js#L509) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `waterFront(ctx, s, left, right, bottom, platforms)` | Método declarado | [561](../src/js/garden/GardenRenderer.js#L561) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `groundJoins(ctx, platforms)` | Método declarado | [598](../src/js/garden/GardenRenderer.js#L598) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `grassFront(ctx, s, platforms)` | Método declarado | [619](../src/js/garden/GardenRenderer.js#L619) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `effort(ctx, s)` | Método declarado | [651](../src/js/garden/GardenRenderer.js#L651) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sceneryLayout()` | Método declarado | [680](../src/js/garden/GardenRenderer.js#L680) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `scenery(ctx, s, left, right)` | Método declarado | [733](../src/js/garden/GardenRenderer.js#L733) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fairy(ctx, s)` | Método declarado | [798](../src/js/garden/GardenRenderer.js#L798) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `insect(ctx, index, x, y, width, height, direction = 1)` | Método declarado | [820](../src/js/garden/GardenRenderer.js#L820) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `message(ctx, text, options)` | Método declarado | [842](../src/js/garden/GardenRenderer.js#L842) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `narrative(ctx, s)` | Método declarado | [873](../src/js/garden/GardenRenderer.js#L873) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(s, { ready = true, error = null, touch = false, paused = false } = {})` | Método declarado | [877](../src/js/garden/GardenRenderer.js#L877) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [1315](../src/js/garden/GardenRenderer.js#L1315) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/garden/gardenArt.js

[Implementação](../src/js/garden/gardenArt.js). Contratos exportados/reexportados: `GARDEN_ART`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/gardenBeeRenderer.js

[Implementação](../src/js/garden/gardenBeeRenderer.js). Contratos exportados/reexportados: `drawGardenBee`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smooth(t)` | Função atribuída | [3](../src/js/garden/gardenBeeRenderer.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `drawGardenBee(ctx, images, bee, time)` | Função | [8](../src/js/garden/gardenBeeRenderer.js#L8) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/garden/gardenBeetleArt.js

[Implementação](../src/js/garden/gardenBeetleArt.js). Contratos exportados/reexportados: `GARDEN_BEETLE`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/gardenBeetleRenderer.js

[Implementação](../src/js/garden/gardenBeetleRenderer.js). Contratos exportados/reexportados: `drawGardenBeetle`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawGardenBeetle(ctx, images, beetle, time)` | Função | [3](../src/js/garden/gardenBeetleRenderer.js#L3) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/garden/gardenCinematic.js

[Implementação](../src/js/garden/gardenCinematic.js). Contratos exportados/reexportados: `gardenCinematicMoment`, `renderGardenCinematic`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `smooth(t)` | Função atribuída | [6](../src/js/garden/gardenCinematic.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dialogueBottom(canvas, textCanvas, end, seen)` | Função | [12](../src/js/garden/gardenCinematic.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenCinematicMoment(state)` | Função | [42](../src/js/garden/gardenCinematic.js#L42) | Seleciona atuação e plano pelo progresso narrativo, separado da câmera de gameplay e do relógio da fala. |
| `actor(ctx, images, index, x, base, height, time, breath = true)` | Função | [74](../src/js/garden/gardenCinematic.js#L74) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actorPair(ctx, images, a, b, x, base, height, time)` | Função | [93](../src/js/garden/gardenCinematic.js#L93) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sleepingActor(ctx, images, set, file, index, x, base, headScale, time)` | Função | [105](../src/js/garden/gardenCinematic.js#L105) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fairy(ctx, images, time, x, y, height = 145)` | Função | [124](../src/js/garden/gardenCinematic.js#L124) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderGardenCinematic(ctx, canvas, state, images)` | Função | [173](../src/js/garden/gardenCinematic.js#L173) | Compõe cenário, atores em camadas e quadro narrativo; apresenta sonolência e repouso das duas após a leitura. |

## src/js/garden/gardenCinematicArt.js

[Implementação](../src/js/garden/gardenCinematicArt.js). Contratos exportados/reexportados: `GARDEN_ACTING`, `GARDEN_BEE_LAYERS`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/gardenContact.js

[Implementação](../src/js/garden/gardenContact.js). Contratos exportados/reexportados: `gardenFeet`, `gardenContactHeight`, `gardenGirlPose`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `gardenFeet(player, x = player.x)` | Função | [15](../src/js/garden/gardenContact.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenContactHeight(platform, player, x = player.x)` | Função | [29](../src/js/garden/gardenContact.js#L29) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenGirlPose(player, time = player.animationTime ?? 0)` | Função | [69](../src/js/garden/gardenContact.js#L69) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/garden/gardenContactData.js

[Implementação](../src/js/garden/gardenContactData.js). Contratos exportados/reexportados: `GARDEN_CONTACT`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/gardenDefeatPresentation.js

[Implementação](../src/js/garden/gardenDefeatPresentation.js). Contratos exportados/reexportados: `gardenDefeatFrame`, `advanceGardenDefeats`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | [1](../src/js/garden/gardenDefeatPresentation.js#L1) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenDefeatFrame(enemy, groundY = enemy.baseY)` | Função | [3](../src/js/garden/gardenDefeatPresentation.js#L3) | Calcula corpo comprimido ou queda visual de inseto derrotado por até 1,6 s, sem alterar coordenadas de colisão. |
| `advanceGardenDefeats(state, seconds)` | Função | [39](../src/js/garden/gardenDefeatPresentation.js#L39) | Avança uma vez por subpasso os relógios visuais dos corpos, inclusive fora da vizinhança e em encerramento. |

## src/js/garden/gardenEncounters.js

[Implementação](../src/js/garden/gardenEncounters.js). Contratos exportados/reexportados: `GARDEN_BEETLES`, `createGardenEncounters`, `tickGardenWorm`, `tickGardenBeetles`, `resetGardenPanic`, `tickGardenBee`, `sweptGardenContact`, `restoreGardenEncounters`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n, a, b)` | Função atribuída | [3](../src/js/garden/gardenEncounters.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createGardenEncounters()` | Função | [36](../src/js/garden/gardenEncounters.js#L36) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `tickGardenWorm(e, s, dt)` | Função | [92](../src/js/garden/gardenEncounters.js#L92) | Controla exposição da minhoca por proximidade com limites distintos para emergir e recolher; o buraco não remove chão. |
| `tickGardenBeetles(s, dt, events)` | Função | [100](../src/js/garden/gardenEncounters.js#L100) | Ativa corrida automática até o pouso seguro na outra margem dos rios; mantém seis segundos no encontro das nuvens finais. |
| `resetGardenPanic(s, targetX)` | Função | [156](../src/js/garden/gardenEncounters.js#L156) | Limpa perseguição/saída, rearma gatilhos futuros e recoloca abelhas vivas no repouso ao retomar. |
| `tickGardenBee(e, s, dt)` | Função | [176](../src/js/garden/gardenEncounters.js#L176) | Mantém repouso fixo, aviso de 0,5 s e rasantes A/B de 1,25 s, com intervalo de 1,8 s. |
| `sweptGardenContact(previous, player, old, enemy)` | Função | [220](../src/js/garden/gardenEncounters.js#L220) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restoreGardenEncounters(saved, version = 10)` | Função | [240](../src/js/garden/gardenEncounters.js#L240) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/garden/gardenFearArt.js

[Implementação](../src/js/garden/gardenFearArt.js). Contratos exportados/reexportados: `FEAR_FILES`, `FEAR_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/gardenInsectArt.js

[Implementação](../src/js/garden/gardenInsectArt.js). Contratos exportados/reexportados: `INSECT_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/gardenLevel.js

[Implementação](../src/js/garden/gardenLevel.js). Contratos exportados/reexportados: `GARDEN`, `GARDEN_HOME`, `GARDEN_TERRAINS`, `GARDEN_WHEEL`, `GARDEN_FINAL_START`, `GARDEN_GOAL`, `GARDEN_WIDTH`, `GARDEN_WHEELS`, `GARDEN_AERIAL`, `GARDEN_PLATFORMS`, `GARDEN_ENEMIES`, `GARDEN_WATERS`, `GARDEN_SECTIONS`, `GARDEN_CHECKPOINTS`, `GARDEN_LEGACY_CHECKPOINTS`, `GARDEN_PLATFORM_BY_ID`, `gardenPlatforms`, `cloudStatus`, `gardenSection`, `gardenSurfaceY`, `gardenTerrainAt`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `width()` | Acessor | [5](../src/js/garden/gardenLevel.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `goal()` | Acessor | [9](../src/js/garden/gardenLevel.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `add(id, x, w, type = 'soil', y = 590, extra = {})` | Função atribuída | [79](../src/js/garden/gardenLevel.js#L79) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ground(id, x, w, type = 'soil')` | Função atribuída | [91](../src/js/garden/gardenLevel.js#L91) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemy(id, type, p, progress = 0)` | Função atribuída | [95](../src/js/garden/gardenLevel.js#L95) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `river(id, x, count, gap = 122, rise = 32, ant = false)` | Função | [112](../src/js/garden/gardenLevel.js#L112) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sectorCheckpoint(i)` | Função atribuída | [480](../src/js/garden/gardenLevel.js#L480) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenPlatforms(time = 0, state = null, center = null, radius = 1000)` | Função | [524](../src/js/garden/gardenLevel.js#L524) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cloudStatus(platform, state, time = state?.time ?? 0)` | Função | [556](../src/js/garden/gardenLevel.js#L556) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenSection(x)` | Função | [586](../src/js/garden/gardenLevel.js#L586) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenSurfaceY(platform, x)` | Função | [591](../src/js/garden/gardenLevel.js#L591) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenTerrainAt(platform, x)` | Função | [598](../src/js/garden/gardenLevel.js#L598) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/garden/gardenNarrative.js

[Implementação](../src/js/garden/gardenNarrative.js). Contratos exportados/reexportados: `GARDEN_OPENING`, `GARDEN_ENDING`, `GARDEN_OPENING_DURATION`, `gardenNarrativeCard`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `card(speaker, text, duration)` | Função atribuída | [2](../src/js/garden/gardenNarrative.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gardenNarrativeCard(cards, age)` | Função | [92](../src/js/garden/gardenNarrative.js#L92) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/garden/gardenPicnicArt.js

[Implementação](../src/js/garden/gardenPicnicArt.js). Contratos exportados/reexportados: `GARDEN_PICNIC`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/garden/gardenSimulation.js

[Implementação](../src/js/garden/gardenSimulation.js). Contratos exportados/reexportados: `createGardenState`, `retryGarden`, `restoreGardenState`, `stepGarden`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n, a, b)` | Função atribuída | [28](../src/js/garden/gardenSimulation.js#L28) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyRange(enemy)` | Função | [31](../src/js/garden/gardenSimulation.js#L31) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createGardenState(difficulty = 'NORMAL')` | Função | [41](../src/js/garden/gardenSimulation.js#L41) | Cria domínio v11 com jogador, encontros, nuvens, leitura, apresentação, fada e recuperação serializáveis. |
| `hurtPlayer(s, source, events)` | Função | [116](../src/js/garden/gardenSimulation.js#L116) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `recoverTarget(s, kind)` | Função | [135](../src/js/garden/gardenSimulation.js#L135) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginRecovery(s, kind, events)` | Função | [164](../src/js/garden/gardenSimulation.js#L164) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `defeat(s, kind, events)` | Função | [198](../src/js/garden/gardenSimulation.js#L198) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retryGarden(s, difficulty = s.difficulty)` | Função | [217](../src/js/garden/gardenSimulation.js#L217) | Retoma GAME_OVER no checkpoint, conserva inimigos vencidos e leitura, e rearma encontros futuros. |
| `restoreGardenState(saved, difficulty = 'NORMAL')` | Função | [261](../src/js/garden/gardenSimulation.js#L261) | Valida saves v1–v11 e migra geometria, encontros e leitura para o domínio atual sem serializar recursos. |
| `finite(values)` | Função atribuída | [268](../src/js/garden/gardenSimulation.js#L268) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fairyTick(s, dt, platforms)` | Função | [581](../src/js/garden/gardenSimulation.js#L581) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyTick(e, s, dt)` | Função | [617](../src/js/garden/gardenSimulation.js#L617) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tick(s, input, dt, events)` | Função | [699](../src/js/garden/gardenSimulation.js#L699) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `stepGarden(state, input = {}, seconds = 1 / 60, difficulty = state.difficulty)` | Função | [1106](../src/js/garden/gardenSimulation.js#L1106) | Converte entrada em subpassos de até 1/120 s; atualiza leitura, movimento, contato, encontros, recuperação e eventos. |

## src/js/garden/gardenVisualArt.js

[Implementação](../src/js/garden/gardenVisualArt.js). Contratos exportados/reexportados: `AQUATIC_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/input.js

[Implementação](../src/js/input.js). Contratos exportados/reexportados: `InputController`, `bindInput`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/main.js

[Implementação](../src/js/main.js).

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `refreshCampaignMenu()` | Função | [33](../src/js/main.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updatePauseButtonState()` | Função | [51](../src/js/main.js#L51) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `toggleGamePause()` | Função | [68](../src/js/main.js#L68) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateSoundButtonState()` | Função | [83](../src/js/main.js#L83) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `onSaveStatus(persisted)` | API/lambda de objeto | [126](../src/js/main.js#L126) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onGameOver({ phase = 'bedroom', offerEasy = false } = {})` | API/lambda de objeto | [133](../src/js/main.js#L133) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onRestartToTitle()` | API/lambda de objeto | [185](../src/js/main.js#L185) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGame(event)` | Função | [206](../src/js/main.js#L206) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `handleRetry(event)` | Função | [235](../src/js/main.js#L235) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleRestart(event)` | Função | [269](../src/js/main.js#L269) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `addSafeAction(element, handler)` | Função | [302](../src/js/main.js#L302) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `safeHandler(event)` | Função atribuída | [305](../src/js/main.js#L305) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handleToyRoomSwitch(event)` | Função | [322](../src/js/main.js#L322) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onNew()` | API/lambda de objeto | [367](../src/js/main.js#L367) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onLoad()` | API/lambda de objeto | [373](../src/js/main.js#L373) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setDebugPhaseMenuOpen(open, restoreFocus = false)` | Função atribuída | [399](../src/js/main.js#L399) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `pollOverlayGamepad()` | Função | [519](../src/js/main.js#L519) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/narrative/darkRoomNarrative.js

[Implementação](../src/js/narrative/darkRoomNarrative.js). Contratos exportados/reexportados: `updateStandbyNarrative`, `updateStandbyTransitionNarrative`, `updateCastleNarrative`, `updatePlotTwistNarrative`, `updateReturnTutorialNarrative`, `updatePortalNarrative`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateStandbyNarrative(context, dt)` | Função | [13](../src/js/narrative/darkRoomNarrative.js#L13) | Mantém pose de espera, fada, partículas e foco narrativo de standby. |
| `updateStandbyTransitionNarrative(context, dt)` | Função | [66](../src/js/narrative/darkRoomNarrative.js#L66) | Avança saída de standby, postura, alfa e retorno do enquadramento. |
| `updateCastleNarrative(context, dt)` | Função | [138](../src/js/narrative/darkRoomNarrative.js#L138) | Sequencia encontro no castelo, diálogos e liberação da fuga. |
| `updatePlotTwistNarrative(context, dt)` | Função | [215](../src/js/narrative/darkRoomNarrative.js#L215) | Avança queda/checagem e diálogos da porta falsa; coordena atores e zoom. |
| `updateReturnTutorialNarrative(context, dt)` | Função | [390](../src/js/narrative/darkRoomNarrative.js#L390) | Demonstra arco da fada e devolve controle no retorno. |
| `updatePortalNarrative(context, dt)` | Função | [456](../src/js/narrative/darkRoomNarrative.js#L456) | Avança aproximação/íris do portal e dispara introdução da Toy Room. |

## src/js/narrative/dialogueControls.js

[Implementação](../src/js/narrative/dialogueControls.js). Contratos exportados/reexportados: `dialogueControlsHeight`, `drawDialogueControls`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `dialogueControlsHeight(scale = 1, canSkip = false)` | Função | [4](../src/js/narrative/dialogueControls.js#L4) | Reserva altura para os comandos de leitura e, quando permitido, para o botão separado de pular cena já vista. |
| `drawDialogueControls(ctx, canvas, { left, top, width, scale = 1, canSkip = false, color = '#846467', buttonColor = '#fff5e5' } = {},)` | Função | [9](../src/js/narrative/dialogueControls.js#L9) | Desenha avanço automático, gesto de adiantar e alvo separado de skip; devolve os limites do botão. |

## src/js/narrative/dialogueFlow.js

[Implementação](../src/js/narrative/dialogueFlow.js). Contratos exportados/reexportados: `beginDialogueFrame`, `endDialogueFrame`, `offerDialogue`, `setDialogueBounds`, `getDialogueBounds`, `isDialogueModal`, `installDialogueAdvance`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `flow(canvas)` | Função | [4](../src/js/narrative/dialogueFlow.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginDialogueFrame(canvas)` | Função | [18](../src/js/narrative/dialogueFlow.js#L18) | Inicia o registro dos quadros de diálogo por canvas; composições aninhadas compartilham profundidade e não deixam entrada obsoleta. |
| `endDialogueFrame(canvas)` | Função | [29](../src/js/narrative/dialogueFlow.js#L29) | Encerra um nível da composição de diálogos sem avançar relógios narrativos ou físicos. |
| `offerDialogue(canvas, text, onAdvance)` | Função | [34](../src/js/narrative/dialogueFlow.js#L34) | Registra a fala visível e seu callback de avanço; quadros dispensados ficam ocultos e canvases de medição não criam entrada. |
| `setDialogueBounds(canvas, ctx, x, y, w, h)` | Função | [50](../src/js/narrative/dialogueFlow.js#L50) | Transforma os quatro cantos do quadro para pixels do canvas usados no hit-testing de leitura não modal. |
| `getDialogueBounds(canvas)` | Função | [77](../src/js/narrative/dialogueFlow.js#L77) | Consulta os limites do quadro de diálogo atualmente registrado nesse canvas. |
| `isDialogueModal(canvas)` | Função | [80](../src/js/narrative/dialogueFlow.js#L80) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `installDialogueAdvance(canvas, { enabled = () => true, /** * Avança o estado e dados do componente para a próxima etapa sem repetir o estado já consumido. */ advance = () => false, /** * Indica se a modal satisfaz as condições vigentes do fluxo. */ isModal = () => true, } = {},)` | Função | [83](../src/js/narrative/dialogueFlow.js#L83) | Instala pointerdown em captura; consome um gesto e avança uma fala, preservando controles fora do quadro não modal. |
| `consume(e)` | Função atribuída | [105](../src/js/narrative/dialogueFlow.js#L105) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `down(e)` | Função atribuída | [109](../src/js/narrative/dialogueFlow.js#L109) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `release(e)` | Função atribuída | [131](../src/js/narrative/dialogueFlow.js#L131) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `click(e)` | Função atribuída | [134](../src/js/narrative/dialogueFlow.js#L134) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `keydown(e)` | Função atribuída | [140](../src/js/narrative/dialogueFlow.js#L140) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `keyup(e)` | Função atribuída | [158](../src/js/narrative/dialogueFlow.js#L158) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `blur()` | Função atribuída | [161](../src/js/narrative/dialogueFlow.js#L161) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/narrative/poeticNarrator.js

[Implementação](../src/js/narrative/poeticNarrator.js). Contratos exportados/reexportados: `POETIC_LINES`, `getPauseNarration`, `renderPoeticNarration`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getPauseNarration(state)` | Função | [19](../src/js/narrative/poeticNarrator.js#L19) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `renderPoeticNarration(ctx, canvas, text, options = {})` | Função | [29](../src/js/narrative/poeticNarrator.js#L29) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/rendering/darkRoomRenderPipeline.js

[Implementação](../src/js/rendering/darkRoomRenderPipeline.js). Contratos exportados/reexportados: `renderDarkRoom`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderDarkRoom(context)` | Função | [10](../src/js/rendering/darkRoomRenderPipeline.js#L10) | Compõe apresentação, camadas e interface; update de simulação permanece em game.js. |
| `drawRoom()` | API/lambda de objeto | [68](../src/js/rendering/darkRoomRenderPipeline.js#L68) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `screenY(y)` | Função atribuída | [132](../src/js/rendering/darkRoomRenderPipeline.js#L132) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `screenX(x)` | Função atribuída | [143](../src/js/rendering/darkRoomRenderPipeline.js#L143) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/runtime/runtimeContext.js

[Implementação](../src/js/runtime/runtimeContext.js). Contratos exportados/reexportados: `createRuntimeContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createRuntimeContext({ state, audio, camera, assets, input, effects, campaign })` | Função | [2](../src/js/runtime/runtimeContext.js#L2) | Agrega referências existentes; não cria serviços nem executa lógica de jogo. |

## src/js/state/GameState.js

[Implementação](../src/js/state/GameState.js). Contratos exportados/reexportados: `GameState`, `createGameState`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, uiFeedback, callbacks = {})` | Método declarado | [16](../src/js/state/GameState.js#L16) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setLastInputDevice(dev)` | Método declarado | [29](../src/js/state/GameState.js#L29) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getActivePromptDevice()` | Método declarado | [39](../src/js/state/GameState.js#L39) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `spawnFairySparkles(x, y, count = 2)` | Método declarado | [59](../src/js/state/GameState.js#L59) | Cria partículas/efeitos no buffer correspondente. |
| `spawnFairyFlightDust(fx, fy, fvx, fvy)` | Método declarado | [84](../src/js/state/GameState.js#L84) | Cria partículas/efeitos no buffer correspondente. |
| `updateFairyParticles()` | Método declarado | [107](../src/js/state/GameState.js#L107) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `startStandbyPreparation(audio)` | Método declarado | [123](../src/js/state/GameState.js#L123) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `confirmStandby(audio)` | Método declarado | [164](../src/js/state/GameState.js#L164) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetPlayerPhysicsBody(targetX, targetY, facing = 1)` | Método declarado | [186](../src/js/state/GameState.js#L186) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `triggerGameOver(audio)` | Método declarado | [212](../src/js/state/GameState.js#L212) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retryGame(audio)` | Método declarado | [240](../src/js/state/GameState.js#L240) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `restartToTitle(audio)` | Método declarado | [258](../src/js/state/GameState.js#L258) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `showFailMessage()` | Método declarado | [289](../src/js/state/GameState.js#L289) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startCastleCutscene(audio)` | Método declarado | [308](../src/js/state/GameState.js#L308) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advanceCutscene(audio)` | Método declarado | [327](../src/js/state/GameState.js#L327) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishCutscene(audio)` | Método declarado | [342](../src/js/state/GameState.js#L342) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startPlotTwistCutscene(audio)` | Método declarado | [389](../src/js/state/GameState.js#L389) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `advancePlotTwist(audio)` | Método declarado | [418](../src/js/state/GameState.js#L418) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `finishPlotTwistAndStartTutorial(audio)` | Método declarado | [437](../src/js/state/GameState.js#L437) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `startTruePortalTransition(audio)` | Método declarado | [484](../src/js/state/GameState.js#L484) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `resetToStart(failedMidClimb = false, shouldPlayFailSound = true, audio)` | Método declarado | [513](../src/js/state/GameState.js#L513) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `createGameState(canvas, uiFeedback, callbacks)` | Função | [608](../src/js/state/GameState.js#L608) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

## src/js/state/campaignDefeats.js

[Implementação](../src/js/state/campaignDefeats.js). Contratos exportados/reexportados: `recordCampaignDefeat`, `clearCampaignDefeat`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `recordCampaignDefeat(state)` | Função | [2](../src/js/state/campaignDefeats.js#L2) | Conta uma derrota completa por tentativa e oferece EASY a cada terceira perda no NORMAL. |
| `clearCampaignDefeat(state)` | Função | [11](../src/js/state/campaignDefeats.js#L11) | Libera a próxima tentativa e limpa a oferta pendente sem zerar a contagem da campanha. |

## src/js/state/campaignProgress.js

[Implementação](../src/js/state/campaignProgress.js). Contratos exportados/reexportados: `CAMPAIGN_STORAGE_KEY`, `captureState`, `restoreState`, `createCampaignProgress`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clone(value)` | Função atribuída | [18](../src/js/state/campaignProgress.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `migrateSavedState(saved)` | Função | [21](../src/js/state/campaignProgress.js#L21) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `captureState(state)` | Função | [32](../src/js/state/campaignProgress.js#L32) | Seleciona estado serializável da campanha. |
| `restoreState(state, saved)` | Função | [35](../src/js/state/campaignProgress.js#L35) | Restaura valores preservando referências de objetos/arrays existentes. |
| `createCampaignProgress(storage)` | Função | [46](../src/js/state/campaignProgress.js#L46) | Cria leitura, gravação e limpeza do progresso local com alternativa em memória. |
| `read()` | Método declarado | [58](../src/js/state/campaignProgress.js#L58) | Lê e valida save da campanha; pode usar memória da sessão. |
| `write(data)` | Método declarado | [134](../src/js/state/campaignProgress.js#L134) | Serializa save versionado e tenta gravar no storage. |
| `clear()` | Método declarado | [152](../src/js/state/campaignProgress.js#L152) | Configura/reinicializa valores do componente; revise o escopo da mutação. |

## src/js/state/gameDifficulty.js

[Implementação](../src/js/state/gameDifficulty.js). Contratos exportados/reexportados: `normalizeDifficulty`, `EASY_LANDING_MARGIN`, `EASY_LANDING_DEPTH`, `easyLanding`, `toyGuideBlend`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `normalizeDifficulty(value)` | Função atribuída | [2](../src/js/state/gameDifficulty.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `easyLanding(player, x, width, y)` | Função | [5](../src/js/state/gameDifficulty.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyGuideBlend(difficulty, dt)` | Função | [14](../src/js/state/gameDifficulty.js#L14) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/state/stateVariables.js

[Implementação](../src/js/state/stateVariables.js). Contratos exportados/reexportados: `createDefaultStateVariables`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createDefaultStateVariables()` | Função | [6](../src/js/state/stateVariables.js#L6) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |

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
| `snapshot()` | Método declarado | [48](../src/js/toy-room/ArenaAudioProfile.js#L48) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [56](../src/js/toy-room/ArenaAudioProfile.js#L56) | Reaplica a captura específica; confira referências e dados transitórios. |

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
| `constructor()` | Método declarado | [16](../src/js/toy-room/ArenaCamera.js#L16) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `update(dt, player, enemy, jump = 0, impact = null, battle = null)` | Método declarado | [24](../src/js/toy-room/ArenaCamera.js#L24) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `envelope(player, enemy, jump, battle = null, anticipate = false)` | Método declarado | [42](../src/js/toy-room/ArenaCamera.js#L42) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `frame(layout, room, battle)` | Método declarado | [70](../src/js/toy-room/ArenaCamera.js#L70) | Calcula pose visual estável sem escrever na simulação. |
| `snapshot()` | Método declarado | [116](../src/js/toy-room/ArenaCamera.js#L116) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [126](../src/js/toy-room/ArenaCamera.js#L126) | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ArenaPlayerController.js

[Implementação](../src/js/toy-room/ArenaPlayerController.js). Contratos exportados/reexportados: `ARENA_TUNING`, `ArenaPlayerController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `update(battle, dt)` | Método declarado | [28](../src/js/toy-room/ArenaPlayerController.js#L28) | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/toy-room/ArenaPlayerRenderer.js

[Implementação](../src/js/toy-room/ArenaPlayerRenderer.js). Contratos exportados/reexportados: `ArenaPlayerRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [16](../src/js/toy-room/ArenaPlayerRenderer.js#L16) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [22](../src/js/toy-room/ArenaPlayerRenderer.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(ctx, room, state, ground)` | Método declarado | [50](../src/js/toy-room/ArenaPlayerRenderer.js#L50) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderSpecialCloseup(ctx, canvas, state)` | Método declarado | [117](../src/js/toy-room/ArenaPlayerRenderer.js#L117) | Apresenta o close dramático usando a textura pré-carregada com as poses da menina. |
| `renderSwordArc(ctx, sample, reachScale = 1)` | Método declarado | [121](../src/js/toy-room/ArenaPlayerRenderer.js#L121) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ArenaSoundEffects.js

[Implementação](../src/js/toy-room/ArenaSoundEffects.js). Contratos exportados/reexportados: `ARENA_SOUND_FILES`, `ArenaSoundEffects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [102](../src/js/toy-room/ArenaSoundEffects.js#L102) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `preload(ctx)` | Método declarado | [109](../src/js/toy-room/ArenaSoundEffects.js#L109) | Pré-carrega entradas de imagens do manifesto. |
| `stop(channel)` | Método declarado | [126](../src/js/toy-room/ArenaSoundEffects.js#L126) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `play(ctx, destination, event)` | Método declarado | [141](../src/js/toy-room/ArenaSoundEffects.js#L141) | Aciona o som/cue correspondente ou sua delegação de áudio. |

## src/js/toy-room/ImpactFX.js

[Implementação](../src/js/toy-room/ImpactFX.js). Contratos exportados/reexportados: `ImpactFX`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor()` | Método declarado | [5](../src/js/toy-room/ImpactFX.js#L5) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `emit(kind, x, y, heavy = false)` | Método declarado | [12](../src/js/toy-room/ImpactFX.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [40](../src/js/toy-room/ImpactFX.js#L40) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render(ctx)` | Método declarado | [52](../src/js/toy-room/ImpactFX.js#L52) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | [79](../src/js/toy-room/ImpactFX.js#L79) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [90](../src/js/toy-room/ImpactFX.js#L90) | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/PlayerController.js

[Implementação](../src/js/toy-room/PlayerController.js). Contratos exportados/reexportados: `PlayerController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | [3](../src/js/toy-room/PlayerController.js#L3) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(battle, dt)` | Método declarado | [8](../src/js/toy-room/PlayerController.js#L8) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `faceEnemy()` | Função atribuída | [29](../src/js/toy-room/PlayerController.js#L29) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/RoomEnvironmentRenderer.js

[Implementação](../src/js/toy-room/RoomEnvironmentRenderer.js). Contratos exportados/reexportados: `RoomEnvironmentRenderer`, `roomEnvironmentRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderBackground(ctx, roomW, roomH, options = {})` | Método declarado | [35](../src/js/toy-room/RoomEnvironmentRenderer.js#L35) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawWoodStrip(ctx, image, x, y, width, height, plain = false)` | Método declarado | [170](../src/js/toy-room/RoomEnvironmentRenderer.js#L170) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawWoodTrim(ctx, image, roomW, roomH)` | Método declarado | [189](../src/js/toy-room/RoomEnvironmentRenderer.js#L189) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderPerspectiveFloor(ctx, tile, roomW, roomH)` | Método declarado | [205](../src/js/toy-room/RoomEnvironmentRenderer.js#L205) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawArchedWindow(ctx, wx, wy, windowImage = null)` | Método declarado | [242](../src/js/toy-room/RoomEnvironmentRenderer.js#L242) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawEntrancePortal(ctx, dx, dy, environmentDoor = null)` | Método declarado | [304](../src/js/toy-room/RoomEnvironmentRenderer.js#L304) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawCentralMandalaRug(ctx, cx, cy)` | Método declarado | [334](../src/js/toy-room/RoomEnvironmentRenderer.js#L334) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawFloralPlayMat(ctx, rx, ry, rugImage = null)` | Método declarado | [382](../src/js/toy-room/RoomEnvironmentRenderer.js#L382) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawBedsideFringeRug(ctx, bx, by, rugImage = null)` | Método declarado | [432](../src/js/toy-room/RoomEnvironmentRenderer.js#L432) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `traceTrainCircuit(ctx)` | Método declarado | [463](../src/js/toy-room/RoomEnvironmentRenderer.js#L463) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createWoodenTrackLayer(image)` | Método declarado | [468](../src/js/toy-room/RoomEnvironmentRenderer.js#L468) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `drawTrainTracks(ctx, trackImage = null)` | Método declarado | [531](../src/js/toy-room/RoomEnvironmentRenderer.js#L531) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFurniture(ctx, f, options = {})` | Método declarado | [576](../src/js/toy-room/RoomEnvironmentRenderer.js#L576) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRenderer.js

[Implementação](../src/js/toy-room/ToyRenderer.js). Contratos exportados/reexportados: `ToyRenderer`, `toyRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToy(ctx, t, playerX = 0, playerY = 0, isCarrying = false, time = performance.now(), options = {},)` | Método declarado | [19](../src/js/toy-room/ToyRenderer.js#L19) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomArenaBuilder.js

[Implementação](../src/js/toy-room/ToyRoomArenaBuilder.js). Contratos exportados/reexportados: `ToyRoomArenaBuilder`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clone(value)` | Função atribuída | [1](../src/js/toy-room/ToyRoomArenaBuilder.js#L1) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `build({ furniture, ROOM_W = 1600 })` | Método declarado | [6](../src/js/toy-room/ToyRoomArenaBuilder.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomArenaPhase.js

[Implementação](../src/js/toy-room/ToyRoomArenaPhase.js). Contratos exportados/reexportados: `ARENA_TRANSFORMATION_DURATION`, `ARENA_VICTORY_FADE_DURATION`, `ToyRoomArenaPhase`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(room)` | Método declarado | [24](../src/js/toy-room/ToyRoomArenaPhase.js#L24) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `active()` | Acessor | [46](../src/js/toy-room/ToyRoomArenaPhase.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `start()` | Método declarado | [51](../src/js/toy-room/ToyRoomArenaPhase.js#L51) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `configurePresentation()` | Método declarado | [69](../src/js/toy-room/ToyRoomArenaPhase.js#L69) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateAnimation(dt)` | API/lambda de objeto | [75](../src/js/toy-room/ToyRoomArenaPhase.js#L75) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `renderHUD(ctx, layout, state)` | API/lambda de objeto | [86](../src/js/toy-room/ToyRoomArenaPhase.js#L86) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `cameraFrame(layout)` | API/lambda de objeto | [88](../src/js/toy-room/ToyRoomArenaPhase.js#L88) | Calcula enquadramento narrativo da introdução conforme etapa e relógio. |
| `onSound(sound)` | API/lambda de objeto | [90](../src/js/toy-room/ToyRoomArenaPhase.js#L90) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onImpact(x, y, heavy)` | API/lambda de objeto | [99](../src/js/toy-room/ToyRoomArenaPhase.js#L99) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onBlock(x, y)` | API/lambda de objeto | [101](../src/js/toy-room/ToyRoomArenaPhase.js#L101) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderFX(ctx)` | API/lambda de objeto | [103](../src/js/toy-room/ToyRoomArenaPhase.js#L103) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `transportOrigin()` | API/lambda de objeto | [109](../src/js/toy-room/ToyRoomArenaPhase.js#L109) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderForeground(ctx)` | API/lambda de objeto | [111](../src/js/toy-room/ToyRoomArenaPhase.js#L111) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderBackground(ctx)` | API/lambda de objeto | [115](../src/js/toy-room/ToyRoomArenaPhase.js#L115) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderPlayer(ctx, state, ground)` | API/lambda de objeto | [118](../src/js/toy-room/ToyRoomArenaPhase.js#L118) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `restoreReality({ resumeAudio = true } = {})` | Método declarado | [124](../src/js/toy-room/ToyRoomArenaPhase.js#L124) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `finish()` | Método declarado | [154](../src/js/toy-room/ToyRoomArenaPhase.js#L154) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `beginReturn()` | Método declarado | [165](../src/js/toy-room/ToyRoomArenaPhase.js#L165) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt = 1)` | Método declarado | [181](../src/js/toy-room/ToyRoomArenaPhase.js#L181) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | Método declarado | [256](../src/js/toy-room/ToyRoomArenaPhase.js#L256) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | [321](../src/js/toy-room/ToyRoomArenaPhase.js#L321) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved, roomSave = null)` | Método declarado | [335](../src/js/toy-room/ToyRoomArenaPhase.js#L335) | Reaplica a captura específica; confira referências e dados transitórios. |
| `attack()` | Método declarado | [400](../src/js/toy-room/ToyRoomArenaPhase.js#L400) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `retry()` | Método declarado | [414](../src/js/toy-room/ToyRoomArenaPhase.js#L414) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `special()` | Método declarado | [423](../src/js/toy-room/ToyRoomArenaPhase.js#L423) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomBattle.js

[Implementação](../src/js/toy-room/ToyRoomBattle.js). Contratos exportados/reexportados: `transferHeart`, `ToyRoomBattle`, `BATTLE_ORDER`, `BATTLE_PLAYER_VISUAL_SCALE`, `BATTLE_TUNING`, `BATTLE_TRANSITION_DURATION`, `battleAnimationFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n, a, b)` | Função atribuída | [23](../src/js/toy-room/ToyRoomBattle.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `transferHeart(victim, attacker)` | Função | [26](../src/js/toy-room/ToyRoomBattle.js#L26) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `constructor(room, { loadAssets = true } = {})` | Método declarado | [35](../src/js/toy-room/ToyRoomBattle.js#L35) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [52](../src/js/toy-room/ToyRoomBattle.js#L52) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `activate()` | Método declarado | [64](../src/js/toy-room/ToyRoomBattle.js#L64) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `spawn()` | Método declarado | [115](../src/js/toy-room/ToyRoomBattle.js#L115) | Cria partículas/efeitos no buffer correspondente. |
| `getEnemyCollisionDistance(actor)` | Método declarado | [138](../src/js/toy-room/ToyRoomBattle.js#L138) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getSwordRange(actor = this.state.enemy.actor)` | Método declarado | [156](../src/js/toy-room/ToyRoomBattle.js#L156) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `swordContactPoint(dx, facing)` | Método declarado | [166](../src/js/toy-room/ToyRoomBattle.js#L166) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `resolveActorBodies(side)` | Método declarado | [180](../src/js/toy-room/ToyRoomBattle.js#L180) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaChest()` | Método declarado | [214](../src/js/toy-room/ToyRoomBattle.js#L214) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginTransition(outgoing)` | Método declarado | [224](../src/js/toy-room/ToyRoomBattle.js#L224) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `transitionPlacement(incoming)` | Método declarado | [248](../src/js/toy-room/ToyRoomBattle.js#L248) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `input()` | Método declarado | [297](../src/js/toy-room/ToyRoomBattle.js#L297) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attack()` | Método declarado | [327](../src/js/toy-room/ToyRoomBattle.js#L327) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `faceEnemy()` | Método declarado | [354](../src/js/toy-room/ToyRoomBattle.js#L354) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `playCombatSound(sound)` | Método declarado | [365](../src/js/toy-room/ToyRoomBattle.js#L365) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `setEnemyState(state)` | Método declarado | [378](../src/js/toy-room/ToyRoomBattle.js#L378) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `beginEnemyAttack(attack)` | Método declarado | [386](../src/js/toy-room/ToyRoomBattle.js#L386) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyGuarding()` | Método declarado | [411](../src/js/toy-room/ToyRoomBattle.js#L411) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginEnemyResponse()` | Método declarado | [416](../src/js/toy-room/ToyRoomBattle.js#L416) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startImpact(target, x, y, direction, heavy)` | Método declarado | [427](../src/js/toy-room/ToyRoomBattle.js#L427) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | [454](../src/js/toy-room/ToyRoomBattle.js#L454) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `step(dt)` | Método declarado | [496](../src/js/toy-room/ToyRoomBattle.js#L496) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `enemyPose(e = this.state.enemy)` | Método declarado | [865](../src/js/toy-room/ToyRoomBattle.js#L865) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render()` | Método declarado | [880](../src/js/toy-room/ToyRoomBattle.js#L880) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderImpact(ctx, impact)` | Método declarado | [885](../src/js/toy-room/ToyRoomBattle.js#L885) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `snapshot()` | Método declarado | [890](../src/js/toy-room/ToyRoomBattle.js#L890) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved)` | Método declarado | [894](../src/js/toy-room/ToyRoomBattle.js#L894) | Reaplica a captura específica; confira referências e dados transitórios. |

## src/js/toy-room/ToyRoomEntities.js

[Implementação](../src/js/toy-room/ToyRoomEntities.js). Contratos exportados/reexportados: `ToyRoomEntities`, `toyRoomEntities`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderPlayer(ctx, player, options = {})` | Método declarado | [13](../src/js/toy-room/ToyRoomEntities.js#L13) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFairy(ctx, fairy, options = {})` | Método declarado | [50](../src/js/toy-room/ToyRoomEntities.js#L50) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomInputController.js

[Implementação](../src/js/toy-room/ToyRoomInputController.js). Contratos exportados/reexportados: `ToyRoomInputController`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | [12](../src/js/toy-room/ToyRoomInputController.js#L12) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `setupListeners()` | Método declarado | [18](../src/js/toy-room/ToyRoomInputController.js#L18) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getCanvasCoordinates(e)` | Método declarado | [42](../src/js/toy-room/ToyRoomInputController.js#L42) | Converte evento de ponteiro para coordenadas internas da sala. |
| `isActionButtonHit(coords)` | Método declarado | [70](../src/js/toy-room/ToyRoomInputController.js#L70) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `handleKeyDown(e)` | Método declarado | [75](../src/js/toy-room/ToyRoomInputController.js#L75) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyUp(e)` | Método declarado | [94](../src/js/toy-room/ToyRoomInputController.js#L94) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | [99](../src/js/toy-room/ToyRoomInputController.js#L99) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `held(index)` | Função atribuída | [116](../src/js/toy-room/ToyRoomInputController.js#L116) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onPointerDown(e)` | Método declarado | [153](../src/js/toy-room/ToyRoomInputController.js#L153) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerMove(e)` | Método declarado | [239](../src/js/toy-room/ToyRoomInputController.js#L239) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerUp(e)` | Método declarado | [290](../src/js/toy-room/ToyRoomInputController.js#L290) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `clearInput()` | Método declarado | [329](../src/js/toy-room/ToyRoomInputController.js#L329) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `refreshArenaTouchButtons()` | Método declarado | [341](../src/js/toy-room/ToyRoomInputController.js#L341) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `removeListeners()` | Método declarado | [359](../src/js/toy-room/ToyRoomInputController.js#L359) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/ToyRoomInteraction.js

[Implementação](../src/js/toy-room/ToyRoomInteraction.js). Contratos exportados/reexportados: `ToyRoomInteraction`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | [6](../src/js/toy-room/ToyRoomInteraction.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `triggerAction()` | Método declarado | [11](../src/js/toy-room/ToyRoomInteraction.js#L11) | Processa interação contextual da sala: pegar ou entregar ao baú; prioriza espada/combate e não oferece soltura manual. |
| `updateProximity()` | Método declarado | [115](../src/js/toy-room/ToyRoomInteraction.js#L115) | Atualiza disponibilidade de interação antes do movimento e devolve o baú atual. |

## src/js/toy-room/ToyRoomPersistence.js

[Implementação](../src/js/toy-room/ToyRoomPersistence.js). Contratos exportados/reexportados: `ToyRoomPersistence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | [4](../src/js/toy-room/ToyRoomPersistence.js#L4) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `snapshot({ includeArena = true } = {})` | Método declarado | [9](../src/js/toy-room/ToyRoomPersistence.js#L9) | Copia exploração, religa carregado por ID e inclui arena/perseguição/jardim/epílogo conforme origem e includeArena. |
| `restore(saved, { preserveArena = false } = {})` | Método declarado | [45](../src/js/toy-room/ToyRoomPersistence.js#L45) | Reaplica exploração e atores, limpa entrada e prioriza jardim, epílogo, perseguição, arena, batalha e tutorial; preserveArena evita reconstrução recursiva. |

## src/js/toy-room/ToyRoomPhase.js

[Implementação](../src/js/toy-room/ToyRoomPhase.js). Contratos exportados/reexportados: `ToyRoomPhase`, `createToyRoom`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(canvas, audio, uiFeedback, onReturnToTitle, options = {})` | Método declarado | [45](../src/js/toy-room/ToyRoomPhase.js#L45) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `inputController()` | Acessor | [142](../src/js/toy-room/ToyRoomPhase.js#L142) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `setupListeners()` | Método declarado | [150](../src/js/toy-room/ToyRoomPhase.js#L150) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `getCanvasCoordinates(e)` | Método declarado | [155](../src/js/toy-room/ToyRoomPhase.js#L155) | Converte evento de ponteiro para coordenadas internas da sala. |
| `isActionButtonHit(coords)` | Método declarado | [160](../src/js/toy-room/ToyRoomPhase.js#L160) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `handleKeyDown(e)` | Método declarado | [165](../src/js/toy-room/ToyRoomPhase.js#L165) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `handleKeyUp(e)` | Método declarado | [170](../src/js/toy-room/ToyRoomPhase.js#L170) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `pollGamepad()` | Método declarado | [175](../src/js/toy-room/ToyRoomPhase.js#L175) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onPointerDown(e)` | Método declarado | [180](../src/js/toy-room/ToyRoomPhase.js#L180) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerMove(e)` | Método declarado | [185](../src/js/toy-room/ToyRoomPhase.js#L185) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `onPointerUp(e)` | Método declarado | [190](../src/js/toy-room/ToyRoomPhase.js#L190) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `clearInput()` | Método declarado | [195](../src/js/toy-room/ToyRoomPhase.js#L195) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `refreshArenaTouchButtons()` | Método declarado | [200](../src/js/toy-room/ToyRoomPhase.js#L200) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `spawnSparkles(x, y, count = 12, hue = '#facc15')` | Método declarado | [205](../src/js/toy-room/ToyRoomPhase.js#L205) | Cria partículas/efeitos no buffer correspondente. |
| `spawnConfetti(x, y, count = 35)` | Método declarado | [210](../src/js/toy-room/ToyRoomPhase.js#L210) | Cria partículas/efeitos no buffer correspondente. |
| `interaction()` | Acessor | [215](../src/js/toy-room/ToyRoomPhase.js#L215) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `triggerAction()` | Método declarado | [222](../src/js/toy-room/ToyRoomPhase.js#L222) | Encaminha ação à exploração somente fora de epílogo, jardim e perseguição. |
| `startChasePreview(saved = null)` | Método declarado | [234](../src/js/toy-room/ToyRoomPhase.js#L234) | Inicia o acesso isolado de debug à perseguição, sem salvar essa fase na campanha. |
| `startChaseCampaign(saved = null)` | Método declarado | [261](../src/js/toy-room/ToyRoomPhase.js#L261) | Prepara a fuga da campanha sob fade, desliga entradas da sala e recupera falhas de preparação. |
| `onCampaignError(message)` | API/lambda de objeto | [287](../src/js/toy-room/ToyRoomPhase.js#L287) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handleCampaignChaseError(chase, message)` | Método declarado | [302](../src/js/toy-room/ToyRoomPhase.js#L302) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `startEpilogue(saved = null, { campaign = true } = {})` | Método declarado | [323](../src/js/toy-room/ToyRoomPhase.js#L323) | Descarta a perseguição, limpa entrada e inicia o epílogo recuperável; o callback abre o jardim com a mesma origem campanha/prévia. |
| `onComplete()` | API/lambda de objeto | [336](../src/js/toy-room/ToyRoomPhase.js#L336) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGarden(saved = null, { campaign = true } = {})` | Método declarado | [345](../src/js/toy-room/ToyRoomPhase.js#L345) | Encerra epílogo/perseguição, remove entradas da sala e inicia GardenPhase com recursos, física e áudio próprios; conserva a origem campanha/prévia. |
| `startDream(saved = null, { campaign = true } = {})` | Método declarado | [375](../src/js/toy-room/ToyRoomPhase.js#L375) | Descarta modos anteriores, entradas e áudio; abre o sonho2D com a origem campanha/prévia preservada. |
| `startBrinquedao(saved = null, { campaign = true } = {})` | Método declarado | [404](../src/js/toy-room/ToyRoomPhase.js#L404) | Descarta os modos anteriores, conserva a origem da campanha e abre convite e circuito. |
| `resolveCollisions(px, py, r)` | Método declarado | [434](../src/js/toy-room/ToyRoomPhase.js#L434) | Resolve colisões da sala com móveis. |
| `update(dt = 1.0)` | Método declarado | [448](../src/js/toy-room/ToyRoomPhase.js#L448) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateActiveMode(dt)` | Método declarado | [485](../src/js/toy-room/ToyRoomPhase.js#L485) | Seleciona epílogo, jardim, perseguição ou sala; após 150 ticks de COMPLETE abre o epílogo preservando campaign. |
| `resolveCollisions(x, y, radius)` | API/lambda de objeto | [589](../src/js/toy-room/ToyRoomPhase.js#L589) | Resolve colisões da sala com móveis. |
| `setDifficulty(difficulty)` | Método declarado | [631](../src/js/toy-room/ToyRoomPhase.js#L631) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `retryDefeat({ resume = false } = {})` | Método declarado | [647](../src/js/toy-room/ToyRoomPhase.js#L647) | Recupera a fase derrotada; a ajuda preserva o adversário ou percurso atual. |
| `updateCamera(dt)` | Método declarado | [697](../src/js/toy-room/ToyRoomPhase.js#L697) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `getCameraFrame()` | Método declarado | [714](../src/js/toy-room/ToyRoomPhase.js#L714) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `render(options = {})` | Método declarado | [725](../src/js/toy-room/ToyRoomPhase.js#L725) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `startTutorial()` | Método declarado | [763](../src/js/toy-room/ToyRoomPhase.js#L763) | Inicia orientação guiada da Toy Room se ainda não concluída. |
| `persistence()` | Acessor | [768](../src/js/toy-room/ToyRoomPhase.js#L768) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `snapshot(options)` | Método declarado | [775](../src/js/toy-room/ToyRoomPhase.js#L775) | Produz captura recuperável do estado específico deste componente. |
| `restore(saved, options)` | Método declarado | [780](../src/js/toy-room/ToyRoomPhase.js#L780) | Reaplica a captura específica; confira referências e dados transitórios. |
| `destroy()` | Método declarado | [785](../src/js/toy-room/ToyRoomPhase.js#L785) | Descarta os modos posteriores e os recursos/listeners próprios da sala; encerra o epílogo ativo. |
| `createToyRoom(canvas, audio, uiFeedback, onReturnToTitle, options)` | Função | [807](../src/js/toy-room/ToyRoomPhase.js#L807) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `update(dt)` | API/lambda de objeto | [811](../src/js/toy-room/ToyRoomPhase.js#L811) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `render()` | API/lambda de objeto | [813](../src/js/toy-room/ToyRoomPhase.js#L813) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `triggerAction()` | API/lambda de objeto | [815](../src/js/toy-room/ToyRoomPhase.js#L815) | Encaminha ação à exploração somente fora de epílogo, jardim e perseguição. |
| `destroy()` | API/lambda de objeto | [817](../src/js/toy-room/ToyRoomPhase.js#L817) | Descarta os modos posteriores e os recursos/listeners próprios da sala; encerra o epílogo ativo. |

## src/js/toy-room/ToyRoomStory.js

[Implementação](../src/js/toy-room/ToyRoomStory.js). Contratos exportados/reexportados: `createToyRoomStoryState`, `ToyRoomStory`, `drawToySword`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomStoryState()` | Função atribuída | [99](../src/js/toy-room/ToyRoomStory.js#L99) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `distance(a, b)` | Função atribuída | [113](../src/js/toy-room/ToyRoomStory.js#L113) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `outsideViewport(point, viewport, margin = 72)` | Função | [115](../src/js/toy-room/ToyRoomStory.js#L115) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getBeat(beats, elapsed)` | Função | [124](../src/js/toy-room/ToyRoomStory.js#L124) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `constructor({ world, actors, exploration, flow, controls, audio, presentation })` | Método declarado | [136](../src/js/toy-room/ToyRoomStory.js#L136) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `refreshReachablePoints()` | Método declarado | [152](../src/js/toy-room/ToyRoomStory.js#L152) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `recordViewport(frame)` | Método declarado | [161](../src/js/toy-room/ToyRoomStory.js#L161) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `onToyStored(toy)` | Método declarado | [166](../src/js/toy-room/ToyRoomStory.js#L166) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update(dt)` | Método declarado | [187](../src/js/toy-room/ToyRoomStory.js#L187) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateReturns(dt)` | Método declarado | [228](../src/js/toy-room/ToyRoomStory.js#L228) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `beginInvestigation()` | Método declarado | [269](../src/js/toy-room/ToyRoomStory.js#L269) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateInvestigation(dt)` | Método declarado | [292](../src/js/toy-room/ToyRoomStory.js#L292) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateSwordGuide()` | Método declarado | [328](../src/js/toy-room/ToyRoomStory.js#L328) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `updateAfterMovement()` | Método declarado | [337](../src/js/toy-room/ToyRoomStory.js#L337) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `clearInput()` | Método declarado | [356](../src/js/toy-room/ToyRoomStory.js#L356) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `inputLocked()` | Acessor | [361](../src/js/toy-room/ToyRoomStory.js#L361) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `swordEquipped()` | Acessor | [369](../src/js/toy-room/ToyRoomStory.js#L369) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attack()` | Método declarado | [374](../src/js/toy-room/ToyRoomStory.js#L374) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canCollectToys()` | Acessor | [383](../src/js/toy-room/ToyRoomStory.js#L383) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `guidePosition()` | Método declarado | [392](../src/js/toy-room/ToyRoomStory.js#L392) | Retorna posição visual da fada acima do brinquedo-alvo do tutorial. |
| `cameraTarget()` | Método declarado | [414](../src/js/toy-room/ToyRoomStory.js#L414) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderWorldObject(ctx)` | Método declarado | [428](../src/js/toy-room/ToyRoomStory.js#L428) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderAttackSprite(ctx)` | Método declarado | [433](../src/js/toy-room/ToyRoomStory.js#L433) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderHeldObject(ctx)` | Método declarado | [443](../src/js/toy-room/ToyRoomStory.js#L443) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `advanceDialogue()` | Método declarado | [453](../src/js/toy-room/ToyRoomStory.js#L453) | Adianta uma fala pelo controlador da sequência sem executar salto, coleta ou ataque; conserva temporização autorada. |
| `narrativeBeat()` | Método declarado | [475](../src/js/toy-room/ToyRoomStory.js#L475) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderNarrative(ctx, canvas)` | Método declarado | [505](../src/js/toy-room/ToyRoomStory.js#L505) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryBeat(ctx, canvas, beat)` | Método declarado | [511](../src/js/toy-room/ToyRoomStory.js#L511) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `restore(saved)` | Método declarado | [520](../src/js/toy-room/ToyRoomStory.js#L520) | Reaplica a captura específica; confira referências e dados transitórios. |
| `snapshot()` | Método declarado | [540](../src/js/toy-room/ToyRoomStory.js#L540) | Produz captura recuperável do estado específico deste componente. |

## src/js/toy-room/ToyRoomTutorial.js

[Implementação](../src/js/toy-room/ToyRoomTutorial.js). Contratos exportados/reexportados: `ToyRoomTutorial`, `TOY_ROOM_INPUT`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor(context)` | Método declarado | [7](../src/js/toy-room/ToyRoomTutorial.js#L7) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `start()` | Método declarado | [16](../src/js/toy-room/ToyRoomTutorial.js#L16) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `setDevice(device)` | Método declarado | [28](../src/js/toy-room/ToyRoomTutorial.js#L28) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `nearest()` | Método declarado | [32](../src/js/toy-room/ToyRoomTutorial.js#L32) | Seleciona brinquedo elegível mais próximo do jogador para orientar coleta. |
| `finish()` | Método declarado | [45](../src/js/toy-room/ToyRoomTutorial.js#L45) | Executa a etapa correspondente do fluxo; revise seus efeitos de estado e áudio. |
| `update(dt)` | Método declarado | [52](../src/js/toy-room/ToyRoomTutorial.js#L52) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `distance(t)` | Função atribuída | [64](../src/js/toy-room/ToyRoomTutorial.js#L64) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `guidePosition()` | Método declarado | [79](../src/js/toy-room/ToyRoomTutorial.js#L79) | Retorna posição visual da fada acima do brinquedo-alvo do tutorial. |
| `message()` | Acessor | [88](../src/js/toy-room/ToyRoomTutorial.js#L88) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(ctx, canvas, frame)` | Método declarado | [105](../src/js/toy-room/ToyRoomTutorial.js#L105) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/ToyRoomUI.js

[Implementação](../src/js/toy-room/ToyRoomUI.js). Contratos exportados/reexportados: `ToyRoomUI`, `toyRoomUI`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderUI(ctx, canvas, state)` | Método declarado | [20](../src/js/toy-room/ToyRoomUI.js#L20) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/arenaCombatContact.js

[Implementação](../src/js/toy-room/arenaCombatContact.js). Contratos exportados/reexportados: `arenaEnemyContact`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaEnemyContact(state, enemy)` | Função | [2](../src/js/toy-room/arenaCombatContact.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/arenaCombatRules.js

[Implementação](../src/js/toy-room/arenaCombatRules.js). Contratos exportados/reexportados: `ARENA_SWORD`, `arenaEnemyImpactEnd`, `arenaEnemyGuarding`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaEnemyImpactEnd(enemy, tuning = { windup: 54, active: 18, },)` | Função atribuída | [9](../src/js/toy-room/arenaCombatRules.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaEnemyGuarding(enemy, tuning)` | Função | [17](../src/js/toy-room/arenaCombatRules.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/arenaDifficulty.js

[Implementação](../src/js/toy-room/arenaDifficulty.js). Contratos exportados/reexportados: `arenaDifficulty`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaDifficulty(difficulty = 'NORMAL')` | Função | [28](../src/js/toy-room/arenaDifficulty.js#L28) | Seleciona os perfis originais do NORMAL ou alcance ampliado e menor agressividade no EASY. |

## src/js/toy-room/arenaEnemies.js

[Implementação](../src/js/toy-room/arenaEnemies.js). Contratos exportados/reexportados: `ARENA_ENEMIES`, `renderArenaEnemyPresence`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderArenaEnemyPresence(ctx, enemy, ground)` | Função | [69](../src/js/toy-room/arenaEnemies.js#L69) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/arenaEnemyAI.js

[Implementação](../src/js/toy-room/arenaEnemyAI.js). Contratos exportados/reexportados: `selectArenaEnemyAttack`, `updateArenaEnemyAI`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | [51](../src/js/toy-room/arenaEnemyAI.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updatePlayerBehavior(battle, dt)` | Função | [53](../src/js/toy-room/arenaEnemyAI.js#L53) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `selectArenaEnemyAttack(battle, distance, attacks)` | Função | [77](../src/js/toy-room/arenaEnemyAI.js#L77) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateArenaEnemyAI(battle, dt)` | Função | [115](../src/js/toy-room/arenaEnemyAI.js#L115) | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/toy-room/arenaEnvironment.js

[Implementação](../src/js/toy-room/arenaEnvironment.js). Contratos exportados/reexportados: `renderArenaEnvironment`, `renderArenaTemple`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderArenaRoom(ctx, room, arena)` | Função | [6](../src/js/toy-room/arenaEnvironment.js#L6) | Compõe parede, madeira repetida e rodapé existentes, sem alterar colisões. |
| `renderArenaStructure(ctx, room, structure)` | Função | [56](../src/js/toy-room/arenaEnvironment.js#L56) | Apoia o móvel na base visual do layout e reutiliza sua ilustração. |
| `renderArenaEnvironment(ctx, room, arena, time = 0)` | Função | [102](../src/js/toy-room/arenaEnvironment.js#L102) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderArenaTemple(ctx, room, arena, foreground = false)` | Função | [141](../src/js/toy-room/arenaEnvironment.js#L141) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/arenaGirlAnimationFrames.js

[Implementação](../src/js/toy-room/arenaGirlAnimationFrames.js). Contratos exportados/reexportados: `ARENA_GIRL_REFERENCE_HEIGHT`, `ARENA_GIRL_ANIMATION_FRAMES`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `frames(pose)` | Função atribuída | [5](../src/js/toy-room/arenaGirlAnimationFrames.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/arenaHUD.js

[Implementação](../src/js/toy-room/arenaHUD.js). Contratos exportados/reexportados: `ARENA_ENEMY_NAMES`, `arenaHUDLayout`, `renderArenaHUD`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaHUDLayout(layout)` | Função | [11](../src/js/toy-room/arenaHUD.js#L11) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderArenaMobileControls(ctx, layout, room, state)` | Função | [35](../src/js/toy-room/arenaHUD.js#L35) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawAction(button, title, badge, special = false)` | Função atribuída | [101](../src/js/toy-room/arenaHUD.js#L101) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderArenaHUD(ctx, room, state, layout, boss = null)` | Função | [127](../src/js/toy-room/arenaHUD.js#L127) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `bar(b, hp, max, color, reverse)` | Função atribuída | [137](../src/js/toy-room/arenaHUD.js#L137) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/arenaPlayerAnimation.js

[Implementação](../src/js/toy-room/arenaPlayerAnimation.js). Contratos exportados/reexportados: `ARENA_ATTACK_VISUAL_DURATION`, `createPlayerAnimation`, `beginArenaPlayerAttack`, `updateArenaPlayerAnimation`, `sampleArenaPlayerAnimation`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp01(value)` | Função atribuída | [6](../src/js/toy-room/arenaPlayerAnimation.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `smooth(value)` | Função atribuída | [7](../src/js/toy-room/arenaPlayerAnimation.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `createPlayerAnimation(state = {}, player = {})` | Função | [11](../src/js/toy-room/arenaPlayerAnimation.js#L11) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `beginArenaPlayerAttack(state, direction)` | Função | [43](../src/js/toy-room/arenaPlayerAnimation.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateArenaPlayerAnimation(state, player, dt)` | Função | [51](../src/js/toy-room/arenaPlayerAnimation.js#L51) | Avança o estado do subsistema; não é uma operação somente de desenho. |
| `layer(pose, index = 0, weight = 1)` | Função atribuída | [109](../src/js/toy-room/arenaPlayerAnimation.js#L109) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `pair(from, to, weight)` | Função atribuída | [113](../src/js/toy-room/arenaPlayerAnimation.js#L113) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cycle(pose, time, durations)` | Função | [125](../src/js/toy-room/arenaPlayerAnimation.js#L125) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `poseLayers(pose, time, a, state)` | Função | [139](../src/js/toy-room/arenaPlayerAnimation.js#L139) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sampleArenaPlayerAnimation(state, player)` | Função | [209](../src/js/toy-room/arenaPlayerAnimation.js#L209) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/arenaScale.js

[Implementação](../src/js/toy-room/arenaScale.js). Contratos exportados/reexportados: `ARENA_SCALE`, `ARENA_PLAYER_HEIGHT`, `arenaActorBounds`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `arenaActorBounds(x, ground, jump = 0, height = ARENA_PLAYER_HEIGHT, width = height * 1.3,)` | Função | [9](../src/js/toy-room/arenaScale.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/arenaSpecialAttack.js

[Implementação](../src/js/toy-room/arenaSpecialAttack.js). Contratos exportados/reexportados: `ARENA_SPECIAL`, `RAINBOW_COLORS`, `beginArenaSpecial`, `updateArenaSpecial`, `specialCameraFrame`, `renderSpecialSwordAura`, `renderArenaSpecialBeam`, `ARENA_SPECIAL_CLOSEUP_FILE`, `renderArenaSpecialCloseup`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp01(value)` | Função atribuída | [19](../src/js/toy-room/arenaSpecialAttack.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `smooth(value)` | Função atribuída | [20](../src/js/toy-room/arenaSpecialAttack.js#L20) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `beginArenaSpecial(battle)` | Função | [25](../src/js/toy-room/arenaSpecialAttack.js#L25) | Consome o uso único e inicia a carga da espada na arena quando a ativação é válida. |
| `updateArenaSpecial(battle, dt)` | Função | [66](../src/js/toy-room/arenaSpecialAttack.js#L66) | Avança a encenação com física/IA suspensas e aplica dano único na chegada do raio. |
| `specialCameraFrame(frame, room, state)` | Função | [115](../src/js/toy-room/arenaSpecialAttack.js#L115) | Aproxima do rosto durante a carga e retorna ao panorama antes do corte. |
| `renderSpecialSwordAura(ctx, state)` | Função | [135](../src/js/toy-room/arenaSpecialAttack.js#L135) | Envolve a lâmina existente em sete cores e partículas sem redesenhar o sprite. |
| `renderArenaSpecialBeam(ctx, room, state, ground)` | Função | [177](../src/js/toy-room/arenaSpecialAttack.js#L177) | Desenha a viagem do raio até o alvo e os anéis do impacto, sem alterar estado. |
| `renderArenaSpecialCloseup(ctx, canvas, state, image)` | Função | [225](../src/js/toy-room/arenaSpecialAttack.js#L225) | Compõe um corte de anime com ambos os olhos, entrada/saída rápidas e energia; não avança a simulação. |

## src/js/toy-room/battleAssets.js

[Implementação](../src/js/toy-room/battleAssets.js). Contratos exportados/reexportados: `loadBattleManifest`, `loadBattleImages`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `loadBattleManifest()` | Função | [8](../src/js/toy-room/battleAssets.js#L8) | Carrega o manifesto de remediação e substitui as sequências Hit pelos quadros nativos de dano. |
| `loadBattleImages(manifest, images)` | Função | [19](../src/js/toy-room/battleAssets.js#L19) | Preenche o cache de imagens da batalha, com erro explícito para recursos ausentes. |

## src/js/toy-room/battleConfig.js

[Implementação](../src/js/toy-room/battleConfig.js). Contratos exportados/reexportados: `BATTLE_ORDER`, `BATTLE_PLAYER_VISUAL_SCALE`, `BATTLE_TUNING`, `BATTLE_TRANSITION_DURATION`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/battleGirlFrames.js

[Implementação](../src/js/toy-room/battleGirlFrames.js). Contratos exportados/reexportados: `BATTLE_GIRL_SOURCE_SHA256`, `BATTLE_GIRL_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/battlePlayerBounds.js

[Implementação](../src/js/toy-room/battlePlayerBounds.js). Contratos exportados/reexportados: `BATTLE_PLAYER_BOUNDS`, `BATTLE_ROCKET_GLOVE_BOUNDS`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/battlePresentation.js

[Implementação](../src/js/toy-room/battlePresentation.js). Contratos exportados/reexportados: `BATTLE_PLAYER_HALF_WIDTH`, `rocketPunchProjection`, `rocketPunchTouchesPlayer`, `renderRocketPunch`, `BATTLE_LASER_HEIGHT`, `BATTLE_CROUCH_FRAME`, `BATTLE_JUMP_VISUAL_SCALE`, `renderBattleCrouch`, `battlePlayerJumpOffset`, `laserProjection`, `BATTLE_TRAIN_BODY`, `trainDrive`, `renderTrainWalk`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `rocketPunchProjection(frame, reference, elapsed, signedDistance, target = null)` | Função | [10](../src/js/toy-room/battlePresentation.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `rocketPunchTouchesPlayer(frame, reference, elapsed, signedDistance, target)` | Função | [85](../src/js/toy-room/battlePresentation.js#L85) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderRocketPunch(ctx, image, frame, reference, elapsed, signedDistance, target = null,)` | Função | [119](../src/js/toy-room/battlePresentation.js#L119) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderBattleCrouch(ctx, image, player, attackTime, attackDirection)` | Função | [193](../src/js/toy-room/battlePresentation.js#L193) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `playerModel(state, player, attackDirection)` | Função | [209](../src/js/toy-room/battlePresentation.js#L209) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `battlePlayerJumpOffset(state, player, attackDirection)` | Função | [233](../src/js/toy-room/battlePresentation.js#L233) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `laserProjection(state, player, enemy, attackDirection)` | Função | [237](../src/js/toy-room/battlePresentation.js#L237) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `trainDrive(elapsed)` | Função | [276](../src/js/toy-room/battlePresentation.js#L276) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderTrainWalk(ctx, body, parts, elapsed, transportScale = 1)` | Função | [294](../src/js/toy-room/battlePresentation.js#L294) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/battleRenderer.js

[Implementação](../src/js/toy-room/battleRenderer.js). Contratos exportados/reexportados: `battleAnimationFrame`, `renderBattle`, `renderBattleImpact`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(n, a, b)` | Função atribuída | [22](../src/js/toy-room/battleRenderer.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `battleAnimationFrame(animation, enemy, duration, tuning = BATTLE_TUNING)` | Função | [25](../src/js/toy-room/battleRenderer.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderBattle(battle)` | Função | [47](../src/js/toy-room/battleRenderer.js#L47) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawEnemy(e)` | Função atribuída | [90](../src/js/toy-room/battleRenderer.js#L90) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `hearts(hp, max)` | Função atribuída | [345](../src/js/toy-room/battleRenderer.js#L345) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderBattleImpact(ctx, impact)` | Função | [420](../src/js/toy-room/battleRenderer.js#L420) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/damageAudio.js

[Implementação](../src/js/toy-room/damageAudio.js). Contratos exportados/reexportados: `DAMAGE_AUDIO_PROFILES`, `scheduleDamageSound`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `scheduleDamageSound(ctx, destination, register, actor, arena = false)` | Função | [45](../src/js/toy-room/damageAudio.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `connectVoice(source, nodes, start, end)` | Função atribuída | [51](../src/js/toy-room/damageAudio.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `envelope(volume, start, duration, attack = 0.004)` | Função atribuída | [72](../src/js/toy-room/damageAudio.js#L72) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/damageSpriteFrames.js

[Implementação](../src/js/toy-room/damageSpriteFrames.js). Contratos exportados/reexportados: `DAMAGE_SPRITE_FRAMES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/enemyMovementAudio.js

[Implementação](../src/js/toy-room/enemyMovementAudio.js). Contratos exportados/reexportados: `scheduleEnemyMovement`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `scheduleEnemyMovement(ctx, destination, register, actor)` | Função | [2](../src/js/toy-room/enemyMovementAudio.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/index.js

[Implementação](../src/js/toy-room/index.js). Contratos exportados/reexportados: `ToyRenderer`, `toyRenderer`, `RoomEnvironmentRenderer`, `roomEnvironmentRenderer`, `ToyRoomEntities`, `toyRoomEntities`, `ToyRoomUI`, `toyRoomUI`, `ToyRoomPhase`, `createToyRoom`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/swordAudio.js

[Implementação](../src/js/toy-room/swordAudio.js). Contratos exportados/reexportados: `scheduleSwordSound`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `scheduleSwordSound(ctx, destination, register, event)` | Função | [2](../src/js/toy-room/swordAudio.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `voice(source, nodes, duration, delay = 0)` | Função atribuída | [6](../src/js/toy-room/swordAudio.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `envelope(volume, duration, attack = 0.003, delay = 0)` | Função atribuída | [27](../src/js/toy-room/swordAudio.js#L27) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `noise(volume, duration, frequency, end, attack = 0.003)` | Função atribuída | [35](../src/js/toy-room/swordAudio.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tone(frequency, end, volume, duration, type = 'sine', delay = 0)` | Função atribuída | [52](../src/js/toy-room/swordAudio.js#L52) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/toyCarryPresentation.js

[Implementação](../src/js/toy-room/toyCarryPresentation.js). Contratos exportados/reexportados: `CARRY_PROFILES`, `renderToyCarry`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `carriedSprite(toy, options)` | Função | [58](../src/js/toy-room/toyCarryPresentation.js#L58) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `renderToyCarry(ctx, player, options = {})` | Função | [114](../src/js/toy-room/toyCarryPresentation.js#L114) | Compõe pose, brinquedo e contatos visuais usando CARRY_PROFILES; sem pose/item devolve false. |
| `drawBody()` | Função atribuída | [164](../src/js/toy-room/toyCarryPresentation.js#L164) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/toyRoomCamera.js

[Implementação](../src/js/toy-room/toyRoomCamera.js). Contratos exportados/reexportados: `updateToyRoomCamera`, `getToyRoomCameraFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateToyRoomCamera({ target, canvas, width, height, cameraX, cameraY }, dt)` | Função | [5](../src/js/toy-room/toyRoomCamera.js#L5) | Calcula coordenadas da câmera da sala a partir do alvo narrativo explícito. |
| `getToyRoomCameraFrame({ target, canvas, cameraX, cameraY, mobilePresentation })` | Função | [29](../src/js/toy-room/toyRoomCamera.js#L29) | Calcula zoom e enquadramento da sala com alvo/câmera/layout atuais. |

## src/js/toy-room/toyRoomCompanion.js

[Implementação](../src/js/toy-room/toyRoomCompanion.js). Contratos exportados/reexportados: `updateToyRoomCompanion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateToyRoomCompanion({ player, fairy, toys, tutorial, story, gameDifficulty, guideToy }, dt,)` | Função | [5](../src/js/toy-room/toyRoomCompanion.js#L5) | Atualiza guia, tutorial, voo e rastro da fada; devolve o brinquedo-guia atual. |

## src/js/toy-room/toyRoomEffects.js

[Implementação](../src/js/toy-room/toyRoomEffects.js). Contratos exportados/reexportados: `spawnToyRoomSparkles`, `spawnToyRoomConfetti`, `initializeToyRoomSunMotes`, `updateToyRoomEffects`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `spawnToyRoomSparkles(sparkles, x, y, count = 12, hue = '#facc15')` | Função | [2](../src/js/toy-room/toyRoomEffects.js#L2) | Cria partículas/efeitos no buffer correspondente. |
| `spawnToyRoomConfetti(confetti, x, y, count = 35)` | Função | [19](../src/js/toy-room/toyRoomEffects.js#L19) | Cria partículas/efeitos no buffer correspondente. |
| `initializeToyRoomSunMotes(sunMotes, width, height)` | Função | [40](../src/js/toy-room/toyRoomEffects.js#L40) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `updateToyRoomEffects({ chest, sparkles, confetti, footstepPuffs, sunMotes, width, height }, dt,)` | Função | [54](../src/js/toy-room/toyRoomEffects.js#L54) | Avança coleções de partículas e animação do baú recebidas no quadro. |

## src/js/toy-room/toyRoomEnvironmentAssets.js

[Implementação](../src/js/toy-room/toyRoomEnvironmentAssets.js). Contratos exportados/reexportados: `createToyRoomEnvironmentAssets`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomEnvironmentAssets(assets)` | Função | [2](../src/js/toy-room/toyRoomEnvironmentAssets.js#L2) | Resolve recortes ambientais existentes sem acessar regras ou estado da exploração. |

## src/js/toy-room/toyRoomInitialEntities.js

[Implementação](../src/js/toy-room/toyRoomInitialEntities.js). Contratos exportados/reexportados: `createToyRoomInitialEntities`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomInitialEntities()` | Função | [2](../src/js/toy-room/toyRoomInitialEntities.js#L2) | Cria jogador, fada, móveis e brinquedos independentes por instância, preservando o catálogo. |

## src/js/toy-room/toyRoomInputBindings.js

[Implementação](../src/js/toy-room/toyRoomInputBindings.js). Contratos exportados/reexportados: `TOY_ROOM_INPUT`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/toy-room/toyRoomInputContext.js

[Implementação](../src/js/toy-room/toyRoomInputContext.js). Contratos exportados/reexportados: `createToyRoomInputContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomInputContext(room)` | Função | [2](../src/js/toy-room/toyRoomInputContext.js#L2) | Adapta entrada, Canvas e callbacks sem copiar os dados usados por HUD/combate. |
| `keysDown()` | Acessor | [6](../src/js/toy-room/toyRoomInputContext.js#L6) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `keysDown(value)` | Acessor | [10](../src/js/toy-room/toyRoomInputContext.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isTouchDevice()` | Acessor | [14](../src/js/toy-room/toyRoomInputContext.js#L14) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isTouchDevice(value)` | Acessor | [18](../src/js/toy-room/toyRoomInputContext.js#L18) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `actionBtnPressed()` | Acessor | [22](../src/js/toy-room/toyRoomInputContext.js#L22) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `actionBtnPressed(value)` | Acessor | [26](../src/js/toy-room/toyRoomInputContext.js#L26) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `touchState()` | Acessor | [30](../src/js/toy-room/toyRoomInputContext.js#L30) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gamepadState()` | Acessor | [34](../src/js/toy-room/toyRoomInputContext.js#L34) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaTouchPointers()` | Acessor | [38](../src/js/toy-room/toyRoomInputContext.js#L38) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaTouchButtons()` | Acessor | [42](../src/js/toy-room/toyRoomInputContext.js#L42) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaSpecialButtons()` | Acessor | [46](../src/js/toy-room/toyRoomInputContext.js#L46) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canvas()` | Acessor | [51](../src/js/toy-room/toyRoomInputContext.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | [55](../src/js/toy-room/toyRoomInputContext.js#L55) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `mobile()` | Acessor | [59](../src/js/toy-room/toyRoomInputContext.js#L59) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `device()` | Acessor | [63](../src/js/toy-room/toyRoomInputContext.js#L63) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `handlers()` | Acessor | [67](../src/js/toy-room/toyRoomInputContext.js#L67) | Trata evento ou entrada; revise bloqueios e ciclo de vida de listeners. |
| `isEnabled()` | API/lambda de objeto | [78](../src/js/toy-room/toyRoomInputContext.js#L78) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isLocked()` | API/lambda de objeto | [80](../src/js/toy-room/toyRoomInputContext.js#L80) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isArenaCombat()` | API/lambda de objeto | [82](../src/js/toy-room/toyRoomInputContext.js#L82) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `setDevice(device)` | API/lambda de objeto | [84](../src/js/toy-room/toyRoomInputContext.js#L84) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `initAudio()` | API/lambda de objeto | [86](../src/js/toy-room/toyRoomInputContext.js#L86) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `action()` | API/lambda de objeto | [90](../src/js/toy-room/toyRoomInputContext.js#L90) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `special()` | API/lambda de objeto | [92](../src/js/toy-room/toyRoomInputContext.js#L92) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/toyRoomInteractionContext.js

[Implementação](../src/js/toy-room/toyRoomInteractionContext.js). Contratos exportados/reexportados: `createToyRoomInteractionContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomInteractionContext(room)` | Função | [2](../src/js/toy-room/toyRoomInteractionContext.js#L2) | Fornece referências atuais e efeitos específicos para as decisões de interação. |
| `ACTION_DEBOUNCE_MS()` | Acessor | [5](../src/js/toy-room/toyRoomInteractionContext.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ROOM_H()` | Acessor | [9](../src/js/toy-room/toyRoomInteractionContext.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `ROOM_W()` | Acessor | [13](../src/js/toy-room/toyRoomInteractionContext.js#L13) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arena()` | Acessor | [17](../src/js/toy-room/toyRoomInteractionContext.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `audio()` | Acessor | [21](../src/js/toy-room/toyRoomInteractionContext.js#L21) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `battle()` | Acessor | [25](../src/js/toy-room/toyRoomInteractionContext.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canInteract()` | Acessor | [29](../src/js/toy-room/toyRoomInteractionContext.js#L29) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `canInteract(value)` | Acessor | [33](../src/js/toy-room/toyRoomInteractionContext.js#L33) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture()` | Acessor | [37](../src/js/toy-room/toyRoomInteractionContext.js#L37) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isInputEnabled(...args)` | API/lambda de objeto | [41](../src/js/toy-room/toyRoomInteractionContext.js#L41) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isNearChest()` | Acessor | [43](../src/js/toy-room/toyRoomInteractionContext.js#L43) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isNearChest(value)` | Acessor | [47](../src/js/toy-room/toyRoomInteractionContext.js#L47) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `lastActionTime()` | Acessor | [51](../src/js/toy-room/toyRoomInteractionContext.js#L51) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `lastActionTime(value)` | Acessor | [55](../src/js/toy-room/toyRoomInteractionContext.js#L55) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount()` | Acessor | [59](../src/js/toy-room/toyRoomInteractionContext.js#L59) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount(value)` | Acessor | [63](../src/js/toy-room/toyRoomInteractionContext.js#L63) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | [67](../src/js/toy-room/toyRoomInteractionContext.js#L67) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `spawnConfetti(...args)` | API/lambda de objeto | [71](../src/js/toy-room/toyRoomInteractionContext.js#L71) | Cria partículas/efeitos no buffer correspondente. |
| `spawnSparkles(...args)` | API/lambda de objeto | [73](../src/js/toy-room/toyRoomInteractionContext.js#L73) | Cria partículas/efeitos no buffer correspondente. |
| `story()` | Acessor | [75](../src/js/toy-room/toyRoomInteractionContext.js#L75) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | [79](../src/js/toy-room/toyRoomInteractionContext.js#L79) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tutorial()` | Acessor | [83](../src/js/toy-room/toyRoomInteractionContext.js#L83) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `uiFeedback()` | Acessor | [87](../src/js/toy-room/toyRoomInteractionContext.js#L87) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive()` | Acessor | [91](../src/js/toy-room/toyRoomInteractionContext.js#L91) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive(value)` | Acessor | [95](../src/js/toy-room/toyRoomInteractionContext.js#L95) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer()` | Acessor | [99](../src/js/toy-room/toyRoomInteractionContext.js#L99) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer(value)` | Acessor | [103](../src/js/toy-room/toyRoomInteractionContext.js#L103) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/toyRoomLighting.js

[Implementação](../src/js/toy-room/toyRoomLighting.js). Contratos exportados/reexportados: `TOY_ROOM_WINDOWS`, `getToyRoomFloorLight`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getToyRoomFloorLight(x, y)` | Função | [14](../src/js/toy-room/toyRoomLighting.js#L14) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/toy-room/toyRoomMovement.js

[Implementação](../src/js/toy-room/toyRoomMovement.js). Contratos exportados/reexportados: `updateToyRoomMovement`, `resolveToyRoomCollisions`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `updateToyRoomMovement({ player, keysDown, gamepadState, touchState, footstepPuffs, resolveCollisions }, dt,)` | Função | [2](../src/js/toy-room/toyRoomMovement.js#L2) | Aplica prioridade das entradas, peso, orientação, passos e integração da exploração. |
| `resolveToyRoomCollisions({ width, height, furniture }, px, py, r)` | Função | [81](../src/js/toy-room/toyRoomMovement.js#L81) | Limita a posição e resolve móveis na ordem original, conservando o desempate de penetrações. |

## src/js/toy-room/toyRoomOrientation.js

[Implementação](../src/js/toy-room/toyRoomOrientation.js). Contratos exportados/reexportados: `nearestToyGuide`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `nearestToyGuide(player, toys, previous)` | Função | [2](../src/js/toy-room/toyRoomOrientation.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `distance(toy)` | Função atribuída | [4](../src/js/toy-room/toyRoomOrientation.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/toyRoomPersistenceContext.js

[Implementação](../src/js/toy-room/toyRoomPersistenceContext.js). Contratos exportados/reexportados: `createToyRoomPersistenceContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomPersistenceContext(room)` | Função | [2](../src/js/toy-room/toyRoomPersistenceContext.js#L2) | Adapta campos serializados e retomada dos subsistemas, inclusive após substituição dos atores. |
| `brinq()` | Acessor | [5](../src/js/toy-room/toyRoomPersistenceContext.js#L5) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `brinq(value)` | Acessor | [9](../src/js/toy-room/toyRoomPersistenceContext.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startBrinquedao(saved)` | API/lambda de objeto | [13](../src/js/toy-room/toyRoomPersistenceContext.js#L13) | Descarta os modos anteriores, conserva a origem da campanha e abre convite e circuito. |
| `dream()` | Acessor | [15](../src/js/toy-room/toyRoomPersistenceContext.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `dream(value)` | Acessor | [19](../src/js/toy-room/toyRoomPersistenceContext.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startDream(saved)` | API/lambda de objeto | [23](../src/js/toy-room/toyRoomPersistenceContext.js#L23) | Descarta modos anteriores, entradas e áudio; abre o sonho2D com a origem campanha/prévia preservada. |
| `epilogue()` | Acessor | [25](../src/js/toy-room/toyRoomPersistenceContext.js#L25) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `epilogue(value)` | Acessor | [29](../src/js/toy-room/toyRoomPersistenceContext.js#L29) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startEpilogue(saved)` | API/lambda de objeto | [33](../src/js/toy-room/toyRoomPersistenceContext.js#L33) | Descarta a perseguição, limpa entrada e inicia o epílogo recuperável; o callback abre o jardim com a mesma origem campanha/prévia. |
| `arena()` | Acessor | [35](../src/js/toy-room/toyRoomPersistenceContext.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `battle()` | Acessor | [39](../src/js/toy-room/toyRoomPersistenceContext.js#L39) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `garden()` | Acessor | [43](../src/js/toy-room/toyRoomPersistenceContext.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `garden(value)` | Acessor | [47](../src/js/toy-room/toyRoomPersistenceContext.js#L47) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `startGarden(saved)` | API/lambda de objeto | [51](../src/js/toy-room/toyRoomPersistenceContext.js#L51) | Encerra epílogo/perseguição, remove entradas da sala e inicia GardenPhase com recursos, física e áudio próprios; conserva a origem campanha/prévia. |
| `chase()` | Acessor | [53](../src/js/toy-room/toyRoomPersistenceContext.js#L53) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `chase(value)` | Acessor | [57](../src/js/toy-room/toyRoomPersistenceContext.js#L57) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraX()` | Acessor | [61](../src/js/toy-room/toyRoomPersistenceContext.js#L61) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraX(value)` | Acessor | [65](../src/js/toy-room/toyRoomPersistenceContext.js#L65) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraY()` | Acessor | [69](../src/js/toy-room/toyRoomPersistenceContext.js#L69) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraY(value)` | Acessor | [73](../src/js/toy-room/toyRoomPersistenceContext.js#L73) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clearInput()` | API/lambda de objeto | [77](../src/js/toy-room/toyRoomPersistenceContext.js#L77) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `fairy()` | Acessor | [79](../src/js/toy-room/toyRoomPersistenceContext.js#L79) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `fairy(value)` | Acessor | [83](../src/js/toy-room/toyRoomPersistenceContext.js#L83) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture()` | Acessor | [87](../src/js/toy-room/toyRoomPersistenceContext.js#L87) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture(value)` | Acessor | [91](../src/js/toy-room/toyRoomPersistenceContext.js#L91) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState()` | Acessor | [95](../src/js/toy-room/toyRoomPersistenceContext.js#L95) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState(value)` | Acessor | [99](../src/js/toy-room/toyRoomPersistenceContext.js#L99) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introAlpha()` | Acessor | [103](../src/js/toy-room/toyRoomPersistenceContext.js#L103) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introAlpha(value)` | Acessor | [107](../src/js/toy-room/toyRoomPersistenceContext.js#L107) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introBannerTimer()` | Acessor | [111](../src/js/toy-room/toyRoomPersistenceContext.js#L111) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introBannerTimer(value)` | Acessor | [115](../src/js/toy-room/toyRoomPersistenceContext.js#L115) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `lastActionTime()` | Acessor | [119](../src/js/toy-room/toyRoomPersistenceContext.js#L119) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `lastActionTime(value)` | Acessor | [123](../src/js/toy-room/toyRoomPersistenceContext.js#L123) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount()` | Acessor | [127](../src/js/toy-room/toyRoomPersistenceContext.js#L127) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `organizedCount(value)` | Acessor | [131](../src/js/toy-room/toyRoomPersistenceContext.js#L131) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | [135](../src/js/toy-room/toyRoomPersistenceContext.js#L135) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `player(value)` | Acessor | [139](../src/js/toy-room/toyRoomPersistenceContext.js#L139) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `startTutorial()` | API/lambda de objeto | [143](../src/js/toy-room/toyRoomPersistenceContext.js#L143) | Inicia orientação guiada da Toy Room se ainda não concluída. |
| `startChaseCampaign(saved)` | API/lambda de objeto | [145](../src/js/toy-room/toyRoomPersistenceContext.js#L145) | Prepara a fuga da campanha sob fade, desliga entradas da sala e recupera falhas de preparação. |
| `story()` | Acessor | [147](../src/js/toy-room/toyRoomPersistenceContext.js#L147) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted()` | Acessor | [151](../src/js/toy-room/toyRoomPersistenceContext.js#L151) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted(value)` | Acessor | [155](../src/js/toy-room/toyRoomPersistenceContext.js#L155) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | [159](../src/js/toy-room/toyRoomPersistenceContext.js#L159) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys(value)` | Acessor | [163](../src/js/toy-room/toyRoomPersistenceContext.js#L163) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tutorial()` | Acessor | [167](../src/js/toy-room/toyRoomPersistenceContext.js#L167) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive()` | Acessor | [171](../src/js/toy-room/toyRoomPersistenceContext.js#L171) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerActive(value)` | Acessor | [175](../src/js/toy-room/toyRoomPersistenceContext.js#L175) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer()` | Acessor | [179](../src/js/toy-room/toyRoomPersistenceContext.js#L179) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `victoryBannerTimer(value)` | Acessor | [183](../src/js/toy-room/toyRoomPersistenceContext.js#L183) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/toyRoomSceneFrame.js

[Implementação](../src/js/toy-room/toyRoomSceneFrame.js). Contratos exportados/reexportados: `createToyRoomSceneFrame`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomSceneFrame(room)` | Função | [2](../src/js/toy-room/toyRoomSceneFrame.js#L2) | Monta dados e callbacks atuais para desenhar uma cena da sala. |
| `getCameraFrame()` | API/lambda de objeto | [26](../src/js/toy-room/toyRoomSceneFrame.js#L26) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/toy-room/toyRoomSceneRenderer.js

[Implementação](../src/js/toy-room/toyRoomSceneRenderer.js). Contratos exportados/reexportados: `renderToyRoomScene`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToyRoomScene(scene, options = {})` | Função | [8](../src/js/toy-room/toyRoomSceneRenderer.js#L8) | Compõe cenário, entidades por Y, efeitos, HUD e falas com os dados do quadro. |

## src/js/toy-room/toyRoomShadows.js

[Implementação](../src/js/toy-room/toyRoomShadows.js). Contratos exportados/reexportados: `prepareToyRoomShadows`, `getToyRoomShadowItems`, `renderToyRoomShadows`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `canvas(width, height)` | Função | [12](../src/js/toy-room/toyRoomShadows.js#L12) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `contactStamp()` | Função | [19](../src/js/toy-room/toyRoomShadows.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `makeCaster(width, height, draw, rootX = 0, rootY = null)` | Função | [34](../src/js/toy-room/toyRoomShadows.js#L34) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `store(scene)` | Função | [128](../src/js/toy-room/toyRoomShadows.js#L128) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `caster(data, scene, type, item)` | Função | [141](../src/js/toy-room/toyRoomShadows.js#L141) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `prepareToyRoomShadows(assets)` | Função | [216](../src/js/toy-room/toyRoomShadows.js#L216) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getToyRoomShadowItems(scene)` | Função | [239](../src/js/toy-room/toyRoomShadows.js#L239) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `renderToyRoomShadows(ctx, scene)` | Função | [259](../src/js/toy-room/toyRoomShadows.js#L259) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/toyRoomStoryContext.js

[Implementação](../src/js/toy-room/toyRoomStoryContext.js). Contratos exportados/reexportados: `createToyRoomStoryContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomStoryContext(room)` | Função | [7](../src/js/toy-room/toyRoomStoryContext.js#L7) | Restringe a narrativa a mundo, atores, exploração, fluxo, controles, áudio e apresentação. |
| `getDimensions()` | API/lambda de objeto | [11](../src/js/toy-room/toyRoomStoryContext.js#L11) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getPlayer()` | API/lambda de objeto | [16](../src/js/toy-room/toyRoomStoryContext.js#L16) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `resolvePosition(x, y, radius)` | API/lambda de objeto | [18](../src/js/toy-room/toyRoomStoryContext.js#L18) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getCameraFrame()` | API/lambda de objeto | [20](../src/js/toy-room/toyRoomStoryContext.js#L20) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getCameraBounds()` | API/lambda de objeto | [22](../src/js/toy-room/toyRoomStoryContext.js#L22) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `player()` | Acessor | [31](../src/js/toy-room/toyRoomStoryContext.js#L31) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `fairy()` | Acessor | [35](../src/js/toy-room/toyRoomStoryContext.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `difficulty()` | Acessor | [39](../src/js/toy-room/toyRoomStoryContext.js#L39) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | [45](../src/js/toy-room/toyRoomStoryContext.js#L45) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `furniture()` | Acessor | [49](../src/js/toy-room/toyRoomStoryContext.js#L49) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `returnToy(toy, point)` | Método declarado | [53](../src/js/toy-room/toyRoomStoryContext.js#L53) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `releaseCarriedToy()` | Método declarado | [58](../src/js/toy-room/toyRoomStoryContext.js#L58) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tutorialActive()` | Acessor | [67](../src/js/toy-room/toyRoomStoryContext.js#L67) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `introductionActive()` | Acessor | [71](../src/js/toy-room/toyRoomStoryContext.js#L71) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `clear()` | Método declarado | [77](../src/js/toy-room/toyRoomStoryContext.js#L77) | Configura/reinicializa valores do componente; revise o escopo da mutação. |
| `playPickup()` | Método declarado | [93](../src/js/toy-room/toyRoomStoryContext.js#L93) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `useSwordTrack()` | Método declarado | [97](../src/js/toy-room/toyRoomStoryContext.js#L97) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `assets()` | Acessor | [103](../src/js/toy-room/toyRoomStoryContext.js#L103) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `mobile()` | Acessor | [107](../src/js/toy-room/toyRoomStoryContext.js#L107) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/toyRoomStoryRenderer.js

[Implementação](../src/js/toy-room/toyRoomStoryRenderer.js). Contratos exportados/reexportados: `createStoryAttackFrames`, `drawToySword`, `renderStoryWorldObject`, `renderStoryAttackSprite`, `renderStoryHeldObject`, `renderStoryBeat`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createStoryAttackFrames(assets)` | Função | [14](../src/js/toy-room/toyRoomStoryRenderer.js#L14) | Fábrica/estrutura inicial; consulte o objeto retornado e suas dependências. |
| `drawToySword(ctx, x, y, angle, scale = 1)` | Função | [35](../src/js/toy-room/toyRoomStoryRenderer.js#L35) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryWorldObject(ctx, state)` | Função | [67](../src/js/toy-room/toyRoomStoryRenderer.js#L67) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryAttackSprite(ctx, { state, player, attackFrames, attackDuration })` | Função | [71](../src/js/toy-room/toyRoomStoryRenderer.js#L71) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryHeldObject(ctx, { state, player, attackFrames, attackDuration })` | Função | [111](../src/js/toy-room/toyRoomStoryRenderer.js#L111) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderStoryBeat(ctx, canvas, beat, { mobile, assets, tick })` | Função | [154](../src/js/toy-room/toyRoomStoryRenderer.js#L154) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/toy-room/toyRoomToyActions.js

[Implementação](../src/js/toy-room/toyRoomToyActions.js). Contratos exportados/reexportados: `pickUpToy`, `storeToyInChest`, `releaseCarriedToy`, `returnToyToFloor`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `pickUpToy(player, toy)` | Função | [2](../src/js/toy-room/toyRoomToyActions.js#L2) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `storeToyInChest(player, chest)` | Função | [7](../src/js/toy-room/toyRoomToyActions.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `releaseCarriedToy(player, point)` | Função | [16](../src/js/toy-room/toyRoomToyActions.js#L16) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `returnToyToFloor(toy, point)` | Função | [24](../src/js/toy-room/toyRoomToyActions.js#L24) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/toyRoomTutorialContext.js

[Implementação](../src/js/toy-room/toyRoomTutorialContext.js). Contratos exportados/reexportados: `createToyRoomTutorialContext`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomTutorialContext(room)` | Função | [4](../src/js/toy-room/toyRoomTutorialContext.js#L4) | Expõe oito campos atuais ao tutorial; setters somente para conclusão e modo. |
| `mobilePresentation()` | Acessor | [7](../src/js/toy-room/toyRoomTutorialContext.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `player()` | Acessor | [11](../src/js/toy-room/toyRoomTutorialContext.js#L11) | Aciona o som/cue correspondente ou sua delegação de áudio. |
| `fairy()` | Acessor | [15](../src/js/toy-room/toyRoomTutorialContext.js#L15) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toys()` | Acessor | [19](../src/js/toy-room/toyRoomTutorialContext.js#L19) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraX()` | Acessor | [23](../src/js/toy-room/toyRoomTutorialContext.js#L23) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `cameraY()` | Acessor | [27](../src/js/toy-room/toyRoomTutorialContext.js#L27) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted()` | Acessor | [31](../src/js/toy-room/toyRoomTutorialContext.js#L31) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `toyRoomTutorialCompleted(value)` | Acessor | [35](../src/js/toy-room/toyRoomTutorialContext.js#L35) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState()` | Acessor | [39](../src/js/toy-room/toyRoomTutorialContext.js#L39) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `gameplayState(value)` | Acessor | [43](../src/js/toy-room/toyRoomTutorialContext.js#L43) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toy-room/toyRoomTutorialRenderer.js

[Implementação](../src/js/toy-room/toyRoomTutorialRenderer.js). Contratos exportados/reexportados: `renderToyRoomTutorial`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderToyRoomTutorial(ctx, canvas, frame, { fairy, cameraX, cameraY, message, step, device },)` | Função | [5](../src/js/toy-room/toyRoomTutorialRenderer.js#L5) | Desenha mensagens e ponteiro da orientação sem receber tutorial nem sala. |

## src/js/toy-room/toyRoomWorldQueries.js

[Implementação](../src/js/toy-room/toyRoomWorldQueries.js). Contratos exportados/reexportados: `createToyRoomWorldQueries`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `createToyRoomWorldQueries({ getDimensions, getPlayer, resolvePosition, getCameraFrame, getCameraBounds, })` | Função | [2](../src/js/toy-room/toyRoomWorldQueries.js#L2) | Cria consultas de piso/viewport com acessos explícitos às referências atuais. |
| `distance(a, b)` | Função atribuída | [9](../src/js/toy-room/toyRoomWorldQueries.js#L9) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `key(point)` | Função atribuída | [10](../src/js/toy-room/toyRoomWorldQueries.js#L10) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `isFree(point, radius = 24)` | Função | [12](../src/js/toy-room/toyRoomWorldQueries.js#L12) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `reachableFloor()` | Função | [17](../src/js/toy-room/toyRoomWorldQueries.js#L17) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `viewport(frame = getCameraFrame())` | Função | [71](../src/js/toy-room/toyRoomWorldQueries.js#L71) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/toyRoom.js

[Implementação](../src/js/toyRoom.js).

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/ui/DialogueRenderer.js

[Implementação](../src/js/ui/DialogueRenderer.js). Contratos exportados/reexportados: `DialogueRenderer`, `dialogueRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `drawPortrait(pCtx, charType, px, py, radius, mood = 'normal', tick = 0, options = {})` | Método declarado | [30](../src/js/ui/DialogueRenderer.js#L30) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapText(pCtx, text, maxWidth)` | Método declarado | [268](../src/js/ui/DialogueRenderer.js#L268) | Quebra texto conforme a largura medida pelo contexto. |
| `renderCutsceneDialogue(ctx, canvas, state = {}, options = {})` | Método declarado | [297](../src/js/ui/DialogueRenderer.js#L297) | Compõe falas, retratos, prompts e áreas seguras. |
| `renderDialogue(ctx, canvas, dialogue, options = {})` | Método declarado | [428](../src/js/ui/DialogueRenderer.js#L428) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `drawDialoguePortrait(pCtx, charType, px, py, radius, expression)` | Função atribuída | [442](../src/js/ui/DialogueRenderer.js#L442) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `wrapDialogueText(pCtx, text, maxWidth)` | Função atribuída | [444](../src/js/ui/DialogueRenderer.js#L444) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/ui/HudRenderer.js

[Implementação](../src/js/ui/HudRenderer.js). Contratos exportados/reexportados: `HudRenderer`, `hudRenderer`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderEscapeBanner(ctx, canvas, state = {}, cameraX = 0, player = {})` | Método declarado | [21](../src/js/ui/HudRenderer.js#L21) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/ui/TitleScene.js

[Implementação](../src/js/ui/TitleScene.js). Contratos exportados/reexportados: `TITLE_SCENE_LAYOUT`, `titleSceneFrame`, `TitleScene`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `titleSceneFrame(width, height)` | Função | [13](../src/js/ui/TitleScene.js#L13) | Calcula uma câmera comum para o quarto da tela inicial, com foco na menina no retrato e poltrona fixa no tapete. |
| `constructor(canvas, overlay)` | Método declarado | [27](../src/js/ui/TitleScene.js#L27) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `load()` | Método declarado | [49](../src/js/ui/TitleScene.js#L49) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `sync()` | Método declarado | [69](../src/js/ui/TitleScene.js#L69) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `tick(time)` | Método declarado | [85](../src/js/ui/TitleScene.js#L85) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `leg(ctx, source, knee, angle, scale, origin)` | Método declarado | [93](../src/js/ui/TitleScene.js#L93) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `render(time)` | Método declarado | [113](../src/js/ui/TitleScene.js#L113) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `destroy()` | Método declarado | [187](../src/js/ui/TitleScene.js#L187) | Remove os recursos/listeners previstos na implementação; audite o ciclo de vida. |

## src/js/ui/TitleScreen.js

[Implementação](../src/js/ui/TitleScreen.js). Contratos exportados/reexportados: `TitleScreen`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `constructor({ game, onNew, onLoad })` | Método declarado | [6](../src/js/ui/TitleScreen.js#L6) | Inicializa dependências e estado da instância; consulte a seção do módulo. |
| `refresh()` | Método declarado | [49](../src/js/ui/TitleScreen.js#L49) | Atualiza disponibilidade de Carregar jogo a partir do save efetivo sem mudar a dificuldade escolhida. |
| `setEasy(enabled)` | Método declarado | [58](../src/js/ui/TitleScreen.js#L58) | Configura somente a próxima aventura; carregar mantém a dificuldade do save. |
| `requestNew()` | Método declarado | [65](../src/js/ui/TitleScreen.js#L65) | Abre confirmação se há progresso; cancelar preserva o save. |
| `navigate(event)` | Método declarado | [76](../src/js/ui/TitleScreen.js#L76) | Move foco com setas entre opções habilitadas e impede propagação ao jogo. |
| `activateFocused()` | Método declarado | [91](../src/js/ui/TitleScreen.js#L91) | Aciona o botão focado pelo gamepad sem atravessar os diálogos do menu. |

## src/js/ui/dialogueSafeArea.js

[Implementação](../src/js/ui/dialogueSafeArea.js). Contratos exportados/reexportados: `intersectCanvasSafeArea`, `getDialogueSafeArea`, `getDialogueBoxY`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `intersectCanvasSafeArea(canvas, rect, viewport, insets = {})` | Função | [6](../src/js/ui/dialogueSafeArea.js#L6) | Converte interseção viewport/canvas e insets em coordenadas do bitmap. |
| `getDialogueSafeArea(canvas)` | Função | [29](../src/js/ui/dialogueSafeArea.js#L29) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getDialogueBoxY(safe, height, originalMargin, anchor = {}, mobile = isMobileDevice(),)` | Função | [73](../src/js/ui/dialogueSafeArea.js#L73) | Consulta/calcula valor específico; forma exata definida pela implementação. |

## src/js/ui/firstJumpTutorial.js

[Implementação](../src/js/ui/firstJumpTutorial.js). Contratos exportados/reexportados: `renderDarkRoomTouchHint`, `FIRST_JUMP_MESSAGES`, `getFirstJumpTutorialDevice`, `getFirstJumpFeedback`, `renderFirstJumpTutorial`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `renderDarkRoomTouchHint(ctx, canvas, state)` | Função | [6](../src/js/ui/firstJumpTutorial.js#L6) | Desenha indicação de pulo no rodapé móvel sem restringir a área de entrada nem duplicar o tutorial inicial. |
| `getFirstJumpTutorialDevice({ device, nav = globalThis.navigator, coarse } = {})` | Função | [38](../src/js/ui/firstJumpTutorial.js#L38) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `getFirstJumpFeedback(timeMs, reducedMotion = false)` | Função | [53](../src/js/ui/firstJumpTutorial.js#L53) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `drawInputIcon(ctx, kind, x, y, unit, pulse)` | Função | [62](../src/js/ui/firstJumpTutorial.js#L62) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `renderFirstJumpTutorial(ctx, canvas, { state, player, fairy, platform, cameraX, transform, device, timeMs = globalThis.performance?.now?.() \|\| 0, reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches \|\| false, },)` | Função | [130](../src/js/ui/firstJumpTutorial.js#L130) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |
| `project(x, y)` | Função atribuída | [155](../src/js/ui/firstJumpTutorial.js#L155) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |

## src/js/ui/index.js

[Implementação](../src/js/ui/index.js). Contratos exportados/reexportados: `HudRenderer`, `hudRenderer`, `DialogueRenderer`, `dialogueRenderer`, `renderFirstJumpTutorial`, `getFirstJumpFeedback`, `getFirstJumpTutorialDevice`, `FIRST_JUMP_MESSAGES`.

Sem declarações nomeadas extraídas; módulo de dados/reexportação ou funções descritas no ponto de origem.

## src/js/ui/mobileDialogueRegion.js

[Implementação](../src/js/ui/mobileDialogueRegion.js). Contratos exportados/reexportados: `getMobileDialogueRegions`, `renderMobileDialogueRegion`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `getMobileDialogueRegions(safe, contentHeight, placement = 'bottom')` | Função | [6](../src/js/ui/mobileDialogueRegion.js#L6) | Divide a área segura entre cena e painel de texto. |
| `renderMobileDialogueRegion(ctx, canvas, safe, contentHeight, anchor = {}, placement = 'bottom',)` | Função | [51](../src/js/ui/mobileDialogueRegion.js#L51) | Compõe desenho da área correspondente; consulte parâmetros e referencial no código. |

## src/js/ui/mobileUILayout.js

[Implementação](../src/js/ui/mobileUILayout.js). Contratos exportados/reexportados: `calculateMobileUILayout`, `getMobileUILayout`, `isActionControlHit`, `arenaMobileControlsLayout`, `hitArenaMobileControl`, `arenaDirectionVector`, `attachMobileUILayout`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `clamp(value, min, max)` | Função atribuída | [4](../src/js/ui/mobileUILayout.js#L4) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `calculateMobileUILayout(canvas, safe, scale = 1, mobile = true)` | Função | [7](../src/js/ui/mobileUILayout.js#L7) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `contains(x, y)` | API/lambda de objeto | [40](../src/js/ui/mobileUILayout.js#L40) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `joystickOrigin(x, y)` | API/lambda de objeto | [44](../src/js/ui/mobileUILayout.js#L44) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `getMobileUILayout(canvas)` | Função | [55](../src/js/ui/mobileUILayout.js#L55) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `isActionControlHit(layout, x, y)` | Função | [61](../src/js/ui/mobileUILayout.js#L61) | Consulta/calcula valor específico; forma exata definida pela implementação. |
| `arenaMobileControlsLayout(layout)` | Função | [69](../src/js/ui/mobileUILayout.js#L69) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `hitArenaMobileControl(layout, x, y)` | Função | [133](../src/js/ui/mobileUILayout.js#L133) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `arenaDirectionVector(layout, x, y)` | Função | [158](../src/js/ui/mobileUILayout.js#L158) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `attachMobileUILayout(canvas, host = window)` | Função | [177](../src/js/ui/mobileUILayout.js#L177) | Ponto de implementação nomeado; contrato e efeitos devem ser lidos no módulo vinculado. |
| `update()` | Função atribuída | [178](../src/js/ui/mobileUILayout.js#L178) | Avança o estado do subsistema; não é uma operação somente de desenho. |

## src/js/ui/touchGameControls.js

[Implementação](../src/js/ui/touchGameControls.js). Contratos exportados/reexportados: `mobileGameControls`, `drawMobileGameControls`.

| Método / assinatura | Tipo | Linha | Responsabilidade / ponto de atenção |
| --- | --- | ---: | --- |
| `mobileGameControls(canvas, safe)` | Função | [2](../src/js/ui/touchGameControls.js#L2) | Distribui oito direções em células contíguas de pelo menos56CSS e salto de96CSS. |
| `drawMobileGameControls(ctx, canvas, controls, { dark = false, jumpLabel = 'PULAR' } = {},)` | Função | [58](../src/js/ui/touchGameControls.js#L58) | Desenha D-pad unido, setas diagonais e salto respeitando a área segura. |

Inventário: **236 módulos JavaScript**, **1581 declarações nomeadas**.
