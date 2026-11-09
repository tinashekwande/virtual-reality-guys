# Makes the narration clips with the free Kokoro voice (Apache-2.0), voice "af_heart".
# Setup: pip install kokoro-onnx soundfile; download kokoro-v1.0.int8.onnx and voices-v1.0.bin from
# https://github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0) into this folder (not committed).
# Then: node tools/narration-lines.mjs > tools/lines.json
#       python3 tools/tts-kokoro.py full af_heart solar-system public/audio/solar-system
#       python3 tools/tts-kokoro.py full af_heart kelp-forest public/audio/kelp-forest
import json, re, sys, os, subprocess
import soundfile as sf
from kokoro_onnx import Kokoro
D = os.path.dirname(os.path.abspath(__file__))
k = Kokoro(os.path.join(D, 'kokoro-v1.0.int8.onnx'), os.path.join(D, 'voices-v1.0.bin'))

def clean(t):
    t = re.sub(r'(\d) (\d{3})', r'\1,\2', t)          # 5 500 -> 5,500
    t = t.replace('°C', ' degrees Celsius')
    t = t.replace('1/', '1 out of ')
    t = t.replace('...', ', ')
    t = t.replace('"', '').replace("'My Octopus Teacher'", 'My Octopus Teacher')
    return t

def say(text, voice, out_mp3, speed=0.92):
    samples, sr = k.create(clean(text), voice=voice, speed=speed, lang='en-us' if voice[0] == 'a' else 'en-gb')
    wav = out_mp3[:-4] + '.wav'
    sf.write(wav, samples, sr)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-af', 'adelay=250|250,apad=pad_dur=0.3,loudnorm=I=-16:TP=-1.5', '-ac', '1', '-b:a', '64k', out_mp3], check=True)
    os.remove(wav)

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'samples':
        line = "Welcome, space explorer! Today we will visit the Sun and all eight planets. Point at a button and squeeze the trigger to choose it."
        for v in sys.argv[2].split(','):
            say(line, v, os.path.join(D, f'sample-{v}.mp3'))
            print('sample', v)
    else:
        voice, exp, outdir = sys.argv[2], sys.argv[3], sys.argv[4]
        lines = json.load(open(os.path.join(D, 'lines.json')))[exp]
        os.makedirs(outdir, exist_ok=True)
        for key, text in lines:
            say(text, voice, os.path.join(outdir, key + '.mp3'))
        json.dump([k2 for k2, _ in lines], open(os.path.join(outdir, 'clips.json'), 'w'))
        print(exp, len(lines), 'clips')
