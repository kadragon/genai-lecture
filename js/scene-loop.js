// Ch.14 so, how: the four-step loop fills a quarter per step, then keeps turning.
(() => {
  let r;
  const setup = (section) => { r = { arc: section.querySelector('.loop .arc') }; };
  const render = (step, instant) => {
    Stepper.go(r.arc, { strokeDashoffset: 1 - Math.min(step, 4) * 0.25 }, instant, { duration: 0.9, ease: 'easeInOut' });
  };
  Stepper.register('loop', { steps: 5, setup, render });
})();
