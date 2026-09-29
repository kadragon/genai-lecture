// Ch.18 responsibility: the "AI said so" stamp bounces off the approval box; the human stamps it.
(() => {
  let r;
  const setup = (section) => {
    r = { ai: section.querySelector('.stamp-ai'), me: section.querySelector('.stamp-me'), lines: [...section.querySelectorAll('.approval .l')] };
  };
  const render = (step, instant) => {
    const { go } = Stepper;
    go(r.lines, { scaleX: 1 }, instant, { duration: 0.4, delay: instant ? 0 : Motion.stagger(0.12) });
    if (step === 1 && !instant) {
      go(r.ai, { y: [-120, 150, 60, 420], x: [0, -140, -60, 160], rotate: [0, -8, 20, 60], opacity: [1, 1, 1, 0] }, false, { duration: 1.6, ease: 'easeIn' });
    } else {
      go(r.ai, step === 0 ? { x: 0, y: 0, rotate: 0, opacity: 1 } : { opacity: 0 }, true);
    }
    go(r.me, step >= 2 ? { scale: 1, opacity: 1 } : { scale: 2.4, opacity: 0 }, instant, { duration: 0.35, delay: instant ? 0 : 0.4, ease: [0.5, 0, 0.75, 0] });
  };
  Stepper.register('stamp', { steps: 3, setup, render });
})();
