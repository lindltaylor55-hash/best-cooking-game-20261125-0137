// Sizzle & Serve — the order board: tickets arrive, wait, and get served.
// A ticket is a recipe plus a patience clock; serving the plate that matches it
// pays its coins plus a tip for the patience still left on the clock.
import { MAX_ORDERS, ORDER_PATIENCE, spawnGapSeconds } from './config.js';
import { pickRecipe } from './recipes.js';

export function createOrderBoard() {
  return { orders: [], nextId: 1, spawnIn: 2 };
}

/** Count a plate's ingredients the way a ticket counts them (doubles count). */
export function countIngredients(ids) {
  const counts = {};
  for (const id of ids) counts[id] = (counts[id] || 0) + 1;
  return counts;
}

/** Does this plate build exactly this recipe, ingredient for ingredient? */
export function plateMatchesRecipe(plateIds, recipe) {
  const have = countIngredients(plateIds);
  const want = countIngredients(recipe.needs);
  const keys = new Set([...Object.keys(have), ...Object.keys(want)]);
  for (const key of keys) if ((have[key] || 0) !== (want[key] || 0)) return false;
  return true;
}

export function spawnOrder(board, random, elapsedSeconds, now) {
  if (board.orders.length >= MAX_ORDERS) return null;
  const recipe = pickRecipe(random, elapsedSeconds);
  const order = {
    id: board.nextId,
    recipe,
    bornAt: now,
    patience: ORDER_PATIENCE,
    served: false,
  };
  board.nextId += 1;
  board.orders.push(order);
  return order;
}

/** Advance the board: spawn new tickets, age patience, drop expired ones. */
export function stepOrders(board, random, dt, elapsedSeconds, now) {
  const expired = [];
  board.spawnIn -= dt;
  if (board.spawnIn <= 0) {
    const made = spawnOrder(board, random, elapsedSeconds, now);
    board.spawnIn = made ? spawnGapSeconds(elapsedSeconds) : 4;
  }
  for (let i = board.orders.length - 1; i >= 0; i -= 1) {
    const order = board.orders[i];
    order.patience -= dt;
    if (order.patience <= 0) {
      expired.push(order);
      board.orders.splice(i, 1);
    }
  }
  return expired;
}

/** Serve the plate: pay the first order it matches, or a walk-in pittance. */
export function servePlate(board, plateIds, combo) {
  if (plateIds.length === 0) return { kind: 'empty', coins: 0 };
  for (let i = 0; i < board.orders.length; i += 1) {
    const order = board.orders[i];
    if (plateMatchesRecipe(plateIds, order.recipe)) {
      const tip = Math.round((order.patience / ORDER_PATIENCE) * 6);
      const base = order.recipe.coins + tip;
      const coins = Math.round(base * (1 + combo * 0.1));
      board.orders.splice(i, 1);
      return { kind: 'served', order, coins, tip };
    }
  }
  return { kind: 'walk-in', coins: 1 };
}
