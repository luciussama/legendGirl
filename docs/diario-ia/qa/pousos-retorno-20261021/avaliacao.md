# Avaliação dos pousos no retorno pós-porta falsa

Sessão: `20261021T120420-415564249772`. Pedido atual: avaliar saltos que parecem pousar corretamente e falham. Nenhuma alteração de produção nesta avaliação. Preservado o trabalho anterior em game.js e documentação.

## Constatação

Reproduzida incoerência entre o contato visual e a aceitação de pouso no NORMAL. A colisão exige centro X dos pés estritamente entre `platX + 4` e `platX + platW - 4`. A arte é ancorada nesse centro, mas os sapatos ocupam uma faixa horizontal maior; a imagem pode mostrar contato enquanto o ponto exigido ainda está excluído. O resolvedor aceita profundidade de até 16 px abaixo do topo. Ao avançar para a esquerda após a rejeição, o centro pode entrar na área aceita apenas depois de exceder essa profundidade, resultando em queda definitiva.

Não foi detectado salto vertical completo da faixa de 16 px nos passos de tempo exercitados. O problema observado não depende disso: a regra horizontal e sua combinação com a faixa vertical bastam para reproduzi-lo. Gravidade e alcances não são a causa demonstrada por esta avaliação. A câmera e as artes não foram alteradas.

## Reprodução mensurável

`journal:qa -- test:pousos:retorno:diagnostico` executa trechos reais de impulso, movimento e seleção de pouso, preparando saídas válidas sobre o apoio anterior. Extrai a faixa inferior de cinco linhas de pixels opacos dos frames de queda, na escala real de 44 px e com espelhamento para a esquerda, como no retorno. Essa medida representa o intervalo visual dos sapatos, não uma nova hitbox proposta.

9.657 tentativas, 16 destinos e dt 0,5/1/1,2: 800 trajetórias terminam sem pousar no destino apesar de pelo menos 2 px de sobreposição da faixa visual dos sapatos na primeira passagem descendente pelo topo; em 40 delas o próprio centro já está dentro da largura completa da plataforma. Há exemplos nas 48 combinações destino/dt; todos os destinos também têm saídas que funcionam. Esses números são uma varredura de posições, não taxa de falha de jogadores. Fonte final: `efa4320b65e2816d277db4db85e3aa2a021752ed9bdbead7de8f0570679ff0cf`.

Exemplo determinístico a dt=1: primeira pilha de blocos do retorno ocupa X=4040..4170. Salto do chão com centro inicial X=4217,5. Na descida, centro X=4168,7128 e pés 1,6 px abaixo do topo; o centro está 1,2872 px para dentro do apoio, e a faixa dos sapatos sobrepõe cerca de 15,72 px. O resolvedor rejeita porque exige X<4166. A trajetória termina sem pouso nessa plataforma. Há caso equivalente na boneca de pano: centro X=3966,225 dentro do apoio 3848..3968, pés 5 px abaixo, mas exige X<3964.

## Lacuna dos testes anteriores

`test:saltos:progressao` passa novamente com o código atual. A suíte prova existência de saídas alcançáveis e progressão das janelas; não prova que todo contato visual correto é aceito. Não reclassificar essa aprovação como ausência da falha relatada.

A primeira versão deste diagnóstico não espelhava as medidas dos sapatos. Essa fixture foi corrigida e reexecutada; fonte e saída intermediárias permanecem preservadas e não fundamentam os números finais. Não houve nova inspeção de navegador, filmagem da partida do usuário, aparelho físico ou playtest humano nesta avaliação.

## Correção recomendada

Rever o pouso do retorno para considerar uma faixa de apoio dos pés coerente com a arte, em vez de exigir um ponto 4 px para dentro. Tratar o cruzamento descendente do topo entre quadros, evitando que contato correto seja perdido entre a rejeição horizontal e o limite de profundidade. Manter rejeição de aproximações por baixo/lateral, contato no ar fora do apoio e saltos ascendentes; conservar geometria, câmera, arte, gravidade, impulso e alcance. Não basta aumentar indiscriminadamente a profundidade: isso pode aceitar entrada pela lateral depois de a menina já ter passado abaixo do topo.

A nova regressão de correção deve usar os casos concretos rejeitados, exigir aceitação de contatos válidos e rejeição dos casos negativos. O diagnóstico atual comprova a falha; não é uma regressão que já comprove uma solução.
