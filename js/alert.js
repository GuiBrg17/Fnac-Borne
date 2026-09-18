// =====================================================================
// « Appeler un vendeur » : alerte envoyée sur le téléphone des vendeurs.
//
// Pour l'instant par ntfy (ntfy.sh, application gratuite, sans compte) :
// les vendeurs s'abonnent dans l'application à un nom de canal secret,
// réglé sur la borne (5 touches sur le logo). Ce nom n'est jamais dans le
// code du site : quelqu'un qui le connaîtrait pourrait envoyer des alertes.
// Plus tard, un canal Teams (Workflows) pourra remplacer ntfy.
// =====================================================================
const NTFY = "https://ntfy.sh/";

// Nom de canal accepté par ntfy : lettres, chiffres, tirets, 6 à 64 caractères.
export const isTopic = (value) => /^[A-Za-z0-9_-]{6,64}$/.test(String(value).trim());

// Envoie l'alerte. Renvoie true si ntfy l'a reçue, false sinon (pas de canal,
// pas d'internet…) : Jeanne ne dit alors jamais qu'un vendeur a été prévenu.
export async function sendVendorAlert(topic, { zone = null, floor = null, test = false } = {}) {
  if (!isTopic(topic)) return false;
  const heure = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const lieu = zone ? `rayon ${zone}${floor === "-1" ? " (sous-sol)" : floor === "0" ? " (étage 0)" : ""}` : "à la borne, à l'entrée";
  const message = test
    ? `Test de la borne Jeanne (${heure}) : les alertes arrivent bien.`
    : `Un client demande un vendeur : ${lieu}. (${heure})`;
  // Titre, priorité et icône passés dans l'adresse : pas d'en-têtes spéciaux,
  // donc pas de requête préalable du navigateur.
  const params = new URLSearchParams({
    title: test ? "Borne Jeanne : test" : "Borne Jeanne : un client attend",
    priority: test ? "default" : "high",
    tags: test ? "white_check_mark" : "raising_hand"
  });
  try {
    const response = await fetch(`${NTFY}${encodeURIComponent(topic.trim())}?${params}`, {
      method: "POST",
      body: message
    });
    return response.ok;
  } catch {
    return false;
  }
}
