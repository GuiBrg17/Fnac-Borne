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
    idleBubble: "Bienvenue ! En quoi puis-je vous aider ?",
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
    foundStairs: "Les LEGO, figurines POP et cartes Pokémon sont dans l'escalier qui relie l'étage 0 au sous-sol.",
    foundEntrance: "L'entrée et la sortie sont à l'étage 0, en bas du plan.",
    notFound: "Je n'ai pas trouvé ce produit. Essayez avec un autre mot, ou appelez un vendeur : il viendra vous aider.",
    hello: "Bonjour ! Quel produit cherchez-vous ?",
    thanks: "Avec plaisir ! Bonne visite à la Fnac.",
    human: "Bien sûr. Touchez « Appeler un vendeur » et un membre de l'équipe viendra vous aider.",
    otherStore: "Les livres, BD, manuels scolaires, CD, vinyles et DVD se trouvent à la Fnac Wilson, 16 allées Franklin-Roosevelt, près de Jean-Jaurès. Ici, à la Fnac Jeanne d'Arc, nous sommes spécialisés dans la technique.",
    otherStoreWhat: "Livres, BD, manuels scolaires, CD, vinyles, DVD",
    otherStoreNear: "Près de Jean-Jaurès",
    otherStoreClose: "Retour au plan",
    didYouMean: (word) => `Vous voulez dire « ${word} » ? `,
    vendorConfirm: (zone) => zone
      ? `C'est noté : un vendeur du rayon ${zone} a été prévenu.`
      : "C'est noté : un vendeur a été prévenu et arrive.",
    vendorToast: (zone) => zone ? `Vendeur prévenu · rayon ${zone}` : "Vendeur prévenu",
    micUnsupported: "Le micro n'est pas disponible sur cet appareil. Vous pouvez écrire votre question.",
    micError: "Je n'ai pas bien entendu. Réessayez, ou écrivez votre question.",
    micDenied: "Le micro est bloqué. Autorisez-le dans le navigateur, ou écrivez votre question.",
    idleWarnTitle: "Vous êtes toujours là ?",
    idleWarnBody: (s) => `Retour à l'accueil dans ${s} s.`,
    idleWarnButton: "Je continue",
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
    foundStairs: "LEGO, POP figures and Pokémon cards are in the staircase between floor 0 and the basement.",
    foundEntrance: "The entrance and exit are on floor 0, at the bottom of the map.",
    notFound: "I couldn't find that product. Try another word, or call a staff member who will come and help you.",
    hello: "Hello! What product are you looking for?",
    thanks: "You're welcome! Enjoy your visit to Fnac.",
    human: "Of course. Tap “Call a staff member” and someone from the team will come to help you.",
    otherStore: "Books, comics, school books, CDs, vinyl records and DVDs are at Fnac Wilson, 16 allées Franklin-Roosevelt, near Jean-Jaurès. Here at Fnac Jeanne d'Arc, we specialise in technology.",
    otherStoreWhat: "Books, comics, school books, CDs, vinyl, DVDs",
    otherStoreNear: "Near Jean-Jaurès",
    otherStoreClose: "Back to the map",
    didYouMean: (word) => `Did you mean “${word}”? `,
    vendorConfirm: (zone) => zone
      ? `Done: a staff member from ${zone} has been notified.`
      : "Done: a staff member has been notified and is on their way.",
    vendorToast: (zone) => zone ? `Staff notified · ${zone}` : "Staff notified",
    micUnsupported: "The microphone isn't available on this device. You can type your question.",
    micError: "I didn't quite catch that. Try again, or type your question.",
    micDenied: "The microphone is blocked. Allow it in the browser, or type your question.",
    idleWarnTitle: "Are you still there?",
    idleWarnBody: (s) => `Back to the welcome screen in ${s} s.`,
    idleWarnButton: "I'm still here",
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
    foundStairs: "Los LEGO, las figuras POP y las cartas Pokémon están en la escalera que une la planta 0 con el sótano.",
    foundEntrance: "La entrada y la salida están en la planta 0, abajo en el plano.",
    notFound: "No he encontrado ese producto. Pruebe con otra palabra, o llame a un vendedor: vendrá a ayudarle.",
    hello: "¡Hola! ¿Qué producto busca?",
    thanks: "¡Con mucho gusto! Disfrute de su visita a la Fnac.",
    human: "Por supuesto. Toque «Llamar a un vendedor» y alguien del equipo vendrá a ayudarle.",
    otherStore: "Los libros, cómics, libros de texto, CD, vinilos y DVD están en la Fnac Wilson, 16 allées Franklin-Roosevelt, cerca de Jean-Jaurès. Aquí, en la Fnac Jeanne d'Arc, estamos especializados en tecnología.",
    otherStoreWhat: "Libros, cómics, libros de texto, CD, vinilos, DVD",
    otherStoreNear: "Cerca de Jean-Jaurès",
    otherStoreClose: "Volver al plano",
    didYouMean: (word) => `¿Quiere decir «${word}»? `,
    vendorConfirm: (zone) => zone
      ? `Hecho: se ha avisado a un vendedor de la sección ${zone}.`
      : "Hecho: se ha avisado a un vendedor y ya viene.",
    vendorToast: (zone) => zone ? `Vendedor avisado · ${zone}` : "Vendedor avisado",
    micUnsupported: "El micrófono no está disponible en este dispositivo. Puede escribir su pregunta.",
    micError: "No le he entendido bien. Inténtelo de nuevo o escriba su pregunta.",
    micDenied: "El micrófono está bloqueado. Permítalo en el navegador o escriba su pregunta.",
    idleWarnTitle: "¿Sigue ahí?",
    idleWarnBody: (s) => `Volvemos a la pantalla de inicio en ${s} s.`,
    idleWarnButton: "Sigo aquí",
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
    detail: { fr: "Écouteurs filaires, chargeurs…", en: "Wired earphones, chargers…", es: "Auriculares con cable, cargadores…" },
    keywords: {
      fr: ["téléphone", "téléphone portable", "portable", "smartphone", "android", "samsung", "xiaomi", "google pixel", "chargeur", "chargeur téléphone", "écouteur filaire", "écouteurs filaires", "coque téléphone", "forfait"],
      en: ["phone", "mobile phone", "mobile", "cell phone", "smartphone", "android", "samsung", "xiaomi", "google pixel", "charger", "phone charger", "wired earphone", "wired headphone", "phone case"],
      es: ["teléfono", "móvil", "smartphone", "android", "samsung", "xiaomi", "google pixel", "cargador", "auricular con cable", "auriculares con cable", "funda móvil"]
    }
  },
  objets: {
    floors: ["0"], icon: "watch",
    label: { fr: "Objets connectés", en: "Connected devices", es: "Objetos conectados" },
    detail: { fr: "Montres, maison connectée…", en: "Watches, smart home…", es: "Relojes, hogar conectado…" },
    keywords: {
      fr: ["objet connecté", "objets connectés", "montre connectée", "montre", "smartwatch", "bracelet connecté", "domotique", "maison connectée", "ampoule connectée", "prise connectée", "caméra de surveillance", "sonnette connectée", "assistant vocal", "traceur gps"],
      en: ["connected device", "smart device", "smart watch", "smartwatch", "watch", "fitness tracker", "smart home", "smart bulb", "smart plug", "security camera", "doorbell", "voice assistant"],
      es: ["objeto conectado", "reloj conectado", "reloj", "smartwatch", "pulsera de actividad", "domótica", "hogar conectado", "bombilla inteligente", "enchufe inteligente", "cámara de vigilancia", "timbre inteligente", "asistente de voz"]
    }
  },
  escalier: {
    floors: ["0", "-1"], icon: "stairs",
    label: { fr: "Escalier · LEGO, POP & Pokémon", en: "Stairs · LEGO, POP & Pokémon", es: "Escalera · LEGO, POP y Pokémon" },
    detail: { fr: "", en: "", es: "" },
    keywords: {
      fr: ["lego", "figurine pop", "figurines pop", "funko", "funko pop", "pokemon", "carte pokemon", "booster pokemon", "escalier", "sous-sol"],
      en: ["lego", "pop figure", "funko", "funko pop", "pokemon", "pokemon card", "pokemon booster", "stairs", "staircase", "basement"],
      es: ["lego", "figura pop", "figuras pop", "funko", "funko pop", "pokemon", "carta pokemon", "sobre pokemon", "escalera", "sótano"]
    }
  },
  entree: {
    floors: ["0"], icon: "door",
    label: { fr: "Entrée / Sortie", en: "Entrance / Exit", es: "Entrada / Salida" },
    detail: { fr: "", en: "", es: "" },
    keywords: {
      fr: ["entrée", "sortie"],
      en: ["entrance", "exit", "way out"],
      es: ["entrada", "salida"]
    }
  },

  // ---------------- Niveau -1 ----------------
  gaming: {
    floors: ["-1"], icon: "gamepad",
    label: { fr: "Jeux vidéo", en: "Video games", es: "Videojuegos" },
    detail: { fr: "Consoles et jeux", en: "Consoles and games", es: "Consolas y juegos" },
    keywords: {
      fr: ["jeu vidéo", "jeux vidéo", "console", "playstation", "ps5", "ps4", "xbox", "nintendo", "switch", "manette", "jeu ps5", "jeu switch"],
      en: ["video game", "console", "playstation", "ps5", "ps4", "xbox", "nintendo", "switch", "controller", "gamepad"],
      es: ["videojuego", "consola", "playstation", "ps5", "ps4", "xbox", "nintendo", "switch", "mando"]
    }
  },
  accessoiresGaming: {
    floors: ["-1"], icon: "mouse",
    label: { fr: "Accessoires gaming & cartouches", en: "Gaming gear & ink", es: "Accesorios gaming y cartuchos" },
    detail: { fr: "PC gamer, écrans gamer, souris, claviers, encre", en: "Gaming PCs, monitors, mice, keyboards, ink", es: "PC gaming, monitores, ratones, teclados, tinta" },
    keywords: {
      fr: ["accessoire gaming", "accessoires gaming", "souris", "souris gaming", "souris gamer", "clavier", "clavier gaming", "clavier gamer", "casque gamer", "casque gaming", "tapis de souris", "siège gamer", "chaise gamer", "webcam", "pc gamer", "pc gaming", "ordinateur gamer", "écran gamer", "écran gaming", "carte graphique", "carte mère", "processeur", "cartouche", "cartouche d'encre", "encre", "toner", "razer", "logitech"],
      en: ["gaming gear", "gaming accessory", "mouse", "mice", "gaming mouse", "keyboard", "gaming keyboard", "gaming headset", "mouse pad", "gaming chair", "webcam", "gaming pc", "gaming laptop", "gaming monitor", "graphics card", "motherboard", "processor", "cartridge", "ink", "toner", "razer", "logitech"],
      es: ["accesorio gaming", "ratón", "ratón gaming", "teclado", "teclado gaming", "auriculares gaming", "alfombrilla", "silla gaming", "webcam", "pc gaming", "portátil gaming", "monitor gaming", "tarjeta gráfica", "placa base", "procesador", "cartucho", "tinta", "tóner", "razer", "logitech"]
    }
  },
  electromenager: {
    floors: ["-1"], icon: "plug",
    label: { fr: "Petit électroménager", en: "Home appliances", es: "Pequeños electrodomésticos" },
    detail: { fr: "Aspirateurs, cuisine, soin, Dyson…", en: "Vacuums, kitchen, personal care, Dyson…", es: "Aspiradoras, cocina, cuidado personal, Dyson…" },
    keywords: {
      fr: ["électroménager", "petit électroménager", "aspirateur", "aspirateur balai", "aspirateur robot", "dyson", "nettoyeur vapeur", "sèche-cheveux", "lisseur", "fer à lisser", "rasoir", "tondeuse", "épilateur", "brosse à dents électrique", "machine à café", "cafetière", "nespresso", "bouilloire", "airfryer", "friteuse", "blender", "mixeur", "hachoir", "robot cuiseur", "micro-ondes", "grille-pain", "sodastream", "fer à repasser", "balance", "pèse-personne", "autocuiseur", "centrifugeuse"],
      en: ["home appliance", "appliance", "vacuum", "vacuum cleaner", "robot vacuum", "dyson", "steam cleaner", "hair dryer", "straightener", "shaver", "trimmer", "epilator", "electric toothbrush", "coffee machine", "coffee maker", "nespresso", "kettle", "air fryer", "deep fryer", "blender", "mixer", "food processor", "microwave", "toaster", "sodastream", "iron", "scale", "bathroom scale"],
      es: ["electrodoméstico", "aspiradora", "aspirador escoba", "robot aspirador", "dyson", "limpiador de vapor", "secador", "plancha de pelo", "afeitadora", "cortapelos", "depiladora", "cepillo de dientes eléctrico", "cafetera", "nespresso", "hervidor", "freidora de aire", "freidora", "batidora", "picadora", "robot de cocina", "microondas", "tostadora", "sodastream", "plancha", "báscula"]
    }
  },
  pcwindows: {
    floors: ["-1"], icon: "laptop",
    label: { fr: "PC Windows & accessoires", en: "Windows PCs & accessories", es: "PC Windows y accesorios" },
    detail: { fr: "Tablettes, écrans, imprimantes, câbles, stockage", en: "Tablets, monitors, printers, cables, storage", es: "Tabletas, monitores, impresoras, cables, almacenamiento" },
    keywords: {
      fr: ["pc", "pc windows", "pc portable", "ordinateur", "ordinateur portable", "pc fixe", "laptop", "asus", "hp", "lenovo", "acer", "dell", "msi",
           "tablette", "tablette android", "tablette samsung", "galaxy tab", "écran pc", "écran d'ordinateur", "moniteur",
           "imprimante", "scanner", "copieur", "clé usb", "disque dur", "disque dur externe", "ssd", "stockage", "carte mémoire",
           "câble", "câble hdmi", "hdmi", "rj45", "ethernet", "câble ethernet", "câble usb", "adaptateur", "rallonge", "multiprise",
           "chargeur ordinateur", "chargeur pc", "sacoche", "housse ordinateur"],
      en: ["pc", "windows pc", "laptop", "computer", "desktop pc", "notebook", "asus", "hp", "lenovo", "acer", "dell", "msi",
           "tablet", "android tablet", "samsung tablet", "galaxy tab", "monitor", "pc monitor", "computer screen",
           "printer", "scanner", "usb stick", "usb key", "flash drive", "hard drive", "hard disk", "external drive", "ssd", "storage", "memory card",
           "cable", "hdmi", "hdmi cable", "rj45", "ethernet", "ethernet cable", "usb cable", "adapter", "extension cord", "power strip",
           "laptop charger", "laptop bag", "laptop case"],
      es: ["pc", "pc windows", "portátil", "ordenador", "ordenador portátil", "asus", "hp", "lenovo", "acer", "dell", "msi",
           "tableta", "tablet", "tableta android", "galaxy tab", "monitor", "monitor pc", "pantalla de ordenador",
           "impresora", "escáner", "memoria usb", "pendrive", "disco duro", "disco externo", "ssd", "almacenamiento", "tarjeta de memoria",
           "cable", "cable hdmi", "hdmi", "rj45", "ethernet", "cable ethernet", "cable usb", "adaptador", "alargador", "regleta",
           "cargador ordenador", "funda portátil"]
    }
  },
  trottinettes: {
    floors: ["-1"], icon: "scooter",
    label: { fr: "Mobilité urbaine", en: "Urban mobility", es: "Movilidad urbana" },
    detail: { fr: "Trottinettes, casques, figurines POP", en: "Scooters, helmets, POP figures", es: "Patinetes, cascos, figuras POP" },
    keywords: {
      fr: ["trottinette", "trotinette", "trottinette électrique", "casque trottinette", "casque de trottinette", "hoverboard", "gyroroue", "mobilité urbaine", "vélo électrique", "antivol"],
      en: ["scooter", "electric scooter", "scooter helmet", "hoverboard", "urban mobility", "electric bike", "e-bike", "bike lock"],
      es: ["patinete", "patinete eléctrico", "casco patinete", "casco de patinete", "hoverboard", "movilidad urbana", "bicicleta eléctrica", "candado"]
    }
  },
  photo: {
    floors: ["-1"], icon: "camera",
    label: { fr: "Photo & micros", en: "Photo & microphones", es: "Foto y micrófonos" },
    detail: { fr: "Appareils, drones, micros-cravates", en: "Cameras, drones, lapel mics", es: "Cámaras, drones, micrófonos de corbata" },
    keywords: {
      fr: ["photo", "appareil photo", "appareil photo jetable", "caméra", "gopro", "drone", "micro", "microphone", "micro cravate", "stabilisateur", "gimbal", "carte sd", "objectif", "trépied", "flash"],
      en: ["photo", "camera", "disposable camera", "gopro", "drone", "mic", "microphone", "lapel mic", "stabilizer", "gimbal", "sd card", "lens", "tripod", "flash"],
      es: ["foto", "cámara", "cámara de fotos", "gopro", "dron", "micro", "micrófono", "micrófono de corbata", "estabilizador", "gimbal", "tarjeta sd", "objetivo", "trípode", "flash"]
    }
  },
  tv: {
    floors: ["-1"], icon: "tv",
    label: { fr: "TV", en: "TV", es: "TV" },
    detail: { fr: "Téléviseurs", en: "Televisions", es: "Televisores" },
    keywords: {
      fr: ["tv", "télé", "télévision", "téléviseur", "télécommande", "smart tv", "oled", "qled", "vidéoprojecteur", "support tv"],
      en: ["tv", "television", "telly", "remote control", "smart tv", "oled", "qled", "projector", "tv mount"],
      es: ["tv", "tele", "televisor", "televisión", "mando a distancia", "smart tv", "oled", "qled", "proyector", "soporte tv"]
    }
  },
  audio: {
    floors: ["-1"], icon: "headphones",
    label: { fr: "Audio", en: "Audio", es: "Audio" },
    detail: { fr: "Casques, enceintes, platines", en: "Headphones, speakers, turntables", es: "Auriculares, altavoces, tocadiscos" },
    keywords: {
      fr: ["audio", "casque", "casque audio", "écouteur", "écouteurs sans fil", "enceinte", "enceinte bluetooth", "barre de son", "platine", "platine vinyle", "lecteur vinyle", "tourne-disque", "jbl", "bose", "sonos"],
      en: ["audio", "headphone", "headphones", "earphone", "earbud", "wireless earbuds", "speaker", "bluetooth speaker", "soundbar", "turntable", "record player", "jbl", "bose", "sonos"],
      es: ["audio", "auricular", "auriculares", "cascos", "auriculares inalámbricos", "altavoz", "altavoces", "altavoz bluetooth", "barra de sonido", "tocadiscos", "jbl", "bose", "sonos"]
    }
  },
  apple: {
    floors: ["-1"], icon: "apple",
    // Priorité : tout ce qui cite un produit Apple va au rayon Apple.
    boost: 20,
    label: { fr: "Apple", en: "Apple", es: "Apple" },
    detail: { fr: "iPhone, iPad, Mac, accessoires", en: "iPhone, iPad, Mac, accessories", es: "iPhone, iPad, Mac, accesorios" },
    keywords: {
      fr: ["apple", "iphone", "ipad", "ipod", "airpods", "mac", "macbook", "imac", "apple watch", "apple pencil", "magsafe", "lightning", "coque iphone", "coque ipad", "clavier ipad", "chargeur iphone", "chargeur apple", "tablette apple"],
      en: ["apple", "iphone", "ipad", "ipod", "airpods", "mac", "macbook", "imac", "apple watch", "apple pencil", "magsafe", "lightning", "iphone case", "ipad case", "ipad keyboard", "iphone charger", "apple charger"],
      es: ["apple", "iphone", "ipad", "ipod", "airpods", "mac", "macbook", "imac", "apple watch", "apple pencil", "magsafe", "lightning", "funda iphone", "funda ipad", "teclado ipad", "cargador iphone", "cargador apple"]
    }
  },
  jeuxSociete: {
    floors: ["-1"], icon: "dice",
    label: { fr: "Jeux de société", en: "Board games", es: "Juegos de mesa" },
    detail: { fr: "Près de l'escalier", en: "Near the stairs", es: "Cerca de la escalera" },
    keywords: {
      fr: ["jeu de société", "jeux de société", "jeu de plateau", "puzzle", "jeu de cartes", "monopoly"],
      en: ["board game", "puzzle", "card game", "monopoly"],
      es: ["juego de mesa", "juegos de mesa", "puzle", "rompecabezas", "juego de cartas", "monopoly"]
    }
  },
  savRetrait: {
    floors: ["-1"], icon: "wrench",
    label: { fr: "SAV & retrait des colis", en: "After-sales & order pickup", es: "Posventa y recogida" },
    detail: { fr: "Réparations, retours, commandes", en: "Repairs, returns, orders", es: "Reparaciones, devoluciones, pedidos" },
    keywords: {
      fr: ["sav", "service après-vente", "réparation", "réparer", "garantie", "panne", "en panne", "cassé", "écran cassé", "retour", "retour produit", "remboursement", "échange",
           "retrait", "retrait de commande", "commande", "click and collect", "colis", "récupérer ma commande"],
      en: ["after-sales", "customer service", "repair", "warranty", "return", "refund", "exchange", "broken", "broken screen",
           "order pickup", "pick up", "pickup", "click and collect", "my order", "order", "parcel"],
      es: ["servicio técnico", "posventa", "reparación", "reparar", "garantía", "devolución", "reembolso", "cambio", "roto", "pantalla rota",
           "recogida", "recoger pedido", "pedido", "click and collect", "paquete"]
    }
  },
  caisse: {
    floors: ["-1"], icon: "card",
    label: { fr: "Caisses", en: "Checkout", es: "Caja" },
    detail: { fr: "Paiement", en: "Payment", es: "Pago" },
    keywords: {
      fr: ["caisse", "caisses", "payer", "paiement", "carte cadeau", "chèque cadeau", "paiement en plusieurs fois", "financement", "facture"],
      en: ["checkout", "cashier", "till", "pay", "payment", "gift card", "invoice"],
      es: ["caja", "pagar", "pago", "tarjeta regalo", "financiación", "factura"]
    }
  },
  adhesion: {
    floors: ["-1"], icon: "person",
    label: { fr: "Adhésion", en: "Membership", es: "Socios" },
    detail: { fr: "Carte Fnac, avantages", en: "Fnac card, benefits", es: "Tarjeta Fnac, ventajas" },
    keywords: {
      fr: ["adhésion", "adhérent", "carte fnac", "carte adhérent", "carte de fidélité", "fidélité", "abonnement", "fnac plus"],
      en: ["membership", "member", "fnac card", "loyalty card", "subscription"],
      es: ["socio", "membresía", "tarjeta fnac", "tarjeta de fidelidad", "suscripción"]
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
  label: { fr: "Livres, CD, vinyles, DVD (Fnac Wilson)", en: "Books, CDs, vinyl, DVDs (Fnac Wilson)", es: "Libros, CD, vinilos, DVD (Fnac Wilson)" },
  detail: { fr: "", en: "", es: "" },
  keywords: {
    fr: ["livre", "livres", "roman", "poche", "polar", "bd", "bande dessinée", "manga", "comics", "livre jeunesse", "livre enfant",
         "manuel scolaire", "livre scolaire", "parascolaire", "cahier de vacances", "dictionnaire", "guide de voyage", "livre audio",
         "cd", "album", "vinyle", "disque vinyle", "33 tours", "dvd", "blu-ray", "coffret dvd"],
    en: ["book", "books", "novel", "paperback", "comic", "comic book", "graphic novel", "manga", "children's book",
         "textbook", "school book", "dictionary", "travel guide", "audiobook",
         "cd", "album", "vinyl", "vinyl record", "record", "lp", "dvd", "blu-ray"],
    es: ["libro", "libros", "novela", "cómic", "manga", "libro infantil", "libro de texto", "diccionario", "guía de viaje", "audiolibro",
         "cd", "álbum", "vinilo", "disco de vinilo", "dvd", "blu-ray"]
  }
};

// Boutons de recherches fréquentes (page principale).
export const SUGGESTIONS = [
  { zone: "audio", icon: "headphones", label: { fr: "Casques audio", en: "Headphones", es: "Auriculares" } },
  { zone: "gaming", icon: "gamepad", label: { fr: "Consoles", en: "Consoles", es: "Consolas" } },
  { zone: "apple", icon: "apple", label: { fr: "iPhone", en: "iPhone", es: "iPhone" } },
  { zone: "tv", icon: "tv", label: { fr: "TV", en: "TV", es: "TV" } },
  { zone: "savRetrait", icon: "wrench", label: { fr: "SAV", en: "Repairs", es: "Posventa" } },
  { zone: "savRetrait", icon: "package", label: { fr: "Retrait commande", en: "Order pickup", es: "Recoger pedido" } }
];

// Petites intentions de conversation (quand aucun rayon ne correspond).
export const INTENTS = {
  hello: ["bonjour", "salut", "bonsoir", "hello", "hi", "hey", "good morning", "hola", "buenos dias", "buenas tardes"],
  thanks: ["merci", "merci beaucoup", "thank you", "thanks", "gracias", "muchas gracias"],
  human: ["vendeur", "vendeuse", "conseiller", "conseillere", "quelqu un", "aide", "staff", "someone", "assistant", "employee", "help", "vendedor", "vendedora", "dependiente", "ayuda"]
};
