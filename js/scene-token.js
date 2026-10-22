// English and Korean token boundaries from one tokenizer, without model chronology.
(() => {
  const ROWS = [
    { lang: 'en', name: '영어', sub: 'I go to school.' },
    { lang: 'ko', name: '한국어', sub: '나는 학교에 갑니다.' },
  ];
  const TOPS = [300, 530];
  const SHOW = ['0-', '1-'];

  let r;

  const setup = (section) => {
    const rows = ROWS.map((spec, i) => {
      const blocks = window.TOKENS[spec.lang];
      const row = document.createElement('div');
      row.className = 'tok-row';
      row.style.top = `${TOPS[i]}px`;
      row.dataset.show = SHOW[i];

      const who = document.createElement('div');
      who.className = 'who';
      const count = document.createElement('b');
      count.textContent = blocks.length;
      const sub = document.createElement('small');
      sub.textContent = spec.sub;
      who.append(`${spec.name} · `, count, '조각', sub);

      const toks = document.createElement('div');
      toks.className = 'toks';
      const els = blocks.map((b) => {
        const t = document.createElement('div');
        t.className = `tok${b.p ? ' part' : ''}${spec.cls ? ` ${spec.cls}` : ''}`;
        t.textContent = b.t.replaceAll(' ', '␣');
        toks.append(t);
        return t;
      });
      row.append(who, toks);
      section.append(row);
      return { els, from: Number(SHOW[i][0]) };
    });
    r = { rows };
  };

  const render = (step, instant) => {
    r.rows.forEach(({ els, from }) => {
      const on = step >= from;
      Stepper.go(els, { opacity: on ? 1 : 0, scale: on ? 1 : 0.6 }, instant, {
        duration: 0.4, delay: instant || !on ? 0 : Motion.stagger(0.045, { startDelay: 0.3 }),
      });
    });
  };

  Stepper.register('token', { steps: 2, setup, render });
})();
