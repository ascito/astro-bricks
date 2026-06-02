/**
 * Schemas GUIDE — brief éditorial + collection Astro pour les fichiers Markdown.
 */
import { z } from 'astro:content';
import { intentionFunnelSchema } from './enums';

/**
 * GuideBrief — schema pour briefs éditoriaux (fichier JSON avec le plan).
 * Pas une Content Collection : juste un schema de validation des données.
 */
export const guideBriefSchema = z.object({
  slug: z.string(),
  title_seo: z.string().max(70),
  meta_description: z.string().max(160),
  h1: z.string(),
  mots_cles: z.array(z.string()).default([]),
  intention_funnel: intentionFunnelSchema,
  longueur_cible_mots: z.number(),
  plan_h2: z.array(z.string()),
  produits_a_mettre_en_avant: z.array(z.string()).default([]),
  marques_a_mentionner: z.array(z.string()).default([]),
  guides_lies: z.array(z.string()).default([]),
  ymyl_sensible: z.boolean().default(false),
  sources_a_citer: z.array(z.string()).nullable().default([]),
});

export type GuideBrief = z.infer<typeof guideBriefSchema>;

/**
 * GuideCollection — schema pour la collection Astro des fichiers .md publiés.
 *
 * Le champ `faq_cluster` peut être étendu par le site avec son propre enum :
 *
 * ```ts
 * import { guideCollectionSchema } from 'astro-bricks';
 * const myGuideSchema = guideCollectionSchema.extend({
 *   faq_cluster: z.enum(['choisir', 'sante', 'entretien', ...]),
 * });
 * ```
 */
export const guideCollectionSchema = z.object({
  slug: z.string(),
  title_seo: z.string().max(70),
  meta_description: z.string().max(160),
  h1: z.string(),
  publication: z.coerce.date(),
  mise_a_jour: z.coerce.date(),
  /** Cluster FAQ (site override avec son propre enum). */
  faq_cluster: z.string().optional(),
  produits_a_mettre_en_avant: z.array(z.string()).default([]),
  marques_a_mentionner: z.array(z.string()).default([]),
  guides_lies: z.array(z.string()).default([]),
  ymyl_sensible: z.boolean().default(false),
  sources_a_citer: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type GuideCollection = z.infer<typeof guideCollectionSchema>;
