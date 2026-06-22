# astro-bricks

Bibliothèque de composants Astro + moteur de composition JSON : design system unifié, briques business, SEO et JSON-LD.

- **122 briques** : 40 primitives, 52 composites, 19 business, 8 SEO, 3 nav
- **5 layouts** : `BaseLayout`, `ArticleLayout`, `ReviewLayout`, `HubLayout`, `InstitutionnelLayout`
- Stack : Astro 5 · Tailwind 4 (`@tailwindcss/vite`) · TypeScript · Zod

## Installation

`astro-bricks` est une lib (peer-dependency `astro ^5`), pas un site. On l'ajoute à un projet Astro existant.

```jsonc
// package.json
"dependencies": {
  "astro-bricks": "github:ascito/astro-bricks#v0.5.1"
  // ou en local : "astro-bricks": "file:../astro-bricks"
}
```

```bash
npm install
```

### Tailwind : la ligne `@source` obligatoire

Les briques vivent dans `node_modules`. Sans `@source`, Tailwind ne scanne pas leurs classes et les briques s'affichent sans style.

```css
/* global.css */
@import "tailwindcss";
@source "../../node_modules/astro-bricks/src/**/*.{astro,ts}";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --color-brand-600: #4f46e5;   /* échelle 50→900 selon la marque */
}
```

## Usage

### Mode direct (Astro classique)

Helpers et types via le barrel ; composants `.astro` via leur chemin direct.

```astro
---
import BaseLayout from 'astro-bricks/layouts/BaseLayout.astro';
import Faq from 'astro-bricks/bricks/business/Faq.astro';
import { buildAmazonUrl, formatPrice } from 'astro-bricks';
import siteConfig from '../site.config';
import '~/styles/global.css';
---
<BaseLayout siteConfig={siteConfig} title="Accueil" description="…">
  <h1>Bienvenue</h1>
  <Faq title="Questions" items={[{ question: 'Combien ?', answer: '~390 €' }]} />
</BaseLayout>
```

Schémas Zod (ils importent `astro:content`) via le sous-chemin `./schemas` :

```ts
import { produitSchema, faqCollectionSchema } from 'astro-bricks/schemas';
```

### Mode composition JSON (moteur bricks)

Une page = une liste plate de briques ; l'imbrication se fait par références d'id dans `slots`.

```astro
---
import Render from 'astro-bricks/Render.astro';
import composition from '../compositions/ma-page.json';
---
<Render composition={composition} context={mesDonnees} />
```

```json
{
  "id": "ma-page",
  "bricks": [
    { "id": "h",    "brick": "heading", "inputs": { "content": "Bienvenue", "level": 1 } },
    { "id": "form", "brick": "form", "slots": { "children": ["h"] } }
  ]
}
```

- `inputs` : paramètres de la brique (selon son schéma)
- `slots` : noms de slots → ids d'autres briques de la liste (`children, body, header, footer, actions, sidebar, trigger, legal`)
- `context` (optionnel) : données pour résoudre les tokens `{{chemin.valeur}}` dans les `inputs`

## site.config.ts

```ts
import { defineSiteConfig } from 'astro-bricks';

export default defineSiteConfig({
  brand: 'MonSite',
  domain: 'mon-site.fr',
  siteUrl: 'https://mon-site.fr',
  tagline: 'Phrase d’accroche',
  locale: 'fr-FR',
  palette: { primary: 'brand-600', accent: 'brand-800', surface: 'slate-50' },
  fontDisplay: 'Plus Jakarta Sans',
  fontBody: 'Inter',
  nav: { items: [{ label: 'Accueil', href: '/' }] },
});
```

## Théming

1. **`site.config.palette`** (`primary` / `accent` / `surface`) = noms de couleurs Tailwind ; `BaseLayout` en déduit les classes (`bg-brand-600`…). Levier principal.
2. **Variables `--bricks-color-*` / `--bricks-font-*`** dans le `global.css` : surcharge fine du rendu des briques (chaque brique les lit avec un fallback). Optionnel.

Pas de `style=` custom ni de fork de brique côté site (cf. `CLAUDE.md`).

## Structure

```
src/
├── engine/          # Moteur de composition JSON (registry, resolveComposition, tokens)
├── config/          # SiteConfig + defineSiteConfig()
├── content/schemas/ # Schémas Zod (produit, review, marque, faq…)
├── lib/             # format.ts, affiliate.ts, review-decorator.ts
├── bricks/
│   ├── primitives/  # heading, text, button, input, image, icon…
│   ├── composites/  # card, hero, accordion, tabs, modal, pagination…
│   ├── business/    # faq, produit-card, review-verdict, specs-table…
│   ├── seo/         # seo-head + JSON-LD (article, product, breadcrumb…)
│   └── nav/         # header-nav, footer-nav, breadcrumb-nav
├── layouts/         # BaseLayout, ArticleLayout, ReviewLayout, HubLayout, InstitutionnelLayout
├── templates/       # Pages, workflows et fonctions de référence
├── Render.astro     # Point d'entrée du moteur de composition
└── index.ts         # Barrel exports
```

Détail de l'architecture : `docs/ARCHITECTURE.md`.
