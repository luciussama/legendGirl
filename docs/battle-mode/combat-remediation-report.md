# Remediação dos sprites de combate — Prompt 14B

**Resultado: FAIL. O objetivo de homologação não foi atingido. Prompts 15 e 16 permanecem bloqueados.**

Foi produzida uma segunda versão das sete pranchas solicitadas, com referências do pacote existente e instruções específicas de pose. Os PNGs estão em `assets/art/toy-room/battle/remediation/`. O candidato permanece separado dos recursos originais e não foi integrado ao jogo. Gameplay, IA, HP, repertório e regras não foram alterados.

| Sequência | Resultado | Evidência e correção restante |
| --- | --- | --- |
| Robot Walk | FAIL | Quatro poses distintas, mas sem alternância inequívoca dos apoios. Uma geração adicional de apoio oposto também não resolveu a anatomia; foi descartada do manifesto. Refazer os apoios antes de interpolar as passagens. |
| Front Charge | REVISÃO | Há compressão e silhueta mais baixa, sem poeira. A projeção ofensiva e a recuperação ainda precisam passar na inspeção temporal em escala de destino. |
| Rocket Punch | FAIL | Extensão corporal legível; referência do corpo agora explícita. Proporções e acabamento ainda divergem do Robô original. Não homologado artisticamente. |
| Steam Blast | REVISÃO | Nova produção após o gate apresenta compressão, saída aberta e recuo; leitura de emissão melhorou na prancha. Temporalidade, escala pequena e transições ainda pendentes. |
| Laser Beam | REVISÃO | Há mudanças de braços e preparação, mas a intenção de tiro ainda exige avaliação completa e harmonização com as demais poses do Robô. |
| Train Walk | REVISÃO | Após a correção localizada, os pinos e a biela percorrem seis fases ao redor dos eixos. Constância geométrica e transições finais ainda exigem certificação. Consulte [correção da biela](train-rod-correction.md). |
| Dinosaur Rush | REVISÃO | Mandíbula fechada e projeção do corpo diferenciam Rush de Bite. Continuidade com Walk e recuperação ainda não certificadas. |
| Anchor Review | REVISÃO | Referência manual do corpo substitui centro do recorte nas correções; ausência de deriva visual ainda não certificada. |
| Transition Review | REVISÃO | Montagens disponíveis; revisão integral de todas as fronteiras nas duas escalas ainda pendente. |

## Evidências e limites

As sete pranchas foram inspecionadas ampliadas. A prévia animada carregou os 144 PNGs e disponibiliza pausa, avanço de quadro, escala ampliada e pequena. Amostras do Chrome confirmaram apresentação transparente e leitura pequena dos controles de revisão. Não foi realizada uma revisão temporal integral de todas as sequências e transições. A escala pequena não é uma medição do gameplay final.

`node scripts/verify-battle-sprites.js --remediation` passou: 144 PNGs, 26 sequências, repertórios corretos, margens, transparência e ausência de duplicação exata. Esse resultado técnico não aprova movimento, arte ou intenção ofensiva. Padding também não comprova integridade de partes originalmente desenhadas.

As tentativas de geração não resolveram os apoios opostos nem a rotação mecânica exigida. Repetir desenhos diferentes ou mover recortes por código não seria uma correção aceitável. O pacote entregue é um candidato reprovado, não uma substituição homologada.

## Reexecução do Prompt 14

Ataque e movimento são parcialmente legíveis. Rocket Punch tem extensão reconhecível; Rush enfatiza avanço corporal. Robot Walk e Train Walk continuam insuficientes. Não foi certificado que inexista teletransporte; não há duplicação exata, mas isso não elimina imobilidade perceptiva. Steam Blast não comunica emissão suficientemente sem efeitos. Logo, a resposta principal para o conjunto permanece **NÃO**, e o resultado é **FAIL**.

Consulte [âncoras](anchor-review-report.md), [transições](transition-review-report.md) e [resultado estruturado](combat-remediation-report.json). Os prompts e referências utilizados estão em `remediation/prompts.json`. A tentativa `robot-opposite-support.png` é evidência descartada, sem participação no manifesto.
