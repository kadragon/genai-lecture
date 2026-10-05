// Ch.1 MNIST: toy 3x3 digits a person can write a rule for, real samples
// (assets/mnist/*, 28x28 from the MNIST test set) that break the rule, a
// learning loop that marks one card wrong then fixes it, and the pile
// growing into a 70k heap whose compute bridges into GPU.
(() => {
  // Step 0 toy digits: '#' = white stroke, '.' = black.
  const TINY = [['0', '####.####'], ['1', '.#..#..#.']];
  const ZEROS = ['0-60003', '0-60013', '0-60025', '0-60028', '0-60055', '0-60069'];
  const ONES = ['1-60002', '1-60005', '1-60014', '1-60029', '1-60037', '1-60039'];
  // 4-column pile: two columns of 0s, then two of 1s, per row.
  const PILE = ZEROS.flatMap((z, i) => (i % 2 ? [] : [z, ZEROS[i + 1], ONES[i], ONES[i + 1]]));
  // The loop: the curly 0 (0-60025) is guessed wrong then fixed, then two more.
  const QUIZ = [4, 2, 9];
  const HEAP = 22 * 9;
  const ALL = ['0-60010', '1-60031', '7-60000', '7-60017', ...ZEROS, ...ONES];

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
      m.className = 'mini';
      const img = document.createElement('img');
      img.className = 'mini-photo';
      img.src = `assets/mnist/${f}.png`;
      img.alt = `손글씨 ${f[0]} — MNIST 실제 샘플`;
      const tag = document.createElement('span');
      tag.className = 'mini-label';
      tag.textContent = f[0];
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
        mark(0, '✗', false);
        push(go(r.quizCards[0], { x: [0, -8, 8, -5, 5, 0] }, false, { duration: 0.4 }));
      });
      at(2000, () => mark(0, '✓', true));
      at(2600, () => mark(1, '✓', true));
      at(3100, () => mark(2, '✓', true));
    } else if (step >= 2) {
      r.verdicts.forEach((s) => { s.textContent = '✓'; s.classList.add('good'); });
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
