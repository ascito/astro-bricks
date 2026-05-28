/**
 * Exports publics de astro-bricks.
 *
 * Usage minimal :
 * ```ts
 * import { Render } from 'astro-bricks';
 * import type { Composition } from 'astro-bricks';
 * ```
 */

// Engine
export { resolveComposition, CompositionError } from './engine/resolveComposition';
export { BRICK_REGISTRY } from './engine/registry';

// Types
export type {
  Composition,
  BrickInstance,
  ResolvedComposition,
  ResolvedBrick,
  BrickCategory,
  BrickDefinition,
  Catalog,
} from './engine/types';

// Le composant Render est importé directement via :
// import { Render } from 'astro-bricks/Render.astro';
