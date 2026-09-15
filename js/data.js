// =====================================================================
// Contenus de la borne : textes de l'interface (FR / EN / ES) et rayons.
// Pour ajouter un mot-clé, complétez la liste "keywords" du rayon voulu.
// Les accents, majuscules et pluriels simples (s / x) sont gérés tout seuls.
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
    foundStairs: "Les LEGO et les figurines POP sont dans l'escalier qui relie l'étage 0 au sous-sol.",
    foundEntrance: "L'entrée et la sortie sont à l'étage 0, en bas du plan.",
    notFound: "Je n'ai pas trouvé ce produit. Essayez avec un autre mot, ou appelez un vendeur : il viendra vous aider.",
    hello: "Bonjour ! Quel produit cherchez-vous ?",
    thanks: "Avec plaisir ! Bonne visite à la Fnac.",
    human: "Bien sûr. Touchez « Appeler un vendeur » et un membre de l'équipe viendra vous aider.",
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
    otherStore: "Les livres, BD, manuels scolaires, CD, vinyles et DVD se trouvent à la Fnac Wilson, 16 allées Franklin-Roosevelt, près de Jean-Jaurès. Ici, à la Fnac Jeanne d'Arc, nous sommes spécialisés dans la technique.",
    otherStoreWhat: "Livres, BD, manuels scolaires, CD, vinyles, DVD",
    otherStoreNear: "Près de Jean-Jaurès",
    otherStoreClose: "Retour au plan",
    didYouMean: (word) => `Vous voulez dire « ${word} » ? `,
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
    foundStairs: "LEGO and POP figures are in the staircase between floor 0 and the basement.",
    foundEntrance: "The entrance and exit are on floor 0, at the bottom of the map.",
    notFound: "I couldn't find that product. Try another word, or call a staff member who will come and help you.",
    hello: "Hello! What product are you looking for?",
    thanks: "You're welcome! Enjoy your visit to Fnac.",
    human: "Of course. Tap “Call a staff member” and someone from the team will come to help you.",
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
    otherStore: "Books, comics, school books, CDs, vinyl records and DVDs are at Fnac Wilson, 16 allées Franklin-Roosevelt, near Jean-Jaurès. Here at Fnac Jeanne d'Arc, we specialise in technology.",
    otherStoreWhat: "Books, comics, school books, CDs, vinyl, DVDs",
    otherStoreNear: "Near Jean-Jaurès",
    otherStoreClose: "Back to the map",
    didYouMean: (word) => `Did you mean “${word}”? `,
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
    foundStairs: "Los LEGO y las figuras POP están en la escalera que une la planta 0 con el sótano.",
    foundEntrance: "La entrada y la salida están en la planta 0, abajo en el plano.",
    notFound: "No he encontrado ese producto. Pruebe con otra palabra, o llame a un vendedor: vendrá a ayudarle.",
    hello: "¡Hola! ¿Qué producto busca?",
    thanks: "¡Con mucho gusto! Disfrute de su visita a la Fnac.",
    human: "Por supuesto. Toque «Llamar a un vendedor» y alguien del equipo vendrá a ayudarle.",
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
    otherStore: "Los libros, cómics, libros de texto, CD, vinilos y DVD están en la Fnac Wilson, 16 allées Franklin-Roosevelt, cerca de Jean-Jaurès. Aquí, en la Fnac Jeanne d'Arc, estamos especializados en tecnología.",
    otherStoreWhat: "Libros, cómics, libros de texto, CD, vinilos, DVD",
    otherStoreNear: "Cerca de Jean-Jaurès",
    otherStoreClose: "Volver al plano",
    didYouMean: (word) => `¿Quiere decir «${word}»? `,
    floorName: (f) => FLOOR_NAMES.es[f]
  }
};

// Rayons. "floors" : étage(s) où le rayon apparaît sur le plan.
// "icon" : identifiant d'une icône du fichier index.html (<symbol id="i-...">).
export const ZONES = {
  telephonie: {
    floors: ["0"], icon: "smartphone",
    label: { fr: "Téléphonie Android", en: "Android phones", es: "Telefonía Android" },
    detail: { fr: "Écouteurs filaires, chargeurs…", en: "Wired earphones, chargers…", es: "Auriculares con cable, cargadores…" },
    keywords: {
      fr: ["téléphone", "téléphone portable", "portable", "smartphone", "android", "samsung", "xiaomi", "google pixel", "chargeur", "chargeur téléphone", "écouteur filaire", "écouteurs filaires", "coque téléphone"],
      en: ["phone", "mobile phone", "mobile", "cell phone", "smartphone", "android", "samsung", "xiaomi", "google pixel", "charger", "phone charger", "wired earphone", "wired headphone", "phone case"],
      es: ["teléfono", "móvil", "smartphone", "android", "samsung", "xiaomi", "google pixel", "cargador", "auricular con cable", "auriculares con cable", "funda móvil"]
    }
  },
  escalier: {
    floors: ["0", "-1"], icon: "stairs",
    label: { fr: "Escalier · LEGO & figurines POP", en: "Stairs · LEGO & POP figures", es: "Escalera · LEGO y figuras POP" },
    detail: { fr: "Relie l'étage 0 et le sous-sol", en: "Links floor 0 and the basement", es: "Une la planta 0 y el sótano" },
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
  caisse: {
    floors: ["-1"], icon: "card",
    label: { fr: "Caisse / Adhésion", en: "Checkout / Membership", es: "Caja / Socios" },
    detail: { fr: "Paiement, carte Fnac", en: "Payment, Fnac card", es: "Pago, tarjeta Fnac" },
    keywords: {
      fr: ["caisse", "payer", "paiement", "adhésion", "adhérent", "carte fnac", "carte de fidélité", "carte cadeau", "financement", "paiement en plusieurs fois"],
      en: ["checkout", "cashier", "till", "pay", "payment", "membership", "fnac card", "loyalty card", "gift card"],
      es: ["caja", "pagar", "pago", "socio", "tarjeta fnac", "tarjeta de fidelidad", "tarjeta regalo", "financiación"]
    }
  },
  jeuxSociete: {
    floors: ["-1"], icon: "dice",
    label: { fr: "Jeux de société", en: "Board games", es: "Juegos de mesa" },
    detail: { fr: "", en: "", es: "" },
    keywords: {
      fr: ["jeu de société", "jeux de société", "jeu de plateau", "puzzle"],
      en: ["board game", "puzzle", "card game"],
      es: ["juego de mesa", "juegos de mesa", "puzle", "rompecabezas"]
    }
  },
  sav: {
    floors: ["-1"], icon: "wrench",
    label: { fr: "SAV", en: "After-sales service", es: "Servicio posventa" },
    detail: { fr: "Réparations, retours", en: "Repairs, returns", es: "Reparaciones, devoluciones" },
    keywords: {
      fr: ["sav", "service après-vente", "réparation", "réparer", "garantie", "panne", "en panne", "cassé", "écran cassé", "retour", "retour produit", "remboursement", "échange"],
      en: ["after-sales", "customer service", "repair", "warranty", "return", "refund", "exchange", "broken", "broken screen", "cracked screen"],
      es: ["servicio técnico", "posventa", "reparación", "reparar", "garantía", "devolución", "reembolso", "cambio", "roto", "pantalla rota"]
    }
  },
  retrait: {
    floors: ["-1"], icon: "package",
    label: { fr: "Retrait de commandes", en: "Order pickup", es: "Recogida de pedidos" },
    detail: { fr: "Click & Collect", en: "Click & Collect", es: "Click & Collect" },
    keywords: {
      fr: ["retrait", "retrait de commande", "commande", "click and collect", "click collect", "récupérer ma commande", "colis"],
      en: ["order pickup", "pick up", "pickup", "click and collect", "my order", "order", "parcel"],
      es: ["recogida", "recoger pedido", "pedido", "click and collect", "paquete"]
    }
  },
  cartouches: {
    floors: ["-1"], icon: "printer",
    label: { fr: "Cartouches & accessoires PC", en: "Ink & PC accessories", es: "Cartuchos y accesorios PC" },
    detail: { fr: "Encre, souris, claviers", en: "Ink, mice, keyboards", es: "Tinta, ratones, teclados" },
    keywords: {
      fr: ["cartouche", "cartouche d'encre", "encre", "toner", "souris", "clavier", "tapis de souris", "webcam", "accessoire pc", "accessoires pc"],
      en: ["cartridge", "ink", "toner", "mouse", "mice", "keyboard", "mouse pad", "webcam", "pc accessory", "pc accessories"],
      es: ["cartucho", "tinta", "tóner", "ratón", "teclado", "alfombrilla", "webcam", "accesorio pc", "accesorios pc"]
    }
  },
  gaming: {
    floors: ["-1"], icon: "gamepad",
    label: { fr: "Gaming", en: "Gaming", es: "Gaming" },
    detail: { fr: "Consoles et jeux vidéo", en: "Consoles and video games", es: "Consolas y videojuegos" },
    keywords: {
      fr: ["console", "jeu vidéo", "jeux vidéo", "playstation", "ps5", "ps4", "xbox", "nintendo", "switch", "manette"],
      en: ["console", "video game", "playstation", "ps5", "ps4", "xbox", "nintendo", "switch", "controller", "gamepad"],
      es: ["consola", "videojuego", "playstation", "ps5", "ps4", "xbox", "nintendo", "switch", "mando"]
    }
  },
  trottinettes: {
    floors: ["-1"], icon: "scooter",
    label: { fr: "Trottinettes & figurines POP", en: "Scooters & POP figures", es: "Patinetes y figuras POP" },
    detail: { fr: "", en: "", es: "" },
    keywords: {
      fr: ["trottinette", "trotinette", "trottinette électrique", "casque trottinette", "casque de trottinette", "hoverboard", "gyroroue"],
      en: ["scooter", "electric scooter", "scooter helmet", "hoverboard"],
      es: ["patinete", "patinete eléctrico", "casco patinete", "casco de patinete", "hoverboard"]
    }
  },
  tablette: {
    floors: ["-1"], icon: "tablet",
    label: { fr: "Tablettes Android", en: "Android tablets", es: "Tabletas Android" },
    detail: { fr: "", en: "", es: "" },
    keywords: {
      fr: ["tablette", "tablette android", "tablette samsung", "galaxy tab"],
      en: ["tablet", "android tablet", "samsung tablet", "galaxy tab"],
      es: ["tableta", "tablet", "tableta android", "tableta samsung", "galaxy tab"]
    }
  },
  stockage: {
    floors: ["-1"], icon: "drive",
    label: { fr: "Stockage", en: "Storage", es: "Almacenamiento" },
    detail: { fr: "Clés USB, disques durs", en: "USB sticks, hard drives", es: "Memorias USB, discos duros" },
    keywords: {
      fr: ["stockage", "disque dur", "disque dur externe", "ssd", "clé usb"],
      en: ["storage", "hard drive", "hard disk", "external drive", "ssd", "usb stick", "usb key", "flash drive"],
      es: ["almacenamiento", "disco duro", "disco externo", "ssd", "memoria usb", "pendrive"]
    }
  },
  cables: {
    floors: ["-1"], icon: "cable",
    label: { fr: "Câbles", en: "Cables", es: "Cables" },
    detail: { fr: "HDMI, RJ45, USB…", en: "HDMI, RJ45, USB…", es: "HDMI, RJ45, USB…" },
    keywords: {
      fr: ["câble", "câble hdmi", "hdmi", "rj45", "ethernet", "câble ethernet", "câble usb", "adaptateur", "rallonge", "multiprise"],
      en: ["cable", "hdmi", "hdmi cable", "rj45", "ethernet", "ethernet cable", "usb cable", "adapter", "extension cord", "power strip"],
      es: ["cable", "hdmi", "cable hdmi", "rj45", "ethernet", "cable ethernet", "cable usb", "adaptador", "alargador", "regleta"]
    }
  },
  imprimantes: {
    floors: ["-1"], icon: "printer",
    label: { fr: "Imprimantes", en: "Printers", es: "Impresoras" },
    detail: { fr: "", en: "", es: "" },
    keywords: {
      fr: ["imprimante", "scanner", "copieur"],
      en: ["printer", "scanner", "copier"],
      es: ["impresora", "escáner", "fotocopiadora"]
    }
  },
  pcgamer: {
    floors: ["-1"], icon: "monitor",
    label: { fr: "PC gamer", en: "Gaming PCs", es: "PC gaming" },
    detail: { fr: "Écrans et accessoires gamer", en: "Gaming monitors & gear", es: "Monitores y accesorios gaming" },
    keywords: {
      fr: ["pc gamer", "pc gaming", "ordinateur gamer", "pc portable gamer", "écran gamer", "écran gaming", "carte graphique", "carte mère", "processeur", "souris gamer", "souris gaming", "clavier gamer", "clavier gaming", "casque gamer", "casque gaming", "chaise gamer"],
      en: ["gaming pc", "gaming laptop", "gaming monitor", "graphics card", "motherboard", "processor", "gaming mouse", "gaming keyboard", "gaming headset", "gaming chair"],
      es: ["pc gaming", "pc gamer", "portátil gaming", "monitor gaming", "tarjeta gráfica", "placa base", "procesador", "ratón gaming", "teclado gaming", "auriculares gaming", "silla gaming"]
    }
  },
  autreElectro: {
    floors: ["-1"], icon: "plug",
    label: { fr: "Autre électroménager", en: "Other appliances", es: "Otros electrodomésticos" },
    detail: { fr: "", en: "", es: "" },
    keywords: {
      fr: ["autre électroménager"],
      en: ["other appliance"],
      es: ["otro electrodoméstico", "otros electrodomésticos"]
    }
  },
  pcwindows: {
    floors: ["-1"], icon: "laptop",
    label: { fr: "PC Windows", en: "Windows PCs", es: "PC Windows" },
    detail: { fr: "Asus, HP, Lenovo, Acer…", en: "Asus, HP, Lenovo, Acer…", es: "Asus, HP, Lenovo, Acer…" },
    keywords: {
      fr: ["pc", "pc windows", "pc portable", "ordinateur", "ordinateur portable", "pc fixe", "laptop", "asus", "hp", "lenovo", "acer", "dell"],
      en: ["pc", "windows pc", "laptop", "computer", "desktop pc", "notebook", "asus", "hp", "lenovo", "acer", "dell"],
      es: ["pc", "pc windows", "portátil", "ordenador", "ordenador portátil", "asus", "hp", "lenovo", "acer", "dell"]
    }
  },
  ecranpc: {
    floors: ["-1"], icon: "monitor",
    label: { fr: "Écrans PC", en: "PC monitors", es: "Monitores PC" },
    detail: { fr: "", en: "", es: "" },
    keywords: {
      fr: ["écran pc", "écran d'ordinateur", "moniteur", "écran bureautique"],
      en: ["monitor", "pc monitor", "computer screen", "computer monitor"],
      es: ["monitor", "monitor pc", "pantalla de ordenador"]
    }
  },
  electromenager: {
    floors: ["-1"], icon: "plug",
    label: { fr: "Électroménager", en: "Home appliances", es: "Electrodomésticos" },
    detail: { fr: "Sèche-cheveux, SodaStream…", en: "Hair dryers, SodaStream…", es: "Secadores, SodaStream…" },
    keywords: {
      fr: ["électroménager", "sèche-cheveux", "sodastream", "aspirateur", "machine à café", "cafetière", "micro-ondes"],
      en: ["home appliance", "appliance", "hair dryer", "sodastream", "vacuum", "vacuum cleaner", "coffee machine", "microwave"],
      es: ["electrodoméstico", "secador", "secador de pelo", "sodastream", "aspiradora", "cafetera", "microondas"]
    }
  },
  apple: {
    floors: ["-1"], icon: "apple",
    // Priorité : tout ce qui cite un produit Apple va au rayon Apple (« chargeur d'iPhone », « coque iPad »…).
    boost: 20,
    label: { fr: "Apple", en: "Apple", es: "Apple" },
    detail: { fr: "iPhone, iPad, Mac, accessoires", en: "iPhone, iPad, Mac, accessories", es: "iPhone, iPad, Mac, accesorios" },
    keywords: {
      fr: ["apple", "iphone", "ipad", "ipod", "airpods", "mac", "macbook", "imac", "apple watch", "apple pencil", "magsafe", "lightning", "coque iphone", "coque ipad", "clavier ipad", "chargeur iphone", "chargeur apple", "tablette apple"],
      en: ["apple", "iphone", "ipad", "ipod", "airpods", "mac", "macbook", "imac", "apple watch", "apple pencil", "magsafe", "lightning", "iphone case", "ipad case", "ipad keyboard", "iphone charger", "apple charger"],
      es: ["apple", "iphone", "ipad", "ipod", "airpods", "mac", "macbook", "imac", "apple watch", "apple pencil", "magsafe", "lightning", "funda iphone", "funda ipad", "teclado ipad", "cargador iphone", "cargador apple"]
    }
  },
  audio: {
    floors: ["-1"], icon: "headphones",
    label: { fr: "Audio", en: "Audio", es: "Audio" },
    detail: { fr: "Casques, enceintes, platines", en: "Headphones, speakers, turntables", es: "Auriculares, altavoces, tocadiscos" },
    keywords: {
      fr: ["audio", "casque", "casque audio", "écouteur", "écouteurs sans fil", "enceinte", "enceinte bluetooth", "barre de son", "platine", "platine vinyle", "lecteur vinyle", "tourne-disque", "jbl", "bose"],
      en: ["audio", "headphone", "headphones", "earphone", "earbud", "wireless earbuds", "speaker", "bluetooth speaker", "soundbar", "turntable", "record player", "jbl", "bose"],
      es: ["audio", "auricular", "auriculares", "cascos", "auriculares inalámbricos", "altavoz", "altavoces", "altavoz bluetooth", "barra de sonido", "tocadiscos", "jbl", "bose"]
    }
  },
  tv: {
    floors: ["-1"], icon: "tv",
    label: { fr: "TV", en: "TV", es: "TV" },
    detail: { fr: "Téléviseurs", en: "Televisions", es: "Televisores" },
    keywords: {
      fr: ["tv", "télé", "télévision", "téléviseur", "télécommande", "smart tv", "oled", "qled"],
      en: ["tv", "television", "telly", "remote control", "smart tv", "oled", "qled"],
      es: ["tv", "tele", "televisor", "televisión", "mando a distancia", "smart tv", "oled", "qled"]
    }
  },
  photo: {
    floors: ["-1"], icon: "camera",
    label: { fr: "Photo / Drones / Micros", en: "Photo / Drones / Mics", es: "Foto / Drones / Micros" },
    detail: { fr: "", en: "", es: "" },
    keywords: {
      fr: ["photo", "appareil photo", "appareil photo jetable", "caméra", "gopro", "drone", "micro", "microphone", "stabilisateur", "gimbal", "carte sd", "objectif", "trépied"],
      en: ["photo", "camera", "disposable camera", "gopro", "drone", "mic", "microphone", "stabilizer", "gimbal", "sd card", "lens", "tripod"],
      es: ["foto", "cámara", "cámara de fotos", "cámara desechable", "gopro", "dron", "micro", "micrófono", "estabilizador", "gimbal", "tarjeta sd", "objetivo", "trípode"]
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
  { zone: "sav", icon: "wrench", label: { fr: "SAV", en: "Repairs", es: "Posventa" } },
  { zone: "retrait", icon: "package", label: { fr: "Retrait commande", en: "Order pickup", es: "Recoger pedido" } }
];

// Petites intentions de conversation (quand aucun rayon ne correspond).
export const INTENTS = {
  hello: ["bonjour", "salut", "bonsoir", "hello", "hi", "hey", "good morning", "hola", "buenos dias", "buenas tardes"],
  thanks: ["merci", "merci beaucoup", "thank you", "thanks", "gracias", "muchas gracias"],
  human: ["vendeur", "vendeuse", "conseiller", "conseillere", "quelqu un", "aide", "staff", "someone", "assistant", "employee", "help", "vendedor", "vendedora", "dependiente", "ayuda"]
};
