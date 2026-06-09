/**
 * tokens.ts — Système de substitution de tokens `{{path.to.value}}`
 *
 * Permet d'injecter des données runtime (produit, marque, site…) dans une
 * composition statique JSON.
 *
 * Règles :
 *  - `{{product.name}}` SEUL dans une chaîne → la valeur typée est conservée
 *    (number, boolean, array, object…). C'est ce qu'il faut pour passer un
 *    array `images` à une brique gallery, ou un `rating` numérique.
 *  - `"Note: {{product.rating}}/5"` → interpolation string standard.
 *  - Token non trouvé → conservé tel quel (utile en dev) + warning console.
 *  - Path supporte la notation pointée (`product.brand.name`) et les index
 *    de tableau (`product.images.0`).
 */

const TOKEN_RE = /\{\{\s*([a-zA-Z_][\w.]*)\s*\}\}/g;
const FULL_TOKEN_RE = /^\{\{\s*([a-zA-Z_][\w.]*)\s*\}\}$/;

export type TokenContext = Record<string, unknown>;

/** Lit une valeur dans le contexte via un path pointé. */
function getByPath(context: TokenContext, path: string): unknown {
  const segments = path.split('.');
  let current: unknown = context;
  for (const seg of segments) {
    if (current === null || current === undefined) return undefined;
    if (Array.isArray(current)) {
      const idx = Number(seg);
      if (Number.isNaN(idx)) return undefined;
      current = current[idx];
    } else if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[seg];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Substitue les tokens dans une valeur de n'importe quel type.
 * Walk récursif : strings, arrays, objects plains.
 */
export function substituteTokens<T = unknown>(value: T, context: TokenContext): T {
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    // Cas 1 : la string entière est un token → on garde le type d'origine
    const fullMatch = value.match(FULL_TOKEN_RE);
    if (fullMatch) {
      const replaced = getByPath(context, fullMatch[1]);
      if (replaced === undefined) {
        // eslint-disable-next-line no-console
        console.warn(`[astro-bricks] Token non résolu : {{${fullMatch[1]}}}`);
        return value;
      }
      return replaced as unknown as T;
    }
    // Cas 2 : interpolation dans une string plus large
    const interpolated = value.replace(TOKEN_RE, (_, path: string) => {
      const v = getByPath(context, path);
      if (v === undefined) {
        // eslint-disable-next-line no-console
        console.warn(`[astro-bricks] Token non résolu : {{${path}}}`);
        return `{{${path}}}`;
      }
      return String(v);
    });
    return interpolated as unknown as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => substituteTokens(item, context)) as unknown as T;
  }

  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = substituteTokens(v, context);
    }
    return out as unknown as T;
  }

  // number, boolean, function, symbol : tels quels
  return value;
}

/**
 * Applique la substitution à un arbre `ResolvedBrick` déjà résolu.
 * Walk récursif sur `inputs` et `children`.
 */
import type { ResolvedBrick, ResolvedComposition } from './types';

export function applyTokensToBrick(
  node: ResolvedBrick,
  context: TokenContext
): ResolvedBrick {
  const children: Record<string, ResolvedBrick[]> = {};
  for (const [slotName, refs] of Object.entries(node.children)) {
    children[slotName] = refs.map((child) => applyTokensToBrick(child, context));
  }
  return {
    id: node.id,
    brick: node.brick,
    inputs: substituteTokens(node.inputs, context),
    children,
  };
}

export function applyTokensToComposition(
  resolved: ResolvedComposition,
  context: TokenContext
): ResolvedComposition {
  return {
    id: resolved.id,
    name: resolved.name,
    roots: resolved.roots.map((root) => applyTokensToBrick(root, context)),
  };
}
