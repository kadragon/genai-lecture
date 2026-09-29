// Ch.6 hallucination: every word is likely, the whole sentence is fiction.
(() => {
  const WORDS = ['조선왕조실록에', '기록된', '일화로,', '세종대왕이', '훈민정음', '초고를', '작성하던', '중', '담당', '관리에게', '맥북을', '던진', '사건입니다.'];
  const PROBS = [0.93, 0.88, 0.91, 0.95, 0.84, 0.9, 0.87, 0.96, 0.82, 0.89, 0.94, 0.9, 0.92];

  let r;

  const setup = (section) => {
    const answer = section.querySelector('.answer');
    const words = WORDS.map((text, i) => {
      const w = document.createElement('span');
      w.className = 'w';
      const bar = document.createElement('i');
      bar.style.width = `${PROBS[i] * 100}%`;
      w.append(text, bar);
      answer.append(w);
      return w;
    });
    r = { words, stamp: section.querySelector('.stamp-wrap') };
  };

  const render = (step, instant) => {
    const { go } = Stepper;
    r.words.forEach((w, i) => go(w, { opacity: step === 0 ? 0 : step === 1 ? 1 : 0.55, y: step === 0 ? 20 : 0 }, instant, {
      duration: 0.35, delay: instant || step !== 1 ? 0 : 0.3 + i * 0.22,
    }));
    go(r.stamp, { scale: step === 2 ? 1 : 1.8 }, instant, { duration: 0.35, delay: instant ? 0 : 0.5, ease: [0.5, 0, 0.75, 0] });
  };

  Stepper.register('hallu', { steps: 3, setup, render });
})();
