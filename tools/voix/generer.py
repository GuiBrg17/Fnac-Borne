"""
Fabrique les voix de Jeanne : un fichier audio par phrase, publié avec le site.

    ~/.cache/fnac-borne/voix/venv/bin/python tools/voix/generer.py

- Lit tools/voix/phrases.json (node tools/voix/phrases.mjs).
- Ne refait que les phrases nouvelles ou modifiées (assets/voix/manifest.json).
- Contrôle chaque phrase par transcription (Whisper) : si le texte entendu
  s'éloigne du texte voulu (phrase coupée, mot avalé), on recommence.
- Coupe le bruit que le modèle ajoute après le dernier mot (nettoyer).
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
VOIX = "f1b"   # change le nom des fichiers quand on change de voix, pour tout refabriquer
# Réglages du modèle : réglage « B, posé », choisi par le magasin le 17/09/2026
# parmi 4 essais (débit plus naturel que les valeurs par défaut 0.5 / 0.5 / 0.8).
REGLAGES = dict(exaggeration=0.5, cfg_weight=0.3, temperature=0.8)


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


def fin_de_parole(segments, texte):
    """Fin (en secondes) du dernier mot de la phrase voulue, d'après Whisper, et
    le texte entendu jusque-là ; (None, texte entendu) si aucun mot.

    Le modèle continue parfois à parler après la phrase (« …en bas du plan. En
    bas du plan se font même… ») : on s'arrête au mot entendu qui correspond au
    dernier mot voulu, et le reste est coupé.
    """
    entendus = []   # (mot normalisé, fin, mot tel qu'entendu)
    for seg in segments:
        for w in (seg.words or []):
            for m in mots(w.word):
                entendus.append((m, w.end, w.word))
    if not entendus:
        return None, " ".join(seg.text for seg in segments).strip()
    voulus = mots(texte)
    blocs = difflib.SequenceMatcher(None, voulus, [m for m, _, _ in entendus], autojunk=False).get_matching_blocks()
    dernier = None
    for bloc in blocs:
        if bloc.size and bloc.a + bloc.size >= len(voulus) - 3:
            dernier = bloc.b + bloc.size - 1
    if dernier is None:
        dernier = len(entendus) - 1
    garde = []
    for _, _, mot_entendu in entendus[:dernier + 1]:
        if not garde or garde[-1] is not mot_entendu:
            garde.append(mot_entendu)
    return entendus[dernier][1], "".join(garde).strip()


def nettoyer(wav, sr, fin_mot):
    """Coupe le bruit de fin de phrase.

    Le modèle ajoute souvent, après le dernier mot, un bourdonnement qui monte
    presque aussi fort que la voix (entendu à la fin de « Bonjour ! Quel produit
    cherchez-vous ? »). On coupe au premier silence de 100 ms qui suit le dernier
    mot reconnu (ou 350 ms après lui), avec un court fondu.
    """
    y = wav.squeeze(0).numpy()
    if fin_mot is None:
        return wav
    hop = int(sr * 0.01)
    rms = librosa.feature.rms(y=y, frame_length=hop * 2, hop_length=hop)[0]
    db = 20 * np.log10(rms + 1e-6)
    seuil = db.max() - 40
    coupe = int((fin_mot + 0.35) * sr)
    for i in range(int(fin_mot / 0.01), min(len(db) - 10, int((fin_mot + 0.6) / 0.01))):
        if (db[i:i + 10] < seuil).all():
            coupe = i * hop + int(sr * 0.08)
            break
    y = y[:min(len(y), coupe)].copy()
    fondu = min(len(y), int(sr * 0.06))
    y[-fondu:] *= np.linspace(1, 0, fondu)
    return torch.from_numpy(y).unsqueeze(0)


def main():
    phrases = json.loads(PHRASES.read_text())
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    voulues = {(p["lang"], p["text"]) for p in phrases}
    # On garde les anciennes versions tant que la nouvelle n'est pas faite :
    # le site continue de parler pendant la fabrication.
    manifest = {lang: {t: f for t, f in textes.items() if (lang, t) in voulues and (OUT / f).exists()}
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
            wav = tts.generate(texte, language_id=lang, audio_prompt_path=REFERENCES[lang], **REGLAGES).cpu()
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as brut:
                torchaudio.save(brut.name, wav, tts.sr)
                segments, _ = oreille.transcribe(brut.name, language=lang, beam_size=1, word_timestamps=True)
                segments = list(segments)
            fin_mot, entendu = fin_de_parole(segments, texte)
            wav = nettoyer(wav, tts.sr, fin_mot)
            wav = wav / max(wav.abs().max().item(), 1e-6) * 0.89          # crête à -1 dB
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                torchaudio.save(tmp.name, wav, tts.sr)
                score = ressemblance(texte, entendu)
                duree = wav.shape[-1] / tts.sr
                hz = hauteur(wav, tts.sr)
                # Garde-fou : une phrase bien plus longue que son texte a déraillé.
                trop_long = duree > len(texte) * 0.11 + 2.5
                valide = score >= SEUIL and hz >= HAUTEUR_MIN and not trop_long
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
    # Fichiers des anciennes voix, remplacés : on les supprime.
    gardes = {f for textes in manifest.values() for f in textes.values()}
    for ancien in OUT.glob("*/*.m4a"):
        if f"{ancien.parent.name}/{ancien.name}" not in gardes:
            ancien.unlink()
    faibles = [l for l in rapport if l.startswith("[À ÉCOUTER]")]
    print(f"\nTerminé : {len(rapport)} phrases, {len(faibles)} à écouter (voir tools/voix/controle.txt)", flush=True)


if __name__ == "__main__":
    main()
