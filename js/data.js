// =====================================================================
// Contenus de la borne : textes de l'interface (FR / EN / ES) et rayons.
// Les rayons suivent le plan réel du magasin (étage 0 et niveau -1).
// Pour ajouter un mot-clé, complétez la liste "keywords" du rayon voulu.
// Les accents, majuscules, pluriels simples et petites fautes sont gérés
// automatiquement (voir js/search.js).
// =====================================================================

export const LANGS = {
  fr: { speech: "fr-FR", name: "Français" },
  en: { speech: "en-GB", name: "English" },
  es: { speech: "es-ES", name: "Español" }
};

const FLOOR_NAMES = {
  fr: { "0": "l'étage 0", "-1": "le sous-sol" },
  en: { "0": "floor 0", "-1": "the basement" },
  es: { "0": "la planta 0", "-1": "el sótano" }
};

export const UI = {
  fr: {
    idleHello: "Bonjour !",
    idleTitle: "Je suis Jeanne, votre guide à la Fnac Jeanne d'Arc.",
    idleSub: "Dites-moi ce que vous cherchez, je vous montre le rayon.",
    // Trait d'union et espaces insécables (U+2011, U+202F) : la bulle est
    // étroite, sans eux la ligne se coupait sur « puis-je » et le « ? »
    // partait seul à la ligne.
    idleBubble: "Bienvenue ! En quoi puis‑je vous aider ?",
    idleCta: "Touchez l'écran pour commencer",
    greeting: "Bonjour et bienvenue à la Fnac Jeanne d'Arc ! Dites-moi ce que vous cherchez, je vous montre le rayon sur le plan.",
    switched: "Très bien, je continue en français. Que cherchez-vous ?",
    statusReady: "Posez votre question",
    statusListening: "Je vous écoute…",
    statusSpeaking: "Jeanne vous répond",
    micIdle: "Appuyez pour parler",
    micListening: "Je vous écoute… touchez pour arrêter",
    placeholder: "Ou écrivez ici : casque, PS5, iPhone…",
    send: "Envoyer",
    suggestionsTitle: "Recherches fréquentes",
    vendor: "Appeler un vendeur",
    accessibility: "Accessibilité",
    end: "Terminer",
    mapTitle: "Plan du magasin",
    floor0: "Étage 0",
    floorM1: "Sous-sol",
    youAreHere: "Vous êtes ici",
    stepEntrance: "Entrée",
    stepStairs: "Escalier",
    routeHint: "Touchez un rayon du plan pour savoir ce qu'on y trouve.",
    found: (zone, floor) => floor === "-1"
      ? `Le rayon ${zone} est au sous-sol. Prenez l'escalier vers le sous-sol, puis suivez le plan.`
      : `Le rayon ${zone} est ici, à l'étage 0. Je vous l'indique sur le plan.`,
    // Caisses, SAV, adhésion : ce ne sont pas des rayons. Le sujet et le verbe
    // viennent de la zone (propriété « intro »).
    foundPlace: (sujet, floor) => floor === "-1"
      ? `${sujet} au sous-sol. Prenez l'escalier vers le sous-sol, puis suivez le plan.`
      : `${sujet} ici, à l'étage 0. Je vous l'indique sur le plan.`,
    foundStairs: "Les LEGO, figurines POP et cartes Pokémon sont dans l'escalier qui relie l'étage 0 au sous-sol.",
    foundEntrance: "L'entrée et la sortie sont à l'étage 0, en bas du plan.",
    notFound: "Je n'ai pas trouvé ce produit. Essayez avec un autre mot, ou appelez un vendeur : il viendra vous aider.",
    hello: "Bonjour ! Quel produit cherchez-vous ?",
    thanks: "Avec plaisir ! Bonne visite à la Fnac.",
    human: "Bien sûr. Touchez « Appeler un vendeur » et un membre de l'équipe viendra vous aider.",
    otherStore: "Les livres, BD, manuels scolaires, la papeterie, les CD, vinyles et DVD se trouvent à la Fnac Wilson, 16 allées Franklin-Roosevelt, près de Jean-Jaurès. Ici, à la Fnac Jeanne d'Arc, nous sommes spécialisés dans la technique.",
    otherStoreWhat: "Livres, BD, manuels scolaires, papeterie, CD, vinyles, DVD",
    otherStoreNear: "Près de Jean-Jaurès",
    otherStoreClose: "Retour au plan",
    otherStoreQr: "Itinéraire à pied sur votre téléphone",
    // Ce magasin ne vend pas de livres, mais un vendeur peut les commander.
    orderButton: "Faire commander par un vendeur",
    orderConfirm: "C'est noté : un vendeur arrive pour prendre votre commande. Livres, BD, CD, DVD… tout ce que nous n'avons pas ici peut être commandé.",
    orderToast: "Vendeur prévenu · commande",
    didYouMean: (word) => `Vous voulez dire « ${word} » ? `,
    vendorConfirm: (zone) => zone
      ? `C'est noté : un vendeur du rayon ${zone} a été prévenu.`
      : "C'est noté : un vendeur a été prévenu et arrive.",
    vendorUnavailable: "Je n'ai pas pu prévenir un vendeur. Adressez-vous à un membre de l'équipe dans le magasin, il vous aidera avec plaisir.",
    vendorToast: (zone) => zone ? `Vendeur prévenu · rayon ${zone}` : "Vendeur prévenu",
    micUnsupported: "Le micro n'est pas disponible sur cet appareil. Vous pouvez écrire votre question.",
    micError: "Je n'ai pas bien entendu. Réessayez, ou écrivez votre question.",
    micDenied: "Le micro est bloqué. Autorisez-le dans le navigateur, ou écrivez votre question.",
    idleWarnTitle: "Vous êtes toujours là ?",
    idleWarnBody: (s) => `Retour à l'accueil dans ${s} s.`,
    idleWarnButton: "Je continue",
    choose: "Touchez votre choix, ou dites-le.",
    surveyAsk: "Avant de partir : avez-vous trouvé ce que vous cherchiez ?",
    surveyYes: "Oui",
    surveyNo: "Non",
    surveySkip: "Passer",
    surveyThanksYes: "Merci ! Bonne visite à la Fnac.",
    surveyThanksNo: "Merci de nous l'avoir dit. Un vendeur peut vous aider : touchez « Appeler un vendeur ».",
    a11yOn: "Mode accessibilité : le texte est agrandi et le contraste renforcé. Si vous ne pouvez pas prendre l'escalier, il y a un ascenseur : touchez « Appeler un vendeur », on vous y accompagne.",
    a11yOff: "Affichage normal.",
    floorName: (f) => FLOOR_NAMES.fr[f]
  },
  en: {
    idleHello: "Hello!",
    idleTitle: "I'm Jeanne, your guide at Fnac Jeanne d'Arc.",
    idleSub: "Tell me what you're looking for and I'll show you where it is.",
    idleBubble: "Welcome! How can I help you?",
    idleCta: "Touch the screen to start",
    greeting: "Hello and welcome to Fnac Jeanne d'Arc! Tell me what you're looking for and I'll show you the section on the map.",
    switched: "Sure, let's continue in English. What are you looking for?",
    statusReady: "Ask me anything",
    statusListening: "Listening…",
    statusSpeaking: "Jeanne is answering",
    micIdle: "Tap to talk",
    micListening: "Listening… tap to stop",
    placeholder: "Or type here: headphones, PS5, iPhone…",
    send: "Send",
    suggestionsTitle: "Popular searches",
    vendor: "Call a staff member",
    accessibility: "Accessibility",
    end: "Finish",
    mapTitle: "Store map",
    floor0: "Floor 0",
    floorM1: "Basement",
    youAreHere: "You are here",
    stepEntrance: "Entrance",
    stepStairs: "Stairs",
    routeHint: "Tap a section on the map to see what's there.",
    found: (zone, floor) => floor === "-1"
      ? `${zone} is in the basement. Take the stairs down, then follow the map.`
      : `${zone} is right here on floor 0. I'm showing it on the map.`,
    foundPlace: (sujet, floor) => floor === "-1"
      ? `${sujet} in the basement. Take the stairs down, then follow the map.`
      : `${sujet} here on floor 0. I'll show you on the map.`,
    foundStairs: "LEGO, POP figures and Pokémon cards are in the staircase between floor 0 and the basement.",
    foundEntrance: "The entrance and exit are on floor 0, at the bottom of the map.",
    notFound: "I couldn't find that product. Try another word, or call a staff member who will come and help you.",
    hello: "Hello! What product are you looking for?",
    thanks: "You're welcome! Enjoy your visit to Fnac.",
    human: "Of course. Tap “Call a staff member” and someone from the team will come to help you.",
    otherStore: "Books, comics, school books, stationery, CDs, vinyl records and DVDs are at Fnac Wilson, 16 allées Franklin-Roosevelt, near Jean-Jaurès. Here at Fnac Jeanne d'Arc, we specialise in technology.",
    otherStoreWhat: "Books, comics, school books, stationery, CDs, vinyl, DVDs",
    otherStoreNear: "Near Jean-Jaurès",
    otherStoreClose: "Back to the map",
    otherStoreQr: "Walking directions on your phone",
    orderButton: "Ask a staff member to order it",
    orderConfirm: "Done: a member of staff is coming to take your order. Books, comics, CDs, DVDs — anything we don't stock here can be ordered.",
    orderToast: "Staff notified · order",
    didYouMean: (word) => `Did you mean “${word}”? `,
    vendorConfirm: (zone) => zone
      ? `Done: a staff member from ${zone} has been notified.`
      : "Done: a staff member has been notified and is on their way.",
    vendorUnavailable: "I couldn't reach a staff member. Please ask any member of the team in the store, they'll be happy to help.",
    vendorToast: (zone) => zone ? `Staff notified · ${zone}` : "Staff notified",
    micUnsupported: "The microphone isn't available on this device. You can type your question.",
    micError: "I didn't quite catch that. Try again, or type your question.",
    micDenied: "The microphone is blocked. Allow it in the browser, or type your question.",
    idleWarnTitle: "Are you still there?",
    idleWarnBody: (s) => `Back to the welcome screen in ${s} s.`,
    idleWarnButton: "I'm still here",
    choose: "Tap your choice, or say it.",
    surveyAsk: "Before you go: did you find what you were looking for?",
    surveyYes: "Yes",
    surveyNo: "No",
    surveySkip: "Skip",
    surveyThanksYes: "Thank you! Enjoy your visit.",
    surveyThanksNo: "Thank you for telling us. A member of staff can help: tap “Call a staff member”.",
    a11yOn: "Accessibility mode: larger text and stronger contrast. If you can't use the stairs, there is a lift: tap “Call a staff member” and we'll take you there.",
    a11yOff: "Standard display.",
    floorName: (f) => FLOOR_NAMES.en[f]
  },
  es: {
    idleHello: "¡Hola!",
    idleTitle: "Soy Jeanne, su guía en la Fnac Jeanne d'Arc.",
    idleSub: "Dígame qué busca y le muestro dónde está.",
    idleBubble: "¡Bienvenido! ¿En qué puedo ayudarle?",
    idleCta: "Toque la pantalla para empezar",
    greeting: "¡Hola y bienvenido a la Fnac Jeanne d'Arc! Dígame qué busca y le muestro la sección en el plano.",
    switched: "Muy bien, seguimos en español. ¿Qué busca?",
    statusReady: "Hágame una pregunta",
    statusListening: "Le escucho…",
    statusSpeaking: "Jeanne le responde",
    micIdle: "Toque para hablar",
    micListening: "Le escucho… toque para parar",
    placeholder: "O escriba aquí: auriculares, PS5, iPhone…",
    send: "Enviar",
    suggestionsTitle: "Búsquedas frecuentes",
    vendor: "Llamar a un vendedor",
    accessibility: "Accesibilidad",
    end: "Terminar",
    mapTitle: "Plano de la tienda",
    floor0: "Planta 0",
    floorM1: "Sótano",
    youAreHere: "Usted está aquí",
    stepEntrance: "Entrada",
    stepStairs: "Escalera",
    routeHint: "Toque una sección del plano para ver qué hay.",
    found: (zone, floor) => floor === "-1"
      ? `La sección ${zone} está en el sótano. Baje por la escalera y siga el plano.`
      : `La sección ${zone} está aquí, en la planta 0. Se la indico en el plano.`,
    foundPlace: (sujet, floor) => floor === "-1"
      ? `${sujet} en el sótano. Baje por la escalera al sótano y siga el plano.`
      : `${sujet} aquí, en la planta 0. Se lo indico en el plano.`,
    foundStairs: "Los LEGO, las figuras POP y las cartas Pokémon están en la escalera que une la planta 0 con el sótano.",
    foundEntrance: "La entrada y la salida están en la planta 0, abajo en el plano.",
    notFound: "No he encontrado ese producto. Pruebe con otra palabra, o llame a un vendedor: vendrá a ayudarle.",
    hello: "¡Hola! ¿Qué producto busca?",
    thanks: "¡Con mucho gusto! Disfrute de su visita a la Fnac.",
    human: "Por supuesto. Toque «Llamar a un vendedor» y alguien del equipo vendrá a ayudarle.",
    otherStore: "Los libros, cómics, libros de texto, la papelería, los CD, vinilos y DVD están en la Fnac Wilson, 16 allées Franklin-Roosevelt, cerca de Jean-Jaurès. Aquí, en la Fnac Jeanne d'Arc, estamos especializados en tecnología.",
    otherStoreWhat: "Libros, cómics, libros de texto, papelería, CD, vinilos, DVD",
    otherStoreNear: "Cerca de Jean-Jaurès",
    otherStoreClose: "Volver al plano",
    otherStoreQr: "Ruta a pie en su móvil",
    orderButton: "Pedir a un vendedor que lo encargue",
    orderConfirm: "Anotado: un vendedor viene a tomar su pedido. Libros, cómics, CD, DVD… todo lo que no tenemos aquí se puede encargar.",
    orderToast: "Vendedor avisado · pedido",
    didYouMean: (word) => `¿Quiere decir «${word}»? `,
    vendorConfirm: (zone) => zone
      ? `Hecho: se ha avisado a un vendedor de la sección ${zone}.`
      : "Hecho: se ha avisado a un vendedor y ya viene.",
    vendorUnavailable: "No he podido avisar a un vendedor. Diríjase a cualquier miembro del equipo en la tienda, le ayudará con gusto.",
    vendorToast: (zone) => zone ? `Vendedor avisado · ${zone}` : "Vendedor avisado",
    micUnsupported: "El micrófono no está disponible en este dispositivo. Puede escribir su pregunta.",
    micError: "No le he entendido bien. Inténtelo de nuevo o escriba su pregunta.",
    micDenied: "El micrófono está bloqueado. Permítalo en el navegador o escriba su pregunta.",
    idleWarnTitle: "¿Sigue ahí?",
    idleWarnBody: (s) => `Volvemos a la pantalla de inicio en ${s} s.`,
    idleWarnButton: "Sigo aquí",
    choose: "Toque su opción o dígala.",
    surveyAsk: "Antes de irse: ¿ha encontrado lo que buscaba?",
    surveyYes: "Sí",
    surveyNo: "No",
    surveySkip: "Omitir",
    surveyThanksYes: "¡Gracias! Disfrute de su visita.",
    surveyThanksNo: "Gracias por decírnoslo. Un vendedor puede ayudarle: toque «Llamar a un vendedor».",
    a11yOn: "Modo accesibilidad: texto más grande y más contraste. Si no puede usar la escalera, hay un ascensor: toque «Llamar a un vendedor» y le acompañaremos.",
    a11yOff: "Vista normal.",
    floorName: (f) => FLOOR_NAMES.es[f]
  }
};

// =====================================================================
// Rayons du magasin.
// "floors" : étage(s) où le rayon apparaît sur le plan.
// "icon" : identifiant d'une icône de index.html (<symbol id="i-...">).
// "boost" : priorité quand plusieurs rayons correspondent.
// =====================================================================
export const ZONES = {
  // ---------------- Étage 0 ----------------
  telephonie: {
    floors: ["0"], icon: "smartphone",
    label: { fr: "Téléphonie Android", en: "Android phones", es: "Telefonía Android" },
    short: { fr: "Téléphonie", en: "Phones", es: "Telefonía" },
    detail: { fr: "Écouteurs filaires, chargeurs…", en: "Wired earphones, chargers…", es: "Auriculares con cable, cargadores…" },
    spots: ["T1", "T2", "T3", "T4", "T5", "T6"],
    keywords: {
      fr: ["téléphone", "téléphone portable", "portable", "mobile", "smartphone", "téléphone android", "android",
           "téléphone samsung", "samsung", "galaxy", "samsung galaxy", "galaxy s24", "galaxy s25", "galaxy a16",
           "galaxy a56", "galaxy z flip", "galaxy z fold", "xiaomi", "redmi", "poco", "google pixel", "pixel", "oppo",
           "honor", "motorola", "nokia", "oneplus", "realme", "wiko", "crosscall", "alcatel", "fairphone",
           "sony xperia", "xperia", "téléphone pas cher", "téléphone reconditionné", "smartphone reconditionné",
           "reconditionné", "téléphone senior", "téléphone à clapet", "téléphone fixe", "chargeur",
           "chargeur téléphone", "chargeur secteur", "chargeur rapide", "chargeur sans fil", "chargeur à induction",
           "chargeur voiture", "bloc secteur", "adaptateur secteur", "câble de charge", "câble usb c", "usb c",
           "câble micro usb", "micro usb", "batterie externe", "batterie de secours", "powerbank", "power bank",
           "écouteur filaire", "écouteurs filaires", "écouteurs jack", "kit mains libres", "oreillette",
           "oreillette bluetooth", "coque", "coque téléphone", "coque samsung", "coque xiaomi", "étui téléphone",
           "housse téléphone", "verre trempé", "protection écran", "protège écran", "film protecteur", "carte sim",
           "sim", "carte prépayée", "forfait", "forfait mobile", "abonnement mobile", "recharge téléphonique", "sfr",
           "orange", "bouygues", "free mobile", "porte téléphone",
           "perche à selfie", "anneau téléphone", "popsocket", "reprise téléphone", "rachat téléphone",
           "téléphone enfant"],
      en: ["phone", "mobile phone", "mobile", "cell phone", "cellphone", "smartphone", "android", "android phone",
           "samsung", "samsung phone", "galaxy", "samsung galaxy", "galaxy s24", "galaxy s25", "galaxy z flip",
           "galaxy z fold", "xiaomi", "redmi", "poco", "google pixel", "pixel", "oppo", "honor", "motorola", "nokia",
           "oneplus", "realme", "fairphone", "sony xperia", "xperia", "cheap phone", "refurbished phone",
           "refurbished", "basic phone", "flip phone", "landline", "charger", "phone charger", "wall charger",
           "fast charger", "wireless charger", "car charger", "power adapter", "charging cable", "usb c cable",
           "usb c", "micro usb cable", "micro usb", "power bank", "portable battery", "battery pack",
           "wired earphone", "wired earphones", "jack earphones", "hands free kit", "earpiece", "bluetooth earpiece",
           "phone case", "case", "samsung case", "phone cover", "phone pouch", "tempered glass", "screen protector",
           "screen film", "sim card", "sim", "prepaid card", "mobile plan", "phone plan", "top up", "phone holder",
           "selfie stick", "phone ring", "popsocket", "phone trade in", "kids phone"],
      es: ["teléfono", "teléfono móvil", "móvil", "celular", "smartphone", "android", "teléfono android", "samsung",
           "teléfono samsung", "galaxy", "samsung galaxy", "galaxy s24", "galaxy s25", "xiaomi", "redmi", "poco",
           "google pixel", "pixel", "oppo", "honor", "motorola", "nokia", "oneplus", "realme", "fairphone",
           "sony xperia", "xperia", "móvil barato", "móvil reacondicionado", "reacondicionado",
           "teléfono para mayores", "teléfono fijo", "cargador", "cargador de móvil", "cargador de red",
           "cargador rápido", "cargador inalámbrico", "cargador de coche", "adaptador de corriente", "cable de carga",
           "cable usb c", "usb c", "cable micro usb", "micro usb", "batería externa", "power bank", "powerbank",
           "auricular con cable", "auriculares con cable", "auriculares jack", "manos libres", "auricular bluetooth",
           "funda", "funda móvil", "funda samsung", "carcasa", "cristal templado", "protector de pantalla",
           "lámina protectora", "tarjeta sim", "sim", "tarjeta prepago", "tarifa móvil", "recarga", "soporte móvil",
           "palo selfie", "anillo para móvil", "popsocket", "móvil para niños"]
    }
  },
  objets: {
    floors: ["0"], icon: "watch",
    label: { fr: "Objets connectés", en: "Connected devices", es: "Objetos conectados" },
    short: { fr: "Objets\nconnectés", en: "Connected\ndevices", es: "Objetos\nconectados" },
    detail: { fr: "Montres, maison connectée…", en: "Watches, smart home…", es: "Relojes, hogar conectado…" },
    spots: ["O1", "O2", "O3"],
    keywords: {
      fr: ["objet connecté", "objets connectés", "montre connectée", "montres connectées", "montre", "smartwatch",
           "montre gps", "montre de sport", "montre cardio", "cardiofréquencemètre", "bracelet connecté",
           "bracelet d'activité", "tracker d'activité", "podomètre", "garmin", "fitbit", "montre polar", "suunto",
           "withings", "amazfit", "huawei watch", "galaxy watch", "samsung watch", "xiaomi band", "bague connectée",
           "balance connectée", "tensiomètre", "thermomètre connecté", "oxymètre", "maison connectée", "domotique",
           "ampoule connectée", "ampoule intelligente", "philips hue", "prise connectée", "prise intelligente",
           "interrupteur connecté", "thermostat", "thermostat connecté", "netatmo", "station météo",
           "caméra de surveillance", "caméra intérieure", "caméra extérieure", "caméra ip", "babyphone",
           "écoute bébé", "sonnette connectée", "sonnette vidéo", "ring", "nest", "google nest", "alarme",
           "alarme maison", "détecteur de fumée", "détecteur de mouvement", "serrure connectée", "verrou connecté",
           "assistant vocal", "alexa", "amazon echo", "echo dot", "google home", "enceinte connectée", "traceur gps",
           "tracker bluetooth", "porte-clés connecté", "robot tondeuse", "arrosage connecté", "volet connecté",
           "collier connecté", "gourde connectée", "reveil connecté"],
      en: ["connected device", "smart device", "smart watch", "smartwatch", "watch", "gps watch", "sports watch",
           "heart rate monitor", "fitness tracker", "activity tracker", "step counter", "garmin", "fitbit", "polar",
           "suunto", "withings", "amazfit", "huawei watch", "galaxy watch", "samsung watch", "xiaomi band",
           "smart ring", "smart scale", "blood pressure monitor", "smart thermometer", "smart home",
           "home automation", "smart bulb", "philips hue", "smart plug", "smart switch", "thermostat",
           "smart thermostat", "netatmo", "weather station", "security camera", "indoor camera", "outdoor camera",
           "ip camera", "baby monitor", "video doorbell", "doorbell", "ring", "nest", "google nest", "alarm",
           "home alarm", "smoke detector", "motion sensor", "smart lock", "voice assistant", "alexa", "amazon echo",
           "echo dot", "google home", "smart speaker", "gps tracker", "bluetooth tracker", "robot mower",
           "smart sprinkler", "smart blinds"],
      es: ["objeto conectado", "dispositivo inteligente", "reloj conectado", "reloj inteligente", "reloj",
           "smartwatch", "reloj gps", "reloj deportivo", "pulsómetro", "pulsera de actividad", "podómetro", "garmin",
           "fitbit", "reloj polar", "suunto", "withings", "amazfit", "huawei watch", "galaxy watch", "samsung watch",
           "xiaomi band", "anillo inteligente", "báscula conectada", "tensiómetro", "termómetro conectado",
           "hogar conectado", "domótica", "bombilla inteligente", "philips hue", "enchufe inteligente",
           "interruptor inteligente", "termostato", "termostato inteligente", "netatmo", "estación meteorológica",
           "cámara de vigilancia", "cámara interior", "cámara exterior", "cámara ip", "vigilabebés",
           "timbre inteligente", "timbre con cámara", "ring", "nest", "google nest", "alarma", "alarma para casa",
           "detector de humo", "detector de movimiento", "cerradura inteligente", "asistente de voz", "alexa",
           "amazon echo", "echo dot", "google home", "altavoz inteligente", "localizador gps", "rastreador bluetooth",
           "robot cortacésped"]
    }
  },
  escalier: {
    floors: ["0","-1"], icon: "stairs",
    label: { fr: "Escalier · LEGO, POP & Pokémon", en: "Stairs · LEGO, POP & Pokémon", es: "Escalera · LEGO, POP y Pokémon" },
    short: { fr: "Escalier", en: "Stairs", es: "Escalera" },
    detail: { fr: "", en: "", es: "" },
    spots: ["L1"],
    keywords: {
      fr: ["lego", "lego technic", "lego star wars", "lego city", "lego friends", "lego harry potter", "lego icons",
           "briques lego", "jeu de construction", "figurine", "figurines", "figurine pop", "figurines pop", "funko",
           "funko pop", "bobblehead", "goodies", "figurine manga", "figurine anime", "objet de collection", "pokemon",
           "carte pokemon", "cartes pokemon", "booster", "booster pokemon", "display pokemon", "coffret pokemon",
           "elite trainer box", "carte à collectionner", "cartes à collectionner", "cartes magic",
           "magic the gathering", "yu-gi-oh", "one piece card game", "classeur à cartes", "protège cartes",
           "escalier", "escaliers", "sous-sol", "descendre", "en bas", "étage du dessous"],
      en: ["lego", "lego technic", "lego star wars", "lego city", "lego friends", "lego harry potter", "lego icons",
           "lego bricks", "building set", "figure", "figurine", "pop figure", "pop figures", "funko", "funko pop",
           "bobblehead", "collectible", "collectibles", "anime figure", "manga figure", "pokemon", "pokemon card",
           "pokemon cards", "booster", "pokemon booster", "pokemon box", "elite trainer box", "trading card",
           "trading cards", "magic cards", "magic the gathering", "yu-gi-oh", "one piece card game", "card binder",
           "card sleeves", "stairs", "staircase", "downstairs", "basement", "lower floor"],
      es: ["lego", "lego technic", "lego star wars", "lego city", "lego friends", "lego harry potter", "lego icons",
           "piezas lego", "juego de construcción", "figura", "figuras", "figura pop", "figuras pop", "funko",
           "funko pop", "cabezón", "artículo de colección", "figura manga", "figura anime", "pokemon",
           "carta pokemon", "cartas pokemon", "sobre pokemon", "sobre de cartas", "caja pokemon", "elite trainer box",
           "carta coleccionable", "cartas coleccionables", "cartas magic", "magic the gathering", "yu-gi-oh",
           "one piece card game", "archivador de cartas", "fundas para cartas", "escalera", "escaleras", "sótano",
           "abajo", "planta de abajo"]
    }
  },
  // Ascenseur PMR : pas un rayon, mais il s'allume sur le plan quand on le demande
  // (questions « ascenseur », « fauteuil roulant »… : INFO.elevator plus bas).
  ascenseur: {
    floors: ["0", "-1"], icon: "access",
    label: { fr: "Ascenseur", en: "Lift", es: "Ascensor" },
    detail: { fr: "", en: "", es: "" },
    spots: ["ASC"],
    keywords: { fr: [], en: [], es: [] }
  },
  entree: {
    floors: ["0"], icon: "door",
    label: { fr: "Entrée / Sortie", en: "Entrance / Exit", es: "Entrada / Salida" },
    detail: { fr: "", en: "", es: "" },
    spots: ["ENTREE"],
    keywords: {
      fr: ["entrée", "sortie", "porte", "porte d'entrée", "sortie de secours", "je veux sortir", "où sortir",
           "comment sortir", "par où entrer"],
      en: ["entrance", "exit", "way out", "door", "front door", "emergency exit", "how to get out", "where to exit"],
      es: ["entrada", "salida", "puerta", "puerta de entrada", "salida de emergencia", "cómo salir", "por dónde salir"]
    }
  },

  // ---------------- Sous-sol ----------------
  // "spots" : meubles du plan (js/plan.js) occupés par le rayon.
  // "places" : emplacements précis dans le rayon, avec leurs propres mots-clés
  //            (« aspirateur balai » n'allume que sa gondole).
  // "short"  : nom affiché sur le plan quand le vrai nom est trop long (\n = retour à la ligne).
  gaming: {
    floors: ["-1"], icon: "gamepad",
    label: { fr: "Jeux vidéo", en: "Video games", es: "Videojuegos" },
    detail: { fr: "Consoles et jeux", en: "Consoles and games", es: "Consolas y juegos" },
    spots: ["M4"],
    keywords: {
      fr: ["jeu vidéo", "jeux vidéo", "jeux", "rayon jeux", "console", "consoles", "console de jeux",
           "console de salon", "console portable", "playstation", "play station", "playstation 5", "ps5", "ps5 pro",
           "ps4", "ps3", "xbox", "xbox series x", "xbox series s", "xbox series", "xbox série", "xbox série x",
           "xbox série s", "xbox one", "nintendo", "nintendo switch", "switch", "switch 2", "switch oled",
           "switch lite", "steam deck", "manette", "manettes", "manette ps5", "manette xbox", "manette switch",
           "manette pro", "joy-con", "dualsense", "dualshock", "jeu ps5", "jeu ps4", "jeu xbox", "jeu switch",
           "jeu nintendo", "jeu pc", "jeu pokemon", "jeu d'occasion", "jeu de course", "jeu de foot", "jeu de tir",
           "jeu vidéo enfant", "precommande jeu", "carte psn", "carte xbox", "carte nintendo", "carte cadeau jeu",
           "abonnement game pass", "game pass", "playstation plus", "ps plus", "nintendo switch online", "fifa",
           "ea sports fc", "call of duty", "cod", "gta", "gta 6", "zelda", "mario", "mario kart", "pokemon jeu",
           "minecraft", "fortnite", "les sims", "assassin's creed", "elden ring", "wolverine", "spider-man",
           "hogwarts legacy", "f1", "nba 2k", "just dance", "casque vr", "réalité virtuelle", "meta quest", "psvr",
           "volant de course", "volant gaming", "station de charge manette", "housse switch", "carte mémoire switch",
           "stockage console", "kit nettoyage console"],
      en: ["video game", "video games", "game", "console", "consoles", "games console", "handheld console",
           "playstation", "play station", "playstation 5", "ps5", "ps5 pro", "ps4", "ps3", "xbox", "xbox series x",
           "xbox series s", "xbox one", "nintendo", "nintendo switch", "switch", "switch 2", "switch oled",
           "switch lite", "steam deck", "controller", "controllers", "ps5 controller", "xbox controller",
           "switch controller", "pro controller", "joy-con", "dualsense", "ps5 game", "xbox game", "switch game",
           "pc game", "pokemon game", "used game", "second hand game", "racing game", "football game",
           "kids video game", "psn card", "xbox card", "nintendo card", "game gift card", "game pass",
           "playstation plus", "nintendo switch online", "fifa", "ea sports fc", "call of duty", "gta", "zelda",
           "mario", "mario kart", "minecraft", "fortnite", "the sims", "assassins creed", "elden ring", "wolverine",
           "spider-man", "hogwarts legacy", "vr headset", "virtual reality", "meta quest", "psvr", "racing wheel",
           "charging dock", "switch case", "switch memory card"],
      es: ["videojuego", "videojuegos", "consola", "consolas", "consola portátil", "playstation", "play station",
           "playstation 5", "ps5", "ps5 pro", "ps4", "ps3", "xbox", "xbox series x", "xbox series s", "xbox one",
           "nintendo", "nintendo switch", "switch", "switch 2", "switch oled", "switch lite", "steam deck", "mando",
           "mandos", "mando ps5", "mando xbox", "mando switch", "mando pro", "joy-con", "dualsense", "juego ps5",
           "juego xbox", "juego switch", "juego pc", "juego pokemon", "juego de segunda mano", "juego de carreras",
           "juego de fútbol", "juego para niños", "tarjeta psn", "tarjeta xbox", "tarjeta nintendo", "game pass",
           "playstation plus", "nintendo switch online", "fifa", "ea sports fc", "call of duty", "gta", "zelda",
           "mario", "mario kart", "minecraft", "fortnite", "los sims", "assassins creed", "elden ring", "wolverine",
           "spider-man", "gafas vr", "realidad virtual", "meta quest", "psvr", "volante de carreras", "base de carga",
           "funda switch", "tarjeta de memoria switch"]
    }
  },
  accessoiresGaming: {
    floors: ["-1"], icon: "monitor",
    label: { fr: "PC gamer & accessoires", en: "Gaming PCs & accessories", es: "PC gaming y accesorios" },
    short: { fr: "PC gamer", en: "Gaming PCs", es: "PC gaming" },
    detail: { fr: "Composants, écrans, souris, claviers", en: "Components, monitors, mice, keyboards", es: "Componentes, monitores, ratones, teclados" },
    spots: ["7","8","9","10","11","12","13","14","M5a"],
    keywords: {
      fr: [],
      en: [],
      es: []
    },
    places: {
      pc: {
        label: { fr: "PC gamer, composants & écrans", en: "Gaming PCs, components & monitors", es: "PC gaming, componentes y monitores" },
        spots: ["7","8","9","10","11","12","13","14"],
        keywords: {
          fr: ["pc gamer", "pc gaming", "tour gamer", "unité centrale gamer", "écran gamer", "écran gaming",
               "écran 144 hz", "écran 240 hz", "carte graphique", "rtx", "geforce", "nvidia", "amd", "radeon",
               "carte mère", "processeur", "ram", "mémoire vive", "barrette de ram", "ventirad", "watercooling",
               "refroidissement pc", "boîtier pc", "alimentation pc", "ventilateur pc", "montage pc", "asus rog",
               "écran", "écran pc", "écran d'ordinateur", "moniteur", "écran 24 pouces", "écran 27 pouces",
               "double écran"],
          en: ["gaming pc", "gaming laptop", "gaming tower", "gaming monitor", "144 hz monitor", "240 hz monitor",
               "graphics card", "gpu", "rtx", "geforce", "nvidia", "amd", "radeon", "motherboard", "processor", "cpu",
               "ram", "memory stick", "cooler", "water cooling", "pc case", "power supply", "pc fan", "asus rog",
               "screen", "monitor", "pc monitor", "computer screen", "24 inch monitor", "27 inch monitor",
               "dual screen"],
          es: ["pc gaming", "portátil gaming", "torre gaming", "monitor gaming", "monitor 144 hz", "tarjeta gráfica",
               "rtx", "geforce", "nvidia", "amd", "radeon", "placa base", "procesador", "ram", "memoria ram",
               "refrigeración líquida", "ventilador pc", "caja pc", "fuente de alimentación", "asus rog", "pantalla",
               "monitor", "monitor pc", "pantalla de ordenador", "monitor 24 pulgadas", "monitor 27 pulgadas"]
        }
      },
      accessoires: {
        label: { fr: "Souris, claviers & casques gamer", en: "Gaming mice, keyboards & headsets", es: "Ratones, teclados y auriculares gaming" },
        short: { fr: "Accessoires gamer", en: "Gaming gear", es: "Accesorios gaming" },
        spots: ["M5a"],
        keywords: {
          fr: ["accessoire gaming", "accessoires gaming", "matériel gaming", "setup gaming", "souris",
               "souris gaming", "souris gamer", "souris sans fil", "clavier", "clavier gaming", "clavier gamer",
               "clavier mécanique", "clavier sans fil", "casque gamer", "casque gaming", "micro-casque",
               "tapis de souris", "tapis de souris xxl", "siège gamer", "fauteuil gamer", "chaise gaming",
               "bureau gamer", "razer", "logitech", "steelseries", "corsair", "hyperx", "roccat", "turtle beach",
               "elgato", "stream deck", "carte de capture", "micro streaming", "ruban led", "led gaming",
               "hub usb gaming", "volant pc"],
          en: ["gaming gear", "gaming accessory", "gaming accessories", "gaming setup", "mouse", "mice",
               "gaming mouse", "wireless mouse", "keyboard", "gaming keyboard", "mechanical keyboard",
               "wireless keyboard", "gaming headset", "headset", "mouse pad", "desk mat", "gaming chair",
               "gaming desk", "razer", "logitech", "steelseries", "corsair", "hyperx", "roccat", "turtle beach",
               "elgato", "stream deck", "capture card", "streaming mic", "led strip", "gaming led", "racing wheel pc"],
          es: ["accesorio gaming", "accesorios gaming", "equipo gaming", "setup gaming", "ratón", "ratón gaming",
               "ratón inalámbrico", "teclado", "teclado gaming", "teclado mecánico", "teclado inalámbrico",
               "auriculares gaming", "cascos gaming", "alfombrilla", "alfombrilla xxl", "silla gaming",
               "escritorio gaming", "razer", "logitech", "steelseries", "corsair", "hyperx", "roccat", "turtle beach",
               "elgato", "stream deck", "capturadora", "micrófono streaming", "tira led", "volante pc"]
        }
      }
    }
  },
  cartouches: {
    floors: ["-1"], icon: "printer",
    label: { fr: "Cartouches d'encre", en: "Ink cartridges", es: "Cartuchos de tinta" },
    short: { fr: "Cartouches", en: "Ink", es: "Cartuchos" },
    detail: { fr: "Encre et toner", en: "Ink and toner", es: "Tinta y tóner" },
    spots: ["M5b"],
    keywords: {
      fr: ["cartouche", "cartouches", "cartouche d'encre", "cartouches d'encre", "encre", "encre imprimante",
           "cartouche hp", "cartouche canon", "cartouche epson", "cartouche brother", "toner", "tambour imprimante",
           "kit de recharge encre"],
      en: ["ink", "ink cartridge", "ink cartridges", "cartridge", "cartridges", "hp cartridge", "canon cartridge",
           "epson cartridge", "brother cartridge", "toner", "printer drum"],
      es: ["cartucho", "cartuchos", "cartucho de tinta", "cartuchos de tinta", "tinta", "tinta impresora",
           "cartucho hp", "cartucho canon", "cartucho epson", "cartucho brother", "tóner", "tambor de impresora"]
    }
  },
  electromenager: {
    floors: ["-1"], icon: "plug",
    label: { fr: "Petit électroménager", en: "Home appliances", es: "Pequeños electrodomésticos" },
    short: { fr: "Petit\nélectroménager", en: "Small\nappliances", es: "Pequeño\nelectrodoméstico" },
    detail: { fr: "Aspirateurs, cuisine, soin, Dyson…", en: "Vacuums, kitchen, personal care, Dyson…", es: "Aspiradoras, cocina, cuidado personal, Dyson…" },
    spots: ["E1","E2","E3","E4","E5","E6","E7"],
    keywords: {
      fr: ["électroménager", "petit électroménager", "aspirateur", "aspirateurs", "rowenta", "krups", "magimix",
           "micro-ondes", "mini four", "four posable", "machine à pain", "yaourtière", "sorbetière",
           "machine sous vide", "ventilateur", "brumisateur", "chauffage d'appoint", "radiateur", "climatiseur",
           "climatiseur mobile", "déshumidificateur", "purificateur d'air", "humidificateur",
           "diffuseur d'huiles essentielles", "café moulu", "détartrant"],
      en: ["home appliance", "appliances", "small appliance", "vacuum", "vacuum cleaner", "rowenta", "krups",
           "microwave", "mini oven", "bread maker", "yogurt maker", "ice cream maker", "vacuum sealer", "fan",
           "heater", "air conditioner", "portable air conditioner", "dehumidifier", "air purifier", "humidifier",
           "diffuser", "descaler"],
      es: ["electrodoméstico", "electrodomésticos", "pequeño electrodoméstico", "aspiradora", "aspirador", "rowenta",
           "krups", "microondas", "mini horno", "panificadora", "yogurtera", "heladera", "envasadora al vacío",
           "ventilador", "calefactor", "aire acondicionado", "deshumidificador", "purificador de aire",
           "humidificador", "difusor", "descalcificador"]
    },
    places: {
      sols: {
        label: { fr: "Sols, vapeur & Dyson", en: "Floor care, steam & Dyson", es: "Suelos, vapor y Dyson" },
        spots: ["E1"],
        keywords: {
          fr: ["aspirateur traîneau", "dyson", "nettoyeur vapeur", "balai vapeur", "karcher",
               "nettoyeur haute pression"],
          en: ["dyson", "steam cleaner", "steam mop", "karcher", "pressure washer"],
          es: ["dyson", "limpiador de vapor", "mopa de vapor", "karcher", "hidrolimpiadora"]
        }
      },
      aspirateurs: {
        label: { fr: "Aspirateurs, soin dentaire & épilation", en: "Vacuums, dental care & hair removal", es: "Aspiradores, cuidado dental y depilación" },
        spots: ["E2"],
        keywords: {
          fr: ["aspirateur balai", "aspirateur robot", "aspirateur sans fil", "aspirateur à main", "robot aspirateur",
               "roomba", "irobot", "épilateur", "lumière pulsée", "brosse à dents électrique", "oral b",
               "hydropulseur"],
          en: ["cordless vacuum", "stick vacuum", "robot vacuum", "handheld vacuum", "roomba", "irobot", "epilator",
               "ipl", "electric toothbrush", "oral b", "water flosser"],
          es: ["aspirador escoba", "aspirador sin cable", "robot aspirador", "aspirador de mano", "roomba", "irobot",
               "depiladora", "luz pulsada", "cepillo de dientes eléctrico", "oral b", "irrigador dental"]
        }
      },
      cheveux: {
        label: { fr: "Cheveux, rasoirs & tondeuses", en: "Hair care, shavers & trimmers", es: "Cabello, afeitadoras y cortapelos" },
        spots: ["E3"],
        keywords: {
          fr: ["sèche-cheveux", "lisseur", "lisseur à cheveux", "boucleur", "fer à boucler", "brosse soufflante",
               "airwrap", "babyliss", "remington", "rasoir", "rasoir électrique", "tondeuse", "tondeuse à barbe",
               "tondeuse à cheveux", "braun"],
          en: ["hair dryer", "hair straightener", "straightener", "curler", "hot air brush", "airwrap", "babyliss",
               "remington", "shaver", "electric shaver", "trimmer", "beard trimmer", "hair clipper", "braun"],
          es: ["secador", "secador de pelo", "plancha de pelo", "alisador", "rizador", "cepillo de aire", "airwrap",
               "babyliss", "remington", "afeitadora", "afeitadora eléctrica", "cortapelos", "recortadora de barba",
               "braun"]
        }
      },
      linge: {
        label: { fr: "Linge, petite cuisson & soin du corps", en: "Laundry, small cooking & body care", es: "Plancha, pequeña cocción y cuidado corporal" },
        spots: ["E4"],
        keywords: {
          fr: ["gaufrier", "crêpière", "appareil à raclette", "pierrade", "plancha électrique", "fer à repasser",
               "centrale vapeur", "défroisseur", "barbecue électrique"],
          en: ["curling iron", "waffle maker", "crepe maker", "raclette", "electric grill", "iron", "steam generator",
               "garment steamer"],
          es: ["gofrera", "crepera", "raclette", "plancha de cocina", "plancha", "plancha de ropa",
               "centro de planchado", "vaporizador de ropa"]
        }
      },
      preparation: {
        label: { fr: "Eau, blenders, jus & pèse-personnes", en: "Water, blenders, juicers & scales", es: "Agua, batidoras, zumos y básculas" },
        spots: ["E5"],
        keywords: {
          fr: ["blender", "mixeur", "hachoir", "centrifugeuse", "extracteur de jus", "presse-agrumes", "sodastream",
               "machine à soda", "pèse-personne", "balance connectée cuisine", "balance de cuisine"],
          en: ["blender", "chopper", "juicer", "citrus press", "sodastream", "soda maker", "bathroom scale",
               "kitchen scale"],
          es: ["batidora", "picadora", "licuadora", "exprimidor", "sodastream", "báscula", "báscula de cocina"]
        }
      },
      machinesCafe: {
        label: { fr: "Machines à café", en: "Coffee machines", es: "Cafeteras" },
        spots: ["E6","E7"],
        keywords: {
          fr: ["machine à café", "cafetière", "cafetière filtre"],
          en: ["coffee machine", "coffee maker", "filter coffee"],
          es: ["cafetera", "cafetera de goteo"]
        }
      },
      cafe: {
        label: { fr: "Café automatique & préparation culinaire", en: "Bean-to-cup coffee & food prep", es: "Café automático y preparación" },
        spots: ["E6"],
        keywords: {
          fr: ["machine expresso", "expresso", "delonghi", "moulin à café", "broyeur à café", "cookeo", "companion",
               "robot cuiseur", "robot pâtissier", "robot de cuisine", "kitchenaid", "mixeur plongeant",
               "café en grains"],
          en: ["espresso machine", "espresso", "delonghi", "coffee grinder", "bean to cup", "multicooker",
               "food processor", "stand mixer", "kitchenaid", "hand blender", "coffee beans"],
          es: ["cafetera espresso", "espresso", "delonghi", "molinillo de café", "cafetera superautomática",
               "robot de cocina", "amasadora", "kitchenaid", "batidora de mano", "café en grano"]
        }
      },
      capsules: {
        label: { fr: "Nespresso, bouilloires, grille-pain & airfryers", en: "Nespresso, kettles, toasters & air fryers", es: "Nespresso, hervidores, tostadoras y freidoras de aire" },
        spots: ["E7"],
        keywords: {
          fr: ["nespresso", "senseo", "dolce gusto", "tassimo", "bouilloire", "théière électrique", "airfryer",
               "air fryer", "friteuse", "friteuse sans huile", "ninja", "grille-pain", "toaster", "capsule",
               "capsules", "dosette", "dosettes", "machine à capsules"],
          en: ["nespresso", "senseo", "dolce gusto", "tassimo", "kettle", "electric kettle", "air fryer",
               "deep fryer", "fryer", "ninja", "toaster", "coffee capsule", "capsules", "coffee pods",
               "capsule machine"],
          es: ["nespresso", "senseo", "dolce gusto", "tassimo", "hervidor", "freidora de aire", "freidora", "ninja",
               "tostadora", "cápsula", "cápsulas", "monodosis", "cafetera de cápsulas"]
        }
      }
    }
  },
  informatique: {
    floors: ["-1"], icon: "printer",
    label: { fr: "Connectique", en: "Cables & storage", es: "Conectividad" },
    detail: { fr: "Clés USB, disques durs, réseau", en: "USB sticks, hard drives, networking", es: "Memorias USB, discos duros, redes" },
    spots: ["15","16","17","20"],
    keywords: {
      fr: ["imprimante", "imprimante jet d'encre", "imprimante laser", "imprimante multifonction", "multifonction",
           "imprimante wifi", "scanner", "photocopie", "papier", "ramette de papier", "clé usb", "disque dur",
           "disque dur externe", "ssd", "ssd externe", "nvme", "stockage", "carte micro sd", "lecteur de carte",
           "graveur", "lecteur dvd externe", "câble", "câble hdmi", "hdmi", "displayport", "vga", "câble vga", "rj45",
           "ethernet", "câble ethernet", "câble usb", "rallonge usb", "hub usb", "station d'accueil", "dock usb c",
           "adaptateur", "adaptateur hdmi", "adaptateur usb c", "multiprise", "rallonge électrique", "parasurtenseur",
           "onduleur", "répéteur wifi", "routeur", "box wifi", "cpl", "clé wifi", "antenne wifi", "nettoyant écran",
           "bombe à air sec"],
      en: ["printer", "inkjet printer", "laser printer", "all in one printer", "wifi printer", "scanner", "paper",
           "printer paper", "usb stick", "usb key", "flash drive", "hard drive", "hard disk", "external drive", "ssd",
           "external ssd", "nvme", "storage", "micro sd card", "card reader", "external dvd drive", "cable", "hdmi",
           "hdmi cable", "displayport", "vga", "vga cable", "rj45", "ethernet", "ethernet cable", "usb cable",
           "usb extension", "usb hub", "docking station", "usb c dock", "adapter", "hdmi adapter", "usb c adapter",
           "power strip", "extension cord", "surge protector", "ups", "wifi extender", "router", "wifi box",
           "powerline", "wifi dongle", "screen cleaner", "compressed air"],
      es: ["impresora", "impresora de tinta", "impresora láser", "impresora multifunción", "multifunción",
           "impresora wifi", "escáner", "papel", "papel de impresora", "memoria usb", "pendrive", "disco duro",
           "disco duro externo", "ssd", "ssd externo", "nvme", "almacenamiento", "tarjeta micro sd",
           "lector de tarjetas", "lector dvd externo", "cable", "cable hdmi", "hdmi", "displayport", "vga",
           "cable vga", "rj45", "ethernet", "cable ethernet", "cable usb", "alargador usb", "hub usb",
           "estación de acoplamiento", "dock usb c", "adaptador", "adaptador hdmi", "adaptador usb c", "regleta",
           "alargador", "protector de sobretensión", "sai onduleur", "repetidor wifi", "router", "powerline", "adaptador wifi",
           "limpiador de pantallas", "aire comprimido"]
    }
  },
  tablettes: {
    floors: ["-1"], icon: "tablet",
    label: { fr: "Tablettes Android", en: "Android tablets", es: "Tabletas Android" },
    short: { fr: "Tablettes", en: "Tablets", es: "Tabletas" },
    detail: { fr: "", en: "", es: "" },
    spots: ["18","19"],
    keywords: {
      fr: ["tablette", "tablettes", "tablette android", "tablette samsung", "galaxy tab", "tablette enfant"],
      en: ["tablet", "tablets", "android tablet", "samsung tablet", "galaxy tab", "kids tablet"],
      es: ["tableta", "tablet", "tableta android", "tableta samsung", "galaxy tab", "tablet para niños"]
    }
  },
  liseuses: {
    floors: ["-1"], icon: "book",
    label: { fr: "Liseuses", en: "E-readers", es: "Lectores de libros" },
    detail: { fr: "Kobo", en: "Kobo", es: "Kobo" },
    spots: ["21"],
    keywords: {
      fr: ["liseuse", "kobo", "liseuses", "liseuse kobo", "kobo clara", "kobo libra", "kobo sage", "livre numérique",
           "livre électronique", "ebook", "lecteur ebook", "liseuse numérique"],
      en: ["e-reader", "kobo", "e-readers", "ereader", "ebook reader", "kobo clara", "kobo libra", "kobo sage",
           "ebook", "e-book"],
      es: ["lector de libros", "kobo", "lector de ebooks", "libro electrónico", "ebook", "kobo clara", "kobo libra"]
    }
  },
  pcwindows: {
    floors: ["-1"], icon: "laptop",
    label: { fr: "PC Windows", en: "Windows PCs", es: "PC Windows" },
    detail: { fr: "Portables, PC fixes, sacoches", en: "Laptops, desktops, bags", es: "Portátiles, sobremesa, fundas" },
    spots: ["22","23","24","25","26","27"],
    keywords: {
      fr: ["pc", "pc windows", "informatique", "rayon informatique", "bureautique", "pc portable", "ordinateur",
           "ordinateur portable", "ordi", "portable windows", "pc fixe", "unité centrale", "tour pc", "ordinateur tout-en-un", "pc tout-en-un",
           "laptop", "notebook", "ultrabook", "chromebook", "asus", "hp", "lenovo", "acer", "dell", "msi",
           "huawei matebook", "microsoft surface", "surface pro", "windows", "windows 11", "pack office",
           "microsoft 365", "logiciel", "antivirus", "suite bureautique", "sacoche ordinateur", "housse ordinateur",
           "sac à dos pc", "support ordinateur", "refroidisseur pc", "chargeur ordinateur", "chargeur pc portable",
           "batterie pc portable"],
      en: ["pc", "windows pc", "laptop", "computer", "desktop computer", "desktop pc", "tower pc", "all in one",
           "notebook", "ultrabook", "chromebook", "asus", "hp", "lenovo", "acer", "dell", "msi", "huawei matebook",
           "microsoft surface", "surface pro", "windows", "windows 11", "office suite", "microsoft 365", "software",
           "antivirus", "laptop bag", "laptop sleeve", "laptop backpack", "laptop stand", "cooling pad",
           "laptop charger", "laptop battery"],
      es: ["pc", "pc windows", "portátil", "ordenador", "ordenador portátil", "ordenador de sobremesa", "torre",
           "todo en uno", "notebook", "ultrabook", "chromebook", "asus", "hp", "lenovo", "acer", "dell", "msi",
           "huawei matebook", "microsoft surface", "surface pro", "windows", "windows 11", "microsoft office",
           "microsoft 365", "software", "antivirus", "funda portátil", "mochila portátil", "soporte portátil",
           "base refrigeradora", "cargador portátil", "batería portátil"]
    }
  },
  trottinettes: {
    floors: ["-1"], icon: "scooter",
    label: { fr: "Mobilité urbaine", en: "Urban mobility", es: "Movilidad urbana" },
    detail: { fr: "Trottinettes, casques, figurines POP", en: "Scooters, helmets, POP figures", es: "Patinetes, cascos, figuras POP" },
    spots: ["M1"],
    keywords: {
      fr: ["trottinette", "trottinettes", "trotinette", "trottinette électrique", "trottinette enfant", "ninebot",
           "segway", "xiaomi trottinette", "hoverboard", "gyroroue", "monoroue", "skateboard électrique",
           "vélo électrique", "vélo pliant", "casque trottinette", "casque de trottinette", "casque vélo",
           "protections", "genouillères", "coudières", "antivol", "cadenas vélo", "gonfleur", "pompe à vélo",
           "batterie trottinette", "chargeur trottinette", "mobilité urbaine", "mobilité douce",
           "engin de déplacement", "pièces trottinette", "pneu trottinette"],
      en: ["scooter", "scooters", "electric scooter", "kids scooter", "ninebot", "segway", "xiaomi scooter",
           "hoverboard", "unicycle", "electric unicycle", "electric skateboard", "electric bike", "e-bike",
           "folding bike", "scooter helmet", "bike helmet", "helmet", "knee pads", "elbow pads", "bike lock", "lock",
           "pump", "scooter battery", "scooter charger", "urban mobility", "scooter parts", "scooter tyre"],
      es: ["patinete", "patinetes", "patinete eléctrico", "patinete infantil", "ninebot", "segway", "patinete xiaomi",
           "hoverboard", "monociclo eléctrico", "monopatín eléctrico", "bicicleta eléctrica", "bicicleta plegable",
           "casco patinete", "casco de patinete", "casco de bici", "rodilleras", "coderas", "candado",
           "candado de bici", "bomba de aire", "batería patinete", "cargador patinete", "movilidad urbana",
           "piezas patinete", "rueda patinete"]
    }
  },
  photo: {
    floors: ["-1"], icon: "camera",
    label: { fr: "Photo", en: "Photo", es: "Foto" },
    detail: { fr: "Appareils, drones, micros-cravates", en: "Cameras, drones, lapel mics", es: "Cámaras, drones, micrófonos de corbata" },
    spots: ["M2","M3"],
    keywords: {
      fr: ["photo", "appareil photo", "appareils photo", "appareil photo numérique", "appareil photo jetable",
           "appareil jetable", "reflex", "hybride", "compact", "bridge", "appareil instantané", "polaroid", "instax",
           "fujifilm", "canon", "nikon", "sony alpha", "lumix", "panasonic lumix", "olympus", "pentax", "caméra",
           "caméra sport", "caméra embarquée", "gopro", "go pro", "insta360", "dji", "drone", "drones", "osmo",
           "stabilisateur", "gimbal", "trépied", "monopode", "perche photo", "objectif", "objectifs", "téléobjectif",
           "grand angle", "zoom photo", "filtre photo", "flash", "flash cobra", "éclairage studio", "boîte à lumière",
           "fond vert", "sacoche photo", "sac photo", "carte sd", "carte cf", "batterie appareil photo",
           "chargeur batterie photo", "imprimante photo", "album photo", "cadre photo numérique",
           "scanner de diapositives", "jumelles", "micro", "microphone", "micro cravate", "micro podcast",
           "micro studio", "micro usb-c", "perche micro", "rode", "enregistreur audio", "bonnette anti-vent",
           "mixette", "filmer", "faire des vidéos", "prendre des photos", "photographier", "vlog", "youtubeur",
           "tourner une vidéo", "filmer mes vacances", "matériel vidéo", "matériel photo", "studio photo", "podcast"],
      en: ["photo", "camera", "cameras", "digital camera", "disposable camera", "dslr", "mirrorless",
           "compact camera", "bridge camera", "instant camera", "polaroid", "instax", "fujifilm", "canon", "nikon",
           "sony alpha", "lumix", "olympus", "pentax", "action camera", "gopro", "go pro", "insta360", "dji", "drone",
           "drones", "osmo", "stabilizer", "gimbal", "tripod", "monopod", "lens", "lenses", "telephoto", "wide angle",
           "photo filter", "flash", "studio light", "softbox", "green screen", "camera bag", "sd card", "cf card",
           "camera battery", "battery charger", "photo printer", "digital photo frame", "binoculars",
           "mic", "microphone", "lapel mic", "podcast mic", "studio mic", "boom pole", "rode", "audio recorder",
           "windscreen", "filming", "make videos", "take photos", "vlogging", "youtuber", "shoot video", "video gear",
           "photo gear", "podcast"],
      es: ["foto", "cámara", "cámaras", "cámara de fotos", "cámara digital", "cámara desechable", "réflex",
           "sin espejo", "cámara compacta", "cámara instantánea", "polaroid", "instax", "fujifilm", "canon", "nikon",
           "sony alpha", "lumix", "olympus", "pentax", "cámara deportiva", "gopro", "go pro", "insta360", "dji",
           "dron", "drones", "osmo", "estabilizador", "gimbal", "trípode", "monopié", "objetivo", "objetivos",
           "teleobjetivo", "gran angular", "filtro fotográfico", "flash", "luz de estudio", "ventana de luz", "croma",
           "bolsa para cámara", "tarjeta sd", "tarjeta cf", "batería de cámara", "cargador de batería",
           "impresora fotográfica", "marco digital", "prismáticos", "micro", "micrófono",
           "micrófono de corbata", "micrófono de podcast", "micrófono de estudio", "rode", "grabadora de audio",
           "grabar vídeo", "hacer vídeos", "hacer fotos", "vlog", "youtuber", "equipo de vídeo", "equipo de foto",
           "podcast"]
    }
  },
  tv: {
    floors: ["-1"], icon: "tv",
    label: { fr: "TV", en: "TV", es: "TV" },
    detail: { fr: "Téléviseurs", en: "Televisions", es: "Televisores" },
    spots: ["M6","28","29","30"],
    keywords: {
      fr: ["tv", "télé", "télévision", "téléviseur", "téléviseurs", "smart tv", "tv connectée", "oled", "qled",
           "mini led", "tv 4k", "tv 8k", "4k", "8k", "ultra hd", "55 pouces", "65 pouces", "75 pouces", "petite télé",
           "tv samsung", "tv lg", "tv philips", "tv tcl", "hisense", "sony bravia", "télécommande",
           "télécommande universelle", "support tv", "support mural tv", "pied de tv", "meuble tv", "vidéoprojecteur",
           "projecteur", "écran de projection", "box android tv", "chromecast", "fire tv stick", "décodeur tnt",
           "antenne tv", "câble antenne", "installation tv", "livraison tv", "reprise ancienne tv", "lunettes 3d"],
      en: ["tv", "television", "telly", "smart tv", "oled", "qled", "mini led", "4k tv", "8k tv", "55 inch",
           "65 inch", "75 inch", "small tv", "samsung tv", "lg tv", "philips tv", "tcl tv", "hisense", "sony bravia",
           "remote", "remote control", "universal remote", "tv mount", "wall mount", "tv stand", "tv unit",
           "projector", "video projector", "projection screen", "android tv box", "chromecast", "fire tv stick",
           "tv aerial", "antenna cable", "tv delivery", "tv installation"],
      es: ["tv", "tele", "televisor", "televisores", "televisión", "smart tv", "oled", "qled", "mini led", "tv 4k",
           "tv 8k", "55 pulgadas", "65 pulgadas", "75 pulgadas", "tele pequeña", "tv samsung", "tv lg", "tv philips",
           "tv tcl", "hisense", "sony bravia", "mando a distancia", "mando universal", "soporte tv",
           "soporte de pared", "mueble tv", "proyector", "videoproyector", "pantalla de proyección", "android tv box",
           "chromecast", "fire tv stick", "antena tv", "cable de antena", "instalación tv"]
    }
  },
  audio: {
    floors: ["-1"], icon: "headphones",
    label: { fr: "Son", en: "Sound", es: "Sonido" },
    detail: { fr: "Casques, enceintes, platines", en: "Headphones, speakers, turntables", es: "Auriculares, altavoces, tocadiscos" },
    spots: ["M7","M8","31","32"],
    keywords: {
      fr: ["audio", "casque", "casques", "casque audio", "casque bluetooth", "casque sans fil",
           "casque à réduction de bruit", "réduction de bruit", "casque anti bruit", "anti bruit", "casque filaire",
           "casque studio", "casque enfant", "écouteurs", "écouteurs sans fil", "écouteurs bluetooth",
           "true wireless", "intra-auriculaire", "oreillettes sans fil", "bose", "sony wh", "sennheiser", "beats",
           "marshall", "bang olufsen", "harman kardon", "skullcandy", "anker soundcore", "jbl", "sonos", "devialet",
           "cabasse", "focal", "enceinte", "enceintes", "enceinte bluetooth", "enceinte portable",
           "enceinte waterproof", "mini enceinte", "grosse enceinte", "caisson de basses", "barre de son",
           "home cinéma", "ampli", "amplificateur", "chaîne hifi", "hifi", "platine", "platine vinyle",
           "tourne-disque", "lecteur cd", "lecteur mp3", "baladeur", "dictaphone", "radio", "radio réveil",
           "poste de radio", "dab", "réveil", "embouts casque", "coussinets casque", "support casque", "karaoké",
           "micro karaoké", "table de mixage", "instrument"],
      en: ["audio", "headphone", "headphones", "wireless headphones", "bluetooth headphones", "noise cancelling",
           "noise cancelling headphones", "wired headphones", "studio headphones", "kids headphones", "earphone",
           "earphones", "earbuds", "wireless earbuds", "true wireless", "in ear", "bose", "sony wh", "sennheiser",
           "beats", "marshall", "bang olufsen", "harman kardon", "skullcandy", "anker soundcore", "jbl", "sonos",
           "devialet", "focal", "speaker", "speakers", "bluetooth speaker", "portable speaker", "waterproof speaker",
           "subwoofer", "soundbar", "home cinema", "amplifier", "hifi", "hi-fi system", "turntable", "record player",
           "cd player", "mp3 player", "walkman", "voice recorder", "radio", "clock radio", "dab radio", "alarm clock",
           "ear tips", "ear pads", "headphone stand", "karaoke", "karaoke mic", "mixer"],
      es: ["audio", "auricular", "auriculares", "cascos", "auriculares inalámbricos", "auriculares bluetooth",
           "cancelación de ruido", "auriculares con cancelación de ruido", "auriculares de estudio",
           "auriculares para niños", "auriculares de botón", "true wireless", "bose", "sony wh", "sennheiser",
           "beats", "marshall", "bang olufsen", "harman kardon", "skullcandy", "anker soundcore", "jbl", "sonos",
           "devialet", "focal", "altavoz", "altavoces", "altavoz bluetooth", "altavoz portátil",
           "altavoz resistente al agua", "subwoofer", "barra de sonido", "home cinema", "amplificador", "cadena hifi",
           "hifi", "tocadiscos", "giradiscos", "reproductor de cd", "reproductor mp3", "grabadora de voz", "radio",
           "radio despertador", "dab", "despertador", "almohadillas", "soporte para auriculares", "karaoke",
           "micrófono de karaoke", "mesa de mezclas"]
    },
    places: {
      adaptateurs: {
        label: { fr: "Écouteurs & adaptateurs audio", en: "Earphones & audio adapters", es: "Auriculares y adaptadores de audio" },
        spots: ["M8"],
        keywords: {
          fr: ["adaptateur bluetooth", "récepteur bluetooth", "câble jack", "adaptateur jack", "câble audio",
               "câble optique", "rallonge casque", "adaptateur usb c jack", "adaptateur usb c vers jack",
               "usb c vers jack", "adaptateur jack usb c", "adaptateur audio"],
          en: ["bluetooth adapter", "bluetooth receiver", "jack cable", "jack adapter", "audio cable",
               "optical cable", "usb c to jack", "usb c headphone adapter", "usb c audio adapter", "audio adapter"],
          es: ["adaptador bluetooth", "receptor bluetooth", "cable jack", "adaptador jack", "cable de audio",
               "cable óptico", "adaptador usb c a jack", "adaptador de audio"]
        }
      }
    }
  },
  apple: {
    floors: ["-1"], icon: "apple",
    // Priorité : tout ce qui cite un produit Apple va au rayon Apple.
    boost: 20,
    label: { fr: "Apple", en: "Apple", es: "Apple" },
    detail: { fr: "iPhone, iPad, Mac, accessoires", en: "iPhone, iPad, Mac, accessories", es: "iPhone, iPad, Mac, accesorios" },
    spots: ["33","34"],
    keywords: {
      fr: ["apple", "apple store", "iphone", "i phone", "iphone 15", "iphone 16", "iphone 17", "iphone 18",
           "iphone pro", "iphone pro max", "iphone plus", "iphone reconditionné", "ipad", "i pad", "ipad air",
           "ipad pro", "ipad mini", "ipod", "airpods", "air pods", "airpods pro", "airpods max", "mac", "macbook",
           "mac book", "macbook air", "macbook pro", "imac", "mac mini", "mac studio", "apple watch",
           "apple watch ultra", "apple watch se", "montre apple", "apple pencil", "magic keyboard", "magic mouse",
           "magsafe", "lightning", "airtag", "apple tv", "homepod", "coque iphone", "étui iphone", "housse ipad",
           "coque ipad", "verre trempé iphone", "protection iphone", "chargeur iphone", "chargeur apple",
           "câble lightning", "câble apple", "adaptateur apple", "clavier ipad", "tablette apple", "ordinateur apple",
           "écouteurs apple", "carte cadeau apple", "applecare", "icloud", "app store", "itunes",
           "airpods de remplacement", "embouts airpods", "bracelet apple watch", "dock apple"],
      en: ["apple", "apple store", "iphone", "i phone", "iphone 15", "iphone 16", "iphone 17", "iphone 18",
           "iphone pro", "iphone pro max", "refurbished iphone", "ipad", "i pad", "ipad air", "ipad pro", "ipad mini",
           "ipod", "airpods", "air pods", "airpods pro", "airpods max", "mac", "macbook", "mac book", "macbook air",
           "macbook pro", "imac", "mac mini", "mac studio", "apple watch", "apple watch ultra", "apple pencil",
           "magic keyboard", "magic mouse", "magsafe", "lightning", "airtag", "apple tv", "homepod", "iphone case",
           "iphone cover", "ipad case", "ipad sleeve", "iphone screen protector", "iphone charger", "apple charger",
           "lightning cable", "apple cable", "apple adapter", "ipad keyboard", "apple tablet", "apple laptop",
           "apple earphones", "apple gift card", "applecare", "icloud", "app store", "itunes", "airpods tips",
           "apple watch band"],
      es: ["apple", "apple store", "iphone", "i phone", "iphone 15", "iphone 16", "iphone 17", "iphone 18",
           "iphone pro", "iphone pro max", "iphone reacondicionado", "ipad", "i pad", "ipad air", "ipad pro",
           "ipad mini", "ipod", "airpods", "air pods", "airpods pro", "airpods max", "mac", "macbook", "mac book",
           "macbook air", "macbook pro", "imac", "mac mini", "mac studio", "apple watch", "apple watch ultra",
           "apple pencil", "magic keyboard", "magic mouse", "magsafe", "lightning", "airtag", "apple tv", "homepod",
           "funda iphone", "carcasa iphone", "funda ipad", "protector de pantalla iphone", "cargador iphone",
           "cargador apple", "cable lightning", "cable apple", "adaptador apple", "teclado ipad", "tableta apple",
           "portátil apple", "auriculares apple", "tarjeta regalo apple", "applecare", "icloud", "app store",
           "itunes", "correa apple watch"]
    }
  },
  jeuxSociete: {
    floors: ["-1"], icon: "dice",
    label: { fr: "Jeux de société", en: "Board games", es: "Juegos de mesa" },
    short: { fr: "Jeux de\nsociété", en: "Board\ngames", es: "Juegos\nde mesa" },
    detail: { fr: "", en: "", es: "" },
    spots: ["37","38"],
    keywords: {
      fr: ["jeu de société", "jeux de société", "jeu de plateau", "jeux de plateau", "puzzle", "puzzles",
           "puzzle 1000 pièces", "puzzle 3d", "jeu de cartes", "jeux de cartes", "cartes à jouer", "uno", "monopoly",
           "cluedo", "risk", "trivial pursuit", "scrabble", "times up", "loup-garou", "dixit", "catan",
           "colons de catane", "7 wonders", "azul", "carcassonne", "dobble", "jungle speed", "mille bornes",
           "petits chevaux", "escape game", "jeu de rôle", "donjons et dragons", "dés", "dé", "jeu de dés", "échecs",
           "jeu d'échecs", "dames", "backgammon", "tarot", "belote", "jeu d'ambiance", "jeu de soirée",
           "jeu coopératif", "jeu familial", "jeu pour enfant", "jeu éducatif", "jeu d'apéro", "rubik's cube",
           "maquette", "jeu en bois", "jouet"],
      en: ["board game", "board games", "tabletop game", "puzzle", "puzzles", "1000 piece puzzle", "3d puzzle",
           "card game", "card games", "playing cards", "uno", "monopoly", "cluedo", "risk", "trivial pursuit",
           "scrabble", "times up", "werewolf", "dixit", "catan", "settlers of catan", "7 wonders", "azul",
           "carcassonne", "dobble", "escape game", "role playing game", "dungeons and dragons", "dice", "chess",
           "chess set", "draughts", "backgammon", "party game", "family game", "cooperative game", "kids game",
           "educational game", "brain teaser", "rubiks cube", "model kit", "wooden game", "toy"],
      es: ["juego de mesa", "juegos de mesa", "juego de tablero", "puzle", "puzles", "rompecabezas",
           "puzle 1000 piezas", "puzle 3d", "juego de cartas", "juegos de cartas", "baraja", "uno", "monopoly",
           "cluedo", "risk", "trivial", "scrabble", "time's up", "hombre lobo", "dixit", "catan", "colonos de catán",
           "7 wonders", "azul", "carcassonne", "dobble", "escape room", "juego de rol", "dungeons and dragons",
           "dados", "ajedrez", "damas", "backgammon", "juego de fiesta", "juego familiar", "juego cooperativo",
           "juego infantil", "juego educativo", "cubo de rubik", "maqueta", "juguete"]
    }
  },
  savRetrait: {
    floors: ["-1"], icon: "wrench",
    // Pas de bonus : la priorité du SAV (« mon iPhone est cassé », « je viens
    // chercher ma commande ») vient de la lecture de la phrase, dans search.js
    // (findProblem), qui passe avant tous les rayons.
    label: { fr: "SAV & retrait des colis", en: "After-sales & order pickup", es: "Posventa y recogida" },
    intro: { fr: "Le SAV et le retrait des colis se trouvent", en: "After-sales and order pickup are",
             es: "La posventa y la recogida de pedidos están" },
    short: { fr: "SAV\nretrait colis", en: "Repairs\npickup", es: "Posventa\nrecogida" },
    detail: { fr: "Réparations, retours, commandes", en: "Repairs, returns, orders", es: "Reparaciones, devoluciones, pedidos" },
    spots: ["35"],
    keywords: {
      fr: ["sav", "service après-vente", "après-vente", "réparation", "réparations", "réparer", "faire réparer",
           "atelier", "atelier de réparation", "diagnostic", "devis", "garantie", "extension de garantie",
           "assurance", "panne", "en panne", "ne marche pas", "ne fonctionne pas", "ne s'allume plus", "cassé",
           "cassée", "abîmée", "rayé", "abîmé", "écran cassé", "vitre cassée", "batterie hs", "dégât des eaux",
           "réparation smartphone", "réparation ordinateur", "changer un écran", "changer la batterie", "retour",
           "retour produit", "rendre un produit", "rembourser", "remboursement", "échange", "échanger",
           "rétractation", "produit défectueux", "réclamation", "litige", "duplicata de facture", "retrait",
           "retrait de commande", "retirer ma commande", "récupérer ma commande", "chercher ma commande",
           "click and collect", "commande", "commande en ligne", "point retrait", "suivi de commande", "colis",
           "paquet", "dépannage", "assistance", "installation à domicile", "transfert de données", "sauvegarde",
           "mise à jour", "nettoyage appareil", "ça rame", "ordinateur lent", "lent", "ralenti", "ça plante",
           "plante", "bug", "bugue", "virus", "écran bleu", "ne charge plus", "ne s'allume pas", "ne s'éteint plus",
           "surchauffe", "problème", "souci", "aide technique", "ça ne marche plus", "ça a lâché", "hors service",
           "carte mère grillée", "récupérer mes données", "données perdues", "ordinateur rame", "pc rame",
           "téléphone rame", "portable rame", "tablette rame", "il rame", "elle rame", "ordinateur plante",
           "téléphone plante", "batterie ne tient plus", "batterie se vide vite", "écran noir", "plus de son",
           "ne s'affiche plus", "ne se connecte plus"],
      en: ["after-sales", "after sales", "customer service", "service desk", "repair", "repairs", "fix",
           "repair shop", "diagnosis", "quote", "warranty", "extended warranty", "insurance", "fault", "not working",
           "doesn't work", "won't turn on", "broken", "damaged", "broken screen", "cracked screen", "dead battery",
           "water damage", "phone repair", "computer repair", "screen replacement", "battery replacement", "return",
           "return a product", "refund", "exchange", "faulty product", "complaint", "invoice copy", "pickup",
           "order pickup", "pick up my order", "collect my order", "click and collect", "order", "online order",
           "collection point", "order tracking", "parcel", "package", "tech support", "support", "data transfer",
           "backup", "software update", "slow computer", "very slow", "freezes", "crashes", "bug", "virus",
           "blue screen", "won't charge", "doesn't charge", "overheating", "problem", "issue", "stopped working",
           "out of order", "lost data", "recover my data", "computer is slow", "phone is slow", "laptop is slow",
           "battery drains fast", "black screen", "no sound", "won't connect"],
      es: ["servicio técnico", "posventa", "atención al cliente", "reparación", "reparaciones", "reparar", "taller",
           "diagnóstico", "presupuesto", "garantía", "extensión de garantía", "seguro", "avería", "no funciona",
           "no enciende", "roto", "dañado", "pantalla rota", "batería agotada", "daño por agua",
           "reparación de móvil", "reparación de ordenador", "cambiar la pantalla", "cambiar la batería",
           "devolución", "devolver un producto", "reembolso", "cambio", "producto defectuoso", "reclamación",
           "copia de factura", "recogida", "recoger pedido", "recoger mi pedido", "click and collect", "pedido",
           "pedido online", "punto de recogida", "seguimiento del pedido", "paquete", "soporte técnico", "asistencia",
           "transferencia de datos", "copia de seguridad", "actualización", "va lento", "se cuelga", "se bloquea",
           "virus", "pantalla azul", "no carga", "se calienta", "problema", "dejó de funcionar", "fuera de servicio",
           "recuperar mis datos", "datos perdidos", "el ordenador va lento", "el móvil va lento",
           "la batería se agota", "pantalla negra", "sin sonido", "no se conecta"]
    }
  },
  caisse: {
    floors: ["-1"], icon: "card",
    label: { fr: "Caisses", en: "Checkout", es: "Caja" },
    // « intro » : les caisses ne sont pas un rayon, Jeanne ne dit donc pas
    // « le rayon Caisses ». « note » s'ajoute à la réponse.
    intro: { fr: "Les caisses se trouvent", en: "The checkouts are", es: "Las cajas están" },
    note: { fr: "Pensez à préparer votre carte Fnac pour la remettre en caisse.",
            en: "Remember to have your Fnac card ready at the till.",
            es: "No olvide preparar su tarjeta Fnac para la caja." },
    detail: { fr: "Paiement, billetterie, piles, adaptateurs de voyage, cartes cadeaux",
              en: "Payment, event tickets, batteries, travel adapters, gift cards",
              es: "Pago, entradas, pilas, adaptadores de viaje, tarjetas regalo" },
    spots: ["39","40"],
    keywords: {
      fr: ["caisse", "caisses", "payer", "où payer", "paiement", "encaissement", "carte bancaire", "cb", "espèces",
           "payer en liquide", "sans contact", "ticket", "ticket de caisse", "facture", "détaxe", "tax free", "carte cadeau",
           "chèque cadeau", "bon d'achat", "un avoir en caisse", "bon d'avoir", "emballage cadeau", "papier cadeau", "file d'attente",
           "caisse automatique", "borne de paiement", "réservation", "piles", "pile", "piles rechargeables",
           "pile bouton", "adaptateur de voyage", "adaptateur prise étrangère", "adaptateur international",
           "prise anglaise", "prise américaine", "carte cadeau fnac", "e-carte cadeau",
           "billetterie", "billet", "billets", "place de concert", "places de concert", "place de spectacle",
           "places de spectacle", "billet de concert", "billets de concert", "réserver une place", "réserver des places",
           "acheter des billets", "prendre des places", "spectacle", "concert", "festival", "parc d'attractions",
           "billet de train", "place de match", "retirer mes billets", "retrait des billets", "e-billet"],
      en: ["checkout", "cashier", "till", "cash register", "pay", "where to pay", "payment", "card payment",
           "credit card", "cash", "contactless", "receipt", "invoice", "tax free", "gift card", "gift voucher",
           "voucher", "credit note", "gift wrapping", "queue", "self checkout", "batteries", "battery",
           "aa batteries", "rechargeable batteries", "travel adapter", "plug adapter", "uk plug adapter",
           "us plug adapter", "fnac gift card", "tickets", "event tickets", "concert tickets", "show tickets",
           "book tickets", "buy tickets", "box office", "ticket office", "collect my tickets"],
      es: ["caja", "cajas", "pagar", "dónde pagar", "pago", "tarjeta bancaria", "efectivo", "contactless", "ticket",
           "recibo", "factura", "tax free", "tarjeta regalo", "cheque regalo", "vale", "envoltorio de regalo",
           "papel de regalo", "cola", "caja automática", "pilas", "pila", "pilas recargables", "adaptador de viaje",
           "adaptador de enchufe", "tarjeta regalo fnac", "entradas", "entradas de concierto",
           "taquilla", "comprar entradas", "reservar entradas", "recoger mis entradas", "espectáculo", "concierto"]
    }
  },
  // Stand d'impression photo, juste à droite de l'espace adhésion.
  tirage: {
    floors: ["-1"], icon: "camera",
    label: { fr: "Impression photo", en: "Photo printing", es: "Impresión de fotos" },
    intro: { fr: "Le stand d'impression photo se trouve", en: "The photo printing stand is",
             es: "El puesto de impresión de fotos está" },
    note: { fr: "Il est juste à côté de l'espace adhésion.", en: "It is right next to the membership desk.",
            es: "Está justo al lado del espacio de socios." },
    detail: { fr: "Tirages et photos d'identité, à côté de l'adhésion",
              en: "Photo prints, next to the membership desk",
              es: "Copias de fotos, junto al espacio de socios" },
    spots: ["42"],
    keywords: {
      fr: ["imprimer des photos", "imprimer mes photos", "imprimer une photo", "impression photo", "impression de photos",
           "tirage photo", "tirages photo", "tirage de photos", "faire développer mes photos", "développer mes photos",
           "développement photo", "borne photo", "borne d'impression", "borne à photos", "kiosque photo",
           "imprimer depuis mon téléphone", "imprimer une photo de mon téléphone", "photo d'identité",
           "photos d'identité", "photomaton", "photo passeport", "photo permis", "agrandissement photo",
           "poster photo", "livre photo", "album photo à imprimer", "calendrier photo", "carte de vœux photo"],
      en: ["print photos", "print my photos", "photo printing", "photo prints", "develop my photos", "photo booth",
           "photo kiosk", "print from my phone", "passport photo", "id photo", "photo enlargement", "photo book"],
      es: ["imprimir fotos", "imprimir mis fotos", "impresión de fotos", "revelar fotos", "revelado de fotos",
           "cabina de fotos", "fotomatón", "foto de carnet", "foto de pasaporte", "ampliación de fotos", "álbum de fotos"]
    }
  },
  adhesion: {
    floors: ["-1"], icon: "person",
    label: { fr: "Adhésion & financement", en: "Membership & financing", es: "Socios y financiación" },
    intro: { fr: "L'espace adhésion et financement se trouve", en: "The membership and financing desk is",
             es: "El espacio de socios y financiación está" },
    short: { fr: "Adhésion", en: "Membership", es: "Socios" },
    detail: { fr: "Carte Fnac, paiement en plusieurs fois", en: "Fnac card, pay in instalments", es: "Tarjeta Fnac, pago a plazos" },
    spots: ["41"],
    keywords: {
      fr: ["adhésion", "adhérent", "devenir adhérent", "carte fnac", "carte adhérent", "carte de fidélité",
           "fidélité", "points fidélité", "avantages adhérent", "réduction adhérent", "offre adhérent", "abonnement",
           "fnac plus", "renouveler ma carte", "inscription", "s'inscrire", "compte fnac", "espace adhérent",
           "parrainage", "carte fnac trois ans", "carte fnac un an", "trois fois sans frais", "paiement en plusieurs fois",
           "financement", "crédit",
            "paiement en 3 fois", "paiement en 4 fois", "paiement en 10 fois", "payer en plusieurs fois", "payer en 3 fois", "en plusieurs fois", "facilités de paiement"],
      en: ["membership", "member", "become a member", "fnac card", "member card", "loyalty card", "loyalty points",
           "member benefits", "member discount", "subscription", "fnac plus", "renew my card", "sign up",
           "fnac account", "referral", "instalments", "pay in instalments", "financing",
            "pay in 3 instalments", "pay later", "payment plan"],
      es: ["socio", "hacerse socio", "membresía", "tarjeta fnac", "tarjeta de socio", "tarjeta de fidelidad",
           "puntos de fidelidad", "ventajas para socios", "descuento socio", "suscripción", "fnac plus",
           "renovar la tarjeta", "darse de alta", "cuenta fnac", "financiación", "pago a plazos",
            "pagar a plazos", "pago en 3 plazos"]
    }
  }
};

// Produits éditoriaux : ils ne sont pas vendus ici mais à la Fnac Wilson.
// Jeanne indique l'adresse au lieu de montrer un rayon (external: true).
export const OTHER_STORE = {
  name: "Fnac Wilson",
  address: ["16, allées Franklin-Roosevelt", "31000 Toulouse"]
};

ZONES.editorial = {
  external: true, floors: [], icon: "book",
  label: { fr: "Livres, papeterie, CD, vinyles, DVD (Fnac Wilson)", en: "Books, stationery, CDs, vinyl, DVDs (Fnac Wilson)", es: "Libros, papelería, CD, vinilos, DVD (Fnac Wilson)" },
  detail: { fr: "", en: "", es: "" },
  keywords: {
    fr: ["livre", "livres", "roman", "romans", "poche", "livre de poche", "polar", "thriller", "science-fiction",
            "fantasy", "bd", "bande dessinée", "bandes dessinées", "manga", "mangas", "comics", "one piece",
            "naruto", "livre jeunesse", "livre enfant", "album jeunesse", "manuel scolaire", "livre scolaire",
            "parascolaire", "annales", "cahier de vacances", "dictionnaire", "encyclopédie", "atlas",
            "guide de voyage", "routard", "lonely planet", "livre audio", "livre de cuisine", "beau livre",
            "biographie", "essai", "développement personnel", "poésie", "théâtre", "goncourt",
            "nouveauté littéraire", "dédicace", "cd", "cd audio", "album", "compilation", "vinyle", "vinyles",
            "disque vinyle", "33 tours", "45 tours", "coffret cd", "dvd", "blu-ray", "4k ultra hd", "coffret dvd",
            "série", "saison", "film", "bande originale", "cassette", "presse", "magazine", "journal",
            "abonnement presse",
            "papeterie", "agenda", "agendas", "carnet", "carnets", "cahier", "cahiers", "bloc-notes", "stylo", "stylos", "stylo plume", "crayon", "crayons", "feutre", "feutres", "surligneur", "gomme", "règle", "classeur", "trieur", "trousse", "calendrier", "carte postale", "cartes postales", "papier à lettres", "enveloppe", "scrapbooking", "carnet de voyage", "journal intime", "planner"],
    en: ["book", "books", "novel", "novels", "paperback", "crime novel", "thriller", "science fiction", "fantasy",
            "comic", "comic book", "comics", "graphic novel", "manga", "one piece", "naruto", "children's book",
            "kids book", "textbook", "school book", "dictionary", "encyclopedia", "atlas", "travel guide",
            "lonely planet", "audiobook", "cookbook", "biography", "essay", "poetry", "cd", "album", "compilation",
            "vinyl", "vinyl record", "record", "lp", "cd box set", "dvd", "blu-ray", "4k ultra hd", "dvd box set",
            "series", "season", "film", "movie", "soundtrack", "magazine", "newspaper", "press",
            "stationery", "notepad", "writing pad", "diary", "planner", "agenda", "pen", "pens", "fountain pen", "pencil", "pencils", "marker", "highlighter", "eraser", "ruler", "folder", "binder", "pencil case", "calendar", "postcard", "postcards", "envelope", "writing paper"],
    es: ["libro", "libros", "novela", "novelas", "bolsillo", "novela negra", "thriller", "ciencia ficción",
            "fantasía", "cómic", "cómics", "novela gráfica", "manga", "one piece", "naruto", "libro infantil",
            "libro de texto", "diccionario", "enciclopedia", "atlas", "guía de viaje", "lonely planet",
            "audiolibro", "libro de cocina", "biografía", "ensayo", "poesía", "cd", "álbum", "recopilatorio",
            "vinilo", "vinilos", "disco de vinilo", "dvd", "blu-ray", "4k ultra hd", "serie", "temporada",
            "película", "banda sonora", "revista", "periódico", "prensa",
            "papelería", "cuaderno", "cuadernos", "libreta", "agenda", "bloc de notas", "bolígrafo", "bolígrafos", "pluma", "lápiz", "lápices", "rotulador", "marcador", "goma de borrar", "regla", "carpeta", "archivador", "estuche", "calendario", "postal", "postales", "sobre de carta", "sobres de carta", "papel de carta"]
  }
};

// =====================================================================
// Vocabulaire parlé : ce que les clients disent vraiment à la borne.
// Modèles récents, surnoms (« la play », « l'ordi »), usages (« pour écouter
// de la musique »), noms de jeux et de marques. Ajouté aux listes ci-dessus
// au chargement. Clé : "rayon" ou "rayon.emplacement".
// (Les pannes, retours et colis sont reconnus par la phrase : search.js.)
// =====================================================================
const SPOKEN = {
  telephonie: {
    fr: ["wawé", "téléphone huawei", "chaomi", "xiao mi", "samsoung galaxy", "vivo", "asus zenfone", "zenfone", "blackview", "ulefone", "hammer", "emporia", "beafon", "anker", "chargeur anker", "ugreen", "belkin", "baseus", "pny", "force power", "bigben connected", "spigen", "otterbox", "zagg", "puro", "qdos", "mobilis", "samsung galaxy a", "xiaomi redmi", "galaxy s26", "galaxy s26 ultra", "galaxy s26 plus", "s26 ultra", "s26", "galaxy z fold 8", "galaxy z flip 8", "galaxy tri fold", "trifold", "galaxy a57", "galaxy a37", "pixel 10a", "pixel 11", "pixel 11 pro", "xiaomi 16", "xiaomi 17", "redmi note 15", "nothing phone 4", "honor magic 8", "précommande samsung", "précommander le galaxy", "réserver le galaxy", "nouveau samsung", "dernier samsung", "samsoung", "samsong", "sam soung", "galaxie", "xaomi", "chaomi", "shaomi", "wawei", "houawei", "hawaï téléphone", "one plus", "motorola razr", "razr", "oppo find", "téléphone xiaomi", "blue tooth", "bloutouth", "tel", "téléphone pliable", "téléphone pliant", "smartphone pliable", "galaxy s23", "galaxy s24 ultra",
         "galaxy s25 ultra", "galaxy s26", "s24 ultra", "s25 ultra", "galaxy a15", "galaxy a25", "galaxy a35",
         "galaxy a55", "galaxy a36", "galaxy z flip 7", "galaxy z fold 7", "redmi note", "redmi note 14",
         "xiaomi 15", "pixel 9", "pixel 9a", "pixel 10", "pixel 10 pro", "honor magic", "honor 400", "nothing phone",
         "tcl", "doro", "téléphone pour senior", "téléphone pour personne âgée", "téléphone grosses touches",
         "téléphone simple", "téléphone basique", "téléphone incassable", "téléphone étanche", "téléphone double sim",
         "téléphone 5g", "5g", "esim", "nano sim", "puce", "puce téléphone", "carte sim prépayée", "lebara", "lyca",
         "chargeur usb", "chargeur usb c", "chargeur type c", "chargeur 20w", "chargeur 25w", "chargeur 45w",
         "chargeur 65w", "chargeur double", "prise usb", "prise chargeur", "câble type c", "type c", "usb type c",
         "câble pour charger", "câble de chargeur", "cordon de charge", "fil de chargeur", "charger mon téléphone",
         "recharger mon téléphone", "charger mon portable", "batterie", "batterie portable", "batterie magnétique",
         "chargeur solaire", "station de charge", "coque de portable", "coque de téléphone", "coque antichoc",
         "coque transparente", "coque rabat", "étui portefeuille", "protection de téléphone", "vitre de protection",
         "verre de protection", "protection d'écran", "film écran", "film de protection", "cordon téléphone",
         "dragonne", "tour de cou téléphone", "bandoulière téléphone", "support vélo téléphone",
         "support grille aération",
         "écouteurs usb c", "écouteurs type c", "kit piéton", "écouteurs avec fil", "casque avec fil téléphone",
         "trépied téléphone", "stabilisateur de téléphone", "objectif pour téléphone", "reprise de mon téléphone",
         "revendre mon téléphone", "portable pour enfant", "premier téléphone"],
    en: ["galaxy s26", "galaxy s26 ultra", "galaxy z fold 8", "galaxy z flip 8", "pixel 10a", "pixel 11", "samsung preorder", "new samsung", "razr", "one plus", "cell", "foldable phone", "folding phone", "galaxy s24 ultra", "galaxy s25 ultra", "galaxy a55",
         "redmi note", "pixel 9", "pixel 10", "nothing phone", "senior phone", "phone for elderly",
         "big button phone", "dual sim phone", "5g phone", "esim", "nano sim", "usb charger", "usb c charger",
         "type c", "type c cable", "charging lead", "charging cord", "phone battery", "magnetic battery",
         "clear case", "rugged case", "wallet case", "screen guard", "phone strap", "phone lanyard",
         "usb c earphones", "phone tripod", "first phone"],
    es: ["galaxy s26", "galaxy s26 ultra", "galaxy z fold 8", "pixel 11", "reservar el galaxy", "nuevo samsung", "razr", "móvil plegable", "teléfono plegable", "galaxy s24 ultra", "galaxy s25 ultra", "galaxy a55", "redmi note",
         "pixel 9", "pixel 10", "móvil para personas mayores", "móvil de teclas grandes", "móvil 5g", "esim",
         "nano sim", "cargador usb", "cargador usb c", "tipo c", "cable tipo c", "funda transparente", "funda antigolpes", "funda cartera", "protector de pantalla móvil",
         "cordón para móvil", "auriculares usb c", "primer móvil"]
  },
  objets: {
    fr: ["rayon objets connectés", "rayon connecté", "rayon montres connectées", "fit bit", "garmine", "montre garmine", "montre polar", "polar vantage", "polar pacer", "coros", "whoop", "bracelet whoop", "bracelet", "bracelets", "sommeil", "mesurer mon sommeil", "suivre mon sommeil", "compter mes pas", "rythme cardiaque", "fréquence cardiaque", "suivre mon activité", "caméra pour la porte", "voir qui sonne", "qui sonne à la porte", "judas connecté", "surveiller mon chien", "surveiller mon chat", "surveiller la maison", "caméra animaux", "qui on parle", "on lui parle", "qu'on parle", "commande vocale", "parler à mon enceinte", "ampoule", "ampoules", "allumer avec mon téléphone", "piloter avec mon téléphone", "contrôler avec mon téléphone", "depuis mon téléphone", "à distance", "maison intelligente", "retrouver mes clés", "retrouver mon sac", "retrouver mon vélo", "ne plus perdre mes clés", "localiser", "galaxy watch 9", "pixel watch 4", "garmin fenix 8", "forerunner 970", "oura ring 4", "montre connectée 2026", "smart ouatch", "garmin forerunner", "forerunner", "garmin venu", "garmin fenix", "fenix", "garmin instinct",
         "galaxy watch 8", "galaxy watch ultra", "pixel watch", "huawei watch gt", "xiaomi smart band", "redmi watch",
         "montre pour courir", "montre running", "montre pour le sport", "montre pour enfant", "montre enfant",
         "montre gps enfant", "montre qui compte les pas", "compter mes pas", "bracelet de sport", "galaxy ring",
         "bague oura", "oura", "bracelet galaxy watch", "bracelet de montre", "chargeur de montre",
         "caméra de sécurité", "caméra wifi", "caméra pour surveiller", "surveiller ma maison", "surveiller bébé",
         "caméra bébé", "visiophone", "interphone", "ezviz", "eufy", "arlo", "tapo", "somfy", "ampoule wifi",
         "ampoule couleur", "lumière connectée", "ruban led connecté", "lampe connectée", "prise wifi",
         "tête thermostatique", "tado", "echo show", "amazon alexa", "enceinte alexa", "google nest mini",
         "nest mini", "nest hub", "tile", "localisateur", "traceur", "balise gps", "retrouver mes clés",
         "galaxy smarttag", "smarttag", "collier gps chien", "gps chat", "tracker chien"],
    en: ["garmin forerunner", "garmin venu", "garmin fenix", "pixel watch", "galaxy watch ultra", "running watch",
         "kids watch", "galaxy ring", "oura ring", "watch strap", "wifi camera", "baby camera", "intercom", "ezviz",
         "eufy", "arlo", "tapo", "wifi bulb", "echo show", "nest mini", "nest hub", "tile", "key finder",
         "smarttag", "pet tracker", "dog gps"],
    es: ["garmin forerunner", "garmin venu", "garmin fenix", "pixel watch", "reloj para correr",
         "reloj para niños", "galaxy ring", "correa de reloj", "cámara wifi", "cámara para bebé", "videoportero",
         "ezviz", "eufy", "tapo", "bombilla wifi", "echo show", "nest mini", "localizador de llaves", "smarttag",
         "localizador para perro"]
  },
  escalier: {
    fr: ["poké mon", "pokémons", "pokemons", "poke mon", "funco", "funco pop", "légos", "pikachu", "cartes pikachu", "grosse tête", "personnages à grosse tête", "figurine à grosse tête", "porte-clés pokémon", "mini figurines", "dragon ball super card game", "carte dragon ball super", "bandai", "tamashii", "banpresto", "figurine banpresto", "hot toys", "figurine hot toys", "gundam", "gunpla", "maquette gundam", "lego 2026", "nouveautés lego", "précommande lego", "lego star wars ucs", "ucs", "set lego collector", "légo", "pokémon 30 ans", "coffret pokemon 30 ans", "méga évolution", "mega evolution", "pokemon méga évolution", "booster méga évolution", "ascended heroes", "précommande pokemon", "précommande cartes pokemon", "display précommande", "lorcana précommande", "one piece op13", "lego ninjago", "lego marvel", "lego creator", "lego architecture", "lego duplo", "duplo", "lego minecraft",
         "lego speed champions", "lego ideas", "lego disney", "lego pour adulte", "lego botanique", "lego fleurs",
         "fleurs lego", "bouquet lego", "bonsaï lego", "lego technic voiture", "lego star wars vaisseau",
         "lego jurassic world", "lego super mario", "lego pokemon", "boîte de lego", "legos", "pop marvel",
         "pop disney", "pop one piece", "pop naruto", "pop harry potter", "pop star wars", "pop dragon ball",
         "pop stitch", "funko one piece", "figurine one piece", "figurine dragon ball", "figurine naruto",
         "figurine demon slayer", "figurine marvel", "figurine star wars", "figurine harry potter", "pop",
         "carte one piece", "cartes one piece", "lorcana", "carte lorcana", "cartes lorcana", "disney lorcana",
         "carte dragon ball", "cartes dragon ball", "carte yu gi oh", "cartes yu gi oh", "yugioh", "magic",
         "carte magic", "star wars unlimited", "flesh and blood", "booster one piece", "booster lorcana",
         "coffret dresseur d'élite", "etb", "pokébox", "tin pokemon", "mini tin pokemon", "blister pokemon",
         "coffret pokemon premium", "écarlate et violet", "carte pokemon rare", "carte gradée", "toploader",
         "sleeves", "pochettes pour cartes", "classeur pokemon", "portfolio cartes", "deck box", "tapis de jeu cartes"],
    en: ["lego ninjago", "lego marvel", "lego creator", "lego architecture", "lego duplo", "duplo", "lego minecraft",
         "lego speed champions", "lego ideas", "lego flowers", "lego bouquet", "legos", "marvel pop", "disney pop",
         "one piece figure", "dragon ball figure", "lorcana", "disney lorcana", "lorcana cards", "yugioh", "magic",
         "one piece cards", "star wars unlimited", "pokemon tin", "top loader", "sleeves", "pokemon binder",
         "deck box", "playmat"],
    es: ["lego ninjago", "lego marvel", "lego creator", "lego duplo", "duplo", "lego minecraft", "flores lego",
         "ramo lego", "funko marvel", "figura one piece", "figura dragon ball", "lorcana", "cartas lorcana",
         "yugioh", "magic", "cartas one piece", "lata pokemon", "fundas de cartas", "archivador pokemon", "deck box"]
  },
  entree: {
    fr: ["sort du magasin", "on sort", "comment on sort", "sortir d'ici", "sors", "je sors", "sortir", "m'en aller", "quitter le magasin", "je cherche la sortie", "sortir du magasin", "la porte de sortie", "retourner dehors", "remonter à la sortie"],
    en: ["how do i get out", "i want to leave"],
    es: ["quiero salir", "busco la salida"]
  },
  gaming: {
    fr: ["rayon gaming", "rayon jeux vidéo", "rayon jeu vidéo", "rayon consoles", "pèce 5", "pèce cinq", "pesse 5", "ixe box", "ix box", "xbox one x", "souitch", "souiche", "swiche", "nintendo souitch", "play station", "plèstation", "bonhommes carrés", "petits bonhommes carrés", "jeu avec des cubes", "jeu de cubes", "jeu harry potter", "jeu spider-man", "jeu pokémon switch", "jeu star wars", "jeu lego star wars", "jeu marvel", "nacon", "manette nacon", "bigben", "pdp", "powera", "hori", "backbone", "backbone pour mon téléphone", "manette backbone", "manette pour smartphone", "manette turtle beach", "casque turtle beach ps5", "razer kishi", "manette pour téléphone", "carte cadeau nintendo", "carte cadeau playstation", "carte cadeau psn", "carte cadeau xbox", "carte cadeau steam", "carte cadeau roblox", "carte cadeau fortnite", "carte cadeau eshop", "carte cadeau jeux vidéo", "gta 6", "gta vi", "gta six", "grand theft auto 6", "grand theft auto vi", "précommande gta", "précommander gta 6", "réserver gta 6", "sortie gta 6", "quand sort gta 6", "gta 6 ps5", "gta 6 xbox", "ps6", "playstation 6", "ps 6", "xbox next", "prochaine xbox", "prochaine playstation", "switch 3", "précommander un jeu", "réserver un jeu", "jeu à réserver", "réservation jeu", "jeux à venir", "bonus de précommande", "fc 27", "fifa 27", "call of duty 2026", "black ops 8", "the witcher 4", "witcher 4", "elder scrolls 6", "marvel's wolverine", "wolverine ps5", "007 first light", "resident evil requiem", "metroid prime 4", "kirby air riders", "pokemon pokopia", "pokopia", "pokemon vents et vagues", "zelda switch 2", "mario kart world", "nba 2k27", "gears of war", "gears of war e-day", "clair obscur", "expedition 33", "ghost of yotei", "onimusha", "phantom blade zero", "crimson desert", "pragmata", "nintendo swiche", "switche", "switch deux", "ixbox", "x box", "iks box", "plais station", "playstaïtion", "pléstation", "ps cinq", "manette ps cinq", "dual sense", "joy cone", "game pass ultimate", "la play", "une play", "play 5", "play 4", "la ps", "playstation portal", "ps portal", "ps5 slim",
         "ps5 digital", "ps5 édition digitale", "ps5 standard", "xbox game pass",
         "nintendo switch 2", "la switch", "switch 1", "console nintendo", "console sony", "console microsoft",
         "console pour enfant", "console pour jouer", "jouer à la console", "rog ally", "legion go",
         "console rétro", "mini console", "retrogaming", "game boy", "nintendo ds", "3ds", "super nintendo",
         "manette sans fil", "manette dualsense", "manette ps4", "manette pour switch", "manette switch 2",
         "joycon", "joy con", "manette edge", "dualsense edge", "casque ps5", "pulse 3d", "pulse elite",
         "casque xbox", "casque pour ps5", "casque pour la play", "micro pour console", "câble manette",
         "chargeur manette", "jeux ps5", "jeux ps4", "jeux switch", "jeux xbox", "jeu pour la switch",
         "jeu pour la play", "jeu pour la ps5", "nouveau jeu", "nouveautés jeux vidéo", "sorties jeux vidéo",
         "jeu en précommande", "précommande", "jeu de guerre", "jeu de combat", "jeu de voiture", "jeu d'aventure",
         "jeu d'horreur", "jeu de sport", "jeu multijoueur", "jeu à plusieurs", "jeu pour enfant de 8 ans",
         "fc 25", "fc 26", "ea fc", "fifa 25", "fifa 26", "mario kart world", "mario kart 8", "super mario",
         "mario party", "smash bros", "super smash bros", "donkey kong", "donkey kong bananza", "kirby", "splatoon",
         "animal crossing", "pokemon écarlate", "pokemon légendes", "pokemon legends z-a", "metroid", "luigi's mansion",
         "red dead redemption", "red dead", "battlefield", "battlefield 6", "ghost of yotei", "ghost of tsushima",
         "death stranding", "resident evil", "final fantasy", "sonic", "crash bandicoot", "god of war", "the last of us",
         "gran turismo", "forza", "halo", "assassin's creed shadows", "astro bot", "black ops",
         "black ops 7", "cod black ops", "gta 5", "gta v", "gta vi", "nba 2k26", "wwe 2k", "ufc", "tony hawk",
         "hollow knight", "hollow knight silksong", "silksong", "borderlands", "monster hunter", "street fighter",
         "tekken", "mortal kombat", "dragon ball sparking zero", "naruto jeu", "lego jeu vidéo", "jeu lego",
         "carte eshop", "eshop", "carte playstation", "carte psn 20 euros", "psn", "carte steam", "steam",
         "v-bucks", "vbucks", "carte fortnite", "roblox", "carte roblox", "robux", "carte minecraft", "minecoins",
         "abonnement psn", "abonnement switch online", "carte de jeu", "carte prépayée jeu", "meta quest 3",
         "meta quest 3s", "quest 3", "casque de réalité virtuelle", "vr", "ps vr2", "psvr2", "volant ps5",
         "volant logitech", "volant thrustmaster", "thrustmaster", "pédalier", "sacoche switch", "étui switch",
         "protection écran switch", "grip switch", "station d'accueil switch", "disque dur ps5", "ssd ps5",
         "ventilateur ps5", "support ps5", "coque manette", "sticks manette"],
    en: ["ps5 headset", "headset for ps5", "gaming headset for ps5", "xbox headset", "headset for xbox", "switch headset", "gta 6", "gta vi", "grand theft auto vi", "gta 6 preorder", "ps6", "playstation 6", "next xbox", "preorder a game", "preorder", "upcoming games", "fc 27", "the witcher 4", "007 first light", "resident evil requiem", "metroid prime 4", "pokopia", "gears of war", "x box", "the play", "playstation portal", "ps5 slim", "ps5 digital", "nintendo switch 2", "rog ally", "legion go",
         "retro console", "game boy", "nintendo ds", "wireless controller", "dualsense edge", "ps5 headset",
         "pulse 3d", "xbox headset", "games", "new games", "new releases", "preorder", "war game", "fighting game",
         "adventure game", "horror game", "sports game", "multiplayer game", "fc 25", "fc 26", "ea fc",
         "mario kart world", "super mario", "mario party", "smash bros", "donkey kong", "kirby", "animal crossing",
         "red dead redemption", "battlefield", "ghost of yotei", "resident evil", "final fantasy", "sonic",
         "god of war", "the last of us", "gran turismo", "forza", "halo", "astro bot", "black ops", "gta 5",
         "silksong", "monster hunter", "street fighter", "tekken", "mortal kombat", "eshop card", "eshop",
         "steam card", "steam", "vbucks", "fortnite card", "roblox", "roblox card", "robux", "minecraft card",
         "meta quest 3", "quest 3", "vr", "ps vr2", "thrustmaster", "pedals", "switch carry case",
         "ps5 ssd", "ps5 stand"],
    es: ["gta 6", "gta vi", "ps6", "playstation 6", "reservar un juego", "reserva de juego", "próximos juegos", "fc 27", "the witcher 4", "resident evil requiem", "x box", "la play", "play 5", "play 4", "playstation portal", "ps5 slim", "ps5 digital", "nintendo switch 2",
         "rog ally", "consola retro", "game boy", "mando inalámbrico", "cascos ps5", "juegos", "juegos ps5",
         "juegos switch", "novedades videojuegos", "reserva", "juego de guerra", "juego de lucha", "juego de coches",
         "juego de aventuras", "juego de terror", "juego de deportes", "fc 25", "fc 26", "ea fc", "mario kart world",
         "super mario", "mario party", "smash bros", "donkey kong", "kirby", "animal crossing", "red dead redemption",
         "battlefield", "resident evil", "final fantasy", "sonic", "god of war", "the last of us", "gran turismo",
         "astro bot", "black ops", "gta 5", "tarjeta eshop", "eshop", "tarjeta steam", "steam", "pavos fortnite",
         "tarjeta fortnite", "roblox", "tarjeta roblox", "robux", "meta quest 3", "quest 3", "vr", "ps vr2",
         "thrustmaster", "pedales", "funda de transporte switch", "ssd ps5"]
  },
  "accessoiresGaming.pc": {
    fr: ["msi gaming", "nzxt", "be quiet", "kingston fury", "gigabyte", "aorus", "ventirad be quiet", "pc msi", "boîtier nzxt", "bon pc pour jouer", "pc pour jouer", "ordinateur pour jouer", "pc pour les jeux", "pc pour jouer à fortnite", "pc qui fait tourner les jeux", "faire tourner les jeux", "jouer sur pc", "jeux sur pc", "monter un pc gamer", "améliorer mon pc", "upgrade pc", "plus de fps", "fps", "rtx 5060 ti", "rtx 5050", "rtx 6070", "rtx 6080", "rtx 6090", "rx 9060 xt", "ryzen 9000", "ryzen 9 9950x3d", "9800x3d", "core ultra 7", "core ultra 9", "écran 500 hz", "écran 240hz oled", "composant", "composants", "composant pc", "pièces pc", "pièce pour pc", "monter mon pc", "monter un pc",
         "config gamer", "configuration gamer", "pc de gamer", "ordinateur gamer", "ordinateur gaming",
         "pc portable gamer", "pc portable gaming", "ordinateur portable gamer", "asus tuf", "tuf gaming",
         "msi katana", "lenovo legion", "hp omen", "hp victus", "victus", "acer nitro", "acer predator", "alienware", "rtx 4060", "rtx 4070", "rtx 5060", "rtx 5070", "rtx 5070 ti",
         "rtx 5080", "rtx 5090", "carte graphique nvidia", "carte graphique amd", "rx 9070", "ryzen", "ryzen 5",
         "ryzen 7", "ryzen 9", "intel", "intel core", "core i5", "core i7", "core i9", "core ultra",
         "processeur intel", "processeur amd", "pâte thermique", "ventirad cpu", "watercooling aio", "aio",
         "ddr4", "ddr5", "16 go de ram", "32 go de ram", "ssd m2", "ssd nvme pc", "boîtier gamer",
         "alimentation 750w", "écran incurvé", "écran 32 pouces", "écran 34 pouces", "écran ultrawide", "écran 4k pc",
         "écran 165 hz", "écran 180 hz", "écran 360 hz", "écran oled pc", "écran pour console", "écran pour ps5",
         "moniteur gamer", "moniteur gaming", "bras d'écran", "support écran", "pied d'écran", "deuxième écran",
         "écran portable", "écran de travail"],
    en: ["components", "pc parts", "build a pc", "pc build", "gaming computer", "gaming rig", "asus tuf",
         "lenovo legion", "hp omen", "hp victus", "acer nitro", "acer predator", "alienware", "rtx 4060", "rtx 5060",
         "rtx 5070", "rtx 5080", "rtx 5090", "rx 9070", "ryzen", "ryzen 7", "intel core", "core i7", "thermal paste",
         "aio cooler", "ddr5", "curved monitor", "ultrawide monitor", "4k monitor", "165 hz monitor", "oled monitor",
         "monitor arm", "portable monitor", "second monitor"],
    es: ["componentes", "piezas de pc", "montar un pc", "ordenador gaming", "asus tuf", "lenovo legion", "hp omen",
         "acer nitro", "alienware", "rtx 5060", "rtx 5070", "rtx 5080", "rtx 5090", "ryzen", "intel core",
         "pasta térmica", "ddr5", "monitor curvo", "monitor ultrawide", "monitor 4k", "monitor oled",
         "brazo para monitor", "monitor portátil", "segundo monitor"]
  },
  "accessoiresGaming.accessoires": {
    fr: ["discord", "micro discord", "micro pour discord", "casque discord", "parler sur discord", "parler en jouant", "trust gaming", "mars gaming", "oplite", "trust", "fauteuil", "fauteuil de bureau", "chaise de bureau", "siège de bureau", "clavier lumineux", "clavier qui s'allume", "clavier de couleur", "souris lumineuse", "jouer longtemps", "webcam", "caméra pour pc", "caméra pour ordinateur", "webcam logitech", "logitech g", "souris logitech",
         "clavier logitech", "souris razer", "clavier razer", "casque razer", "razer kraken", "razer blackshark",
         "corsair void", "hyperx cloud", "steelseries arctis", "arctis nova", "logitech g pro", "logitech g502",
         "g502", "souris ergonomique", "souris verticale", "souris bluetooth", "souris silencieuse",
         "souris pour pc portable", "pavé numérique", "clavier azerty", "clavier rétroéclairé", "clavier souris",
         "ensemble clavier souris", "clavier et souris", "clavier sans fil et souris", "clavier 60",
         "clavier compact", "switch clavier", "keycaps", "casque avec micro", "casque micro pc", "casque pour pc",
         "casque pour jouer", "micro pour streamer", "micro gamer", "micro usb pour pc", "blue yeti", "yeti",
         "hyperx quadcast", "bras de micro", "streamer", "faire du stream", "streaming", "twitch", "capture vidéo",
         "elgato hd60", "facecam", "lumière stream", "manette pc", "manette pour pc", "fauteuil gaming",
         "chaise gamer", "chaise de bureau gamer", "repose poignet", "tapis de bureau", "grand tapis de souris",
         "bureau gaming", "éclairage rgb", "rgb", "casque 7.1", "casque surround", "dac casque",
         "carte son externe"],
    en: ["webcam", "pc camera", "logitech g", "razer kraken", "razer blackshark", "hyperx cloud", "arctis nova",
         "g502", "ergonomic mouse", "vertical mouse", "bluetooth mouse", "numeric keypad", "backlit keyboard",
         "keyboard and mouse", "keyboard mouse combo", "compact keyboard", "keycaps", "headset with mic",
         "pc headset", "streaming microphone", "blue yeti", "quadcast", "mic arm", "streaming", "twitch",
         "facecam", "pc controller", "wrist rest", "rgb", "surround headset", "external sound card"],
    es: ["webcam", "cámara web", "cámara para pc", "logitech g", "razer kraken", "hyperx cloud", "arctis nova",
         "ratón ergonómico", "ratón vertical", "ratón bluetooth", "teclado numérico", "teclado retroiluminado",
         "teclado y ratón", "auriculares con micro", "micrófono para streaming", "blue yeti", "brazo de micrófono",
         "streaming", "twitch", "mando para pc", "reposamuñecas", "rgb", "tarjeta de sonido externa"]
  },
  cartouches: {
    fr: ["encre pour imprimante", "de l'encre", "recharge d'encre", "bouteille d'encre", "flacon d'encre",
         "ecotank", "encre ecotank", "cartouche noire", "cartouche noir", "cartouche couleur", "cartouches couleur",
         "cartouche xl", "cartouche compatible", "cartouche hp 305", "hp 305", "hp 304", "hp 303", "hp 302",
         "hp 912", "hp 963", "hp 953", "hp 62", "hp 301", "cartouche 305", "canon pg 545", "pg 545", "pg 560",
         "cl 546", "epson 603", "epson 604", "epson 502", "epson 29", "epson fraise", "epson ananas", "brother lc",
         "instant ink", "hp instant ink", "toner laser", "toner hp", "toner brother", "toner samsung",
         "cartouche d'imprimante", "cartouches d'imprimante", "ruban d'impression", "cartouche photo",
         "papier photo imprimante"],
    en: ["printer ink", "ink refill", "ink bottle", "ecotank", "black ink", "colour ink", "color ink",
         "black cartridge", "colour cartridge", "xl cartridge", "hp 305", "hp 304", "hp 302", "hp 912", "hp 963",
         "epson 603", "epson 604", "instant ink", "laser toner", "printer cartridge"],
    es: ["tinta para impresora", "recarga de tinta", "botella de tinta", "ecotank", "cartucho negro",
         "cartucho de color", "cartucho xl", "hp 305", "hp 304", "hp 302", "epson 603", "epson 604", "instant ink",
         "tóner láser", "cartucho de impresora"]
  },
  electromenager: {
    fr: ["rayon cuisine", "cuisine", "rayon beauté", "beauté", "rayon soin", "soin", "bien-être", "rayon bien-être", "électro", "rayon électroménager", "rovanta", "roventa", "moulinexe", "moulinesque", "téfale", "crupse", "delongi", "de longhi", "babylisse", "baby liss", "oral bé", "braune", "cocotte électrique", "faire des gâteaux", "pâtisserie", "faire de la pâtisserie", "pop corn", "popcorn", "machine à popcorn", "machine à pop-corn", "faire du pop-corn", "appareil à cookies", "faire des cookies", "machine à hot-dog", "four", "petit four", "four électrique", "shark", "aspirateur shark", "sage", "princess", "livoo", "h koenig", "domo", "philips cuisine", "électro", "électroménager cuisine", "appareil de cuisine", "petit appareil", "moulinex", "seb", "tefal",
         "calor", "philips cuisine", "bosch", "kenwood", "smeg", "russell hobbs", "riviera et bar", "cuiseur vapeur", "cuiseur à riz", "autocuiseur", "cocotte minute électrique", "multicuiseur", "mijoteuse",
         "slow cooker", "fondue", "appareil à fondue", "panini",
         "machine à pâtes", "hachoir à viande", "machine à glace", "turbine à glace", "ninja creami", "creami",
         "déshydrateur", "stérilisateur biberon", "chauffe-biberon", "robot bébé", "babycook", "fontaine à eau", "ventilo", "clim", "clim mobile", "climatisation", "chauffage", "radiateur soufflant",
         "radiateur bain d'huile", "ventilateur colonne", "ventilateur sur pied", "ventilateur de table",
         "ventilateur silencieux", "rafraîchisseur d'air", "masseur", "appareil de massage", "pistolet de massage",
         "coussin chauffant", "couverture chauffante", "bouillotte électrique", "chauffe-pieds"],
    en: ["kitchen appliance", "moulinex", "tefal", "bosch", "kenwood", "smeg", "russell hobbs", "rice cooker",
         "steamer", "slow cooker", "pressure cooker", "fondue set", "sandwich maker", "panini press", "pasta maker",
         "ninja creami", "dehydrator", "bottle warmer", "bottle steriliser", "tower fan", "pedestal fan",
         "desk fan", "air cooler", "massager", "massage gun", "heating pad", "electric blanket"],
    es: ["moulinex", "tefal", "bosch", "kenwood", "smeg", "arrocera", "vaporera", "olla lenta", "olla eléctrica",
         "sandwichera", "máquina de pasta", "ninja creami", "deshidratador", "calienta biberones",
         "esterilizador de biberones", "ventilador de pie", "ventilador de torre", "climatizador", "masajeador",
         "pistola de masaje", "almohadilla térmica", "manta eléctrica"]
  },
  "electromenager.sols": {
    fr: ["nettoyer par terre", "nettoyer le sol", "laver le sol", "laver par terre", "nettoyer les sols", "poils d'animaux", "poils de chien", "poils de chat", "aspirer les poils", "dyson v16", "dyson pencilvac", "pencilvac", "daïson", "daisonne", "dayson", "aspirateur dyson", "dyson v8", "dyson v10", "dyson v11", "dyson v12", "dyson v15", "dyson v16",
         "dyson gen5", "dyson gen 5", "dyson detect", "aspirateur laveur", "aspirateur eau et poussière",
         "nettoyeur de sol", "laveur de sol", "serpillère électrique", "lave-vitre", "nettoyeur vitres",
         "karcher vitres", "aspirateur de chantier", "aspirateur souffleur", "aspirateur traineau sans sac",
         "aspirateur avec sac", "aspirateur sans sac", "sacs aspirateur", "sac d'aspirateur", "filtre aspirateur",
         "accessoires aspirateur", "brosse aspirateur", "batterie dyson", "tineco", "bissell"],
    en: ["dyson v8", "dyson v11", "dyson v15", "dyson gen5", "wet and dry vacuum", "floor washer", "window vacuum",
         "vacuum bags", "vacuum filter", "dyson battery", "tineco", "bissell"],
    es: ["dyson v8", "dyson v11", "dyson v15", "aspirador friegasuelos", "limpiacristales eléctrico",
         "bolsas de aspiradora", "filtro de aspiradora", "tineco", "bissell"]
  },
  "electromenager.aspirateurs": {
    fr: ["aspirateur balai sans fil", "balai sans fil", "aspirateur rechargeable", "petit aspirateur",
         "aspirateur de voiture", "aspirateur voiture", "robot laveur", "robot aspirateur laveur", "roborock",
         "dreame", "ecovacs", "deebot", "rowenta x force", "x force", "brosse à dents", "brossette",
         "brossettes", "brossettes oral b", "recharges brosse à dents", "têtes de brosse", "sonicare",
         "philips sonicare", "jet dentaire", "waterpik", "épilateur lumière pulsée", "ipl", "épilation",
         "silk expert", "silk epil", "philips lumea", "lumea", "rasoir femme"],
    en: ["cordless stick vacuum", "car vacuum", "robot mop", "roborock", "dreame", "ecovacs", "deebot",
         "toothbrush", "toothbrush heads", "replacement brush heads", "sonicare", "waterpik", "hair removal",
         "lumea", "lady shaver"],
    es: ["escoba sin cable", "aspirador de coche", "robot friegasuelos", "roborock", "dreame", "ecovacs", "deebot",
         "cepillo de dientes", "cabezales de recambio", "sonicare", "waterpik", "depilación", "lumea"]
  },
  "electromenager.cheveux": {
    fr: ["sécher mes cheveux", "se sécher les cheveux", "lisser mes cheveux", "boucler mes cheveux", "couper les cheveux", "se couper les cheveux", "raser la tête", "tailler ma barbe", "couper la barbe", "rasage", "dyson airwrap", "airwrap dyson", "dyson supersonic", "supersonic", "sèche-cheveux dyson", "lisseur dyson",
         "dyson airstrait", "airstrait", "sèche cheveux", "fer à lisser", "lisseur ghd", "ghd", "lisseur vapeur",
         "steampod", "boucleur automatique", "brosse lissante", "brosse chauffante", "diffuseur cheveux",
         "coiffure", "pour les cheveux", "rasoir philips", "oneblade", "philips oneblade", "braun series",
         "tondeuse corps", "tondeuse nez", "tondeuse oreilles", "tondeuse visage", "tondeuse cheveux enfant",
         "tondeuse de précision", "tondeuse multifonction", "tondeuse sabot", "rasoir rotatif", "rasoir à grille",
         "se raser", "pour me raser", "pour la barbe", "barbe", "entretien barbe", "lames de rasoir électrique",
         "wahl", "valera"],
    en: ["dyson airwrap", "dyson supersonic", "supersonic", "airstrait", "flat iron", "ghd", "steampod",
         "hot brush", "diffuser attachment", "oneblade", "braun series", "body groomer", "nose trimmer",
         "precision trimmer", "multi groomer", "beard", "shave", "wahl"],
    es: ["dyson airwrap", "dyson supersonic", "supersonic", "airstrait", "plancha ghd", "ghd", "steampod",
         "cepillo alisador", "cepillo térmico", "oneblade", "braun series", "cortapelos corporal",
         "cortador de nariz", "barba", "afeitarse", "wahl"]
  },
  "electromenager.linge": {
    fr: ["raclette", "appareil à raclette 8 personnes", "grill", "grill électrique", "grill viande", "optigrill",
         "plancha", "croque monsieur", "appareil à croque", "gaufres", "crêpes", "billig", "four à pizza", "pizza", "four à pizza électrique",
         "wok électrique", "barbecue de table", "défroisseur vapeur", "steamer vêtements", "repasser",
         "fer vapeur", "fer sans fil", "table à repasser électrique", "rasoir anti-bouloches", "anti-bouloches",
         "soin du corps", "pédicure électrique", "râpe électrique pieds", "appareil manucure",
         "brosse nettoyante visage", "miroir lumineux"],
    en: ["raclette grill", "optigrill", "contact grill", "plancha", "waffles", "crepes", "pizza oven",
         "electric wok", "table grill", "clothes steamer", "steam iron", "cordless iron", "fabric shaver",
         "lint remover", "electric foot file", "manicure set", "facial cleansing brush", "lighted mirror"],
    es: ["raclette", "grill eléctrico", "optigrill", "gofres", "crepes", "horno de pizza", "wok eléctrico",
         "plancha de vapor", "plancha sin cable", "quitapelusas", "lima eléctrica pies", "set de manicura",
         "cepillo facial", "espejo con luz"]
  },
  "electromenager.preparation": {
    fr: ["eau pétillante", "eau gazeuse maison", "faire de l'eau gazeuse", "faire des jus", "faire des soupes", "faire des compotes", "mixer", "hacher", "me peser", "perdre du poids", "suivre mon poids", "blender chauffant", "soup maker", "soupe maker", "blender nutribullet", "nutribullet", "blender ninja",
         "smoothie", "faire des smoothies", "faire du jus", "jus de fruits", "extracteur", "presse agrumes",
         "presse-orange", "batteur", "batteur électrique", "fouet électrique", "hachoir électrique", "mini hachoir",
         "robot coupe", "gazéifieur", "eau gazeuse", "cylindre sodastream", "recharge sodastream",
         "bouteille sodastream", "sirop sodastream", "carafe filtrante", "brita", "filtre brita",
         "fontaine filtrante", "balance", "pèse personne", "balance impédancemètre", "impédancemètre",
         "balance salle de bain"],
    en: ["soup maker", "nutribullet", "ninja blender", "smoothie maker", "smoothies", "juice", "hand mixer",
         "electric whisk", "mini chopper", "sparkling water maker", "sodastream cylinder", "sodastream refill",
         "water filter jug", "brita", "brita filter", "scales", "body fat scale"],
    es: ["batidora de vaso", "nutribullet", "licuadora ninja", "batidos", "zumo", "batidora de varillas",
         "minipicadora", "agua con gas", "cilindro sodastream", "recarga sodastream", "jarra filtrante", "brita",
         "filtro brita", "báscula de baño", "báscula inteligente"]
  },
  "electromenager.machinesCafe": {
    fr: ["café", "machine café", "cafetière électrique", "cafetière à piston",
         "cafetière italienne", "cafetière italienne électrique", "théière", "faire du café",
         "machine pour le café"],
    en: ["coffee", "coffee maker machine", "french press", "moka pot", "tea maker"],
    es: ["café", "máquina de café", "cafetera eléctrica", "cafetera italiana", "cafetera de émbolo"]
  },
  "electromenager.cafe": {
    fr: ["machine à grain", "machine à grains", "machine café grain", "cafetière à grain", "broyeur", "robot café",
         "expresso broyeur", "philips latte go", "lattego", "delonghi magnifica", "magnifica", "delonghi dinamica",
         "melitta", "jura", "siemens eq", "sage barista", "barista", "machine barista", "mousseur à lait",
         "mousseur de lait", "robot multifonction", "robot cuisine", "thermomix", "cook expert", "magimix cook expert",
         "i companion", "moulinex companion", "kitchenaid artisan", "robot pâtissier kitchenaid", "batteur sur socle",
         "mixeur plongeant", "presse purée électrique", "robot chauffant"],
    en: ["bean to cup machine", "barista machine", "sage barista", "lattego", "delonghi magnifica", "melitta",
         "jura", "milk frother", "food processor", "thermomix", "cook expert", "kitchen robot", "kitchenaid artisan",
         "stick blender"],
    es: ["cafetera de grano", "cafetera superautomática", "delonghi magnifica", "melitta", "jura", "espumador de leche",
         "robot de cocina", "thermomix", "cook expert", "kitchenaid artisan", "batidora de brazo"]
  },
  "electromenager.capsules": {
    fr: ["chauffer de l'eau", "faire bouillir de l'eau", "eau chaude", "faire des frites", "frites sans huile", "cuire sans huile", "faire des toasts", "griller du pain", "pain grillé", "air frayeur", "ère frayeur", "air friteuse", "airfrayer", "nes presso", "vertuo next", "vertuo creatista", "capsules nespresso", "capsule nespresso", "nespresso vertuo", "vertuo", "capsules vertuo", "vertuo pop",
         "machine nespresso", "machine dolce gusto", "capsules dolce gusto", "capsules tassimo", "dosettes senseo",
         "l'or barista", "machine l'or", "aeroccino", "bouilloire électrique", "bouilloire température réglable",
         "grille pain", "toasteur", "grille-pain 4 tranches", "air fryer ninja", "ninja air fryer",
         "friteuse à air", "friteuse à air chaud", "airfryer philips", "cosori", "ninja foodi", "ninja dual zone",
         "easy fry", "moulinex easy fry", "cuisson sans huile", "frites sans huile"],
    en: ["nespresso capsules", "nespresso vertuo", "vertuo", "vertuo pop", "dolce gusto pods", "tassimo pods",
         "aeroccino", "electric kettle", "4 slice toaster", "ninja air fryer", "dual zone air fryer", "cosori",
         "ninja foodi", "easy fry"],
    es: ["cápsulas nespresso", "nespresso vertuo", "vertuo", "cápsulas dolce gusto", "aeroccino",
         "hervidor eléctrico", "tostador", "freidora ninja", "cosori", "ninja foodi", "easy fry"]
  },
  informatique: {
    fr: ["epson", "imprimante epson", "brother", "imprimante brother", "imprimante hp", "imprimante canon", "ssd samsung", "samsung ssd", "devolo", "d link", "ubiquiti", "apc", "eaton", "onduleur apc", "câble ugreen", "hub ugreen", "adaptateur belkin", "brancher", "brancher mon ordi sur la télé", "brancher mon ordinateur sur la télé", "brancher mon pc sur la télé", "relier mon ordi à la télé", "connecter mon ordi à la télé", "sauvegarder", "sauvegarder mes photos", "sauvegarder mes fichiers", "stocker", "stocker mes photos", "stocker mes fichiers", "fichiers", "mes fichiers", "transférer des fichiers", "plus de stockage", "manque de place", "plus de place", "wifi dans ma chambre", "wifi dans la maison", "wifi qui capte mal", "capter le wifi", "réseau internet", "internet à la maison", "plusieurs branchements", "prise avec plusieurs", "brancher plusieurs appareils", "rallonger", "rallonge de câble", "scanner des documents", "scanner des photos", "imprimer des documents", "carte mémoire", "carte micro sd 128 go", "micro sd", "microsd", "carte sd pour téléphone", "sandisk",
         "clé usb 32 go", "clé usb 64 go", "clé usb 128 go", "clé usb c", "clé usb 3.0", "disque dur 1 to",
         "disque dur 2 to", "disque dur 4 to", "stockage externe", "disque externe", "seagate",
         "western digital", "wd", "lacie", "kingston", "crucial", "samsung t7", "ssd samsung", "boîtier disque dur",
         "lecteur blu-ray externe", "lecteur cd externe", "graveur dvd", "câble réseau",
         "switch réseau", "switch ethernet", "prise réseau", "wifi", "améliorer mon wifi", "wifi mesh", "mesh",
         "tp-link", "tp link", "netgear", "clé 4g", "routeur 4g", "box 4g", "adaptateur cpl", "clé bluetooth pc",
         "adaptateur displayport", "adaptateur vga hdmi", "convertisseur", "adaptateur usb", "adaptateur usb c usb",
         "câble hdmi 2.1", "câble hdmi long", "câble hdmi 5 mètres", "câble usb a",
         "câble usb c usb c", "câble thunderbolt", "rallonge", "prise multiple", "multiprise usb", "bloc multiprise",
         "prise électrique", "prise parafoudre", "enrouleur", "papier a4", "a4", "ramette", "papier pour imprimante",
         "scanner de documents",
         "imprimante hp", "imprimante epson", "imprimante canon", "imprimante brother", "imprimante photo portable",
         "impression", "imprimer", "pour imprimer", "lingettes écran",
         "kit de nettoyage", "support pc portable", "tapis de souris simple"],
    en: ["memory card", "micro sd", "microsd", "sandisk", "32gb usb stick", "64gb usb stick", "usb c flash drive",
         "1tb hard drive", "2tb", "external storage", "seagate", "western digital", "wd", "lacie", "kingston",
         "crucial", "samsung t7", "hard drive enclosure", "external blu-ray drive",
         "network cable", "network switch", "wifi", "improve my wifi", "mesh wifi", "tp-link", "netgear",
         "4g router", "4g dongle", "displayport adapter", "vga to hdmi", "converter", "usb adapter",
         "long hdmi cable", "thunderbolt cable", "multi plug", "extension lead", "a4 paper", "ream of paper",
         "document scanner", "hp printer",
         "epson printer", "canon printer", "printing", "print", "screen wipes", "cleaning kit"],
    es: ["tarjeta de memoria", "micro sd", "microsd", "sandisk", "memoria usb 64 gb", "disco duro 1 tb",
         "almacenamiento externo", "seagate", "western digital", "wd", "lacie", "kingston", "crucial", "samsung t7",
         "caja para disco duro", "cable de red", "switch de red", "wifi", "mejorar mi wifi",
         "wifi mesh", "tp-link", "netgear", "router 4g", "adaptador displayport", "vga a hdmi", "convertidor",
         "adaptador usb", "cable hdmi largo", "cable thunderbolt", "enchufe múltiple", "papel a4", "a4",
         "impresora hp",
         "impresora epson", "impresora canon", "imprimir", "toallitas para pantalla"]
  },
  tablettes: {
    fr: ["samsung galaxy tab", "samsung galaxy tab a9", "samsung galaxy tab s10", "samsung galaxy tab s9", "tablette galaxy", "tablette lenovo", "lenovo tab", "tablette xiaomi", "xiaomi pad", "redmi pad", "tablette huawei",
         "matepad", "honor pad", "galaxy tab s10", "galaxy tab s9", "galaxy tab a9", "tab s10", "tab a9",
         "galaxy tab s10 fe", "tablette amazon", "amazon fire", "fire hd", "fire hd 10", "tablette fire",
         "tablette pas chère", "tablette pour enfant", "tablette pour mon fils", "tablette pour ma fille",
         "tablette pour les enfants", "tablette pour regarder des films", "tablette 10 pouces", "tablette 11 pouces",
         "tablette 4g", "tablette tactile", "tablette android pas chère", "coque tablette", "housse tablette", "protection tablette",
         "étui tablette", "clavier tablette", "clavier pour tablette", "stylet", "stylet tablette",
         "s pen", "stylet samsung", "verre trempé tablette", "support tablette", "tablette enfant lexibook",
         "lexibook", "tablette éducative"],
    en: ["lenovo tab", "xiaomi pad", "redmi pad", "matepad", "galaxy tab s10", "galaxy tab a9", "amazon fire",
         "fire hd", "fire tablet", "cheap tablet", "tablet for kids", "10 inch tablet", "tablet case", "tablet cover", "tablet keyboard", "stylus", "s pen", "tablet stand"],
    es: ["tablet lenovo", "lenovo tab", "xiaomi pad", "redmi pad", "galaxy tab s10", "galaxy tab a9",
         "amazon fire", "fire hd", "tablet barata", "tableta para niños", "funda tablet", "funda para tableta", "teclado para tablet", "lápiz táctil", "stylus", "s pen",
         "soporte tablet"]
  },
  liseuses: {
    fr: ["cobo", "liseuse cobo", "kobo clara colour", "pocketbook", "liseuse pocketbook", "kindle", "liseuse kindle", "kindle paperwhite", "paperwhite", "kobo libra colour", "kobo clara bw",
         "kobo clara colour", "kobo elipsa", "elipsa", "liseuse couleur", "liseuse étanche", "housse kobo",
         "coque kobo", "étui liseuse", "coque liseuse", "housse liseuse", "stylet kobo", "lire des ebooks",
         "lire des livres numériques", "livres numériques", "livre en numérique", "e-book", "epub", "lecture numérique",
         "tablette pour lire", "tablette de lecture", "pour lire au lit", "vivlio"],
    en: ["kindle", "kindle paperwhite", "paperwhite", "kobo libra colour", "kobo clara bw", "kobo elipsa",
         "colour e-reader", "waterproof e-reader", "kobo case", "e-reader case", "epub", "reading tablet"],
    es: ["kindle", "kindle paperwhite", "paperwhite", "kobo libra colour", "kobo clara bw", "kobo elipsa",
         "lector de ebooks a color", "funda kobo", "funda para lector", "epub", "tableta para leer"]
  },
  pcwindows: {
    fr: ["rayon micro", "micro-informatique", "micro informatique", "rayon pc", "rayon ordinateur", "azus", "lénovo", "acère", "ordinateur dèl", "hache pé", "ordinateurs portables", "pc portables", "portable avec un grand écran", "pc avec un grand écran", "ordinateur avec un grand écran", "acer aspire", "acer swift go", "swift go", "pc copilot plus", "copilot+ pc", "windows 12", "ordinateur portable 2026", "ordinnateur", "ordinatteur", "pécé", "l'ordi", "un ordi", "ordi portable", "ordinateur de bureau", "pc de bureau", "ordinateur fixe",
         "ordinateur pour l'école", "ordinateur pour les études", "ordinateur pour mes études", "pc pour étudiant",
         "ordinateur étudiant", "pc étudiant", "ordinateur pour travailler", "pc pour le travail",
         "ordinateur pour le bureau", "pc pour la maison", "ordinateur familial", "ordinateur pour internet",
         "ordinateur simple", "ordinateur pas cher", "pc pas cher", "pc portable pas cher", "pc 13 pouces",
         "pc 14 pouces", "pc 15 pouces", "pc 16 pouces", "pc 17 pouces", "pc portable 15 pouces",
         "pc portable 17 pouces", "ordinateur léger", "pc léger", "pc tactile", "pc convertible", "2 en 1",
         "pc hybride", "asus zenbook", "zenbook", "asus vivobook", "vivobook", "lenovo ideapad", "ideapad",
         "thinkpad", "lenovo yoga", "hp pavilion", "pavilion", "hp envy", "hp elitebook",
         "hp omnibook", "omnibook", "acer aspire", "acer swift", "dell xps", "xps",
         "dell inspiron", "inspiron", "msi modern", "samsung galaxy book", "galaxy book", "surface laptop",
         "copilot pc", "pc copilot", "snapdragon", "snapdragon x", "pc ia", "ordinateur ia", "windows 10",
         "word", "excel", "powerpoint", "office", "office 2024", "pack office famille", "microsoft office",
         "licence windows", "clé windows", "norton", "mcafee", "kaspersky", "bitdefender", "eset", "avast",
         "antivirus norton", "protection antivirus", "logiciel antivirus", "sac ordinateur", "sac pour pc",
         "sacoche pc", "sacoche pc portable", "housse pc portable", "sac à dos ordinateur", "chargeur ordi",
         "chargeur universel pc portable", "chargeur hp", "chargeur lenovo", "chargeur asus", "chargeur dell",
         "ventilateur pc portable", "support refroidissant"],
    en: ["desktop", "home computer", "office computer", "student laptop", "laptop for school",
         "laptop for university", "laptop for work", "cheap laptop", "13 inch laptop", "14 inch laptop",
         "15 inch laptop", "17 inch laptop", "lightweight laptop", "touchscreen laptop", "2 in 1 laptop",
         "convertible laptop", "zenbook", "vivobook", "ideapad", "thinkpad", "lenovo yoga", "hp pavilion", "hp envy",
         "omnibook", "acer aspire", "acer swift", "dell xps", "inspiron", "galaxy book", "surface laptop",
         "copilot pc", "snapdragon", "ai pc", "word", "excel", "powerpoint", "office", "microsoft office",
         "windows licence", "norton", "mcafee", "kaspersky", "bitdefender", "avast", "computer bag",
         "universal laptop charger"],
    es: ["ordenador de mesa", "portátil para estudiantes", "portátil para la universidad", "portátil para trabajar",
         "portátil barato", "portátil 14 pulgadas", "portátil 15 pulgadas", "portátil ligero", "portátil táctil",
         "portátil convertible", "2 en 1", "zenbook", "vivobook", "ideapad", "thinkpad", "lenovo yoga",
         "hp pavilion", "acer aspire", "dell xps", "galaxy book", "surface laptop", "copilot pc", "snapdragon",
         "word", "excel", "office", "microsoft office", "licencia windows", "norton", "mcafee", "kaspersky",
         "bitdefender", "bolsa para portátil", "cargador universal portátil"]
  },
  trottinettes: {
    fr: ["rayon mobilité", "mobilité", "nine bot", "over board", "hover board", "ségouai", "pure electric", "trottinette pure", "dualtron", "kaabo", "inokim", "wispeed", "urbanglide", "beeper", "e twow", "kugoo", "navee", "se déplacer", "transport électrique", "moyen de transport", "aller au travail", "aller au lycée", "aller à la fac", "trajet domicile travail", "déplacements urbains", "vélotaf", "mobilité électrique", "trotinnette", "trotinet", "trotinette électrique", "ninebot max g3", "xiaomi scooter 5", "segway gt3", "trott", "trottinette xiaomi", "xiaomi electric scooter", "trottinette ninebot", "ninebot max",
         "segway ninebot", "ninebot g30", "ninebot f2", "ninebot e2", "trottinette pliable", "trottinette adulte",
         "trottinette pour ado", "trottinette électrique enfant", "trottinette tout terrain", "trottinette puissante",
         "trottinette légère", "trottinette pas chère", "vélo", "vélo à assistance électrique", "vae",
         "vélo électrique pliant", "vélo de ville", "draisienne électrique", "gyropode", "skate électrique",
         "overboard", "gyroskate", "hoverboard enfant", "kart hoverboard", "casque vélo électrique", "casque urbain",
         "casque connecté", "casque avec clignotants", "livall", "gilet réfléchissant", "gilet jaune",
         "éclairage vélo", "lumière vélo", "lampe vélo", "feu arrière", "clignotants trottinette",
         "sacoche trottinette", "sac trottinette", "chambre à air", "pneu plein", "pneu vélo", "garde-boue",
         "rétroviseur trottinette", "béquille trottinette", "antivol trottinette", "cadenas", "chaîne antivol",
         "antivol en u", "u antivol", "compresseur portable", "gonfleur électrique", "pompe électrique",
         "se déplacer en ville", "aller au travail en trottinette"],
    en: ["pure electric", "dualtron", "kaabo", "inokim", "navee", "xiaomi electric scooter", "ninebot max", "segway ninebot", "folding scooter", "adult scooter",
         "off road scooter", "bike", "bicycle", "city bike", "electric skateboard", "hoverboard kart", "smart helmet",
         "livall", "hi vis vest", "reflective vest", "bike light", "bike lights", "rear light", "scooter bag",
         "inner tube", "solid tyre", "mudguard", "scooter mirror", "d lock", "chain lock", "electric pump",
         "portable compressor", "commute"],
    es: ["patinete xiaomi", "ninebot max", "segway ninebot", "patinete plegable", "patinete para adultos",
         "patinete todoterreno", "bici", "bicicleta", "bici eléctrica", "bicicleta de ciudad", "kart hoverboard",
         "casco inteligente", "livall", "chaleco reflectante", "luz de bici", "luces de bici", "bolsa patinete",
         "cámara de aire", "neumático macizo", "guardabarros", "retrovisor patinete", "candado en u",
         "cadena antirrobo", "bomba eléctrica", "compresor portátil"]
  },
  photo: {
    fr: ["rayon vidéo", "rayon photo vidéo", "vidéo et photo", "fuji film", "fuji", "appareil fuji", "polaroïde", "nikkon", "canone", "go pro hero", "insta 360", "leica", "ricoh", "manfrotto", "joby", "gorillapod", "peak design", "lowepro", "hama", "zhiyun", "saramonic", "boya", "sony alpha 7", "appareil photo sony", "appareil sony", "appareil photo canon", "appareil photo nikon", "gopro hero 14", "dji osmo 360", "osmo 360", "dji mini 5 pro", "dji osmo pocket 4", "osmo pocket 4", "instax mini 13", "instax wide evo", "fujifilm x-e5", "x-e5", "canon eos r50 v", "sony zv-e10 ii", "insta 360", "go pro 14", "goprot", "appareil foto", "appareil photo pour débutant", "appareil photo pas cher", "appareil photo enfant", "appareil photo vlog",
         "canon eos", "eos r50", "eos r10", "eos r6", "canon r50", "sony zv-e10", "zv-e10", "sony zv-1", "zv1",
         "sony a7", "a7 iv", "sony a6400", "fujifilm x100", "x100vi", "fujifilm x-t50", "xt5", "nikon z50", "nikon z",
         "nikon zf", "lumix g", "om system", "ricoh gr", "instax mini", "instax mini 12", "instax mini 41",
         "instax wide", "instax square", "instax mini evo", "instax pal", "papier instax", "film instax",
         "recharge instax", "cartouche instax", "pellicule", "pellicules", "pellicule photo", "argentique",
         "appareil argentique", "appareil photo argentique", "kodak", "kodak ektar", "appareil jetable kodak",
         "polaroid now", "polaroid go", "film polaroid", "photo instantanée", "imprimante instax",
         "instax mini link", "kodak mini", "canon selphy", "selphy", "imprimante photo smartphone",
         "gopro hero", "gopro hero 13", "hero 13", "gopro hero 12", "gopro max", "insta360 x5", "insta360 x4",
         "insta360 go", "caméra 360", "dji mini 4 pro", "dji mini 5", "dji mini", "dji neo", "dji flip", "dji avata",
         "drone avec caméra", "drone pour enfant", "drone pas cher", "dji osmo pocket 3", "osmo pocket 3",
         "osmo pocket", "dji osmo mobile", "osmo mobile", "osmo action", "dji action", "dji mic", "dji mic 2",
         "dji mic mini", "rode wireless go", "wireless go", "micro sans fil", "micro pour téléphone",
         "micro pour smartphone", "micro pour faire des vidéos",
         "micro youtube", "micro tiktok", "micro pour tiktok", "micro interview", "micro canon", "rode videomicro",
         "micro caméra", "anneau lumineux", "ring light", "lampe ring", "lampe led vidéo", "éclairage vidéo",
         "panneau led", "stabilisateur smartphone", "gimbal téléphone", "perche gopro",
         "caisson étanche", "fixation gopro", "harnais gopro", "support casque gopro", "batterie gopro",
         "carte sd 128 go", "carte sd 64 go", "carte sd rapide", "sandisk extreme", "lexar", "trépied téléphone photo",
         "trépied appareil photo", "jumelle", "jumelles de randonnée", "caméscope",
         "caméra vidéo", "webcam de voyage", "cadre photo connecté", "cadre numérique",
         "photos souvenirs", "faire des photos", "photographie", "sac à dos photo", "dragonne appareil photo",
         "chiffonnette objectif", "objectif canon", "objectif sony", "objectif 50mm", "50mm", "filtre nd", "filtre uv"],
    en: ["leica", "ricoh", "manfrotto", "joby", "peak design", "lowepro", "zhiyun", "sony camera", "canon camera", "nikon camera", "beginner camera", "vlog camera", "canon eos", "eos r50", "sony zv-e10", "zv-e10", "sony a7",
         "fujifilm x100", "x100vi", "nikon z50", "ricoh gr", "instax mini", "instax mini 12", "instax wide",
         "instax film", "camera film", "35mm film", "film camera", "kodak", "polaroid now", "polaroid film",
         "instant film", "instax printer", "canon selphy", "gopro hero", "gopro hero 13", "insta360 x5",
         "360 camera", "dji mini 4 pro", "dji mini", "dji neo", "dji flip", "camera drone", "osmo pocket 3",
         "osmo pocket", "osmo mobile", "osmo action", "dji mic", "dji mic 2", "rode wireless go", "wireless mic",
         "phone microphone", "ring light", "video light", "led panel", "phone gimbal",
         "gopro mount", "gopro battery", "sandisk extreme", "lexar", "camera tripod", "camcorder",
         "video camera", "digital frame", "photography", "50mm lens", "nd filter", "uv filter"],
    es: ["cámara para principiantes", "cámara para vlog", "canon eos", "eos r50", "sony zv-e10", "zv-e10",
         "fujifilm x100", "nikon z50", "instax mini", "instax mini 12", "papel instax", "carrete", "carretes",
         "cámara analógica", "kodak", "polaroid now", "película polaroid", "impresora instax", "canon selphy",
         "gopro hero", "gopro hero 13", "insta360 x5", "cámara 360", "dji mini 4 pro", "dji mini", "dji neo",
         "dron con cámara", "osmo pocket 3", "osmo pocket", "osmo mobile", "dji mic", "dji mic 2",
         "rode wireless go", "micrófono inalámbrico", "micrófono para móvil", "aro de luz", "anillo de luz",
         "luz de vídeo", "estabilizador para móvil", "soporte gopro", "batería gopro", "sandisk extreme",
         "trípode para cámara", "videocámara", "marco digital", "fotografía", "objetivo 50mm",
         "filtro nd"]
  },
  tv: {
    fr: ["rayon image", "rayon télé", "rayon tv", "tv samsung", "télé samsung", "tv tcl", "télé tcl", "tv xiaomi", "télé xiaomi", "thomson", "tv thomson", "grundig", "optoma", "vogels", "meliconi", "one for all", "télé lg", "lg", "télé philips", "télé sony", "tv sony bravia", "projeter", "projeter un film", "projeter des films", "regarder netflix", "regarder des séries", "regarder le sport", "regarder la tv", "regarder youtube sur la télé", "rendre ma télé connectée", "télé connectée", "écran pour le salon", "cinéma dans le salon", "tv 2026", "télé 2026", "nouvelle télé", "samsung s95", "lg c6", "lg g6", "oled evo", "micro rgb", "tv micro led", "rgb mini led", "tévé", "té vé", "la télé du salon", "télévision connectée", "téloche", "écran géant", "tv 32 pouces", "tv 40 pouces", "tv 43 pouces", "tv 50 pouces", "tv 55 pouces", "tv 65 pouces",
         "tv 75 pouces", "tv 77 pouces", "tv 85 pouces", "tv 98 pouces", "tv 100 pouces", "32 pouces", "43 pouces",
         "50 pouces", "77 pouces", "85 pouces", "98 pouces", "100 pouces", "télé 4k", "télé oled", "tv oled",
         "tv qled", "tv mini led", "tv led", "neo qled", "tv lg oled", "lg oled", "lg c5", "lg c4", "lg g5",
         "samsung the frame", "the frame", "tv cadre", "the serif", "tv samsung 4k", "samsung s90",
         "samsung crystal", "tv philips ambilight", "ambilight", "tv sony", "bravia", "tv tcl mini led",
         "tv hisense", "tv xiaomi", "tv panasonic", "tv google", "google tv", "android tv", "tv 120 hz",
         "tv 144 hz", "tv gaming", "tv pour ps5", "télé pour jouer", "tv pour la chambre", "tv pour la cuisine",
         "petite tv", "grande télé", "grande tv", "grand écran", "grand écran pour le salon", "écran plat",
         "télé pour regarder le foot", "regarder des films", "regarder la télé", "fire tv", "fire tv stick 4k",
         "roku", "clé chromecast", "google tv streamer", "chromecast google tv", "box tv", "boîtier tv",
         "décodeur", "adaptateur tnt", "tnt", "tnt hd", "antenne intérieure", "antenne tnt", "antenne râteau",
         "démodulateur", "câble coaxial", "fixation murale tv", "support tv orientable", "support tv plafond",
         "meuble télé", "vidéoprojecteur portable", "mini projecteur", "projecteur 4k", "projecteur home cinéma",
         "xgimi", "samsung freestyle", "freestyle", "epson projecteur", "benq", "écran de projection motorisé",
         "toile de projection", "cinéma à la maison", "télécommande samsung", "télécommande lg",
         "télécommande philips", "télécommande sony", "télécommande de télé"],
    en: ["samsung tv", "tcl tv", "sony tv", "philips tv", "lg", "32 inch tv", "40 inch tv", "43 inch tv", "50 inch tv", "65 inch tv", "85 inch tv", "98 inch tv",
         "32 inch", "43 inch", "50 inch", "85 inch", "98 inch", "oled tv", "qled tv", "mini led tv", "neo qled",
         "lg oled", "lg c5", "the frame", "samsung the frame", "ambilight", "bravia", "google tv", "android tv",
         "120hz tv", "gaming tv", "bedroom tv", "big tv", "big screen", "flat screen", "fire tv", "roku",
         "tv box", "freeview", "indoor aerial", "coaxial cable", "tv wall bracket", "portable projector",
         "mini projector", "4k projector", "xgimi", "samsung freestyle", "benq", "projector screen", "home theater"],
    es: ["tv 32 pulgadas", "tv 43 pulgadas", "tv 50 pulgadas", "tv 65 pulgadas", "tv 85 pulgadas", "32 pulgadas",
         "43 pulgadas", "50 pulgadas", "85 pulgadas", "tv oled", "tv qled", "tv mini led", "neo qled", "lg oled",
         "the frame", "samsung the frame", "ambilight", "bravia", "google tv", "android tv", "tv gaming",
         "tele grande", "pantalla grande", "pantalla plana", "fire tv", "roku", "tdt", "antena interior",
         "cable coaxial", "soporte de pared tv", "proyector portátil", "mini proyector", "proyector 4k", "xgimi",
         "samsung freestyle", "benq", "pantalla para proyector", "cine en casa"]
  },
  audio: {
    fr: ["rayon son", "le son", "rayon audio", "rayon hi-fi", "sono", "une sono", "sono portable", "enceinte sono", "boze", "bosse casque", "bitz", "marshal", "bowers wilkins", "bowers and wilkins", "b&w", "teac", "lenco", "pioneer", "technics", "urbanista", "house of marley", "marley", "tivoli", "roberts", "enceinte sony", "casque sony", "écouteurs sony", "barre de son philips", "casque philips", "mettre du son", "son dans le salon", "sonoriser", "sonorisation", "ambiance musicale", "écouter la radio", "écouter des podcasts", "musique dans la voiture", "musique dans le train", "musique en marchant", "musique à la maison", "gros son", "basses", "bon son", "qualité audio", "hi-res", "vinyles à écouter", "écouter mes vinyles", "écouter mes cd", "sony wh-1000xm6", "wh-1000xm6", "bose quietcomfort ultra 2", "jbl flip 8", "jbl charge 6", "sonos arc ultra", "sonos era 100 pro", "ji bi elle", "jibiel", "gbl", "enceinte jibiel", "marchal", "bitz", "musique", "écouter de la musique", "pour écouter de la musique", "écouter mes musiques", "enceinte jbl", "jbl flip", "jbl flip 7", "jbl flip 6", "jbl charge", "jbl charge 6", "jbl charge 5",
         "jbl go", "jbl go 4", "jbl clip", "jbl xtreme", "jbl boombox", "jbl partybox", "partybox", "jbl tune",
         "jbl tour", "jbl live", "enceinte de soirée", "enceinte pour faire la fête", "enceinte avec lumière",
         "enceinte lumineuse", "grosse enceinte bluetooth", "enceinte puissante", "enceinte de salon",
         "enceinte douche", "enceinte pour la douche", "sony ult", "ult field", "ultimate ears", "ue boom",
         "wonderboom", "marshall emberton", "marshall stanmore", "marshall acton", "marshall major", "marshall motif",
         "bose soundlink", "soundlink", "bose quietcomfort", "quietcomfort", "qc ultra", "bose qc", "sony wh-1000xm5",
         "sony wh-1000xm6", "xm5", "xm6", "xm4", "sony wf-1000xm5", "sony wf", "sony ult wear", "galaxy buds",
         "galaxy buds 3", "galaxy buds 3 pro", "buds", "pixel buds", "nothing ear", "cmf buds", "soundcore",
         "soundcore liberty", "jabra", "sennheiser momentum", "momentum", "beats studio", "beats solo",
         "beats fit pro", "powerbeats", "beats studio buds", "casque beats", "écouteurs beats", "casque sport",
         "écouteurs sport", "écouteurs pour courir", "écouteurs de sport", "écouteurs à conduction osseuse",
         "conduction osseuse", "shokz", "openrun", "écouteurs ouverts", "écouteurs pour dormir",
         "écouteurs pour la piscine", "casque de natation", "casque pour la télé", "casque tv", "casque sans fil tv",
         "casque pour enfant", "casque bluetooth enfant", "casque qui isole", "casque avec réduction de bruit",
         "réduction de bruit active", "anc", "gros casque", "casque arceau", "casque circum-auriculaire",
         "casque supra-auriculaire", "casque fermé", "casque ouvert", "écouteurs intra", "petits écouteurs",
         "écouteurs pas chers", "étui de charge écouteurs", "embouts écouteurs", "sonos era 100", "sonos era 300",
         "sonos arc", "sonos arc ultra", "sonos beam", "sonos ray", "sonos ace", "sonos roam", "sonos move",
         "sub sonos", "barre de son samsung", "barre de son sony", "barre de son lg", "barre de son bose",
         "barre de son dolby atmos", "dolby atmos", "son pour la télé", "améliorer le son de la télé",
         "caisson de basse", "enceintes pour tv", "enceinte bibliothèque", "enceintes colonne", "ampli hifi",
         "ampli home cinéma", "yamaha", "denon", "marantz", "onkyo", "cambridge audio", "kef", "jamo", "klipsch",
         "platine vinyle bluetooth", "platine audio technica", "audio-technica", "audio technica", "pro-ject",
         "crosley", "tourne disque valise", "diamant platine", "cellule platine", "préampli phono",
         "enceintes pour platine", "mini chaîne", "micro chaîne", "chaîne hi-fi", "radio fm", "radio dab+", "dab+",
         "radio cd", "radio portable", "radio de cuisine", "radio internet", "radio vintage", "réveil lumineux",
         "réveil simulateur d'aube", "réveil enfant", "lecteur cd portable", "discman", "lecteur de cassette",
         "walkman cassette", "lecteur mp4", "casque dj", "contrôleur dj", "platine dj", "pioneer dj", "ddj",
         "numark", "hercules dj", "table de mixage dj", "micro karaoké bluetooth", "enceinte karaoké",
         "machine karaoké", "micro pour chanter", "chanter", "dictaphone numérique"],
    en: ["bowers wilkins", "technics", "pioneer", "sony headphones", "sony speaker", "philips headphones", "music", "listen to music", "sound", "jbl speaker", "jbl flip", "jbl charge", "jbl go", "jbl clip",
         "jbl partybox", "partybox", "party speaker", "loud speaker", "shower speaker", "sony ult",
         "ultimate ears", "ue boom", "wonderboom", "marshall emberton", "marshall stanmore", "marshall major",
         "bose soundlink", "bose quietcomfort", "quietcomfort", "qc ultra", "sony wh-1000xm5", "xm5", "xm6",
         "sony wf", "galaxy buds", "pixel buds", "nothing ear", "soundcore", "jabra", "sennheiser momentum",
         "beats studio", "beats solo", "beats fit pro", "powerbeats", "sports earbuds", "running headphones",
         "bone conduction", "shokz", "openrun", "open earbuds", "sleep earbuds", "tv headphones",
         "kids headphones", "anc", "over ear headphones", "on ear headphones", "sonos era", "sonos arc", "sonos beam",
         "sonos ace", "sonos move", "dolby atmos", "tv sound", "bookshelf speakers", "floorstanding speakers",
         "yamaha", "denon", "marantz", "cambridge audio", "kef", "klipsch", "bluetooth turntable", "audio-technica",
         "pro-ject", "crosley", "turntable needle", "phono preamp", "micro hifi", "stereo system", "dab+",
         "portable radio", "internet radio", "sunrise alarm clock", "portable cd player", "discman",
         "cassette player", "dj headphones", "dj controller", "pioneer dj", "numark", "karaoke speaker", "singing"],
    es: ["música", "escuchar música", "sonido", "altavoz jbl", "jbl flip", "jbl charge", "jbl go", "jbl partybox",
         "partybox", "altavoz de fiesta", "altavoz potente", "altavoz para la ducha", "sony ult", "ultimate ears",
         "ue boom", "marshall emberton", "marshall major", "bose soundlink", "bose quietcomfort", "quietcomfort",
         "sony wh-1000xm5", "xm5", "xm6", "galaxy buds", "pixel buds", "nothing ear", "soundcore", "jabra",
         "beats studio", "beats solo", "auriculares deportivos", "auriculares para correr", "conducción ósea",
         "shokz", "auriculares abiertos", "auriculares para la tele", "anc", "auriculares de diadema", "sonos era",
         "sonos arc", "sonos beam", "sonos ace", "dolby atmos", "sonido para la tele", "altavoces de estantería",
         "yamaha", "denon", "marantz", "kef", "tocadiscos bluetooth", "audio-technica", "aguja tocadiscos",
         "preamplificador phono", "microcadena", "equipo de música", "dab+", "radio portátil", "radio por internet",
         "despertador con luz", "reproductor de cd portátil", "discman", "auriculares dj", "controlador dj",
         "pioneer dj", "altavoz karaoke", "cantar"]
  },
  apple: {
    fr: ["ail pad", "aïe pade", "ère pods", "air pode", "air podes", "ayfone", "aïe mac", "mac book pro", "iphone 18", "iphone 18 pro", "iphone 18 pro max", "iphone 18 air", "iphone 19", "iphone pliable", "iphone fold", "iphone flip", "prochain iphone", "futur iphone", "nouvel iphone précommande", "précommande iphone", "réserver un iphone", "précommander l'iphone", "sortie iphone", "quand sort l'iphone", "iphone 17e", "ipad pro m6", "ipad air m4", "macbook air m5", "macbook pro m6", "macbook pas cher", "airpods pro 4", "airpods 5", "apple watch series 12", "apple watch ultra 3", "apple watch ultra 4", "vision air", "apple tv 2026", "homepod 2026", "magic mouse usb c", "aifone", "aïfone", "aille fone", "i phone dix huit", "mac bouc", "macbouc", "air podes", "èr pods", "ipade", "aïe pad", "apple ouatch", "apple wotch", "iphone 13", "iphone 14", "iphone 16e", "iphone 17 pro", "iphone 17 pro max", "iphone 17 air", "iphone air",
         "iphone se", "iphone 16 plus", "iphone mini", "nouvel iphone", "dernier iphone", "iphone pas cher",
         "iphone d'occasion", "ipad 10", "ipad 11", "ipad a16", "ipad air m3", "ipad pro m4", "ipad pro m5",
         "ipad mini 7", "nouvel ipad", "airpods 4", "airpods pro 2", "airpods pro 3", "airpods max 2", "air pod",
         "airpod", "écouteurs iphone", "earpods", "macbook air m4", "macbook air m3", "macbook pro m4", "macbook pro m5",
         "mac mini m4", "imac m4", "ordinateur mac", "mac portable", "apple watch series 10", "apple watch series 11",
         "apple watch 11", "apple watch 10", "apple watch se 3", "montre iphone", "apple vision pro", "vision pro",
         "apple pencil pro", "apple pencil usb c", "stylet ipad", "stylet apple", "magic trackpad", "trackpad",
         "chargeur magsafe", "batterie magsafe", "coque magsafe", "chargeur 20w apple", "adaptateur secteur apple",
         "câble usb c iphone", "câble iphone", "câble pour iphone", "prise iphone", "adaptateur lightning jack",
         "adaptateur jack iphone", "airtag porte-clés", "porte-clés airtag", "coque airpods", "étui airpods",
         "housse macbook", "coque macbook", "sacoche macbook", "hub macbook", "adaptateur usb c macbook",
         "chargeur macbook", "chargeur ipad", "clavier magic keyboard", "protection écran iphone",
         "vitre iphone", "verre trempé ipad", "film iphone", "apple one", "apple music", "apple tv 4k",
         "homepod mini", "iphone de ma fille", "iphone pour mon fils", "macos", "ios", "la pomme",
         "marque à la pomme", "aïe phone", "aille phone", "ail phone", "i fone", "ifone", "iphon", "ipod touch"],
    en: ["iphone 18", "iphone 18 pro", "iphone fold", "foldable iphone", "next iphone", "iphone preorder", "preorder iphone", "iphone release date", "ipad pro m6", "macbook air m5", "airpods pro 4", "apple watch series 12", "apple watch ultra 3", "iphone 13", "iphone 14", "iphone 16e", "iphone 17 pro", "iphone 17 pro max", "iphone air", "iphone se",
         "new iphone", "latest iphone", "used iphone", "ipad 11", "ipad air m3", "ipad pro m4", "ipad mini 7",
         "airpods 4", "airpods pro 2", "airpods pro 3", "airpod", "earpods", "macbook air m4", "macbook pro m4",
         "mac mini m4", "apple watch series 10", "apple watch series 11", "apple watch se 3", "vision pro",
         "apple pencil pro", "magic trackpad", "trackpad", "magsafe charger", "magsafe battery", "magsafe case",
         "20w apple charger", "iphone cable", "usb c iphone cable", "airtag keyring", "airpods case", "macbook case",
         "macbook sleeve", "macbook hub", "macbook charger", "ipad charger", "iphone screen protector", "apple music",
         "apple tv 4k", "homepod mini", "macos", "ios"],
    es: ["iphone 18", "iphone 18 pro", "iphone plegable", "próximo iphone", "reservar iphone", "preventa iphone", "airpods pro 4", "apple watch series 12", "iphone 13", "iphone 14", "iphone 16e", "iphone 17 pro", "iphone 17 pro max", "iphone air", "iphone se",
         "nuevo iphone", "último iphone", "ipad 11", "ipad air m3", "ipad pro m4", "ipad mini 7", "airpods 4",
         "airpods pro 2", "airpods pro 3", "macbook air m4", "macbook pro m4", "mac mini m4", "apple watch series 10",
         "apple watch series 11", "vision pro", "apple pencil pro", "magic trackpad", "cargador magsafe",
         "batería magsafe", "funda magsafe", "cable iphone", "llavero airtag", "funda airpods", "funda macbook",
         "cargador macbook", "cargador ipad", "protector iphone", "apple music", "apple tv 4k", "homepod mini",
         "macos", "ios"]
  },
  jeuxSociete: {
    fr: ["apprendre à compter", "jeu pour apprendre", "apprendre à lire", "jeu d'apprentissage", "jeu montessori", "montessori", "goliath", "iello", "repos production", "days of wonder", "bombyx", "lansay", "dujardin", "jeu goliath", "casse-tête", "casse tête", "jeu casse-tête", "skyjo", "6 qui prend", "six qui prend", "bonanza",
         "codenames", "code names", "splendor", "les aventuriers du rail", "aventuriers du rail", "ticket to ride",
         "exploding kittens", "unlock", "escape game en boîte", "the mind", "just one", "love letter", "pandemic",
         "wingspan", "king of tokyo", "bang", "perudo", "yams", "yahtzee", "qwirkle", "rummikub", "pictionary",
         "taboo", "jenga", "puissance 4", "bataille navale", "docteur maboul", "jeu qui est-ce", "mastermind", "hanabi",
         "mysterium", "blanc manger coco", "limite limite", "cards against humanity", "trio", "cortex", "dixit odyssée",
         "kingdomino", "terraforming mars", "7 wonders duel", "harry potter jeu de société",
         "mölkky", "molkky", "flip 7", "jeu cafard", "cartatoto", "top ten", "dobble kids", "la bonne paye", "destins",
         "jeu de l'oie", "jeu de mémoire", "memory", "tangram", "jeu de logique", "jeu de stratégie",
         "jeu de société pour enfant", "jeu de société enfant", "jeu de société adulte", "jeu pour adulte",
         "jeu pour 2", "jeu à deux", "jeu à 2 joueurs", "jeu pour jouer à deux", "jeu entre amis", "jeu en famille",
         "jeu pour la famille", "soirée jeux", "jeu de société original", "jeu pour les vacances", "jeu de voyage",
         "jeu d'enquête", "jeu de quiz", "quiz", "jeu de questions", "jeu de culture générale", "ravensburger",
         "puzzle ravensburger", "clementoni", "asmodee", "gigamic", "hasbro", "mattel", "djeco", "smartgames",
         "puzzle 500 pièces", "puzzle 2000 pièces", "puzzle enfant", "puzzle adulte", "wasgij", "cube rubik",
         "rubik's", "speedcube", "jeu de cartes enfant", "jeu de tarot", "jeu de 54 cartes", "jeu de 32 cartes",
         "jetons de poker", "poker", "mallette de poker", "dés de jeu de rôle"],
    en: ["brain teaser puzzle", "skyjo", "codenames", "splendor", "ticket to ride", "exploding kittens", "unlock",
         "the mind", "just one", "love letter", "pandemic", "wingspan", "king of tokyo", "bang", "yahtzee", "qwirkle",
         "rummikub", "pictionary", "taboo", "jenga", "connect 4", "connect four", "battleship", "operation game",
         "guess who", "mastermind", "hanabi", "cards against humanity", "kingdomino", "terraforming mars",
         "molkky", "memory game", "logic game", "strategy game", "two player game",
         "family board game", "game night", "travel game", "quiz game", "trivia game", "ravensburger",
         "clementoni", "asmodee", "hasbro", "mattel", "500 piece puzzle", "2000 piece puzzle", "kids puzzle",
         "wasgij", "speedcube", "poker chips", "poker set"],
    es: ["rompecabezas de ingenio", "skyjo", "codenames", "splendor", "aventureros al tren", "exploding kittens",
         "unlock", "the mind", "just one", "pandemic", "wingspan", "king of tokyo", "bang", "yahtzee", "qwirkle",
         "rummikub", "pictionary", "tabú", "jenga", "conecta 4", "hundir la flota", "operación", "quién es quién",
         "mastermind", "hanabi", "kingdomino", "terraforming mars", "molkky", "juego de memoria",
         "juego de lógica", "juego de estrategia", "juego para dos", "juego en familia", "noche de juegos",
         "juego de viaje", "juego de preguntas", "ravensburger", "clementoni", "asmodee", "hasbro", "mattel",
         "puzle 500 piezas", "puzle 2000 piezas", "puzle infantil", "speedcube", "fichas de póker", "póker"]
  },
  savRetrait: {
    fr: ["faire livrer", "se faire livrer", "me faire livrer", "livrer à domicile", "livraison à domicile", "livrer chez moi", "colis pas arrivé", "pas reçu ma commande", "commande en retard", "suivre ma commande", "code de retrait ne marche pas", "perdu mon ticket", "réparateur", "réparer mon téléphone", "réparer mon ordinateur", "réparer mon ordi", "remplacement écran",
         "remplacer l'écran", "remplacer la batterie", "changer l'écran", "écran à changer", "batterie à changer",
         "pièce détachée", "pièces détachées", "prise en charge", "dépôt sav", "déposer au sav", "suivi sav",
         "suivi de réparation", "où en est ma réparation", "réparation terminée", "récupérer ma réparation",
         "appareil réparé", "garantie constructeur", "garantie légale", "sous garantie", "hors garantie",
         "assurance casse", "assurance vol", "assurance téléphone", "fnac darty assurance", "darty max",
         "service client", "service clients", "service après vente", "sav fnac", "retour fnac", "retourner un article",
         "rendre un article", "renvoyer un colis", "échange produit", "échange cadeau", "ticket cadeau", "bon d'échange",
         "avoir remboursement", "offre de remboursement", "odr", "remboursement différé", "bon de retour",
         "étiquette de retour", "retour colis", "colis fnac", "commande fnac", "commande internet",
         "commande sur le site", "commande en magasin", "retrait en magasin", "retrait magasin", "retrait 1h",
         "retrait en 1h", "retrait 1 heure", "livraison", "livraison en magasin", "livré en magasin",
         "venir chercher", "mise à disposition", "code de retrait", "numéro de commande", "bon de commande",
         "marketplace", "vendeur marketplace", "précommande à retirer", "réservation en ligne", "réserver en ligne",
         "réparation console", "réparation manette", "réparation tablette", "réparation iphone", "réparation ipad",
         "réparation macbook", "réparation pc portable", "réparation trottinette", "réparation télé",
         "réparation écouteurs", "réparation aspirateur", "installation", "configuration", "configurer",
         "paramétrer", "mettre en service", "installer windows", "réinstaller windows", "formater",
         "récupération de données", "transférer mes données", "transférer mes photos", "changer de téléphone données",
         "déverrouiller", "désimlocker", "débloquer mon téléphone", "reprise", "recyclage", "recycler",
         "rapporter un vieil appareil", "déposer un vieil appareil", "reprise ancien appareil", "reprise ancien téléphone"],
    en: ["repair service", "screen repair", "battery replacement", "spare parts", "repair status",
         "manufacturer warranty", "under warranty", "out of warranty", "phone insurance", "customer support",
         "returns", "gift receipt", "exchange a gift", "return label", "online order pickup", "store pickup",
         "click and collect order", "delivery", "collect in store", "order number", "pickup code", "setup",
         "set up my phone", "install windows", "data recovery", "transfer my data", "unlock my phone", "recycling",
         "recycle old device", "trade in"],
    es: ["servicio de reparación", "reparación de pantalla", "cambio de batería", "piezas de repuesto",
         "estado de la reparación", "garantía del fabricante", "en garantía", "fuera de garantía", "seguro de móvil",
         "devoluciones", "ticket regalo", "cambiar un regalo", "etiqueta de devolución", "recogida en tienda",
         "número de pedido", "código de recogida", "entrega", "configurar", "configurar mi móvil",
         "instalar windows", "recuperación de datos", "transferir mis datos", "desbloquear mi móvil", "reciclaje",
         "reciclar"]
  },
  caisse: {
    fr: ["carte bleue", "payer par carte bleue", "carte visa", "mastercard", "american express", "amex", "paypal", "lydia", "passer en caisse", "passer à la caisse", "où je paye", "où je paie", "où est-ce qu'on paye",
         "régler mes achats", "payer par carte", "payer en carte", "payer en espèces", "payer en liquide",
         "payer avec mon téléphone", "paiement mobile", "paiement sans contact", "payer par chèque", "chèque",
         "ticket de caisse perdu", "duplicata ticket", "reçu",
         "facture pro", "facture entreprise", "achat professionnel", "carte cadeau fnac darty", "recharger une carte cadeau",
         "solde carte cadeau", "offrir une carte cadeau", "emballer un cadeau", "paquet cadeau", "faire un paquet cadeau",
         "piles aa", "piles aaa", "piles lr6", "piles lr03", "pile lr6", "pile lr03", "pile cr2032",
         "cr2032", "piles 9v", "pile plate", "piles pour télécommande", "piles duracell", "duracell", "energizer",
         "adaptateur prise anglaise", "adaptateur prise us", "adaptateur pour l'étranger", "adaptateur voyage",
         "prise de voyage", "prise pour l'angleterre", "prise pour les états-unis", "adaptateur universel voyage"],
    en: ["pay here", "where do i pay", "pay by card", "pay cash", "mobile payment", "cheque",
         "lost receipt", "receipt copy", "vat invoice", "business invoice", "gift card balance", "gift wrap", "aa battery", "aaa batteries", "cr2032", "9v battery", "duracell", "energizer",
         "uk adapter", "us adapter", "european adapter", "universal travel adapter"],
    es: ["pasar por caja", "dónde se paga", "pagar con tarjeta", "pagar en efectivo", "pago móvil", "cheque",
         "ticket perdido", "factura de empresa", "saldo tarjeta regalo", "envolver para regalo", "pilas aa", "pilas aaa", "cr2032", "pila de 9v", "duracell", "energizer", "adaptador inglés",
         "adaptador americano", "adaptador universal de viaje"]
  },
  adhesion: {
    fr: ["je veux payer en 10 fois", "je veux payer en 3 fois", "je veux payer en 4 fois", "avantages de la carte fnac", "prix de la carte fnac", "payer en 4 fois", "payer en quatre fois", "en 4 fois", "en 3 fois", "en 10 fois", "en 12 fois", "payer en 12 fois", "paiement échelonné", "facilité de paiement", "fnac+", "carte fnac+", "fnac plus carte", "carte fnac darty", "carte one", "fnac one", "adhérer",
         "je veux adhérer", "devenir membre", "cumuler des points", "cagnotte", "cagnotte adhérent", "chèque fidélité",
         "chèque cadeau adhérent", "bon d'achat adhérent", "remise adhérent", "prix adhérent", "tarif adhérent",
         "livraison gratuite adhérent", "carte gratuite", "carte fnac gratuite", "carte payante",
         "résilier ma carte", "résilier fnac+", "carte expirée", "numéro adhérent", "oublié ma carte",
         "compte adhérent", "4 fois sans frais", "3 fois sans frais", "10 fois", "payer en 4 fois sans frais",
         "payer en 3 fois sans frais", "payer en 10 fois", "4x sans frais", "3x sans frais", "paiement fractionné",
         "crédit conso", "crédit consommation", "cetelem", "carte cetelem", "carte fnac visa", "carte de crédit fnac",
         "étaler le paiement", "étaler mes paiements", "payer plus tard", "payer en plusieurs mensualités",
         "mensualités", "financer un achat", "abonnement fnac", "offre étudiant"],
    en: ["fnac plus card", "join the loyalty programme", "collect points", "member price", "cancel membership",
         "member number", "pay in 4 instalments", "pay in 3", "buy now pay later", "spread the cost", "monthly payments",
         "consumer credit", "cetelem", "student discount"],
    es: ["tarjeta fnac plus", "hacerme socio", "acumular puntos", "precio socio", "cancelar la tarjeta",
         "número de socio", "pagar en 4 plazos", "pago aplazado", "cuotas mensuales", "financiar una compra",
         "crédito al consumo", "cetelem", "descuento estudiante"]
  },
  editorial: {
    fr: ["autre fnac", "l'autre fnac", "fnac wilson", "adresse fnac wilson", "l'adresse de la fnac wilson", "autre magasin fnac", "l'autre magasin", "fnac de wilson", "fnac place wilson", "fnac jean jaurès", "astérix", "asterix", "tintin", "gaston lagaffe", "lucky luke", "les schtroumpfs", "spirou",
         "blake et mortimer", "largo winch", "thorgal", "xiii", "les sisters", "mortelle adèle", "l'arabe du futur",
         "dragon ball", "demon slayer", "jujutsu kaisen", "my hero academia", "l'attaque des titans",
         "attaque des titans", "chainsaw man", "blue lock", "spy x family", "harry potter", "le seigneur des anneaux",
         "le petit prince", "hunger games", "guillaume musso", "musso", "joël dicker", "stephen king", "fred vargas",
         "michel bussi", "virginie grimaldi", "marc levy", "franck thilliez", "freida mcfadden", "colleen hoover",
         "le dernier livre", "roman policier", "livre de recettes", "livre pour enfant", "livres pour enfants", "coloriage",
         "livre de coloriage", "cahier d'activités", "livre de révision", "bescherelle", "le petit robert",
         "larousse", "guide michelin", "carte routière", "bd manga", "shonen", "seinen", "webtoon", "light novel",
         "album de musique", "cd de musique", "disque", "coffret vinyle", "blu ray", "film en dvd",
         "série en dvd", "dvd enfant", "dessin animé dvd", "livre audio cd", "partition", "partitions",
         "fournitures scolaires", "rentrée scolaire", "kit de rentrée",
         "carte de voeux", "carte d'anniversaire", "étiquettes cadeau", "calligraphie",
         "aquarelle", "loisirs créatifs", "carnet de croquis"],
    en: ["asterix", "tintin", "harry potter", "lord of the rings", "demon slayer", "jujutsu kaisen", "stephen king",
         "colleen hoover", "freida mcfadden", "cookbook", "colouring book", "coloring book", "activity book", "revision guide", "music album",
         "music cd", "blu ray", "sheet music", "school supplies", "back to school", "greeting card",
         "birthday card", "sketchbook", "art supplies", "watercolour"],
    es: ["astérix", "tintín", "harry potter", "el señor de los anillos", "demon slayer", "stephen king",
         "libro de recetas", "libro para colorear", "cuaderno de actividades", "disco de música", "cd de música",
         "partitura", "material escolar", "vuelta al cole", "tarjeta de felicitación",
         "tarjeta de cumpleaños", "cuaderno de dibujo", "acuarela", "manualidades"]
  }
};

for (const [key, words] of Object.entries(SPOKEN)) {
  const [id, place] = key.split(".");
  const target = place ? ZONES[id].places[place].keywords : ZONES[id].keywords;
  for (const [lang, list] of Object.entries(words)) target[lang].push(...list);
}

// =====================================================================
// Demandes vagues : Jeanne pose une question au lieu de deviner.
// « un casque » peut être un casque audio, gamer, de réalité virtuelle ou
// de vélo. La question n'est posée que si le client a dit le mot seul :
// « casque gamer » ou « casque pour mon iPhone » vont directement au rayon.
// - words   : le mot vague, par langue (écrit comme dans la question du client)
// - question: ce que Jeanne dit (les choix sont cités pour qu'on puisse
//             répondre à voix haute)
// - options : un bouton par choix ; "say" = mots qui choisissent l'option
//             quand le client répond au micro
// =====================================================================
export const CLARIFY = [
  {
    words: { fr: ["casque", "casques"], en: ["helmet"], es: ["casco", "cascos"] },
    question: {
      fr: "Quel genre de casque ? Pour écouter de la musique, pour jouer, de réalité virtuelle, ou pour le vélo et la trottinette ?",
      en: "What kind? Headphones for music, a gaming headset, a VR headset, or a bike and scooter helmet?",
      es: "¿Qué tipo de casco? ¿Para escuchar música, para jugar, de realidad virtual o para bici y patinete?"
    },
    options: [
      { zone: "audio", label: { fr: "Musique", en: "Music", es: "Música" },
        say: { fr: ["musique", "audio", "ecouter", "bluetooth"], en: ["music", "headphones", "audio"], es: ["musica", "escuchar", "audio"] } },
      { zone: "accessoiresGaming", place: "accessoires", label: { fr: "Pour jouer (gamer)", en: "Gaming", es: "Para jugar" },
        say: { fr: ["jouer", "gamer", "gaming", "jeu", "pc"], en: ["gaming", "gamer", "game"], es: ["jugar", "gaming", "gamer"] } },
      { zone: "gaming", label: { fr: "Réalité virtuelle", en: "VR headset", es: "Realidad virtual" },
        say: { fr: ["realite", "virtuelle", "vr", "quest"], en: ["vr", "virtual", "reality", "quest"], es: ["realidad", "virtual", "vr"] } },
      { zone: "trottinettes", label: { fr: "Vélo & trottinette", en: "Bike & scooter", es: "Bici y patinete" },
        say: { fr: ["velo", "trottinette", "trottinettes", "protection", "tete"], en: ["bike", "scooter", "cycling"], es: ["bici", "bicicleta", "patinete"] } }
    ]
  },
  {
    words: { fr: ["chargeur", "chargeurs"], en: ["charger", "chargers"], es: ["cargador", "cargadores"] },
    question: {
      fr: "Un chargeur pour quel appareil ? Un téléphone Android, un iPhone ou un produit Apple, un ordinateur portable, ou une trottinette ?",
      en: "A charger for which device? An Android phone, an iPhone or Apple product, a laptop, or a scooter?",
      es: "¿Un cargador para qué aparato? ¿Un móvil Android, un iPhone o producto Apple, un portátil o un patinete?"
    },
    options: [
      { zone: "telephonie", label: { fr: "Téléphone Android", en: "Android phone", es: "Móvil Android" },
        say: { fr: ["android", "samsung", "telephone", "portable", "xiaomi"], en: ["android", "samsung", "phone"], es: ["android", "samsung", "movil", "telefono"] } },
      { zone: "apple", label: { fr: "iPhone, iPad, Mac", en: "iPhone, iPad, Mac", es: "iPhone, iPad, Mac" },
        say: { fr: ["iphone", "ipad", "apple", "mac", "macbook", "airpods"], en: ["iphone", "ipad", "apple", "mac"], es: ["iphone", "ipad", "apple", "mac"] } },
      { zone: "pcwindows", label: { fr: "Ordinateur portable", en: "Laptop", es: "Portátil" },
        say: { fr: ["ordinateur", "ordi", "pc"], en: ["laptop", "computer", "pc"], es: ["portatil", "ordenador", "pc"] } },
      { zone: "trottinettes", label: { fr: "Trottinette", en: "Scooter", es: "Patinete" },
        say: { fr: ["trottinette", "velo"], en: ["scooter", "bike"], es: ["patinete", "bici"] } }
    ]
  },
  {
    words: { fr: ["câble", "câbles", "cable", "cables"], en: ["cable", "cables", "lead"], es: ["cable", "cables"] },
    question: {
      fr: "Quel câble ? Pour un téléphone, pour un iPhone, un câble HDMI, USB ou réseau pour l'ordinateur ou la télé, ou un câble audio ?",
      en: "Which cable? For a phone, for an iPhone, an HDMI, USB or network cable for a computer or TV, or an audio cable?",
      es: "¿Qué cable? ¿Para un móvil, para un iPhone, un cable HDMI, USB o de red para ordenador o tele, o un cable de audio?"
    },
    options: [
      { zone: "telephonie", label: { fr: "Téléphone", en: "Phone", es: "Móvil" },
        say: { fr: ["telephone", "android", "samsung", "charge"], en: ["phone", "android", "charging"], es: ["movil", "telefono", "android", "carga"] } },
      { zone: "apple", label: { fr: "iPhone, iPad, Mac", en: "iPhone, iPad, Mac", es: "iPhone, iPad, Mac" },
        say: { fr: ["iphone", "ipad", "apple", "mac", "lightning"], en: ["iphone", "ipad", "apple", "lightning"], es: ["iphone", "ipad", "apple"] } },
      { zone: "informatique", label: { fr: "HDMI, USB, réseau", en: "HDMI, USB, network", es: "HDMI, USB, red" },
        say: { fr: ["hdmi", "usb", "reseau", "ethernet", "ordinateur", "tele", "tv"], en: ["hdmi", "usb", "network", "ethernet", "computer", "tv"], es: ["hdmi", "usb", "red", "ethernet", "ordenador", "tele"] } },
      { zone: "audio", place: "adaptateurs", label: { fr: "Audio (jack, optique)", en: "Audio (jack, optical)", es: "Audio (jack, óptico)" },
        say: { fr: ["audio", "jack", "optique", "son", "enceinte"], en: ["audio", "jack", "optical", "sound"], es: ["audio", "jack", "optico", "sonido"] } }
    ]
  },
  {
    words: { fr: ["écran", "écrans", "ecran"], en: ["screen", "screens"], es: ["pantalla", "pantallas"] },
    question: {
      fr: "Quel écran ? Un écran pour ordinateur, une télévision, ou une protection d'écran pour téléphone ?",
      en: "Which screen? A computer monitor, a TV, or a phone screen protector?",
      es: "¿Qué pantalla? ¿Un monitor de ordenador, una tele o un protector de pantalla para móvil?"
    },
    options: [
      { zone: "accessoiresGaming", place: "pc", label: { fr: "Écran d'ordinateur", en: "Computer monitor", es: "Monitor" },
        say: { fr: ["ordinateur", "pc", "moniteur", "gamer", "bureau"], en: ["computer", "monitor", "pc", "gaming"], es: ["ordenador", "monitor", "pc"] } },
      { zone: "tv", label: { fr: "Télévision", en: "TV", es: "Televisión" },
        say: { fr: ["tele", "television", "tv", "salon"], en: ["tv", "television"], es: ["tele", "television", "tv"] } },
      { zone: "telephonie", label: { fr: "Protection de téléphone", en: "Phone protector", es: "Protector de móvil" },
        say: { fr: ["protection", "telephone", "verre", "film"], en: ["protector", "phone", "glass"], es: ["protector", "movil", "cristal"] } }
    ]
  },
  {
    words: { fr: ["montre", "montres"], en: ["watch", "watches"], es: ["reloj", "relojes"] },
    question: {
      fr: "Quelle montre ? Une Apple Watch, ou une autre montre connectée comme Samsung ou Garmin ?",
      en: "Which watch? An Apple Watch, or another smartwatch like Samsung or Garmin?",
      es: "¿Qué reloj? ¿Un Apple Watch u otro reloj inteligente como Samsung o Garmin?"
    },
    options: [
      { zone: "apple", label: { fr: "Apple Watch", en: "Apple Watch", es: "Apple Watch" },
        say: { fr: ["apple", "iphone"], en: ["apple", "iphone"], es: ["apple", "iphone"] } },
      { zone: "objets", label: { fr: "Samsung, Garmin, autres", en: "Samsung, Garmin, others", es: "Samsung, Garmin, otros" },
        say: { fr: ["samsung", "garmin", "autre", "android", "sport", "connectee"], en: ["samsung", "garmin", "other", "android", "sport"], es: ["samsung", "garmin", "otro", "android", "deporte"] } }
    ]
  },
  {
    words: { fr: ["tablette", "tablettes"], en: ["tablet", "tablets"], es: ["tableta", "tabletas", "tablet"] },
    question: {
      fr: "Quelle tablette ? Un iPad, une tablette Android comme Samsung, ou une liseuse pour lire des livres ?",
      en: "Which tablet? An iPad, an Android tablet like Samsung, or an e-reader for books?",
      es: "¿Qué tableta? ¿Un iPad, una tableta Android como Samsung o un lector de libros?"
    },
    options: [
      { zone: "apple", label: { fr: "iPad", en: "iPad", es: "iPad" },
        say: { fr: ["ipad", "apple"], en: ["ipad", "apple"], es: ["ipad", "apple"] } },
      { zone: "tablettes", label: { fr: "Android (Samsung…)", en: "Android (Samsung…)", es: "Android (Samsung…)" },
        say: { fr: ["android", "samsung", "lenovo", "xiaomi", "enfant"], en: ["android", "samsung", "lenovo"], es: ["android", "samsung", "lenovo"] } },
      { zone: "liseuses", label: { fr: "Liseuse", en: "E-reader", es: "Lector de libros" },
        say: { fr: ["liseuse", "lire", "livre", "livres", "kobo", "kindle"], en: ["ereader", "reader", "read", "books", "kobo", "kindle"], es: ["lector", "leer", "libros", "kobo"] } }
    ]
  },
  {
    words: { fr: ["ordinateur", "ordinateurs", "ordi", "pc", "ordinateur portable", "pc portable", "ordi portable"],
             en: ["computer", "laptop", "pc"], es: ["ordenador", "portátil", "pc"] },
    question: {
      fr: "Quel ordinateur ? Un PC Windows, un Mac, ou un PC gamer pour jouer ?",
      en: "Which computer? A Windows PC, a Mac, or a gaming PC?",
      es: "¿Qué ordenador? ¿Un PC Windows, un Mac o un PC gaming?"
    },
    options: [
      { zone: "pcwindows", label: { fr: "PC Windows", en: "Windows PC", es: "PC Windows" },
        say: { fr: ["windows", "normal", "travail", "etudes", "bureautique", "classique"], en: ["windows", "work", "school", "normal"], es: ["windows", "trabajo", "estudios", "normal"] } },
      { zone: "apple", label: { fr: "Mac", en: "Mac", es: "Mac" },
        say: { fr: ["mac", "macbook", "apple", "imac"], en: ["mac", "macbook", "apple"], es: ["mac", "macbook", "apple"] } },
      { zone: "accessoiresGaming", place: "pc", label: { fr: "PC gamer", en: "Gaming PC", es: "PC gaming" },
        say: { fr: ["gamer", "gaming", "jouer", "jeux", "jeu"], en: ["gaming", "gamer", "games"], es: ["gaming", "gamer", "jugar", "juegos"] } }
    ]
  },
  {
    words: { fr: ["clavier", "claviers"], en: ["keyboard", "keyboards"], es: ["teclado", "teclados"] },
    question: {
      fr: "Un clavier pour quoi ? Pour un ordinateur, ou pour un iPad ?",
      en: "A keyboard for what? For a computer, or for an iPad?",
      es: "¿Un teclado para qué? ¿Para un ordenador o para un iPad?"
    },
    options: [
      { zone: "accessoiresGaming", place: "accessoires", label: { fr: "Ordinateur", en: "Computer", es: "Ordenador" },
        say: { fr: ["ordinateur", "ordi", "pc", "gamer", "bureau"], en: ["computer", "pc", "gaming"], es: ["ordenador", "pc", "gaming"] } },
      { zone: "apple", label: { fr: "iPad, Mac", en: "iPad, Mac", es: "iPad, Mac" },
        say: { fr: ["ipad", "apple", "mac"], en: ["ipad", "apple", "mac"], es: ["ipad", "apple", "mac"] } }
    ]
  },
  {
    words: { fr: ["coque", "coques", "étui", "housse", "protection"], en: ["case", "cases", "cover"], es: ["funda", "fundas", "carcasa"] },
    question: {
      fr: "Une protection pour quel appareil ? Un iPhone, un téléphone Android, ou une tablette ?",
      en: "A case for which device? An iPhone, an Android phone, or a tablet?",
      es: "¿Una funda para qué aparato? ¿Un iPhone, un móvil Android o una tableta?"
    },
    options: [
      { zone: "apple", label: { fr: "iPhone, iPad", en: "iPhone, iPad", es: "iPhone, iPad" },
        say: { fr: ["iphone", "ipad", "apple"], en: ["iphone", "ipad", "apple"], es: ["iphone", "ipad", "apple"] } },
      { zone: "telephonie", label: { fr: "Téléphone Android", en: "Android phone", es: "Móvil Android" },
        say: { fr: ["android", "samsung", "telephone", "xiaomi"], en: ["android", "samsung", "phone"], es: ["android", "samsung", "movil"] } },
      { zone: "tablettes", label: { fr: "Tablette Android", en: "Android tablet", es: "Tableta Android" },
        say: { fr: ["tablette"], en: ["tablet"], es: ["tableta", "tablet"] } }
    ]
  },
  {
    words: { fr: ["jeu", "jeux"], en: ["game", "games"], es: ["juego", "juegos"] },
    question: {
      fr: "Quel genre de jeu ? Un jeu vidéo, un jeu de société, ou des cartes à collectionner comme Pokémon ?",
      en: "What kind of game? A video game, a board game, or trading cards like Pokémon?",
      es: "¿Qué tipo de juego? ¿Un videojuego, un juego de mesa o cartas coleccionables como Pokémon?"
    },
    options: [
      { zone: "gaming", label: { fr: "Jeu vidéo", en: "Video game", es: "Videojuego" },
        say: { fr: ["video", "console", "ps5", "switch", "xbox", "play"], en: ["video", "console", "ps5", "switch", "xbox"], es: ["videojuego", "video", "consola", "ps5", "switch"] } },
      { zone: "jeuxSociete", label: { fr: "Jeu de société", en: "Board game", es: "Juego de mesa" },
        say: { fr: ["societe", "plateau", "famille", "puzzle", "cartes a jouer"], en: ["board", "family", "puzzle"], es: ["mesa", "familia", "puzle"] } },
      { zone: "escalier", label: { fr: "Cartes Pokémon & co", en: "Pokémon cards & co", es: "Cartas Pokémon y más" },
        say: { fr: ["pokemon", "collection", "collectionner", "magic", "lorcana"], en: ["pokemon", "trading", "collectible", "magic"], es: ["pokemon", "coleccionables", "magic"] } }
    ]
  },
  {
    words: { fr: ["batterie", "batteries"], en: ["battery", "batteries"], es: ["batería", "baterías"] },
    question: {
      fr: "Quelle batterie ? Une batterie externe pour téléphone, des piles, une batterie d'ordinateur, d'appareil photo, ou de trottinette ?",
      en: "Which battery? A phone power bank, AA-type batteries, a laptop, camera or scooter battery?",
      es: "¿Qué batería? ¿Una batería externa para el móvil, pilas, o una batería de portátil, de cámara o de patinete?"
    },
    options: [
      { zone: "telephonie", label: { fr: "Batterie externe", en: "Power bank", es: "Batería externa" },
        say: { fr: ["externe", "telephone", "portable", "powerbank"], en: ["power", "bank", "phone"], es: ["externa", "movil"] } },
      { zone: "caisse", label: { fr: "Piles", en: "AA-type batteries", es: "Pilas" },
        say: { fr: ["piles", "pile", "telecommande"], en: ["aa", "aaa", "remote"], es: ["pilas", "pila", "mando"] } },
      { zone: "pcwindows", label: { fr: "Ordinateur", en: "Laptop", es: "Portátil" },
        say: { fr: ["ordinateur", "ordi", "pc"], en: ["laptop", "computer"], es: ["portatil", "ordenador"] } },
      { zone: "photo", label: { fr: "Appareil photo, GoPro", en: "Camera, GoPro", es: "Cámara, GoPro" },
        say: { fr: ["photo", "gopro", "camera"], en: ["camera", "gopro"], es: ["camara", "gopro"] } },
      { zone: "trottinettes", label: { fr: "Trottinette", en: "Scooter", es: "Patinete" },
        say: { fr: ["trottinette", "velo"], en: ["scooter", "bike"], es: ["patinete", "bici"] } }
    ]
  },
  {
    words: { fr: ["enceinte", "enceintes"], en: ["speaker", "speakers"], es: ["altavoz", "altavoces"] },
    question: {
      fr: "Quelle enceinte ? Une enceinte bluetooth ou hifi pour la musique, ou une enceinte connectée avec assistant vocal comme Alexa ?",
      en: "Which speaker? A Bluetooth or hi-fi speaker for music, or a smart speaker with a voice assistant like Alexa?",
      es: "¿Qué altavoz? ¿Un altavoz bluetooth o hifi para música, o uno inteligente con asistente de voz como Alexa?"
    },
    options: [
      { zone: "audio", label: { fr: "Bluetooth, hifi", en: "Bluetooth, hi-fi", es: "Bluetooth, hifi" },
        say: { fr: ["bluetooth", "musique", "hifi", "jbl", "portable", "soiree"], en: ["bluetooth", "music", "hifi", "jbl", "party"], es: ["bluetooth", "musica", "hifi", "jbl", "fiesta"] } },
      { zone: "objets", label: { fr: "Connectée (Alexa…)", en: "Smart (Alexa…)", es: "Inteligente (Alexa…)" },
        say: { fr: ["alexa", "google", "connectee", "assistant", "vocal"], en: ["alexa", "google", "smart", "assistant"], es: ["alexa", "google", "inteligente", "asistente"] } }
    ]
  },
  {
    words: { fr: ["micro", "micros", "microphone"], en: ["mic", "microphone"], es: ["micro", "micrófono"] },
    question: {
      fr: "Quel micro ? Pour filmer ou faire un podcast, pour jouer ou streamer, ou pour chanter au karaoké ?",
      en: "Which microphone? For filming or podcasts, for gaming or streaming, or for karaoke?",
      es: "¿Qué micrófono? ¿Para grabar vídeo o pódcast, para jugar o hacer streaming, o para karaoke?"
    },
    options: [
      { zone: "photo", label: { fr: "Vidéo, podcast", en: "Video, podcast", es: "Vídeo, pódcast" },
        say: { fr: ["video", "filmer", "podcast", "cravate", "youtube", "tiktok", "telephone"], en: ["video", "filming", "podcast", "lapel", "youtube"], es: ["video", "grabar", "podcast", "corbata"] } },
      { zone: "accessoiresGaming", place: "accessoires", label: { fr: "Gaming, stream", en: "Gaming, streaming", es: "Gaming, streaming" },
        say: { fr: ["jouer", "gamer", "gaming", "stream", "streamer", "twitch", "pc"], en: ["gaming", "stream", "streaming", "twitch"], es: ["jugar", "gaming", "streaming", "twitch"] } },
      { zone: "audio", label: { fr: "Karaoké", en: "Karaoke", es: "Karaoke" },
        say: { fr: ["karaoke", "chanter"], en: ["karaoke", "singing", "sing"], es: ["karaoke", "cantar"] } }
    ]
  },
  {
    words: { fr: ["adaptateur", "adaptateurs"], en: ["adapter", "adaptor"], es: ["adaptador", "adaptadores"] },
    question: {
      fr: "Quel adaptateur ? Une prise pour voyager à l'étranger, un adaptateur HDMI ou USB, un adaptateur audio jack, ou pour iPhone ?",
      en: "Which adapter? A travel plug adapter, an HDMI or USB adapter, an audio jack adapter, or for an iPhone?",
      es: "¿Qué adaptador? ¿Un enchufe de viaje, un adaptador HDMI o USB, un adaptador de audio jack, o para iPhone?"
    },
    options: [
      { zone: "caisse", label: { fr: "Prise de voyage", en: "Travel plug", es: "Enchufe de viaje" },
        say: { fr: ["voyage", "voyager", "etranger", "prise", "anglaise", "americaine", "angleterre", "etats unis", "usa", "amerique", "londres", "japon", "australie", "suisse", "vacances"], en: ["travel", "plug", "uk", "us", "abroad"], es: ["viaje", "enchufe", "extranjero"] } },
      { zone: "informatique", label: { fr: "HDMI, USB", en: "HDMI, USB", es: "HDMI, USB" },
        say: { fr: ["hdmi", "usb", "ordinateur", "vga", "displayport"], en: ["hdmi", "usb", "computer", "vga"], es: ["hdmi", "usb", "ordenador", "vga"] } },
      { zone: "audio", place: "adaptateurs", label: { fr: "Audio jack", en: "Audio jack", es: "Audio jack" },
        say: { fr: ["jack", "audio", "casque", "ecouteurs", "bluetooth"], en: ["jack", "audio", "headphones"], es: ["jack", "audio", "auriculares"] } },
      { zone: "apple", label: { fr: "iPhone, Mac", en: "iPhone, Mac", es: "iPhone, Mac" },
        say: { fr: ["iphone", "apple", "mac", "lightning"], en: ["iphone", "apple", "mac", "lightning"], es: ["iphone", "apple", "mac"] } }
    ]
  },
  {
    words: { fr: ["aspirateur", "aspirateurs"], en: ["vacuum", "vacuum cleaner", "hoover"], es: ["aspiradora", "aspirador"] },
    question: {
      fr: "Quel aspirateur ? Un aspirateur balai ou un robot, ou un aspirateur traîneau, Dyson ou vapeur ?",
      en: "Which vacuum? A cordless stick or robot vacuum, or a cylinder, Dyson or steam cleaner?",
      es: "¿Qué aspiradora? ¿Una escoba sin cable o un robot, o una de trineo, Dyson o de vapor?"
    },
    options: [
      { zone: "electromenager", place: "aspirateurs", label: { fr: "Balai, robot", en: "Stick, robot", es: "Escoba, robot" },
        say: { fr: ["balai", "robot", "sans fil", "main"], en: ["stick", "cordless", "robot", "handheld"], es: ["escoba", "robot", "sin cable"] } },
      { zone: "electromenager", place: "sols", label: { fr: "Traîneau, Dyson, vapeur", en: "Cylinder, Dyson, steam", es: "Trineo, Dyson, vapor" },
        say: { fr: ["traineau", "dyson", "vapeur", "sac"], en: ["cylinder", "dyson", "steam"], es: ["trineo", "dyson", "vapor"] } }
    ]
  },
  {
    words: { fr: ["machine à café", "machines à café", "cafetière", "café"], en: ["coffee machine", "coffee maker", "coffee"], es: ["cafetera", "cafeteras", "café"] },
    question: {
      fr: "Quelle machine à café ? À capsules comme Nespresso, à grains ou expresso, ou une cafetière filtre ?",
      en: "Which coffee machine? A capsule machine like Nespresso, a bean-to-cup or espresso machine, or a filter coffee maker?",
      es: "¿Qué cafetera? ¿De cápsulas como Nespresso, superautomática o espresso, o de goteo?"
    },
    options: [
      { zone: "electromenager", place: "capsules", label: { fr: "Capsules", en: "Capsules", es: "Cápsulas" },
        say: { fr: ["capsule", "capsules", "nespresso", "dosettes", "senseo", "dolce", "tassimo"], en: ["capsule", "capsules", "nespresso", "pods"], es: ["capsulas", "nespresso"] } },
      { zone: "electromenager", place: "cafe", label: { fr: "Grains, expresso", en: "Beans, espresso", es: "Grano, espresso" },
        say: { fr: ["grain", "grains", "expresso", "broyeur", "barista"], en: ["beans", "bean", "espresso", "grinder"], es: ["grano", "espresso"] } },
      { zone: "electromenager", place: "machinesCafe", label: { fr: "Filtre", en: "Filter", es: "Goteo" },
        say: { fr: ["filtre", "cafetiere"], en: ["filter", "drip"], es: ["goteo", "filtro"] } }
    ]
  },
  {
    words: { fr: ["sony"], en: ["sony"], es: ["sony"] },
    question: {
      fr: "Quel produit Sony ? Une télé, un casque ou une enceinte, une PlayStation, ou un appareil photo ?",
      en: "Which Sony product? A TV, headphones or a speaker, a PlayStation, or a camera?",
      es: "¿Qué producto Sony? ¿Una tele, auriculares o un altavoz, una PlayStation o una cámara?"
    },
    options: [
      { zone: "tv", label: { fr: "Télé", en: "TV", es: "Tele" },
        say: { fr: ["tele", "television", "tv", "bravia"], en: ["tv", "television", "bravia"], es: ["tele", "television", "tv"] } },
      { zone: "audio", label: { fr: "Casque, enceinte", en: "Headphones, speaker", es: "Auriculares, altavoz" },
        say: { fr: ["casque", "ecouteurs", "enceinte", "audio", "musique"], en: ["headphones", "earbuds", "speaker", "audio"], es: ["auriculares", "cascos", "altavoz", "audio"] } },
      { zone: "gaming", label: { fr: "PlayStation", en: "PlayStation", es: "PlayStation" },
        say: { fr: ["playstation", "ps5", "play", "console", "manette", "jeu"], en: ["playstation", "ps5", "console", "controller", "game"], es: ["playstation", "ps5", "consola", "mando", "juego"] } },
      { zone: "photo", label: { fr: "Appareil photo", en: "Camera", es: "Cámara" },
        say: { fr: ["photo", "appareil", "camera", "alpha", "objectif"], en: ["camera", "photo", "alpha", "lens"], es: ["camara", "foto", "alpha", "objetivo"] } }
    ]
  },
  {
    words: { fr: ["philips"], en: ["philips"], es: ["philips"] },
    question: {
      fr: "Quel produit Philips ? Un rasoir, une tondeuse ou une brosse à dents, une machine à café ou un airfryer, une télé, ou des ampoules Hue ?",
      en: "Which Philips product? A shaver, trimmer or toothbrush, a coffee machine or air fryer, a TV, or Hue bulbs?",
      es: "¿Qué producto Philips? ¿Una afeitadora, un cortapelos o un cepillo de dientes, una cafetera o freidora de aire, una tele o bombillas Hue?"
    },
    options: [
      { zone: "electromenager", place: "cheveux", label: { fr: "Rasoir, tondeuse", en: "Shaver, trimmer", es: "Afeitadora, cortapelos" },
        say: { fr: ["rasoir", "tondeuse", "oneblade", "barbe", "cheveux"], en: ["shaver", "trimmer", "oneblade", "beard"], es: ["afeitadora", "cortapelos", "barba"] } },
      { zone: "electromenager", place: "aspirateurs", label: { fr: "Brosse à dents, épilateur", en: "Toothbrush, epilator", es: "Cepillo de dientes, depiladora" },
        say: { fr: ["brosse", "dents", "sonicare", "epilateur", "lumea"], en: ["toothbrush", "sonicare", "epilator", "lumea"], es: ["cepillo", "dientes", "depiladora"] } },
      { zone: "electromenager", place: "capsules", label: { fr: "Café, airfryer, cuisine", en: "Coffee, air fryer, kitchen", es: "Café, freidora, cocina" },
        say: { fr: ["cafe", "airfryer", "friteuse", "cuisine", "senseo", "blender"], en: ["coffee", "airfryer", "fryer", "kitchen"], es: ["cafe", "freidora", "cocina"] } },
      { zone: "tv", label: { fr: "Télé", en: "TV", es: "Tele" },
        say: { fr: ["tele", "television", "tv", "ambilight"], en: ["tv", "television", "ambilight"], es: ["tele", "television", "tv"] } },
      { zone: "objets", label: { fr: "Ampoules Hue", en: "Hue bulbs", es: "Bombillas Hue" },
        say: { fr: ["ampoule", "ampoules", "hue", "lumiere", "lampe"], en: ["bulb", "bulbs", "hue", "light"], es: ["bombilla", "bombillas", "hue", "luz"] } }
    ]
  },
  {
    words: { fr: ["carte", "cartes"], en: ["card", "cards"], es: ["tarjeta", "tarjetas", "carta", "cartas"] },
    question: {
      fr: "Quelle carte ? Une carte cadeau, la carte Fnac, une carte mémoire, des cartes Pokémon, ou une carte graphique ?",
      en: "Which card? A gift card, the Fnac membership card, a memory card, Pokémon cards, or a graphics card?",
      es: "¿Qué tarjeta? ¿Una tarjeta regalo, la tarjeta Fnac, una tarjeta de memoria, cartas Pokémon o una tarjeta gráfica?"
    },
    options: [
      { zone: "caisse", label: { fr: "Carte cadeau", en: "Gift card", es: "Tarjeta regalo" },
        say: { fr: ["cadeau"], en: ["gift"], es: ["regalo"] } },
      { zone: "adhesion", label: { fr: "Carte Fnac", en: "Fnac card", es: "Tarjeta Fnac" },
        say: { fr: ["fnac", "fidelite", "adherent"], en: ["fnac", "membership", "loyalty"], es: ["fnac", "socio", "fidelidad"] } },
      { zone: "informatique", label: { fr: "Carte mémoire", en: "Memory card", es: "Tarjeta de memoria" },
        say: { fr: ["memoire", "sd", "micro"], en: ["memory", "sd"], es: ["memoria", "sd"] } },
      { zone: "escalier", label: { fr: "Cartes Pokémon & co", en: "Pokémon cards & co", es: "Cartas Pokémon y más" },
        say: { fr: ["pokemon", "collection", "magic", "yu", "lorcana", "one piece"], en: ["pokemon", "trading", "magic"], es: ["pokemon", "coleccionables", "magic"] } },
      { zone: "accessoiresGaming", place: "pc", label: { fr: "Carte graphique", en: "Graphics card", es: "Tarjeta gráfica" },
        say: { fr: ["graphique", "rtx", "nvidia"], en: ["graphics", "gpu", "rtx"], es: ["grafica", "rtx"] } }
    ]
  }
];

// Boutons de recherches fréquentes (page principale).
export const SUGGESTIONS = [
  { zone: "audio", icon: "headphones", label: { fr: "Casques audio", en: "Headphones", es: "Auriculares" } },
  { zone: "gaming", icon: "gamepad", label: { fr: "Consoles", en: "Consoles", es: "Consolas" } },
  { zone: "apple", icon: "apple", label: { fr: "iPhone", en: "iPhone", es: "iPhone" } },
  { zone: "tv", icon: "tv", label: { fr: "TV", en: "TV", es: "TV" } },
  { zone: "savRetrait", icon: "wrench", label: { fr: "SAV", en: "Repairs", es: "Posventa" } },
  { zone: "savRetrait", icon: "package", label: { fr: "Retrait commande", en: "Order pickup", es: "Recoger pedido" } }
];

// =====================================================================
// Questions pratiques (ni produit, ni rayon).
// Réponses données par le magasin le 16/09/2026 : ouvert du lundi au
// samedi de 10 h à 19 h 30, pas de toilettes et pas de parking.
// =====================================================================
export const INFO = {
  hours: {
    keywords: {
      fr: ["horaire", "horaires", "heure d'ouverture", "heures d'ouverture", "heure de fermeture", "vous ouvrez", "vous fermez",
           "ouvert", "ouverture", "fermeture", "fermé", "jusqu'à quelle heure", "à quelle heure vous ouvrez",
           "à quelle heure vous fermez", "ouvert le dimanche", "ouvert le samedi", "vous êtes ouvert"],
      en: ["opening hours", "opening time", "closing time", "what time do you open", "what time do you close",
           "when do you open", "when do you close", "are you open", "open on sunday", "open on saturday"],
      es: ["horario", "horarios", "hora de apertura", "hora de cierre", "a qué hora abren", "a qué hora cierran",
           "están abiertos", "abierto el domingo", "abierto el sábado"]
    },
    answer: {
      fr: "Le magasin est ouvert du lundi au samedi, de 10 heures à 19 heures 30. Nous sommes fermés le dimanche.",
      en: "The store is open Monday to Saturday, from 10 am to 7.30 pm. We are closed on Sundays.",
      es: "La tienda abre de lunes a sábado, de 10 a 19:30. Los domingos está cerrada."
    }
  },
  toilets: {
    keywords: {
      fr: ["toilette", "toilettes", "wc", "petit coin", "sanitaires", "où sont les toilettes"],
      en: ["toilet", "toilets", "restroom", "restrooms", "bathroom", "wc", "loo"],
      es: ["baño", "baños", "aseo", "aseos", "servicios", "wc"]
    },
    answer: {
      fr: "Je suis désolée, il n'y a pas de toilettes dans ce magasin.",
      en: "I'm sorry, there are no toilets in this store.",
      es: "Lo siento, esta tienda no tiene baños."
    }
  },
  largeAppliances: {
    keywords: {
      fr: ["gros électroménager", "lave-linge", "machine à laver", "lave-vaisselle", "sèche-linge", "frigo",
           "réfrigérateur", "congélateur", "four encastrable", "plaque de cuisson", "table de cuisson", "hotte",
           "cuisinière", "chauffe-eau", "cave à vin", "plaque à induction", "plaque induction", "table à induction",
           "four encastré", "four à encastrer", "micro-ondes encastrable", "sèche linge", "lave linge", "congélateur coffre"],
      en: ["large appliance", "large appliances", "washing machine", "dishwasher", "tumble dryer", "fridge",
           "refrigerator", "freezer", "built in oven", "hob", "cooker hood", "wine cooler"],
      es: ["gran electrodoméstico", "lavadora", "lavavajillas", "secadora", "nevera", "frigorífico", "congelador",
           "horno empotrable", "placa de cocina", "campana extractora", "vinoteca"]
    },
    answer: {
      fr: "Nous ne vendons pas de gros électroménager ici. Au rayon petit électroménager, le plus grand appareil est l'aspirateur balai.",
      en: "We don't sell large appliances here. In the small appliances aisle, the largest item is the cordless stick vacuum.",
      es: "Aquí no vendemos grandes electrodomésticos. En pequeños electrodomésticos, lo más grande es el aspirador escoba."
    }
  },
  // Un ascenseur existe, réservé aux personnes qui en ont besoin (réponse du
  // magasin le 17/09/2026). Son emplacement n'est pas encore sur le plan.
  elevator: {
    keywords: {
      fr: ["ascenseur", "ascenseurs", "élévateur", "monte-charge", "fauteuil roulant",
           "handicap", "handicapé", "personne handicapée", "pmr", "mobilité réduite", "personne à mobilité réduite",
           "poussette", "avec une poussette", "béquilles", "je ne peux pas prendre l'escalier",
           "je peux pas prendre les escaliers", "sans escalier", "éviter l'escalier", "accès handicapé",
           "accès pmr", "accessible en fauteuil", "déambulateur", "accès fauteuil", "accès pour les fauteuils",
           "accès pour fauteuil", "fauteuils roulants", "personnes handicapées", "accessibilité"],
      en: ["lift", "elevator", "wheelchair", "disabled access", "disability", "reduced mobility", "pushchair",
           "stroller", "pram", "crutches", "can't use the stairs", "cannot take the stairs", "step free access",
           "accessible entrance"],
      es: ["ascensor", "ascensores", "silla de ruedas", "movilidad reducida", "discapacidad", "minusválido",
           "carrito de bebé", "carrito", "muletas", "no puedo subir escaleras", "sin escaleras", "acceso para discapacitados"]
    },
    answer: {
      fr: "Oui, il y a un ascenseur pour les personnes qui en ont besoin. Touchez « Appeler un vendeur » : un membre de l'équipe vous y accompagne.",
      en: "Yes, there is a lift for anyone who needs it. Tap “Call a staff member” and a member of the team will take you there.",
      es: "Sí, hay un ascensor para las personas que lo necesiten. Toque «Llamar a un vendedor» y alguien del equipo le acompañará."
    }
  },
  // Retrait des commandes : les colis se retirent au SAV, au sous-sol, mais
  // les téléphones et les montres connectées se retirent à l'étage 0, auprès
  // des vendeurs du milieu (réponse du magasin le 23/09/2026). Cette question
  // passe avant le SAV : voir findInfo dans js/search.js.
  phonePickup: {
    zone: "telephonie",
    keywords: {
      fr: ["retirer mon téléphone", "retirer mon portable", "retirer mon smartphone", "retirer mon iphone",
           "retirer ma montre", "retirer ma montre connectée", "récupérer mon téléphone", "récupérer mon portable",
           "récupérer mon smartphone", "récupérer mon iphone", "récupérer ma montre", "récupérer ma montre connectée",
           "chercher mon téléphone", "chercher mon portable", "chercher mon smartphone", "chercher mon iphone",
           "chercher ma montre", "chercher ma montre connectée", "commandé un téléphone", "commandé un portable",
           "commandé un smartphone", "commandé un iphone", "commandé une montre", "commandé une montre connectée",
           "retrait de mon téléphone", "retrait du téléphone", "retrait de ma montre", "retrait smartphone",
           "j'ai commandé un téléphone", "j'ai commandé un iphone", "j'ai commandé une montre",
           "mon téléphone est arrivé", "ma montre est arrivée", "venir chercher mon téléphone",
           "venir chercher ma montre", "click and collect téléphone", "commande de téléphone"],
      en: ["collect my phone", "pick up my phone", "collect my smartphone", "pick up my smartphone",
           "collect my iphone", "pick up my iphone", "collect my watch", "pick up my watch",
           "collect my smartwatch", "pick up my smartwatch", "i ordered a phone", "i ordered an iphone",
           "i ordered a watch", "phone order pickup", "my phone has arrived"],
      es: ["recoger mi móvil", "recoger mi teléfono", "recoger mi iphone", "recoger mi reloj",
           "recoger mi reloj inteligente", "he pedido un móvil", "he pedido un iphone", "he pedido un reloj",
           "mi móvil ha llegado", "recogida de móvil"]
    },
    answer: {
      fr: "Les téléphones et les montres connectées se retirent ici, à l'étage 0, auprès des vendeurs au milieu du magasin. Les autres commandes se retirent au SAV, au sous-sol.",
      en: "Phones and smartwatches are collected here on floor 0, from the staff in the middle of the store. Other orders are collected at the after-sales desk in the basement.",
      es: "Los móviles y los relojes inteligentes se recogen aquí, en la planta 0, con los vendedores del centro de la tienda. Los demás pedidos se recogen en posventa, en el sótano."
    }
  },
  // Produits que ce magasin ne vend pas (confirmé par le magasin) : Jeanne le dit
  // au lieu d'envoyer le client dans un rayon. Liste à compléter au fil des retours.
  notSold: {
    keywords: {
      fr: ["support téléphone", "support de téléphone", "support pour téléphone", "support smartphone", "support voiture",
           "support téléphone voiture", "support voiture magnétique", "support grille aération", "support vélo téléphone",
           "support téléphone vélo", "support moto", "support iphone", "support de portable", "porte téléphone",
           "porte-téléphone", "support magsafe voiture", "support pare-brise", "support tableau de bord"],
      en: ["phone holder", "phone mount", "car mount", "car phone holder", "bike phone mount", "iphone stand", "iphone car mount"],
      es: ["soporte móvil", "soporte para móvil", "soporte de coche", "soporte de bici para móvil", "soporte iphone"]
    },
    answer: {
      fr: "Désolée, ce magasin ne vend pas ce produit. Vous pouvez le commander sur fnac.com, ou demander conseil à un vendeur.",
      en: "Sorry, this store doesn't sell that product. You can order it on fnac.com, or ask a member of staff for advice.",
      es: "Lo siento, esta tienda no vende ese producto. Puede pedirlo en fnac.com o pedir consejo a un vendedor."
    }
  },
  parking: {
    keywords: {
      fr: ["parking", "garer", "se garer", "me garer", "où me garer", "où se garer", "stationner", "stationnement",
           "place de parking", "garer ma voiture", "voiture"],
      en: ["parking", "car park", "where to park", "park my car", "park the car"],
      es: ["parking", "aparcamiento", "aparcar", "dónde aparcar", "aparcar el coche", "coche"]
    },
    answer: {
      fr: "Le magasin n'a pas de parking. Il faut vous garer dans le quartier.",
      en: "The store has no car park. You'll need to park in the neighbourhood.",
      es: "La tienda no tiene aparcamiento. Hay que aparcar por el barrio."
    }
  }
};

// Petites intentions de conversation (quand aucun rayon ne correspond).
export const INTENTS = {
  hello: ["bonjour", "salut", "bonsoir", "hello", "hi", "hey", "good morning", "hola", "buenos dias", "buenas tardes"],
  thanks: ["merci", "merci beaucoup", "thank you", "thanks", "gracias", "muchas gracias"],
  human: ["vendeur", "vendeuse", "conseiller", "conseillere", "quelqu un", "aide", "staff", "someone", "assistant", "employee", "help", "vendedor", "vendedora", "dependiente", "ayuda",
    // Une demande de cadeau sans produit précis : un vendeur conseillera mieux.
    "cadeau", "idée cadeau", "idées cadeaux", "un cadeau", "cadeau anniversaire", "cadeau de noël", "cadeau pour mon fils",
    "cadeau pour ma fille", "quoi offrir", "gift", "gift idea", "present idea", "what to buy", "regalo", "idea de regalo", "qué regalar",
    // Besoin d'un conseil, sans produit précis
    "accueil", "l'accueil", "point info", "renseignements", "high tech", "high-tech",
    "promo", "promos", "promotion", "promotions", "en promo", "soldes", "les soldes", "black friday", "bons plans",
    "bon plan", "offres du moment", "réductions", "remises", "déstockage", "french days", "sales", "discount", "ofertas", "rebajas",
    "je ne sais pas ce que je cherche", "je sais pas ce que je cherche", "je ne sais pas quoi", "m'aider", "aidez-moi",
    "pouvez-vous m'aider", "vous pouvez m'aider", "besoin d'aide", "un coup de main",
    "conseil", "conseils", "un conseil", "besoin de conseils", "renseignement", "un renseignement", "une question",
    "parler à quelqu'un", "parler a un vendeur", "employé", "un employé", "responsable", "le responsable", "directeur",
    "manager", "je sais pas quoi prendre", "je ne sais pas quoi prendre", "je ne sais pas quoi choisir",
    "je sais pas quoi choisir", "j'hésite", "comparer", "advice", "a question", "talk to someone", "speak to someone",
    "manager", "not sure what to buy", "consejo", "una pregunta", "hablar con alguien", "no sé qué elegir"]
};
