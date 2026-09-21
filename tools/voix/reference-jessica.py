"""
Fabrique la voix modèle française de Jeanne : « Jessica », lue par Piper.

    ~/.cache/fnac-borne/voix/venv/bin/python tools/voix/reference-jessica.py

Chatterbox (tools/voix/generer.py) imite ensuite ce timbre pour toutes les
phrases françaises : le magasin l'a choisi le 21/09/2026 parmi plusieurs
essais (essai « D »), la voix de démonstration d'origine paraissant robotique.

Licence : modèle Piper fr_FR-upmc-medium, locutrice « jessica », données
UPMC (https://github.com/marytts/upmc-pierre-data), CC-BY-SA 4.0.
"""
import os, wave
from huggingface_hub import hf_hub_download
from piper import PiperVoice, SynthesisConfig

SORTIE = os.path.expanduser("~/.cache/fnac-borne/voix/references/fr_jessica.wav")
TEXTE = ("Bonjour et bienvenue à la Fnac ! Je suis ravie de vous accueillir. Vous cherchez un téléphone, "
         "un casque ou une console ? Dites-le-moi simplement, et je vous montre le bon rayon sur le plan. "
         "Si vous avez besoin d'un vendeur, je peux aussi le prévenir tout de suite.")

modele = hf_hub_download("rhasspy/piper-voices", "fr/fr_FR/upmc/medium/fr_FR-upmc-medium.onnx")
hf_hub_download("rhasspy/piper-voices", "fr/fr_FR/upmc/medium/fr_FR-upmc-medium.onnx.json")
voix = PiperVoice.load(modele)
os.makedirs(os.path.dirname(SORTIE), exist_ok=True)
with wave.open(SORTIE, "wb") as w:
    voix.synthesize_wav(TEXTE, w, syn_config=SynthesisConfig(speaker_id=0, length_scale=1.05, noise_scale=0.6))
print("Voix modèle écrite :", SORTIE)
