# E0/E1 — pilotos de trem e armário baixo

Sessão `20261020T125052-b1f7385f4f33`, Codex, 20/10/2026.
Usuário autorizou a sequência proposta e solicitou acompanhar cada mudança.
Entregues dois pilotos para revisão E2, não a conversão integral da perseguição.

## Referências e integridade

Inventário/guia, consumidores e fontes lidos antes da modelagem. A baseline
`qa/perseguicao-20261020/baseline.json` fixa bytes e SHA-256 das duas imagens e dos
módulos existentes de simulação/configuração/renderização/trem. QA confirmou que
esses arquivos não foram alterados.

- Trem: `environment-sheet.png`, 1168×786, recorte 689/76/116/88,
  SHA-256 `235f177d278dc1d399a714224aaa62d03bd9be96c2be70f78a3f994b389adaed`.
- Armário: `stage3/oak-cabinet-v1.png`, 354×208,
  SHA-256 `870179a5c3fe465ca0ce4f419da7ec8a0247889e087c810d4201deddf23e0a1d`.
- Carvalho: amostra interna 55/78/60/52, ampliada em memória para 128×128.
  Variante de luminância para madeira pintada; nenhum PNG original sobrescrito.
- O painel conserva a prancha original no estudo neutro. Na referência do quarto,
  remove apenas fundo externo escuro conectado às bordas; não usa máscara global
  por cor que apagaria detalhes internos.

## Construção e progresso mostrado

1. Trem: caldeira cilíndrica azul, cabine vermelha vazada/teto azul, chaminé,
   caçamba verde, engate, eixos, rodas de madeira com aros, grade frontal. Primeiro
   painel capturado, inspecionado e apresentado durante a execução.
2. Armário: duas portas rebaixadas com molduras/biséis, laterais e fundo completos,
   tampo, pés, dobradiças e puxadores em aro. Não criado outro móvel por `wardrobe`.
3. Inspeção detectou UVs esticadas e escurecimento excessivo da madeira. Corrigidos
   UVs por face e multiplicação de cor; reenquadramento do estudo do armário.
4. Usuário questionou a posição central do móvel na comparação. A posição usada
   para leitura diagnóstica foi um erro de apresentação. Corrigida para parede
   direita: X=4,95, rotação Y=-π/2, frente voltada ao interior. Limites medidos
   X=4,423500..5,355000, Y mínimo aproximadamente zero. A parede fica em X=5,5.
   Referência ilustrada reposicionada junto do modelo. A rota central fica livre.

Código nativo de malhas, sem dependência nova, geração paga ou exportação GLB
necessária. Fábricas não recebem fase, colisões, eventos ou RNG. Recursos ficam
no proprietário da prova; instâncias compartilham geometrias e materiais. A
remoção de uma instância não descarta recursos das demais. Cada método tem
comentário em português do Brasil. Não foi antecipado o catálogo completo de E3.

## Resultados reais

| Verificação | Resultado |
| --- | --- |
| `npm run test:bear-chase:browser` (baseline temporária) | Passou: desktop 1280×800, retrato 390×844 e paisagem 844×390; 308–310 chamadas, pico 285 recursos; inputs, pause/save, áudio, percurso controlado e descarte. |
| `npm run journal:qa -- test:bear-chase:props` | Passou no workspace temporário, servidor restrito a 127.0.0.1 e Chrome isolado. |
| Trem | Bounds 0,52272×0,63324×1,25640; apoio Y≈0; 4648 triângulos, 6 chamadas por instância, sem cartões ou materiais transparentes. |
| Armário | Bounds 2,12000×1,19750×0,93150; apoio Y≈0; 3172 triângulos, 4 chamadas por instância, sem cartões ou materiais transparentes. |
| Recursos | 21 comuns aos dois pilotos; após 60 trocas, contagens constantes [21,281,277] (pilotos, cena da referência, cena do modelo). Três proprietários separados; não somar como orçamento de uma cena de produção. |
| Compartilhamento/estado | Mesmas geometrias/materiais entre instâncias; estado da comparação preservado pelas trocas; integridade das fontes e contratos confirmada. |
| Navegador do painel | Quatro vistas por objeto, lançamento de 0,65 s com altura medida >1, viewports sem overflow, sem exceções ou recursos HTTP ausentes; descarte idempotente termina [0,0,0]. |
| `npm run test:bear-chase` | Passou: 8 percursos NORMAL/EASY com diferentes dt; sequência, RNG/save, colisão varrida, rotas e limite de objetos. |
| `npm run check-assets`, `npm run build`, `npm run lint` | Passaram; 66 recursos globais. Verificação sintática individual dos três módulos novos também passou. |
| `npm run docs:sprites` | Passou: 416 arquivos, 99 recortes, 29 assinaturas; nenhum derivado alterado porque não houve substituição de imagem. |

A primeira captura direta do painel foi exploratória. As verificações finais
foram arquivadas antes de executar e repetidas em workspace temporário pelo diário.
A execução ampla de `npm run dev` foi rejeitada pela revisão automática por escutar
em 0.0.0.0 e poder expor o repositório à rede. Alternativa aceita: servidor estático
local em 127.0.0.1:3000. O driver de QA próprio também abre só loopback, sem alterar
`server.js` nem executar o servidor amplo novamente após a rejeição.

## Limites e próxima etapa

Os pilotos são consumidos apenas pelo painel de QA; `ChaseRenderer3D`, simulação,
menina, fada, urso, saves, física e cena jogável permanecem intactos. O armário não
é um obstáculo. GLB é opcional e não foi gerado. Esta prova usa construção local,
portanto não foi necessário criar novos derivados de produção em assets/models.

A madeira do trem ainda parece mais lisa que a fonte e a modelagem da cabine/rodas
é uma interpretação simplificada. O veio do armário repete uma amostra pequena;
a distribuição de nós e o acabamento pintado ainda podem melhorar. Fundos e faces
ocultas não têm referência artística completa. A apresentação neutra permite
comparar proporção/paleta, mas não representa vistas ortográficas originais.

A validação técnica não homologa estética. E2 deve colher a avaliação dos pilotos
antes de integrar o trem e produzir os demais modelos. Integração de E3/E4 deve
medir novamente o orçamento: 21 recursos novos sobrepostos ao pico anterior de
285 ultrapassariam 300 se tudo fosse apenas adicionado. Substituir/compartilhar os
recursos antigos precisa ser medido, sem elevar o limite silenciosamente.

Não executados: suíte global `npm test` (sem alteração de gameplay/personagem),
Safari, aparelho físico, benchmark do futuro catálogo integrado ou revisão humana
de todas as vistas. Sem serviço pago, cobrança, commit ou push.

Capturas regeneráveis identificadas por caminho, SHA-256 e bytes no log final de
`test:bear-chase:props`. Bitmaps temporários são descartados depois da inspeção;
não são artes consumidas pelo jogo. Fontes de QA, baseline e este relatório ficam
exclusivamente no diário de IA.
