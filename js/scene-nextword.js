// Ch.4 next-word prediction: the three surviving branches arrive as candidate bars,
// the audience guesses, bars fill, and the winner flies into the sentence.
(() => {
  let refs;

  const setup = (section) => {
    const cands = [...section.querySelectorAll('.cand')];
    const winner = cands[0].querySelector('.word');
    refs = {
      cands,
      fills: cands.map((c) => c.querySelector('.fill')),
      labels: cands.flatMap((c) => [...c.querySelectorAll('.word, .pct')]).filter((n) => n !== winner),
      winner,
      winnerHome: cands[0].querySelector('.word-home'),
      slot: section.querySelector('.slot'),
      slotWord: section.querySelector('.slot-word'),
    };
  };

  // Offset from the winner's untransformed spot to the sentence slot, in slide px.
  const flight = () => {
    const s = Reveal.getScale();
    const from = refs.winnerHome.getBoundingClientRect();
    const to = refs.slotWord.getBoundingClientRect();
    return { x: (to.left - from.left) / s, y: (to.top - from.top) / s, scale: to.height / from.height };
  };

  const render = (step, instant) => {
    const { go } = Stepper;
    const r = refs;

    r.fills.forEach((f) => go(f, { width: step >= 1 ? `${f.dataset.p}%` : '0%' }, instant, {
      duration: 1.1, delay: instant || step < 1 ? 0 : 0.1 + Number(f.dataset.i) * 0.2,
    }));
    go(r.labels, { opacity: step >= 1 ? 1 : 0 }, instant, { delay: instant || step < 1 ? 0 : 0.5 });

    const placed = step >= 2;
    go(r.fills.slice(1), { opacity: placed ? 0.3 : 1 }, instant);
    go(r.winner, placed ? { ...flight(), opacity: 0 } : { x: 0, y: 0, scale: 1, opacity: step >= 1 ? 1 : 0 }, instant, {
      duration: 0.9, opacity: { delay: instant ? 0 : 0.85, duration: 0.15 },
    });
    go(r.slot, { width: placed ? `${r.slotWord.offsetWidth}px` : '0px' }, instant, { duration: 0.9 });
    go(r.slotWord, { opacity: placed ? 1 : 0 }, instant, { duration: 0.15, delay: instant || !placed ? 0 : 0.85 });

  };

  Stepper.register('nextword', { steps: 3, setup, render });
})();
