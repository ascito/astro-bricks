/**
 * Enums Zod communs réutilisables par tous les sites Factory.
 *
 * Les enums spécifiques à un domaine (ex: types de saunas, types de stations météo)
 * sont définis localement dans chaque site.
 */
import { z } from 'astro:content';

/** Positionnement gamme de prix. */
export const positionnementSchema = z.enum(['entry', 'milieu-de-gamme', 'premium', 'luxury']);
export type Positionnement = z.infer<typeof positionnementSchema>;

/** Qualité du SAV France. */
export const savFranceSchema = z.enum(['limite', 'moyen', 'bon', 'excellent']);
export type SavFrance = z.infer<typeof savFranceSchema>;

/** Intention dans le funnel SEO. */
export const intentionFunnelSchema = z.enum([
  'top-of-funnel',    // découverte
  'middle-of-funnel', // comparaison
  'bottom-of-funnel', // conversion
]);
export type IntentionFunnel = z.infer<typeof intentionFunnelSchema>;
