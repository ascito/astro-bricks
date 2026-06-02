/**
 * Schema REVIEW — collection Astro pour les avis produits longs (~1500 mots).
 */
import { z } from 'astro:content';

export const reviewCollectionSchema = z.object({
  slug: z.string(),
  /** Slug du produit testé (référence vers la collection produits). */
  produit_slug: z.string(),
  title_seo: z.string().max(70),
  meta_description: z.string().max(160),
  h1: z.string(),
  publication: z.coerce.date(),
  mise_a_jour: z.coerce.date(),
  draft: z.boolean().default(false),
});

export type ReviewCollection = z.infer<typeof reviewCollectionSchema>;
