// GPU compute, a cancellable learning loop, then digit probabilities.
(() => {
  // Illustrative distributions over digits 0–9, not measured model outputs.
  const SAMPLES = [
    { file: '1-60716', probabilities: [2, 25, 1, 1, 1, 1, 1, 65, 2, 1] },
    { file: '7-60000', probabilities: [1, 5, 1, 0, 0, 0, 0, 92, 1, 0] },
    { file: '0-60010', probabilities: [83, 1, 1, 1, 1, 1, 5, 1, 5, 1] },
    { file: '1-60031', probabilities: [2, 36, 1, 1, 1, 1, 1, 54, 2, 1] },
    { file: '7-60017', probabilities: [1, 58, 1, 1, 1, 1, 1, 33, 2, 1] },
    { file: '0-60025', probabilities: [71, 1, 2, 2, 1, 2, 8, 1, 10, 2] },
  ];
  let r;
  const setup = (section) => {
    const samples = section.querySelector('.learn-samples');
    SAMPLES.forEach(({ file }) => {
      const tile = document.createElement('div');
      tile.className = 'learn-sample';
      const image = document.createElement('img');
      image.src = `assets/mnist/${file}.png`;
      image.alt = `손글씨 ${file[0]}`;
      const label = document.createElement('span');
      label.textContent = `정답 ${file[0]}`;
      tile.append(image, label);
      samples.append(tile);
    });
    r = {
      section, stage: section.querySelector('.digit-training'),
      tiles: [...samples.children], input: section.querySelector('.learn-input img'),
      bars: [...section.querySelectorAll('.pbar i')],
      guess: section.querySelector('.learn-guess'), confidence: section.querySelector('.learn-confidence'),
      error: section.querySelector('.learn-error'), targetProbability: section.querySelector('.learn-target-prob'),
      reaction: section.querySelector('.learn-reaction'), update: section.querySelector('.learn-update'),
      round: section.querySelector('.learn-round'), timers: [], controls: [],
    };
  };
  const cancel = () => {
    r.timers.forEach(clearTimeout);
    r.controls.forEach((control) => control?.stop());
    r.timers = [];
    r.controls = [];
  };
  const render = (step, instant) => {
    cancel();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    r.stage.dataset.phase = '0';
    const beat = (round, phase) => {
      const index = round % SAMPLES.length;
      const sample = SAMPLES[index];
      const pass = Math.floor(round / SAMPLES.length) + 1;
      const answer = sample.file[0];
      const topProbability = Math.max(...sample.probabilities);
      const prediction = sample.probabilities.indexOf(topProbability);
      const correctProbability = sample.probabilities[Number(answer)];
      const correct = String(prediction) === answer;
      r.stage.dataset.phase = String(phase);
      r.tiles.forEach((tile, i) => {
        tile.classList.toggle('current', i === index);
        tile.classList.toggle('done', i < index);
      });
      if (phase === 0) {
        r.input.src = `assets/mnist/${sample.file}.png`;
        r.input.alt = '지금 학습하는 MNIST 손글씨';
        r.guess.textContent = '음… 어떤 숫자일까?';
        r.confidence.textContent = '모양을 살펴보는 중';
        r.error.textContent = `실제 정답: ${answer}`;
        r.targetProbability.textContent = `모델이 ${answer}에 준 확률: ${correctProbability}%`;
        r.reaction.textContent = correct ? '맞혔네! 이 모양을 더 배워 보자.' : `아하, 이건 ${answer}이구나!`;
        r.update.textContent = '보고 → 맞혀 보고 → 정답으로 배우기';
        r.round.textContent = `${pass}번째 둘러보기 · ${index + 1} / ${SAMPLES.length}장`;
      }
      if (phase === 1) {
        r.guess.textContent = `${prediction} 같아!`;
        r.confidence.textContent = `모델이 ${prediction}에 준 확률 ${topProbability}%`;
      }
      if (phase === 3) {
        r.guess.textContent = correct ? '다음 숫자도 만나 볼까?' : '다음엔 더 잘 맞혀 볼게!';
        r.confidence.textContent = `정답 ${answer}의 확률을 높이도록 배우는 중`;
        r.update.textContent = '배운 내용을 반영하고 → 다음 카드로';
      }
    };
    // One pending beat at a time keeps repeated passes bounded and cancellable.
    const tick = (round, phase) => {
      r.controls.forEach((control) => control?.stop());
      r.controls = [];
      beat(round, phase);
      r.timers = [setTimeout(() => tick(phase === 3 ? round + 1 : round, (phase + 1) % 4), 1200)];
    };
    if (step === 1) {
      if (reduced) {
        for (let phase = 0; phase < 4; phase++) beat(0, phase);
        r.round.textContent = '서로 다른 손글씨 6장으로 반복해서 배우기';
      } else {
        tick(0, 0);
      }
    }
    r.controls.push(Stepper.go(r.bars, { scaleX: step >= 2 ? 1 : 0 }, instant, {
      duration: 0.7, delay: instant || step < 2 ? 0 : Motion.stagger(0.15, { startDelay: 0.4 }),
    }));
  };
  // Leaving the slide also cancels pending beats and probability-bar animations.
  Reveal.on('slidechanged', () => { if (r && Reveal.getCurrentSlide() !== r.section) cancel(); });
  Stepper.register('gpu', { steps: 3, setup, render });
})();
