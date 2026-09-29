// Ch.15 research first: macro-to-micro rings, four candidate problems, the human
// picks two, and the picks slot into the report.
(() => {
  const PICKED = [1, 2];
  let r;
  const setup = (section) => {
    const cards = [...section.querySelectorAll('.pcard')];
    cards.forEach((c, i) => {
      c.style.left = `${800 + (i % 2) * 490}px`;
      c.style.top = `${190 + Math.floor(i / 2) * 290}px`;
    });
    r = { cards };
  };
  // Where each picked card lands inside the report's problem slot (scale 0.5, top-left origin).
  const slot = (card, k) => ({ x: 222 - parseFloat(card.style.left), y: 420 + k * 128 - parseFloat(card.style.top), scale: 0.5 });
  const render = (step, instant) => {
    const { go } = Stepper;
    r.cards.forEach((c, i) => {
      const k = PICKED.indexOf(i);
      let target;
      if (step === 0) target = { opacity: 0, x: 0, y: 30, scale: 1 };
      else if (step === 1) target = { opacity: 1, x: 0, y: 0, scale: 1 };
      else if (step === 2) target = { opacity: k >= 0 ? 1 : 0.25, x: 0, y: k >= 0 ? -14 : 0, scale: 1 };
      else target = k >= 0 ? { opacity: 1, ...slot(c, k) } : { opacity: 0, x: 0, y: 0, scale: 1 };
      go(c, target, instant, { duration: step === 3 ? 1.1 : 0.6, delay: instant ? 0 : step === 1 ? i * 0.2 : step === 3 ? 0.5 + Math.max(k, 0) * 0.2 : 0 });
    });
  };
  Stepper.register('research', { steps: 4, setup, render });
})();
