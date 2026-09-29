// Ch.20 closing: the cursor that ran through the talk hops over to the audience.
(() => {
  let r;
  const setup = (section) => { r = { cur: section.querySelector('.cursor-fly') }; };
  const render = (step, instant) => {
    Stepper.go(r.cur, step >= 1 ? { x: [0, -130, -260], y: [0, -80, 242] } : { x: 0, y: 0 }, instant, { duration: 1.2, ease: 'easeInOut' });
  };
  Stepper.register('closing', { steps: 2, setup, render });
})();
