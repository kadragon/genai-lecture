// Ch.3 AlphaGo: a stone, branches exploding past the universe, then pruned to three.
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const BX = 960, BY = 500;            // board centre
  const CELL = 30, LINES = 19, HALF = CELL * (LINES - 1) / 2;
  // First move on the lower-left star point (4-4), where real games open.
  const CX = BX - HALF + 3 * CELL, CY = BY + HALF - 3 * CELL;
  // Branches fan from the corner into the board only: 0° (right) to -90° (up).
  // Every level is clamped to that quadrant, and the three lengths sum to the board span.
  const FAN = 90, SPREAD = 36, LEN = [190, 150, 110];
  const inBoard = (deg) => Math.max(-88, Math.min(-2, deg));
  const CHOSEN = [1, 4, 6];            // level-1 branches that survive pruning: low, diagonal, steep
  const CHOSEN_CHILD = 1;              // which level-2 child continues each chain
  const CHIP_W = 124, CHIP_H = 56;     // keep in sync with .chip in deck.css

  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent && parent.appendChild(n);
    return n;
  };

  const rng = Stepper.rng(7);
  const jitter = (d) => (rng() * 2 - 1) * d;

  let refs;

  const setup = (section) => {
    const svg = section.querySelector('svg.stage');

    const space = el('rect', { x: 0, y: 0, width: 1920, height: 1080, class: 'space' }, svg);
    const stars = el('g', { class: 'stars' }, svg);
    for (let i = 0; i < 220; i++) {
      el('circle', { cx: rng() * 1920, cy: rng() * 1080, r: rng() * 1.8 + 0.4 }, stars);
    }

    const board = el('g', { class: 'board' }, svg);
    el('rect', { x: BX - HALF - 24, y: BY - HALF - 24, width: HALF * 2 + 48, height: HALF * 2 + 48, rx: 2, class: 'board-bg' }, board);
    for (let i = 0; i < LINES; i++) {
      const o = -HALF + i * CELL;
      el('line', { x1: BX - HALF, y1: BY + o, x2: BX + HALF, y2: BY + o }, board);
      el('line', { x1: BX + o, y1: BY - HALF, x2: BX + o, y2: BY + HALF }, board);
    }
    [3, 9, 15].forEach((i) => [3, 9, 15].forEach((j) => {
      el('circle', { cx: BX - HALF + i * CELL, cy: BY - HALF + j * CELL, r: 4, class: 'hoshi' }, board);
    }));

    // Scaled as an HTML layer: Motion overrides transform-origin on SVG elements.
    const treeLayer = section.querySelector('.tree-layer');
    treeLayer.style.transformOrigin = `${CX}px ${CY}px`;
    Object.assign(section.querySelector('.go-circle').style, { left: `${CX}px`, top: `${CY}px` });
    const tree = el('g', {}, treeLayer.querySelector('svg'));
    const levels = [[], [], []];
    const branch = (x0, y0, angleDeg, len, level) => {
      const a = (angleDeg * Math.PI) / 180;
      const x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len;
      const bend = jitter(len * 0.18);
      const mx = (x0 + x1) / 2 - Math.sin(a) * bend, my = (y0 + y1) / 2 + Math.cos(a) * bend;
      const path = el('path', { d: `M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}`, pathLength: 1, class: `branch l${level}` }, tree);
      const node = { path, x1, y1, angleDeg, children: [] };
      levels[level].push(node);
      return node;
    };
    for (let i = 0; i < 8; i++) {
      const b1 = branch(CX, CY, inBoard(-i * FAN / 7 + jitter(3)), LEN[0], 0);
      for (let j = 0; j < 4; j++) {
        const b2 = branch(b1.x1, b1.y1, inBoard(b1.angleDeg - SPREAD + j * (SPREAD * 2 / 3) + jitter(4)), LEN[1], 1);
        b1.children.push(b2);
        for (let k = 0; k < 3; k++) branch(b2.x1, b2.y1, inBoard(b2.angleDeg - SPREAD + k * SPREAD + jitter(4)), LEN[2], 2);
      }
    }
    el('circle', { cx: CX, cy: CY, r: 13, class: 'stone' }, tree);

    const chains = CHOSEN.map((i) => [levels[0][i], levels[0][i].children[CHOSEN_CHILD]]);
    // Auto-animate diffs offsetLeft/Top, so the chip itself sits in slide coordinates.
    // Motion fades the static anchor around it and never touches the chip.
    const anchors = [...section.querySelectorAll('.chip-anchor')];
    anchors.forEach((a, i) => {
      const end = chains[i][1], chip = a.firstElementChild;
      chip.style.left = `${end.x1 - CHIP_W / 2}px`;
      chip.style.top = `${end.y1 - CHIP_H / 2}px`;
    });

    const chainPaths = chains.flat().map((n) => n.path);
    refs = {
      space, stars, board, treeLayer, anchors,
      l1: levels[0].map((n) => n.path),
      l2: levels[1].map((n) => n.path),
      l3: levels[2].map((n) => n.path),
      chainPaths,
      restPaths: [...tree.querySelectorAll('path')].filter((p) => !chainPaths.includes(p)),
      overlay: section.querySelector('.scale-overlay'),
      goCircle: section.querySelector('.go-circle'),
    };
  };

  const render = (step, instant) => {
    const { go } = Stepper;
    const r = refs;
    const draw = (paths, on, opts) => go(paths, { strokeDashoffset: on ? 0 : 1 }, instant, opts);

    draw(r.l1, step >= 1, { duration: 0.6, delay: instant ? 0 : Motion.stagger(0.05) });
    draw(r.l2, step >= 2, { duration: 0.5, delay: instant ? 0 : Motion.stagger(0.012) });
    draw(r.l3, step >= 2, { duration: 0.5, delay: instant ? 0 : Motion.stagger(0.006, { startDelay: 0.4 }) });

    const exploded = step === 2 || step === 3;
    go(r.treeLayer, { scale: exploded ? 1.9 : 1, opacity: step === 3 ? 0.25 : 1 }, instant, { duration: 1.4 });
    go(r.board, { opacity: exploded ? 0.12 : step === 4 ? 0.35 : 1 }, instant);
    go(r.space, { opacity: exploded ? 1 : 0 }, instant, { duration: 1.2 });
    go(r.stars, { opacity: exploded ? 1 : 0 }, instant, { duration: 1.6 });

    go(r.overlay, { opacity: step === 3 ? 1 : 0 }, instant);
    go(r.goCircle, { scale: step === 3 ? 1 : 0 }, instant, { duration: 1.6, delay: instant ? 0 : 0.6 });

    const pruned = step === 4;
    go(r.restPaths, { opacity: pruned ? 0.07 : 0.55 }, instant, { duration: 1 });
    go(r.chainPaths, { opacity: pruned ? 1 : 0.55, stroke: pruned ? 'var(--accent)' : 'var(--muted)' }, instant, { duration: 1 });
    go(r.anchors, { opacity: pruned ? 1 : 0 }, instant, { delay: instant || !pruned ? 0 : Motion.stagger(0.15, { startDelay: 0.6 }) });

  };

  Stepper.register('alphago', { steps: 5, setup, render });
})();
