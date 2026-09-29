// Ch.6 in practice: a magnifier checks a cited clause that does not exist.
(() => {
  let r;

  const setup = (section) => {
    r = { section, lens: section.querySelector('.lens-wrap'), mark: section.querySelector('.doc mark') };
  };

  // Offset that centres the lens on the cited clause, in slide px.
  const toMark = () => {
    const s = Reveal.getScale();
    const sec = r.section.getBoundingClientRect();
    const m = r.mark.getBoundingClientRect();
    const cx = (m.left + m.width / 2 - sec.left) / s, cy = (m.top + m.height / 2 - sec.top) / s;
    return { x: cx - (r.lens.offsetLeft + 110), y: cy - (r.lens.offsetTop + 110) };
  };

  const render = (step, instant) => {
    Stepper.go(r.lens, step >= 1 ? toMark() : { x: 0, y: 0 }, instant, { duration: 1.1 });
  };

  Stepper.register('fakelaw', { steps: 3, setup, render });
})();
