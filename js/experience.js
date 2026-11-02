(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const navLinks = Array.from(
    document.querySelectorAll('.navegacao-principal a[href^="#"]')
  );

  // One read + one write per frame. Passive scrolling and no scroll interception.
  let scheduled = false;
  const syncScroll = () => {
    scheduled = false;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const fraction = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    if (progress) progress.style.transform = 'scaleX(' + fraction + ')';
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(syncScroll);
  }, { passive: true });
  window.addEventListener('resize', syncScroll, { passive: true });
  syncScroll();

  // Active section follows actual viewport position; the native anchors still work without JS.
  const sections = ['inicio', 'projeto', 'hSobre', 'mainContato']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const updateLinks = (id) => {
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (!visible.length) return;
      visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      updateLinks(visible[0].target.id);
    }, { rootMargin: '-15% 0px -60% 0px', threshold: [0, 0.01, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
    updateLinks('inicio');
  }

  // MatchMedia reverts every tween/trigger when the preference changes, even mid-animation.
  if (window.gsap && window.ScrollTrigger) {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    const motion = gsap.matchMedia();

    motion.add('(prefers-reduced-motion: no-preference)', (context) => {
      // Register callback-created tweens in the same context for reduced-motion cleanup.
      context.add('reveal', (elements) => {
        const range = Math.min(window.innerWidth * 1.1, 1100);
        elements.forEach((element, index) => {
          const left = element.classList.contains('section-top') ||
            element.classList.contains('approach-intro') ||
            element.classList.contains('about-portrait') ||
            (element.classList.contains('approach-item') && index === 0);
          const right = element.classList.contains('about-copy') ||
            (element.classList.contains('approach-item') && index > 0);
          const x = left ? -range : right ? range : 0;
          gsap.fromTo(element, { x, y: x ? 0 : 90, opacity: 0.25 }, {
            x: 0, y: 0, opacity: 1, duration: x ? 0.95 : 0.8,
            ease: 'power3.out', delay: Math.min(index * 0.07, 0.21),
            overwrite: true, clearProps: 'transform,opacity'
          });
        });
      });
      ScrollTrigger.batch('.reveal:not(.project-card)', {
        start: 'top 93%', once: true, onEnter: context.reveal
      });
    });

    // Only original cards change the page height. Modal/visual-buffer disclosures
    // must not refresh the page's scroll context behind an open presentation.
    document.querySelectorAll('.project-card details').forEach((details) => {
      details.addEventListener('toggle', () => ScrollTrigger.refresh());
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
