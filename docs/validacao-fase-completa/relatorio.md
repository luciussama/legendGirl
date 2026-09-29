# Validação do percurso completo

Projeto em execução em `http://localhost:3000`, com a página inicial aberta no Chrome. Verificação concluída no navegador de teste com perfis desktop, Android emulado e iPhone emulado.

## Resultado

Os três perfis completaram:

1. Abertura da menina acordando e confirmação para iniciar.
2. Os 22 apoios do percurso de ida, incluindo a cena do castelo e o início da fuga.
3. Salto até a porta falsa, reviravolta e tutorial do retorno.
4. Os 16 apoios do percurso de volta e a transição pelo portal verdadeiro.
5. Entrada na sala de brinquedos, coleta e entrega dos oito objetos no baú, com ativação da mensagem de vitória.

**114 pousos do percurso principal e 24 objetos guardados no total dos três perfis.** Não foi necessário alterar o código de produção nesta rodada de validação.

## Evidências

| Perfil | Percurso | Brinquedos | Vitória |
| --- | --- | --- | --- |
| Android emulado, 390 × 844 | [38 apoios](percurso.json) | [8 objetos](brinquedos.json) | [Captura](05-sala-concluida.png) |
| Desktop, 960 × 540 | [38 apoios](desktop/percurso.json) | [8 objetos](desktop/brinquedos.json) | [Captura](desktop/05-sala-concluida.png) |
| iPhone emulado, 390 × 844 | [38 apoios](iphone/percurso.json) | [8 objetos](iphone/brinquedos.json) | [Captura](iphone/05-sala-concluida.png) |

Também aprovados: `npm test`, testes específicos da abertura, 293 verificações de física/alinhamento, validação dos 67 recursos registrados, `npm run build` e `git diff --check`.

## Método e limites

O script `scripts/verify-full-browser.js` usa o código real de atualização e renderização por meio de instrumentação exclusiva de `tests/dark-room-playthrough.html`. O tempo avança em passos de um quadro. A busca automática testa diferentes esperas antes de saltar, restaurando snapshots em memória entre tentativas. O pouso aprovado é o ponto de partida do próximo salto; não há teletransporte entre plataformas.

Na sala, o teste calcula rotas livres e envia vetores ao joystick virtual, usando movimento, colisões e interação de produção. Confirma cada coleta/entrega e a flag de vitória. Debounces de entrada são liberados apenas na instrumentação para permitir execução acelerada; física e geometria não mudam.

A primeira tentativa caminhou após o último apoio da fuga e foi alcançada pela rolagem automática antes da porta. O percurso foi concluído com um salto adicional até o portal, sem modificar o jogo. Esse comportamento merece atenção em playtests de usabilidade, embora não impeça a conclusão.

A execução comprova um percurso completo funcional, não ausência de todo possível defeito. Safari/WebKit, gestos do sistema, latência de toque, conforto e áudio em celulares reais ainda exigem validação nos aparelhos. Os perfis móveis desta rodada rodaram em Chrome desktop, com dimensões e identificação emuladas.

## Reprodução

Com o servidor local e um Chrome dedicado com `--remote-debugging-port=9222` ativos:

```sh
node scripts/verify-full-browser.js
node scripts/verify-full-browser.js desktop
node scripts/verify-full-browser.js iphone
```
