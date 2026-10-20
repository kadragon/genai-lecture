// Illustrative word-level decoding: recompute candidates after each selection.
(() => {
  const WORDS = ['조선왕조실록에', '기록된', '일화로,', '세종대왕이', '훈민정음', '초고를', '작성하던', '중', '담당', '관리에게', '맥북을', '던진', '사건입니다.'];
  const ALTS = ['전해지는', '소개된', '이야기로,', '임금이', '문서', '원고를', '검토하던', '당시', '궁중', '신하에게', '책을', '건넨', '일화입니다.'];
  const PROBS = [62, 71, 58, 76, 65, 69, 73, 81, 56, 68, 64, 72, 79];
  let r;
  const setup = (section) => {
    const answer = section.querySelector('.answer');
    const words = WORDS.map((text) => {
      const word = document.createElement('span');
      word.className = 'w';
      word.textContent = text;
      answer.append(word);
      return word;
    });
    const candidates = section.querySelector('.predict-candidates');
    for (let i = 0; i < 3; i++) {
      const row = document.createElement('div');
      row.className = 'predict-candidate';
      row.innerHTML = '<span></span><div><i></i></div><b></b>';
      candidates.append(row);
    }
    r = { section, words, rows: [...candidates.children], context: section.querySelector('.predict-context'), status: section.querySelector('.predict-status'), stamp: section.querySelector('.stamp-wrap'), timers: [], animations: [] };
    // Stop pending decoding when navigating away, including fast slide jumps.
    Reveal.on('slidechanged', ({ previousSlide }) => { if (previousSlide === section) cancel(); });
  };
  const cancel = () => {
    r.timers.forEach(clearTimeout);
    r.animations.forEach((animation) => animation?.stop());
    r.timers = [];
    r.animations = [];
  };
  const later = (ms, fn) => r.timers.push(setTimeout(fn, ms));
  const candidates = (i, instant) => {
    r.context.textContent = i ? `지금까지: …${WORDS.slice(Math.max(0, i - 3), i).join(' ')}` : '질문을 바탕으로 첫 말의 확률 계산';
    r.status.textContent = `${i + 1}/${WORDS.length} · 다음 말 후보의 확률 계산`;
    const probabilities = [PROBS[i], Math.round((100 - PROBS[i]) * 0.6), 100 - PROBS[i] - Math.round((100 - PROBS[i]) * 0.6)];
    r.rows.forEach((row, k) => {
      row.classList.remove('selected');
      row.children[0].textContent = [WORDS[i], ALTS[i], '그 밖의 후보'][k];
      row.children[2].textContent = `${probabilities[k]}%`;
      const bar = row.querySelector('i');
      bar.style.width = '0%';
      r.animations.push(Stepper.go(bar, { width: `${probabilities[k]}%` }, instant, { duration: 0.45 }));
    });
  };
  const select = (i) => {
    r.rows[0].classList.add('selected');
    r.words[i].style.opacity = '1';
    r.status.textContent = i === WORDS.length - 1 ? '문장 완성 · 그럴듯하게 이어져도 사실인지는 별개' : `“${WORDS[i]}” 선택 → 문장에 추가 → 다음 확률 계산`;
  };
  const render = (step, instant) => {
    cancel();
    r.words.forEach((word) => { word.style.opacity = step === 2 ? '0.55' : '0'; });
    if (step === 1) {
      if (instant || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        r.words.forEach((word) => { word.style.opacity = '1'; });
        candidates(WORDS.length - 1, true);
        select(WORDS.length - 1);
      } else {
        WORDS.forEach((_, i) => {
          later(i * 1150, () => candidates(i, false));
          later(i * 1150 + 650, () => select(i));
        });
      }
    }
    r.animations.push(Stepper.go(r.stamp, { scale: step === 2 ? 1 : 1.8 }, instant, { duration: 0.35, delay: instant ? 0 : 0.5 }));
  };
  Stepper.register('hallu', { steps: 3, setup, render });
})();
