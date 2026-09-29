// Step state machine bridging Reveal fragments and Motion.
//
// A scene is { steps, setup(section), render(step, instant) }.
// render must be idempotent: given a step it drives every element to that
// step's state, so forward, backward and direct jumps all land the same way.
//
// Declarative shortcuts handled here for every stepped section:
//   <section data-steps="4">          stepped slide with no scene code
//   <section data-part="Ⅰ 원리">      part label, carried forward to later sections
//   <section data-kicker="03 · 알파고"> header label
//   <el data-show="2">  / "2-" / "1-3"  visible only in that step range (opacity)
//   <el data-show="2-" data-rise>       also slides up 12px on entry
//   <el data-show="2-" data-delay="0.4">
//
// Ownership rules (each one cost a debugging round):
// - Reveal auto-animate owns elements with data-id and diffs their offsetLeft/Top,
//   so morph targets sit directly in slide coordinates and Motion never
//   touches them — only their wrappers or children.
// - Motion overrides transform-origin on SVG elements; scale an HTML wrapper instead.
// - data-show elements get opacity (and y with data-rise) from here; scene code
//   must not animate those properties on them.
window.Stepper = (() => {
  const scenes = new Map();
  const register = (id, scene) => scenes.set(id, scene);

  // Motion tokens live in css/deck.css (:root) so CSS and Motion share one curve.
  const css = getComputedStyle(document.documentElement);
  const ms = (name) => parseFloat(css.getPropertyValue(name)) / 1000;
  const DUR = ms('--dur');            // entrances, fades
  const DUR_SLOW = ms('--dur-slow');  // scene choreography default
  const EASE = css.getPropertyValue('--ease').match(/[\d.]+/g).map(Number);
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const go = (els, props, instant, opts = {}) => {
    if (!els || els.length === 0) return;
    return Motion.animate(els, props, instant || REDUCED ? { duration: 0 } : { duration: DUR_SLOW, ease: EASE, ...opts });
  };

  // Deterministic randomness so every rehearsal looks the same.
  const rng = (seed) => () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const inRange = (spec, step) => {
    const [a, b] = spec.split('-');
    const lo = Number(a), hi = b === undefined ? lo : b === '' ? Infinity : Number(b);
    return step >= lo && step <= hi;
  };

  const sceneOf = (section) =>
    scenes.get(section.dataset.scene) || { steps: Number(section.dataset.steps || 1) };

  const span = (cls, text, tag = 'span') => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    n.textContent = text;
    return n;
  };

  const prepare = () => {
    const sections = [...document.querySelectorAll('.slides > section')];
    let part = '';
    sections.forEach((section) => {
      part = section.dataset.part || part;
      if (section.dataset.scene && !scenes.has(section.dataset.scene)) {
        throw new Error(`unknown scene: ${section.dataset.scene}`);
      }
      const scene = sceneOf(section);
      // Hidden fragments act as step triggers: step 0 = none shown, step k = k shown.
      for (let i = 0; i < scene.steps - 1; i++) {
        const t = document.createElement('span');
        t.className = 'fragment step-trigger';
        section.appendChild(t);
      }
      if (section.dataset.kicker) {
        const [num, ...title] = section.dataset.kicker.split(' · ');
        const h = document.createElement('header');
        h.className = 'kicker';
        h.append(span('part', part), span('', num, 'b'), span('', title.join(' · ')));
        section.prepend(h);
      }
      scene.setup && scene.setup(section);
    });
  };

  const render = (section, step, instant) => {
    const scene = sceneOf(section);
    scene.render && scene.render(step, instant);
    section.querySelectorAll('[data-show]').forEach((el) => {
      const on = inRange(el.dataset.show, step);
      const props = { opacity: on ? 1 : 0 };
      if ('rise' in el.dataset) props.y = on ? 0 : 12;
      go(el, props, instant, { duration: DUR, delay: on && !instant ? Number(el.dataset.delay || 0) : 0 });
    });
  };

  const renderCurrent = (instant) => {
    const section = Reveal.getCurrentSlide();
    if (!section) return;
    const f = Reveal.getIndices().f;
    render(section, f === undefined || f < 0 ? 0 : f + 1, instant);
  };

  const attach = () => {
    Reveal.on('ready', () => renderCurrent(true));
    Reveal.on('slidechanged', () => renderCurrent(true));
    Reveal.on('fragmentshown', () => renderCurrent(false));
    Reveal.on('fragmenthidden', () => renderCurrent(false));
  };

  return { register, prepare, attach, go, rng };
})();
