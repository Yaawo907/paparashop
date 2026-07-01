export const SITE = {
  name: "PaparaShop",
  fullName: "Papara SHOP",
  tagline: "Photo • Audiovisuel",
  foundedYear: 2017,
  // Legacy fields (siège Bénin) — conservés pour compatibilité
  city: "Abomey-Calavi",
  country: "Bénin",
  phone: "+229 62 44 74 74",
  phoneHref: "tel:+22962447474",
  email: "contact@paparashop.bj",
  emailHref: "mailto:contact@paparashop.bj",
  catalogUrl: "https://www.lesagecom.net/catalogue/paparashop/",
  socials: {
    facebook: "https://www.facebook.com/paparashop",
    instagram: "https://www.instagram.com/paparashop",
    tiktok: "https://www.tiktok.com/@paparashop",
  },
  hours: "Lun – Sam : 9h00 – 19h00",
};

export type Location = {
  slug: "benin" | "burkina" | "togo";
  country: string;
  countryCode: "BJ" | "BF" | "TG";
  city: string;
  address: string;
  phone: string;
  phoneHref: string;
  whatsapp?: string;
  whatsappHref?: string;
  since: number;
  isHQ?: boolean;
  hours: string;
};

export const LOCATIONS: Location[] = [
  {
    slug: "benin",
    country: "Bénin",
    countryCode: "BJ",
    city: "Abomey-Calavi",
    address: "Abomey-Calavi, Bénin",
    phone: "+229 62 44 74 74",
    phoneHref: "tel:+22962447474",
    whatsapp: "+229 62 44 74 74",
    whatsappHref: "https://wa.me/22962447474",
    since: 2017,
    isHQ: true,
    hours: "Lun – Sam : 9h00 – 19h00",
  },
  {
    slug: "burkina",
    country: "Burkina Faso",
    countryCode: "BF",
    city: "Ouagadougou",
    address: "Ouagadougou, Burkina Faso",
    phone: "+226 00 00 00 00",
    phoneHref: "tel:+22600000000",
    since: 2021,
    hours: "Lun – Sam : 9h00 – 18h00",
  },
  {
    slug: "togo",
    country: "Togo",
    countryCode: "TG",
    city: "Lomé",
    address: "Lomé, Togo",
    phone: "+228 00 00 00 00",
    phoneHref: "tel:+22800000000",
    since: 2025,
    hours: "Lun – Sam : 9h00 – 18h00",
  },
];

export const COMMITMENTS = [
  {
    title: "Authenticité garantie",
    text: "Produits neufs et scellés, sourcés en circuit officiel — jamais de reconditionné détourné.",
  },
  {
    title: "Garantie jusqu'à 2 ans",
    text: "Chaque équipement bénéficie d'une garantie constructeur ou revendeur, selon la catégorie.",
  },
  {
    title: "Commande spéciale sous 10 jours",
    text: "Un modèle absent du stock ? Nous l'importons pour vous en 10 jours ouvrés.",
  },
  {
    title: "Standards européens",
    text: "Sélection alignée sur les exigences qualité des marchés européens et professionnels.",
  },
  {
    title: "SAV et suivi",
    text: "Assistance technique, entretien et prise en charge post-vente sur toute la gamme.",
  },
  {
    title: "Conseil expert",
    text: "Une équipe de passionnés pour cadrer votre besoin réel avant tout achat.",
  },
];

export const INSTITUTIONAL_CLIENTS = [
  { name: "PORTEO BTP", sector: "BTP & Infrastructures" },
  { name: "CONCENTRIX", sector: "Services numériques" },
  { name: "MSFP", sector: "Institutionnel" },
  { name: "ABMS", sector: "Santé publique" },
  { name: "AFRICAN PARKS", sector: "Conservation & ONG" },
];
