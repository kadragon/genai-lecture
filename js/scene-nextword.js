// Ch.4 next-word prediction: the three surviving branches arrive as candidate bars,
// the audience guesses, bars fill, and the winner is typed into the sentence
// behind the caret, the way a model emits its next token.
(() => {
  let refs;

  const setup = (section) => {
    const cands = [...section.querySelectorAll('.cand')];
    refs = {
      fills: cands.map((c) => c.querySelector('.fill')),
      labels: cands.flatMap((c) => [...c.querySelectorAll('.word, .pct')]),
      slot: section.querySelector('.slot'),
      slotWord: section.querySelector('.slot-word'),
    };
  };

  const render = (step, instant) => {
    const { go } = Stepper;
    const r = refs;

    r.fills.forEach((f) => go(f, { width: step >= 1 ? `${f.dataset.p}%` : '0%' }, instant, {
      duration: 1.1, delay: instant || step < 1 ? 0 : 0.1 + Number(f.dataset.i) * 0.2,
    }));
    go(r.labels, { opacity: step >= 1 ? 1 : 0 }, instant, { delay: instant || step < 1 ? 0 : 0.5 });

    // The slot clips the word, so widening it reveals the word left to right
    // and pushes the caret along like typing.
    const placed = step >= 2;
    go(r.fills.slice(1), { opacity: placed ? 0.3 : 1 }, instant);
    go(r.slotWord, { opacity: placed ? 1 : 0 }, true);
    go(r.slot, { width: placed ? `${r.slotWord.offsetWidth}px` : '0px' }, instant, { duration: placed ? 0.7 : 0.2, ease: 'linear', delay: instant || !placed ? 0 : 0.15 });
  };

  Stepper.register('nextword', { steps: 3, setup, render });
})();
