/**
 * Schema INSTITUTIONNEL — collection Astro pour les pages légales et institutionnelles.
 *
 * Couvre : mentions-legales, politique-cookies, politique-confidentialite,
 * a-propos, accessibilite, contact, lexique, etc.
 */
import { z } from 'astro:content';

export const institutionnelSchema = z.object({
  /** URL canonique de la page sur le site. Ex : `/mentions-legales`. */
  url: z.string(),
  title_seo: z.string(),
  meta_description: z.string(),
  h1: z.string(),
  /** Si true, ajoute meta robots noindex. */
  noindex: z.boolean().default(false),
  /** Date de dernière mise à jour (affichée en bas de page). */
  mise_a_jour: z.coerce.date(),
});

export type Institutionnel = z.infer<typeof institutionnelSchema>;
