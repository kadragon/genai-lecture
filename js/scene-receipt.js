// Ch.16 receipt: a scan line reads the receipt, rows drop into a sheet,
// and the human checks the totals.
(() => {
  let r;
  const setup = (section) => { r = { scan: section.querySelector('.scanline') }; };
  const render = (step, instant) => {
    if (step === 1 && !instant) {
      Stepper.go(r.scan, { y: [-70, 690], opacity: [0, 1, 1, 0] }, false, { duration: 2.2, delay: 0.3, ease: 'linear' });
    } else {
      Stepper.go(r.scan, { opacity: 0 }, true);
    }
  };
  Stepper.register('receipt', { steps: 3, setup, render });
})();
