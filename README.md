# astro-bricks

> Bibliothèque de composants Astro + moteur de composition JSON pour le réseau **Factory** (sites affiliés Amazon, design system unifié, briques business).

[![Repo](https://img.shields.io/badge/repo-ascito%2Fastro--bricks-blue)](https://github.com/ascito/astro-bricks)

## Deux modes d'usage

### Mode direct (Astro classique) — pour les sites du réseau Factory

```astro
---
import BackToTop  from 'astro-bricks/bricks/business/BackToTop.astro';
import Faq        from 'astro-bricks/bricks/business/Faq.astro';
import Disclosure from 'astro-bricks/bricks/business/Disclosure.astro';
import { buildAmazonUrl, formatPriceIndicatif } from 'astro-bricks';

const items = [{ question: 'Combien ça coûte ?', answer: '~390 €' }];
---
<Disclosure variant="full" />
<Faq items={items} title="Questions courantes" />
<BackToTop class="bg-amber-700 hover:bg-amber-900 text-white" />
```

### Mode composition JSON (engine bricks) — pour landings dynamiques

```ts
import { Render } from 'astro-bricks/Render.astro';
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

Repo public sur GitHub, consommable directement par npm :

```bash
# Dans un site Factory
npm install github:ascito/astro-bricks#v0.2.0
```

Ou pour le développement local cross-repo :

```bash
cd astro-bricks
npm link

cd ../mon-site-factory
npm link astro-bricks
```

## Structure

```
src/
├── engine/                 # Moteur de composition JSON
│   ├── types.ts
│   ├── resolveComposition.ts
│   └── registry.ts
├── config/                 # SiteConfig + helper defineSiteConfig()
│   ├── types.ts
│   └── defineSiteConfig.ts
├── content/
│   └── schemas/            # Schemas Zod v3 (produit, marque, guide, faq, …)
├── lib/
│   ├── affiliate.ts        # buildAmazonUrl + AMAZON_FR_RETURN_POLICY + SHIPPING
│   └── format.ts           # formatPrice, formatRating, slugify, readingTime, …
├── bricks/
│   ├── primitives/         # 10 briques (Button, Heading, Image, Stack, …)
│   ├── composites/         # Briques composées (Card, Hero, Accordion, ShareButtons, Separator, SectionHeader)
│   ├── business/           # Briques business (BackToTop, Disclosure, Faq, ProduitCard, AffiliateLink…)
│   ├── seo/                # Composants SEO (JsonLdProduct, JsonLdArticle, JsonLdBrand, …)
│   └── nav/                # Header, Footer, Breadcrumb
├── layouts/                # BaseLayout, ArticleLayout, ReviewLayout, InstitutionnelLayout
├── templates/              # Pages instit Markdown, Pages Function contact, workflow n8n
├── Render.astro            # Point d'entrée du moteur de composition
├── BrickNode.astro         # Récursion engine
└── index.ts                # Barrel exports
```

## Configuration d'un site Factory

Chaque site contient un seul fichier `site.config.ts` :

```ts
import { defineSiteConfig } from 'astro-bricks';

export default defineSiteConfig({
  brand: 'Saunaguide',
  domain: 'saunaguide.fr',
  siteUrl: 'https://saunaguide.fr',
  tagline: 'Tests, comparatifs et guides d\'achat saunas.',
  amazonTag: 'saunaguide-21',
  contactEmail: 'contact@saunaguide.fr',
  contactWebhookPath: 'contact-sauna',
  palette: { primary: 'amber-800', accent: 'stone-800', surface: 'stone-50' },
  nav: { items: [
    { label: 'Marques', href: '/marques' },
    { label: 'Avis produits', href: '/avis' },
    { label: 'Guides', href: '/guides' },
  ]},
  legal: {
    publisherName: 'PF — Saunaguide',
    publisherEmail: 'contact@saunaguide.fr',
    hosting: [
      { name: 'Cloudflare Pages', address: '101 Townsend St, San Francisco', role: 'web' },
      { name: 'OVH SAS', address: '2 rue Kellermann, Roubaix', role: 'mail' },
    ],
    rgpdSubprocessors: ['Cloudflare Inc.', 'OVH SAS', 'Telegram FZ-LLC'],
  },
});
```

## État (Vague 1 — 2 juin 2026)

| Catégorie         | Briques implémentées                                                         |
| ----------------- | ----------------------------------------------------------------------------- |
| **Primitives**    | Heading, Text, Button, Container, Stack, Image, Link, Badge, Divider, Spacer  |
| **Composites**    | Card, Hero, Accordion, Alert, Breadcrumb, ShareButtons, Separator, SectionHeader |
| **Business**      | BackToTop, Disclosure, Faq                                                    |
| **SEO**           | _(à venir V2 : JsonLdProduct, JsonLdArticle, JsonLdBrand, JsonLdFaq, …)_      |
| **Nav**           | _(à venir V2 : Header, Footer, Breadcrumb business)_                           |
| **Layouts**       | _(à venir V2)_                                                                |

## Roadmap

- **V1** ✓ Briques stables (BackToTop, Disclosure, Faq, Separator, SectionHeader) + lib + config + schemas Zod
- **V2** Layouts (Base, Article, Review, Institutionnel) + composants SEO + nav business + templates pages instit + Pages Function contact + workflow n8n
- **V3** Migration des 3 sites + bootstrap pianoguide.fr
- **V4+** Compléter le catalogue (comparison-table, pricing-table, feature-grid, stats-row, testimonials-row, toc, related-articles, pull-quote, aside-note, article-header)
- **V5** Brique `ai-generate` (intelligence) + validation runtime via ajv + tests vitest
