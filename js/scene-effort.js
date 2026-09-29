// Ch.7 effort: a stove knob next to the real selectors; high heat climbs long stairs
// on a hard question. The easy-question cost lives on the next slide.
(() => {
  const ANGLE = { low: -60, high: 60 };
  const TICKS = [['약', -60], ['중', 0], ['강', 60]];

  let r;

  const setup = (section) => {
    const wrap = section.querySelector('.dial-wrap');
    TICKS.forEach(([text, a]) => {
      const t = document.createElement('span');
      t.className = 'dial-tick';
      t.textContent = text;
      const rad = (a * Math.PI) / 180;
      t.style.left = `${260 + 232 * Math.sin(rad)}px`;
      t.style.top = `${260 - 232 * Math.cos(rad)}px`;
      wrap.append(t);
    });
    const steps = [[20, 440]];
    for (let i = 0; i < 6; i++) {
      const [x, y] = steps[steps.length - 1];
      steps.push([x + 120, y], [x + 120, y - 66]);
    }
    const stairs = section.querySelector('.effort-area .stairs');
    stairs.setAttribute('d', 'M' + steps.map((p) => p.join(' ')).join(' L'));

    r = {
      knob: section.querySelector('.dial-knob'),
      flames: [...section.querySelectorAll('.flame i')],
      stairs,
    };
  };

  const render = (step, instant) => {
    const { go } = Stepper;
    const late = (d) => (instant ? 0 : d);
    const high = step >= 1;

    go(r.knob, { rotate: high ? ANGLE.high : ANGLE.low }, instant, { duration: 0.9 });
    r.flames.forEach((f, i) => go(f, { opacity: high || i === 2 ? 1 : 0.2, scaleY: high ? 1.25 : 0.8 }, instant, { duration: 0.5, delay: late(0.4) }));

    go(r.stairs, { strokeDashoffset: step >= 1 ? 0 : 1 }, instant, { duration: 1.4, delay: late(0.6), ease: 'linear' });
  };

  Stepper.register('effort', { steps: 2, setup, render });
})();
