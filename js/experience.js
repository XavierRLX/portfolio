(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const navLinks = Array.from(document.querySelectorAll(
    '.navegacao-principal a[href^="#"], .mobile-dock a[href^="#"]'
  ));

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
      gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'transform' } })
        .from('.hero-eyebrow, .hero h1, .hero-description, .hero-actions', {
          y: 16, duration: 0.6, stagger: 0.06
        })
        .from('.hero-art', { y: 12, scale: 0.98, duration: 0.8 }, '<');

      gsap.to('.hero-light', {
        y: 24, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
      });

      // Register callback-created tweens in the same context for reduced-motion cleanup.
      context.add('reveal', (elements) => {
        gsap.fromTo(elements, { y: 18, opacity: 0.7 }, {
          y: 0, opacity: 1, duration: 0.55, stagger: 0.06,
          ease: 'power2.out', overwrite: true, clearProps: 'transform,opacity'
        });
      });
      ScrollTrigger.batch('.reveal:not(.project-card)', {
        start: 'top 93%', once: true, onEnter: context.reveal
      });
    });

    // Native disclosures change the document height; keep section triggers accurate.
    document.querySelectorAll('details').forEach((details) => {
      details.addEventListener('toggle', () => ScrollTrigger.refresh());
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
