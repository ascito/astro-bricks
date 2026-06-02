/**
 * Schema MARQUE — convention v3.
 *
 * Schema de base utilisable directement par n'importe quel site Factory.
 * Pour ajouter des champs spécifiques au domaine, utiliser `.extend()` :
 *
 * ```ts
 * import { marqueSchema } from 'astro-bricks';
 * const myMarqueSchema = marqueSchema.extend({
 *   certifications_iso: z.array(z.string()).default([]),
 * });
 * ```
 */
import { z } from 'astro:content';
import { positionnementSchema, savFranceSchema } from './enums';

export const marqueSchema = z.object({
  slug: z.string(),
  name: z.string(),
  pays_origine: z.string(),
  fondee: z.number().nullable().optional(),
  positionnement: positionnementSchema,
  specialites: z.array(z.string()).default([]),
  gamme_prix_eur: z.object({
    min: z.number(),
    max: z.number(),
  }),
  description_courte: z.string().max(180),
  description_longue: z.string(),
  points_forts: z.array(z.string()).default([]),
  points_faibles: z.array(z.string()).default([]),
  garantie_annees: z.number().nullable().optional(),
  sav_france_qualite: savFranceSchema,
  ou_acheter: z.array(z.string()).default([]),
  site_officiel: z.string().url(),
  logo_url_si_disponible: z.string().url().nullable().optional(),
  nb_modeles_principaux: z.number().nullable().optional(),
  modeles_phares: z.array(z.string()).default([]),
  title_seo: z.string().max(70),
  meta_description: z.string().max(160),
});

export type Marque = z.infer<typeof marqueSchema>;
