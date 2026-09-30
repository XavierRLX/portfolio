(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('#inicio > header');
  const heroScene = document.querySelector('.hero-react-scene');
  const heroSurface = document.querySelector('.fundoApresentação');
  const awxCard = document.querySelector('.project-case--featured');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  body.classList.add('motion-enhanced');

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (current, target, factor) => current + (target - current) * factor;
  const near = (a, b, epsilon = 0.02) => Math.abs(a - b) <= epsilon;
  const canUsePointerMotion = () =>
    !reducedMotion.matches && finePointer.matches && window.innerWidth > 900;

  let headerFrame = 0;
  const syncHeader = () => {
    headerFrame = 0;
    header?.classList.toggle('is-scrolled', window.scrollY > 36);
  };
  const scheduleHeaderSync = () => {
    if (!headerFrame) {
      headerFrame = window.requestAnimationFrame(syncHeader);
    }
  };

  syncHeader();
  window.addEventListener('scroll', scheduleHeaderSync, { passive: true });

  if (heroScene && heroSurface) {
    const current = { rx: 0, ry: 0, x: 0, y: 0, gx: 0, gy: 0 };
    const target = { ...current };
    let heroFrame = 0;
    let heroRect = null;

    const renderHero = () => {
      current.rx = lerp(current.rx, target.rx, 0.14);
      current.ry = lerp(current.ry, target.ry, 0.14);
      current.x = lerp(current.x, target.x, 0.14);
      current.y = lerp(current.y, target.y, 0.14);
      current.gx = lerp(current.gx, target.gx, 0.08);
      current.gy = lerp(current.gy, target.gy, 0.08);

      heroScene.style.setProperty('--hero-rx', `${current.rx.toFixed(3)}deg`);
      heroScene.style.setProperty('--hero-ry', `${current.ry.toFixed(3)}deg`);
      heroScene.style.setProperty('--hero-x', `${current.x.toFixed(2)}px`);
      heroScene.style.setProperty('--hero-y', `${current.y.toFixed(2)}px`);
      heroScene.style.setProperty('--hero-glow-x', `${current.gx.toFixed(2)}px`);
      heroScene.style.setProperty('--hero-glow-y', `${current.gy.toFixed(2)}px`);

      const settled =
        near(current.rx, target.rx) && near(current.ry, target.ry) &&
        near(current.x, target.x) && near(current.y, target.y) &&
        near(current.gx, target.gx, 0.05) && near(current.gy, target.gy, 0.05);

      heroFrame = settled ? 0 : window.requestAnimationFrame(renderHero);
    };

    const scheduleHero = () => {
      if (!heroFrame) heroFrame = window.requestAnimationFrame(renderHero);
    };

    const resetHero = () => {
      Object.assign(target, { rx: 0, ry: 0, x: 0, y: 0, gx: 0, gy: 0 });
      heroScene.classList.remove('is-pointer-active');
      scheduleHero();
    };

    heroSurface.addEventListener('pointerenter', () => {
      if (!canUsePointerMotion()) return;
      heroRect = heroSurface.getBoundingClientRect();
      heroScene.classList.add('is-pointer-active');
    }, { passive: true });

    heroSurface.addEventListener('pointermove', (event) => {
      if (!canUsePointerMotion() || !heroRect) return;
      const nx = clamp(((event.clientX - heroRect.left) / heroRect.width) * 2 - 1, -1, 1);
      const ny = clamp(((event.clientY - heroRect.top) / heroRect.height) * 2 - 1, -1, 1);

      target.rx = -ny * 3.2;
      target.ry = nx * 3.6;
      target.x = nx * 2.6;
      target.y = ny * 1.8;
      target.gx = nx * 8;
      target.gy = ny * 6;
      scheduleHero();
    }, { passive: true });

    heroSurface.addEventListener('pointerleave', resetHero, { passive: true });
    reducedMotion.addEventListener('change', resetHero);
    finePointer.addEventListener('change', resetHero);
  }

  if (awxCard) {
    const current = { rx: 0, ry: 0, mx: 0, my: 0, cx: 0, cy: 0 };
    const target = { ...current };
    let cardFrame = 0;
    let cardRect = null;

    const renderCard = () => {
      current.rx = lerp(current.rx, target.rx, 0.16);
      current.ry = lerp(current.ry, target.ry, 0.16);
      current.mx = lerp(current.mx, target.mx, 0.14);
      current.my = lerp(current.my, target.my, 0.14);
      current.cx = lerp(current.cx, target.cx, 0.14);
      current.cy = lerp(current.cy, target.cy, 0.14);

      awxCard.style.setProperty('--awx-rx', `${current.rx.toFixed(3)}deg`);
      awxCard.style.setProperty('--awx-ry', `${current.ry.toFixed(3)}deg`);
      awxCard.style.setProperty('--awx-media-x', `${current.mx.toFixed(2)}px`);
      awxCard.style.setProperty('--awx-media-y', `${current.my.toFixed(2)}px`);
      awxCard.style.setProperty('--awx-content-x', `${current.cx.toFixed(2)}px`);
      awxCard.style.setProperty('--awx-content-y', `${current.cy.toFixed(2)}px`);

      const settled = Object.keys(current).every((key) => near(current[key], target[key], 0.02));
      cardFrame = settled ? 0 : window.requestAnimationFrame(renderCard);
    };

    const scheduleCard = () => {
      if (!cardFrame) cardFrame = window.requestAnimationFrame(renderCard);
    };

    const resetCard = () => {
      Object.assign(target, { rx: 0, ry: 0, mx: 0, my: 0, cx: 0, cy: 0 });
      awxCard.classList.remove('is-pointer-active');
      scheduleCard();
    };

    awxCard.addEventListener('pointerenter', () => {
      if (!canUsePointerMotion()) return;
      cardRect = awxCard.getBoundingClientRect();
      awxCard.classList.add('is-pointer-active');
    }, { passive: true });

    awxCard.addEventListener('pointermove', (event) => {
      if (!canUsePointerMotion() || !cardRect) return;
      const nx = clamp(((event.clientX - cardRect.left) / cardRect.width) * 2 - 1, -1, 1);
      const ny = clamp(((event.clientY - cardRect.top) / cardRect.height) * 2 - 1, -1, 1);

      target.rx = -ny * 1.5;
      target.ry = nx * 1.8;
      target.mx = nx * 4;
      target.my = ny * 3;
      target.cx = -nx * 2.2;
      target.cy = -ny * 1.6;
      scheduleCard();
    }, { passive: true });

    awxCard.addEventListener('pointerleave', resetCard, { passive: true });
    reducedMotion.addEventListener('change', resetCard);
    finePointer.addEventListener('change', resetCard);

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      awxCard.classList.add('is-motion-visible');
    } else {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          awxCard.classList.add('is-motion-visible');
          observer.disconnect();
        }
      }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
      revealObserver.observe(awxCard);
    }
  }
})();
