# Refinamento do castelo e baú

Sessão `20261020T153759-9d84c0dee58f`, Codex. Pedido atual: marcar tijolos
e arredondar o baú conforme os originais. Referências e inventário consultados:
`stage3/block-castle-v1.png` e `chest-brinquedos-v1.png`, preservados.

## Alterações

- Castelo: parede central antes extrudada como peça única; agora tijolos laranja
  separados, pilares verdes e cinco cunhas amarelas com folgas e chanfros reais.
  A abertura permanece vazada. Sem linhas de contorno sobrepostas. Mesma largura,
  altura, profundidade e uma chamada; 3344 triângulos, antes 1552.
- Baú: semieixo vertical da tampa 0,43 → 0,63 e inscrição sobre a mesma curva.
  Altura total 1,554, antes 1,354; largura 1,94 e profundidade 0,7695 preservadas.
  Articulação avança localmente 0,18 ao abrir para liberar a parede e retorna
  ao fechar. Continua com quatro chamadas, 1151 triângulos.
- Catálogo/cena estáveis em 62/128 recursos, quatro atlas; sem novas imagens,
  geração externa, alteração de luz, colisão, RNG, saves ou personagens.

## Validação

`test:bear-chase:furniture:models` e `test:bear-chase:furniture` executados via
`journal:qa`, aprovados. Modelos em quatro vistas, volume/apoio, compartilhamento,
trocas estáveis e descarte zero. Jogo real em Chrome com três formatos emulados,
36 combinações finais: tampa dentro do quarto, fora da rota, câmera enquadra,
estado preservado. WebGL recuperado, teclado/toque/áudio/save e percurso controlado
até COMPLETE passaram. Chamadas comparáveis 272; com três brinquedos 282–284.

Build, lint, 66 assets, sintaxe dos dois módulos, mapa de sprites e diff passaram.
Mapa: 420 arquivos, 99 recortes, 29 assinaturas. Primeira execução do QA falhou
antes do navegador: sandbox impediu bind local; repetida com acesso local permitido
passou. Não foi executada nova suíte geral: alteração restrita à apresentação,
coberta pelos dois testes específicos. Sem aparelhos físicos/Safari, benchmark
de FPS ou aprovação humana do resultado. Comparações reais inspecionadas para
castelo e baú; evidências temporárias têm hash/tamanho/caminho arquivados antes
do descarte. Artes de produção preservadas.

Restante de E5 e iluminação continuam nos respectivos escopos anteriores.
Sem commit, push ou custo contratado.
