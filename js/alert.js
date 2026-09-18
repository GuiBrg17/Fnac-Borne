// =====================================================================
// « Appeler un vendeur » : alerte envoyée sur le téléphone des vendeurs.
//
// Par ntfy (ntfy.sh, application gratuite, sans compte) et/ou par e-mail :
// les vendeurs s'abonnent dans l'application à un nom de canal secret,
// réglé sur la borne (5 touches sur le logo). Ce nom n'est jamais dans le
// code du site : quelqu'un qui le connaîtrait pourrait envoyer des alertes.
// Plus tard, un canal Teams (Workflows) pourra remplacer ntfy.
// =====================================================================
const NTFY = "https://ntfy.sh/";
// E-mail (Outlook) : même relais gratuit que les statistiques mensuelles
// (FormSubmit). Première fois : cliquer sur le lien « Activate form » reçu.
const RELAY = "https://formsubmit.co/ajax/";

// Adresses séparées par des virgules ou des espaces ; seules les valides sont gardées.
export const emailList = (value) =>
  String(value || "").split(/[\s,;]+/).map((a) => a.trim()).filter((a) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a));

const describe = ({ zone, floor }) =>
  zone ? `rayon ${zone}${floor === "-1" ? " (sous-sol)" : floor === "0" ? " (étage 0)" : ""}` : "à la borne, à l'entrée";
const hour = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

// Envoie l'alerte par e-mail à la première adresse, les autres en copie.
// Renvoie "sent", "activation" (lien à cliquer la première fois) ou "failed".
export async function sendVendorEmail(addresses, { zone = null, floor = null, test = false } = {}) {
  const [to, ...cc] = emailList(addresses);
  if (!to) return "failed";
  const form = new FormData();
  form.append("Message", test
    ? `Test de la borne Jeanne (${hour()}) : les alertes par e-mail arrivent bien.`
    : `Un client demande un vendeur : ${describe({ zone, floor })}.`);
  form.append("Heure", hour());
  form.append("_subject", test ? "Borne Jeanne : test des alertes" : `Borne Jeanne : un client attend (${zone || "entrée"})`);
  form.append("_template", "table");
  form.append("_captcha", "false");
  if (cc.length) form.append("_cc", cc.join(","));
  try {
    const response = await fetch(RELAY + encodeURIComponent(to), { method: "POST", headers: { Accept: "application/json" }, body: form });
    const data = await response.json().catch(() => ({}));
    if (/activat|confirm/i.test(String(data.message || ""))) return "activation";
    return response.ok && String(data.success) !== "false" ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

// Nom de canal accepté par ntfy : lettres, chiffres, tirets, 6 à 64 caractères.
export const isTopic = (value) => /^[A-Za-z0-9_-]{6,64}$/.test(String(value).trim());

// Envoie l'alerte. Renvoie true si ntfy l'a reçue, false sinon (pas de canal,
// pas d'internet…) : Jeanne ne dit alors jamais qu'un vendeur a été prévenu.
export async function sendVendorAlert(topic, { zone = null, floor = null, test = false } = {}) {
  if (!isTopic(topic)) return false;
  const heure = hour();
  const lieu = describe({ zone, floor });
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
