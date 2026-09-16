"""
Fabrique les voix de Jeanne : un fichier audio par phrase, publié avec le site.

    ~/.cache/fnac-borne/voix/venv/bin/python tools/voix/generer.py

- Lit tools/voix/phrases.json (node tools/voix/phrases.mjs).
- Ne refait que les phrases nouvelles ou modifiées (assets/voix/manifest.json).
- Contrôle chaque phrase par transcription (Whisper) : si le texte entendu
  s'éloigne du texte voulu (phrase coupée, mot avalé), on recommence.
- Voix féminine uniquement : chaque langue imite une voix de femme de
  référence, et une phrase trop grave (hauteur médiane < 170 Hz) est refaite.
"""
import difflib, hashlib, json, os, re, subprocess, sys, tempfile, time, unicodedata
from pathlib import Path

import librosa
import numpy as np
import torch, torchaudio
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[2]
PHRASES = Path(os.environ.get("PHRASES", ROOT / "tools/voix/phrases.json"))
OUT = Path(os.environ.get("SORTIE", ROOT / "assets/voix"))
MANIFEST = OUT / "manifest.json"
REPORT = OUT / "controle.txt" if "SORTIE" in os.environ else ROOT / "tools/voix/controle.txt"
TRIES = 4
SEUIL = 0.80
HAUTEUR_MIN = 170   # Hz : en dessous, la voix peut sonner masculine

# Voix de femme à imiter, par langue (voix de démonstration de Resemble AI,
# téléchargées par tools/voix/installer.sh). Pour une mise en magasin, les
# remplacer par l'enregistrement d'une personne qui a donné son accord.
REFERENCES = {lang: os.path.expanduser(f"~/.cache/fnac-borne/voix/references/{lang}_f1.flac") for lang in ("fr", "en", "es")}
VOIX = "f1"   # change le nom des fichiers quand on change de voix, pour tout refabriquer


def mots(texte):
    texte = unicodedata.normalize("NFD", texte.lower())
    texte = "".join(c for c in texte if unicodedata.category(c) != "Mn")
    return re.findall(r"[a-z0-9]+", texte)


def ressemblance(voulu, entendu):
    return difflib.SequenceMatcher(None, mots(voulu), mots(entendu)).ratio()


def nom(lang, texte):
    return f"{lang}/{hashlib.sha1(f'{lang}|{VOIX}|{texte}'.encode()).hexdigest()[:12]}.m4a"


def hauteur(wav, sr):
    y = librosa.resample(wav.squeeze(0).numpy(), orig_sr=sr, target_sr=16000)
    f0, voisee, _ = librosa.pyin(y, fmin=60, fmax=400, sr=16000)
    f0 = f0[voisee & ~np.isnan(f0)]
    return float(np.median(f0)) if len(f0) else 0.0


def main():
    phrases = json.loads(PHRASES.read_text())
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    voulues = {(p["lang"], p["text"]) for p in phrases}
    manifest = {lang: {t: f for t, f in textes.items() if (lang, t) in voulues and f == nom(lang, t)}
                for lang, textes in manifest.items()}
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
            wav = tts.generate(texte, language_id=lang, audio_prompt_path=REFERENCES[lang]).cpu()
            wav = wav / max(wav.abs().max().item(), 1e-6) * 0.89          # crête à -1 dB
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                torchaudio.save(tmp.name, wav, tts.sr)
                segments, _ = oreille.transcribe(tmp.name, language=lang, beam_size=1)
                entendu = " ".join(s.text for s in segments).strip()
                score = ressemblance(texte, entendu)
                duree = wav.shape[-1] / tts.sr
                hz = hauteur(wav, tts.sr)
                valide = score >= SEUIL and hz >= HAUTEUR_MIN
                # le meilleur essai : d'abord un essai valide, puis le texte le plus fidèle
                cle = (valide, hz >= HAUTEUR_MIN, score)
                if meilleur is None or cle > meilleur[0]:
                    meilleur = (cle, tmp.name, entendu, duree, essai, score, hz)
            if valide:
                break
        (valide, _, _), wav_path, entendu, duree, essai, score, hz = meilleur
        cible = OUT / fichier
        cible.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "64000", wav_path, str(cible)], check=True)
        manifest.setdefault(lang, {})[texte] = fichier
        MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1))
        etat = "OK " if valide else "À ÉCOUTER"
        ligne = f"[{etat}] {lang} {score:.2f} {hz:3.0f}Hz {duree:4.1f}s essai {essai} | {texte}\n      entendu : {entendu}"
        rapport.append(ligne)
        print(f"{n}/{len(a_faire)} {ligne}", flush=True)

    REPORT.write_text("\n".join(rapport) + "\n")
    faibles = [l for l in rapport if l.startswith("[À ÉCOUTER]")]
    print(f"\nTerminé : {len(rapport)} phrases, {len(faibles)} à écouter (voir tools/voix/controle.txt)", flush=True)


if __name__ == "__main__":
    main()
