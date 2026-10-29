(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const track = document.querySelector('#projects-track');
  const prev = document.querySelector('#projects-prev');
  const next = document.querySelector('#projects-next');
  const position = document.querySelector('#projects-position');
  const cards = track ? Array.from(track.querySelectorAll('.project-card')) : [];
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

  // Mobile carousel: native horizontal swipe, scroll-snap, arrow alternatives.
  if (track && cards.length && prev && next && position) {
    let activeIndex = 0;
    let carouselFrame = 0;

    const findClosestIndex = () => {
      const trackRect = track.getBoundingClientRect();
      let closestIndex = 0;
      let smallestDistance = Number.POSITIVE_INFINITY;
      cards.forEach((card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - trackRect.left);
        if (distance < smallestDistance) {
          closestIndex = index;
          smallestDistance = distance;
        }
      });
      return closestIndex;
    };

    const updateCarousel = () => {
      carouselFrame = 0;
      activeIndex = findClosestIndex();
      position.textContent = String(activeIndex + 1).padStart(2, '0') +
        ' / ' + String(cards.length).padStart(2, '0');
      prev.disabled = activeIndex === 0;
      next.disabled = activeIndex === cards.length - 1;
    };

    const scrollToIndex = (index) => {
      const targetIndex = Math.min(cards.length - 1, Math.max(0, index));
      const left = cards[targetIndex].getBoundingClientRect().left -
        track.getBoundingClientRect().left + track.scrollLeft;
      track.scrollTo({ left, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };

    prev.addEventListener('click', () => scrollToIndex(activeIndex - 1));
    next.addEventListener('click', () => scrollToIndex(activeIndex + 1));

    track.addEventListener('scroll', () => {
      if (!carouselFrame) carouselFrame = window.requestAnimationFrame(updateCarousel);
    }, { passive: true });
    window.addEventListener('resize', updateCarousel, { passive: true });
    updateCarousel();
  }

  // Progressive enhancement: a missing CDN or reduced-motion preference never hides content.
  if (!reducedMotion.matches && window.gsap && window.ScrollTrigger) {
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'all' } })
      .from('.hero-copy > .hero-eyebrow, .hero-name, .hero h1, .hero-description, .hero-actions', {
        y: 24, autoAlpha: 0, duration: 0.85, stagger: 0.105
      })
      .from('.hero-art', { y: 18, scale: 0.96, autoAlpha: 0, duration: 1.25 }, '<0.18');

    gsap.to('.hero-light', {
      y: 32, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });

    window.ScrollTrigger.batch('.reveal', {
      start: 'top 93%',
      once: true,
      onEnter: (elements) => {
        gsap.fromTo(elements, { y: 28, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: 0.75, stagger: 0.08,
          ease: 'power2.out', overwrite: true, clearProps: 'all'
        });
      }
    });
  }
})();
