// Sizzle & Serve — game-wide constants: canvas, timings, stations and look.
// Every number the kitchen runs on lives here, so tuning never touches the rules.
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 800;
export const SHIFT_SECONDS = 180;
export const MAX_ORDERS = 3;
export const ORDER_PATIENCE = 48;
export const GRILL_COOK_SECONDS = 6;
export const GRILL_BURN_SECONDS = 5;
export const CHOPS_PER_ITEM = 3;
export const COMBO_STEP = 0.1;
export const COMBO_CAP = 0.5;

/** Order spawn gap, seconds: starts brisk, tightens as the shift wears on. */
export function spawnGapSeconds(elapsedSeconds) {
  if (elapsedSeconds < 40) return 9;
  if (elapsedSeconds < 90) return 8;
  if (elapsedSeconds < 140) return 7;
  return 6;
}

/** A warm street-stall palette, drawn with canvas shapes only. */
export const PALETTE = {
  wall: '#f3d9a4',
  wallShadow: '#e0b978',
  counterTop: '#8a5a33',
  counterFront: '#6e4525',
  steel: '#b9c2c9',
  steelDark: '#8d979e',
  board: '#fdf6e3',
  boardInk: '#3a2a18',
  ticket: '#fff8dc',
  ticketEdge: '#d9c48a',
  plate: '#f4f1ea',
  danger: '#d64541',
  good: '#3d9970',
  gold: '#e8a13a',
  ink: '#2b2118',
};
