// Catálogo de compatibilidad de VR.AR — modelo por plataforma.
//
// Cada juego declara SOLO en qué plataformas existe ("on"). La compatibilidad
// con cada visor se deriva de ahí, en vez de repetirla nueve veces por juego:
// menos datos que mantener y menos lugares donde equivocarse.
//
//   quest -> Meta Horizon Store (standalone)
//   steam -> SteamVR / PC VR
//   psvr2 -> PlayStation VR2
//   pico  -> tienda PICO (standalone)
//
// "steam" son los App ID de Steam: identificador exacto, la vía más confiable.

const HEADSETS = [
  {
    "id": "quest-3",
    "name": "Meta Quest 3",
    "short": "Quest 3",
    "native": [
      "quest"
    ],
    "pcvr": true
  },
  {
    "id": "quest-3s",
    "name": "Meta Quest 3S",
    "short": "Quest 3S",
    "native": [
      "quest"
    ],
    "pcvr": true
  },
  {
    "id": "quest-2",
    "name": "Meta Quest 2",
    "short": "Quest 2",
    "native": [
      "quest"
    ],
    "pcvr": true
  },
  {
    "id": "psvr2",
    "name": "PlayStation VR2",
    "short": "PS VR2",
    "native": [
      "psvr2"
    ],
    "pcvr": true
  },
  {
    "id": "pico-4",
    "name": "PICO 4",
    "short": "PICO 4",
    "native": [
      "pico"
    ],
    "pcvr": true
  },
  {
    "id": "pico-4-ultra",
    "name": "PICO 4 Ultra",
    "short": "PICO 4 Ultra",
    "native": [
      "pico"
    ],
    "pcvr": true
  },
  {
    "id": "valve-index",
    "name": "Valve Index",
    "short": "Index",
    "native": [],
    "pcvr": true
  },
  {
    "id": "htc-vive",
    "name": "HTC Vive",
    "short": "Vive",
    "native": [],
    "pcvr": true
  },
  {
    "id": "other",
    "name": "Otro visor",
    "short": "Otro",
    "native": [],
    "pcvr": false
  }
];

const PLATFORM_LABEL = {
  quest: 'Meta Horizon Store',
  steam: 'SteamVR / PC VR',
  psvr2: 'PlayStation VR2',
  pico: 'Tienda PICO'
};

const CATALOG = [
  {
    "slug": "beat-saber",
    "title": "Beat Saber",
    "steam": [
      "620980"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2"
    ],
    "off": [
      "pico"
    ]
  },
  {
    "slug": "half-life-alyx",
    "title": "Half-Life: Alyx",
    "steam": [
      "546560"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "synth-riders",
    "title": "Synth Riders",
    "steam": [
      "885000"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "pavlov",
    "title": "Pavlov",
    "aliases": [
      "pavlov vr"
    ],
    "steam": [
      "555160"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2"
    ],
    "off": [
      "pico"
    ]
  },
  {
    "slug": "alien-rogue-incursion",
    "title": "Alien: Rogue Incursion VR",
    "aliases": [
      "alien rogue incursion"
    ],
    "steam": [
      "1850050"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2"
    ],
    "off": [
      "pico"
    ]
  },
  {
    "slug": "behemoth",
    "title": "Skydance's BEHEMOTH",
    "aliases": [
      "behemoth",
      "skydances behemoth"
    ],
    "steam": [
      "1707990"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2"
    ],
    "off": [
      "pico"
    ]
  },
  {
    "slug": "metro-awakening",
    "title": "Metro Awakening",
    "steam": [
      "2669410"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2"
    ],
    "off": []
  },
  {
    "slug": "moss",
    "title": "Moss",
    "aliases": [
      "moss vr"
    ],
    "steam": [
      "846470"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "moss-book-ii",
    "title": "Moss: Book II",
    "aliases": [
      "moss ii vr",
      "moss ii"
    ],
    "steam": [
      "2059670"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "kayak-vr-mirage",
    "title": "Kayak VR: Mirage",
    "steam": [
      "1683340"
    ],
    "on": [
      "steam",
      "psvr2"
    ],
    "off": [
      "quest"
    ]
  },
  {
    "slug": "gorilla-tag",
    "title": "Gorilla Tag",
    "steam": [
      "1533390"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2"
    ],
    "off": [
      "pico"
    ]
  },
  {
    "slug": "no-mans-sky",
    "title": "No Man's Sky",
    "aliases": [
      "no mans sky"
    ],
    "steam": [
      "275850"
    ],
    "on": [
      "steam",
      "psvr2"
    ],
    "off": [
      "quest"
    ]
  },
  {
    "slug": "microsoft-flight-simulator-2024",
    "title": "Microsoft Flight Simulator 2024",
    "aliases": [
      "microsoft flight simulator"
    ],
    "steam": [
      "2537590"
    ],
    "on": [
      "steam",
      "psvr2"
    ],
    "off": [
      "quest",
      "pico"
    ]
  },
  {
    "slug": "assetto-corsa-competizione",
    "title": "Assetto Corsa Competizione",
    "aliases": [
      "acc"
    ],
    "steam": [
      "805550"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "pistol-whip",
    "title": "Pistol Whip",
    "steam": [
      "1079800"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "walking-dead-saints-sinners",
    "title": "The Walking Dead: Saints & Sinners",
    "aliases": [
      "saints and sinners"
    ],
    "steam": [
      "916840"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "vacation-simulator",
    "title": "Vacation Simulator",
    "steam": [
      "726830"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "walkabout-mini-golf",
    "title": "Walkabout Mini Golf VR",
    "aliases": [
      "walkabout mini golf"
    ],
    "steam": [
      "1408230"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "job-simulator",
    "title": "Job Simulator",
    "steam": [
      "448280"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "zombie-army-vr",
    "title": "Zombie Army VR",
    "steam": [
      "2058030"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2"
    ],
    "off": [
      "pico"
    ]
  },
  {
    "slug": "gran-turismo-7",
    "title": "Gran Turismo 7",
    "on": [
      "psvr2"
    ],
    "off": [
      "quest",
      "steam",
      "pico"
    ]
  },
  {
    "slug": "horizon-call-of-the-mountain",
    "title": "Horizon Call of the Mountain",
    "on": [
      "psvr2"
    ],
    "off": [
      "quest",
      "steam",
      "pico"
    ]
  },
  {
    "slug": "resident-evil-village",
    "title": "Resident Evil Village",
    "aliases": [
      "resident evil 8"
    ],
    "on": [
      "psvr2"
    ],
    "off": [
      "steam",
      "quest",
      "pico"
    ]
  },
  {
    "slug": "resident-evil-4-vr-mode",
    "title": "Resident Evil 4 Modo VR",
    "aliases": [
      "resident evil 4 vr mode"
    ],
    "on": [
      "psvr2"
    ],
    "off": [
      "steam",
      "quest",
      "pico"
    ]
  },
  {
    "slug": "superhot-vr",
    "title": "SUPERHOT VR",
    "steam": [
      "617830"
    ],
    "on": [
      "quest",
      "steam",
      "pico"
    ],
    "off": [
      "psvr2"
    ]
  },
  {
    "slug": "blade-and-sorcery",
    "title": "Blade and Sorcery",
    "aliases": [
      "blade & sorcery"
    ],
    "steam": [
      "629730"
    ],
    "on": [
      "steam",
      "quest",
      "pico"
    ],
    "off": [
      "psvr2"
    ]
  },
  {
    "slug": "bonelab",
    "title": "BONELAB",
    "steam": [
      "1592190"
    ],
    "on": [
      "quest",
      "steam"
    ],
    "off": [
      "psvr2"
    ]
  },
  {
    "slug": "into-the-radius-vr",
    "title": "Into the Radius VR",
    "aliases": [
      "into the radius"
    ],
    "steam": [
      "1012790"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "into-the-radius-2",
    "title": "Into the Radius 2",
    "steam": [
      "2307350"
    ],
    "on": [
      "quest",
      "steam"
    ],
    "off": [
      "psvr2"
    ]
  },
  {
    "slug": "demeo",
    "title": "Demeo",
    "steam": [
      "1484280"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "vertigo-2",
    "title": "Vertigo 2",
    "steam": [
      "843390"
    ],
    "on": [
      "steam",
      "psvr2"
    ],
    "off": [
      "quest"
    ]
  },
  {
    "slug": "fallout-4-vr",
    "title": "Fallout 4 VR",
    "steam": [
      "611660"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "elite-dangerous",
    "title": "Elite Dangerous",
    "steam": [
      "359320"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2"
    ]
  },
  {
    "slug": "subnautica",
    "title": "Subnautica",
    "steam": [
      "264710"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "ragnarock",
    "title": "Ragnarock",
    "steam": [
      "1345820"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "the-light-brigade",
    "title": "The Light Brigade",
    "steam": [
      "1579880"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2"
    ],
    "off": []
  },
  {
    "slug": "the-dark-pictures-switchback-vr",
    "title": "The Dark Pictures: Switchback VR",
    "aliases": [
      "switchback vr"
    ],
    "on": [
      "psvr2"
    ],
    "off": [
      "quest",
      "steam",
      "pico"
    ]
  },
  {
    "slug": "crossfire-sierra-squad",
    "title": "Crossfire: Sierra Squad",
    "on": [
      "steam",
      "psvr2"
    ],
    "off": []
  },
  {
    "slug": "synapse",
    "title": "Synapse",
    "on": [
      "psvr2"
    ],
    "off": [
      "quest",
      "steam",
      "pico"
    ]
  },
  {
    "slug": "star-wars-tales-galaxys-edge-enhanced",
    "title": "Star Wars: Tales from the Galaxy's Edge - Enhanced Edition",
    "aliases": [
      "star wars tales from the galaxys edge enhanced edition",
      "tales from the galaxys edge"
    ],
    "on": [
      "quest",
      "psvr2"
    ],
    "off": [
      "steam",
      "pico"
    ]
  },
  {
    "slug": "resident-evil-4",
    "title": "Resident Evil 4",
    "aliases": [
      "resident evil 4 remake"
    ],
    "on": [
      "quest",
      "psvr2"
    ],
    "off": [
      "steam",
      "pico"
    ]
  },
  {
    "slug": "phasmophobia",
    "title": "Phasmophobia",
    "steam": [
      "739630"
    ],
    "on": [
      "steam",
      "psvr2"
    ],
    "off": [
      "quest",
      "pico"
    ]
  },
  {
    "slug": "vrchat",
    "title": "VRChat",
    "steam": [
      "438100"
    ],
    "on": [
      "quest",
      "steam",
      "pico"
    ],
    "off": [
      "psvr2"
    ]
  },
  {
    "slug": "war-thunder",
    "title": "War Thunder",
    "steam": [
      "236390"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "tabletop-simulator",
    "title": "Tabletop Simulator",
    "steam": [
      "286160"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "hitman-world-of-assassination",
    "title": "HITMAN World of Assassination",
    "steam": [
      "1659040"
    ],
    "on": [
      "steam",
      "psvr2"
    ],
    "off": [
      "quest",
      "pico"
    ]
  },
  {
    "slug": "the-forest",
    "title": "The Forest",
    "steam": [
      "242760"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "vtol-vr",
    "title": "VTOL VR",
    "steam": [
      "667970"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "escape-simulator",
    "title": "Escape Simulator",
    "steam": [
      "1435790"
    ],
    "on": [
      "quest",
      "steam"
    ],
    "off": [
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "x-plane-12",
    "title": "X-Plane 12",
    "steam": [
      "2014780"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "dcs-world-steam-edition",
    "title": "DCS World Steam Edition",
    "aliases": [
      "dcs world"
    ],
    "steam": [
      "223750"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "automobilista-2",
    "title": "Automobilista 2",
    "steam": [
      "1066890"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "assetto-corsa",
    "title": "Assetto Corsa",
    "steam": [
      "244210"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "the-elder-scrolls-v-skyrim-vr",
    "title": "The Elder Scrolls V: Skyrim VR",
    "aliases": [
      "skyrim vr"
    ],
    "steam": [
      "611670"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "keep-talking-and-nobody-explodes",
    "title": "Keep Talking and Nobody Explodes",
    "steam": [
      "341800"
    ],
    "on": [
      "quest",
      "steam"
    ],
    "off": [
      "psvr2"
    ]
  },
  {
    "slug": "derail-valley",
    "title": "Derail Valley",
    "steam": [
      "588030"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "underdogs",
    "title": "UnderDogs",
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "the-thrill-of-the-fight-2",
    "title": "The Thrill of the Fight 2",
    "on": [
      "quest"
    ],
    "off": [
      "steam",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "blade-sorcery",
    "title": "Blade & Sorcery",
    "aliases": [
      "blade and sorcery"
    ],
    "steam": [
      "629730"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "arizona-sunshine-2",
    "title": "Arizona Sunshine 2",
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "madison-vr",
    "title": "MADiSON VR",
    "on": [
      "quest",
      "steam",
      "psvr2"
    ],
    "off": []
  },
  {
    "slug": "red-matter-2",
    "title": "Red Matter 2",
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "the-7th-guest-vr",
    "title": "The 7th Guest VR",
    "on": [
      "quest",
      "steam",
      "psvr2"
    ],
    "off": []
  },
  {
    "slug": "ghostbusters-rise-of-the-ghost-lord",
    "title": "Ghostbusters: Rise of the Ghost Lord",
    "on": [
      "quest",
      "psvr2"
    ],
    "off": [
      "steam",
      "pico"
    ]
  },
  {
    "slug": "c-smash-vrs-new-dimension",
    "title": "C-Smash VRS New Dimension",
    "aliases": [
      "c-smash vrs"
    ],
    "on": [
      "psvr2"
    ],
    "off": [
      "steam"
    ]
  },
  {
    "slug": "five-nights-at-freddy-s-help-wanted-2",
    "title": "Five Nights at Freddy’s: Help Wanted 2",
    "aliases": [
      "five nights at freddys help wanted 2",
      "fnaf help wanted 2"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "hubris",
    "title": "Hubris",
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "among-us-3d",
    "title": "Among Us 3D",
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "the-thrill-of-the-fight",
    "title": "The Thrill of the Fight",
    "on": [
      "quest",
      "steam"
    ],
    "off": [
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "golf",
    "title": "GOLF+",
    "on": [
      "quest"
    ],
    "off": [
      "psvr2"
    ]
  },
  {
    "slug": "eleven-table-tennis",
    "title": "Eleven Table Tennis",
    "on": [
      "quest",
      "steam",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "population-one",
    "title": "Population: One",
    "on": [
      "quest"
    ],
    "off": [
      "steam",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "i-am-cat",
    "title": "I Am Cat",
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "gorn",
    "title": "GORN",
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "ghosts-of-tabor",
    "title": "Ghosts of Tabor",
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "real-vr-fishing",
    "title": "Real VR Fishing",
    "on": [
      "quest",
      "steam",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "green-hell-vr",
    "title": "Green Hell VR",
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "le-mans-ultimate",
    "title": "Le Mans Ultimate",
    "steam": [
      "2399420"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "f1-25",
    "title": "F1® 25",
    "steam": [
      "3059520"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "payday-2",
    "title": "PAYDAY 2 VR",
    "aliases": [
      "payday 2"
    ],
    "steam": [
      "218620"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "il-2-sturmovik",
    "title": "IL-2 Sturmovik: Battle of Stalingrad",
    "aliases": [
      "il 2 sturmovik",
      "il-2 sturmovik"
    ],
    "steam": [
      "307960"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "microsoft-flight-simulator-2020",
    "title": "Microsoft Flight Simulator (2020) 40th Anniversary Edition",
    "aliases": [
      "microsoft flight simulator",
      "microsoft flight simulator 2020"
    ],
    "steam": [
      "1250410"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "carx-drift-racing-online",
    "title": "CarX Drift Racing Online",
    "steam": [
      "635260"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "dirt-rally-2-0",
    "title": "DiRT Rally 2.0",
    "aliases": [
      "dirt rally 2"
    ],
    "steam": [
      "690790"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "project-wingman",
    "title": "Project Wingman",
    "steam": [
      "895870"
    ],
    "on": [
      "steam",
      "psvr2"
    ],
    "off": [
      "quest",
      "pico"
    ]
  },
  {
    "slug": "boneworks",
    "title": "BONEWORKS",
    "steam": [
      "823500"
    ],
    "on": [
      "steam"
    ],
    "off": [
      "quest",
      "psvr2",
      "pico"
    ]
  },
  {
    "slug": "the-room-vr",
    "title": "The Room VR: A Dark Matter",
    "aliases": [
      "the room vr"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "fnaf-secret-of-the-mimic",
    "title": "Five Nights at Freddy's: Secret of the Mimic",
    "aliases": [
      "five nights at freddys secret of the mimic",
      "fnaf secret of the mimic"
    ],
    "on": [
      "steam",
      "psvr2"
    ],
    "off": [
      "quest"
    ]
  },
  {
    "slug": "arizona-sunshine-2-2",
    "title": "Arizona Sunshine® VR 2",
    "aliases": [
      "arizona sunshine 2"
    ],
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "breachers-psvr2",
    "title": "Breachers",
    "on": [
      "quest",
      "steam",
      "psvr2",
      "pico"
    ],
    "off": []
  },
  {
    "slug": "legendary-tales",
    "title": "Legendary Tales",
    "on": [
      "quest",
      "steam",
      "psvr2"
    ],
    "off": []
  }
];

// ── Derivación: plataformas del juego + capacidades del visor → veredicto ──
//
// Cada juego declara dos listas: "on" son las plataformas donde verificamos que
// ESTÁ, y "off" aquellas donde verificamos que NO está. Lo que no figura en
// ninguna de las dos es simplemente desconocido, y ahí no afirmamos nada.
//
// Esta distinción es la razón de ser del modelo: decir "no funciona" cuando en
// realidad no tenemos el dato es exactamente el tipo de error que hace que una
// herramienta así no sirva para nada.
//
// 'yes' nativo · 'pc' hace falta una PC · 'no' verificado que no · null sin datos
function resolve(game, headsetId) {
  if (!game) return null;
  const headset = HEADSETS.find((h) => h.id === headsetId);
  if (!headset) return null;
  const on = game.on || [];
  const off = game.off || [];

  const native = (headset.native || []).find((platform) => on.includes(platform));
  if (native) return { status: 'yes', label: 'Funciona en tu visor', detail: PLATFORM_LABEL[native] };

  if (headset.pcvr && on.includes('steam')) {
    const detail = headset.id === 'psvr2'
      ? 'Requiere una PC y el adaptador oficial de PS VR2'
      : 'Requiere una PC capaz de mover VR';
    return { status: 'pc', label: 'Sí, pero con PC', detail };
  }

  if (headset.id === 'other') return null;

  // Para decir que no, tenemos que haber verificado las vías que le servirían
  // a este visor: su tienda nativa y, si sirve para PC VR, también Steam.
  const needed = [...(headset.native || [])];
  if (headset.pcvr) needed.push('steam');
  const allChecked = needed.every((platform) => off.includes(platform));
  if (!allChecked) {
    return { status: 'unknown', label: 'Sin datos para este visor', detail: 'Todavía no verificamos este juego con este modelo.' };
  }

  const where = on.map((platform) => PLATFORM_LABEL[platform]).filter(Boolean);
  return {
    status: 'no',
    label: 'No funciona en tu visor',
    detail: where.length ? `Solo está disponible en ${where.join(' y ')}` : 'No está en ninguna plataforma compatible con tu visor'
  };
}

function platformsOf(game) {
  return (game?.on || []).map((platform) => PLATFORM_LABEL[platform]).filter(Boolean);
}

if (typeof globalThis !== 'undefined') {
  globalThis.VRAR_HEADSETS = HEADSETS;
  globalThis.VRAR_CATALOG = CATALOG;
  globalThis.VRAR_resolve = resolve;
  globalThis.VRAR_platformsOf = platformsOf;
  globalThis.VRAR_PLATFORM_LABEL = PLATFORM_LABEL;
}
