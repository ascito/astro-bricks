/**
 * Helpers d'affiliation Amazon — paramétrables par site via SiteConfig.
 *
 * Usage minimal :
 * ```ts
 * import { buildAmazonUrl } from 'astro-bricks';
 * const url = buildAmazonUrl('B07XYZ1234', 'home_card', {
 *   tag: 'montag-21',
 *   marketplace: 'fr'
 * });
 * ```
 *
 * Le tag et le marketplace sont passés en options pour ne pas coupler le helper
 * au siteConfig (qui peut ne pas être chargé dans tous les contextes).
 */

import type { AmazonMarketplace } from '../config/types';

const MARKETPLACE_DOMAIN: Record<AmazonMarketplace, string> = {
  fr: 'amazon.fr',
  com: 'amazon.com',
  'co.uk': 'amazon.co.uk',
  de: 'amazon.de',
  it: 'amazon.it',
  es: 'amazon.es',
  ca: 'amazon.ca',
  'co.jp': 'amazon.co.jp',
};

const LANGUAGE_BY_MARKETPLACE: Record<AmazonMarketplace, string> = {
  fr: 'fr_FR',
  com: 'en_US',
  'co.uk': 'en_GB',
  de: 'de_DE',
  it: 'it_IT',
  es: 'es_ES',
  ca: 'en_CA',
  'co.jp': 'ja_JP',
};

export interface BuildAmazonUrlOptions {
  /** Tag d'affiliation. Si absent, retourne l'URL sans paramètres tracking. */
  tag?: string;
  /** Marketplace ciblé. Défaut : `'fr'`. */
  marketplace?: AmazonMarketplace;
  /** Préfixe ref_ pour le tracking source. Ex : `'sg'`, `'sm'`, `'pg'`. */
  refPrefix?: string;
  /**
   * Identifiant Associates Link Builder pour le tracking individuel.
   * Si fourni, le helper produit `?tag=X&linkCode=ll1&linkId=Y&...` (format SiteStripe).
   * Quand absent, fallback au format simple `?tag=X&linkCode=ur2&ref_=...`.
   * Recommandé : passer le slug du produit (`'yamaha-p-225'`) pour identifier chaque lien
   * dans le dashboard Amazon Associates "Link Reports".
   */
  linkId?: string;
}

/** Sanitize un linkId : alphanumérique + tirets, lowercase, max 50 chars. */
function safeLinkId(linkId: string): string {
  return linkId.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50);
}

/**
 * Construit une URL Amazon avec les paramètres d'affiliation et le tracking source.
 *
 * @param asin Le code produit Amazon (10 caractères).
 * @param source Identifiant de la source (`'home_card'`, `'comparatif'`, etc.).
 * @param opts Options : tag d'affiliation, marketplace, préfixe ref, linkId.
 */
export function buildAmazonUrl(
  asin: string,
  source: string = 'site',
  opts: BuildAmazonUrlOptions = {}
): string {
  if (!asin || asin.length !== 10) {
    console.warn(`[astro-bricks/affiliate] ASIN invalide : "${asin}"`);
  }
  const marketplace = opts.marketplace ?? 'fr';
  const domain = MARKETPLACE_DOMAIN[marketplace];
  const base = `https://www.${domain}/dp/${asin}`;

  if (!opts.tag) {
    return base;
  }

  const language = LANGUAGE_BY_MARKETPLACE[marketplace];

  // Si linkId fourni → format Associates Link Builder (tracking individuel)
  if (opts.linkId) {
    const params = new URLSearchParams({
      tag: opts.tag,
      linkCode: 'll1',
      linkId: safeLinkId(opts.linkId),
      language,
      ref_: 'as_li_ss_tl',
    });
    return `${base}?${params.toString()}`;
  }

  // Sinon → format simple avec ref_ source
  const safeSource = source.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 32);
  const refPrefix = opts.refPrefix ?? 'src';
  const params = new URLSearchParams({
    tag: opts.tag,
    linkCode: 'ur2',
    language,
    ref_: `${refPrefix}_${safeSource}`,
  });
  return `${base}?${params.toString()}`;
}

/**
 * Transforme un href Amazon existant pour ajouter/normaliser les paramètres d'affiliation.
 * Utile quand on a déjà un `amazonUrl` figé dans les JSON locaux ou la BDD,
 * et qu'on veut juste y ajouter le linkId au moment du rendu.
 *
 * Comportement :
 *  - Extrait l'ASIN de l'URL (pattern `/dp/ASIN` ou `/gp/product/ASIN`)
 *  - Si ASIN trouvé : régénère l'URL via buildAmazonUrl avec les nouvelles options
 *  - Si ASIN non trouvé : retourne le href original tel quel
 *
 * @param href Le href Amazon existant (peut contenir des params déjà).
 * @param opts Options : tag, marketplace, linkId, etc. comme buildAmazonUrl.
 */
export function decorateAmazonUrl(
  href: string,
  source: string = 'site',
  opts: BuildAmazonUrlOptions = {}
): string {
  if (!href) return href;
  // Extraire l'ASIN : pattern /dp/<10-char> ou /gp/product/<10-char>
  const match = href.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
  if (!match) return href;
  const asin = match[1];
  return buildAmazonUrl(asin, source, opts);
}

/* ─────────────────────────────────────────────────────────────────────
   SCHEMA.ORG — Données marchand standard Amazon
   Utilisées par <JsonLdProduct /> pour returnPolicy + shippingDetails.
   ───────────────────────────────────────────────────────────────────── */

/** Politique de retour standard Amazon France (30 jours, retour gratuit). */
export const AMAZON_FR_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'FR',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 30,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
} as const;

/** Livraison standard Amazon France Prime (gratuite, 1-7j). */
export const AMAZON_FR_SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails',
  shippingRate: {
    '@type': 'MonetaryAmount',
    value: '0',
    currency: 'EUR',
  },
  shippingDestination: {
    '@type': 'DefinedRegion',
    addressCountry: 'FR',
  },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: {
      '@type': 'QuantitativeValue',
      minValue: 0,
      maxValue: 1,
      unitCode: 'DAY',
    },
    transitTime: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: 7,
      unitCode: 'DAY',
    },
  },
} as const;
