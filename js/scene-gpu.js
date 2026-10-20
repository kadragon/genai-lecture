// Handwriting chapter: GPU compute and digit probabilities lead into text prediction.
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
