/**
 * Helpers de formatage — prix, dates, notes, slugs.
 *
 * Tous les helpers sont pure functions et locale-aware (fr-FR par défaut).
 */

/**
 * Formate un prix en euros avec un tilde indiquant le caractère indicatif.
 *
 *   formatPriceIndicatif(1299) → "~1 299 €"
 *   formatPriceIndicatif(390)  → "~390 €"
 *   formatPriceIndicatif(39.9, { decimals: 2 }) → "~39,90 €"
 */
export function formatPriceIndicatif(
  priceEur: number | string | null | undefined,
  opts: { decimals?: number; currency?: string; locale?: string; prefix?: string } = {}
): string {
  if (priceEur === null || priceEur === undefined || priceEur === '') return '—';
  const num = typeof priceEur === 'string' ? parseFloat(priceEur) : priceEur;
  if (!Number.isFinite(num)) return '—';

  const {
    decimals = 0,
    currency = 'EUR',
    locale = 'fr-FR',
    prefix = '~',
  } = opts;

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${prefix}${formatter.format(num)}`;
}

/**
 * Formate un prix simple (sans tilde, sans préfixe).
 *
 *   formatPrice(1299) → "1 299 €"
 */
export function formatPrice(
  priceEur: number | string | null | undefined,
  opts: { decimals?: number; currency?: string; locale?: string } = {}
): string {
  return formatPriceIndicatif(priceEur, { ...opts, prefix: '' });
}

/**
 * Label de date de constat des prix : "constaté en juin 2026".
 *
 *   priceConstatLabel() → "juin 2026"
 */
export function priceConstatLabel(date: Date = new Date(), locale: string = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Formate une note sur 5 étoiles.
 *
 *   formatRating(4.5) → "4,5 / 5"
 *   formatRating(4.5, { withCount: 1234 }) → "4,5 / 5 (1 234 avis)"
 */
export function formatRating(
  rating: number | string | null | undefined,
  opts: { withCount?: number; locale?: string; max?: number } = {}
): string {
  if (rating === null || rating === undefined) return '—';
  const num = typeof rating === 'string' ? parseFloat(rating) : rating;
  if (!Number.isFinite(num)) return '—';

  const { withCount, locale = 'fr-FR', max = 5 } = opts;
  const formatted = num.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  let result = `${formatted} / ${max}`;
  if (withCount !== undefined && withCount > 0) {
    const countFormatted = withCount.toLocaleString(locale);
    result += ` (${countFormatted} avis)`;
  }
  return result;
}

/**
 * Transforme une chaîne en slug URL-safe.
 *
 *   slugify("Bresser ClearView 7-en-1") → "bresser-clearview-7-en-1"
 *   slugify("Café noir / Décaféiné") → "cafe-noir-decafeine"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // diacritiques
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/**
 * Tronque un texte à N caractères en coupant au mot le plus proche.
 *
 *   truncate("Lorem ipsum dolor sit amet", 15) → "Lorem ipsum…"
 */
export function truncate(text: string, maxLen: number, ellipsis: string = '…'): string {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > 0) return cut.slice(0, lastSpace) + ellipsis;
  return cut + ellipsis;
}

/**
 * Calcule un temps de lecture estimé en minutes.
 *
 *   readingTime("blah blah ... 1500 mots ...") → 8 (minutes, 200 mots/min)
 */
export function readingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Formate une date en français long.
 *
 *   formatDate(new Date('2026-06-02')) → "2 juin 2026"
 */
export function formatDate(date: Date | string, locale: string = 'fr-FR'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/**
 * Date ISO YYYY-MM-DD pour `priceValidUntil` (1 an dans le futur par défaut).
 */
export function priceValidUntil(monthsAhead: number = 12): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsAhead);
  return d.toISOString().slice(0, 10);
}
