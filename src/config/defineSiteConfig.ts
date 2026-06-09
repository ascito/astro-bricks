/**
 * Helper typé pour créer le `site.config.ts` d'un site Factory.
 *
 * Apporte :
 *  - Autocomplétion TypeScript dans l'IDE
 *  - Application automatique des valeurs par défaut
 *  - Validation runtime légère (champs obligatoires non vides)
 *
 * Usage :
 * ```ts
 * import { defineSiteConfig } from 'astro-bricks';
 *
 * export default defineSiteConfig({
 *   brand: 'Saunaguide',
 *   domain: 'mon-site.fr',
 *   siteUrl: 'https://mon-site.fr',
 *   tagline: 'Tests, comparatifs et guides d\'achat saunas.',
 *   amazonTag: 'montag-21',
 *   contactEmail: 'contact@mon-site.fr',
 *   contactWebhookPath: 'contact-sauna',
 *   palette: { primary: 'amber-800', accent: 'stone-800', surface: 'stone-50' },
 *   nav: { items: [
 *     { label: 'Marques', href: '/marques' },
 *     { label: 'Avis produits', href: '/avis' },
 *     { label: 'Guides', href: '/guides' },
 *   ]},
 *   legal: {
 *     publisherName: 'PF — Saunaguide',
 *     publisherEmail: 'contact@mon-site.fr',
 *     hosting: [
 *       { name: 'Cloudflare Pages', address: '101 Townsend St, San Francisco', role: 'web' },
 *       { name: 'OVH SAS', address: '2 rue Kellermann, Roubaix', role: 'mail' },
 *     ],
 *     rgpdSubprocessors: ['Cloudflare Inc.', 'OVH SAS', 'Telegram FZ-LLC'],
 *   },
 * });
 * ```
 */

import type { SiteConfig, ResolvedSiteConfig } from './types';

/** Champs obligatoires non vides — vérifiés au runtime. */
const REQUIRED_FIELDS = [
  'brand',
  'domain',
  'siteUrl',
  'tagline',
  'amazonTag',
  'contactEmail',
  'contactWebhookPath',
] as const;

/**
 * Valide et résout un SiteConfig (applique les défauts).
 *
 * Lance une erreur explicite si un champ obligatoire est absent ou vide.
 */
export function defineSiteConfig(config: SiteConfig): ResolvedSiteConfig {
  // Validation des champs obligatoires
  for (const field of REQUIRED_FIELDS) {
    const value = config[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new Error(
        `[astro-bricks] site.config.ts : le champ "${field}" est obligatoire et ne peut pas être vide.`
      );
    }
  }

  // Validation siteUrl
  if (!config.siteUrl.startsWith('https://') && !config.siteUrl.startsWith('http://')) {
    throw new Error(
      `[astro-bricks] site.config.ts : siteUrl doit commencer par https:// (reçu: "${config.siteUrl}")`
    );
  }

  // Validation amazonTag (format ascii alphanum + tiret, finit par -XX)
  if (!/^[a-z0-9-]+-[0-9]{2}$/i.test(config.amazonTag)) {
    throw new Error(
      `[astro-bricks] site.config.ts : amazonTag doit suivre le format "marque-XX" (ex: montag-21). Reçu: "${config.amazonTag}"`
    );
  }

  // Validation nav.items
  if (!config.nav?.items || config.nav.items.length === 0) {
    throw new Error(
      `[astro-bricks] site.config.ts : nav.items doit contenir au moins un élément.`
    );
  }

  // Validation legal
  if (!config.legal?.publisherName || !config.legal?.publisherEmail) {
    throw new Error(
      `[astro-bricks] site.config.ts : legal.publisherName et legal.publisherEmail sont obligatoires (conformité LCEN).`
    );
  }
  if (!config.legal?.hosting || config.legal.hosting.length === 0) {
    throw new Error(
      `[astro-bricks] site.config.ts : legal.hosting doit lister au moins un hébergeur (conformité LCEN article 6-II).`
    );
  }

  // Application des défauts
  const resolved: ResolvedSiteConfig = {
    ...config,
    locale: config.locale ?? 'fr-FR',
    marketplace: config.marketplace ?? 'fr',
    fontDisplay: config.fontDisplay ?? 'Plus Jakarta Sans',
    fontBody: config.fontBody ?? 'Inter',
    social: config.social ?? {},
    overrides: config.overrides ?? {},
    foundingYear: config.foundingYear ?? new Date().getFullYear(),
    nav: {
      items: config.nav.items,
      showBrandsDropdown: config.nav.showBrandsDropdown ?? false,
    },
    footer: config.footer ?? {},
  };

  return resolved;
}
