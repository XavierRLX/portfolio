const header = document.querySelector('header');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navegacao-principal');
const menuLinks = document.querySelectorAll('#menu-principal a');

if (header && menuToggle && navigation) {
  header.classList.add('nav-ready');

  const setMenuOpen = (isOpen, returnFocus = false) => {
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    navigation.classList.toggle('is-open', isOpen);

    if (returnFocus) {
      menuToggle.focus();
    }
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false, true);
    }
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target) && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
    }
  });

  window.matchMedia('(min-width: 701px)').addEventListener('change', (event) => {
    if (event.matches) {
      setMenuOpen(false);
    }
  });
}
