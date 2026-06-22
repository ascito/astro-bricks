/**
 * Type SiteConfig — configuration unique d'un site consommateur consommant astro-bricks.
 *
 * Chaque site contient un seul fichier `site.config.ts` à la racine :
 *
 * ```ts
 * import { defineSiteConfig } from 'astro-bricks';
 *
 * export default defineSiteConfig({
 *   brand: 'Saunaguide',
 *   domain: 'mon-site.fr',
 *   amazonTag: 'montag-21',
 *   ...
 * });
 * ```
 */

/** Palette Tailwind du site — tokens utilisés par les composants du kit. */
export interface SitePalette {
  /** Couleur principale (CTA, accent fort). Token Tailwind. Ex : `'amber-800'`, `'teal-700'`. */
  primary: string;
  /** Couleur secondaire (textes accent, sous-titres). Ex : `'stone-800'`. */
  accent: string;
  /** Couleur de surface (fonds cards, sections). Ex : `'stone-50'`, `'slate-50'`. */
  surface: string;
}

/** Élément du menu de navigation. */
export interface NavItem {
  label: string;
  href: string;
  /** Sous-items optionnels pour les dropdowns. */
  children?: NavItem[];
}

/** Configuration de navigation. */
export interface NavConfig {
  items: NavItem[];
  /** Si true, affiche un dropdown listant les marques dynamiquement. */
  showBrandsDropdown?: boolean;
}

/** Identité juridique d'un hébergeur. */
export interface HostingEntry {
  name: string;
  address: string;
  /** `web` (par défaut), `mail`, `dns`, `cdn`. Permet de mentionner OVH pour le mail et Cloudflare pour le web. */
  role?: 'web' | 'mail' | 'dns' | 'cdn';
  /** URL du site officiel (pour mentions légales). */
  url?: string;
  /** Tel ou ID légal si requis (SIRET, RCS, etc.). */
  legalId?: string;
}

/** Bloc juridique / mentions légales / RGPD. */
export interface LegalConfig {
  /** Nom de l'éditeur (personne physique ou morale). */
  publisherName: string;
  /** Email de contact officiel (pour mentions RGPD). */
  publisherEmail: string;
  /** Adresse postale optionnelle (si auto-entrepreneur, peut être omise). */
  publisherAddress?: string;
  /** SIRET ou numéro RCS si l'éditeur est une société. */
  publisherSiret?: string;
  /** Directeur de la publication (par défaut = publisherName). */
  publicationDirector?: string;
  /** Liste des hébergeurs (Cloudflare, OVH, etc.) avec leur rôle. */
  hosting: HostingEntry[];
  /** Sous-traitants RGPD listés dans la politique de confidentialité. */
  rgpdSubprocessors: string[];
}

/** Réseaux sociaux du site (utilisés dans le footer, JSON-LD Organization, partage). */
export interface SocialLinks {
  mastodon?: string;
  twitter?: string;
  bluesky?: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
}

/** Override de composants par chemin local. Rare. */
export interface ComponentOverrides {
  /** Ex : `{ Header: '~/components/CustomHeader.astro' }` */
  [componentName: string]: string;
}

/** Lien d'une colonne du footer. */
export interface FooterLink {
  label: string;
  href: string;
}

/** Colonne configurable du footer. */
export interface FooterColumn {
  /** Titre de la colonne (h3 en small caps). Ex : `'Catalogue'`, `'Le site'`, `'Légal'`. */
  title: string;
  /** Liens de la colonne. */
  links: FooterLink[];
}

/** Configuration du footer. */
export interface FooterConfig {
  /**
   * Colonnes 2, 3, 4 du footer (col 1 = marque + tagline auto).
   * Si absent, le footer utilise les slots ou les defaults d'astro-bricks.
   * Max 3 colonnes.
   */
  columns?: FooterColumn[];
}

/** Marketplace Amazon (FR par défaut). */
export type AmazonMarketplace = 'fr' | 'com' | 'co.uk' | 'de' | 'it' | 'es' | 'ca' | 'co.jp';

/**
 * Configuration complète d'un site consommateur.
 */
export interface SiteConfig {
  // ─── Identité ───
  /** Nom de marque (affiché partout). Ex : `'Saunaguide'`. */
  brand: string;
  /** Domaine sans protocole. Ex : `'mon-site.fr'`. */
  domain: string;
  /** URL canonique avec protocole. Ex : `'https://mon-site.fr'`. */
  siteUrl: string;
  /** Tagline / description courte (utilisée en meta description par défaut, JSON-LD WebSite). */
  tagline: string;
  /** Langue principale du site (BCP-47). Défaut : `'fr-FR'`. */
  locale?: string;

  // ─── Affiliation Amazon ───
  /** Tag d'affiliation Amazon Associates. Ex : `'montag-21'`. */
  amazonTag: string;
  /** Marketplace ciblé. Défaut : `'fr'`. */
  marketplace?: AmazonMarketplace;

  // ─── Contact ───
  /** Email de contact public (mailto, RGPD). */
  contactEmail: string;
  /** Path n8n du webhook contact form. Ex : `'contact-sauna'` → `/webhook/contact-sauna`. */
  contactWebhookPath: string;

  // ─── Palette & typographie ───
  /** Palette Tailwind utilisée par les composants du kit. */
  palette: SitePalette;
  /** Police pour les titres (display). Ex : `'Playfair Display'`, `'Plus Jakarta Sans'`. */
  fontDisplay?: string;
  /** Police pour le corps. Défaut : `'Inter'`. */
  fontBody?: string;

  // ─── Navigation ───
  nav: NavConfig;

  // ─── Mentions légales ───
  legal: LegalConfig;

  // ─── Réseaux sociaux (optionnel) ───
  social?: SocialLinks;

  // ─── Override de composants (rare) ───
  overrides?: ComponentOverrides;

  // ─── Footer ───
  /** Année de création (affichée dans le copyright). Défaut : année courante. */
  foundingYear?: number;
  /** Configuration du footer (colonnes personnalisées). Optionnel. */
  footer?: FooterConfig;
}

/**
 * SiteConfig "résolu" — toutes les valeurs optionnelles ont leurs défauts appliqués.
 * Type utilisé en interne par le kit.
 */
export interface ResolvedSiteConfig extends Required<Omit<SiteConfig, 'social' | 'overrides' | 'fontDisplay' | 'foundingYear' | 'footer' | 'publisherAddress'>> {
  social: SocialLinks;
  overrides: ComponentOverrides;
  fontDisplay: string;
  foundingYear: number;
  footer: FooterConfig;
}
