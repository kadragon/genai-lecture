// Ch.15 form analysis: three memos align, an x-ray leaves only their skeleton,
// the model drafts a prompt from it and asks back, and both are filed away as an agent.
(() => {
  const FAN = [[-40, 20, -6], [0, 0, 0], [40, 16, 5]];   // x, y, rotate per sheet
  let r;
  const setup = (section) => {
    r = {
      docs: section.querySelector('.docs'),
      sheets: [...section.querySelectorAll('.paper-doc')],
      lines: [...section.querySelectorAll('.paper-doc .t, .paper-doc .l, .paper-doc .h')],
      scan: section.querySelector('.xscan'),
      prompt: section.querySelector('.gen-prompt'),
    };
  };
  const render = (step, instant) => {
    const { go } = Stepper;
    r.sheets.forEach((s, i) => {
      const [x, y, rotate] = step === 0 ? FAN[i] : [0, 0, 0];
      go(s, { x, y, rotate }, instant, { duration: 0.8 });
    });
    go(r.lines, { opacity: step >= 1 ? 0.12 : 1 }, instant, { duration: 0.8, delay: instant || step < 1 ? 0 : 1.6 });
    if (step === 1 && !instant) {
      go(r.scan, { y: [-90, 650], opacity: [0, 1, 1, 0] }, false, { duration: 1.6, delay: 0.7, ease: 'linear' });
    } else {
      go(r.scan, { opacity: 0 }, true);
    }
    const filed = step >= 3;
    go(r.docs, filed ? { x: 1060, y: 360, scale: 0.18, opacity: 0 } : { x: 0, y: 0, scale: 1, opacity: 1 }, instant, { duration: 1.1, ease: 'easeInOut' });
    // The drafted prompt drops into the agent drawer (drawer centre − prompt centre).
    go(r.prompt, filed ? { x: 180, y: 110, scale: 0.25 } : { x: 0, y: 0, scale: 1 }, instant, { duration: 1.1, ease: 'easeInOut' });
  };
  Stepper.register('xray', { steps: 4, setup, render });
})();
