# Passos fornecidos pelo usuário: recortes para a perseguição

Sessão `20261019T174444-74fe85306ae4`, 19/10/2026, Codex, branch `FEAT-bear-chase`.

Conclusão: os dois MP3s são tecnicamente decodificáveis e possuem transientes repetidos que permitem recortes curtos. Foram preparados seis candidatos por personagem em `assets/audio/bear-chase/passos/`, sem integrar ou implementar a nova fase. A seleção foi feita por energia do sinal; não houve escuta crítica que certifique timbre, superfície, ausência de vozes/música ou adequação artística ao quarto. Essa avaliação continua pendente.

## Fontes e processamento

Arquivos fornecidos: `/Users/sergio/Downloads/footsteps-bear.mp3` e `footsteps-girl.mp3`. Os originais em Downloads não foram alterados. Cópias integrais em `assets/audio/bear-chase/fontes/`, conferidas por SHA-256. Durações decodificadas: 64,152 s (urso) e 36,072 s (menina). Entradas: MP3 estéreo, 24 kHz, 160 kbps. Não foi inferida a origem/licença dos sons a partir dos nomes.

Conversão local pelo `afconvert` do macOS para PCM mono de 16 bits a 24 kHz em `/tmp/legendgirl-footsteps-20261019/`. O conversor falhou no sandbox com `ExtAudioFileSetProperty ('cfmt')`; funcionou com escalonamento autorizado. Não houve instalação de software, envio a serviço externo, IA generativa, consumo de créditos ou compra.

Recortes: urso 285 ms por arquivo, menina 215 ms. Fade de entrada de 3 ms, saída de 12 ms; ganho comum por banco, sem amplificação, limitado a pico de -9 dBFS para deixar margem na mixagem e preservar variação relativa entre amostras. Não se aplicaram mudança de pitch, remoção de ruído ou reverberação artificial. WAV evita nova compressão com perdas após o MP3. Total dos doze recortes: 144.530 bytes; os MP3s de origem ficam separados e não precisam ser pré-carregados pelo jogo.

A automação está em `docs/diario-ia/automacoes/preparar-passos-20261019.py`; intervalos exatos, ganhos, hashes, tamanhos e resultados técnicos estão em `20261019-passos-recortes.json`. As saídas são assets sonoros candidatos à produção, não bitmaps de evidência descartáveis.

## Uso previsto

- Carregar/decodificar os WAVs uma vez, pelo catálogo sonoro da nova fase. Reproduzir um `AudioBufferSourceNode` por contato de pé no chão. Web Audio pode reproduzir arquivos gravados; isso não é síntese procedural de passos.
- Usar eventos do ciclo de caminhada/corrida, com variações alternadas sem repetir imediatamente a mesma amostra. Não executar os MP3s completos em loop nem disparar um passo a cada quadro.
- Cutscene: menina caminhando lentamente enquanto se aproxima do urso caído; usar a cadência dessa caminhada e validar se o timbre dos candidatos combina com movimento lento. Pode ser necessário outro recorte da fonte para caminhada; não desacelerar o áudio inteiro para simular esse gesto. Urso só passa a emitir corrida ao levantar e fugir.
- Perseguição: menina próxima à câmera; ganho e panorama do urso variam suavemente com posição/distância real, tornando os passos mais presentes conforme ela o alcança. Não alterar o pitch de forma extrema para representar peso.
- Encaminhar ambos pelo ganho mestre do jogo. Mudo, volume, pausa, perda de foco, derrota, checkpoint e transições devem impedir passos atrasados/acumulados e limpar fontes ativas. Não modificar os passos atuais da exploração/arena nesta preparação.
- Futuro `ChaseAudio` recebe eventos e dados restritos; não acessa sala, controller ou renderer completos. Documentar cada método em português do Brasil. Validar os recortes junto da animação e música antes de definir ganhos finais.

## Verificações realizadas e limites

1. Duas cópias dos MP3s com hash idêntico ao original: confirmado.
2. Doze WAVs legíveis, mono, 16 bits, 24 kHz, duração não nula e extremidades zeradas: confirmado.
3. Picos dos recortes até -9 dBFS: confirmado por leitura PCM; isso não homologa a mixagem final nem o volume percebido.
4. `npm run check-assets`: aprovado, 66 recursos já registrados. Os novos recortes ainda não estão no manifesto/runtime; esse comando não os certifica.
5. `npm run build`: aprovado. Não houve alteração de código de gameplay, portanto não se executou a suíte de campanha.

Pendente: escuta humana dos candidatos, confirmação da superfície de madeira e ausência de elementos indesejados, escolha de variações, sincronização de caminhada/corrida e teste de mixagem no trecho jogável. A fase 3D ainda não existe no runtime. Não há aprovação artística nem integração sonora declarada.
