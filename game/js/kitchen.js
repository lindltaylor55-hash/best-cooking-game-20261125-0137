// Sizzle & Serve — kitchen state: the plate, the grill and the chopping board.
// One plate at a time. Ingredients that need prep go to a station first and fly
// to the plate on their own when they are ready; a burnt item must be binned.
import { CHOPS_PER_ITEM, GRILL_BURN_SECONDS, GRILL_COOK_SECONDS } from './config.js';
import { INGREDIENTS } from './recipes.js';

export const GRILL_SLOTS = 2;
export const CHOP_SLOTS = 2;

export function createKitchen() {
  return {
    plate: [],
    grill: [null, null],
    board: [null, null],
    flying: [],
    trashCount: 0,
    burntCount: 0,
  };
}

/** Start an ingredient: ready ones land on the plate, the rest go to a station. */
export function startIngredient(kitchen, id, now) {
  const def = INGREDIENTS[id];
  if (!def) return 'unknown';
  if (def.prep === 'ready') {
    kitchen.plate.push({ id, state: 'ready' });
    return 'plate';
  }
  const slots = def.prep === 'grill' ? kitchen.grill : kitchen.board;
  const free = slots.findIndex((s) => s === null);
  if (free === -1) return 'busy';
  slots[free] =
    def.prep === 'grill'
      ? { id, state: 'cooking', startedAt: now, doneAt: now + GRILL_COOK_SECONDS, burnAt: now + GRILL_COOK_SECONDS + GRILL_BURN_SECONDS }
      : { id, state: 'chopping', chops: 0, chopsNeeded: CHOPS_PER_ITEM };
  return def.prep;
}

/** One chop on a board slot; a finished item flies to the plate. */
export function chopSlot(kitchen, index) {
  const slot = kitchen.board[index];
  if (!slot) return 'empty';
  slot.chops += 1;
  if (slot.chops >= slot.chopsNeeded) {
    kitchen.board[index] = null;
    kitchen.flying.push({ id: slot.id, progress: 0 });
    return 'done';
  }
  return 'chopping';
}

/** Take a cooked grill item to the plate; a burnt one goes in the bin. */
export function takeGrillSlot(kitchen, index, now) {
  const slot = kitchen.grill[index];
  if (!slot) return 'empty';
  if (now >= slot.burnAt) {
    kitchen.grill[index] = null;
    kitchen.burntCount += 1;
    return 'burnt';
  }
  if (now < slot.doneAt) return 'cooking';
  kitchen.grill[index] = null;
  kitchen.flying.push({ id: slot.id, progress: 0 });
  return 'done';
}

/** Advance grill timers and the flying-item animation; returns fresh events. */
export function stepKitchen(kitchen, dt, now) {
  const events = [];
  for (let i = 0; i < kitchen.grill.length; i += 1) {
    const slot = kitchen.grill[i];
    if (slot && slot.state === 'cooking' && now >= slot.doneAt) {
      slot.state = 'ready';
      events.push({ type: 'grill-ready', slot: i, id: slot.id });
    }
  }
  for (let i = kitchen.flying.length - 1; i >= 0; i -= 1) {
    kitchen.flying[i].progress += dt * 2.4;
    if (kitchen.flying[i].progress >= 1) {
      kitchen.plate.push({ id: kitchen.flying[i].id, state: 'ready' });
      kitchen.flying.splice(i, 1);
    }
  }
  return events;
}

/** Empty the plate into the bin (a wrong build costs the cook nothing but time). */
export function clearPlate(kitchen) {
  kitchen.trashCount += kitchen.plate.length;
  kitchen.plate = [];
}
