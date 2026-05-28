# astro-bricks

> Implémentation Astro de la spec [ascito/bricks](https://github.com/ascito/bricks).
> Compose des pages Astro à partir de compositions JSON.

## Principe

Tu écris une composition JSON conforme à la spec Bricks :

```json
{
  "id": "ma-page",
  "name": "Ma Page",
  "bricks": [
    { "id": "h", "brick": "heading", "inputs": { "content": "Bienvenue", "level": 1 } },
    { "id": "p", "brick": "text", "inputs": { "content": "Lorem ipsum…" } }
  ]
}
```

Tu rends cette composition dans une page Astro :

```astro
---
import { Render } from 'astro-bricks';
import composition from './ma-page.json';
---

<Render composition={composition} />
```

L'engine résout les références/slots, valide les inputs contre les schemas du catalog,
et rend chaque brique avec son composant `.astro` correspondant.

## Statut

🚧 **Work in progress** — repo squelette posé le 28 mai 2026.

| Catégorie | Implémentées | Total catalog |
|---|---|---|
| Primitives | 10 / 41 | — |
| Composites | 5 / 16 | — |
| Intelligence | 0 / 1 | — |

Voir `docs/REVUE-CATALOG.md` pour mes notes critiques sur la spec actuelle.

## Architecture

```
astro-bricks/
├── src/
│   ├── engine/
│   │   ├── types.ts                # Types TS (Composition, Brick, Schema)
│   │   ├── resolveComposition.ts   # Résout les refs en arbre
│   │   └── validateInputs.ts       # Valide via JSON Schema
│   ├── bricks/
│   │   ├── primitives/             # button, heading, text, image, etc.
│   │   └── composites/             # card, hero, accordion, etc.
│   ├── catalog.json                # Copié depuis ascito/bricks
│   ├── Render.astro                # Composant principal
│   └── index.ts                    # Exports publics
├── examples/
│   └── landing-simple/             # Exemple fonctionnel
└── docs/
    ├── ARCHITECTURE.md
    └── REVUE-CATALOG.md
```

## Installation (à venir)

```bash
npm install astro-bricks
```

## Roadmap

- [x] Engine de résolution composition → arbre
- [x] 10 primitives essentielles (heading, text, button, container, stack, image, link, badge, divider, spacer)
- [x] 5 composites essentiels (card, hero, accordion, alert, breadcrumb)
- [x] Exemple landing fonctionnel
- [ ] 20 briques restantes prioritaires sites affiliés (comparison-table, rating, article, author-card, seo, …)
- [ ] Brique `ai-generate` (intelligence)
- [ ] Validation runtime via ajv
- [ ] Tests unitaires (vitest)
- [ ] Publication NPM
