# Architecture astro-bricks

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                       Composition JSON                       │
│  { id, name, bricks: [ {id, brick, inputs, slots}, ... ] }  │
└─────────────────────────────────────────────────────────────┘
                              ↓
                ┌─────────────────────────────┐
                │      resolveComposition()    │
                │   - Index par ID             │
                │   - Détecte les racines      │
                │   - Résout les slots/refs    │
                │   - Détecte les cycles       │
                └─────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    ResolvedComposition                       │
│   { id, name, roots: ResolvedBrick[] }                      │
│                                                              │
│   ResolvedBrick = {                                         │
│     id, brick, inputs,                                      │
│     children: { slotName: ResolvedBrick[] }                 │
│   }                                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
                ┌─────────────────────────────┐
                │       <Render>.astro         │
                │   Itère sur roots            │
                └─────────────────────────────┘
                              ↓
                ┌─────────────────────────────┐
                │      <BrickNode>.astro       │
                │   - Lookup BRICK_REGISTRY    │
                │   - Render le composant      │
                │   - Récurse sur children     │
                │     via <Fragment slot="..."> │
                └─────────────────────────────┘
                              ↓
                          HTML statique
```

## Fichiers clés

| Fichier | Rôle |
|---|---|
| `src/engine/types.ts` | Types TS (Composition, BrickInstance, ResolvedBrick…) |
| `src/engine/resolveComposition.ts` | Algorithme de résolution refs → arbre |
| `src/engine/registry.ts` | Map `brick id → composant Astro` |
| `src/Render.astro` | Point d'entrée public |
| `src/BrickNode.astro` | Récursion via `Astro.self` |
| `src/bricks/Fallback.astro` | Affiché si brique inconnue |
| `src/bricks/primitives/*.astro` | Implémentation des primitives |
| `src/bricks/composites/*.astro` | Implémentation des composites |

## Convention props des briques

Chaque composant Astro de brique reçoit :

1. **Les inputs du schema** comme props (`label`, `variant`, etc.)
2. **Deux props techniques** (auto-injectées par BrickNode) :
   - `_brickId` : id de la brique dans la composition
   - `_brickType` : type de brique (`button`, `card`, …)
3. **Des `<slot name="...">`** correspondant aux slots déclarés dans la composition

Les noms de slots doivent matcher entre :
- La composition JSON : `"slots": { "body": ["id1"] }`
- Le composant Astro : `<slot name="body" />`

## Ajout d'une nouvelle brique en 4 étapes

```bash
# 1. Créer le composant
touch src/bricks/composites/MaBrique.astro

# 2. Importer + enregistrer dans le registry
# (editer src/engine/registry.ts)

# 3. Vérifier que les props matchent le schema du catalog
# (consulter src/catalog.json)

# 4. Tester avec un exemple
# (editer examples/landing-simple/composition.json)
```

## Limitations connues (v0.0.1)

- ❌ Pas de validation runtime des inputs (à ajouter via ajv)
- ❌ Pas de chargement async des briques (toutes importées d'un coup)
- ❌ Pas de catalogue versionné
- ❌ La brique `ai-generate` n'est pas encore implémentée
- ❌ Les slots ne sont pas typés au niveau schema

Ces limitations seront adressées dans les itérations suivantes.
