// Ch.17 privacy: sensitive fields blink red, get masked, and only then go through the inside door.
(() => {
  let r;
  const setup = (section) => { r = { doc: section.querySelector('.pdoc-wrap') }; };
  const render = (step, instant) => {
    const through = step >= 2;
    Stepper.go(r.doc, through ? { x: 630, y: 300, scale: 0.5 } : { x: 0, y: 0, scale: 1 }, instant, { duration: 1.1, ease: 'easeInOut' });
  };
  Stepper.register('privacy', { steps: 3, setup, render });
})();
