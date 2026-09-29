// Ch.4 model: a library pours through a funnel and becomes a panel of tuned knobs.
(() => {
  const PALETTE = ['#16171a', '#5b5d63', '#a9a59b', '#3f4147', '#cfcabe', '#7c7d82', '#2a2b2f'];
  const SHELF = 340;          // books stand on this y
  const MOUTH = { x: 960, y: 450 };

  // Shared with ch.5, whose panel must show the same trained knobs after the morph.
  window.knobAngles = (n) => {
    const rng = Stepper.rng(11);
    return Array.from({ length: n }, () => Math.round(rng() * 300 - 150));
  };

  let r;

  const setup = (section) => {
    const rng = Stepper.rng(5);
    const books = [];
    for (let x = 180; x < 1720;) {
      const w = 30 + rng() * 18, h = 110 + rng() * 70;
      const b = document.createElement('div');
      b.className = 'book';
      Object.assign(b.style, { left: `${x}px`, top: `${SHELF - h}px`, width: `${w}px`, height: `${h}px`, background: PALETTE[books.length % PALETTE.length] });
      section.append(b);
      books.push({ el: b, dx: MOUTH.x - (x + w / 2), dy: MOUTH.y - (SHELF - h / 2) });
      x += w + 6;
    }
    const panel = section.querySelector('.panel');
    const angles = window.knobAngles(48);
    const knobs = angles.map(() => {
      const k = document.createElement('div');
      k.className = 'knob';
      panel.append(k);
      return k;
    });
    r = { books, knobs, angles };
  };

  const render = (step, instant) => {
    const { go } = Stepper;
    const poured = step >= 1;
    r.books.forEach((b, i) => go(b.el, poured
      ? { x: b.dx, y: b.dy, scale: 0.15, opacity: 0 }
      : { x: 0, y: 0, scale: 1, opacity: 1 }, instant, { duration: 0.9, delay: instant || !poured ? 0 : i * 0.035, ease: 'easeIn' }));
    r.knobs.forEach((k, i) => go(k, { rotate: poured ? r.angles[i] : 0 }, instant, {
      duration: 0.6, delay: instant || !poured ? 0 : 1.2 + i * 0.03,
    }));
  };

  Stepper.register('model', { steps: 3, setup, render });
})();
