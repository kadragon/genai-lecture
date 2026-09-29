// Ch.2 GPU: why learning needs compute, text and pictures are stored as numbers,
// then one brush vs thousands; pixels are numbers.
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

    r = { cells, cpu, gpu, gpuDelay: gpu.map(() => rng() * 0.35), digits: [...section.querySelectorAll('.pix i')] };
  };

  const render = (step, instant) => {
    const { go } = Stepper;
    const paint = (pixes, delayOf) => pixes.forEach((p, i) => {
      const c = r.cells[i];
      const bg = step <= 2 ? BLANK : step === 3 ? COLORS[c] : DIM[c];
      go(p, { backgroundColor: bg }, instant, { duration: 0.2, delay: instant || step !== 3 ? 0 : delayOf(i) });
    });
    paint(r.cpu, (i) => i * 0.028);   // one brush: ~7s for the whole picture
    paint(r.gpu, (i) => r.gpuDelay[i]); // thousands of brushes: under half a second

    go(r.digits, { opacity: step >= 4 ? 1 : 0 }, instant, { duration: 0.4, delay: instant || step < 4 ? 0 : Motion.stagger(0.002) });
  };

  Stepper.register('gpu', { steps: 5, setup, render });
})();
