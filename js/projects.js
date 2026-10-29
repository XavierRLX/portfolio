(() => {
  'use strict';
  const track = document.querySelector('#projects-track');
  const prev = document.querySelector('#projects-prev');
  const next = document.querySelector('#projects-next');
  const position = document.querySelector('#projects-position');
  if (!track || !prev || !next || !position) return;
  const cards = Array.from(track.querySelectorAll('.project-card'));
  const groupButtons = Array.from(document.querySelectorAll('[data-project-page]'));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!cards.length) return;

  let activeIndex = 0;
  let requestedIndex = 0;
  let selectedIndex = 0;
  let previousWidth = 0;
  let centered = true;
  let pageSize = 1;
  let frame = 0;
  let settleTimer = 0;
  let destinations = [];
  let starts = [];

  const measure = () => {
    previousWidth = track.clientWidth;
    const style = getComputedStyle(track);
    centered = style.getPropertyValue('--carousel-centered').trim() === '1';
    pageSize = Number(style.getPropertyValue('--carousel-page-size')) || 1;
    starts = cards.map((_, index) => index).filter((index) => centered || index % pageSize === 0);
    const maxLeft = track.scrollWidth - track.clientWidth;
    destinations = cards.map((card) => Math.max(0, Math.min(maxLeft,
      centered ? card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2 : card.offsetLeft
    )));
  };
  const lastIndex = () => starts[starts.length - 1];
  const normalize = (index) => {
    const bounded = Math.max(0, Math.min(lastIndex(), index));
    return centered ? bounded : Math.floor(bounded / pageSize) * pageSize;
  };
  const closestIndex = () => starts.reduce((closest, index) =>
    Math.abs(destinations[index] - track.scrollLeft) < Math.abs(destinations[closest] - track.scrollLeft) ? index : closest, 0);
  const updateVisual = () => {
    frame = 0;
    // Native re-snap can precede ResizeObserver; preserve intent before reading new offsets.
    if (track.clientWidth !== previousWidth) { resize(); return; }
    activeIndex = closestIndex();
    cards.forEach((card, index) => card.classList.toggle('is-current', index >= activeIndex && index < activeIndex + pageSize));
  };
  const updateControls = () => {
    const first = String(activeIndex + 1).padStart(2, '0');
    const last = pageSize > 1 ? '–' + String(Math.min(cards.length, activeIndex + pageSize)).padStart(2, '0') : '';
    const text = first + last + ' / ' + String(cards.length).padStart(2, '0');
    if (position.textContent !== text) position.textContent = text;
    prev.disabled = requestedIndex === 0;
    next.disabled = requestedIndex === lastIndex();
    groupButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(Math.floor(activeIndex / 3) === Number(button.dataset.projectPage) / 3));
    });
  };
  const settle = () => {
    clearTimeout(settleTimer);
    updateVisual();
    requestedIndex = activeIndex;
    if (selectedIndex < activeIndex || selectedIndex >= activeIndex + pageSize) selectedIndex = activeIndex;
    updateControls();
  };
  const scrollToIndex = (index, behavior = reducedMotion.matches ? 'instant' : 'smooth') => {
    selectedIndex = Math.max(0, Math.min(cards.length - 1, index));
    requestedIndex = normalize(selectedIndex);
    track.scrollTo({ left: destinations[requestedIndex], behavior });
    updateControls();
    if (behavior === 'instant') settle();
  };
  function resize() {
    if (previousWidth === track.clientWidth) return;
    const selected = selectedIndex;
    measure();
    scrollToIndex(selected, 'instant');
  }

  cards.forEach((card, index) => {
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'case');
    card.setAttribute('aria-label', (index + 1) + ' de ' + cards.length + ': ' + card.querySelector('h3').textContent);
  });
  track.closest('.projects-section').classList.add('carousel-ready');
  document.querySelector('.projects-groups').hidden = false;
  measure();
  settle();
  prev.addEventListener('click', () => scrollToIndex(requestedIndex - pageSize));
  next.addEventListener('click', () => scrollToIndex(requestedIndex + pageSize));
  groupButtons.forEach((button) => button.addEventListener('click', () => scrollToIndex(Number(button.dataset.projectPage))));
  track.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(updateVisual);
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settle, 160);
  }, { passive: true });
  track.addEventListener('scrollend', settle);
  track.addEventListener('pointerdown', () => { requestedIndex = activeIndex; selectedIndex = activeIndex; }, { passive: true });
  track.addEventListener('keydown', (event) => {
    if (event.target !== track || event.altKey || event.ctrlKey || event.metaKey) return;
    const keys = { ArrowLeft: requestedIndex - pageSize, ArrowRight: requestedIndex + pageSize, Home: 0, End: lastIndex() };
    if (!(event.key in keys)) return;
    event.preventDefault();
    scrollToIndex(keys[event.key]);
  });
  track.addEventListener('focusin', (event) => {
    const index = cards.indexOf(event.target.closest('.project-card'));
    if (index < 0) return;
    selectedIndex = index;
    if (index >= activeIndex && index < activeIndex + pageSize) return;
    scrollToIndex(index, 'instant');
  });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(track);
  else addEventListener('resize', resize, { passive: true });
  reducedMotion.addEventListener('change', () => scrollToIndex(selectedIndex, 'instant'));
})();
