#!/usr/bin/env python3
"""Recorta os áudios fornecidos e prepara variações de asas com emendas suaves."""
import array
import hashlib
import json
import math
from pathlib import Path
import subprocess
import tempfile
import wave

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'assets/audio/effects'

def read(path):
    with wave.open(str(path)) as w:
        return array.array('h', w.readframes(w.getnframes())), w.getframerate(), w.getnchannels()

def write(name, values, rate):
    samples = array.array('h', (round(max(-1, min(1, v))*32767) for v in values))
    with wave.open(str(DEST/name), 'wb') as w:
        w.setparams((1, 2, rate, 0, 'NONE', 'not compressed')); w.writeframes(samples.tobytes())

def prepare():
    metadata = {'origem': 'Arquivos fornecidos pelo usuário em 31/10/2026', 'fontes': {}, 'recortes': []}
    for name in ['jump-girl.wav', 'jump-mud.wav', 'source/wings-bugs.wav', 'source/wings-bugs2.wav', 'source/wings-bee.wav']:
        metadata['fontes'][name] = hashlib.sha256((DEST/name).read_bytes()).hexdigest()
    # afconvert decodifica PCM de 24 bits e reamostra; a preparação não faz parte do runtime.
    with tempfile.TemporaryDirectory(prefix='legendgirl-audio-') as temp:
        converted = Path(temp)/'wings.wav'
        subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16@22050', '-c', '2', str(DEST/'source/wings-bugs.wav'), str(converted)], check=True)
        samples, rate, channels = read(converted)
        for name, start, end, channel, high, low in [
            ('wings-bee.wav', 46, 52, 1, 160, 6500),
            ('wings-beetle.wav', 54, 60, 0, 70, 3200),
            ('wings-dive.wav', 34, 40, 1, 120, 5200),
        ]:
            values = [v/32768 for v in samples[int(start*rate)*channels+channel:int(end*rate)*channels:channels]]
            hp = 1/(1+2*math.pi*high/rate); lp = 1-math.exp(-2*math.pi*low/rate)
            previous = filtered = smooth = 0; out = []
            for v in values:
                filtered = hp*(filtered+v-previous); previous = v; smooth += lp*(filtered-smooth); out.append(smooth)
            rms = math.sqrt(sum(v*v for v in out)/len(out)); gain = min(80, .12/max(rms, 1e-6))
            out = [math.tanh(v*gain) for v in out]
            scale = .60/max(max(abs(v) for v in out), .60); out = [v*scale for v in out]
            # Sobreposição de 120 ms: fim e início se encontram sem interrupção do bater de asas.
            overlap = round(rate*.12)
            seam = [out[-overlap+i]*(1-i/overlap)+out[i]*(i/overlap) for i in range(overlap)]
            out = seam+out[overlap:-overlap]
            write(name, out, rate)
            metadata['recortes'].append({'arquivo':name,'inicio':start,'fim':end,'canal':channel,'passaAltasHz':high,'passaBaixasHz':low,'ganho':gain,'emendaSegundos':.12,'picoPCM':.6})
    # Cada espécie usa sua fonte fornecida; os recortes anteriores continuam como referências.
    for source, output, usage in [
        ('wings-bugs2.wav', 'wings-insects-v2.wav', 'Besouros do jardim e do sonho; exceto abelhas.'),
        ('wings-bee.wav', 'wings-bee-v2.wav', 'Todas as abelhas do jardim e do sonho, incluindo rasantes.'),
    ]:
        with tempfile.TemporaryDirectory(prefix='legendgirl-asas-v2-') as temp:
            converted = Path(temp)/'wings.wav'
            subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16@22050', '-c', '1', str(DEST/'source'/source), str(converted)], check=True)
            samples, rate, _ = read(converted)
            values = [v/32768 for v in samples]
            rms = math.sqrt(sum(v*v for v in values)/len(values)); gain = min(10, .075/max(rms, 1e-6))
            out = [math.tanh(v*gain) for v in values]
            scale = .55/max(max(abs(v) for v in out), .55); out = [v*scale for v in out]
            overlap = round(rate*.12)
            seam = [out[-overlap+i]*(1-i/overlap)+out[i]*(i/overlap) for i in range(overlap)]
            write(output, seam+out[overlap:-overlap], rate)
            metadata['recortes'].append({'arquivo':output,'fonte':'source/'+source,'inicio':0,'fim':len(samples)/rate,'ganho':gain,'emendaSegundos':.12,'picoPCM':.55,'uso':usage})
    samples, rate, channels = read(DEST/'jump-mud.wav')
    # O contato começa após o silêncio inicial; conserva o corpo e a cauda do respingo.
    values = [sum(samples[i:i+channels])/channels/32768 for i in range(round(.18*rate)*channels, round(2.65*rate)*channels, channels)]
    for i in range(len(values)):
        values[i] *= min(1, i/(rate*.005), (len(values)-1-i)/(rate*.16))
    write('mud-impact.wav', values, rate)
    metadata['recortes'].append({'arquivo':'mud-impact.wav','inicio':.18,'fim':2.65,'fadeEntrada':.005,'fadeSaida':.16})
    (DEST/'preparacao.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2)+'\n')
    print('Áudios preparados: impacto e loops específicos das fontes fornecidas para abelhas e besouros; originais preservados.')

if __name__ == '__main__':
    prepare()
