// Ch.1 SimSimi: a chat app backed by a drawer of hand-paired answers.
(() => {
  const LABELS = ['안녕', '배고파', '심심해', '잘 자', '사랑해', '뭐 해?', '좋아', '날씨', '노래', '고마워', '싫어', '졸려'];
  let r;

  const setup = (section) => {
    const cabinet = section.querySelector('.cabinet');
    LABELS.forEach((text) => {
      const drawer = document.createElement('div');
      drawer.className = 'drawer';
      const glow = document.createElement('div');
      glow.className = 'glow';
      const tag = document.createElement('span');
      tag.textContent = text;
      drawer.append(glow, tag);
      cabinet.append(drawer);
    });
    r = {
      phone: section.querySelector('.phone-wrap'),
      drawers: [...cabinet.querySelectorAll('.drawer')],
      glows: [...cabinet.querySelectorAll('.glow')],
    };
  };

  const render = (step, instant) => {
    const { go } = Stepper;
    const late = (d) => (instant ? 0 : d);
    go(r.phone, { x: step >= 1 ? -440 : 0 }, instant, { duration: 1 });

    // Step 1: the "안녕" drawer slides out and lights up.
    go(r.drawers[0], { scale: step === 1 ? 1.08 : 1, y: step === 1 ? 10 : 0 }, instant, { delay: late(0.6) });
    go(r.glows[0], { opacity: step === 1 ? 1 : 0 }, instant, { delay: late(0.6) });

    // Step 2: every drawer is searched in turn, none matches.
    if (step === 2 && !instant) {
      go(r.glows, { opacity: [0, 0.6, 0] }, false, { duration: 0.45, delay: Motion.stagger(0.08, { startDelay: 0.9 }) });
    } else if (step !== 1) {
      go(r.glows, { opacity: 0 }, true);
    }
  };

  Stepper.register('simsimi', { steps: 3, setup, render });
})();
