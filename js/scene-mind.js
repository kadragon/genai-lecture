// Ch.12 mindset: the idle assistant asks back, then takes the pen.
(() => {
  let r;
  const setup = (section) => { r = { pen: section.querySelector('.pen-wrap') }; };
  const render = (step, instant) => {
    Stepper.go(r.pen, { x: step >= 2 ? 820 : 0, y: step >= 2 ? [0, -120, 0] : 0 }, instant, { duration: 1.2 });
  };
  Stepper.register('mind', { steps: 3, setup, render });
})();
