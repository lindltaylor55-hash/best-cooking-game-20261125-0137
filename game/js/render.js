// Sizzle & Serve — every pixel the player sees: the kitchen, the board, the food.
// All art is drawn with canvas shapes, so the game ships no image files at all.
import { CANVAS_HEIGHT, CANVAS_WIDTH, PALETTE } from './config.js';
import { INGREDIENTS, INGREDIENT_ORDER } from './recipes.js';

/** Layout: where each part of the kitchen sits on the 1280x800 canvas. */
export const LAYOUT = {
  topBar: { x: 0, y: 0, w: CANVAS_WIDTH, h: 64 },
  board: { x: 16, y: 84, w: 280, h: 340 },
  counter: { x: 320, y: 84, w: 620, h: 216 },
  grill: { x: 320, y: 320, w: 300, h: 200 },
  chopping: { x: 640, y: 320, w: 300, h: 200 },
  plating: { x: 960, y: 84, w: 304, h: 436 },
  help: { x: 0, y: 760, w: CANVAS_WIDTH, h: 40 },
};

/** Ingredient bins on the counter, four across, two rows. */
export function binRect(index) {
  const col = index % 4;
  const row = Math.floor(index / 4);
  return { x: LAYOUT.counter.x + 12 + col * 152, y: LAYOUT.counter.y + 14 + row * 100, w: 140, h: 88 };
}

export function grillSlotRect(index) {
  return { x: LAYOUT.grill.x + 18 + index * 140, y: LAYOUT.grill.y + 52, w: 124, h: 110 };
}

export function chopSlotRect(index) {
  return { x: LAYOUT.chopping.x + 18 + index * 140, y: LAYOUT.chopping.y + 52, w: 124, h: 110 };
}

export function serveButtonRect() {
  return { x: LAYOUT.plating.x + 52, y: LAYOUT.plating.y + 330, w: 200, h: 56 };
}

export function clearButtonRect() {
  return { x: LAYOUT.plating.x + 52, y: LAYOUT.plating.y + 396, w: 200, h: 34 };
}

/** Draw one ingredient as a little canvas still-life, centred at (cx, cy). */
export function drawIngredient(ctx, id, cx, cy, r) {
  ctx.save();
  ctx.translate(cx, cy);
  if (id === 'bun') {
    ctx.fillStyle = '#d98e3f';
    ctx.beginPath();
    ctx.arc(0, 2, r, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#e8b06a';
    ctx.fillRect(-r, 0, r * 2, r * 0.35);
    ctx.fillStyle = '#fff3d6';
    for (const [dx, dy] of [[-r * 0.4, -r * 0.5], [0, -r * 0.65], [r * 0.4, -r * 0.5]]) {
      ctx.beginPath();
      ctx.ellipse(dx, dy, r * 0.1, r * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'patty') {
    ctx.fillStyle = '#6e3f22';
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8a5232';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.1, r * 0.8, r * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'lettuce') {
    ctx.fillStyle = '#4d8f3e';
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.arc(i * r * 0.55, r * 0.1, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#7fbf5a';
    ctx.beginPath();
    ctx.arc(0, -r * 0.1, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'tomato') {
    ctx.fillStyle = '#c93a32';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e86a5a';
    ctx.beginPath();
    ctx.arc(-r * 0.25, -r * 0.25, r * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4d8f3e';
    ctx.fillRect(-r * 0.12, -r * 1.05, r * 0.24, r * 0.3);
  } else if (id === 'cheese') {
    ctx.fillStyle = '#f2c230';
    ctx.beginPath();
    ctx.moveTo(-r, r * 0.6);
    ctx.lineTo(r, r * 0.6);
    ctx.lineTo(0, -r * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d9a41f';
    ctx.beginPath();
    ctx.arc(-r * 0.3, r * 0.2, r * 0.12, 0, Math.PI * 2);
    ctx.arc(r * 0.25, r * 0.05, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'onion') {
    ctx.strokeStyle = '#e8d8f0';
    ctx.lineWidth = r * 0.22;
    for (const rr of [0.85, 0.55, 0.28]) {
      ctx.beginPath();
      ctx.arc(0, 0, r * rr, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.strokeStyle = '#b48ec2';
    ctx.lineWidth = r * 0.08;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
    ctx.stroke();
  } else if (id === 'egg') {
    ctx.fillStyle = '#fdf6e3';
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f6b73c';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbd96a';
    ctx.beginPath();
    ctx.arc(-r * 0.12, -r * 0.12, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'bacon') {
    ctx.fillStyle = '#a83c2a';
    ctx.beginPath();
    ctx.moveTo(-r, -r * 0.3);
    ctx.quadraticCurveTo(-r * 0.5, -r * 0.7, 0, -r * 0.3);
    ctx.quadraticCurveTo(r * 0.5, r * 0.1, r, -r * 0.3);
    ctx.lineTo(r, r * 0.3);
    ctx.quadraticCurveTo(r * 0.5, r * 0.7, 0, r * 0.3);
    ctx.quadraticCurveTo(-r * 0.5, -r * 0.1, -r, r * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e8a08a';
    ctx.fillRect(-r * 0.8, -r * 0.12, r * 1.6, r * 0.24);
  }
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, str, x, y, size, color, weight = '700', align = 'left') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function drawTopBar(ctx, game) {
  const b = LAYOUT.topBar;
  ctx.fillStyle = '#3a2a18';
  ctx.fillRect(b.x, b.y, b.w, b.h);
  text(ctx, '🍳 SIZZLE & SERVE', 20, 32, 26, '#ffd98a');
  const low = game.timeLeft <= 30;
  text(ctx, `⏱ ${formatTime(game.timeLeft)}`, CANVAS_WIDTH / 2, 32, 30, low ? '#ff6b5e' : '#ffffff', '800', 'center');
  text(ctx, `SCORE ${game.score}`, CANVAS_WIDTH - 330, 22, 18, '#ffd98a');
  text(ctx, `🪙 ${game.coins}   🔥 x${(1 + Math.min(game.combo, 5) * 0.1).toFixed(1)}`, CANVAS_WIDTH - 330, 46, 18, '#ffffff');
}

function drawTicket(ctx, order, x, y, w, h, now) {
  ctx.fillStyle = PALETTE.ticket;
  roundRect(ctx, x, y, w, h, 8);
  ctx.fill();
  ctx.strokeStyle = PALETTE.ticketEdge;
  ctx.lineWidth = 2;
  ctx.stroke();
  text(ctx, `#${order.id}  ${order.recipe.name}`, x + 12, y + 20, 16, PALETTE.boardInk);
  const have = {};
  for (const item of order.recipe.needs) have[item] = (have[item] || 0) + 1;
  let ix = x + 14;
  for (const id of Object.keys(have)) {
    drawIngredient(ctx, id, ix + 16, y + 52, 14);
    if (have[id] > 1) text(ctx, `x${have[id]}`, ix + 30, y + 56, 13, PALETTE.boardInk, '800');
    ix += 48;
  }
  const frac = Math.max(0, order.patience / 48);
  ctx.fillStyle = '#e5d9b8';
  ctx.fillRect(x + 12, y + h - 18, w - 24, 8);
  ctx.fillStyle = frac > 0.5 ? PALETTE.good : frac > 0.25 ? PALETTE.gold : PALETTE.danger;
  ctx.fillRect(x + 12, y + h - 18, (w - 24) * frac, 8);
  text(ctx, `🪙 ${order.recipe.coins}+`, x + w - 14, y + 20, 15, PALETTE.gold, '800', 'right');
}

function drawOrderBoard(ctx, game) {
  const b = LAYOUT.board;
  ctx.fillStyle = PALETTE.board;
  roundRect(ctx, b.x, b.y, b.w, b.h, 10);
  ctx.fill();
  ctx.strokeStyle = '#c9a86a';
  ctx.lineWidth = 2;
  ctx.stroke();
  text(ctx, 'ORDER BOARD', b.x + 14, b.y + 22, 17, PALETTE.boardInk);
  if (game.board.orders.length === 0) {
    text(ctx, 'No orders yet —', b.x + 14, b.y + 60, 15, '#8a7a5c', '400');
    text(ctx, 'the lunch rush is coming!', b.x + 14, b.y + 82, 15, '#8a7a5c', '400');
  }
  game.board.orders.forEach((order, i) => {
    drawTicket(ctx, order, b.x + 10, b.y + 40 + i * 100, b.w - 20, 92, game.now);
  });
}

function drawCounter(ctx, game) {
  const b = LAYOUT.counter;
  ctx.fillStyle = PALETTE.counterTop;
  roundRect(ctx, b.x, b.y, b.w, b.h, 10);
  ctx.fill();
  ctx.fillStyle = PALETTE.counterFront;
  ctx.fillRect(b.x, b.y + b.h - 18, b.w, 18);
  text(ctx, 'INGREDIENTS — click to add to the plate', b.x + 14, b.y - 12, 14, '#8a7a5c', '400');
  INGREDIENT_ORDER.forEach((id, i) => {
    const r = binRect(i);
    const def = INGREDIENTS[id];
    ctx.fillStyle = '#fbf3dd';
    roundRect(ctx, r.x, r.y, r.w, r.h, 8);
    ctx.fill();
    ctx.strokeStyle = '#d9c48a';
    ctx.lineWidth = 2;
    ctx.stroke();
    drawIngredient(ctx, id, r.x + 34, r.y + 40, 26);
    text(ctx, def.label, r.x + 70, r.y + 30, 16, PALETTE.boardInk);
    text(ctx, def.prep === 'ready' ? 'ready' : def.prep === 'grill' ? 'needs grill' : 'needs chop', r.x + 70, r.y + 54, 12, '#8a7a5c', '400');
    ctx.fillStyle = '#c9b48a';
    ctx.beginPath();
    ctx.arc(r.x + r.w - 16, r.y + 16, 11, 0, Math.PI * 2);
    ctx.fill();
    text(ctx, def.key, r.x + r.w - 16, r.y + 17, 12, '#fff', '800', 'center');
  });
}

function drawGrill(ctx, game) {
  const b = LAYOUT.grill;
  ctx.fillStyle = '#3d3a38';
  roundRect(ctx, b.x, b.y, b.w, b.h, 10);
  ctx.fill();
  text(ctx, '🔥 GRILL', b.x + 16, b.y + 24, 17, '#ffb37a');
  game.kitchen.grill.forEach((slot, i) => {
    const r = grillSlotRect(i);
    ctx.fillStyle = '#22201e';
    roundRect(ctx, r.x, r.y, r.w, r.h, 8);
    ctx.fill();
    ctx.strokeStyle = '#55504a';
    ctx.lineWidth = 2;
    for (let g = 1; g <= 3; g += 1) {
      ctx.beginPath();
      ctx.moveTo(r.x + 8, r.y + (g * r.h) / 4);
      ctx.lineTo(r.x + r.w - 8, r.y + (g * r.h) / 4);
      ctx.stroke();
    }
    if (slot) {
      drawIngredient(ctx, slot.id, r.x + r.w / 2, r.y + r.h / 2 - 6, 30);
      const frac = slot.state === 'ready' ? 1 : Math.min(1, Math.max(0, (game.now - slot.startedAt) / 6));
      const burnFrac = slot.state === 'ready' ? Math.min(1, (game.now - slot.doneAt) / 5) : 0;
      ctx.fillStyle = '#e5d9b8';
      ctx.fillRect(r.x + 10, r.y + r.h - 16, r.w - 20, 7);
      ctx.fillStyle = slot.state === 'ready' ? (burnFrac > 0.6 ? PALETTE.danger : PALETTE.good) : PALETTE.gold;
      ctx.fillRect(r.x + 10, r.y + r.h - 16, (r.w - 20) * frac, 7);
      text(ctx, slot.state === 'ready' ? (burnFrac > 0.6 ? 'BURNING! click!' : 'READY — click!') : 'sizzling…', r.x + r.w / 2, r.y + r.h - 32, 12, '#fff', '700', 'center');
    } else {
      text(ctx, 'empty', r.x + r.w / 2, r.y + r.h / 2, 14, '#7a756e', '400', 'center');
    }
  });
}

function drawChopping(ctx, game) {
  const b = LAYOUT.chopping;
  ctx.fillStyle = '#a9805a';
  roundRect(ctx, b.x, b.y, b.w, b.h, 10);
  ctx.fill();
  text(ctx, '🔪 CHOPPING BOARD', b.x + 16, b.y + 24, 17, '#fff3d6');
  game.kitchen.board.forEach((slot, i) => {
    const r = chopSlotRect(i);
    ctx.fillStyle = '#e8c99a';
    roundRect(ctx, r.x, r.y, r.w, r.h, 8);
    ctx.fill();
    ctx.strokeStyle = '#b98d5f';
    ctx.lineWidth = 2;
    ctx.stroke();
    if (slot) {
      drawIngredient(ctx, slot.id, r.x + r.w / 2, r.y + r.h / 2 - 8, 28);
      for (let c = 0; c < slot.chopsNeeded; c += 1) {
        ctx.fillStyle = c < slot.chops ? PALETTE.good : '#d9c8a8';
        ctx.beginPath();
        ctx.arc(r.x + 34 + c * 28, r.y + r.h - 14, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      text(ctx, 'click to chop!', r.x + r.w / 2, r.y + r.h - 32, 12, PALETTE.boardInk, '700', 'center');
    } else {
      text(ctx, 'empty', r.x + r.w / 2, r.y + r.h / 2, 14, '#8a6a4a', '400', 'center');
    }
  });
}

function drawPlating(ctx, game) {
  const b = LAYOUT.plating;
  ctx.fillStyle = PALETTE.board;
  roundRect(ctx, b.x, b.y, b.w, b.h, 10);
  ctx.fill();
  ctx.strokeStyle = '#c9a86a';
  ctx.lineWidth = 2;
  ctx.stroke();
  text(ctx, 'YOUR PLATE', b.x + 14, b.y + 22, 17, PALETTE.boardInk);
  const cx = b.x + b.w / 2;
  const cy = b.y + 150;
  ctx.fillStyle = PALETTE.plate;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 110, 78, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d9d2c2';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(cx, cy, 78, 52, 0, 0, Math.PI * 2);
  ctx.stroke();
  const plate = game.kitchen.plate;
  if (plate.length === 0) {
    text(ctx, 'empty plate', cx, cy, 15, '#a89a7c', '400', 'center');
  } else {
    const stack = plate.slice(-5);
    stack.forEach((item, i) => {
      const y = cy + 34 - i * 22;
      drawIngredient(ctx, item.id, cx, y, 26);
    });
    if (plate.length > 5) text(ctx, `+${plate.length - 5} more`, cx, cy - 58, 13, PALETTE.boardInk, '700', 'center');
  }
  const serve = serveButtonRect();
  const enabled = plate.length > 0;
  ctx.fillStyle = enabled ? PALETTE.good : '#b9b2a2';
  roundRect(ctx, serve.x, serve.y, serve.w, serve.h, 10);
  ctx.fill();
  text(ctx, '🍽 SERVE  [Space]', serve.x + serve.w / 2, serve.y + serve.h / 2 + 1, 20, '#fff', '800', 'center');
  const clear = clearButtonRect();
  ctx.fillStyle = '#e8e0cc';
  roundRect(ctx, clear.x, clear.y, clear.w, clear.h, 8);
  ctx.fill();
  text(ctx, 'Clear plate', clear.x + clear.w / 2, clear.y + clear.h / 2 + 1, 14, PALETTE.boardInk, '700', 'center');
  text(ctx, 'Serve the plate that', b.x + 14, b.y + 300, 13, '#8a7a5c', '400');
  text(ctx, 'matches an open ticket.', b.x + 14, b.y + 318, 13, '#8a7a5c', '400');
}

function drawHelp(ctx) {
  const b = LAYOUT.help;
  ctx.fillStyle = '#3a2a18';
  ctx.fillRect(b.x, b.y, b.w, b.h);
  text(ctx, 'Click ingredients to build a dish  •  1–8 pick a bin  •  Space serves  •  P pauses  •  R restarts', 20, b.y + 20, 14, '#ffd98a', '400');
}

function drawToast(ctx, game) {
  if (!game.toast || game.now - game.toast.at > 2.2) return;
  const alpha = Math.min(1, (2.2 - (game.now - game.toast.at)) / 0.6);
  ctx.save();
  ctx.globalAlpha = alpha;
  text(ctx, game.toast.text, CANVAS_WIDTH / 2, 700, 30, game.toast.good ? PALETTE.good : PALETTE.danger, '800', 'center');
  ctx.restore();
}

function drawTitle(ctx, game) {
  ctx.fillStyle = PALETTE.wall;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  text(ctx, '🍳', CANVAS_WIDTH / 2, 190, 110, '#000', '400', 'center');
  text(ctx, 'SIZZLE & SERVE', CANVAS_WIDTH / 2, 300, 64, PALETTE.boardInk, '800', 'center');
  text(ctx, 'Run the tiniest, busiest street-food stall in town.', CANVAS_WIDTH / 2, 356, 22, '#6a5638', '400', 'center');
  text(ctx, 'Tickets come in. Chop it, grill it, stack it, serve it — before the patience runs out.', CANVAS_WIDTH / 2, 388, 22, '#6a5638', '400', 'center');
  ctx.fillStyle = PALETTE.good;
  roundRect(ctx, CANVAS_WIDTH / 2 - 150, 440, 300, 64, 12);
  ctx.fill();
  text(ctx, 'START SHIFT  [Enter]', CANVAS_WIDTH / 2, 473, 24, '#fff', '800', 'center');
  text(ctx, 'Mouse to cook  •  1–8 pick ingredients  •  Space serves  •  3-minute shift', CANVAS_WIDTH / 2, 560, 16, '#8a7a5c', '400', 'center');
  text(ctx, `Best shift so far: ${game.best.score} pts · ${game.best.served} dishes served`, CANVAS_WIDTH / 2, 596, 16, '#8a7a5c', '400', 'center');
}

function drawGameOver(ctx, game) {
  ctx.fillStyle = 'rgba(43,33,24,0.82)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  text(ctx, 'SHIFT OVER!', CANVAS_WIDTH / 2, 260, 56, '#ffd98a', '800', 'center');
  text(ctx, `You served ${game.served} dishes and earned ${game.coins} coins.`, CANVAS_WIDTH / 2, 330, 24, '#fff', '400', 'center');
  text(ctx, `Score ${game.score}  •  Best combo x${(1 + game.bestCombo * 0.1).toFixed(1)}  •  ${game.trash} items binned`, CANVAS_WIDTH / 2, 372, 20, '#fff', '400', 'center');
  ctx.fillStyle = PALETTE.good;
  roundRect(ctx, CANVAS_WIDTH / 2 - 150, 430, 300, 64, 12);
  ctx.fill();
  text(ctx, 'COOK AGAIN  [R]', CANVAS_WIDTH / 2, 463, 24, '#fff', '800', 'center');
}

function drawPause(ctx) {
  ctx.fillStyle = 'rgba(43,33,24,0.6)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  text(ctx, 'PAUSED — press P to keep cooking', CANVAS_WIDTH / 2, 400, 30, '#fff', '800', 'center');
}

/** Draw the whole game for the current screen. */
export function render(ctx, game) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  if (game.screen === 'title') {
    drawTitle(ctx, game);
    return;
  }
  ctx.fillStyle = PALETTE.wall;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = PALETTE.wallShadow;
  ctx.fillRect(0, 64, CANVAS_WIDTH, 8);
  drawTopBar(ctx, game);
  drawOrderBoard(ctx, game);
  drawCounter(ctx, game);
  drawGrill(ctx, game);
  drawChopping(ctx, game);
  drawPlating(ctx, game);
  drawHelp(ctx);
  drawToast(ctx, game);
  if (game.screen === 'over') drawGameOver(ctx, game);
  if (game.screen === 'paused') drawPause(ctx);
}
