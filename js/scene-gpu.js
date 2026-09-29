// Ch.2 GPU: one brush paints pixel by pixel, thousands paint at once; pixels are numbers.
(() => {
  const INVADER = [
    '..a.....a..',
    '...a...a...',
    '..aaaaaaa..',
    '.aa.aaa.aa.',
    'aaaaaaaaaaa',
    'a.aaaaaaa.a',
    'a.a.....a.a',
    '...aa.aa...',
  ];
  const STARS = [[1, 13], [2, 3], [13, 1], [14, 11]];
  // Paper palette: cobalt sprite, ink stars, sunken background (see :root in deck.css).
  const COLORS = { a: '#2346d1', w: '#16171a', '.': '#dcd7cb' };
  const DIM = { a: 'rgba(35,70,209,.22)', w: 'rgba(22,23,26,.18)', '.': '#e9e5db' };
  const BLANK = 'rgba(22,23,26,0.05)';

  const sprite = () => {
    const grid = Array.from({ length: 16 }, () => Array(16).fill('.'));
    INVADER.forEach((row, y) => [...row].forEach((c, x) => { grid[y + 4][x + 2] = c; }));
    STARS.forEach(([y, x]) => { grid[y][x] = 'w'; });
    return grid.flat();
  };

  let r;

  const setup = (section) => {
    const cells = sprite();
    const rng = Stepper.rng(3);
    const build = (grid) => cells.map((c) => {
      const pix = document.createElement('div');
      pix.className = 'pix';
      const digit = document.createElement('i');
      digit.textContent = c === '.' ? '0' : '1';
      pix.append(digit);
      grid.append(pix);
      return pix;
    });
    const cpu = build(section.querySelector('.pixgrid.cpu'));
    const gpu = build(section.querySelector('.pixgrid.gpu'));

    // Concept curve for the stock aside: flat for years, then steep.
    const pts = Array.from({ length: 40 }, (_, i) => {
      const t = i / 39;
      const y = (Math.exp(4.2 * t) - 1) / (Math.exp(4.2) - 1);
      return [t * 700, 380 - (y * 340 + (rng() - 0.5) * 18 * (0.3 + t))];
    });
    const line = section.querySelector('.stock .line');
    line.setAttribute('d', 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${Math.min(380, y).toFixed(1)}`).join(' L'));

    r = { cells, cpu, gpu, gpuDelay: gpu.map(() => rng() * 0.35), line, digits: [...section.querySelectorAll('.pix i')] };
  };

  const render = (step, instant) => {
    const { go } = Stepper;
    const paint = (pixes, delayOf) => pixes.forEach((p, i) => {
      const c = r.cells[i];
      const bg = step === 0 ? BLANK : step === 1 ? COLORS[c] : DIM[c];
      go(p, { backgroundColor: bg }, instant, { duration: 0.2, delay: instant || step !== 1 ? 0 : delayOf(i) });
    });
    paint(r.cpu, (i) => i * 0.028);   // one brush: ~7s for the whole picture
    paint(r.gpu, (i) => r.gpuDelay[i]); // thousands of brushes: under half a second

    go(r.digits, { opacity: step >= 2 ? 1 : 0 }, instant, { duration: 0.4, delay: instant || step < 2 ? 0 : Motion.stagger(0.002) });
    go(r.line, { strokeDashoffset: step >= 3 ? 0 : 1 }, instant, { duration: 2, delay: instant ? 0 : 0.5, ease: 'easeInOut' });
  };

  Stepper.register('gpu', { steps: 4, setup, render });
})();
