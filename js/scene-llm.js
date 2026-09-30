// Ch.5 LLM: the knob panel grows ("Large") after morphing in from ch.4 model.
(() => {
  const setup = (section) => {
    const panel = section.querySelector('.panel');
    window.knobAngles(48).forEach((a) => {
      const k = document.createElement('div');
      k.className = 'knob';
      k.style.transform = `rotate(${a}deg)`;
      panel.append(k);
    });
  };

  Stepper.register('llm', { steps: 1, setup, render: () => {} });
})();
