"""
Un QR code par rayon : il ouvre le plan du magasin sur le téléphone du client,
avec le rayon déjà mis en évidence. Affiché sur la borne quand on touche
« Emporter le plan sur mon téléphone ».

    ~/.cache/fnac-borne/voix/venv/bin/python tools/qr/plans.py

L'adresse est écrite en dur dans le QR : si le site déménage, relancer cet outil.
Pas de langue dans l'adresse — la page suit celle du téléphone, ce qui évite
d'avoir trois QR par rayon.
"""
import json
import shutil
from pathlib import Path

import segno

ROOT = Path(__file__).resolve().parents[2]
BASE = "https://borne-jeanne.pages.dev/plan.html"
SORTIE = ROOT / "assets/qr-plan"

rayons = json.loads((ROOT / "assets/rayons.json").read_text(encoding="utf-8"))["rayons"]
shutil.rmtree(SORTIE, ignore_errors=True)
SORTIE.mkdir(parents=True)

total = 0
for id_rayon in sorted(rayons):
    url = f"{BASE}?r={id_rayon}"
    qr = segno.make(url, error="m")
    fichier = SORTIE / f"{id_rayon}.svg"
    qr.save(fichier, border=2, dark="#121212", light="#ffffff", xmldecl=False, svgns=True, omitsize=True)
    total += fichier.stat().st_size

print(f"{len(rayons)} QR codes dans {SORTIE.relative_to(ROOT)} ({total / 1024:.0f} Ko au total)")
