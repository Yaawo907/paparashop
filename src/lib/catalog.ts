import {
  Camera,
  Mic,
  Lightbulb,
  Video,
  Monitor,
  Headphones,
  Cable,
  Radio,
  type LucideIcon,
} from "lucide-react";
import rodeImg from "@/assets/audio/rode.jpg";
import shureImg from "@/assets/audio/shure.jpg";
import sennheiserImg from "@/assets/audio/sennheiser.jpg";
import hollylandImg from "@/assets/audio/hollyland.jpg";
import boyaImg from "@/assets/audio/boya.jpg";

export type Brand = {
  name: string;
  models: string[];
  highlights: string[];
  image?: string;
};


export type Category = {
  slug: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  brands: Brand[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "appareils-photo-video",
    icon: Camera,
    title: "Appareils photo & vidéo",
    tagline: "Boîtiers reflex, hybrides et caméras cinéma",
    description:
      "Les grandes marques mondiales, du boîtier amateur au flagship broadcast, en circuit officiel.",
    brands: [
      {
        name: "Canon",
        models: ["EOS R5", "EOS R6 Mark II", "EOS 5D Mark IV", "EOS 250D"],
        highlights: [
          "Leader mondial des reflex et hybrides plein format",
          "Écosystème d'objectifs RF et EF le plus complet",
          "Références en photo de mariage, mode et sport",
        ],
      },
      {
        name: "Nikon",
        models: ["Z9", "Z6 III", "Z5", "D850"],
        highlights: [
          "Robustesse légendaire des boîtiers pro",
          "Capteurs plein format haute dynamique",
          "Colorimétrie appréciée en portrait et paysage",
        ],
      },
      {
        name: "Sony",
        models: ["A7 IV", "A7S III", "A6700", "FX3"],
        highlights: [
          "Autofocus temps réel de référence sur le marché",
          "Gamme Alpha plébiscitée par les vidéastes",
          "Boîtiers hybrides ultra-compacts et performants",
        ],
      },
      {
        name: "Fujifilm",
        models: ["X-T5", "X-S20", "X100VI", "GFX 100S"],
        highlights: [
          "Simulations de films uniques (Classic Chrome, Velvia…)",
          "Design vintage et ergonomie tactile",
          "Moyen format GFX pour la photo commerciale",
        ],
      },
      {
        name: "Panasonic Lumix",
        models: ["S5 II", "GH6", "GH7"],
        highlights: [
          "Références vidéo hybrides 4K/6K sans limite",
          "Stabilisation 5 axes de haut niveau",
          "Formats ProRes et V-Log intégrés",
        ],
      },
      {
        name: "DJI",
        models: ["Ronin 4D", "Osmo Pocket 3", "Mavic 3 Pro", "Air 3"],
        highlights: [
          "Leader mondial des drones et gimbals professionnels",
          "Solutions caméra tout-en-un pour créateurs",
          "Intégration parfaite avec workflows broadcast",
        ],
      },
    ],
  },
  {
    slug: "audio-micros",
    icon: Mic,
    title: "Audio & micros",
    tagline: "Captation broadcast, interview et podcast",
    description:
      "Micros filaires, HF, cravate et USB pour tournage, live et production audio professionnelle.",
    brands: [
      {
        name: "Rode",
        image: rodeImg,
        models: ["NTG5", "VideoMic Pro+", "Wireless GO II", "PodMic"],
        highlights: [
          "Standard mondial du micro caméra et podcast",
          "Systèmes HF ultra-compacts pour vlog et interview",
          "Fiabilité éprouvée en broadcast",
        ],
      },
      {
        name: "Shure",
        image: shureImg,
        models: ["SM7B", "SM58", "MV7", "BLX Wireless"],
        highlights: [
          "Référence radio, scène et studio depuis 90 ans",
          "SM7B : micro voix de référence en podcast",
          "Solutions HF fiables pour événementiel",
        ],
      },
      {
        name: "Sennheiser",
        image: sennheiserImg,
        models: ["MKE 600", "EW 100 G4", "MD 46", "Profile USB"],
        highlights: [
          "Fabrication allemande, qualité audio broadcast",
          "Systèmes HF UHF plébiscités en reportage TV",
          "Micros canon (shotgun) pour tournage cinéma",
        ],
      },
      {
        name: "Hollyland",
        image: hollylandImg,
        models: ["Lark M2", "Lark Max", "Mars 400S Pro"],
        highlights: [
          "Rapport qualité/prix imbattable en HF",
          "Solutions transmission vidéo sans fil",
          "Micros lavaliers ultra-discrets pour créateurs",
        ],
      },
      {
        name: "BOYA",
        image: boyaImg,
        models: ["BY-M1", "BY-WM4 Pro", "BY-BM3030"],
        highlights: [
          "Accessoires audio abordables pour smartphone et DSLR",
          "Kits interview complets prêts à l'emploi",
        ],
      },
    ],

  },
  {
    slug: "eclairage-studio",
    icon: Lightbulb,
    title: "Éclairage & studio",
    tagline: "Lumière continue, flash et softbox",
    description:
      "Panneaux LED, softbox, fonds et supports pour portrait, produit et vidéo studio.",
    brands: [
      {
        name: "Godox",
        models: ["SL-60W", "AD200 Pro", "VL150", "LC500R"],
        highlights: [
          "Leader du flash de studio abordable",
          "Écosystème complet flash + LED",
          "Compatibilité multi-marques (Canon, Nikon, Sony…)",
        ],
      },
      {
        name: "Aputure",
        models: ["Amaran 200x", "LS 300x", "MC RGB", "Nova P300c"],
        highlights: [
          "Références cinéma en éclairage LED",
          "Colorimétrie CRI/TLCI proche du parfait",
          "Solutions RGB pour ambiances et effets",
        ],
      },
      {
        name: "Ulanzi",
        models: ["VL200", "LT24 Softbox", "VL49 Mini"],
        highlights: [
          "Éclairage compact pour créateurs de contenu",
          "Accessoires studio nomades et pratiques",
        ],
      },
      {
        name: "VIJIM",
        models: ["VL120", "K10", "LED Video Light"],
        highlights: [
          "Panneaux LED portables idéaux pour vlog et interview",
          "Rapport puissance/prix excellent",
        ],
      },
      {
        name: "Sutefoto",
        models: ["Softbox Octogonale", "Beauty Dish", "Kit fond studio"],
        highlights: [
          "Modificateurs de lumière et accessoires studio complets",
          "Solutions fond, supports et diffusion",
        ],
      },
    ],
  },
  {
    slug: "tournage-production",
    icon: Video,
    title: "Tournage & production",
    tagline: "Stabilisateurs, gimbals et drones",
    description:
      "Matériel de captation en mouvement : gimbals, sliders, rigs et drones professionnels.",
    brands: [
      {
        name: "DJI",
        models: ["RS 4 Pro", "RS 3 Mini", "Mavic 3 Pro", "Inspire 3"],
        highlights: [
          "Standard mondial du gimbal et du drone",
          "Solutions FPV, cinéma et cartographie",
        ],
      },
      {
        name: "Zhiyun",
        models: ["Crane 4", "Weebill 3S", "Smooth 5S"],
        highlights: [
          "Alternative sérieuse à DJI en stabilisation",
          "Modes intelligents et suivi de sujet",
        ],
      },
      {
        name: "Manfrotto",
        models: ["MVK502 Trépied vidéo", "Rig cage", "Sliders"],
        highlights: [
          "Trépieds et supports de référence en broadcast",
          "Fabrication italienne robuste",
        ],
      },
      {
        name: "SmallRig",
        models: ["Cages Sony/Canon/Nikon", "Accessoires rig", "Poignées"],
        highlights: [
          "Cages et accessoires vidéo dédiés par boîtier",
          "Écosystème modulaire pour tournage",
        ],
      },
    ],
  },
  {
    slug: "moniteurs",
    icon: Monitor,
    title: "Moniteurs de contrôle",
    tagline: "Écrans HDMI/SDI pour tournage et étalonnage",
    description:
      "Moniteurs on-camera et de réalisation pour contrôle live, focus critique et étalonnage.",
    brands: [
      {
        name: "Atomos",
        models: ["Ninja V", "Ninja V+", "Shogun Connect"],
        highlights: [
          "Enregistreurs-moniteurs ProRes RAW de référence",
          "Écran haute luminosité pour tournage extérieur",
        ],
      },
      {
        name: "Feelworld",
        models: ["F6 Plus", "LUT7S", "Master MA7"],
        highlights: [
          "Moniteurs on-camera abordables et fiables",
          "Support LUT 3D et scopes intégrés",
        ],
      },
      {
        name: "Blackmagic",
        models: ["Video Assist 5\" 12G", "Video Assist 7\" 12G HDR"],
        highlights: [
          "Enregistreurs 12G-SDI pour production broadcast",
          "Écrans HDR calibrés",
        ],
      },
    ],
  },
  {
    slug: "casques-enceintes",
    icon: Headphones,
    title: "Casques & enceintes",
    tagline: "Monitoring studio et écoute nomade",
    description:
      "Casques de monitoring, casques nomades et enceintes de proximité pour production audio.",
    brands: [
      {
        name: "Sony",
        models: ["MDR-7506", "WH-1000XM5", "MDR-M1ST"],
        highlights: [
          "MDR-7506 : casque de référence broadcast depuis 30 ans",
          "Réduction de bruit active haut de gamme",
        ],
      },
      {
        name: "Audio-Technica",
        models: ["ATH-M50x", "ATH-M40x", "ATH-R70x"],
        highlights: [
          "Casques monitoring plébiscités en home studio",
          "Rendu neutre et fatigue d'écoute minimale",
        ],
      },
      {
        name: "JBL",
        models: ["305P MkII", "Tune 770NC", "Charge 5"],
        highlights: [
          "Enceintes de monitoring nearfield",
          "Gamme nomade Bluetooth robuste",
        ],
      },
      {
        name: "Bose",
        models: ["QC Ultra", "700", "SoundLink"],
        highlights: [
          "Référence en réduction de bruit et écoute nomade",
        ],
      },
    ],
  },
  {
    slug: "cables-batteries-accessoires",
    icon: Cable,
    title: "Câbles, batteries & accessoires",
    tagline: "Consommables et pièces critiques du tournage",
    description:
      "Cartes mémoire, batteries, câbles HDMI/SDI, filtres et accessoires indispensables au quotidien.",
    brands: [
      {
        name: "SanDisk",
        models: ["Extreme Pro SD 128 Go", "CFexpress Type B", "Extreme Portable SSD"],
        highlights: [
          "Cartes mémoire de référence pour photo et 4K/8K",
          "SSD portables ultra-rapides pour rushs vidéo",
        ],
      },
      {
        name: "Lexar",
        models: ["Professional SDXC", "CFexpress Diamond", "microSD 1 To"],
        highlights: [
          "Alternative fiable et rapide à SanDisk",
        ],
      },
      {
        name: "Newell / Patona",
        models: ["Batteries LP-E6NH", "NP-FZ100", "EN-EL15c", "Chargeurs double"],
        highlights: [
          "Batteries compatibles à prix maîtrisé",
          "Chargeurs USB-C double slot",
        ],
      },
      {
        name: "Accessoires",
        models: [
          "Câbles HDMI 2.1 & SDI",
          "Filtres ND variables, UV, polarisants",
          "Sacs et hardcases",
          "Cartes CFexpress / SD haute vitesse",
        ],
        highlights: [
          "Tout le consommable pour ne jamais rater le tournage",
        ],
      },
    ],
  },
  {
    slug: "streaming-broadcast",
    icon: Radio,
    title: "Streaming & broadcast",
    tagline: "Régie, mixage et diffusion live",
    description:
      "Solutions live streaming, multi-cam et broadcast pour créateurs, églises, TV et événementiel.",
    brands: [
      {
        name: "Blackmagic Design",
        models: ["ATEM Mini Pro ISO", "ATEM Mini Extreme", "Web Presenter HD"],
        highlights: [
          "Régies de mélange vidéo abordables et pro",
          "Références en église, TV locale et streaming",
        ],
      },
      {
        name: "Elgato",
        models: ["Stream Deck +", "Cam Link 4K", "Wave XLR"],
        highlights: [
          "Écosystème complet pour streamers et créateurs",
          "Contrôleurs et capture card leaders du marché",
        ],
      },
      {
        name: "Yolobox",
        models: ["Yolobox Pro", "Yolobox Ultra", "Yolobox Mini"],
        highlights: [
          "Régie tout-en-un multi-cam avec streaming direct",
          "Idéal pour événementiel et culte",
        ],
      },
      {
        name: "RØDE",
        models: ["RØDECaster Pro II", "RØDECaster Duo", "Streamer X"],
        highlights: [
          "Consoles audio pour podcast et streaming",
        ],
      },
    ],
  },
];
