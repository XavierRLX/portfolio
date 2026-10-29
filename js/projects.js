(() => {
  'use strict';
  const track = document.querySelector('#projects-track');
  const prev = document.querySelector('#projects-prev');
  const next = document.querySelector('#projects-next');
  const position = document.querySelector('#projects-position');
  if (!track || !prev || !next || !position) return;
  const cards = Array.from(track.querySelectorAll('.project-card'));
  const groups = Array.from(document.querySelectorAll('[data-project-page]'));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const length = cards.length;
  if (!length) return;

  // Visual buffers keep native momentum across either boundary. Only the six
  // original cases accept focus or appear in the accessibility tree.
  const ghosts = cards.map((card) => {
    const ghost = document.createElement('div');
    ghost.className = card.className.replace('project-card', 'carousel-ghost');
    ghost.innerHTML = card.innerHTML;
    ghost.inert = true;
    ghost.setAttribute('aria-hidden', 'true');
    ghost.querySelectorAll('[id], [aria-controls], [data-backoffice-open]').forEach((node) => {
      node.removeAttribute('id'); node.removeAttribute('aria-controls'); node.removeAttribute('data-backoffice-open');
    });
    ghost.querySelector('.backoffice-fallback')?.remove();
    ghost.querySelectorAll('a, button').forEach((node) => {
      const label = document.createElement('span');
      label.className = node.className;
      label.innerHTML = node.innerHTML;
      node.replaceWith(label);
    });
    ghost.querySelectorAll('summary').forEach((node) => { node.tabIndex = -1; });
    return ghost;
  });
  track.prepend(...ghosts.map((ghost) => ghost.cloneNode(true)));
  track.append(...ghosts);
  const slots = Array.from(track.children);
  const logical = (index) => ((index % length) + length) % length;
  let active = length, requested = length, selected = 0;
  let width = 0, centered = true, size = 1, frame = 0, timer = 0;
  let touching = false;
  let destinations = [], starts = [];

  const normalize = (index) => centered ? index : index - (logical(index) % 3 === 2 ? 1 : 0);
  const measure = () => {
    width = track.clientWidth;
    const style = getComputedStyle(track);
    centered = style.getPropertyValue('--carousel-centered').trim() === '1';
    size = centered ? 1 : 2;
    starts = [];
    const max = track.scrollWidth - width;
    destinations = slots.map((slot, index) => {
      const valid = centered || logical(index) % 3 !== 2;
      slot.style.scrollSnapAlign = valid ? (centered ? 'center' : 'start') : 'none';
      if (valid) starts.push(index);
      return Math.max(0, Math.min(max, centered ? slot.offsetLeft + slot.offsetWidth / 2 - width / 2 : slot.offsetLeft));
    });
  };
  const closest = () => starts.reduce((best, index) =>
    Math.abs(destinations[index] - track.scrollLeft) < Math.abs(destinations[best] - track.scrollLeft) ? index : best, starts[0]);
  const visuals = () => {
    slots.forEach((slot, index) => slot.classList.toggle('is-current', index >= active && index < active + size));
  };
  const controls = () => {
    const index = logical(active);
    const text = String(index + 1).padStart(2, '0') + (size === 2 ? '–' + String(index + 2).padStart(2, '0') : '') + ' / ' + String(length).padStart(2, '0');
    if (position.textContent !== text) position.textContent = text;
    prev.disabled = next.disabled = false;
    groups.forEach((button) => button.setAttribute('aria-pressed', String(Math.floor(index / 3) === Number(button.dataset.projectPage) / 3)));
  };
  const relocate = (index) => {
    track.classList.add('is-relocating');
    active = requested = index;
    visuals();
    track.scrollTo({ left: destinations[index], behavior: 'instant' });
    // Commit an equivalent frame without restarting the mobile scale transition.
    void track.offsetWidth;
    requestAnimationFrame(() => track.classList.remove('is-relocating'));
  };
  const settle = () => {
    clearTimeout(timer);
    if (touching) return;
    if (track.clientWidth !== width) { resize(); return; }
    active = closest();
    if (Math.abs(track.scrollLeft - destinations[active]) > 2) return;
    const index = logical(active);
    if (selected < index || selected >= index + size) selected = index;
    if (active < length || active >= length * 2) relocate(length + index);
    requested = active;
    visuals(); controls();
  };
  const go = (index, behavior = motion.matches ? 'instant' : 'smooth', preserveSelection = false) => {
    requested = normalize(index);
    if (!preserveSelection) selected = logical(requested);
    track.scrollTo({ left: destinations[requested], behavior });
    if (behavior === 'instant') settle();
  };
  const step = (direction) => {
    let cursor = starts.indexOf(requested);
    if (cursor + direction < 0 || cursor + direction >= starts.length - 1) {
      relocate(length + logical(requested));
      cursor = starts.indexOf(requested);
    }
    go(starts[cursor + direction]);
  };
  function resize() {
    if (width === track.clientWidth) return;
    const index = selected;
    measure();
    selected = index;
    go(length + index, 'instant', true);
  }
  cards.forEach((card, index) => {
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'case');
    card.setAttribute('aria-label', (index + 1) + ' de ' + length + ': ' + card.querySelector('h3').textContent);
    card.querySelector('details')?.addEventListener('toggle', (event) => {
      [slots[index], slots[index + length * 2]].forEach((ghost) => { ghost.querySelector('details').open = event.target.open; });
    });
  });
  track.closest('.projects-section').classList.add('carousel-ready');
  document.querySelector('.projects-groups').hidden = false;
  measure(); relocate(length); settle();
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  groups.forEach((button) => button.addEventListener('click', () => go(length + Number(button.dataset.projectPage))));
  track.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      if (track.clientWidth !== width) { resize(); return; }
      active = closest(); visuals();
    });
    clearTimeout(timer);
    timer = setTimeout(settle, 180);
  }, { passive: true });
  track.addEventListener('scrollend', settle);
  track.addEventListener('touchstart', () => { touching = true; }, { passive: true });
  const releaseTouch = () => {
    touching = false;
    clearTimeout(timer);
    timer = setTimeout(settle, 180);
  };
  track.addEventListener('touchend', releaseTouch, { passive: true });
  track.addEventListener('touchcancel', releaseTouch, { passive: true });
  track.addEventListener('pointerdown', () => { requested = active; }, { passive: true });
  track.addEventListener('keydown', (event) => {
    if (event.target !== track || event.altKey || event.ctrlKey || event.metaKey) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') step(event.key === 'ArrowLeft' ? -1 : 1);
    else go(length + (event.key === 'Home' ? 0 : length - 1));
  });
  track.addEventListener('focusin', (event) => {
    const index = cards.indexOf(event.target.closest('.project-card'));
    if (index < 0) return;
    selected = index;
    if (length + index >= active && length + index < active + size) return;
    go(length + index, 'instant', true);
  });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(track);
  else addEventListener('resize', resize, { passive: true });
  motion.addEventListener('change', () => go(length + selected, 'instant', true));
})();
