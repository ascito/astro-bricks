/**
 * Types TypeScript alignés sur la spec Bricks.
 * Réfs : https://github.com/ascito/bricks/blob/main/docs/bricks-catalog.md
 *         https://github.com/ascito/bricks/blob/main/docs/bricks-composition.md
 */

/** Catégories de briques selon la spec. */
export type BrickCategory = 'primitive' | 'composite' | 'intelligence';

/** Entrée du catalogue : définition d'un type de brique. */
export interface BrickDefinition {
  id: string;
  category: BrickCategory;
  description: string;
  schema: Record<string, unknown>; // JSON Schema brut
  examples: Record<string, unknown>[];
}

/** Catalogue complet = tableau de définitions. */
export type Catalog = BrickDefinition[];

/**
 * Instance d'une brique dans une composition.
 * - `id`     : identifiant local (référencé dans les slots)
 * - `brick`  : type de brique (doit exister dans le catalog)
 * - `inputs` : paramètres typés selon le schema
 * - `slots`  : refs vers d'autres briques de la même composition
 */
export interface BrickInstance {
  id: string;
  brick: string;
  inputs?: Record<string, unknown>;
  slots?: Record<string, string[]>;
}

/** Composition = structure plate avec un tableau de briques. */
export interface Composition {
  id: string;
  name: string;
  bricks: BrickInstance[];
}

/**
 * Nœud résolu — instance de brique enrichie de ses children par slot.
 * Produit par `resolveComposition()` à partir des refs ID.
 */
export interface ResolvedBrick {
  id: string;
  brick: string;
  inputs: Record<string, unknown>;
  /** Children résolus, groupés par nom de slot (déjà résolus récursivement) */
  children: Record<string, ResolvedBrick[]>;
}

/** Résultat de résolution = arbre des briques racines (sans parent). */
export interface ResolvedComposition {
  id: string;
  name: string;
  roots: ResolvedBrick[];
}
