// Ch.11 give it the material: the rulebook lands on the desk and answers gain sources.
(() => {
  let r;
  const setup = (section) => { r = { folder: section.querySelector('.folder-wrap') }; };
  const render = (step, instant) => {
    const given = step >= 1;
    Stepper.go(r.folder, given ? { x: -520, y: -680, rotate: -4 } : { x: 0, y: 0, rotate: 0 }, instant, { duration: 1 });
  };
  Stepper.register('desk', { steps: 3, setup, render });
})();
