# QA-Mobile-002 — Área segura de legendas e diálogos no iPhone

Correção aplicada aos diálogos com retrato (cena do castelo, reviravolta e espera) e às cinco falas da abertura.

Os dois renderizadores ancoravam as caixas à altura integral do canvas. O contêiner em retrato usa `100vh`, que pode ser maior que a região efetivamente visível com as barras do Safari. O novo posicionamento usa a interseção entre o retângulo do canvas e `visualViewport`, desconta os quatro `safe-area-inset-*` e converte pixels CSS para coordenadas internas. As caixas mantêm pelo menos 16 pixels CSS de afastamento das bordas seguras; margens originais maiores são preservadas.

A leitura é refeita ao desenhar, acompanhando rotação e mudanças das barras do navegador. O canvas e o cenário não são redimensionados por esta correção. O tratamento se aplica a iPhone/iPad; outras plataformas mantêm as coordenadas anteriores.

Textos, roteiro, duração, fontes e animações permanecem intactos. Quando necessário, as mesmas palavras são redistribuídas entre linhas dentro da largura segura. A escolha preexistente de tamanho de fonte usa a largura original, evitando redução de fonte causada pelo notch.

## Capturas após o ajuste

**Capturas em Chrome com viewport e identificação de iPhone emulados, não em aparelhos iOS.** As áreas seguras foram injetadas apenas na página de teste. O canvas foi mantido 100 pixels CSS mais alto que a região visível para reproduzir o transbordamento sob a barra do navegador.

| Cenário | Viewport visível | Insets simulados (topo/direita/base/esquerda) | Abertura | Diálogo |
| --- | --- | --- | --- | --- |
| Com notch, retrato | 390 × 744 | 47 / 0 / 34 / 0 px | [Captura](notch-retrato-abertura-15.png) | [Captura](notch-retrato-cena-1.png) |
| Com notch, paisagem | 844 × 340 | 0 / 47 / 21 / 47 px | [Captura](notch-paisagem-abertura-15.png) | [Captura](notch-paisagem-cena-1.png) |
| Sem notch, retrato | 375 × 567 | 0 / 0 / 0 / 0 px | [Captura](sem-notch-retrato-abertura-15.png) | [Captura](sem-notch-retrato-cena-1.png) |
| Sem notch, paisagem | 667 × 325 | 0 / 0 / 0 / 0 px | [Captura](sem-notch-paisagem-abertura-15.png) | [Captura](sem-notch-paisagem-cena-1.png) |

## Verificação

- 40 quadros: cinco falas da abertura, espera, duas falas do castelo e duas da reviravolta, nos quatro cenários.
- Limites reais de cada texto medidos com `measureText`, incluindo nome do interlocutor e instrução de avanço: 100% dentro da área segura, sem corte e acima da folga inferior nos quadros testados.
- Conteúdo integral e fontes comparados com o mesmo quadro sem ajuste iOS: preservados.
- `npm test`: aprovado, incluindo regressões anteriores e testes de conversão da área segura, notch lateral e canvas deslocado.
- `git diff --check`: aprovado.
- Inspeção visual das capturas de retrato e paisagem: caixas e texto visíveis.

[Resultados detalhados](resultados.json). Para reproduzir, iniciar `node server.js`, um Chrome dedicado com `--remote-debugging-port=9222` e executar `node scripts/review-ios-dialogue.js`.

## Homologação iOS pendente

O utilitário `simctl` não está disponível neste ambiente. As evidências acima validam a geometria emulada, sem comprovar o comportamento do Safari/WebKit em aparelho. Confirmar em iPhones com e sem notch, nas duas orientações, com barras do Safari abertas/recolhidas e durante a rotação. A entrega de capturas provenientes de dispositivos iOS reais permanece pendente dessa execução.
