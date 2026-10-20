# Plano de execução: brinquedos e cena 3D da perseguição

Data: 20/10/2026. Sessão `20261020T124254-7c4dce56c46d`, Codex.
Branch examinada: `FEAT-bear-chase`, inicialmente limpa e alinhada com origin.
Status: planejamento solicitado pelo usuário; nenhuma implementação iniciada.
Este documento operacionaliza o roteiro de 19/10 sem substituir suas fontes ou
transformar aprovações técnicas anteriores em aprovação dos novos modelos.

## 1. Documentos lidos e situação confirmada no código

| Fonte | Interpretação para esta execução |
| --- | --- |
| `20261019-brinquedos-e-cena-3d.md` | Roteiro principal: converter props na prévia, preservar a arte e fazer prova de trem + armário antes de produzir em lote. |
| `20261019-chase-viabilidade.md` e métricas | Análise da música de 94,08 s anterior à integração. As afirmações de que a fase/áudio ainda não existem descrevem aquela sessão, não o runtime atual. Loop e mixagem ainda dependem de escuta. |
| `20261019-passos-viabilidade.md` e recortes | Preparação dos 12 WAVs; hoje consumidos por `ChaseAudio`. Não preparar novamente nem trocar os sons durante a conversão artística. |
| `20261019-perseguicao-urso-3d.md` | Compromissos maiores de cutscene, quarto estendido, baú após alcance e integração futura. Os trechos sobre personagens laterais e ausência de Three.js são históricos. |
| Contexto e encerramentos de 19/10 | Movimento orgânico retomado e revalidado pelo Copilot; personagem parcialmente aprovada, com retrabalho futuro. Nenhuma sessão ficou aberta. |

Constatações atuais:

- `ChaseSimulation` lança apenas `blocks`, `train` e `bunny`; não introduzir novos
  tipos no RNG para justificar modelos novos.
- `ChaseToyModels` já tem um trem geométrico, mas ainda é uma aproximação de cubos,
  cilindros e cores uniformes. A prova deve refiná-lo, não considerá-lo finalizado.
- `ChaseRenderer3D.updateToys` usa planos para blocos/coelho e caminhos diferentes
  de criação/descarte para grupos e meshes. Esse ponto precisa de contrato comum.
- Estante e castelo continuam planos sobre suportes; baú continua plano. Piso,
  parede, teto e tapetes já têm superfícies 3D texturizadas.
- A cena mantém 12 módulos reciclados; a extensão de 720 unidades, velocidade 8,
  largura lógica de obstáculo 1,15, voo 0,65 s, seed e eventos são contratos a preservar.
- A prévia não tem coleta, organização ou transporte de brinquedos. Esses sistemas
  são da Toy Room 2D. O roteiro menciona reutilização nesses estados, mas isso não
  inclui migrá-los nesta entrega: preparar catálogo reutilizável e manter a
  integração efetiva restrita à perseguição.
- `wardrobe` é o ID lógico que atualmente resolve `oak-cabinet-v1.png`, um armário
  baixo de carvalho. Não criar um segundo guarda-roupa alto por inferência do nome.
- `ChaseAudio` já reproduz a música por elemento de mídia (`loop = true`) e os
  passos por buffers. Não reimplementar o serviço com base na análise antiga.

O movimento da personagem e os demais trabalhos já existentes ficam preservados.
O urso protagonista da fuga não é automaticamente o mesmo asset que o ursinho
coletável da prancha; reutilização exige comparar proporções e materiais.

## 2. Escopo e mapa inicial de produção

O inventário tem 8 brinquedos e 7 móveis na sala 2D; ele serve como referência.
Eles entram no catálogo 3D, mas não precisam aparecer todos simultaneamente em
cada módulo. A composição da perseguição será controlada separadamente da física.

| Grupo / ID | Referência atual | Entrega 3D / prioridade |
| --- | --- | --- |
| `train` | `environment-sheet.png`, recorte x689/y76/w116/h88 | Piloto: refinar locomotiva, roda/chaminé, peças pintadas e veios conforme fonte. |
| `wardrobe` | `stage3/oak-cabinet-v1.png` | Piloto: portas, molduras, tampo, puxadores e laterais completas. |
| `blocks` | `stage3/stacking-blocks-v1.png` | Primeira leva: torre de peças com ordem, cores e arestas da imagem. |
| `bunny` | `stage3/cotton-bunny-v1.png` | Primeira leva: pelúcia rosa, orelhas, rosto, patas e costuras; evitar plástico. |
| `teddy` | `environment-sheet.png`, x424/y44/w86/h120 | Segunda leva: ursinho decorativo específico da referência. |
| `robot`, `duck` | `retro-robot-v1.png`, `royal-duck-v1.png` | Segunda leva: metal/pintura do robô e borracha/coroa do patinho. |
| `drum`, `jack` | `enchanted-drum-v1.png`, `fairy-jack-box-v1.png` | Segunda leva: pele/cordas do tambor; caixa, tampa e mola conectadas. |
| `shelf`, `fortress` | `bookshelf-v1.png`, `block-castle-v1.png` | Móveis prioritários: substituir os planos já presentes na corrida. |
| `chest` | `chest-brinquedos-v1.png` | Baú volumétrico com tampa articulável; preservar evento único de retorno. |
| `armchair`, `rocking-horse` | `armchair-v1.png`, `rocking-horse-v1.png` | Complementos: tecido/costuras da poltrona, madeira/bases curvas do cavalinho. |
| `table` | `environment-sheet.png`, x548/y44/w137/h119 | Complemento: mesa completa, incluindo tampo e suporte da referência. |
| Superfícies | Piso x27/y151/w186/h48; arquivos `stage1/` | Texturas existentes, espessuras/bordas e cortinas coerentes; sem forçar volume em papel ou tapetes. |

Confirmar em E0 os hashes, dimensões, áreas opacas, aliases, prompts e consumidores.
Não transformar essa tabela preliminar em inventário validado por execução.
A fada, personagens, inimigos da arena, UI e migração das fases 2D estão fora da
conversão de props. Janelas, frisos, tapetes e trilhos são adereços ambientais;
arquitetura ou novo desenho de níveis não devem ser introduzidos incidentalmente.

## 3. Etapas, dependências e condição de avanço

| Etapa | Trabalho e arquivos previstos | Saída verificável |
| --- | --- | --- |
| E0 — Baseline e referências | Inventário no diário; conferir mapa/manifesto, PNGs/prompts, fontes e contratos. Medir cena atual e dimensões visuais. | Referências por região e bounds/âncoras fechados; relatório de baseline; nenhuma mudança de gameplay. |
| E1 — Prova pequena | Trem + armário em módulos específicos e derivados sob `assets/models/bear-chase/`; painel de comparação em `docs/diario-ia/qa/`. | Modelos completos, fontes ao lado, luz neutra/quarto, vistas e movimento, tamanho de gameplay. |
| E2 — Revisão da prova | Corrigir silhueta, paleta, material, UVs e faces não fornecidas pela fonte; medir custo. | Avaliação humana registrada por objeto/vista. Aprovação técnica sozinha não abre a produção em lote. |
| E3 — Catálogo e recursos | Extrair contratos mínimos de catálogo, materiais, recursos e instanciação; adaptar compositor sem trocar a simulação. | Compartilhamento e descarte testados; modelos sem acesso à fase/sala ou decisões de colisão. |
| E4 — Arremessáveis | Integrar trem aprovado, blocos e coelho; substituir planos em `updateToys`. | Mesmos eventos, rotas, âncoras, voo e contato; nenhuma mudança de kind/width/seed/save. |
| E5 — Catálogo decorativo e móveis | Estante/castelo/baú primeiro; demais brinquedos e móveis em lotes pequenos, reutilizando famílias. | Cada lote comparado/validado; todos os IDs previstos mapeados, sem duplicação de fonte ou móvel por sinônimo. |
| E6 — Ambiente e composição | Substituir suportes genéricos; integrar bordas, madeira, tecido e elementos de `stage1` aos módulos reciclados. | Mesmo quarto reconhecível, faces visíveis acabadas, sem alterar limites navegáveis ou criar pistas técnicas no piso. |
| E7 — Regressão e entrega | Percurso completo, falhas/recuperação, memória, inputs, documentação e revisão humana em gameplay. | Testes registrados, custo dentro do orçamento, originais preservados, sem afirmar homologação de hardware não testado. |

Dependência: **E0 → E1 → E2 → E3 → E4 → E5 → E6 → E7**.
A primeira execução concreta deve terminar na prova revisável de trem e armário.
Uma aprovação parcial exige refinar a prova, sem fabricar os outros 13 objetos em
lote. Se já houver aprovação explícita desses modelos no momento da execução,
usá-la sem solicitar novamente a mesma decisão.

### Detalhamento de E0 e E1

1. Congelar a baseline de `ChaseSimulation`, config, obstáculos, snapshots e eventos.
   Registrar hashes/fontes e métricas no diário; não criar relatórios fora dele.
2. Para cada piloto, anotar medidas e regiões materiais: madeira natural/pintada,
   metal dos detalhes, bordas, marca de uso, sombra pintada e sombra de chão.
3. Inspecionar o PNG antes de recortar. O trem tem fundo escuro na prancha; qualquer
   máscara deve remover somente fundo externo conectado, preservando contornos e
   detalhes escuros internos. Manter a fonte intacta e o derivado rastreável.
4. Separar faces e preparar UVs. A imagem do armário já tem perspectiva: colá-la
   inteira numa caixa gera duas perspectivas e sombras duplicadas. Aproveitar
   regiões de madeira/painéis e construir as formas reais; tratar retificação e
   áreas não vistas como derivados/interpretações, sujeitos à avaliação.
5. Começar com construção local de malhas, compatível com os modelos atuais e a
   versão de Three.js já distribuída. GLB pode ser exportado para intercâmbio;
   carregamento GLB/novos loaders só se houver necessidade demonstrada, sem nova
   dependência ou serviço pago por conveniência.
6. Comparar frente, lateral, três quartos e costas, explicitando vistas inventadas.
   Mostrar luz neutra e quarto, escala de gameplay e ampliação conjunta opcional.
   O trem deve ser visto parado e em trajetória de lançamento, inclusive por trás.
7. Conferir fonte e modelo girando sob a mesma apresentação: não basta acertar
   uma captura frontal que esconda espessura, puxadores ou faces lisas.

## 4. Contratos e desacoplamento previstos

Nomes abaixo são proposta de implementação, não módulos já existentes:

- `ChasePropCatalog`: resolve IDs para descritores e fábricas; não conhece RNG,
  distância, personagens, eventos de campanha ou instância da sala.
- `ChasePropResources`: carrega/cacheia geometrias, materiais e texturas da cena;
  tem um proprietário e um ciclo de destruição explícitos. Remover uma instância
  não pode descartar materiais compartilhados por outras.
- Fábricas por objeto/família, por exemplo `TrainProp`, `OakCabinetProp` e
  `BunnyProp`: criam hierarquia visual, pivôs e geometria específica. Compartilham
  construção de material sem reduzir silhuetas diferentes a uma caixa universal.
- Descritor mínimo: ID, referência/derivado, bounds visuais, origem no apoio,
  escala de apresentação e fábrica. Uma instância fornece `Object3D`, atualização
  de pose visual quando necessária e liberação local, sem alterar o domínio.
- `ChaseRenderer3D`: continua compositor de câmera, setores, objetos e quadro;
  consome o catálogo por composição e mantém o contrato de `render`/`destroy`.
- `ChaseToyModels`: adaptar/delegar gradualmente para evitar duas implementações
  incompatíveis do mesmo trem. Não reescrever o coordenador inteiro de uma vez.

Usar comentários em português do Brasil em cada método novo/alterado, incluindo
construtor, getters e descarte; documentar unidades e propriedade de recursos.
Não criar barramento global, herança de fases ou abstração de materiais extensiva
antes de os dois pilotos demonstrarem a necessidade.

## 5. Integração sem alteração de jogo

- Hoje os planos usam centro vertical em 0,525 e o trem em 0,32; o contrato novo
  deve usar apoio inferior e compensação visual explícita. Não reutilizar esses
  offsets cegamente e deixar o modelo flutuando ou enterrado. A trajetória de
  lançamento mantém seus tempos e pontos lógicos.
- Tamanho e rotação aparentes precisam caber no corredor e comunicar a ocupação
  lógica existente. Corrigir malha, pivô ou escala visual, nunca `width`, raio,
  distância, dano ou hitbox para acomodar um detalhe artístico.
- Trocar somente o desenho de `blocks/train/bunny`; save continua contendo dados
  lógicos, não nomes de GLB, materiais ou referências GPU.
- O baú expõe tampa/pivô, mas lê a pose derivada da sequência. O modelo não emite
  conclusão, não move o urso sozinho e não altera `chestApplied`.
- Modelos dos demais brinquedos são decoração/catálogo nesta prévia. Não adicionar
  coleta/transporte, nem modificar `ToyRenderer` ou `RoomEnvironmentRenderer` 2D.
- Slots de decoração são dados de apresentação. Adicionar um armário à composição
  não cria obstáculo invisível, colisão nova nem estreita a rota disponível.
- Conservar menina parcialmente aprovada, sua animação orgânica, fada e urso. A
  prova usa-os para escala/oclusão, sem iniciar outra rodada de personagens.

## 6. Orçamento e estratégia de desempenho

A evidência anterior registrou pico de **285 recursos próprios**, cerca de **310
chamadas de desenho** no quadro desktop e limite automatizado **menor que 300
recursos**. Isso é referência histórica, não benchmark atual em aparelho físico.
Há pouca margem: medir novamente em E0 e otimizar antes de ampliar o catálogo.

| Área | Plano de controle |
| --- | --- |
| Instâncias | Recursos compartilhados; remoção de brinquedo/setor libera instância, não o material global. Número de recursos não cresce com a distância percorrida. |
| Desenho | Mesclar partes estáticas por material e reutilizar módulos; separar só pivôs móveis. Meta provisória: não piorar a baseline representativa, até validar orçamento real. |
| Texturas | Preferir atlas/regiões por família; começar em 256–512 px, reservando 1024 px para detalhe que prove necessidade na câmera. Contabilizar mipmaps e cópias CPU/GPU. |
| Memória | Publicar custos estimados por asset e medidos da cena antes de E5. Não prometer economia apenas por reduzir resolução. |
| GPU | Não aumentar silenciosamente o limite de 300 para “passar” o teste. Se for inadequado para o novo catálogo, justificar com medição e estabelecer regressão substituta de memória/descarte. |
| Carregamento | Preparação tardia da prévia, URLs relativas compatíveis com publicação e falhas explícitas. Não carregar toda a produção 3D nas fases anteriores. |

Paredes e tapetes podem permanecer superfícies planas texturizadas. Brinquedos e
móveis sólidos precisam de volume real e faces finalizadas, sem cartões como
substituição silenciosa. Não aplicar PBR fotorealista por padrão: luz/sombra e
materiais devem conservar o acabamento ilustrado e a paleta regional das fontes.

## 7. Verificação e critérios de aceite

Na execução, arquivar fontes de QA no diário e rodar em workspace temporário.
Não criar relatórios, fixtures ou evidências fora de `docs/diario-ia/`.

- Integridade: hashes dos originais mantidos; derivados com procedência, UVs e
  materiais identificados; caminhos/imports relativos e licenças existentes preservados.
- Domínio: comparar os mesmos percursos/seed/inputs antes e depois; obstáculos,
  hits, eventos, checkpoints, snapshots e conclusão devem ser iguais.
- Apresentação: profundidade efetiva, bounds/apoio, faces completas, continuidade
  de textura e ausência de cartões, halos, fundo preto, sombras duplicadas e
  interseções. Revisar lançamento, queda, contato, remoção e baú.
- Recursos: múltiplas instâncias compartilham materiais; remover uma não quebra as
  demais; entrada/saída repetida não acumula recursos/listeners; renderer destruído
  termina com zero recursos próprios; verificar perda/restauração WebGL.
- Navegador: desktop, retrato/paisagem móveis e viewport compacto; teclado, toque,
  gamepad simulado, resize, pause/blur, mudo e campanha intacta. Chrome emulado não
  certifica Safari ou hardware; registrar testes físicos apenas quando realizados.
- Comandos: `npm test`, `npm run test:bear-chase`, `npm run test:bear-chase:browser`,
  `npm run journal:qa -- test:bear-chase:motion:browser`, build/check-assets/lint e
  regressões específicas do catálogo a criar. `check-assets` sozinho não cobre
  modelos fora do catálogo global de imagens.
- Entrega por lote: atualizar o guia humano de prévia, manifestos que realmente
  consumirem os derivados, inventário e `npm run docs:sprites`. O manifesto atual
  é de imagens: não inserir GLB na seção `images` nem depender de `node_modules`
  em produção. Metadados consumidos pelo jogo podem ficar em `assets/models/`;
  métricas e inventários de QA permanecem no diário.

Aceite artístico: fonte e modelo reconhecíveis como o mesmo objeto em silhueta,
proporção, paleta por região e leitura de madeira/pelúcia/tecido/borracha. Não
marcar todas as vistas ou todos os objetos como aprovados a partir de um piloto.

## 8. Pendências independentes que não bloqueiam a prova dos props

- Áudio: ouvir `Chase.mp3`, marcar loop musical e saída, testar mistura com passos;
  manter MP3 original e serviço existente. O loop integral atual é provisório,
  não uma emenda aprovada. Essa edição é uma tarefa própria, sem nova síntese paga.
- Fase completa: medir a duração das fases existentes antes de fixar a maior fase;
  os 90 s da prévia e a hipótese antiga de 6–8 min não são a duração final aprovada.
- Campanha: vitória → cutscene → perseguição → baú, migração/retry/save e efeito
  único pertencem ao plano maior. Não misturá-los à conversão de props ou presumir
  que o seletor de debug já faz essa integração.
- Personagem/fada: a aprovação da menina é parcial e o retrabalho futuro é separado.

## Resultado desta sessão

Foram lidos os documentos novos e relacionados, registros completos recentes,
consumidores atuais, manifesto, contratos, prompts e referências visuais do trem
na prancha e do armário. O plano resolve os limites entre prévia 3D e sala 2D,
identifica o áudio já integrado e define entregas, dependências e aceite.
Nenhum runtime, sprite, malha, áudio ou dependência foi alterado; nenhum serviço
pago, commit ou push foi realizado. Testes de gameplay não foram executados nesta
sessão documental. A próxima entrega proposta é E0 + E1, com trem e armário.
