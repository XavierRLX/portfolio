(() => {
  'use strict';
  const dialog = document.querySelector('#backoffice-dialog');
  const presentation = document.querySelector('#backoffice-content');
  const openers = Array.from(document.querySelectorAll('[data-backoffice-open]'));
  if (!dialog || !presentation || !openers.length || typeof dialog.showModal !== 'function') return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const tabs = Array.from(presentation.querySelectorAll('[role="tab"]'));
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  const stepButtons = Array.from(presentation.querySelectorAll('[data-production-step]'));
  const stages = Array.from(presentation.querySelectorAll('[data-production-stage]'));
  const closeButton = presentation.querySelector('[data-backoffice-close]');
  let opener = null;
  let previousScroll = 0;
  let animation = null;
  let animatedElement = null;
  let activeTab = 0;
  let outsidePress = false;

  const clearAnimation = () => {
    if (animation) animation.kill();
    if (animatedElement) {
      animatedElement.style.removeProperty('transform');
      animatedElement.style.removeProperty('opacity');
    }
    animation = null;
    animatedElement = null;
  };
  const enter = (element) => {
    clearAnimation();
    if (reducedMotion.matches || !window.gsap) return;
    animatedElement = element;
    // Content and ARIA state change immediately; animation never gates reading or controls.
    animation = window.gsap.timeline({ defaults: { ease: 'power2.out', clearProps: 'transform,opacity' } })
      .fromTo(element, { y: 8, opacity: 0.78 }, { y: 0, opacity: 1, duration: 0.24 });
  };
  const activateTab = (index, focus = false, animate = true) => {
    activeTab = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const active = i === activeTab;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (focus) tabs[activeTab].focus({ preventScroll: true });
    // Switching context starts at the new panel's introduction, below sticky navigation.
    dialog.scrollTo({ top: 0, behavior: 'instant' });
    if (animate && dialog.open) enter(panels[activeTab]);
  };
  const activateStep = (index, animate = true) => {
    stages.forEach((stage, i) => { stage.hidden = i !== index; });
    stepButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    if (animate) presentation.querySelector('#production-status').textContent = 'Etapa ' + (index + 1) + ' de ' + stages.length + ': ' + stages[index].querySelector('h5').textContent;
    if (animate) enter(stages[index]);
  };
  const close = () => { if (dialog.open) dialog.close(); };

  // Progressive enhancement: without JS, the same presentation stays inline and readable.
  dialog.append(presentation);
  document.body.classList.add('backoffice-ready');
  openers.forEach((button) => { button.hidden = false; });
  closeButton.hidden = false;
  presentation.querySelector('.backoffice-tabs').hidden = false;
  presentation.querySelector('.production-steps').hidden = false;
  panels.forEach((panel, index) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabs[index].id);
    panel.tabIndex = 0;
  });
  activateTab(0, false, false);
  activateStep(0, false);

  openers.forEach((button) => button.addEventListener('click', () => {
    opener = button;
    previousScroll = scrollY;
    dialog.showModal();
    document.documentElement.classList.add('has-backoffice-dialog');
    dialog.scrollTop = 0;
    tabs[activeTab].focus({ preventScroll: true });
    enter(panels[activeTab]);
  }));
  closeButton.addEventListener('click', close);
  dialog.addEventListener('close', () => {
    clearAnimation();
    document.documentElement.classList.remove('has-backoffice-dialog');
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    if (scrollY !== previousScroll) scrollTo({ top: previousScroll, behavior: 'instant' });
  });
  // Native dialog handles Escape, focus containment and inert background.
  dialog.addEventListener('pointerdown', (event) => {
    const bounds = dialog.getBoundingClientRect();
    outsidePress = event.target === dialog &&
      (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
  });
  dialog.addEventListener('pointerup', (event) => {
    if (outsidePress && event.target === dialog) close();
    outsidePress = false;
  });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(index));
    tab.addEventListener('keydown', (event) => {
      const keys = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: tabs.length - 1 };
      if (!(event.key in keys)) return;
      event.preventDefault();
      activateTab(keys[event.key], true);
    });
  });
  stepButtons.forEach((button, index) => button.addEventListener('click', () => activateStep(index)));
  reducedMotion.addEventListener('change', clearAnimation);
})();
