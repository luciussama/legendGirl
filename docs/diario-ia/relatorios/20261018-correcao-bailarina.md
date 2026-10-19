# Correção da regressão do salto da bailarina

Sessão: `20261019T025354-58c4358053af`. Responsável: Codex. Data local: 18/10/2026.

## Causa confirmada

O relato humano foi reproduzido. O balanceamento anterior introduziu uma redução de velocidade aérea de 1,42 para 0,3266 na saída das gavetas rumo à bailarina, perda de aproximadamente 77% do avanço horizontal. A sensação de parede corresponde à frenagem ao decolar. Não foi necessário alterar colisores para reproduzir ou corrigir a falha.

A validação anterior procurava a posição de salto em cada quadro e encontrava saídas extremas. Seus percursos completos aprovados não demonstravam que um salto comum, com os pés apoiados, era jogável. A responsabilidade pela regressão e pela insuficiência dessa validação é desta alteração automatizada; os relatos humanos não foram refutados pelos testes anteriores.

## Correção

`src/js/config.js` restaura toda a aproximação ao castelo às velocidades anteriores: 1,42, com exceções de 1,8 e 1,95 nas saídas dos apoios 4 e 5. Isso também remove frenagens semelhantes introduzidas nos apoios vizinhos. Não se tenta mais impor uma janela estritamente decrescente nesse trecho pela redução de velocidade aérea. A curva do retorno pós-clímax foi preservada; castelo, assistência para o trem, gravidade, impulso vertical e geometria não mudaram nesta correção.

## Evidências de reprodução e correção

- Antes da correção, `test:saltos:bailarina` falhou como esperado: NORMAL, dt 0,5 e x=1408 devolviam a menina ao apoio 7, com velocidade 0,3266. A saída completa da falha foi preservada no diário.
- Antes da correção, o navegador reproduziu nove retornos às gavetas em três posições normais e três apresentações (desktop e duas móveis), com eventos de teclado e sem busca de posição ideal.
- Após a correção, `npm test` passou. O novo teste reproduz a velocidade antiga e confirma 24 saltos corrigidos: quatro posições, NORMAL/EASY e dt 0,5/1/1,2, com os pés apoiados na saída e no destino. Agora integra a suíte padrão.
- O teste da curva continua cobrindo 156 combinações (26 saltos × dois modos × três passos); exige progressão no retorno e ausência de frenagem artificial na aproximação.
- `test:bailarina:browser` passou em nove saltos: desktop com Space e Android emulado em retrato/paisagem com toque nativo CDP. Foram usadas posições x=1408/1412/1416, sem varredura do instante ideal ou ajuste depois da decolagem. Capturas desktop e retrato foram inspecionadas.
- Os seis percursos completos (`test:jogabilidade:browser`) passaram: NORMAL/EASY × desktop/Android/iPhone emulado, incluindo 38 apoios por percurso, exploração, recargas e quatro inimigos. Essa automação consulta estado e escolhe instantes de salto; serve como verificação funcional complementar, não como prova de facilidade humana.
- `npm run build` e `git diff --check` passaram.

Durante a execução, HEAD passou de `a068e6e` para `3c90c66` por ação externa a esta sessão. Nenhum commit foi executado por esta correção; o trabalho existente foi preservado.

O teste focado usa um checkpoint preparado pela fixture e a física real em passos por quadro conduzidos por requestAnimationFrame; não é uma campanha cega nem medição de dificuldade humana. Perfis móveis emulados não certificam aparelhos físicos. As evidências históricas de aprovação anterior permanecem preservadas, com esta correção explícita de sua interpretação.
