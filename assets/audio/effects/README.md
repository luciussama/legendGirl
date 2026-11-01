# Pulos, lama e asas

Áudios fornecidos pelo usuário em 31/10/2026. Os originais de asas estão em `source/`: `wings-bugs.wav`, `wings-bugs2.wav` e `wings-bee.wav`. Não são baixados pelo runtime. Hashes e processamento completos ficam em `preparacao.json`.

Todas as abelhas do jardim e do sonho usam `wings-bee-v2.wav`, derivado exclusivamente do novo `source/wings-bee.wav`. Isso inclui voo parado, deslocamento e rasantes: os canais `bee` e `dive` apontam para a mesma fonte preparada, com a intensidade e a taxa de voo próprias de cada situação. O loop mono de22.050Hz dura aproximadamente1,939s, com emenda de120ms, ganho limitado/compressão suave e pico PCM0,55.

Os besouros dos dois cenários continuam usando `wings-insects-v2.wav`, derivado de `source/wings-bugs2.wav`, com duração aproximada de3,966s e o mesmo tratamento de emenda/margem. Os antigos `wings-bee.wav`, `wings-dive.wav` e `wings-beetle.wav` permanecem como referências fora das URLs de runtime. Não são acrescentadas asas a insetos andando.

`jump-girl.wav` acompanha todos os saltos aceitos, com ganho0,325antes do mestre (metade dos0,65iniciais), inclusive na atualização de vozes ativas. A lama usa `mud-impact.wav` no contato/respingo,0,68s após iniciar a entrada; o original `jump-mud.wav` é preservado. O derivado remove180ms de silêncio inicial e conserva2,47s de respingo/cauda com fades.

Reconstrução em macOS: `python3 scripts/prepare-game-sounds.py` (Python padrão e afconvert). Os derivados prontos executam em outras plataformas. `GameSoundEffects` compartilha buffers por AudioContext; até três emissores próximos têm panorâmica e atenuação pela distância. Pausa, mudo, saída e descarte encerram as fontes. Validação técnica não substitui audição humana para aprovação do timbre.


Revisão de volume: GardenAudio multiplica o ganho de `bee`/`dive` por2 no jardim e sonho, antes do volume mestre e também nas atualizações das vozes. Fontes e derivados WAV permanecem iguais; `beetle`, pulo0,325 e lama0,8 conservam seus níveis. Mudo, pausa e distância continuam aplicados.
