// Ch.20 closing: the cursor that ran through the talk hops over to the audience.
(() => {
  let r;
  const setup = (section) => {
    r = {
      cur: section.querySelector('.cursor-fly'),
      box: section.querySelector('.closing'),
      text: section.querySelector('.closing span'),
      person: section.querySelector('.avatar'),
    };
  };
  const render = (step, instant) => {
    // Park the caret after the text; measured here because fonts settle after setup.
    const x0 = r.box.offsetLeft + r.text.offsetLeft + r.text.offsetWidth + 24;
    const y0 = r.box.offsetTop + 12;
    r.cur.style.left = `${x0}px`;
    r.cur.style.top = `${y0}px`;
    const dx = parseFloat(r.person.style.left) - 60 - x0;
    const dy = parseFloat(r.person.style.top) + 40 - y0;
    Stepper.go(r.cur, step >= 1 ? { x: [0, dx / 2, dx], y: [0, -60, dy] } : { x: 0, y: 0 }, instant, { duration: 1, ease: 'easeInOut' });
  };
  Stepper.register('closing', { steps: 2, setup, render });
})();
