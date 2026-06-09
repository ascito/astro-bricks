/**
 * Schema PERSONA — convention v3 réseau Factory.
 *
 * Un persona = un profil utilisateur cible avec ses pain-points et ses
 * recommandations produits. Consommé par :
 *  - le hub `/pour-qui/` (liste de PersonaCard)
 *  - la home (filtre `showOnHome` pour ne sortir que les top profils)
 *  - le maillage interne (liens depuis comparatifs verticaux SEO)
 *
 * Source de vérité : `src/data/personas.json` côté site (single source of truth).
 *
 * Couleur sémantique : `color` est un nom de palette Tailwind (`indigo`, `rose`,
 * `amber`, `emerald`, `violet`, `slate`, `teal`, `cyan`...). La brique
 * `PersonaCard` mappe ce nom vers les classes Tailwind correspondantes (border,
 * eyebrow, hover) — voir `PersonaCard.astro` pour la liste exhaustive supportée.
 *
 * Usage Zod (pour valider personas.json au build) :
 * ```ts
 * import { personaSchema, personasFileSchema } from 'astro-bricks/schemas';
 * import personasData from './src/data/personas.json';
 *
 * const parsed = personasFileSchema.parse(personasData);
 * ```
 *
 * Usage TypeScript (sans validation runtime, juste les types) :
 * ```ts
 * import type { Persona } from 'astro-bricks';
 * const personas: Persona[] = ...;
 * ```
 */
import { z } from 'astro:content';

/**
 * Palette de couleurs sémantiques supportées par PersonaCard.
 * Étend cette liste si tu veux mapper de nouvelles couleurs Tailwind.
 */
export const personaColorSchema = z.enum([
  'indigo',
  'rose',
  'amber',
  'emerald',
  'violet',
  'slate',
  'teal',
  'cyan',
  'sky',
  'fuchsia',
]);
export type PersonaColor = z.infer<typeof personaColorSchema>;

export const personaSchema = z.object({
  /** Slug URL (ex: `'adulte-debutant'`). */
  slug: z.string().min(1),
  /** URL complète de la page persona (ex: `'/pour-qui/adulte-debutant'`). */
  href: z.string().startsWith('/'),
  /** Émoji ou caractère emoji-like en tête de carte. */
  icon: z.string().min(1).max(8),
  /** Couleur sémantique mappée vers Tailwind par PersonaCard. */
  color: personaColorSchema,
  /** Étiquette courte en haut de carte (uppercase). */
  eyebrow: z.string().min(1),
  /** Titre H2 de la carte (et H1 de la page persona). */
  title: z.string().min(1),
  /** Description courte (1 ligne) — utilisée sur la home. */
  shortDesc: z.string().min(1),
  /** Description longue (1-2 phrases) — utilisée sur le hub /pour-qui/. */
  longDesc: z.string().min(1),
  /** Liste des modèles produits cités, format ` · ` (interpoint). */
  pianos: z.string().min(1),
  /** Si vrai, affiché dans le bloc personas de la home (top profils). */
  showOnHome: z.boolean().default(true),
});

export type Persona = z.infer<typeof personaSchema>;

/**
 * Schema du fichier `personas.json` complet (root contient `{ personas: [...] }`).
 * Le `$comment` racine est optionnel et accepté (doc inline).
 */
export const personasFileSchema = z.object({
  $comment: z.string().optional(),
  personas: z.array(personaSchema).min(1),
});

export type PersonasFile = z.infer<typeof personasFileSchema>;
