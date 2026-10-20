# Aplicação da direção pictórica aprovada

Sessão `20261020T144330-e2641eed729f`, Codex, 20/10/2026.
O usuário aprovou a amostra do armário (“Nossa, ficou muito melhor!!!!”) e pediu
propagação. Implementação nos quatro props volumétricos atuais da perseguição;
o restante da conversão E5/E6 não foi antecipado nesta tarefa de texturização.

## Arte entregue e aplicação

Quatro chamadas independentes à ferramenta integrada image_gen, referenciando o
painel direito aprovado e os sprites correspondentes. Sem CLI ou API paga separada.
Atlas e prompts integrais em `assets/art/toy-room/bear-chase/materials/`; manifesto
identifica bytes, dimensões e SHA-256. São artes consumidas pelo jogo, não imagens
regeneráveis de QA: conservar os quatro PNGs. As fontes anteriores permanecem
intactas. Cada atlas tem 1254×1254 pixels e quatro quadrantes:

- Armário: painel com nós e veios horizontais, montante vertical, tampo, latão.
- Trem: azul, vermelho tijolo, verde oliva e madeira mel das rodas.
- Blocos: vermelho, amarelo ouro, verde e azul, com desgaste pintado.
- Coelho: pelúcia rosa pêssego, creme, interior rosa antigo e linha castanha.

A geração dos mapas não encerrou a tarefa: eles foram carregados e aplicados às
malhas. `PictorialMaterialAssets` centraliza URLs; `ChasePropResources` registra
uma textura por objeto e materiais por região/tinta. `bake` remapeia UVs com oito
pixels de margem interna para reduzir vazamento de cor. As peças à esquerda têm
espelhamento determinístico de U para evitar portas idênticas. Caldeira usa veio
axial; telhado dos blocos normaliza UVs antes de entrar no atlas. Armário recebeu
material específico de tampo/montante/latão, em vez do mesmo recorte em todo lugar.
Olhos e nariz pequenos do coelho conservam materiais de detalhe. Texturas foscas
sem mapa de normal; geometria, formas, pivôs, física e luz da cena preservados.

A amostra aprovada é direção artística, não uma textura automaticamente extraível
sem retificação: a solução utiliza mapas novos, não a prancha colada no modelo.
O material aplicado conserva pequenas repetições entre peças; a madeira do trem e
blocos apresenta desgaste deliberado visível. O resultado executável ainda admite
ajustes humanos, e não tem aprovação individual de todos os novos mapas.

## Verificação real

- Capturas reais de frente, lateral, três quartos e costas, fonte/modelo sob luz
  neutra e no quarto. Inspecionados os quatro objetos em três quartos e a fase.
- `test:bear-chase:catalog:models`: passou, 60 trocas sem crescimento, lançamento,
  viewports, volumes, apoio e descarte idempotente. Pico dos proprietários na prova:
  [46,127,121] (catálogo neutro, cena de referência, cena modelo), sem confundir
  três contextos separados com uma única cena.
- `npm run journal:qa -- test:bear-chase:pictorial`: passou em workspace temporário,
  servidor restrito a 127.0.0.1 e Chrome isolado. Verifica uso real de quatro atlas,
  uma textura por objeto, UVs contidas nos quadrantes, compartilhamento, reuso de
  ID, 80 trocas, posição lateral dos móveis, snapshot/estado, perda/restauração
  WebGL, teclado/toque, áudio/mudo, save da campanha, percurso até COMPLETE e
  descarte zero. Integridade das fontes, domínio/config/personagem preservada.
- Materiais texturizados por objeto: trem 6, blocos 4, coelho 4, armário 5.
  Bordados/olhos/nariz não exigem cópia de atlas.
- Cena própria estável: 121 recursos; catálogo 46, abaixo do limite de 300.
  Antes desta aplicação: cena 117 e catálogo 42. Memória não é proporcional apenas
  ao número de objetos GPU: os mapas novos são maiores e foram contabilizados.
- Atlases RGBA8 + mipmaps: estimativa de 33.536.288 bytes, aproximadamente 32 MiB;
  orçamento específico do QA menor que 36 MiB. Não inclui toda VRAM da cena,
  cópias CPU ou overhead do driver; não é benchmark de hardware.
- Cenário comparável com um bloco: 298 chamadas (anterior 294, baseline antiga
  310). Com três brinquedos: 310/304/310 em 1280×800, 390×844 e 844×390; 14
  texturas e 56 geometrias após os cenários executados. O tampo separado acrescenta
  uma chamada por armário visível.
- `npm test`: passou, incluindo suíte geral, defesa, progressão, bailarina e
  perseguição. `check-assets` (66 recursos globais), build, lint e sintaxe dos
  módulos passaram; inventário reconstruído (420 arquivos, 99 recortes e 29
  assinaturas). `git diff --check` sem erros.

## Escopo e limites

Padrão aprovado registrado para os próximos props. Esta entrega aplica o material
nos quatro modelos 3D já existentes. Estante/castelo ainda planos com suporte,
baú e demais props a converter continuam em E5/E6. Não trocar a menina, urso ou
sprites das fases 2D incidentalmente. Nenhuma alteração de luz da cena foi feita;
a melhoria de iluminação segue adiada. Não houve teste físico/Safari, commit,
push ou publicação. Capturas temporárias identificadas por hash/bytes no log e
no JSON de evidências; só os bitmaps regeneráveis de QA foram descartados.
