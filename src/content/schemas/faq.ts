/**
 * Schema FAQ — collection Astro pour les Q/R Markdown.
 *
 * Le champ `cluster` est typé `string()` au niveau du kit : chaque site
 * le restreint à son propre enum via `.extend()` :
 *
 * ```ts
 * import { faqCollectionSchema } from 'astro-bricks';
 * const myFaqSchema = faqCollectionSchema.extend({
 *   cluster: z.enum(['choisir', 'sante', 'entretien', 'prix']),
 * });
 * ```
 */
import { z } from 'astro:content';

export const faqCollectionSchema = z.object({
  question: z.string(),
  answer: z.string(),
  /** Cluster thématique (site override avec son propre enum). */
  cluster: z.string(),
  /** Page principale où la Q/R est affichée (pour priorisation et maillage). */
  page_cible: z.string().optional(),
  /** Ordre d'affichage (plus petit = plus haut). Défaut : 99. */
  ordre: z.number().default(99),
});

export type FaqEntry = z.infer<typeof faqCollectionSchema>;
