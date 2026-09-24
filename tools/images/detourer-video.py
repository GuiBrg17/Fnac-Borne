"""
Détoure le fond d'une vidéo : la personne reste, le décor devient transparent.

    ~/.cache/fnac-borne/voix/venv/bin/python tools/images/detourer-video.py entree.webm sortie.webm

Sert aux clips en langue des signes : la signante se pose alors sur le jaune
de la borne, sans la salle qu'il y avait derrière elle.

Sortie en WebM VP9 avec transparence (yuva420p), lu par Chrome et Edge.
Installation (une fois), dans l'environnement des voix :

    "$(python3 -m site --user-base)/bin/uv" pip install \
        --python ~/.cache/fnac-borne/voix/venv/bin/python "rembg[cpu]" pillow imageio-ffmpeg
"""
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image
from rembg import new_session, remove

if len(sys.argv) < 3:
    print(__doc__)
    raise SystemExit(1)

src, dst = Path(sys.argv[1]), Path(sys.argv[2])
LARGEUR = int(sys.argv[3]) if len(sys.argv) > 3 else 720   # hauteur de sortie
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

lecteur = imageio_ffmpeg.read_frames(str(src))
meta = lecteur.__next__()
w, h = meta["size"]
fps = meta["fps"]
echelle = LARGEUR / h
taille = (int(w * echelle) // 2 * 2, int(h * echelle) // 2 * 2)

session = new_session("u2net_human_seg")   # modèle spécialisé « personne »
sortie = subprocess.Popen(
    [ffmpeg, "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{taille[0]}x{taille[1]}",
     "-r", str(fps), "-i", "-", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p",
     "-b:v", "0", "-crf", "34", "-an", str(dst)],
    stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

n = 0
for brut in lecteur:
    image = Image.frombuffer("RGB", (w, h), brut, "raw", "RGB", 0, 1).resize(taille, Image.LANCZOS)
    detoure = remove(image, session=session).convert("RGBA")
    sortie.stdin.write(np.asarray(detoure).tobytes())
    n += 1
    if n % 20 == 0:
        print(f"  {n} images", flush=True)
sortie.stdin.close()
sortie.wait()
print(f"{dst} — {n} images, {taille[0]}×{taille[1]}, {dst.stat().st_size // 1024} Ko")
