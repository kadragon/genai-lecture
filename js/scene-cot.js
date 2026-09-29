// Ch.7 chain-of-thought: a direct shot misses, a dart climbing stairs hits.
(() => {
  const START = [60, 500];
  const MISS = [700, 262];
  const STAIRS = [[60, 500], [190, 500], [190, 410], [320, 410], [320, 320], [450, 320], [450, 230], [560, 230], [640, 150]];

  let r;

  const setup = (section) => {
    const q = (s) => section.querySelector(s);
    q('.duel.left .direct').setAttribute('d', `M${START} L${MISS}`);
    q('.duel.right .stairs').setAttribute('d', 'M' + STAIRS.map((p) => p.join(' ')).join(' L'));
    r = {
      direct: q('.duel.left .direct'), stairs: q('.duel.right .stairs'),
      dartL: q('.duel.left .dart'), dartR: q('.duel.right .dart'),
    };
    Stepper.go([r.dartL, r.dartR], { x: START[0], y: START[1] }, true);
  };

  const render = (step, instant) => {
    const { go } = Stepper;
    const late = (d) => (instant ? 0 : d);

    go(r.direct, { strokeDashoffset: step >= 1 ? 0 : 1 }, instant, { duration: 0.7, ease: 'easeIn' });
    go(r.dartL, step >= 1 ? { x: MISS[0], y: MISS[1] } : { x: START[0], y: START[1] }, instant, { duration: 0.7, ease: 'easeIn' });

    go(r.stairs, { strokeDashoffset: step >= 2 ? 0 : 1 }, instant, { duration: 1.2, ease: 'linear' });
    go(r.dartR, step >= 2
      ? { x: STAIRS.map((p) => p[0]), y: STAIRS.map((p) => p[1]) }
      : { x: START[0], y: START[1] }, instant, { duration: 2.2, delay: late(step >= 2 ? 1.2 : 0), ease: 'easeInOut' });
  };

  Stepper.register('cot', { steps: 3, setup, render });
})();
