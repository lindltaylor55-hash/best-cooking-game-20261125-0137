// Sizzle & Serve — screenshot scenes behind ?shot=title|play|rush.
// Each scene plays the real rules forward from a fresh world with a fixed seed,
// steered by a small autopilot that cooks the oldest ticket first, so the frame
// is what a real shift looks like and the same seed always gives the same frame.
import { INGREDIENTS } from './recipes.js';
import { clickChopSlot, clickGrillSlot, clickIngredient, serve } from './input.js';
import { countIngredients, plateMatchesRecipe } from './orders.js';
import { clearPlate } from './kitchen.js';

const STEP = 1 / 30;

/** Is every item on the plate still usable by this recipe, in the right count? */
function plateStillFits(plateIds, recipe) {
  const have = countIngredients(plateIds);
  const want = countIngredients(recipe.needs);
  for (const key of Object.keys(have)) {
    if ((have[key] || 0) > (want[key] || 0)) return false;
  }
  return true;
}

/** The autopilot's next move for the oldest open ticket, or null to wait. */
function nextMove(game) {
  const order = game.board.orders[0];
  if (!order) return null;
  const plate = game.kitchen.plate.map((item) => item.id);
  if (plateMatchesRecipe(plate, order.recipe)) return { type: 'serve' };
  if (plate.length > 0 && !plateStillFits(plate, order.recipe)) {
    for (const other of game.board.orders) {
      if (plateMatchesRecipe(plate, other.recipe)) return { type: 'serve' };
    }
    return { type: 'clear' };
  }
  // Bin a burnt grill item before it sits there looking like a mistake.
  const burnt = game.kitchen.grill.findIndex((s) => s && game.now >= s.burnAt);
  if (burnt !== -1) return { type: 'grill', index: burnt };
  // Take a ready grill item the plate is still waiting for, before anything else.
  const plateCounts = countIngredients(plate);
  const want = countIngredients(order.recipe.needs);
  for (const id of Object.keys(want)) {
    if ((plateCounts[id] || 0) < want[id]) {
      const readySlot = game.kitchen.grill.findIndex((s) => s && s.id === id && s.state === 'ready');
      if (readySlot !== -1) return { type: 'grill', index: readySlot };
    }
  }
  // Work the recipe in order. An ingredient already on the plate is skipped;
  // one already cooking, chopping or flying to the plate is waited on, never
  // started twice; anything else is started now.
  for (const id of order.recipe.needs) {
    if ((plateCounts[id] || 0) > 0) {
      plateCounts[id] -= 1;
      continue;
    }
    if (game.kitchen.flying.some((f) => f.id === id)) return null;
    const def = INGREDIENTS[id];
    if (def.prep === 'ready') return { type: 'ingredient', id };
    if (def.prep === 'grill') {
      if (game.kitchen.grill.some((s) => s && s.id === id)) return null;
      return { type: 'ingredient', id };
    }
    const slot = game.kitchen.board.findIndex((s) => s && s.id === id);
    if (slot !== -1) return { type: 'chop', index: slot };
    return { type: 'ingredient', id };
  }
  return null;
}

function doMove(game, move) {
  if (!move) return;
  if (move.type === 'serve') serve(game);
  else if (move.type === 'ingredient') clickIngredient(game, move.id);
  else if (move.type === 'grill') clickGrillSlot(game, move.index);
  else if (move.type === 'chop') clickChopSlot(game, move.index);
  else if (move.type === 'clear') clearPlate(game.kitchen);
}

/**
 * Set the game to the named scene (title, play or rush; any other name is title)
 * and return the screen to draw. The play scene runs ~35 seconds of real play;
 * the rush scene runs ~125 seconds, so tickets pile up and the clock runs low.
 */
export function stageShot(name, game) {
  game.startShift(1337);
  if (name !== 'play' && name !== 'rush') {
    game.screen = 'title';
    return 'title';
  }
  const seconds = name === 'rush' ? 125 : 49;
  let nextThink = 0;
  for (let t = 0; t < seconds; t += STEP) {
    game.step(STEP);
    if (t >= nextThink) {
      doMove(game, nextMove(game));
      nextThink = t + 0.5;
    }
  }
  game.screen = 'play';
  return 'play';
}
