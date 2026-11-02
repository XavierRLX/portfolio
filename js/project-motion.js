(() => {
  'use strict';

  // Enhance the six REAL cards, never the cloned infinite-scroll buffers.
  // Only children animate; the track and card transforms belong to the carousel.
  if (!window.gsap || !('IntersectionObserver' in window)) return;
  const gsap = window.gsap;
  const media = gsap.matchMedia();

  media.add('(prefers-reduced-motion: no-preference)', (context) => {
    const compact = matchMedia('(max-width: 1100px)');
    const cleaners = [];

    context.add('enterCard', (card, direction = 1, delay = 0) => {
      const visual = card.querySelector('.card-visual');
      const copy = card.querySelector('.card-copy');
      if (!visual || !copy) return;
      card.dataset.motionCount = String(Number(card.dataset.motionCount || 0) + 1);
      gsap.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' }, delay })
        .fromTo(visual,
          { x: direction * 52, y: 16, scale: 0.955, opacity: 0.4 },
          { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.65,
            clearProps: 'transform,opacity' })
        .fromTo(copy,
          { opacity: 0.42 },
          { opacity: 1, duration: 0.55,
            clearProps: 'opacity' }, 0.13);
    });

    for (const root of document.querySelectorAll('[data-project-carousel]')) {
      const cards = Array.from(root.querySelectorAll('.project-card'));
      if (!cards.length) continue;
      let visible = false;
      let playedDesktop = false;
      let selected = null;
      let pending = 0;

      const render = () => {
        if (!visible) return;
        if (!compact.matches) {
          if (playedDesktop) return;
          playedDesktop = true;
          cards.forEach((card, index) => {
            context.enterCard(card, index === 0 ? -1 : 1, index * 0.105);
          });
          return;
        }

        const card = cards.find((item) => item.classList.contains('is-current'));
        if (!card || card === selected || card.contains(document.activeElement)) return;
        const previous = cards.indexOf(selected);
        const current = cards.indexOf(card);
        const direction = previous < 0 || (current - previous + cards.length) % cards.length === 1 ? 1 : -1;
        selected = card;
        context.enterCard(card, direction);
      };
      const schedule = () => {
        clearTimeout(pending);
        pending = setTimeout(render, 90);
      };

      const observer = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible) schedule();
      }, { rootMargin: '0px 0px 8% 0px', threshold: 0.03 });
      observer.observe(root);

      const mutation = new MutationObserver(schedule);
      cards.forEach((card) => mutation.observe(card, { attributes: true, attributeFilter: ['class'] }));
      const onBreakpoint = () => {
        selected = null;
        playedDesktop = false;
        schedule();
      };
      compact.addEventListener('change', onBreakpoint);

      cleaners.push(() => {
        observer.disconnect();
        mutation.disconnect();
        clearTimeout(pending);
        compact.removeEventListener('change', onBreakpoint);
        cards.forEach((card) => { delete card.dataset.motionCount; });
      });
    }
    return () => cleaners.forEach((cleanup) => cleanup());
  });
})();
