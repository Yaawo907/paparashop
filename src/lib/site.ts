import shopBeninImg from "@/assets/papara-shop-benin.jpeg.asset.json";

export const SITE = {
  name: "PaparaShop",
  fullName: "Papara SHOP",
  tagline: "Photo • Audiovisuel",
  foundedYear: 2017,
  // Legacy fields (siège Bénin) — conservés pour compatibilité
  city: "Godomey",
  country: "Bénin",
  phone: "+229 01 62 44 74 74",
  phoneHref: "tel:+2290162447474",
  email: "contact@paparashop.bj",
  emailHref: "mailto:contact@paparashop.bj",
  catalogUrl: "https://www.lesagecom.net/catalogue/paparashop/",
  socials: {
    facebook: "https://www.facebook.com/share/1DqnXkij9t/",
    instagram: "https://www.instagram.com/paparashop_bj?igsh=dTR3YjQycjExcGFk",
    tiktok: "https://www.tiktok.com/@paparashop?_r=1&_t=ZS-981xPrrW9ES",
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
  whatsapp2?: string;
  whatsapp2Href?: string;
  since: number;
  isHQ?: boolean;
  hours: string;
  image?: string;
  imageAlt?: string;
};

export const LOCATIONS: Location[] = [
  {
    slug: "benin",
    country: "Bénin",
    countryCode: "BJ",
    city: "Godomey",
    address: "Godomey Gare, en face de la pharmacie Houenoussou Gare",
    phone: "+229 01 62 44 74 74",
    phoneHref: "tel:+2290162447474",
    whatsapp: "+229 01 62 44 74 74",
    whatsappHref: "https://wa.me/2290162447474",
    whatsapp2: "+229 01 61 81 48 28",
    whatsapp2Href: "https://wa.me/2290161814828",
    since: 2017,
    isHQ: true,
    hours: "Lun – Sam : 9h00 – 19h00",
    image: shopBeninImg.url,
    imageAlt: "Boutique PaparaShop — Abomey-Calavi / Godomey, Bénin",
  },
  {
    slug: "burkina",
    country: "Burkina Faso",
    countryCode: "BF",
    city: "Ouagadougou",
    address: "Ouagadougou, Burkina Faso",
    phone: "+226 71 75 41 02",
    phoneHref: "tel:+22671754102",
    whatsapp: "+226 71 75 41 02",
    whatsappHref: "https://wa.me/22671754102",
    since: 2021,
    hours: "Lun – Sam : 9h00 – 18h00",
  },
  {
    slug: "togo",
    country: "Togo",
    countryCode: "TG",
    city: "Lomé",
    address: "Bè Aveto, à 50 m de la pharmacie Cristal, Lomé",
    phone: "+228 92 27 12 20",
    phoneHref: "tel:+22892271220",
    whatsapp: "+228 92 27 12 20",
    whatsappHref: "https://wa.me/22892271220",
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

import porteoLogo from "@/assets/clients/porteo-btp.png.asset.json";
import concentrixLogo from "@/assets/clients/concentrix.png.asset.json";
import msfpLogo from "@/assets/clients/msfp.png.asset.json";
import abmsLogo from "@/assets/clients/abms.png.asset.json";
import africanParksLogo from "@/assets/clients/african-parks.png.asset.json";
import beninExcellenceLogo from "@/assets/clients/benin-excellence.png.asset.json";
import iucnLogo from "@/assets/clients/iucn.jpeg.asset.json";
import sensBeninLogo from "@/assets/clients/sens-benin.png.asset.json";
import siabLogo from "@/assets/clients/siab.jpeg.asset.json";
import lafargeLogo from "@/assets/clients/scb-lafarge.jpeg.asset.json";

export type InstitutionalClient = {
  name: string;
  sector: string;
  logo: string;
};

export const INSTITUTIONAL_CLIENTS: InstitutionalClient[] = [
  { name: "PORTEO BTP", sector: "BTP & Infrastructures", logo: porteoLogo.url },
  { name: "CONCENTRIX", sector: "Services numériques", logo: concentrixLogo.url },
  { name: "MSFP", sector: "Institutionnel", logo: msfpLogo.url },
  { name: "ABMS", sector: "Santé publique", logo: abmsLogo.url },
  { name: "AFRICAN PARKS", sector: "Conservation & ONG", logo: africanParksLogo.url },
  { name: "Bénin Excellence", sector: "Institutionnel", logo: beninExcellenceLogo.url },
  { name: "IUCN", sector: "Conservation & ONG", logo: iucnLogo.url },
  { name: "SENS Bénin", sector: "Solidarités Entreprises", logo: sensBeninLogo.url },
  { name: "SIAB", sector: "Industrie", logo: siabLogo.url },
  { name: "SCB Lafarge", sector: "BTP & Matériaux", logo: lafargeLogo.url },
];
