// Ch.11 the AI that doesn't know us: the pin lands on the wrong campus, then the
// right one — but its calendar stops in the past.
(() => {
  const WRONG = [390, 130];   // 춘천, map-local px
  const RIGHT = [300, 330];   // 청주
  let r;
  const setup = (section) => { r = { pin: section.querySelector('.pin-wrap') }; };
  const render = (step, instant) => {
    const right = step >= 1;
    Stepper.go(r.pin, right
      ? { x: RIGHT[0] - WRONG[0], y: [0, -80, RIGHT[1] - WRONG[1]] }
      : { x: 0, y: 0 }, instant, { duration: 1.1 });
  };
  Stepper.register('map', { steps: 3, setup, render });
})();
