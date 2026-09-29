// Ch.10 prompt: a vague request gets a blurry answer, a specific one a sharp answer.
(() => {
  let r;
  const setup = (section) => { r = { out: section.querySelector('.out') }; };
  const render = (step, instant) => {
    const sharp = step >= 1;
    Stepper.go(r.out, { filter: sharp ? 'blur(0px)' : 'blur(5px)', opacity: sharp ? 1 : 0.65 }, instant, { duration: 1, delay: instant || !sharp ? 0 : 0.8 });
  };
  Stepper.register('prompt', { steps: 2, setup, render });
})();
