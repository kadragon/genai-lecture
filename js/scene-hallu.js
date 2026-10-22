// Presenter-controlled word-level decoding: one word per Reveal step.
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
    r = { section, words, rows: [...candidates.children], context: section.querySelector('.predict-context'), status: section.querySelector('.predict-status'), stamp: section.querySelector('.stamp-wrap'), animations: [] };
    // Stop active transitions when navigating away.
    Reveal.on('slidechanged', ({ previousSlide }) => { if (previousSlide === section) cancel(); });
  };
  const cancel = () => {
    r.animations.forEach((animation) => animation?.stop());
    r.animations = [];
  };
  const candidates = (i, instant) => {
    r.context.textContent = i ? `지금까지: …${WORDS.slice(Math.max(0, i - 3), i).join(' ')}` : '질문을 바탕으로 첫 말의 확률 계산';
    r.status.textContent = `${i + 1}/${WORDS.length} · 이번에 붙일 말의 후보 확률`;
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
    r.status.textContent = i === WORDS.length - 1 ? '문장 완성 · 그럴듯하게 이어져도 사실인지는 별개' : `“${WORDS[i]}” 추가 · → 키로 다음 말 이어 붙이기`;
  };
  const render = (step, instant) => {
    cancel();
    const complete = step > WORDS.length;
    r.words.forEach((word, i) => {
      word.style.opacity = complete ? '0.55' : i < step ? '1' : '0';
    });
    if (step >= 1 && !complete) {
      const index = step - 1;
      candidates(index, instant);
      select(index);
    }
    r.animations.push(Stepper.go(r.stamp, { scale: complete ? 1 : 1.8 }, instant, {
      duration: 0.35, delay: instant ? 0 : 0.5,
    }));
  };
  Stepper.register('hallu', { steps: WORDS.length + 2, setup, render });
})();
