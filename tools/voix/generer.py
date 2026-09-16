"""
Fabrique les voix de Jeanne : un fichier audio par phrase, publié avec le site.

    ~/.cache/fnac-borne/voix/venv/bin/python tools/voix/generer.py

- Lit tools/voix/phrases.json (node tools/voix/phrases.mjs).
- Ne refait que les phrases nouvelles ou modifiées (assets/voix/manifest.json).
- Contrôle chaque phrase par transcription (Whisper) : si le texte entendu
  s'éloigne du texte voulu (phrase coupée, mot avalé), on recommence.
"""
import difflib, hashlib, json, re, subprocess, sys, tempfile, time, unicodedata
from pathlib import Path

import torch, torchaudio
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[2]
PHRASES = ROOT / "tools/voix/phrases.json"
OUT = ROOT / "assets/voix"
MANIFEST = OUT / "manifest.json"
REPORT = ROOT / "tools/voix/controle.txt"
TRIES = 3
SEUIL = 0.80


def mots(texte):
    texte = unicodedata.normalize("NFD", texte.lower())
    texte = "".join(c for c in texte if unicodedata.category(c) != "Mn")
    return re.findall(r"[a-z0-9]+", texte)


def ressemblance(voulu, entendu):
    return difflib.SequenceMatcher(None, mots(voulu), mots(entendu)).ratio()


def nom(lang, texte):
    return f"{lang}/{hashlib.sha1(f'{lang}|{texte}'.encode()).hexdigest()[:12]}.m4a"


def main():
    phrases = json.loads(PHRASES.read_text())
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    a_faire = [p for p in phrases if manifest.get(p["lang"], {}).get(p["text"]) != nom(p["lang"], p["text"])
               or not (OUT / nom(p["lang"], p["text"])).exists()]
    print(f"{len(phrases)} phrases, {len(a_faire)} à fabriquer", flush=True)
    if not a_faire:
        return

    device = "mps" if torch.backends.mps.is_available() else "cpu"
    tts = ChatterboxMultilingualTTS.from_pretrained(device=device)
    oreille = WhisperModel("small", device="cpu", compute_type="int8")
    rapport = []

    for n, p in enumerate(a_faire, 1):
        lang, texte, fichier = p["lang"], p["text"], nom(p["lang"], p["text"])
        meilleur = None
        for essai in range(1, TRIES + 1):
            torch.manual_seed(1000 + essai)
            wav = tts.generate(texte, language_id=lang).cpu()
            wav = wav / max(wav.abs().max().item(), 1e-6) * 0.89          # crête à -1 dB
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                torchaudio.save(tmp.name, wav, tts.sr)
                segments, _ = oreille.transcribe(tmp.name, language=lang, beam_size=1)
                entendu = " ".join(s.text for s in segments).strip()
                score = ressemblance(texte, entendu)
                duree = wav.shape[-1] / tts.sr
                if meilleur is None or score > meilleur[0]:
                    meilleur = (score, tmp.name, entendu, duree, essai)
            if score >= SEUIL:
                break
        score, wav_path, entendu, duree, essai = meilleur
        cible = OUT / fichier
        cible.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "64000", wav_path, str(cible)], check=True)
        manifest.setdefault(lang, {})[texte] = fichier
        MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1))
        etat = "OK " if score >= SEUIL else "À ÉCOUTER"
        ligne = f"[{etat}] {lang} {score:.2f} {duree:4.1f}s essai {essai} | {texte}\n      entendu : {entendu}"
        rapport.append(ligne)
        print(f"{n}/{len(a_faire)} {ligne}", flush=True)

    REPORT.write_text("\n".join(rapport) + "\n")
    faibles = [l for l in rapport if l.startswith("[À ÉCOUTER]")]
    print(f"\nTerminé : {len(rapport)} phrases, {len(faibles)} à écouter (voir tools/voix/controle.txt)", flush=True)


if __name__ == "__main__":
    main()
