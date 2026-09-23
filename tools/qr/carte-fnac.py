"""
QR code « en savoir plus sur la carte Fnac+ », affiché dans la fenêtre de la
borne : le client lit le détail des avantages sur son téléphone.

    ~/.cache/fnac-borne/voix/venv/bin/python tools/qr/carte-fnac.py
"""
from pathlib import Path

import segno

ROOT = Path(__file__).resolve().parents[2]
URL = "https://www.fnac.com/choisir-carte"

qr = segno.make(URL, error="m")
qr.save(ROOT / "assets/qr-carte-fnac.svg", border=2, dark="#121212", light="#ffffff", xmldecl=False, svgns=True, omitsize=True)
print(f"QR version {qr.version}, {qr.symbol_size()[0]} modules → {URL}")
