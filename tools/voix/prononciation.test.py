"""Contrôle la prononciation des sigles et des marques dans les voix.

    ~/.cache/fnac-borne/voix/venv/bin/python tools/voix/prononciation.test.py

Réécoute chaque phrase qui contient un sigle (USB, HDMI, TV…) ou une marque
(Apple, Android, Dyson…) et dit si le mot est reconnu, dans le fichier publié
et dans celui du dernier commit : une colonne « avant » plus haute que la
colonne « après » signale une régression.

Whisper est amorcé avec la liste des marques, sinon son propre français
réécrit « Sony » en « sonne » même quand la voix est juste.

Ce test ne remplace pas l'oreille : il repère les mots avalés ou lus comme
un mot au lieu d'être épelés, pas les nuances d'accent."""
import json, re, subprocess, tempfile, unicodedata
from pathlib import Path
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "assets/voix"
MAN = json.loads((OUT / "manifest.json").read_text())
MOTS = r"\b(BD|CDs?|DVDs?|HDMI|PC|TV|USB|VR|AA|LEGO|Apple|Android|Dyson|Sony|Hue|Nespresso|Samsung|Garmin|Philips|Windows|Watch)\b"
AMORCE = {
    "fr": "Sony, Philips Hue, Nespresso, Dyson, Apple Watch, Android, Samsung, Garmin.",
    "en": "Sony, Philips Hue, Nespresso, Dyson, Apple Watch, Android, Samsung, Garmin.",
    "es": "Sony, Philips Hue, Nespresso, Dyson, Apple Watch, Android, Samsung, Garmin.",
}

def cle(t):
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.findall(r"[a-z0-9]+", t)

m = WhisperModel("small", device="cpu", compute_type="int8")
tmp = Path(tempfile.mkdtemp())
bilan = []
for lang in ("fr", "en", "es"):
    for texte, rel in MAN[lang].items():
        cibles = sorted({x.group(0) for x in re.finditer(MOTS, texte)})
        if not cibles:
            continue
        lignes = {}
        for nom, chemin in (("avant", None), ("après", OUT / rel)):
            if chemin is None:
                git = subprocess.run(["git", "show", f"HEAD:assets/voix/{rel}"], cwd=ROOT, capture_output=True)
                if git.returncode:
                    continue
                chemin = tmp / Path(rel).name
                chemin.write_bytes(git.stdout)
            segs, _ = m.transcribe(str(chemin), language=lang, beam_size=5,
                                   initial_prompt=AMORCE[lang])
            lignes[nom] = " ".join(s.text.strip() for s in segs)
        # un mot est « entendu » si on le retrouve dans la transcription
        for mot in cibles:
            k = cle(mot)[0]
            etat = {}
            for nom, txt in lignes.items():
                mots = cle(txt)
                etat[nom] = k in mots or k in "".join(mots)
            bilan.append((lang, mot, etat.get("avant"), etat.get("après"), texte))

vus = {}
for lang, mot, av, ap, texte in bilan:
    c = vus.setdefault((lang, mot), [0, 0, 0])
    c[0] += 1
    c[1] += 1 if av else 0
    c[2] += 1 if ap else 0
print(f"{'langue':7}{'mot':11}{'avant':>10}{'après':>10}")
for (lang, mot), (n, av, ap) in sorted(vus.items()):
    fleche = "  corrigé" if ap > av else ("  ⚠ perdu" if ap < av else "")
    print(f"{lang:7}{mot:11}{f'{av}/{n}':>10}{f'{ap}/{n}':>10}{fleche}")
