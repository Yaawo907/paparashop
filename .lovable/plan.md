# Plan d'alignement du site sur le document client

## Objectif
Restructurer le site vitrine PapaRashop pour refléter fidèlement le plan catalogue fourni par le client : 8 catégories produits, présence tri-pays (Bénin/Burkina/Togo), histoire depuis 2017, engagements qualité et partenaires institutionnels.

---

## 1. Mise à jour des données centrales

**`src/lib/site.ts`** — enrichissement de la source unique de vérité :
- Ajouter `foundedYear: 2017` et calcul d'ancienneté.
- Passer `locations` d'un objet unique à un tableau `[Bénin (siège), Burkina Faso, Togo]` avec ville, adresse, téléphone, année d'implantation.
- Ajouter `commitments` (6 engagements : authenticité, garantie 2 ans, commande spéciale 10j, standards européens, SAV, conseil expert).
- Ajouter `institutionalClients` (PORTEO BTP, CONCENTRIX, MSFP, ABMS, AFRICAN PARKS…).

**Nouveau : `src/lib/catalog.ts`** — structure typée des 8 catégories tirée du docx :
```ts
type Brand = { name: string; models: string[]; highlights: string[] };
type Category = { slug; icon; title; tagline; description; brands: Brand[] };
```
Contenu : Appareils photo/vidéo, Audio/Micros, Éclairage studio, Tournage (stabilisateurs/gimbals/drones), Moniteurs, Casques/Enceintes, Câbles/Batteries/Accessoires, Streaming/Broadcast.

---

## 2. Refonte de la page Catalogue (`src/routes/catalogue.tsx`)

Remplace la page actuelle (4 catégories génériques → 8 catégories fidèles au brief).

Structure :
1. **Hero catalogue** : titre + phrase de positionnement ("Seule boutique spécialisée d'Afrique de l'Ouest francophone") + CTA vers `lesagecom.net/catalogue/paparashop/`.
2. **Grille des 8 catégories** en cartes avec icône Lucide, nombre de marques, description courte.
3. **Section par catégorie** (ancres scroll) : titre + tagline + grille de marques. Chaque marque = carte cliquable ouvrant une modale `Dialog` shadcn avec la liste des modèles et points clés du docx.
4. **Bandeau "Engagements"** : 6 piliers en icônes.
5. **Section "Produits vedettes"** avec Tabs shadcn : Nouveautés / Best-sellers / Offres spéciales.
6. **CTA final** vers plateforme externe.

---

## 3. Refonte page À propos (`src/routes/about.tsx`)

- **Timeline verticale** : 2017 Bénin → 2021 Burkina Faso → 2025 Togo, avec le "pourquoi" (marché du reconditionné nigérian, besoin de crédibilité pro).
- **Section mission/vision** reformulée depuis le docx.
- **Grille "Ils nous font confiance"** avec les 5 clients institutionnels nommés (logos ou blocs texte) — complémentaire à la section `TrustedBy` (marques fournisseurs) de la home.
- **Chiffres clés** mis à jour : 8 ans, 3 pays, 5000+ références, garantie 2 ans.

---

## 4. Refonte page Contact (`src/routes/contact.tsx`)

- **3 cartes pays** (Bénin siège / Burkina / Togo) avec adresse, tel, WhatsApp, horaires.
- Formulaire contact conservé.
- Carte / plans à défaut d'intégration Google Maps réelle.
- Footer mis à jour pour lister les 3 pays.

---

## 5. Impacts Home

- **Header/Footer** : ajouter mention "Bénin • Burkina Faso • Togo".
- **Hero** : sous-titre inclut "Depuis 2017" et "3 pays".
- **Nouvelle section `Commitments`** (6 engagements) placée entre `Specialties` et `FeaturedProducts`.
- **`Specialties`** : passer de 4 à 8 items pour rester cohérent avec les 8 catégories catalogue (version condensée, "Voir plus" → `/catalogue#slug`).
- SEO : JSON-LD `LocalBusiness` étendu à 3 adresses (`branch`), `foundingDate: 2017-01-01`.

---

## 6. Composants nouveaux à créer

- `src/components/catalog/CategorySection.tsx`
- `src/components/catalog/BrandCard.tsx` + `BrandDetailsDialog.tsx`
- `src/components/home/Commitments.tsx`
- `src/components/about/Timeline.tsx`
- `src/components/about/InstitutionalClients.tsx`
- `src/components/contact/CountryCard.tsx`

---

## 7. Détails techniques

- Toutes les données catalogue vivent dans `src/lib/catalog.ts` (pas d'appel réseau), typées, importées par la page.
- Les modales utilisent `Dialog` shadcn déjà installé.
- Animations Framer Motion : stagger sur les grilles de marques, fade sur la timeline.
- Aucune modification du thème (teal/jaune conservé).
- Aucun backend requis (contenu statique). Lovable Cloud non nécessaire à ce stade.
- Les liens "Commander" continuent de pointer vers `https://www.lesagecom.net/catalogue/paparashop/`.

---

## 8. Hors périmètre (à valider séparément avec le client)

- Colonne "Points clés" vide dans le docx pour DJI, Hollyland, Ulanzi, Aputure, Sutefoto → je mets des descriptions génériques crédibles, à faire relire.
- Vraies photos des boutiques Bénin/Burkina/Togo → placeholders illustratifs pour l'instant.
- Logos officiels des clients institutionnels (PORTEO, CONCENTRIX…) → blocs texte stylisés en attendant les fichiers.
- Back-office pour éditer Nouveautés/Best-sellers/Promos → contenu figé pour l'instant, migrable vers Lovable Cloud si besoin.

---

## Livrables (ordre d'exécution)

1. `site.ts` + création `catalog.ts`
2. Page Catalogue refondue + composants catalog
3. Composant Commitments + intégration home
4. Page À propos refondue (Timeline + InstitutionalClients)
5. Page Contact refondue (3 pays)
6. Header/Footer + SEO JSON-LD

**Estimation** : ~10-12 fichiers créés/modifiés en une passe.

Confirmez ce plan (ou dites-moi ce qu'il faut ajuster) et je lance l'implémentation.
