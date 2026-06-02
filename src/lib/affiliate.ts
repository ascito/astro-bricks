/**
 * Helpers d'affiliation Amazon — paramétrables par site via SiteConfig.
 *
 * Usage minimal :
 * ```ts
 * import { buildAmazonUrl } from 'astro-bricks';
 * const url = buildAmazonUrl('B07XYZ1234', 'home_card', {
 *   tag: 'saunaguide-21',
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
}

/**
 * Construit une URL Amazon avec les paramètres d'affiliation et le tracking source.
 *
 * @param asin Le code produit Amazon (10 caractères).
 * @param source Identifiant de la source (`'home_card'`, `'comparatif'`, etc.).
 * @param opts Options : tag d'affiliation, marketplace, préfixe ref.
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

  const safeSource = source.toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 32);
  const refPrefix = opts.refPrefix ?? 'src';
  const params = new URLSearchParams({
    tag: opts.tag,
    linkCode: 'ur2',
    language: LANGUAGE_BY_MARKETPLACE[marketplace],
    ref_: `${refPrefix}_${safeSource}`,
  });
  return `${base}?${params.toString()}`;
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
