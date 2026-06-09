/**
 * resolveComposition : transforme une composition à plat (avec refs ID dans les slots)
 * en arbre de ResolvedBrick consommable par le moteur de rendu.
 *
 * Principe :
 *  - On indexe toutes les briques par leur id
 *  - On identifie les "racines" : briques qui ne sont référencées dans AUCUN slot
 *  - On résout récursivement les slots de chaque brique
 *  - On détecte les cycles (sécurité)
 */

import type {
  Composition,
  ResolvedComposition,
  ResolvedBrick,
  BrickInstance,
} from './types';

export class CompositionError extends Error {
  constructor(message: string) {
    super(`[astro-bricks] ${message}`);
    this.name = 'CompositionError';
  }
}

export function resolveComposition(composition: Composition): ResolvedComposition {
  if (!composition || !Array.isArray(composition.bricks)) {
    throw new CompositionError(
      'Composition invalide : objet attendu avec un tableau "bricks"'
    );
  }

  // 1. Index par ID + vérif unicité
  const index = new Map<string, BrickInstance>();
  for (const b of composition.bricks) {
    if (!b.id || !b.brick) {
      throw new CompositionError(
        `Brique mal formée : chaque entrée doit avoir un "id" et un "brick" (vu : ${JSON.stringify(b)})`
      );
    }
    if (index.has(b.id)) {
      throw new CompositionError(`ID dupliqué dans la composition : "${b.id}"`);
    }
    index.set(b.id, b);
  }

  // 2. Identifier les enfants référencés par au moins un slot
  const childrenIds = new Set<string>();
  for (const b of composition.bricks) {
    if (!b.slots) continue;
    for (const slotName of Object.keys(b.slots)) {
      const refs = b.slots[slotName];
      if (!Array.isArray(refs)) {
        throw new CompositionError(
          `Slot "${slotName}" de la brique "${b.id}" doit être un tableau d'IDs (vu : ${JSON.stringify(refs)})`
        );
      }
      for (const ref of refs) {
        if (!index.has(ref)) {
          throw new CompositionError(
            `Référence introuvable : la brique "${b.id}" pointe vers "${ref}" dans le slot "${slotName}" mais aucune brique n'a cet ID`
          );
        }
        childrenIds.add(ref);
      }
    }
  }

  // 3. Les racines = briques qui ne sont enfant de personne
  const rootInstances = composition.bricks.filter((b) => !childrenIds.has(b.id));

  // 4. Résolution récursive avec détection de cycles
  const inProgress = new Set<string>();
  const resolveBrick = (id: string): ResolvedBrick => {
    if (inProgress.has(id)) {
      throw new CompositionError(
        `Cycle détecté impliquant la brique "${id}" (un slot référence une brique ancêtre)`
      );
    }
    const instance = index.get(id);
    if (!instance) {
      throw new CompositionError(`Brique introuvable : "${id}"`);
    }
    inProgress.add(id);

    const children: Record<string, ResolvedBrick[]> = {};
    if (instance.slots) {
      for (const [slotName, refs] of Object.entries(instance.slots)) {
        children[slotName] = refs.map((ref) => resolveBrick(ref));
      }
    }

    inProgress.delete(id);

    return {
      id: instance.id,
      brick: instance.brick,
      inputs: instance.inputs ?? {},
      children,
    };
  };

  const roots = rootInstances.map((root) => resolveBrick(root.id));

  return {
    id: composition.id,
    name: composition.name,
    roots,
  };
}
