// Training text flows into a parameter panel; repeated small updates remain as numbers.
(() => {
  const SENTENCES = [
    '아침 햇살이 창문으로 들어온다.', '학생들이 도서관에서 책을 읽는다.',
    '오늘 회의는 오후 세 시에 시작한다.', '비가 내리면 땅이 촉촉해진다.',
    '새로운 질문이 새로운 생각을 만든다.', '기차는 정해진 시간에 출발했다.',
    '서로 다른 의견을 듣고 답을 찾는다.', '봄이 오면 나무에 새잎이 돋는다.',
    '실험 결과를 표로 정리했다.', '친구와 함께 저녁을 준비한다.',
    '바람이 불어 구름이 천천히 움직인다.', '배운 내용을 자기 말로 설명한다.',
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
