# Art-001 — Escala visual da protagonista

Aplicado fator visual **1,08×** à sprite da menina na primeira etapa do quarto, antes do modo fuga e do retorno. A abertura ilustrada na cama, a fuga, o retorno e a sala de brinquedos conservam as escalas anteriores.

O ajuste multiplica apenas as dimensões e os deslocamentos do recorte desenhado por `BabyRenderer`. O centro horizontal e a âncora dos pés continuam no mesmo ponto do mundo. Não altera a resolução dos recortes nem o seletor ou a duração das animações.

Câmera, zoom global, física, hitboxes, colisões, velocidade, saltos, cenário, plataformas e iluminação não foram modificados por este ajuste. As alterações de câmera já presentes no diretório pertencem ao ticket QA-Gameplay-001 anterior.

## Comparação

| Perfil | Antes | Depois |
| --- | --- | --- |
| Desktop | [Captura](desktop-antes.png) | [Captura](desktop-depois.png) |
| Android emulado | [Captura](android-antes.png) | [Captura](android-depois.png) |

As capturas usam a mesma plataforma, pose e enquadramento, com o fator artístico desativado/ativado. Na inspeção visual, o ganho de presença é discreto e a personagem continua pequena diante dos móveis. Os pés mantêm o contato com a penteadeira. A aprovação subjetiva da direção de arte permanece com a equipe.

## Verificação

- 86 combinações de quadro e direção: dimensões ampliadas exatamente em 8%, recortes e âncoras preservados.
- `npm test`: aprovado, incluindo regressões de física, apoios e animações.
- `git diff --check`: aprovado.

Reprodução das capturas: servidor temporário na porta 3001, Chrome dedicado com depuração na porta 9222 e `node scripts/review-protagonist-scale.js`. O teste automatizado usa `node scripts/test-protagonist-scale.js`.
