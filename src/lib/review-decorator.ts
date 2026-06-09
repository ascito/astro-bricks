/**
 * review-decorator — Décoration des URLs Amazon dans un objet review.
 *
 * Mute en place (au build) toutes les URLs Amazon trouvées dans une review JSON
 * pour ajouter le format Associates Link Builder (linkCode=ll1 + linkId=<slug>),
 * qui permet le tracking individuel par produit dans le dashboard Amazon Associates.
 *
 * Sources couvertes :
 *  1. `review.product.amazonUrl` (utilisé par review-cta-banner + review-disclosure)
 *  2. `review.verdict.cta.href` (utilisé par review-verdict / verdict-aside)
 *  3. Liens HTML inline dans les strings (specs, transparency, audience, comparatifs,
 *     verdictFinal, sections, faq) — pattern `href="https://www.amazon.fr/dp/ASIN..."`
 *
 * Pas d'effet de bord global : la mutation est locale à chaque build de page
 * (chaque appel à getStaticPaths recharge un nouveau module JSON).
 *
 * Décorateur de review partageable entre apps consommatrices
 * de la lib.
 */
import { decorateAmazonUrl } from './affiliate';
import type { AmazonMarketplace } from './affiliate';

export interface DecorateReviewOptions {
  /** Tag d'affiliation Amazon (ex: `'montag-21'`, `'montag-21'`). */
  tag: string;
  /** Marketplace ciblé. Défaut `'fr'`. */
  marketplace?: AmazonMarketplace;
}

// Regex pour les URLs Amazon dans du HTML inline (capture l'URL après href=")
const AMAZON_HREF_PATTERN = /(href=")(https?:\/\/(?:www\.)?amazon\.[a-z.]+\/(?:dp|gp\/product)\/[A-Z0-9]{10}[^"]*)/gi;

/**
 * Walker récursif : décore toutes les chaînes contenant des href Amazon.
 */
function walkAndDecorate<T>(value: T, source: string, linkOpts: { tag: string; marketplace?: AmazonMarketplace; linkId: string }): T {
  if (typeof value === 'string') {
    if (!value.includes('amazon.')) return value;
    return value.replace(AMAZON_HREF_PATTERN, (_m, prefix, url) => {
      return prefix + decorateAmazonUrl(url, source, linkOpts);
    }) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => walkAndDecorate(v, source, linkOpts)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as object)) {
      out[k] = walkAndDecorate((value as Record<string, unknown>)[k], source, linkOpts);
    }
    return out as unknown as T;
  }
  return value;
}

/**
 * Décore en place toutes les URLs Amazon d'un objet review.
 * Le `linkId` Amazon Associates = `review.slug` (un slug = un produit = un linkId).
 *
 * @param review Objet review JSON (mutation en place + retour de l'objet pour chaining).
 * @param opts  Options : tag d'affiliation, marketplace.
 */
export function decorateReviewAmazonLinks<T extends { slug?: string; product?: { amazonUrl?: string }; verdict?: { cta?: { href?: string } } }>(
  review: T,
  opts: DecorateReviewOptions,
): T {
  if (!review || !review.slug) return review;

  const linkOpts = {
    tag: opts.tag,
    marketplace: opts.marketplace ?? 'fr',
    linkId: review.slug,
  };

  // 1. product.amazonUrl (CTA banner + disclosure)
  if (review.product?.amazonUrl) {
    review.product.amazonUrl = decorateAmazonUrl(review.product.amazonUrl, 'review', linkOpts);
  }

  // 2. verdict.cta.href (CTA principal en haut de page)
  if (review.verdict?.cta?.href) {
    review.verdict.cta.href = decorateAmazonUrl(review.verdict.cta.href, 'review_verdict_cta', linkOpts);
  }

  // 3. HTML inline dans les sections riches : on parcourt les groupes connus
  const HTML_GROUPS: Array<keyof T> = [
    'specs',
    'transparency',
    'audience',
    'sections',
    'comparatifs',
    'verdictFinal',
    'faq',
  ] as Array<keyof T>;

  for (const key of HTML_GROUPS) {
    if (review[key]) {
      (review as Record<string, unknown>)[key as string] = walkAndDecorate(
        review[key],
        'review_inline',
        linkOpts,
      );
    }
  }

  return review;
}
