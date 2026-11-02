> **Implementação posterior — 02/11/2026:** plano P1–P3 implementado e validado tecnicamente na sessão `20261102T170351-df7913245c7f`. As conclusões abaixo descrevem a avaliação da versão anterior. Aprovação artística humana continua pendente; veja o contexto vigente e o guia do Brinquedão. Nenhuma instrução histórica de aguardar execução prevalece sobre os pedidos posteriores.

> **Situação atual — 02/11/2026:** execução autorizada pelo usuário e concluída na sessão `20261102T154955-7fcd38702313`. Parecer: não aprovado para fechamento visual em alta velocidade. Avaliação completa preservada no pacote `20261102T155941-bca3489ad1f8`, recuperável por `npm run journal:search -- "Avaliação de direção de arte do Brinquedão"`. A proibição de executar agora, transcrita abaixo, pertence ao pedido original e foi superada pela autorização posterior. O roteiro original permanece preservado.

# Próxima avaliação de direção de arte — aguardando execução

Solicitação do usuário em 02/11/2026. **NÃO EXECUTAR AGORA. Apenas registrar no diário para execução posterior.** Este roteiro se refere à fase chamada “Brinquedo” no pedido, correspondente ao Brinquedão no projeto. Os campos entre colchetes continuam pendentes; não assumir uma idade ou alterar a câmera com base neste planejamento. As regras vigentes de câmera, física, hitboxes e apresentação continuam aplicáveis.

O roteiro abaixo preserva integralmente a especificação recebida. Nenhuma nota, veredito ou aprovação decorre deste registro. A checagem de desempenho e as correções anteriormente solicitadas são trabalhos separados.

## Contexto e Persona
Você atuará como um Diretor de Arte Sênior e Especialista em Visual Development para Jogos de Plataforma 2D/2.5D de alta velocidade (estilo Sonic the Hedgehog, Rayman Legends). Sua especialidade é unir apelo estético lúdico com legibilidade funcional extrema para jogabilidade rápida.

Sua tarefa é conduzir uma avaliação crítica da composição visual e consistência gráfica da fase chamada **"Brinquedo"** (um cenário temático infantil onde o personagem corre em ritmo acelerado superando desafios).

---

## Dados de Entrada
- [Inserir Screenshot(s), Mockup de Level Design, Sprite Sheet ou Vídeo da fase "Brinquedo"]
- **Público-alvo:** Crianças de [Inserir Idade, ex: 6 a 9 anos]
- **Direção Estética Base:** [Ex: Peças de montar, blocos de madeira coloridos, pistas de corrida de plástico, robôs de lata]
- **Tipo de Câmera:** Side-scroller 2D com deslocamento de alta velocidade e zoom dinâmico.

---

## Instruções de Análise

Analise a composição da fase considerando que o jogador atravessa o cenário em alta velocidade. Avalie os 5 eixos técnicos abaixo atribuindo notas de 1 a 5 (1 = Crítico / Reprovado, 5 = Excelente):

### 1. Legibilidade em Alta Velocidade e Separação de Planos (Readability & Speed)
- O plano de colisão/jogável (onde o personagem pisa, corre e salta) tem separação tonal e de saturação imediata em relação ao plano de fundo (background)?
- Quando a câmera acelera, o cenário de fundo causa efeito estroboscópico, vibração excessiva de cores ou ruído visual?
- Obstáculos, perigos, molas/loops e colecionáveis se destacam instantaneamente em visão periférica, ou se camuflam nos "brinquedos" decorativos?

### 2. Linguagem de Formas e Silhuetas (Shape Language & Affordance)
- As superfícies interativas comunicam sua função mecânica pela silhueta (ex: blocos de montar firmes para pisar vs. formas pontiagudas/arestas para perigo)?
- A linguagem de formas do tema "Brinquedo" mantém consistência em todo o percurso (ex: chanfros plásticos, bordas arredondadas e espessuras de contorno uniformes)?
- As linhas de fluxo e pistas de aceleração direcionam o olho da criança naturalmente para o próximo salto/desafio (leading lines)?

### 3. Hierarquia Cromática e Valor Tonal (Value & Color Coding)
- A imagem em escala de cinza (*grayscale check*) mantém o caminho do personagem e os colecionáveis visíveis sem confusão com a decoração?
- Há um código de cores funcional estabelecido (ex: cores quentes/saturadas reservadas para perigos e itens coletáveis; tons frios/desaturados para cenários distantes e parallax)?
- A iluminação/sombreamento ajuda a compreender profundidade ou cria falsas pistas de plataformas falsas?

### 4. Coerência de Textura, Escala e Densidade de Assets (Asset Consistency)
- A escala visual dos brinquedos de fundo em relação ao personagem faz sentido cenográfico ou gera confusão métrica de colisão?
- O nível de detalhe e densidade de textura (texel density/stroke weight) é consistente entre sprites do primeiro plano, cenários intermediários e fundos distantes?
- Elementos modulares (tiles de plataformas, loops, rampas) mostram junções/costuras visíveis que quebram a ilusão visual?

### 5. Apelo Lúdico e Ritmo Emocional
- O cenário comunica a fantasia lúdica da fase "Brinquedo" de forma vibrante e convidativa para o público infantil?
- A composição equilibra áreas visuais densas (parques de blocos, áreas industriais de brinquedos) com áreas de alívio visual (espaços abertos para corridas em alta velocidade)?

---

## Formato de Saída Obrigatório

Gere a resposta rigorosamente nesta ordem:

1. **Veredito do Diretor de Arte:** Diagnóstico geral da fase (2 parágrafos cobrindo a maturidade estética e a viabilidade prática em alta velocidade).
2. **Matriz de Avaliação:** Tabela contendo:
   - Dimensão
   - Nota (1 a 5)
   - Impacto na Jogabilidade (Alto / Médio / Baixo)
   - Status (Aprovado / Requer Ajuste / Crítico)
3. **Mapeamento de Falhas Críticas:** Lista com elementos exatos que geram:
   - *Camuflagem acidental de perigos ou plataformas.*
   - *Ruptura de estilo (assets que parecem de outro jogo).*
   - *Ruído visual excessivo durante o movimento.*
4. **Guia de Correções Rápidas (P1 a P3):** Ações práticas e objetivas com indicação de ajustes em paleta, iluminação, simplificação de background e reforço de silhueta nos assets jogáveis.
