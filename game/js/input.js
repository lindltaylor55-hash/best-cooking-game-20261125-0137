// Sizzle & Serve — mouse and keyboard: every click and key the cook makes.
// All actions go through the same functions the screenshot autopilot calls,
// so a staged scene plays by the real rules.
import { INGREDIENT_ORDER } from './recipes.js';
import { binRect, chopSlotRect, clearButtonRect, grillSlotRect, serveButtonRect } from './render.js';
import { chopSlot, clearPlate, startIngredient, takeGrillSlot } from './kitchen.js';
import { servePlate } from './orders.js';

function inside(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

/** One bin click: start the ingredient (ready, grill or chop). */
export function clickIngredient(game, id) {
  const result = startIngredient(game.kitchen, id, game.now);
  if (result === 'busy') game.sfx.play('error');
  else if (result === 'plate') game.sfx.play('pop');
  else game.sfx.play('start');
  return result;
}

/** Click a grill slot: take a cooked item off, or bin a burnt one. */
export function clickGrillSlot(game, index) {
  const result = takeGrillSlot(game.kitchen, index, game.now);
  if (result === 'done') game.sfx.play('ding');
  else if (result === 'burnt') {
    game.sfx.play('error');
    game.setToast('Burnt! Binned.', false);
  } else if (result === 'cooking') game.sfx.play('error');
  return result;
}

/** Click a chopping-board slot: one chop. */
export function clickChopSlot(game, index) {
  const result = chopSlot(game.kitchen, index);
  if (result === 'done') game.sfx.play('ding');
  else if (result === 'chopping') game.sfx.play('chop');
  return result;
}

/** Serve the plate to the order board. */
export function serve(game) {
  const plateIds = game.kitchen.plate.map((item) => item.id);
  const result = servePlate(game.board, plateIds, game.combo);
  game.kitchen.plate = [];
  if (result.kind === 'served') {
    game.score += result.coins * 10;
    game.coins += result.coins;
    game.served += 1;
    game.combo = Math.min(game.combo + 1, 5);
    game.bestCombo = Math.max(game.bestCombo, game.combo);
    game.setToast(`Served ${result.order.recipe.name}! +${result.coins} coins`, true);
    game.sfx.play('serve');
  } else if (result.kind === 'walk-in') {
    game.coins += 1;
    game.combo = 0;
    game.setToast('No ticket matched — a walk-in took it for 1 coin.', false);
    game.sfx.play('error');
  } else {
    game.sfx.play('error');
  }
  return result;
}

/** Route a canvas click to the part of the kitchen under it. */
export function handleClick(game, px, py, scale) {
  if (game.screen !== 'play') return;
  const x = px / scale;
  const y = py / scale;
  for (let i = 0; i < INGREDIENT_ORDER.length; i += 1) {
    if (inside(x, y, binRect(i))) {
      clickIngredient(game, INGREDIENT_ORDER[i]);
      return;
    }
  }
  for (let i = 0; i < 2; i += 1) {
    if (inside(x, y, grillSlotRect(i))) {
      clickGrillSlot(game, i);
      return;
    }
    if (inside(x, y, chopSlotRect(i))) {
      clickChopSlot(game, i);
      return;
    }
  }
  if (inside(x, y, serveButtonRect())) {
    serve(game);
    return;
  }
  if (inside(x, y, clearButtonRect())) {
    clearPlate(game.kitchen);
    game.sfx.play('pop');
  }
}

/** Route a key press: 1-8 bins, Space serve, P pause, R restart, Enter start. */
export function handleKey(game, key) {
  if (key === 'Enter' && game.screen === 'title') {
    game.startShift();
    return;
  }
  if ((key === 'r' || key === 'R') && (game.screen === 'over' || game.screen === 'paused')) {
    game.startShift();
    return;
  }
  if ((key === 'p' || key === 'P') && (game.screen === 'play' || game.screen === 'paused')) {
    game.screen = game.screen === 'play' ? 'paused' : 'play';
    return;
  }
  if (game.screen !== 'play') return;
  if (key === ' ') {
    serve(game);
    return;
  }
  const n = Number(key);
  if (Number.isInteger(n) && n >= 1 && n <= INGREDIENT_ORDER.length) {
    clickIngredient(game, INGREDIENT_ORDER[n - 1]);
  }
}
