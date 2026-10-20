"""Mede localmente o PCM da trilha; não realiza escuta nem estima LUFS/true peak."""

import array
import hashlib
import json
import math
from pathlib import Path
import sys
import wave


def db(valor):
    """Converte amplitude linear em dBFS, retornando nulo para silêncio absoluto."""
    return 20 * math.log10(valor) if valor > 0 else None


def analisar(wav, mp3, destino):
    """Mede níveis PCM, energia por segundo, silêncios nas bordas e memória estimada."""
    with wave.open(str(wav)) as entrada:
        canais = entrada.getnchannels()
        taxa = entrada.getframerate()
        quadros = entrada.getnframes()
        if entrada.getsampwidth() != 2:
            raise ValueError('Esperado PCM de 16 bits.')
        pcm = array.array('h', entrada.readframes(quadros))
    if sys.byteorder != 'little':
        pcm.byteswap()
    quadrados = sum(v * v for v in pcm)
    rms = math.sqrt(quadrados / len(pcm)) / 32768
    pico = max(map(abs, pcm)) / 32768
    energia = []
    for inicio in range(0, len(pcm), taxa * canais):
        trecho = pcm[inicio:inicio + taxa * canais]
        energia.append(round(db(math.sqrt(sum(v * v for v in trecho) / len(trecho)) / 32768) or -120, 3))
    limiar = round(32768 * 10 ** (-60 / 20))
    primeiro = next((i // canais for i, v in enumerate(pcm) if abs(v) > limiar), None)
    ultimo = next(((len(pcm) - 1 - i) // canais for i, v in enumerate(reversed(pcm)) if abs(v) > limiar), None)
    origem = mp3.read_bytes()
    resultado = {
        'arquivo': str(mp3), 'sha256': hashlib.sha256(origem).hexdigest(),
        'bytes': len(origem), 'duracaoDecodificadaSegundos': quadros / taxa,
        'canais': canais, 'taxaHz': taxa, 'picoAmostralDbFS': db(pico),
        'rmsDbFS': db(rms), 'fatorCristaDb': db(pico / rms),
        'amostrasNoLimitePCM16': sum(abs(v) >= 32767 for v in pcm),
        'amostrasAcimaMenos1DbFS': sum(abs(v) / 32768 >= 10 ** (-1 / 20) for v in pcm),
        'rmsPorSegundoDbFS': energia,
        'primeiroSinalAcimaMenos60DbFSSegundos': primeiro / taxa if primeiro is not None else None,
        'ultimoSinalAcimaMenos60DbFSSegundos': ultimo / taxa if ultimo is not None else None,
        'memoriaPCMFloat32MiB': quadros * canais * 4 / 1024 ** 2,
        'limites': 'Pico amostral e RMS não são true peak nem LUFS. Não houve escuta crítica, validação de emenda musical ou reprodução no navegador.'
    }
    destino.write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: v for k, v in resultado.items() if k != 'rmsPorSegundoDbFS'}, ensure_ascii=False))
    print('RMS por segundo nas bordas:', energia[:8], energia[-8:])


if __name__ == '__main__':
    analisar(*(Path(p) for p in sys.argv[1:]))
