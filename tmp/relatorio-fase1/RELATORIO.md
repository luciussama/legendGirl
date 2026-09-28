# Relatório de validação — primeira fase

Data: 28/09/2026. Escopo: abertura, plataformas 0–9, diálogo do castelo e liberação do modo fuga. Nenhum código, asset, hitbox ou parâmetro de física foi alterado. As alterações já existentes no projeto foram preservadas.

**Resultado: percurso concluído; estabilidade aprovada nos cenários executados; apresentação visual aprovada com ressalvas. A suíte principal de testes está quebrada e impede uma aprovação técnica integral.**

## Execução do início ao fim

Foi executado um percurso contínuo no Chrome headless, com canvas de 960 × 540, usando o código atual do jogo. A instrumentação foi aplicada somente à cópia do módulo em memória para avançar atualizações e acionar pulos; não foi gravada no código do projeto.

A abertura foi avançada pelo seu relógio real de atualização. Depois, a personagem partiu do início, saltou pelas dez plataformas sem teleporte, queda ou game over, acionou a cena do castelo e concluiu os diálogos pelo avanço automático. Ao final: plataforma 9, posição x=1631/y=192, velocidade horizontal zero, modo fuga ativo e cena encerrada. A etapa jogável até o diálogo consumiu aproximadamente 1.052 atualizações, equivalentes a 17,5 segundos simulados em dt=1, além da abertura e dos diálogos.

Os comandos de pulo foram automatizados a partir de posições viáveis previamente medidas. Portanto, este resultado demonstra um caminho executável completo, mas não mede a facilidade para um jogador humano. O percurso não percorreu os menus nem testou teclado, toque ou gamepad de ponta a ponta.

Evidências: [registro do percurso](percurso.json), [chegada e diálogo](fim-percurso.png), [modo fuga liberado](transicao-confirmada.png).

## Estabilidade dos pulos

- **30/30 saltos isolados aprovados:** dez destinos em dt=0,5, 1 e 1,2, correspondentes aproximadamente a passos de 120, 60 e 50 Hz na normalização do jogo.
- **90/90 pousos aprovados:** esquerda, centro e direita de cada plataforma, nas três variações de dt. Cada pouso foi seguido de oito atualizações de apoio estável, totalizando 720 verificações adicionais.
- Os testes exigiram que os pés coincidissem com a superfície física com tolerância de 0,001 unidade.
- **Percurso contínuo aprovado em dt=1**, com dez pulos e chegada à cena final. As outras duas variações foram verificadas em saltos isolados, com reposicionamento entre tentativas.
- Testes existentes executados separadamente passaram: 5.280 verificações de contato do sprite; pausa/pulo e respawn do castelo; estados de animação da personagem; guia da fada.

Os testes isolados procuram uma posição de partida que funcione. Eles não demonstram que qualquer posição de salto funciona nem quantificam a janela de erro tolerada. Não foram medidos FPS real, travamentos prolongados, latência de entrada ou desempenho em celular.

Evidência detalhada: [saltos e contatos](saltos-contatos.json).

## Assets visuais

**Integridade básica aprovada:** os 67 assets registrados no manifesto foram encontrados. O teste da personagem confirmou 52.406 pixels opacos idênticos à fonte e uso dos recortes oficiais nas poses verificadas. O teste da abertura passou para cronologia, poses, texto responsivo, interrupção e persistência.

As dez plataformas foram renderizadas e inspecionadas em capturas atuais, sem visualização de hitboxes:

| Índice | Objeto | Observação visual |
|---|---|---|
| 0 | Urso | Silhueta reconhecível; topo muito plano em relação à cabeça orgânica. |
| 1 | Livros | Pilha legível e materiais consistentes com os móveis. |
| 2 | Penteadeira | Espelho e objetos detalhados; contato concorre visualmente com os pequenos itens do tampo. |
| 3 | Cômoda pequena | Apoio e geometria de madeira claros. |
| 4 | Blocos ABC | Bom reconhecimento; região superior estreita. |
| 5 | Tambor | Baquetas atravessam visualmente a área dos pés, deixando o apoio menos evidente. |
| 6 | Almofada | Objeto reconhecível; base e pernas ficam pouco visíveis na escuridão. |
| 7 | Cômoda alta | Desenho consistente; tampo e tábuas inclinadas exigem interpretação do apoio. |
| 8 | Caixa de música | Asset legível, mas menina, bailarina e fada podem se sobrepor. |
| 9 | Castelo | Topo estreito e corpo muito escuro; ressalva no enquadramento inicial do diálogo. |

Capturas: arquivos `plataforma-0.png` a `plataforma-9.png` nesta pasta.

## Coerência de imagem e ressalvas

**1. Contraste baixo — prioridade média.** A iluminação sustenta a proposta de quarto escuro e destaca personagem/fada, mas deixa pernas, bases e próximos objetos próximos do preto. Isso reduz a leitura antecipada do caminho. Evidências: [blocos/tambor](plataforma-4.png) e [almofada/cômoda](plataforma-6.png).

**2. Mistura de linguagens visuais — prioridade média.** Móveis e brinquedos apresentam volume e textura ilustrada; a menina usa sprite com aparência pixelada; a fada e alguns enfeites são mais simples e saturados. A paleta aproxima o conjunto, mas a diferença de acabamento permanece perceptível. A abertura também mostra a menina maior e com pintura mais suave. Evidência: [abertura](abertura.png).

**3. Apoio na chegada ao castelo — prioridade média.** No percurso contínuo, a cena começou com a personagem em x=1598,43. Como sua largura física é 38 e o apoio começa em x=1636, a sobreposição horizontal era de apenas cerca de 0,43 unidade. A física aceitou o pouso, mas na captura inicial do diálogo a menina aparece visualmente à esquerda do topo, sugerindo suspensão no ar. Ao terminar a cena ela ficou centralizada em x=1631. É uma ressalva de coerência visual do contato, sem queda observada. Evidência: [primeiro quadro do diálogo](fim-percurso.png).

**4. Sobreposição na caixa de música — prioridade baixa.** A personagem e a bailarina ocupam a mesma área ilustrada; a fada também se aproxima da bailarina. Isso prejudica a separação das silhuetas em alguns quadros. Evidência: [caixa de música](plataforma-8.png).

Não foram observadas réguas técnicas de pouso ou contornos de hitbox nas capturas normais. Os tampos e bases foram avaliados como partes dos objetos. O teste automático `visibleSupport` retornou `checked:false` para as plataformas desta fase; portanto, não equivale a uma aprovação automática de alinhamento da arte. Essa parte da avaliação foi visual.

## Falha na infraestrutura de validação

**Prioridade alta para a confiabilidade dos testes:** `npm test` interrompe no primeiro script, `scripts/verify-dark-room.js`, com `ReferenceError: opening is not defined`. O script extrai a função `doJump`, que agora consulta `opening.active`, mas o contexto isolado do teste não fornece essa dependência.

Isso foi observado no teste, não como falha de pulo no navegador. Como os scripts estão encadeados com `&&`, a falha impede os testes seguintes de rodarem pelo comando principal. Os testes relevantes citados acima foram executados separadamente e passaram. Nenhuma correção foi aplicada. Evidência: [log da suíte](testes.txt).

## Limites e tratamento das evidências

A validação visual foi feita em um viewport desktop. Não houve playtest humano, avaliação auditiva, cobertura de dispositivos móveis ou verificação em outros navegadores. O teste de responsividade da abertura é automatizado, não substitui inspeção visual em telas menores.

A página de inspeção reutiliza o campo de feedback: algumas capturas de plataformas e da abertura exibem uma mensagem residual de “Pulo Evoluído”. Isso é contaminação do cenário de inspeção, não foi classificado como defeito confirmado do fluxo normal. Duas capturas pontuais (`inicio.png` e `transicao.png`) ficaram vazias; uma nova renderização do estado final produziu `transicao-confirmada.png` normalmente. Esses quadros vazios não foram usados como evidência de defeito do jogo.

Foram criados apenas este relatório e suas evidências. Os arquivos de evidência antigos sobrescritos pelos scripts existentes foram restaurados ao estado anterior verificado no início da análise.
