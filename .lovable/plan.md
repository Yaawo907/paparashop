# Plan — PaparaShop site vitrine

Site vitrine React pour Papara SHOP (Abomey-Calavi, Benin) — vente de matériel photo/vidéo. Le catalogue détaillé / paiements restent gérés sur `https://www.lesagecom.net/paparashop` (lien externe).

## Stack
- React + TypeScript + Vite (déjà en place)
- TailwindCSS + design tokens HSL dans `index.css` / `tailwind.config.ts`
- React Router (BrowserRouter) — routes : `/`, `/catalogue`, `/a-propos`, `/services`, `/contact`
- Framer Motion pour animations légères (scroll reveal, hero)
- Lucide icons
- SEO : `<title>`, meta description, H1 unique, JSON-LD `LocalBusiness` par page

## Design system
Palette retenue (variante du HTML fourni — teal + jaune, sobre et moderne) :
- `--primary` teal `#1B8A8A` (HSL `180 67% 32%`)
- `--primary-dark` `#0F6F6F`
- `--accent` jaune `#FFD700`
- `--background` `#F5F5F5` clair / sections sombres en gradient teal→noir
- Typo : Poppins (titres) + Inter (corps) via Google Fonts
- Effets signature : glassmorphism sur cards du hero, gradient animé, hover lift, transitions 300–500ms, border-radius 8px

Tous les tokens définis en HSL dans `src/index.css` puis exposés via `tailwind.config.ts` (`primary`, `accent`, etc.) — pas de couleurs hardcodées dans les composants.

## Structure des fichiers
```
src/
  components/
    layout/Header.tsx          # nav sticky, logo PAPARA.SHOP, menu, CTA "Explorer"
    layout/Footer.tsx          # contact, liens, socials
    home/HeroCarousel.tsx      # 5 slides auto-play + prev/next + indicators + pause
    home/Specialties.tsx       # 4 cards (Photo, Vidéo, Accessoires, Studio)
    home/FeaturedProducts.tsx  # 4 produits phares, lien externe
    home/Stats.tsx             # 5105 clients, studio, matériel pro
    shared/SectionTitle.tsx
    shared/ExternalCatalogCTA.tsx  # bouton vers lesagecom.net/paparashop
  pages/
    Index.tsx
    Catalogue.tsx
    About.tsx
    Services.tsx
    Contact.tsx
    NotFound.tsx
  assets/  # images générées (hero + cards)
  App.tsx  # routes
  index.css, main.tsx
```

## Pages

**Home (`/`)**
- Hero carousel 5 slides (Appareils Photo, Caméras 4K, Accessoires Studio, Objectifs, Équipement complet) — autoplay 5s, controls prev/next, indicators, pause, compteur "1/5"
- Section "Nos spécialités" : 4 cards (Photo, Vidéo, Accessoires, Studio)
- Stats : 5 105 clients satisfaits, studio équipé, matériel pro
- Produits phares : 4 cards (Canon EOS R5, Sony A6700, Nikon Z9, Kit LED) — chaque CTA → catalogue externe
- CTA final "Voir le catalogue complet" → `https://www.lesagecom.net/paparashop`

**Catalogue (`/catalogue`)**
- Grille responsive par catégorie (Appareils, Caméras, Accessoires, Studio)
- Cards image + titre + catégorie, hover zoom léger
- Bandeau explicatif + gros bouton "Consulter les prix et commander" → lien externe (nouvelle fenêtre)

**À propos (`/a-propos`)**
- Notre histoire, passion photographie, engagement qualité
- 3 valeurs (Professionnalisme, Expertise, Service client)
- Liens Facebook / Instagram / TikTok

**Services (`/services`)**
- 6 services en cards : vente appareils photo, vente caméras pro, accessoires studio, conseil achat, location (si applicable), SAV
- Chaque card : icon + titre + description

**Contact (`/contact`)**
- Coordonnées : +229 62447474, Abomey-Calavi (Benin), email à définir, horaires placeholder
- Réseaux : Facebook Papara SHOP, Instagram @paparashop, TikTok @paparashop
- Carte ou bloc statique (pas d'intégration Google Maps, juste adresse)
- Formulaire contact simple (front-only, mailto: pour cette V1)

## Images
Génération via `imagegen` (fast) et stockage `src/assets/` :
- 5 visuels hero (DSLR studio, caméra 4K, setup éclairage, objectifs, équipement complet)
- 4 produits phares
- Toutes en JPG, 1920×1080 hero, 800×600 produits
- Pas d'images externes Unsplash (assets locaux pour performance + indépendance)

## Données contact (à confirmer par l'utilisateur après build si besoin)
- Téléphone : `+229 62447474`
- Adresse : Abomey-Calavi, Benin (le HTML fourni mentionnait Cotonou Gbégamey — j'utiliserai **Abomey-Calavi** comme dans le brief principal)
- Email : placeholder `contact@paparashop.bj`
- Socials : Facebook "Papara SHOP", Instagram `paparashop`, TikTok `@paparashop`

## Routing
- BrowserRouter avec route catch-all `*` → NotFound
- Header avec NavLink (état actif souligné en jaune)
- Lien "Catalogue" dans la nav pointe vers `/catalogue` (page interne) ; le bouton "Explorer" / "Voir le catalogue complet" pointe vers l'URL externe

## SEO & a11y
- Title spécifique par page (`PaparaShop — Accueil`, etc.) via composant `<SEO>` simple manipulant document.head
- Meta description française par page
- H1 unique, alt sur toutes les images, `aria-label` sur boutons icônes du carousel
- JSON-LD LocalBusiness sur la home
- Lang `fr` sur `<html>`

## Hors scope V1
- Pas de backend, pas d'auth, pas de panier (catalogue externe gère tout)
- Pas de CMS — contenu en dur dans les composants
- Pas d'i18n
- Google Analytics : à brancher plus tard (un placeholder commenté dans `index.html`)

Une fois validé, je passe en build et je livre l'ensemble en une itération.