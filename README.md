# astro-bricks

> Bibliothèque de composants Astro + moteur de composition JSON. Briques réutilisables, design system unifié, configuration centralisée.

## C'est quoi (et le repo voisin)

- **`astro-bricks`** (ce repo) = l'**implémentation** : la lib Astro réelle (briques, moteur de composition, layouts, schémas).
- **`ascito/bricks`** = la **spec** : `catalog.json` (les 93 briques définies) + la doc de composition. Du JSON/Markdown, aucun code. C'est le « cahier des charges » que cette lib implémente.

Tu n'utilises jamais `bricks` directement dans un site : tu installes `astro-bricks`.

---

## Intégration dans un projet Astro (de zéro)

`astro-bricks` n'est **pas** un site ni un thème clé-en-main : c'est une lib que tu branches dans **ton** projet Astro. Voici les 5 étapes pour partir de rien à une page qui s'affiche.

### 1. Un projet Astro 5 + Tailwind 4

```bash
npm create astro@latest mon-site      # choisir "Empty"
cd mon-site
npm install tailwindcss @tailwindcss/vite
```

### 2. Installer astro-bricks

En dépendance locale (recommandé quand la lib est dans le même dossier parent) :

```jsonc
// package.json
"dependencies": {
  "astro-bricks": "file:../astro-bricks"
  // ou, version figée depuis GitHub :
  // "astro-bricks": "github:ascito/astro-bricks#v0.5.1"
}
```

```bash
npm install
```

### 3. astro.config.mjs — brancher le plugin Tailwind

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mon-site.fr',
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] },
  build: { format: 'directory' },
});
```

### 4. global.css — ⚠️ l'étape qu'on oublie toujours

Les briques sont **dans `node_modules`**. Sans la ligne `@source`, Tailwind ne scanne pas leurs classes → **les briques s'affichent sans style**. C'est LA cause n°1 de « ça marche pas ».

```css
@import "tailwindcss";

/* OBLIGATOIRE : fait scanner les classes Tailwind des briques de la lib */
@source "../../node_modules/astro-bricks/src/**/*.{astro,ts}";

/* Le thème du site = échelles de couleurs Tailwind nommées + polices.
   BaseLayout lit site.config (étape 5) et construit des classes type bg-brand-600. */
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;

  --color-brand-600: #4f46e5;   /* accent / CTA */
  --color-brand-800: #3730a3;
  /* … échelle complète 50→900 selon ta marque … */
}
```

Importe ce fichier dans tes pages (ou via le layout) : `import '~/styles/global.css';`

### 5. site.config.ts — l'identité du site

```ts
import { defineSiteConfig } from 'astro-bricks';

export default defineSiteConfig({
  brand: 'MonSite',
  domain: 'mon-site.fr',
  siteUrl: 'https://mon-site.fr',
  tagline: 'Ma phrase d’accroche',
  locale: 'fr-FR',
  // palette = noms de couleurs Tailwind (doivent exister dans @theme / Tailwind) :
  palette: { primary: 'brand-600', accent: 'brand-800', surface: 'slate-50' },
  fontDisplay: 'Plus Jakarta Sans',
  fontBody: 'Inter',
  nav: { items: [{ label: 'Accueil', href: '/' }] },
});
```

### C'est prêt

```bash
npm run dev      # http://localhost:4321
```

---

## Utiliser les briques (2 modes)

### Mode A — direct (Astro classique)

```astro
---
import BaseLayout from 'astro-bricks/layouts/BaseLayout.astro';
import Faq from 'astro-bricks/bricks/business/Faq.astro';
import siteConfig from '../site.config';
import '~/styles/global.css';
---
<BaseLayout siteConfig={siteConfig} title="Accueil" description="…">
  <h1>Bienvenue</h1>
  <Faq title="Questions" items={[{ question: 'Combien ?', answer: '~390 €' }]} />
</BaseLayout>
```

### Mode B — composition JSON (le moteur bricks)

Une page = une **liste plate** de briques ; l'imbrication se fait par **références d'id** dans `slots` (voir `examples/landing-simple/`).

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

- `inputs` = les paramètres de la brique (selon son schéma).
- `slots` = noms de slots → **ids** d'autres briques de la même liste. Les noms de slots valides : `children, body, header, footer, actions, sidebar, trigger, legal`.
- `context` (optionnel) = données pour résoudre les tokens `{{chemin.valeur}}` dans les `inputs`.

---

## Théming

Deux leviers, par ordre d'usage :

1. **`site.config.palette`** (`primary` / `accent` / `surface`) = noms de couleurs Tailwind. `BaseLayout` en déduit les classes (`bg-brand-600`, etc.). C'est le levier principal.
2. **Variables `--bricks-color-*` / `--bricks-font-*`** dans ton `global.css` : surchargent finement le rendu des briques (chaque brique les lit avec un fallback). Optionnel.

Jamais de `style=` custom ni de fork de brique côté site (cf. `CLAUDE.md`).

---

## Structure

```
src/
├── engine/        # Moteur de composition JSON (registry, resolveComposition, BrickNode)
├── config/        # SiteConfig + defineSiteConfig()
├── content/schemas/   # Schémas Zod (produit, review, marque, faq…)
├── lib/           # format.ts, affiliate.ts, review-decorator.ts
├── bricks/
│   ├── primitives/    # heading, text, button, input, image, icon…
│   ├── composites/    # card, hero, accordion, tabs, modal, pagination…
│   ├── business/      # faq, produit-card, review-verdict, specs-table…
│   ├── seo/           # seo-head + JSON-LD (article, product, breadcrumb…)
│   └── nav/           # header-nav, footer-nav, breadcrumb-nav
├── layouts/       # BaseLayout, ArticleLayout, ReviewLayout, HubLayout…
├── Render.astro   # Point d'entrée du moteur de composition
└── index.ts       # Barrel exports
```

Catalogue complet : les 93 briques de la spec + briques business/SEO. Voir `docs/ARCHITECTURE.md`.

## Stack

Astro 5 · Tailwind 4 (`@tailwindcss/vite`) · TypeScript · Zod.
