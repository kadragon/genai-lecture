// Training text flows into a parameter panel; repeated small updates remain as numbers.
(() => {
  const SENTENCES = [
    '아침 햇살이 창문으로 들어온다.',
    'The students are reading books.',
    '春天来了，树上长出了新叶。',
    '図書館で本を読みます。',
    'a² + b² = c²',
    'for x in numbers: total += x',
    '서로 다른 의견을 듣고 답을 찾는다.',
    'Water freezes at zero degrees Celsius.',
    '我们一起寻找问题的答案。',
    '雨が降ると、地面がぬれます。',
    'f(x) = 2x + 1 → f(3) = 7',
    'SELECT title FROM books;',
  ];

  // Shared with the LLM slide so the trained panel retains the same values.
  window.knobAngles = (n) => {
    const rng = Stepper.rng(11);
    return Array.from({ length: n }, () => Math.round(rng() * 300 - 150));
  };

  let r;
  const setup = (section) => {
    const stream = section.querySelector('.training-stream');
    for (let i = 0; i < 36; i++) {
      const sentence = document.createElement('div');
      sentence.className = 'training-sentence';
      sentence.textContent = SENTENCES[i % SENTENCES.length];
      sentence.style.setProperty('--lane', i % 6);
      sentence.style.setProperty('--delay', `${Math.floor(i / 6) * 1.5 + (i % 6) * 0.12}s`);
      stream.append(sentence);
    }
    const angles = window.knobAngles(48);
    angles.forEach((angle, i) => {
      const knob = document.createElement('div');
      knob.className = 'knob';
      knob.style.setProperty('--trained', `${angle}deg`);
      knob.style.setProperty('--early', `${angle * 0.3 + (i % 2 ? 12 : -12)}deg`);
      knob.style.setProperty('--middle', `${angle * 0.7}deg`);
      knob.style.setProperty('--near', `${angle + (i % 2 ? -7 : 7)}deg`);
      knob.style.setProperty('--tune-delay', `${0.85 + (i % 12) * 0.045}s`);
      section.querySelector('.panel').append(knob);
    });
    r = { section };
  };

  const render = (step, instant) => {
    r.section.classList.remove('model-training', 'model-trained');
    // Restart from a deterministic state on backwards navigation and rapid stepping.
    void r.section.offsetWidth;
    r.section.classList.toggle('model-trained', step >= 2 || (instant && step === 1));
    r.section.classList.toggle('model-training', step === 1 && !instant);
  };

  Stepper.register('model', { steps: 3, setup, render });
})();
