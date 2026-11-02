(() => {
  'use strict';

  // Runs before the GSAP CDN: the opening and typing remain available offline.
  // The complete sentence is always present in HTML for accessibility and no-JS.
  const description = document.querySelector('[data-typewriter]');
  const original = description?.querySelector('.typewriter-reserve');
  const typed = description?.querySelector('.typewriter-render');
  if (!description || !original || !typed) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const sentence = original.textContent;
  const animations = [];
  let frameId = 0;
  let started = false;
  let finished = false;
  let typingStart = 0;

  const restore = () => {
    animations.forEach((animation) => animation.cancel());
    cancelAnimationFrame(frameId);
    description.classList.remove('is-typing');
    typed.textContent = '';
    finished = true;
    document.documentElement.dataset.intro = 'complete';
  };

  const enter = (selector, from, delay, duration = 1200) => {
    for (const element of document.querySelectorAll(selector)) {
      // WAAPI updates only transform and opacity. It doesn't change document flow.
      animations.push(element.animate([
        { transform: from, opacity: 0.3 },
        { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 }
      ], {
        duration, delay, easing: 'cubic-bezier(.19,1,.22,1)', fill: 'backwards'
      }));
    }
  };

  const tick = (time) => {
    if (finished) return;
    const elapsed = time - typingStart;
    const ratio = Math.min(1, Math.max(0, (elapsed - 430) / 2200));
    typed.textContent = sentence.slice(0, Math.floor(sentence.length * ratio));
    if (ratio === 1) {
      description.classList.remove('is-typing');
      typed.textContent = '';
      finished = true;
      document.documentElement.dataset.intro = 'complete';
      return;
    }
    frameId = requestAnimationFrame(tick);
  };

  const play = () => {
    if (started || finished || motion.matches) return;
    if (location.hash && location.hash !== '#inicio') return;
    started = true;
    document.documentElement.dataset.intro = 'playing';
    description.classList.add('is-typing');
    typed.textContent = '';
    typingStart = performance.now();

    const left = 'translate3d(-105vw,0,0) scale(.97)';
    const right = 'translate3d(105vw,0,0) scale(.95)';
    enter('.site-header .logotipo', 'translate3d(0,-180px,0)', 20, 920);
    enter('.site-header .menu, .site-header .menu-toggle', 'translate3d(0,-180px,0)', 130, 1060);
    enter('.hero-eyebrow', left, 110, 1180);
    enter('.hero h1', left, 220, 1480);
    enter('.hero-description', 'translate3d(0,95px,0)', 510, 1040);
    enter('.hero-actions', 'translate3d(0,115vh,0)', 400, 1390);
    enter('.hero-art', right, 270, 1500);
    frameId = requestAnimationFrame(tick);
  };

  const onMotionChange = () => {
    if (motion.matches) restore();
    // Do not restart after user switches preference mid-session.
  };
  motion.addEventListener('change', onMotionChange);

  if (motion.matches || (location.hash && location.hash !== '#inicio')) {
    restore();
  } else if (document.visibilityState === 'hidden') {
    document.addEventListener('visibilitychange', function visible() {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', visible);
      play();
    });
  } else {
    play();
  }
})();
