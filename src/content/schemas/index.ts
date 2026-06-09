/**
 * Barrel exports des schemas Zod du kit.
 *
 * Usage dans `src/content/config.ts` d'un site :
 * ```ts
 * import { defineCollection } from 'astro:content';
 * import { glob } from 'astro/loaders';
 * import { produitSchema, faqCollectionSchema, guideCollectionSchema } from 'astro-bricks/schemas';
 * import { z } from 'astro:content';
 *
 * const saunaTypes = ['cabine_infrarouge', 'sauna_vapeur', ...] as const;
 *
 * const produits = defineCollection({
 *   loader: glob({ pattern: '**\/*.md', base: './src/content/produits' }),
 *   schema: produitSchema.extend({
 *     type_produit: z.enum(saunaTypes),
 *   }),
 * });
 *
 * export const collections = { produits, ... };
 * ```
 */
export * from './enums';
export * from './marque';
export * from './produit';
export * from './guide';
export * from './faq';
export * from './institutionnel';
export * from './review';
export * from './persona';
