# Legendas próximas da personagem

As legendas móveis deixaram de usar apenas a base do canvas como referência. Na abertura, usam a posição da menina na cama; nos diálogos do jogo, usam sua posição após as transformações reais da câmera, incluindo elevação no Android e zoom móvel.

A caixa é colocada abaixo da personagem com uma separação de aproximadamente 24 pixels CSS. Se não houver espaço, é colocada acima. O posicionamento permanece limitado à área segura e reserva pelo menos 16% da altura segura abaixo da caixa, quando há espaço. Texto, fonte, duração e física foram preservados. O desktop conserva o posicionamento anterior.

Validação: `npm test` aprovado; testes específicos cobrem posicionamento abaixo/acima, folga inferior e preservação do desktop. O navegador validou 40 quadros no perfil iPhone e 40 no perfil Android, com todos os textos dentro das margens e sem mudanças de conteúdo ou fonte. Os perfis são emulados no Chrome; não representam aparelhos reais.

- [Abertura próxima da menina — iPhone](notch-retrato-abertura-15.png).
- [Diálogo elevado — iPhone](notch-retrato-cena-1.png).
- [Abertura próxima da menina — Android](android/notch-retrato-abertura-15.png).
- [Diálogo elevado — Android](android/notch-retrato-cena-1.png).

Os nomes dos cenários do script refletem insets simulados. Capturas de diálogos isolados verificam a reserva inferior sem âncora; as capturas da abertura usam a posição da personagem na cena real.
