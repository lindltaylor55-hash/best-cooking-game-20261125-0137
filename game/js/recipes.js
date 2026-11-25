// Sizzle & Serve — the recipe book: every dish, its ingredients and its price.
// Ingredients are single words so a ticket reads at a glance in a screenshot.
export const INGREDIENTS = {
  bun: { label: 'Bun', key: '1', prep: 'ready', color: '#e0a458' },
  patty: { label: 'Patty', key: '2', prep: 'grill', color: '#7a4a2b' },
  lettuce: { label: 'Lettuce', key: '3', prep: 'chop', color: '#5da24a' },
  tomato: { label: 'Tomato', key: '4', prep: 'chop', color: '#d64541' },
  cheese: { label: 'Cheese', key: '5', prep: 'ready', color: '#f2c230' },
  onion: { label: 'Onion', key: '6', prep: 'chop', color: '#efe6f2' },
  egg: { label: 'Egg', key: '7', prep: 'grill', color: '#f6e27a' },
  bacon: { label: 'Bacon', key: '8', prep: 'grill', color: '#b3543f' },
};

export const INGREDIENT_ORDER = ['bun', 'patty', 'lettuce', 'tomato', 'cheese', 'onion', 'egg', 'bacon'];

/** name, ingredients in build order, base coins. Early shift dishes stay simple. */
export const RECIPES = [
  { name: 'Classic Burger', needs: ['bun', 'patty', 'lettuce', 'tomato'], coins: 8, early: true },
  { name: 'Cheese Melt', needs: ['bun', 'patty', 'cheese'], coins: 7, early: true },
  { name: 'Veggie Delight', needs: ['bun', 'lettuce', 'tomato', 'onion'], coins: 8, early: true },
  { name: 'Bacon Egg Bun', needs: ['bun', 'bacon', 'egg', 'cheese'], coins: 10, early: false },
  { name: 'Garden Stack', needs: ['bun', 'lettuce', 'tomato', 'onion', 'cheese'], coins: 11, early: false },
  { name: 'Double Trouble', needs: ['bun', 'patty', 'patty', 'cheese', 'bacon'], coins: 12, early: false },
];

/** Small deterministic RNG (mulberry32) so screenshot scenes stage identically. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Pick a recipe for a new order: only early dishes in the first 40 seconds. */
export function pickRecipe(random, elapsedSeconds) {
  const pool = elapsedSeconds < 40 ? RECIPES.filter((r) => r.early) : RECIPES;
  return pool[Math.floor(random() * pool.length)];
}
