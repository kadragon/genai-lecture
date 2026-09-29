// Ch.13 translationese: plain sentences first (audience judges), then the
// English-shaped mold is revealed; a researched
// guideline melts the mold, then is filed away as an agent.
(() => {
  let r;
  const setup = (section) => { r = { guide: section.querySelector('.guide-wrap') }; };
  const render = (step, instant) => {
    const filed = step >= 4;
    Stepper.go(r.guide, filed ? { x: 40, y: 390, scale: 0.3, opacity: 0 } : { x: 0, y: 0, scale: 1, opacity: 1 }, instant, { duration: 1, ease: 'easeInOut' });
  };
  Stepper.register('mold', { steps: 5, setup, render });
})();
