// Ch.16 receipt: a scan line reads the receipt, rows drop into a sheet,
// and the human checks the totals.
(() => {
  // [x, y] padding per target: receipt text lines are tight, sheet cells carry their own padding.
  const PAD = [[10, 1], [0, 0]];
  let r;

  // Slide-space box around the given elements. offset* ignores Reveal's scale.
  const bounds = (els, [px, py]) => {
    const rects = els.map((el) => {
      let x = 0, y = 0;
      for (let n = el; n && n !== r.section; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    });
    const x = Math.min(...rects.map((b) => b.x)), y = Math.min(...rects.map((b) => b.y));
    const w = Math.max(...rects.map((b) => b.x + b.w)) - x, h = Math.max(...rects.map((b) => b.y + b.h)) - y;
    return { left: `${x - px}px`, top: `${y - py}px`, width: `${w + px * 2}px`, height: `${h + py * 2}px` };
  };

  const setup = (section) => {
    r = {
      section,
      scan: section.querySelector('.scanline'),
      boxes: [...section.querySelectorAll('.checkbox')],
      // The receipt's total line, and the sheet's two total figures.
      targets: [
        [...section.querySelectorAll('.receipt .sum > span')],
        [...section.querySelectorAll('.xl .tot .num')],
      ],
    };
  };
  const render = (step, instant) => {
    // Measured on every render: web fonts may settle after setup.
    r.boxes.forEach((box, i) => Object.assign(box.style, bounds(r.targets[i], PAD[i])));
    if (step === 1 && !instant) {
      Stepper.go(r.scan, { y: [-70, 690], opacity: [0, 1, 1, 0] }, false, { duration: 2.2, delay: 0.3, ease: 'linear' });
    } else {
      Stepper.go(r.scan, { opacity: 0 }, true);
    }
  };
  Stepper.register('receipt', { steps: 3, setup, render });
})();
