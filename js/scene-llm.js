// Ch.5 LLM: the knob panel grows ("Large"), then the same sentence is cut into
// tokens by three tokenizer generations. Counts come from data/tokens.js (tiktoken).
(() => {
  const ROWS = [
    { key: 'gpt2', lang: 'en', name: '영어', sub: '세 모델 모두', cls: 'en' },
    { key: 'gpt2', lang: 'ko', name: 'GPT-2', sub: '2019' },
    { key: 'gpt4', lang: 'ko', name: 'GPT-4', sub: '2023' },
    { key: 'gpt4o', lang: 'ko', name: 'GPT-4o', sub: '2024' },
  ];
  const TOPS = [260, 400, 520, 640];
  const SHOW = ['1-', '1-', '2-', '3-'];

  let r;

  const setup = (section) => {
    const panel = section.querySelector('.panel');
    window.knobAngles(48).forEach((a) => {
      const k = document.createElement('div');
      k.className = 'knob';
      k.style.transform = `rotate(${a}deg)`;
      panel.append(k);
    });

    const rows = ROWS.map((spec, i) => {
      const blocks = window.TOKENS[spec.key][spec.lang];
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
        t.textContent = b.t;
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

  Stepper.register('llm', { steps: 4, setup, render });
})();
