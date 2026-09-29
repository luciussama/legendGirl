# QA-002 — Legibilidade na penumbra

Ajuste exclusivo em `src/js/environment/LightingSystem.js`: contribuição ambiental difusa de intensidade máxima 0,065 para Blocos ABC (4), Tambor (5), Almofada (6) e Gavetas da Cômoda (7). A região se estende suavemente do tampo à base, terminando com opacidade zero. Não há traços, contornos nem novas superfícies. A Cômoda Pequena (3) permanece como estava.

A máscara geral, as luzes da fada e das janelas e a vinheta conservam seus parâmetros. Configuração, física, hitboxes, posições e ilustrações não foram alteradas. O ajuste não se aplica à terceira fase.

## Comparação visual

Em `comparacao.png`, esquerda: antes; direita: depois. Linhas: Blocos ABC, Tambor, Almofada e Cômoda. Recortes sem correção de exposição. As oito capturas integrais estão nesta pasta.

Inspeção: atmosfera escura preservada, bases e tampos discretamente mais legíveis, sem foco luminoso aparente. Os suportes continuam escuros, coerentes com a penumbra solicitada.

## Validação

- Playtest no Chrome com renderizador real: quatro saltos em três passos de tempo (0,5 / 1 / 1,2), aprovados antes e depois. Os JSONs são idênticos, incluindo lançamento, duração e altura de contato.
- `npm test`: aprovado, incluindo 22 plataformas e 66 verificações de apoio.
- `node scripts/test-lighting.js`: aprovado; máscara e transformação da câmera preservadas, sem mutação do estado.

Capturas determinísticas na página de revisão, com tick 150, câmera igual e fada deslocada para trás somente na instrumentação, para avaliar os objetos fora da sua luz próxima. A mensagem abaixo do canvas é resíduo da simulação da página de teste, não um resultado dos saltos registrados. Não representa uma sessão manual completa.

Reprodução: iniciar servidor estático na porta 3000 e Chrome dedicado com depuração na porta 9222; executar `node scripts/capture-qa002.js antes` na versão original e `node scripts/capture-qa002.js depois` na versão ajustada.
