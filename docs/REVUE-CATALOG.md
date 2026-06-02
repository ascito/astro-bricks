# Revue critique du catalog Bricks

**Auteur :** revue effectuée pendant l'implémentation initiale `astro-bricks` (28 mai 2026)
**Périmètre :** 57 briques inspectées sur les 93 annoncées (fetch tronqué — revue à compléter).

---

## Vue d'ensemble

Le catalogue est **globalement très solide**. La nomenclature est cohérente, les schemas sont bien typés, les enum sont explicites. Les commentaires et observations ci-dessous sont des **suggestions d'amélioration**, pas des critiques structurelles.

Bilan rapide :
- ✅ **Excellent** : button, badge, card, heading, link, container, stack, breadcrumb, accordion, alert, hero, image
- ⚠️ **Bon mais perfectible** : voir « Améliorations suggérées » ci-dessous
- ❌ **Manques majeurs identifiés** : voir « Briques manquantes » à la fin

---

## Améliorations suggérées brique par brique

### `button`
**Manque** :
- `iconPosition` : `'left' | 'right'` (déjà présent `icon` probable, mais ordre non spécifié)
- `loading` : `boolean` — état chargement avec spinner intégré (commun en UX moderne)
- `fullWidth` : `boolean` — utile pour CTAs mobile

**À renforcer** :
- `type` : ajouter `'submit' | 'reset'` au enum si pas déjà là
- `target` + `rel` : ajouter quand `href` est défini (pour les liens externes)

### `image`
**Manque critique** :
- `sizes` : `string` — pour responsive images (`(max-width: 768px) 100vw, 50vw`)
- `srcset` : ou plus simple, un tableau `sources: [{src, width}]`
- `placeholder` : `'none' | 'blur' | 'color'` — pour LQIP
- `placeholderColor` : `string` (couleur dominante pour fond pendant le load)

C'est essentiel pour Core Web Vitals (LCP, CLS). Sans `sizes`/`srcset`, l'image charge en `cover` plein écran, énorme.

### `heading`
**Manque** :
- `id` : `string` — pour ancres `#section-title` (essentiel pour table-of-contents et liens internes)
- `eyebrow` : `string` — pré-titre stylisé (très courant en design éditorial)

### `text`
**Manque** :
- `lead` : `boolean` — paragraphe d'introduction (style plus gros)
- `truncate` : `'none' | 'lines-2' | 'lines-3' | 'ellipsis'` — pour cards et listes

### `link`
**À renforcer** :
- `external` : `boolean` — auto-ajouter icône ↗ + `target=_blank` + `rel=noopener noreferrer`
- `tracking` : `string` — paramètre data-attribute pour analytics (`data-source=...`)

### `card`
**Manque** :
- `interactive` : `boolean` — rend toute la carte cliquable via un slot `href`
- `media` slot — pour image/vidéo qui occupe toute la largeur sans padding
- `aspectRatio` : `'16:9' | '4:3' | '1:1'` pour le slot media

### `hero`
**Manque** :
- `video` : `string` — background vidéo au lieu d'image
- `parallax` : `boolean`
- Slot `media` (pour mettre une image custom au lieu d'un background CSS)

### `accordion`
**Manque** :
- Le contenu des items est limité à `string` (`answer`). Pour des réponses riches, accepter un **slot `body`** par item (référencer d'autres briques).
- `defaultOpen` : `number | number[]` — index des items ouverts au chargement
- `jsonLd` : `boolean` — auto-générer le JSON-LD `FAQPage` (énorme valeur SEO)

### `breadcrumb`
**Bon dans l'ensemble**. Ajouter peut-être :
- `jsonLd` : `boolean` — auto-générer `BreadcrumbList` JSON-LD

### `comparison-table` (vue dans le catalog, pas inspectée)
**Vital pour sites affiliés**. À vérifier que le schema permet :
- Lignes avec types variés (text, badge, rating, boolean → ✓/✕)
- Cellules avec couleur de fond conditionnelle
- Highlight d'une colonne (« notre choix »)
- Tri par colonne (optionnel, ajoute du JS)

### `rating`
**Manque très probable** :
- `count` : `number` — nombre d'avis affichés à côté (« 4.5 ★ (1 234) »)
- `max` : `number` — pour adapter sur 10 ou 5
- `interactive` : `boolean` — pour formulaire d'avis

### `cookie-banner`
**Manque** :
- Variantes RGPD (« accepter / refuser / personnaliser ») vs simple « OK »
- Position : `'bottom' | 'top' | 'modal'`
- Le rendre **legally compliant** par défaut (refuser au même niveau qu'accepter)

### `seo`
**Probablement très important**. Le schema doit couvrir :
- Open Graph : `og:title`, `og:description`, `og:image`, `og:type`, `og:url`
- Twitter Card : `twitter:card`, `twitter:title`, `twitter:image`
- Canonical
- `noindex`/`nofollow` flags
- Article schema : `publishedTime`, `modifiedTime`, `author`

### `form-field` (référencé dans la doc mais pas vu dans le catalog échantillon)
S'il n'existe pas, l'ajouter — c'est le composite qui combine `label` + `input` + `error` + `helper`. Indispensable.

---

## Briques manquantes (à ajouter au catalog)

### Pour les sites affiliés / e-commerce

| Brique proposée | Catégorie | Usage |
|---|---|---|
| `product-card` | composite | Card produit avec image + titre + prix + note + CTA |
| `affiliate-link` | composite | Bouton Amazon avec tag automatique + rel sponsored nofollow |
| `pricing-table` | composite | Grille de tarifs (3 colonnes type SaaS) |
| `comparison-table` ✓ | composite | Déjà au catalog — à vérifier la richesse du schema |
| `feature-grid` | composite | Grille 3-4 colonnes (icon + titre + texte) |
| `stats-row` | composite | Bandeau de chiffres clés (« 10 marques · 16 produits ») |
| `testimonials-row` | composite | Cards témoignages clients |
| `disclosure-banner` | composite | Bandeau transparence affiliation (DGCCRF) |

### Pour le blog / éditorial

| Brique proposée | Catégorie | Usage |
|---|---|---|
| `article-header` | composite | h1 + auteur + date + temps de lecture + cover |
| `toc` | composite | Table of contents auto-générée depuis les h2/h3 |
| `prose` | composite | Wrapper Markdown rich (typographie article) |
| `pull-quote` | primitive | Citation décorative en gros dans l'article |
| `aside-note` | composite | Encadré note/warning/info (différent de alert) |
| ✅ `share-buttons` | composite | **IMPLÉMENTÉE** — Partage social FB/X/WhatsApp/LinkedIn/mail/copy avec icônes SVG inline, zéro tracker tiers, bouton "Copier" avec feedback toast |
| `related-articles` | composite | « À lire aussi » avec 3-4 cards |

### Pour le SEO / structure

| Brique proposée | Catégorie | Usage |
|---|---|---|
| `json-ld` | primitive | Injecter un Schema.org JSON-LD libre |
| `meta-tags` | primitive | Bloc de meta génériques (description, robots, viewport…) |
| `sitemap-link` | primitive | `<link rel="sitemap">` |
| `favicon` | composite | Tous les `<link rel="icon">` + theme-color + manifest |
| `canonical` | primitive | `<link rel="canonical">` standalone |

### Pour le layout

| Brique proposée | Catégorie | Usage |
|---|---|---|
| `header` ✓ | composite | Déjà mentionné dans le catalog |
| `footer` ✓ | composite | Idem |
| `nav` | composite | Menu de navigation horizontal (différent de nav-list) |
| `mobile-menu` | composite | Drawer mobile avec hamburger |
| `section` | primitive | `<section>` sémantique avec id, eyebrow, anchor |

### Intelligence (catégorie sous-développée)

Une seule brique `ai-generate` dans le catalog actuel. Pistes pour enrichir :

| Brique proposée | Usage |
|---|---|
| `ai-summarize` | Résumer un texte long en 2-3 phrases (build time) |
| `ai-related-keywords` | Suggérer 5 keywords SEO depuis un titre |
| `ai-faq-generate` | Générer 5 Q/R depuis le contenu d'un guide |
| `ai-image-alt` | Générer un alt depuis l'URL/contexte d'une image |
| `ai-meta-description` | Générer une meta description optimisée 155 caractères |

Ces briques sont **build-time** (compilation du site), pas runtime. Elles font un fetch LLM via une API key configurée.

---

## Réflexions sur l'architecture spec

### Points forts

1. **Structure plate + slots par référence** : excellent choix. Plus simple à valider, à parser, à manipuler programmatiquement qu'un JSON arborescent. Permet aussi l'**éclatement / la réutilisation** d'une brique entre plusieurs slots (rare mais utile).

2. **Schemas JSON Schema standards** : interopérable, doc auto-générable, validation ajv possible.

3. **3 catégories sémantiques** : `primitive | composite | intelligence` est limpide.

4. **Agnosticisme du rendu** : super pour avoir des adapters (Astro, React, PDF, native…).

### Points à clarifier dans la spec

1. **Nommage des slots** : pas de convention claire. Card a `header/body/footer`, Hero a `actions`, Stack a `children`. Documenter une convention : utiliser `children` par défaut pour le slot principal, et nommer les slots spécifiques explicitement.

2. **Validation des slots dans le schema** : actuellement le schema valide les `inputs` mais pas la structure des slots (quels slots sont autorisés ? lesquels sont required ?). Suggestion : ajouter un champ `slots` au catalog :
```json
{
  "id": "card",
  "schema": { ... },
  "slots": {
    "header": { "required": false, "maxItems": 1, "allowedBricks": [...] },
    "body":   { "required": true,  "minItems": 1 },
    "footer": { "required": false, "maxItems": 1 }
  }
}
```

3. **Inputs dynamiques / variables** : la brique `variable` existe dans le catalog mais pas clairement documentée. Peut-être ajouter un système de templating : `inputs: { content: "Bienvenue {{user.name}}" }` avec un objet `data` au niveau de la composition.

4. **Versioning des briques** : prévoir `version: "1.0.0"` par brique pour gérer la rétrocompatibilité quand un schema évolue.

5. **Catégorie `intelligence` sous-spécifiée** : préciser le contrat (input prompt → output text/json) et le coût (token usage).

---

## Roadmap suggérée pour le catalog

**v1.1 (court terme)** : enrichir les schemas existants avec les manques signalés (image responsive, heading id, accordion jsonLd, etc.)

**v1.2** : ajouter le bloc « briques manquantes — sites affiliés / e-commerce » (8 briques)

**v1.3** : ajouter le bloc « briques blog / éditorial » (7 briques)

**v1.4** : enrichir la catégorie `intelligence` avec 5 briques AI build-time

**v2.0** : refonte spec avec `slots` typés au niveau catalog, versioning des briques, système de variables

---

## Conclusion

Le catalog est une **excellente fondation**. Avec ~30 ajouts/enrichissements ciblés, il couvre 95% des besoins d'un design system moderne pour sites éditoriaux + e-commerce léger + landings.

Le plus urgent à mon sens, par ordre de priorité business :
1. ✅ Implémenter `comparison-table` proprement (sites affiliés)
2. ✅ Enrichir `image` pour Core Web Vitals
3. ✅ Ajouter `affiliate-link`, `product-card`, `disclosure-banner`
4. ✅ Ajouter `json-ld` + `seo` + `breadcrumb.jsonLd` (SEO essentiel)
5. ✅ Ajouter `article-header`, `toc`, `related-articles` (contenu éditorial)
