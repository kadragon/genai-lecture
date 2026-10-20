// Ch.2 GPU: the compute pile from ch.1, the game graphics card that does it
// all at once, then handwritten digits answered with probabilities (bridge
// into AlphaGo).
(() => {
  let r;

  const setup = (section) => {
    r = { bars: [...section.querySelectorAll('.pbar i')] };
  };

  const render = (step, instant) => {
    Stepper.go(r.bars, { scaleX: step >= 2 ? 1 : 0 }, instant, {
      duration: 0.7, delay: instant || step < 2 ? 0 : Motion.stagger(0.15, { startDelay: 0.4 }),
    });
  };

  Stepper.register('gpu', { steps: 3, setup, render });
})();
