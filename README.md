# astro-bricks

> Bibliothèque de composants Astro + moteur de composition JSON. Briques réutilisables, design system unifié, configuration centralisée.

## Deux modes d'usage

### Mode direct (Astro classique)

```astro
---
import Heading    from 'astro-bricks/bricks/primitives/Heading.astro';
import Faq        from 'astro-bricks/bricks/business/Faq.astro';
import BackToTop  from 'astro-bricks/bricks/business/BackToTop.astro';

const items = [{ question: 'Combien ça coûte ?', answer: '~390 €' }];
---
<Heading level={1} content="Bienvenue" />
<Faq items={items} title="Questions courantes" />
<BackToTop />
```

### Mode composition JSON (engine bricks)

```ts
import Render from 'astro-bricks/Render.astro';
import composition from './ma-page.json';
```

```json
{
  "id": "ma-page",
  "bricks": [
    { "id": "h", "brick": "heading", "inputs": { "content": "Bienvenue", "level": 1 } },
    { "id": "p", "brick": "text", "inputs": { "content": "Lorem ipsum…" } }
  ]
}
```

## Installation

Lien local pour le développement cross-repo :

```bash
cd astro-bricks
npm link

cd ../mon-app
npm link astro-bricks
```

Ou en dépendance file dans `package.json` :

```json
"dependencies": {
  "astro-bricks": "file:../astro-bricks"
}
```

## Structure

```
src/
├── engine/                 # Moteur de composition JSON
│   ├── types.ts
│   ├── resolveComposition.ts
│   └── registry.ts
├── config/                 # SiteConfig + helper defineSiteConfig()
├── content/
│   └── schemas/            # Schemas Zod
├── lib/                    # format.ts (formatPrice, formatRating, slugify…)
├── bricks/
│   ├── primitives/         # Heading, Text, Button, Container, Stack, Image, Link, Badge, Divider, Spacer
│   ├── composites/         # Card, Hero, Accordion, Alert, Breadcrumb, ShareButtons, Separator, SectionHeader
│   ├── business/           # Briques de page de contenu (Faq, ProsConsGrid, SpecsTable, ArticleHeader…)
│   ├── seo/                # SeoHead + composants JSON-LD
│   └── nav/                # Header, Footer, Breadcrumb
├── layouts/                # BaseLayout, ArticleLayout, …
├── Render.astro            # Point d'entrée du moteur de composition
├── BrickNode.astro         # Récursion engine
└── index.ts                # Barrel exports
```

## Configuration

```ts
import { defineSiteConfig } from 'astro-bricks';

export default defineSiteConfig({
  brand: 'MonSite',
  siteUrl: 'https://mon-site.example',
  palette: { primary: 'amber-800', accent: 'stone-800', surface: 'stone-50' },
  nav: { items: [
    { label: 'Accueil', href: '/' },
  ]},
});
```

## Stack

Astro 5, Tailwind 4, TypeScript, Zod (schemas).
