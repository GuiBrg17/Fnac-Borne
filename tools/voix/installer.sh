#!/bin/sh
# =====================================================================
# Installe, une seule fois, l'outil qui fabrique les voix de Jeanne
# (Chatterbox Multilingual, Resemble AI, licence MIT).
# Tout va dans ~/.cache/fnac-borne/voix : rien n'est installé dans le système
# et rien de lourd n'entre dans le dépôt. Environ 4 Go.
# Usage : sh tools/voix/installer.sh
# =====================================================================
set -e
DIR="$HOME/.cache/fnac-borne/voix"
mkdir -p "$DIR"

echo "1/4 uv (gestionnaire Python)…"
python3 -m pip install --user --quiet --disable-pip-version-check uv
UV="$(python3 -m site --user-base)/bin/uv"

echo "2/4 Python 3.11 isolé…"
"$UV" venv --python 3.11 "$DIR/venv"

echo "3/4 Chatterbox et PyTorch…"
# setuptools : le filigrane audio (resemble-perth) importe encore pkg_resources.
# faster-whisper : transcription de contrôle des phrases fabriquées.
"$UV" pip install --python "$DIR/venv/bin/python" chatterbox-tts "setuptools<81" faster-whisper

echo "4/4 Téléchargement du modèle multilingue…"
"$DIR/venv/bin/python" - <<'PY'
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
ChatterboxMultilingualTTS.from_pretrained(device="cpu")
print("modèle prêt")
PY
echo "Installation terminée."
