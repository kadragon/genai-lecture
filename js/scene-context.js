// Ch.8 context: the conversation scroll grows, is re-read from the top on every
// answer, blurs in the middle, and is finally rolled into a one-page summary.
(() => {
  const LINES = 18;
  const MIDDLE = [6, 7, 8, 9, 10, 11];

  let r;

  const setup = (section) => {
    const paper = section.querySelector('.paper');
    const rng = Stepper.rng(9);
    const lines = Array.from({ length: LINES }, (_, i) => {
      const l = document.createElement('div');
      l.className = `line-msg${i % 2 ? ' me' : ''}`;
      l.style.width = `${(i % 2 ? 40 : 55) + rng() * 30}%`;
      paper.append(l);
      return l;
    });
    r = {
      wrap: section.querySelector('.scroll-wrap'),
      paper, lines,
      scan: section.querySelector('.scan'),
      fill: section.querySelector('.meter .track i'),
      coins: [...section.querySelectorAll('.coinrow span')],
      curve: section.querySelector('.ucurve .curve'),
    };
  };

  const render = (step, instant) => {
    const { go } = Stepper;
    const late = (d) => (instant ? 0 : d);

    go(r.paper, { height: step >= 1 ? '590px' : '220px' }, instant, { duration: 1.2 });
    if (step === 1 && !instant) {
      go(r.scan, { y: [-120, 590], opacity: [0, 1, 1, 0] }, false, { duration: 2.2, delay: 1.2, ease: 'linear' });
    } else {
      go(r.scan, { opacity: 0 }, true);
    }
    go(r.fill, { width: step >= 1 ? '92%' : '12%' }, instant, { duration: 2.2, delay: late(1.2), ease: 'linear' });
    r.coins.forEach((c, i) => go(c, { opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.4 }, instant, { duration: 0.3, delay: late(step >= 1 ? 1.4 + i * 0.3 : 0) }));

    const blurred = step >= 2;
    MIDDLE.forEach((i) => go(r.lines[i], { opacity: blurred ? 0.15 : 1, filter: blurred ? 'blur(4px)' : 'blur(0px)' }, instant, { duration: 1.2, delay: late(blurred ? 0.3 : 0) }));
    go(r.curve, { strokeDashoffset: step === 2 ? 0 : 1 }, instant, { duration: 1.6, delay: late(0.6), ease: 'easeInOut' });

    go(r.wrap, { opacity: step >= 3 ? 0.12 : 1 }, instant, { duration: 0.8 });
  };

  Stepper.register('context', { steps: 4, setup, render });
})();
