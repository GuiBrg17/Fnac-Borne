// =====================================================================
// Rapport des statistiques : fichier Excel à télécharger, ou envoi par e-mail.
//
// Un site web ne peut pas envoyer d'e-mail tout seul : l'envoi passe par
// FormSubmit (formsubmit.co), un relais gratuit et sans compte, choisi par
// le magasin le 17/09/2026. La toute première fois, FormSubmit envoie à
// l'adresse un e-mail « Activate form » : cliquer sur le lien, puis renvoyer.
// L'adresse est enregistrée seulement sur la borne, jamais dans le code du site.
// =====================================================================
const RELAY = "https://formsubmit.co/ajax/";

const longDate = (date) => date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const top = (obj, n) => Object.entries(obj || {}).sort((a, b) => b[1] - a[1]).slice(0, n);
const lines = (rows) => (rows.length ? rows.map(([label, count]) => `${label} : ${count}`).join("\n") : "(aucun)");

// Période d'un envoi mensuel : les 31 jours qui précèdent le jour d'envoi.
// Envoi prévu le 5 octobre → du 4 septembre au 4 octobre inclus.
export function monthlyPeriod(sendDate) {
  const to = new Date(sendDate.getFullYear(), sendDate.getMonth(), sendDate.getDate() - 1);
  const from = new Date(to.getFullYear(), to.getMonth(), to.getDate() - 30);
  return { from, to };
}

// stats : compteurs de la période ; zoneLabel(id) : nom du rayon en français.
export function buildReport(stats, { from, to }, zoneLabel) {
  const n = (obj, key) => (obj && obj[key]) || 0;
  const period = `du ${longDate(from)} au ${longDate(to)}`;
  const yes = n(stats.feedback, "yes");
  const no = n(stats.feedback, "no");
  const answers = yes + no;
  const zones = top(stats.byZone, 25).map(([id, count]) => [zoneLabel(id), count]);
  const misses = top(stats.misses, 40);
  const unhappy = top(stats.unhappy, 40);

  const summary = {
    "Période": period,
    "Visites": stats.sessions,
    "Questions": stats.questions,
    "Langues": `français ${n(stats.byLang, "fr")} · anglais ${n(stats.byLang, "en")} · espagnol ${n(stats.byLang, "es")}`,
    "Questions posées par": `micro ${n(stats.bySource, "voice")} · clavier ${n(stats.bySource, "text")} · recherches fréquentes ${n(stats.bySource, "chip")} · plan ${n(stats.bySource, "map")}`,
    "Sondage de fin de visite": answers
      ? `${Math.round((yes / answers) * 100)} % satisfaits (${yes} ont trouvé, ${no} n'ont pas trouvé)`
      : "aucune réponse"
  };

  // Tableau pour Excel : points-virgules et BOM, pour que les accents s'affichent.
  const cell = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = [
    ["Statistiques de la borne Jeanne, Fnac Jeanne d'Arc"],
    ...Object.entries(summary),
    [],
    ["Rayons les plus demandés", "Nombre"], ...zones,
    [],
    ["Questions sans réponse (mots-clés à ajouter)", "Nombre"], ...misses,
    [],
    ["Clients qui n'ont pas trouvé : leur dernière demande", "Nombre"], ...unhappy
  ].map((row) => row.map(cell).join(";")).join("\r\n");

  // Date locale (toISOString passerait à l'heure UTC et décalerait d'un jour).
  const stamp = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return {
    subject: `Borne Jeanne : statistiques ${period}`,
    filename: `statistiques-borne-jeanne-${stamp(from)}-au-${stamp(to)}.csv`,
    csv: "﻿" + csv,
    fields: {
      ...summary,
      "Rayons les plus demandés": lines(zones),
      "Questions sans réponse": lines(misses),
      "Pas trouvé : dernière demande": lines(unhappy)
    }
  };
}

export function downloadReport(report) {
  const url = URL.createObjectURL(new Blob([report.csv], { type: "text/csv;charset=utf-8" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: report.filename });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

// Envoie le rapport : le tableau dans le texte de l'e-mail, et le fichier en pièce jointe.
// Renvoie "sent", ou "activation" (première fois : lien à cliquer dans l'e-mail) ; lance une erreur sinon.
export async function emailReport(report, address) {
  const form = new FormData();
  for (const [key, value] of Object.entries(report.fields)) form.append(key, String(value));
  form.append("_subject", report.subject);
  form.append("_template", "table");
  form.append("_captcha", "false");
  form.append("attachment", new Blob([report.csv], { type: "text/csv" }), report.filename);
  const response = await fetch(RELAY + encodeURIComponent(address.trim()), {
    method: "POST",
    headers: { Accept: "application/json" },
    body: form
  });
  const data = await response.json().catch(() => ({}));
  const message = String(data.message || "");
  if (/activat|confirm/i.test(message)) return "activation";
  if (!response.ok || String(data.success) === "false") throw new Error(message || `erreur ${response.status}`);
  return "sent";
}
