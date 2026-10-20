# Amostra pictórica de material — armário

Sessão `20261020T135959-383ba4a2d395`, Codex, 20/10/2026.

O usuário solicitou uma amostra de transformação dos assets atuais para validar
a direção pictórica inspirada em Legend of Mana. Escolhido o armário de carvalho,
mantendo família cromática, duas portas, tampo, pés e ferragens. É um estudo de
pintura sobre captura, não textura UV implementada nem aprovação da direção.

## Entradas e método

- Captura real do modelo atual, extraída do canvas neutro do painel existente:
  `/tmp/legendgirl-armario-atual-pictorico.png`, 528×332, 58733 bytes,
  SHA-256 `e39fe134c7a13dd4bafff48c46899b034a16fffa196bd37d62dc04fe4da598db`.
- Sprite de identidade/paleta: `assets/art/toy-room/stage3/oak-cabinet-v1.png`,
  354×208, SHA-256
  `870179a5c3fe465ca0ce4f419da7ec8a0247889e087c810d4201deddf23e0a1d`.
- Ferramenta integrada `image_gen`, modo de edição com duas referências locais;
  sem CLI, chave de API ou contratação de serviço externo.
- Prancha com reprodução gerada do estado atual à esquerda e proposta pintada
  à direita. O painel esquerdo não deve ser apresentado como captura literal sem
  alterações: a captura original é a entrada, e a comparação foi gerada por IA.

O estudo reforça veios direcionais, nós, variação de pincelada, desgaste de bordas,
rebaixos e pátina das ferragens. Inspeção visual: ambas as vistas inteiras, texto
legível, desenho geral e tons preservados; o estudo tem pequenas interpretações
de bordas/ferragens. Isso não garante correspondência exata de cada píxel/forma.
Não houve geração de atlas, mudança da geometria, alteração de luz da cena ou
substituição das texturas em produção.

## Arte e verificação

Arte conceitual preservada em `docs/diario-ia/arte/20261020-armario-pictorico-v1.png`.
É entrega artística gerada, não captura regenerável de QA: conservar o bitmap.
Origem padrão da ferramenta:
`/Users/sergio/.codex/generated_images/01a154cd-728d-77b0-aa9d-932eed119491/exec-5e06fa27-61f2-4c21-abda-8c35a72d050a.png`.

Captura de referência executada pelo diário em workspace temporário e servidor
restrito a 127.0.0.1. A primeira solicitação de execução expirou na revisão
automática sem decisão; a única repetição permitida passou. Não houve rejeição
de segurança da geração. O original PNG e módulos de jogo permanecem intactos.
Não executar ou declarar testes de gameplay como validação desta pintura.

Pendente: avaliação do usuário. Se a direção for aceita, preparar texturas por
face/região, aplicar UVs no mesmo modelo e validar frente/laterais/costas, escala
de gameplay e custo GPU. A prancha isolada não demonstra que esse trabalho está
implementado nem autoriza propagação automática aos demais assets.

## Prompt final enviado à ferramenta integrada

```text
Uso: style-transfer.
Entrega: UMA prancha comparativa horizontal de direção de arte, com dois painéis iguais, intitulados exatamente "ATUAL" e "ESTUDO PICTÓRICO".
Imagem 1 é o ALVO: captura verdadeira do armário 3D atual do jogo. Imagem 2 é a referência de identidade e paleta: sprite original do mesmo armário.
No painel esquerdo, reproduza fielmente a captura da imagem 1, com seu acabamento simples, sem embelezar. No direito, faça uma transformação pictórica refinada SOBRE O MESMO ARMÁRIO DA IMAGEM 1. Mantenha exatamente o mesmo ponto de vista, tamanho aparente, perspectiva, proporções, silhueta, pés, tampo, duas portas com molduras e dois puxadores circulares. O objetivo é comparar MATERIAL, não redesenhar o móvel.
Direção artística do painel direito: riqueza de pintura artesanal de conto de fadas de Legend of Mana, com pinceladas de guache/aquarela digital controladas, leitura de jogo ilustrado, textura desenhada deliberadamente por face. Carvalho quente mel/ocre da referência original; variações localizadas âmbar, terra e creme, sem mudar a família cromática geral. Veios finos curvos que respeitam cada tábua, alguns nós distribuídos com intenção em vez de textura repetida, discretas estrias e marcas de uso, bordas suavemente gastas com pinceladas claras interrompidas, meios-tons ricos e sombras pintadas sutis nos encaixes e rebaixos. Os painéis das portas têm direção de fibra coerente e bordas distintas das molduras. Tampo e lateral devem receber o mesmo cuidado. Puxadores e dobradiças de latão têm pequenas marcas e patina pintada. O resultado deve ser visivelmente mais rico e artesanal, sem parecer fotografia de madeira, render PBR polido ou ruído procedural.
Conserve a orientação e intensidade geral da luz da captura: não simule a melhoria com spotlight dramático, bloom, brilho ou nova iluminação de cena. A diferença deve vir do conteúdo pictórico das superfícies. Fundo plano neutro bege igual nos dois painéis. Centralize cada móvel por inteiro, mesmo alinhamento de apoio e escala, margens confortáveis, nenhuma parte cortada.
Restrições: não acrescentar flores, folhas, vinhas, entalhes ornamentais novos, inscrições, objetos, cenário, personagens, adesivos ou arquitetura. Não modificar o desenho do armário. Não fazer pixel art. Não trocar o armário por uma versão fantasiosa de formato diferente. Não reproduzir assets de outro jogo. Texto somente os dois rótulos em português, discretos e legíveis. Isto é um estudo visual de paintover para aprovação, não um atlas UV nem uma captura implementada no jogo.
```
