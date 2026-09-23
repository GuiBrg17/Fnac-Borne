"""
Détoure une photo produit (fond uni) et l'enregistre en PNG transparent.

    ~/.cache/fnac-borne/voix/venv/bin/python tools/images/detourer.py photo.jpg assets/news/produit.png

Installation (une fois), dans l'environnement déjà créé pour les voix :

    "$(python3 -m site --user-base)/bin/uv" pip install \
        --python ~/.cache/fnac-borne/voix/venv/bin/python "rembg[cpu]" pillow

Le modèle « u2net » (téléchargé au premier lancement, 176 Mo) sépare le produit
du fond même quand les deux sont noirs, ce qu'un simple seuil de couleur ne sait
pas faire : c'est le cas des photos officielles d'iPhone sur fond noir.

Les visuels des marques (Apple, éditeurs de jeux…) restent leur propriété :
ils s'utilisent pour annoncer les produits vendus en magasin.
"""
import sys
from pathlib import Path
from PIL import Image
from rembg import remove, new_session

if len(sys.argv) < 3:
    print(__doc__)
    raise SystemExit(1)

src, dst = Path(sys.argv[1]), Path(sys.argv[2])
largeur = int(sys.argv[3]) if len(sys.argv) > 3 else 1100

image = Image.open(src)
detoure = remove(image, session=new_session("u2net"), alpha_matting=True,
                 alpha_matting_foreground_threshold=250, alpha_matting_background_threshold=15)
detoure = detoure.crop(detoure.getbbox())      # plus de marge vide autour du produit
detoure.thumbnail((largeur, largeur), Image.LANCZOS)
dst.parent.mkdir(parents=True, exist_ok=True)
detoure.save(dst, optimize=True)
print(f"{dst} — {detoure.size[0]}×{detoure.size[1]}")
