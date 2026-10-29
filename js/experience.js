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

  // Finite native carousel: no cloned links, pointer capture, autoplay or wheel interception.
  if (track && cards.length && prev && next && position) {
    let activeIndex = 0;
    let requestedIndex = 0;
    let carouselFrame = 0;
    let settleTimer = 0;
    let previousWidth = 0;
    let centered = false;
    let visibleCount = 2;
    let destinations = [];

    const measure = () => {
      previousWidth = track.clientWidth;
      centered = getComputedStyle(track).getPropertyValue('--carousel-centered').trim() === '1';
      visibleCount = centered ? 1 : 2;
      const maxLeft = track.scrollWidth - track.clientWidth;
      // offsetLeft ignores the presentation scale, keeping snap positions stable.
      destinations = cards.map((card) => Math.max(0, Math.min(maxLeft,
        centered ? card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2 : card.offsetLeft
      )));
    };
    const lastIndex = () => cards.length - visibleCount;
    const closestIndex = () => {
      let closest = 0;
      for (let i = 1; i <= lastIndex(); i += 1) {
        if (Math.abs(destinations[i] - track.scrollLeft) <
            Math.abs(destinations[closest] - track.scrollLeft)) closest = i;
      }
      return closest;
    };
    const updateVisual = () => {
      carouselFrame = 0;
      // A browser may re-snap before ResizeObserver runs. Never compare new offsets
      // against stale destinations or it can select a neighboring project on resize.
      if (track.clientWidth !== previousWidth) {
        resize();
        return;
      }
      activeIndex = closestIndex();
      cards.forEach((card, index) => card.classList.toggle('is-current',
        index >= activeIndex && index < activeIndex + visibleCount));
    };
    const updateControls = () => {
      const start = String(activeIndex + 1).padStart(2, '0');
      const end = visibleCount > 1 ? '–' + String(activeIndex + visibleCount).padStart(2, '0') : '';
      const text = start + end + ' / ' + String(cards.length).padStart(2, '0');
      if (position.textContent !== text) position.textContent = text;
      prev.disabled = requestedIndex === 0;
      next.disabled = requestedIndex === lastIndex();
    };
    const settle = () => {
      window.clearTimeout(settleTimer);
      updateVisual();
      requestedIndex = activeIndex;
      updateControls();
    };
    const scrollToIndex = (index, behavior = reducedMotion.matches ? 'instant' : 'smooth') => {
      requestedIndex = Math.max(0, Math.min(lastIndex(), index));
      track.scrollTo({ left: destinations[requestedIndex], behavior });
      updateControls();
      if (behavior === 'instant') settle();
    };

    cards.forEach((card, index) => {
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', (index + 1) + ' de ' + cards.length + ': ' + card.querySelector('h3').textContent);
    });
    track.closest('.projects-section').classList.add('carousel-ready');
    measure();
    settle();
    prev.addEventListener('click', () => scrollToIndex(requestedIndex - 1));
    next.addEventListener('click', () => scrollToIndex(requestedIndex + 1));
    track.addEventListener('scroll', () => {
      if (!carouselFrame) carouselFrame = window.requestAnimationFrame(updateVisual);
      // Fallback for engines without scrollend; the live region updates only when settled.
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, 160);
    }, { passive: true });
    track.addEventListener('scrollend', settle);
    track.addEventListener('pointerdown', () => { requestedIndex = activeIndex; }, { passive: true });
    track.addEventListener('keydown', (event) => {
      if (event.target !== track || event.altKey || event.ctrlKey || event.metaKey) return;
      const keys = { ArrowLeft: requestedIndex - 1, ArrowRight: requestedIndex + 1, Home: 0, End: lastIndex() };
      if (!(event.key in keys)) return;
      event.preventDefault();
      scrollToIndex(keys[event.key]);
    });
    // Tab brings each real disclosure/link into view without moving the vertical page.
    track.addEventListener('focusin', (event) => {
      const card = event.target.closest('.project-card');
      const index = cards.indexOf(card);
      if (index < 0 || (index >= activeIndex && index < activeIndex + visibleCount)) return;
      scrollToIndex(index < activeIndex ? index : index - visibleCount + 1, 'instant');
    });
    function resize() {
      if (previousWidth === track.clientWidth) return;
      const selected = requestedIndex;
      measure();
      scrollToIndex(selected, 'instant');
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(track);
    else window.addEventListener('resize', resize, { passive: true });
    reducedMotion.addEventListener('change', () => scrollToIndex(activeIndex, 'instant'));
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
