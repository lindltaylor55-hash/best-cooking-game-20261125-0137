// Sizzle & Serve — the game itself: state, the loop, and the screens.
// The canvas is fixed at 1280x800 and scaled by CSS, so a screenshot is always
// the same frame. ?shot=title|play|rush stages a scene instead of starting live.
import { CANVAS_HEIGHT, CANVAS_WIDTH, SHIFT_SECONDS, spawnGapSeconds } from './config.js';
import { mulberry32 } from './recipes.js';
import { createKitchen, stepKitchen } from './kitchen.js';
import { createOrderBoard, stepOrders } from './orders.js';
import { createSfx } from './audio.js';
import { handleClick, handleKey } from './input.js';
import { render } from './render.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const game = {
  screen: 'title',
  now: 0,
  elapsed: 0,
  timeLeft: SHIFT_SECONDS,
  score: 0,
  coins: 0,
  served: 0,
  combo: 0,
  bestCombo: 0,
  trash: 0,
  best: { score: 0, served: 0 },
  toast: null,
  random: mulberry32((Date.now() % 2147483647) || 1),
  board: createOrderBoard(),
  kitchen: createKitchen(),
  sfx: createSfx(),
  setToast(text, good) {
    this.toast = { text, good, at: this.now };
  },
  startShift(seed) {
    this.random = mulberry32(seed ?? ((Date.now() % 2147483647) || 1));
    this.board = createOrderBoard();
    this.kitchen = createKitchen();
    this.now = 0;
    this.elapsed = 0;
    this.timeLeft = SHIFT_SECONDS;
    this.score = 0;
    this.coins = 0;
    this.served = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.trash = 0;
    this.toast = null;
    this.screen = 'play';
  },
  step(dt) {
    if (this.screen !== 'play') return;
    this.now += dt;
    this.elapsed += dt;
    this.timeLeft = Math.max(0, SHIFT_SECONDS - this.elapsed);
    const expired = stepOrders(this.board, this.random, dt, this.elapsed, this.now);
    for (const order of expired) {
      this.combo = 0;
      this.setToast(`Order #${order.id} walked out!`, false);
      this.sfx.play('expire');
    }
    stepKitchen(this.kitchen, dt, this.now);
    this.trash = this.kitchen.trashCount + this.kitchen.burntCount;
    if (this.timeLeft <= 0) {
      this.screen = 'over';
      this.best = {
        score: Math.max(this.best.score, this.score),
        served: Math.max(this.best.served, this.served),
      };
    }
  },
};

function frameSize() {
  const rect = canvas.getBoundingClientRect();
  return rect.width / CANVAS_WIDTH;
}

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  handleClick(game, event.clientX - rect.left, event.clientY - rect.top, frameSize());
});
window.addEventListener('keydown', (event) => {
  if ([' ', 'ArrowUp', 'ArrowDown'].includes(event.key)) event.preventDefault();
  handleKey(game, event.key);
});

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  game.step(dt);
  render(ctx, game);
  requestAnimationFrame(loop);
}

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) {
  stageShot(shot, game);
  render(ctx, game);
  document.title = `SIZZLE-READY-${shot}`;
} else {
  document.title = 'SIZZLE-READY';
  requestAnimationFrame(loop);
}
