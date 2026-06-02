/**
 * astro-bricks — Exports publics.
 *
 * Deux modes d'usage :
 *
 * **Mode direct (Astro classique) :**
 * ```ts
 * import { BackToTop, Faq, Disclosure, buildAmazonUrl } from 'astro-bricks';
 * import type { SiteConfig } from 'astro-bricks';
 * import { produitSchema, faqCollectionSchema } from 'astro-bricks/schemas';
 * ```
 *
 * **Mode composition JSON (engine bricks) :**
 * ```ts
 * import { Render } from 'astro-bricks';
 * import composition from './page.json';
 * ```
 * (Render.astro est exposé directement via `astro-bricks/Render.astro`.)
 */

// ─────────────────────────────────────────────────────────────────────
// Engine (composition JSON — usage avancé)
// ─────────────────────────────────────────────────────────────────────
export { resolveComposition, CompositionError } from './engine/resolveComposition';
export { BRICK_REGISTRY } from './engine/registry';
export type {
  Composition,
  BrickInstance,
  ResolvedComposition,
  ResolvedBrick,
  BrickCategory,
  BrickDefinition,
  Catalog,
} from './engine/types';

// ─────────────────────────────────────────────────────────────────────
// Configuration site
// ─────────────────────────────────────────────────────────────────────
export { defineSiteConfig } from './config/defineSiteConfig';
export type {
  SiteConfig,
  ResolvedSiteConfig,
  SitePalette,
  NavConfig,
  NavItem,
  LegalConfig,
  HostingEntry,
  SocialLinks,
  ComponentOverrides,
  AmazonMarketplace,
} from './config/types';

// ─────────────────────────────────────────────────────────────────────
// Lib (helpers utilitaires)
// ─────────────────────────────────────────────────────────────────────
export {
  buildAmazonUrl,
  AMAZON_FR_RETURN_POLICY,
  AMAZON_FR_SHIPPING_DETAILS,
} from './lib/affiliate';
export type { BuildAmazonUrlOptions } from './lib/affiliate';

export {
  formatPrice,
  formatPriceIndicatif,
  priceConstatLabel,
  formatRating,
  slugify,
  truncate,
  readingTime,
  formatDate,
  priceValidUntil,
} from './lib/format';

// ─────────────────────────────────────────────────────────────────────
// Note sur les composants .astro
// ─────────────────────────────────────────────────────────────────────
// Astro impose que les composants .astro soient importés via leur chemin direct :
//
//   import BackToTop from 'astro-bricks/bricks/business/BackToTop.astro';
//   import Faq       from 'astro-bricks/bricks/business/Faq.astro';
//   import Accordion from 'astro-bricks/bricks/composites/Accordion.astro';
//
// Le champ `exports` de package.json expose `./bricks/*` pour rendre ces chemins valides.
//
// Pour les schemas Zod (qui importent 'astro:content'), même chose :
//
//   import { produitSchema } from 'astro-bricks/schemas';
//
// (cf le sous-chemin `./schemas` dans package.json exports)
