# UX-002 — Continuar e recomeçar a campanha

## Entrega

- Sem campanha: **COMEÇAR** cria o primeiro save e inicia a abertura.
- Com campanha: **CONTINUAR** restaura o ponto salvo; **RECOMEÇAR** é uma ação secundária.
- Recomeçar abre uma confirmação acessível. Cancelar recebe foco; Escape também cancela. Somente o botão de confirmação descarta a campanha e inicia uma nova abertura.
- O fundo do menu não inicia o jogo. Atalhos e controle não atravessam a confirmação. ZIP e pular fase permanecem discretos na barra.
- A antiga ação “Reiniciar” da derrota agora se chama “Voltar ao início”: retorna ao menu preservando o save. “Tentar de novo” continua sendo a tentativa pelo checkpoint.

## Persistência

A inspeção mostrou que a versão anterior persistia apenas a conclusão da abertura. Foi criada a chave `legendGirl.campaign.v1`, com versão do formato, estado da personagem e da fada, posição e velocidades, câmera, checkpoints implícitos nas flags de progressão, narrativa, temporizadores das cenas, estado visual das plataformas e progresso da sala de brinquedos. A abertura interrompida guarda o tempo e os eventos já executados. O objeto carregado na sala é religado ao brinquedo original restaurado.

Salvamento ao iniciar, entrar na sala de brinquedos, retornar ao menu, ocultar/sair da página e a cada segundo durante a campanha. Continuar restaura o ponto registrado sem executar a rotina que reposiciona a personagem no início. Fechamento abrupto do processo pode perder o intervalo ainda não salvo (até cerca de um segundo em execução normal).

Recomeçar limpa a campanha e `legendGirl.bedroom-opening.completed.v1`, incluindo a flag de conclusão em memória, e redefine o estado antes de criar o novo save. Preferências e chaves alheias à campanha não são apagadas. Não utiliza `localStorage.clear()`.

Compatibilidade: quem possui somente a flag antiga de abertura recebe CONTINUAR, preserva a cena assistida e começa no início jogável do quarto. Não é possível recuperar posições que a versão anterior nunca salvou.

Se o navegador negar o armazenamento ou estiver sem espaço, há alternativa em memória e aviso no menu de que o progresso vale somente para a sessão. A persistência entre recargas depende de armazenamento disponível.

## Validação

- `npm test`, incluindo `scripts/test-campaign-progress.js`: aprovado.
- `node scripts/test-opening-sequence.js`: aprovado.
- Teste de navegador: COMEÇAR, CONTINUAR, abertura interrompida, coordenadas/checkpoint/flags, segunda fase, brinquedo carregado, cancelar sem alteração do save, confirmar reinício completo, Escape e hierarquia em celular/paisagem.
- Testes de armazenamento: recarga, limpeza seletiva, referências compartilhadas, dados inválidos, acesso negado e limite de armazenamento.
- Assets, física e diálogos narrativos preservados.

Resultados: [validação do navegador](validacao.json), [testes](testes.txt).
Capturas: [menu](continuar.png), [confirmação](confirmacao.png), [celular](celular.png), [paisagem](paisagem.png).

Para reproduzir o navegador: servidor estático em `127.0.0.1:3001`, Chrome dedicado com depuração na porta 9222 e `node tmp/ux-002/verificar.mjs`. O script modifica somente os saves da origem de teste; usar perfil isolado.
