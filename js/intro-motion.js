(() => {
  'use strict';

  // Text and structure already exist in HTML; motion is a progressive enhancement.
  const gsap = window.gsap;
  const heading = document.querySelector('.hero h1');
  const description = document.querySelector('[data-typewriter]');
  const reserve = description?.querySelector('.typewriter-reserve');
  const typed = description?.querySelector('.typewriter-render');
  if (!gsap || !heading || !reserve || !typed) return;

  const content = reserve.textContent;
  const motion = gsap.matchMedia();

  motion.add('(prefers-reduced-motion: no-preference)', () => {
    // Direct deep links should not briefly move the hero into the viewport.
    if (location.hash && location.hash !== '#inicio') return;

    const offscreen = Math.max(window.innerWidth + 180, 700);
    const below = window.innerHeight + 200;
    const counter = { value: 0 };
    description.classList.add('is-typing');

    const timeline = gsap.timeline({
      defaults: { ease: 'power4.out' },
      onComplete: () => {
        description.classList.remove('is-typing');
        typed.textContent = '';
      }
    });

    // Entrance directions are intentional; no layout properties are animated.
    timeline
      .from('.site-header .logotipo', {
        y: -160, opacity: 0.3, duration: 0.75, clearProps: 'transform,opacity'
      }, 0)
      .from('.site-header .menu, .site-header .menu-toggle', {
        y: -160, opacity: 0.2, duration: 0.85, stagger: 0.05,
        clearProps: 'transform,opacity'
      }, 0.08)
      .from('.hero-eyebrow', {
        x: -offscreen, opacity: 0.65, duration: 0.85, clearProps: 'transform,opacity'
      }, 0.04)
      .from(heading, {
        x: -offscreen, opacity: 0.6, duration: 1.06, clearProps: 'transform,opacity'
      }, 0.13)
      .from(description, {
        y: 95, opacity: 0.4, duration: 0.72, clearProps: 'transform,opacity'
      }, 0.33)
      .from('.hero-actions', {
        y: below, opacity: 0.45, duration: 1.08, clearProps: 'transform,opacity'
      }, 0.2)
      .from('.hero-art', {
        x: offscreen, rotateY: -17, opacity: 0.65, duration: 1.16,
        clearProps: 'transform,opacity'
      }, 0.15)
      .from('.tech-panel--interface', {
        x: 140, y: -100, opacity: 0, duration: 0.65,
        clearProps: 'transform,opacity'
      }, 0.7)
      .from('.tech-panel--architecture', {
        x: -140, y: 90, opacity: 0, duration: 0.65,
        clearProps: 'transform,opacity'
      }, 0.77)
      .to(counter, {
        value: content.length, duration: 1.17, ease: 'none',
        onUpdate: () => {
          typed.textContent = content.slice(0, Math.floor(counter.value));
        }
      }, 0.46);

    return () => {
      timeline.kill();
      description.classList.remove('is-typing');
      typed.textContent = '';
    };
  });
})();
