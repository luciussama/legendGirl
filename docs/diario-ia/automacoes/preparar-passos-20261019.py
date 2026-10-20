"""Prepara amostras locais de passos; recebe WAVs mono decodificados pelo macOS.

Uso: python3 ARQUIVO DIRETORIO_WAV RAIZ_PROJETO
Não instala dependências, não envia arquivos e não usa serviços pagos.
"""

import array
import hashlib
import json
import math
from pathlib import Path
import sys
import wave


def ler_pcm(caminho):
    """Lê PCM mono de 16 bits e retorna taxa e amostras inteiras."""
    with wave.open(str(caminho)) as entrada:
        if entrada.getnchannels() != 1 or entrada.getsampwidth() != 2:
            raise ValueError('A entrada deve ser PCM mono de 16 bits.')
        taxa = entrada.getframerate()
        amostras = array.array('h', entrada.readframes(entrada.getnframes()))
    if sys.byteorder != 'little':
        amostras.byteswap()
    return taxa, amostras


def salvar_pcm(caminho, taxa, amostras):
    """Grava WAV PCM mono sem compressão e sem alterar a taxa de origem."""
    dados = array.array('h', amostras)
    if sys.byteorder != 'little':
        dados.byteswap()
    with wave.open(str(caminho), 'wb') as saida:
        saida.setparams((1, 2, taxa, 0, 'NONE', 'not compressed'))
        saida.writeframes(dados.tobytes())


def identificar(caminho):
    """Registra tamanho e SHA-256 para conferir proveniência sem reescrever fontes."""
    dados = caminho.read_bytes()
    return {'bytes': len(dados), 'sha256': hashlib.sha256(dados).hexdigest()}


def preparar(temporario, raiz):
    """Recorta seis transientes por ator, preservando variação relativa de intensidade."""
    especificacoes = {
        'bear': ('urso', [2.09, 2.48, 2.87, 3.255, 3.595, 3.97], .23),
        'girl': ('menina', [.675, .92, 1.195, 1.445, 1.715, 1.99], .16),
    }
    resultado = {'status': 'amostras candidatas; sem integração ou homologação auditiva',
                 'processamento': 'local, sem IA, sem serviços externos ou cobrança',
                 'limites': 'Segmentação por energia não comprova ausência de música, voz ou ruído. Validar por escuta e sincronização na fase ainda não implementada.',
                 'atores': {}}
    for ator, (nome, picos, cauda) in especificacoes.items():
        taxa, dados = ler_pcm(temporario / (ator + '.wav'))
        janelas = [(max(0, int((p - .055) * taxa)), int((p + cauda) * taxa)) for p in picos]
        pico_banco = max(abs(v) for inicio, fim in janelas for v in dados[inicio:fim])
        ganho = min(1, (32767 * 10 ** (-9 / 20)) / pico_banco)
        fonte = raiz / 'assets/audio/bear-chase/fontes' / ('footsteps-' + ator + '.mp3')
        registro = {'fonte': str(fonte.relative_to(raiz)), **identificar(fonte),
                    'duracaoDecodificada': len(dados) / taxa, 'taxaHz': taxa,
                    'ganhoBanco': ganho, 'fadeEntradaMs': 3, 'fadeSaidaMs': 12,
                    'recortes': []}
        for numero, (inicio, fim) in enumerate(janelas, 1):
            recorte = []
            tamanho = fim - inicio
            for indice, valor in enumerate(dados[inicio:fim]):
                envelope = min(1, indice / (taxa * .003), (tamanho - 1 - indice) / (taxa * .012))
                recorte.append(round(valor * ganho * max(0, envelope)))
            destino = raiz / 'assets/audio/bear-chase/passos' / f'{nome}-{numero:02d}.wav'
            salvar_pcm(destino, taxa, recorte)
            rms = math.sqrt(sum(v * v for v in recorte) / len(recorte)) / 32768
            registro['recortes'].append({'arquivo': str(destino.relative_to(raiz)),
                'inicioFonte': inicio / taxa, 'fimFonte': fim / taxa,
                'duracao': len(recorte) / taxa, 'picoDbFS': 20 * math.log10(max(map(abs, recorte)) / 32768),
                'rmsDbFS': 20 * math.log10(rms), 'extremosZerados': recorte[0] == recorte[-1] == 0,
                **identificar(destino)})
        resultado['atores'][nome] = registro
    relatorio = raiz / 'docs/diario-ia/analises/20261019-passos-recortes.json'
    relatorio.write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'resultado': str(relatorio.relative_to(raiz)),
                     'recortes': sum(len(a['recortes']) for a in resultado['atores'].values()),
                     'bytesRecortes': sum(r['bytes'] for a in resultado['atores'].values() for r in a['recortes'])}, ensure_ascii=False))


if __name__ == '__main__':
    preparar(Path(sys.argv[1]), Path(sys.argv[2]))
