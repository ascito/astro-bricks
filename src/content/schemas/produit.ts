/**
 * Schema PRODUIT — convention v3.
 *
 * Le champ `type_produit` est laissé en `string()` au niveau du kit : chaque site
 * le restreint à son propre enum (`saunaTypes`, `weatherStationTypes`, etc.) via
 * `.extend()` :
 *
 * ```ts
 * import { produitSchema } from 'astro-bricks';
 * const saunaTypes = ['cabine_infrarouge', 'sauna_vapeur', ...] as const;
 * const mySchema = produitSchema.extend({
 *   type_produit: z.enum(saunaTypes),
 * });
 * ```
 *
 * Le champ `specs` est ouvert (`z.record()`) — chaque site définit ses propres
 * specs techniques.
 */
import { z } from 'astro:content';
import { positionnementSchema, savFranceSchema } from './enums';

export const produitSchema = z.object({
  slug: z.string(),
  brand_slug: z.string().nullable().optional(),
  title: z.string(),

  /** Type de produit. Chaque site override avec son propre enum via .extend(). */
  type_produit: z.string(),

  // ─── Amazon ───
  asin: z.string().length(10).nullable().optional(),
  url_amazon: z.string().url().nullable().optional(),
  image_main: z.string().url().nullable().optional(),

  // ─── Prix & notation ───
  price_eur: z.number().nullable().optional(),
  note_amazon: z.number().min(0).max(5).nullable().optional(),
  nb_avis_amazon: z.number().nonnegative().nullable().optional(),

  // ─── Capacité / positionnement ───
  places: z.number().nullable().optional(),
  positionnement: positionnementSchema.nullable().optional(),
  sav_france_qualite: savFranceSchema.nullable().optional(),

  /** Specs techniques — schema ouvert par site (override via .extend()). */
  specs: z.record(z.unknown()).optional(),

  // ─── Verdict éditorial ───
  /** Verdict éditorial sur 10 (ex. 8.5/10). */
  verdict_note: z.number().min(0).max(10).nullable().optional(),
  verdict_summary: z.string().optional(),
  profil_ideal: z.string().optional(),
  a_eviter_si: z.string().optional(),

  points_forts: z.array(z.string()).default([]),
  points_faibles: z.array(z.string()).default([]),

  alternatives_meme_marque: z.array(z.string()).default([]),
  alternatives_concurrents: z.array(z.string()).default([]),

  // ─── SEO ───
  title_seo: z.string().max(70).optional(),
  meta_description: z.string().max(180).optional(),

  /** Marquage YMYL (santé, finance, sécurité) pour mention prudence éditoriale. */
  ymyl_sensible: z.boolean().default(false),
});

export type Produit = z.infer<typeof produitSchema>;
