# Sizzle & Serve — Make the best cooking game

[![make.fun](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![Rank](https://make.fun/badge/best-cooking-game-20261125-0137/lindltaylor55-hash/best-cooking-game-20261125-0137/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![Reward](https://make.fun/badge/best-cooking-game-20261125-0137/lindltaylor55-hash/best-cooking-game-20261125-0137/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137)

A tiny street-food stall kitchen game for the [make.fun best cooking game bounty](https://make.fun/bounty/best-cooking-game-20261125-0137). You are the only cook in a three-minute lunch shift: tickets land on the order board with a patience clock, and you chop, grill, stack and serve before they walk out.

## How to play

- **Click an ingredient** on the counter to add it to your plate. Buns and cheese go straight on; patties, eggs and bacon need the grill; lettuce, tomato and onion need the chopping board (three clicks each).
- **Grill carefully** — a patty is ready after 6 seconds and burns if you leave it. Click a cooked item to take it off; a burnt one goes in the bin.
- **Serve** the plate that matches an open ticket (Space or the SERVE button) for coins plus a tip for the patience left on the clock. A plate with no matching ticket goes to a walk-in for 1 coin.
- Orders get faster and fancier as the shift wears on, and a streak of good serves multiplies your coins.

Controls: mouse to cook · `1–8` pick an ingredient bin · `Space` serves · `P` pauses · `R` restarts · `Enter` starts the shift.

## Run it locally

```sh
node serve.ts
# open http://localhost:8080
```

The game is plain static files under `game/` — no build step, no network request, all art drawn on canvas, all sounds synthesised with WebAudio.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `game/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.
