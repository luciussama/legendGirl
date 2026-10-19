# Viabilidade de Chase.mp3 como trilha da perseguição

Sessão `20261019T175720-3dfeab17f940`, Codex, 19/10/2026, branch `FEAT-bear-chase`.

O usuário definiu `Chase.mp3` como trilha da fase da perseguição. A avaliação conclui viabilidade técnica para sua integração futura, condicionada ao tratamento da repetição e à validação auditiva da mixagem. Não houve escuta crítica, reprodução no navegador ou implementação da fase nesta sessão. Não se atribuem instrumentos, gênero, BPM, presença/ausência de voz ou qualidade estética apenas a partir das métricas.

## Arquivo e medições locais

Original: `/Users/sergio/Downloads/Chase.mp3`, preservado sem edição. Cópia de produção futura em `assets/audio/bear-chase/Chase.mp3`, sem recodificação. SHA-256: `eb6be304111aa279bce1c0b48cd4a6c0d199ddc96d15f6342d04e8246ff455a5`.

| Propriedade | Resultado |
| --- | --- |
| Tamanho | 3.012.648 bytes, aproximadamente 3 MB |
| Formato | MP3, 256 kbps, estéreo, 44.100 Hz |
| Duração PCM válida | 94,08 segundos (1min34s) |
| Duração estimada no contêiner | 94,119 s; inclui diferença de enquadramento/priming do MP3 |
| Pico amostral decodificado | -5,04 dBFS |
| RMS global | -18,40 dBFS |
| Fator de crista | 13,36 dB |
| Amostras no limite PCM de 16 bits | 0 |
| Amostras acima de -1 dBFS | 0 |
| Estimativa de buffer PCM Float32 estéreo | 31,65 MiB, sem overhead ou cópias |

Medições por decodificação local com `afconvert` e biblioteca padrão Python. Fontes da automação em `docs/diario-ia/automacoes/analisar-chase-20261019.py`; resultados completos em `20261019-chase-metricas.json`. RMS e pico amostral não equivalem a LUFS ou true peak; a ausência de saturação observada não demonstra ausência de distorção já incorporada à gravação. Não houve envio a serviços, consumo de créditos, compra ou IA generativa.

## Duração e repetição

O plano sugere provisoriamente 6–8 minutos de corrida, ainda dependente da medição da maior fase atual. Uma execução de 94,08 s não cobre esse intervalo: seriam aproximadamente quatro a seis reproduções iniciadas, dependendo de onde for feita a emenda. Não encurtar a fase para caber na música.

O sinal ultrapassa -60 dBFS já em 0,00014 s, portanto não há silêncio técnico inicial relevante. O final apresenta energia menor (RMS aproximado de -32,39 dBFS no penúltimo segundo e -35,88 dBFS na última janela parcial), mas ainda contém sinal. Isso não identifica a estrutura musical nem valida uma volta do final ao começo. Não prometer loop imperceptível com `audio.loop = true` nem escolher pontos de compasso por RMS.

Plano de edição: ouvir a faixa, localizar entrada e saída compatíveis em frase/compasso e marcar `loopStart`/`loopEnd`. Preservar o ataque inicial quando adequado, repetir uma seção central e preparar saída suave no alcance do urso. Crossfade é recurso de edição a testar, não garantia de continuidade harmônica ou rítmica. Não usar sobreposição longa sem avaliar batidas duplicadas, fase e aumento de volume. Manter o MP3 original intacto e qualquer versão derivada separada, com intervalos/metadados no diário. Nenhum corte ou loop musical foi produzido nesta avaliação.

## Entrada, saída e coexistência com efeitos

- A trilha foi escolhida para a perseguição. Proposta de entrada: quando o urso se levanta e arranca, durante a entrega da cutscene à corrida. Não presumir que deve começar quando ele ainda está caído; isso depende da encenação sonora da cutscene.
- Fazer transição controlada a partir da música de combate, interrompendo o reforço procedural da arena. `ArenaAudioProfile.leave` atualmente retoma a música da sala; a integração futura deve evitar que ela toque por cima de `Chase.mp3` ou retorne por um instante entre arena e perseguição.
- Ao alcançar o urso, reduzir/encerrar a trilha para a ida ao baú, sem interromper a perseguição antes do alcance. Entrada e saída respondem a eventos narrativos, não à duração fixa do MP3.
- Preservar voz/som dos brinquedos e os passos já recortados. Ganho inicial sugerido para ensaio: música em 0,35 (cerca de -9,1 dB de atenuação), passos ajustados separadamente; isso é proposta, não mixagem aprovada. O pico amostral calculado da música nessa condição fica perto de 0,196 em amplitude, deixando margem para efeitos. Ainda assim, testar somas reais de passos e impactos: o ganho mestre sozinho não evita saturação.
- Respeitar volume/mudo do jogador, pausa, blur e retomada. Não reiniciar música a cada passo, setor ou oscilação de FPS; retomar posição coerente no checkpoint/save, sem agendar efeitos antigos ao voltar.

## Integração proposta e impacto de memória

`src/js/audio.js` já reproduz MP3s por elemento `Audio`, com trilhas `theme` e `sword`; `setToyRoomMusicTrack` valida apenas esses identificadores. Logo, copiar o arquivo não o integra. Encapsular a trilha no serviço `ChaseAudio` previsto, com portas explícitas de reprodução, volume, pausa e descarte. Se for estender o sistema comum, usar catálogo e contrato específico em vez de espalhar testes de nome de arquivo pela fase. Documentar métodos em português do Brasil, conforme pedido vigente.

Um elemento de mídia permite evitar um buffer PCM integral explícito, mas latência, emenda e consumo real devem ser medidos. Para repetição precisa por `AudioBuffer`, reservar aproximadamente 31,65 MiB apenas para o PCM da faixa, além de buffers e recursos 3D; não manter cópias desnecessárias. Duas fontes simultâneas podem compartilhar o mesmo buffer. Escolher a estratégia na prova técnica conforme emenda musical e desempenho móvel, sem migrar todas as músicas do jogo nesta tarefa.

Carregar a trilha na preparação da nova fase, com tratamento de erro e sem bloquear as fases anteriores. Usar URL relativa compatível com Pages. Em falta de áudio, preservar progresso e controles. Validar MP3 no navegador e em aparelhos-alvo, desbloqueio de áudio, transições, pausa/mudo, repetição, save/retry, memória e saída sem sobreposição com sala/arena.

## Resultado e pendências

Cópia integral preservada e decodificação completa realizada. Métricas registradas e plano/contexto atualizados com a escolha explícita do usuário. Cópia verificada por hash. Sem modificação de runtime, manifestos, trilhas anteriores ou gameplay; sem commit/push. A origem/licença não foi inferida pelo nome do arquivo.

Pendente: escuta para marcar uma repetição musical natural, mixagem real com passos/obstáculos, ajuste de entrada/saída na cutscene e no baú, integração pelo serviço desacoplado e validação no navegador/dispositivos. Viabilidade técnica não equivale a aprovação de uma emenda ainda não criada.
