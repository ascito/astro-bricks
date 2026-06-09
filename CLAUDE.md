# astro-bricks — instructions Claude

> Lecture obligatoire avant toute édition d'une brique, d'un layout, d'un schema ou d'une convention de la lib.

## Principe : source unique de vérité

astro-bricks est une bibliothèque consommée par plusieurs apps Astro. Toute convention visuelle (marges, gaps, typo, palette, sizing, breakpoints) vit dans la lib et s'applique uniformément à tous les consommateurs.

- ✅ Une seule règle, partout
- ✅ Overrides théméables via CSS variables (`--bricks-color-*`, `--bricks-font-*`) que chaque app définit dans son `global.css`
- ✅ Overrides config via `site.config.ts` de l'app
- ❌ Aucune divergence locale silencieuse côté app n'est tolérée

## Anti-patterns interdits

1. Ajouter un wrapper layout custom (`<article style="…gap:3rem…">`) côté app quand une autre app n'en a pas → crée double règle CSS, cumul de marges, dette invisible
2. Patcher une brique pour une seule app (sed local, fork de fichier)
3. Dupliquer la logique d'une brique dans une app au lieu de l'enrichir dans la lib
4. Introduire un nouveau mécanisme CSS/layout (flexbox parent, grid global, sizing system) sans l'appliquer à toutes les apps en même temps

## Réflexe avant tout patch

1. **Le problème vient-il de la lib ou de l'app ?**
   - Si la même page rend correctement dans une autre app consommatrice → c'est l'app courante qui diverge, fix LÀ
   - Si la même page rend mal partout → c'est la lib, fix là-bas (une fois, profite à toutes)
2. **Avant de modifier une brique** : se demander si le changement est désiré pour TOUTES les apps. Si oui, go. Sinon → valider la divergence ou refuser le patch.
3. **Avant d'ajouter du CSS layout sur une page app** : ouvrir la page équivalente d'une autre app. Faire pareil. Si l'autre ne l'a pas et que tu veux l'ajouter → STOP, demander.
4. **Tester sur deux apps après tout changement lib** : si l'une casse, le patch est mauvais.

## Stack

- Astro 5 + Tailwind 4 (mode JIT, classes générées via `@source` dans chaque app)
- Engine : `src/engine/` (registry briques, resolver tokens `{{x.y}}`, Render orchestrant les compositions JSON)
- Briques : `src/bricks/primitives/`, `src/bricks/composites/`, `src/bricks/business/`, `src/bricks/nav/`, `src/bricks/seo/`
- Layouts : `src/layouts/BaseLayout.astro` + variations
- Lib : `src/lib/format.ts`
- Config types : `src/config/types.ts` + `defineSiteConfig.ts`
- Schemas Zod : `src/content/schemas/`

## Conventions typographie

- **H1 + `.font-display`** : serif élégant (chaque app choisit sa police via CSS variable)
- **H2, H3, H4, briques** : sans-serif Inter ExtraBold tracking-tight (`font-sans font-extrabold tracking-tight`)
- **Body** : sans-serif Inter `text-slate-700 leading-relaxed`
- Aucune brique ne doit hardcoder `font-display` — c'est réservé au h1 dans la page.

## Conventions marges

- Chaque brique racine définit sa propre marge basse (`mb-12` par défaut, `mb-8` pour sections compactes, `mb-6` pour éléments inline)
- Les pages app empilent les briques verticalement **sans wrapper flex/grid parent qui imposerait des gaps additionnels**
- Pour ajuster globalement les marges → patch lib (les briques), une fois, pour toutes les apps

## Conventions couleurs

- Palette signature app dans son `global.css` via `@theme { --color-brand-*, --color-accent-*, --color-ink-* }`
- Palette TweakCN OKLCH en complément : `--background, --primary, --secondary, --accent, --muted, --foreground`
- Briques consomment des CSS variables `--bricks-color-*` que chaque app alias dans son `global.css`
- CTA fallback : `var(--bricks-color-accent, #f97316)`
