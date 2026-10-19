# Revisão crítica da menina 3D e da perseguição

Sessão `20261019T183600-b0d9f912ce21`. O usuário REPROVOU o modelo da menina,
apontando vestido fora da paleta, pele e detalhes diferentes e distância física da
referência. A reprovação substitui a pendência de aprovação da sessão anterior;
seus registros e resultados técnicos permanecem intactos.

## Método e limites reais

Abri `http://localhost:3000/?debug=1` em uma nova aba do Chrome e iniciei a
Perseguição 3D pelo seletor de fases da interface. Observei urso caído, aproximação,
levantar e corrida. Enviei entradas nativas A/D e setas, sem alterar estado, HP,
velocidade ou avançar a simulação manualmente. Entradas discretas não equivalem
a segurar uma tecla: não comprovam controle contínuo nem sucesso nas esquivas.
As observações de tela registraram 15%/27,4 m, 21%/26,6 m, 44%/24,0 m e
56%/23,2 m. Em 56% apareceu “Cuidado com os brinquedos!”, confirmando reação de
colisão visível. Não medir desempenho ou dificuldade humana com essas entradas.

A apresentação ficou estacionada em 56%. Tentativas de clique devolveram
`noWindowsAvailable`; reconexão, teclado, ação Raise e observação posterior não
retomaram a progressão. A fase pausa em blur por implementação, mas não foi
possível provar se essa foi a causa exclusiva da interrupção. NÃO concluí esta
partida até o baú. A conclusão automatizada da sessão anterior não conta como
nova partida jogada nesta revisão. Não certifico o trecho final nem o áudio por
escuta. Capturas da ferramenta foram observações transitórias, sem arquivos de
imagem gravados no repositório ou evidências bitmap para conservar.

Comparei as telas com as imagens atuais `dark-room/sprites/official-character.png`,
`toy-room/battle/girl/runtime/idle-01.png` e `animation-v2/run-sheet.png`.
Li o inventário/guia, identidade histórica `character-reference-atlas/character-identity.md`
(fonte f723e5bc15882f41b5551c0c3b2b8c587dd94414c31447cbc7c320b38f977b25),
relatório anterior, materiais, animação, renderer e simulação atuais. O documento
histórico descreve dois tufos laterais; os quadros de arena exibem um rabo alto.
Essa diferença de famílias precisa ser explicitada no quadro de referência;
não inventar vistas traseiras como se já fossem artes aprovadas.

## Parecer sobre a menina: reprovada artisticamente

O volume existe e a integração funciona, mas isso não atende ao requisito de
identidade. A avaliação anterior confundiu uma prova estrutural com fidelidade
suficiente para apresentar a personagem. A correção exige nova direção de arte,
mais do que trocar o valor hexadecimal de um material.

| Prioridade | Desvio observado / confirmado | Correção proposta e critério de avaliação |
| --- | --- | --- |
| P0 | Vestido quase todo creme/amarelado; rosa reduzido a aro, faixa e laços. A referência tem distribuição substancial de rosa/salmão, corpete/áreas claras, camadas e sombras da roupa. | Separar tecidos e regiões conforme o sprite, extrair amostras de áreas identificadas e reconstruir a distribuição das cores. Comparar lado a lado com referência em luz neutra e depois no quarto. |
| P0 | Pele e detalhes foram escolhidos por aproximação: skin `#f4c9a3`, cream `#f5dfae`, pink `#d68e91` no código, sem tabela de amostragem por região. | Fixar paleta por material a partir das fontes atuais, distinguindo cor base, sombra pintada e reflexo. Não converter um pixel de sombra em cor base nem declarar um único pixel como paleta oficial. |
| P0 | Modelo genérico de boneca: rosto, tronco, mangas, pernas e botas feitos majoritariamente de elipsoides; saia em sino uniforme. Silhueta e idade percebida afastam-se do desenho. | Medir proporções do sprite, redesenhar cabeça/bochechas, franja, tronco curto, mãos e calçados; construir roupa com camadas e volume específico. Conferir silhueta antes dos detalhes. |
| P0 | Sombreamento liso e iluminação diferente do acabamento pintado. Na corrida, roupa clara perde separação do piso/parede quentes. | Prototipar acabamento ilustrado com contraste e sombras controlados; testar luz neutra versus as luzes quentes atuais. Copiar RGB sozinho não garante a mesma aparência após iluminação. |
| P1 | Franja formada por blocos arredondados e rabo com aparência de massas ovais. A cor próxima não recupera o desenho das mechas. | Modelar contorno e direções das mechas, posição da amarração e forma do laço. Não acrescentar acessórios traseiros sem identificar a referência ou assumir explicitamente sua interpretação. |
| P1 | Leitura de corrida com pouca ancoragem: pés parecem leves/flutuantes, corpo rígido e saia/cabelo com oscilação regular. | Criar poses de apoio, compressão, impulso e voo; ajustar planta do pé e transferência de peso. Sombra de contato suave pode ajudar, mas não substitui apoio correto. Comparar poses com o ciclo atual e depois avaliar em velocidade normal. |
| P1 | Desvio não comunica intenção corporal suficiente. O yaw atual depende da posição X, não da velocidade lateral: ficar numa lateral mantém orientação mesmo sem desviar. | Inclinação e orientação devem responder ao movimento lateral, com retorno ao eixo; manter apresentação separada da física. |

Não há nesta revisão uma nova paleta numérica aprovada nem uma arte substituta.
A peça clara do sprite não autoriza interpretar o vestido inteiro como creme.
A cor do cabelo é o aspecto mais próximo, mas sua forma também requer revisão.

## Leitura crítica da fase observada

| Problema | Efeito na experiência | Melhoria proposta |
| --- | --- | --- |
| Trem aparece dentro de um retângulo preto, claramente visível em 44% e 56%. | Parece uma imagem colada, prejudica a profundidade e a leitura da área ocupada. | Corrigir transparência/recorte e depois dar volume ou vistas coerentes aos brinquedos; validar contato visual sem mudar a hitbox nesta revisão. |
| Menina volumétrica ao lado de urso e fada planos; urso visto de frente enquanto foge. | A cena mistura linguagens e enfraquece a direção da perseguição. | Planejar modelos/vistas coerentes para todos, após fixar a identidade da menina. Não usar rotação de sprite frontal como substituto de vista traseira. |
| Fada aparece à frente/acima, distante da cabeça na projeção. | Parece guia adiantada, em vez de companheira seguindo atrás. | Rever posição de acompanhamento e oclusão. O código coloca Z negativo, do lado do avanço, enquanto a câmera fica em Z positivo. Alternar lados e passar atrás da cabeça com folga visual. |
| Mesmas janelas, estantes, castelos e tapetes se repetem simetricamente. | A sala é reconhecível, mas a corrida vira corredor infinito com poucas lembranças de percurso. | Criar trechos com composições distintas dentro do mesmo quarto estendido: área de blocos, estantes, mesa e corredor de brinquedos, com retomadas visuais e respiros. Conservar papel, madeira e materiais atuais. |
| Urso pequeno durante grande parte do trecho observado; HUD numérico comunica mais a aproximação do que a encenação. | Relação perseguidora/alvo perde força. | Estudar câmera e escala aparente, olhar para trás e antecipação de lançamento; deixar clara a aproximação progressiva sem alterar arbitrariamente distâncias de colisão. |
| Faixa central cobre a encenação da cutscene. O levantar é troca de quadros, sem uma ação corporal completa. | Texto descreve o acontecimento em vez de a atuação contar a cena. | Enquadrar caído → aproximação cautelosa → levantar → arrancada; mover texto para região que não encubra a ação. |
| Móveis ilustrados em planos sobre caixas marrons exibem laterais sem acabamento. | Evidencia a montagem técnica nas bordas da câmera. | Compatibilizar volume, largura e textura das faces; preservar o desenho natural dos objetos. |

A direção de sala fechada e os materiais reconhecíveis são a base que vale manter.
Aumentar apenas a metragem ampliaria a repetição atual. A fase longa precisa de
progressão de composição e ritmo antes da expansão de duração.

## Questões confirmadas apenas no código

A distância do urso é principalmente função do progresso; colisões causam tropeço
curto e acrescentam temporariamente distância. Não existe derrota ou perda de
alcance persistente por acúmulo de erros. Isso é uma escolha de acessibilidade
possível, porém a intenção precisa ser definida: perseguição narrativa tolerante
ou desafio de desempenho. Não mudar dificuldade como efeito colateral da arte.

A etapa final de aproximação concentra-se depois de 88% do percurso. Esse trecho
não foi jogado nesta sessão; precisa de avaliação posterior para julgar se parece
conquista ou aproximação automática abrupta. Não dar nota de dificuldade.

## Ordem de execução recomendada

1. Fixar quadro comparativo das referências atuais e paleta por região, incluindo
   o desenho da roupa. Distinguir o que a fonte mostra do que será interpretado em 3D.
2. Refazer a silhueta em pose neutra; comparar lateral e três quartos com os sprites.
   Frente/costas são novas interpretações e devem ser apresentadas como tais.
3. Produzir uma nova versão da menina com acabamento ilustrado e comparação em luz
   neutra e no quarto. Avaliar em tamanho de gameplay, não somente num close bonito.
4. Ajustar passada e desvio com apoio visível e reação natural do cabelo/saia.
5. Corrigir recortes pretos, acompanhamento da fada, atuação/câmera e composição dos
   trechos. Só então expandir o percurso e avaliar o final completo em nova partida.

Critérios: mesma identidade reconhecível sem depender da cor do cabelo; distribuição
de rosa/creme e pele coerentes; proporções preservadas; nenhuma caixa preta; passos
visualmente apoiados; urso claramente fugindo; fada seguindo; sala variada dentro
da mesma estética. Aprovação humana visual permanece necessária para a nova versão.

Nenhum código de produção, modelo, áudio, sprite ou parâmetro foi alterado nesta
sessão. Não executei npm test/build porque o trabalho foi observacional/documental;
os resultados anteriores não foram reciclados como testes atuais. Não houve serviço
pago, commit ou push. Pendente: novo modelo e retomada de playtest até o final após
recuperar controle estável da sessão visual.
