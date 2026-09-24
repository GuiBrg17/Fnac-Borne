"""
QR code « itinéraire à pied vers la Fnac Variétés », affiché sur sa fiche.
    ~/.cache/fnac-borne/voix/venv/bin/python tools/qr/itineraire.py
Le lien ouvre Google Maps (application ou navigateur, Android comme iPhone),
avec la position du client comme départ.
"""
from pathlib import Path
from urllib.parse import quote

import segno

ROOT = Path(__file__).resolve().parents[2]
# Lien court = QR moins dense, plus facile à scanner sur l'écran de la borne.
# Le magasin vient d'être renommé : on vise l'adresse, pas le nom, que
# Google Maps ne connaît pas encore forcément.
DESTINATION = "9 allees du President Roosevelt, 31000 Toulouse"
URL = f"https://www.google.com/maps/dir/?api=1&destination={quote(DESTINATION)}&travelmode=walking"

qr = segno.make(URL, error="m")
qr.save(ROOT / "assets/qr-itineraire-varietes.svg", border=2, dark="#121212", light="#ffffff", xmldecl=False, svgns=True, omitsize=True)
print(f"QR version {qr.version}, {qr.symbol_size()[0]} modules → {URL}")
