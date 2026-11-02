(() => {
  'use strict';

  const art = document.querySelector('.hero-art');
  const control = art?.querySelector('.react-control');
  const mark = art?.querySelector('.react-mark');
  const orbit = art?.querySelector('.orbit-outer');
  const upperPanel = art?.querySelector('.tech-panel--interface');
  const lowerPanel = art?.querySelector('.tech-panel--architecture');
  const hint = art?.querySelector('[data-react-hint]');
  const status = art?.querySelector('[data-react-status]');
  const gsap = window.gsap;

  // Progressive enhancement: disabled HTML control and CSS rotation without GSAP.
  if (!art || !control || !mark || !orbit || !upperPanel || !lowerPanel || !hint || !status || !gsap) return;

  const levels = [
    { scale: 1, speed: 1, spread: 0 },
    { scale: 1.12, speed: 3, spread: 12 },
    { scale: 1.21, speed: 7, spread: 23 },
    { scale: 1.28, speed: 16, spread: 32 }
  ];

  const motion = gsap.matchMedia();

  const setup = (reduced) => {
    let level = 0;
    let idleCall = null;
    const managed = [control, orbit, upperPanel, lowerPanel];
    let spinner = null;
    let observer = null;
    let onVisibilityChange = null;

    art.classList.add(reduced ? 'is-react-reduced' : 'is-react-kinetic');
    control.disabled = false;

    if (!reduced) {
      // One continuous tween, speed-controlled via timeScale; no restart / angle jumps.
      spinner = gsap.to(mark, { rotation: 360, duration: 48, repeat: -1, ease: 'none' });
      onVisibilityChange = () => spinner.paused(document.hidden || !inViewport);
      let inViewport = true;
      observer = new IntersectionObserver((entries) => {
        inViewport = entries[0]?.isIntersecting ?? false;
        onVisibilityChange();
      }, { threshold: 0.01 });
      observer.observe(art);
      document.addEventListener('visibilitychange', onVisibilityChange);
    }

    const render = (nextLevel) => {
      const { scale, speed, spread } = levels[nextLevel];
      const duration = reduced ? 0 : 0.48;
      const config = { duration, ease: 'power3.out', overwrite: 'auto' };

      art.dataset.reactLevel = String(nextLevel);
      hint.textContent = nextLevel ? `REACT / TURBO 0${nextLevel} DE 03` : 'TOQUE NO REACT / TURBO';
      gsap.to(control, { scale, ...config });
      gsap.to(upperPanel, { x: spread, y: -spread * 0.48, scale: 1 - spread * 0.0017, ...config });
      gsap.to(lowerPanel, { x: -spread, y: spread * 0.48, scale: 1 - spread * 0.0017, ...config });
      gsap.to(orbit, { scale: 1 + spread * 0.002, opacity: nextLevel ? 0.85 : 1, ...config });
      if (spinner) {
        gsap.to(spinner, { timeScale: speed, duration: 0.42, ease: 'power2.out', overwrite: true });
      }
    };

    const reset = () => {
      idleCall = null;
      level = 0;
      render(0);
      status.textContent = 'Símbolo React voltou ao tamanho e à velocidade normais.';
    };

    const onClick = () => {
      level = Math.min(level + 1, 3);
      idleCall?.kill();
      render(level);
      status.textContent = reduced
        ? `React ampliado, nível ${level} de 3. Movimento desativado pela sua preferência.`
        : `React em turbo ${level} de 3: ampliado e girando ${levels[level].speed} vezes mais rápido.`;
      idleCall = gsap.delayedCall(4, reset);
    };

    control.addEventListener('click', onClick);

    return () => {
      idleCall?.kill();
      control.removeEventListener('click', onClick);
      if (observer) {
        observer.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
      gsap.killTweensOf([...managed, spinner].filter(Boolean));
      spinner?.kill();
      gsap.set([...managed, mark], { clearProps: 'transform,opacity' });
      delete art.dataset.reactLevel;
      art.classList.remove('is-react-kinetic', 'is-react-reduced');
      control.disabled = true;
      hint.textContent = 'TOQUE NO REACT / TURBO';
      status.textContent = '';
    };
  };

  motion.add('(prefers-reduced-motion: no-preference)', () => setup(false));
  motion.add('(prefers-reduced-motion: reduce)', () => setup(true));
})();
