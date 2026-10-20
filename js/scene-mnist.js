// Ch.1: a simple 1/7 rule, ambiguous handwriting, then learning from labels.
// MNIST images are unchanged 28x28 test samples; filenames use 60000 + test index.
(() => {
  // Step 0 toy digits: '#' = white stroke, '.' = black.
  const TINY = [['1', '.#..#..#.'], ['7', '###..#.#.']];
  const PILE = ['1-60716', '7-60017', '1-60002', '7-60000'];
  const QUIZ = [0, 1, 2];
  const HEAP = 22 * 9;
  const ALL = [...PILE, '0-60010', '0-60025', '1-60031', '1-60039'];

  let r;

  const setup = (section) => {
    const tiny = section.querySelector('.mnist-tiny');
    TINY.forEach(([digit, cells]) => {
      const fig = document.createElement('figure');
      fig.className = 'tiny';
      const grid = document.createElement('div');
      grid.className = 'tiny-grid';
      [...cells].forEach((c) => {
        const d = document.createElement('div');
        d.className = c === '#' ? 'tcell on' : 'tcell';
        grid.append(d);
      });
      const tag = document.createElement('figcaption');
      tag.className = 'mini-label';
      tag.textContent = digit;
      fig.append(grid, tag);
      tiny.append(fig);
    });

    const pile = section.querySelector('.mnist-pile');
    PILE.forEach((f) => {
      const m = document.createElement('div');
      m.className = ['1-60716', '7-60017'].includes(f) ? 'mini rule-counterexample' : 'mini';
      const img = document.createElement('img');
      img.className = 'mini-photo';
      img.src = `assets/mnist/${f}.png`;
      img.alt = `손글씨 ${f[0]} — MNIST 실제 샘플`;
      const tag = document.createElement('span');
      tag.className = 'mini-label';
      tag.textContent = `정답 ${f[0]}`;
      m.append(img, tag);
      pile.append(m);
    });

    const verdicts = QUIZ.map((k) => {
      const s = document.createElement('span');
      s.className = 'verdict';
      pile.children[k].append(s);
      return s;
    });

    const heap = section.querySelector('.mnist-heap');
    const rng = Stepper.rng(7);
    for (let i = 0; i < HEAP; i++) {
      const img = document.createElement('img');
      img.src = `assets/mnist/${ALL[Math.floor(rng() * ALL.length)]}.png`;
      img.alt = '';
      heap.append(img);
    }

    const rule = section.querySelector('.mnist-rule');
    r = {
      token: 0,
      controls: [],
      rule,
      ruleNote: rule.querySelector('em'),
      minis: [...pile.children],
      quizCards: QUIZ.map((k) => pile.children[k]),
      verdicts,
      heap: [...heap.children],
    };
  };

  // Every render bumps the token so loop beats scheduled by a previous step
  // never leak into the new one; in-flight animations are stopped too.
  const push = (anim) => { if (anim && anim.stop) r.controls.push(anim); };
  const at = (ms, fn) => {
    const t = r.token;
    setTimeout(() => { if (t === r.token) fn(); }, ms);
  };
  const mark = (k, text, good) => {
    const s = r.verdicts[k];
    s.textContent = text;
    s.classList.toggle('good', good);
    push(Stepper.go([s], { opacity: 1, scale: [0.4, 1.2, 1] }, false, { duration: 0.35 }));
  };

  const render = (step, instant) => {
    const { go } = Stepper;
    r.token += 1;
    r.controls.forEach((a) => { try { a.stop(); } catch (e) { /* already finished */ } });
    r.controls = [];

    r.rule.classList.toggle('struck', step >= 1);
    go(r.ruleNote, { opacity: step >= 1 ? 1 : 0 }, instant, { duration: 0.4, delay: instant || step !== 1 ? 0 : 1.2 });

    go(r.minis, { opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.9 }, instant, {
      delay: instant || step !== 1 ? 0 : Motion.stagger(0.05, { startDelay: 0.3 }),
    });

    r.quizCards.forEach((c) => c.classList.toggle('picked', step >= 2));
    go(r.quizCards, { x: 0 }, true);
    if (step === 2 && !instant) {
      // The loop, beat by beat: a wrong guess, the fix, then two right.
      go(r.verdicts, { opacity: 0 }, true);
      at(900, () => {
        mark(0, '7 ✗', false);
        push(go(r.quizCards[0], { x: [0, -8, 8, -5, 5, 0] }, false, { duration: 0.4 }));
      });
      at(2000, () => mark(0, '1 ✓', true));
      at(2600, () => mark(1, '7 ✓', true));
      at(3100, () => mark(2, '1 ✓', true));
    } else if (step >= 2) {
      r.verdicts.forEach((s, i) => { s.textContent = `${PILE[QUIZ[i]][0]} ✓`; s.classList.add('good'); });
      go(r.verdicts, { opacity: 1 }, true);
    } else {
      go(r.verdicts, { opacity: 0 }, true);
    }

    go(r.heap, { opacity: step >= 3 ? 1 : 0 }, instant, {
      duration: 0.2, delay: instant || step !== 3 ? 0 : Motion.stagger(0.006),
    });
  };

  Stepper.register('mnist', { steps: 4, setup, render });
})();
