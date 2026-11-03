(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });
    items.forEach(item => observer.observe(item));
  } else items.forEach(item => item.classList.add('is-visible'));

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#main-nav');
  if (menuButton && menu) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
      menu.classList.remove('menu-open');
    };
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      menu.classList.toggle('menu-open', open);
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); }, { passive: true });
  }

  const layers = document.querySelectorAll('.parallax');
  let scheduled = false;
  const moveLayers = () => {
    layers.forEach(layer => {
      const speed = Number(layer.dataset.speed || 0);
      const rect = layer.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const offset = Math.max(-24, Math.min(24, (window.innerHeight / 2 - (rect.top + rect.height / 2)) * speed));
        if (layer.classList.contains('hero-photo')) layer.style.transform = `translate3d(0, ${offset}px, 0) rotate(4deg)`;
        else layer.style.backgroundPosition = `center calc(48% + ${Math.round(offset)}px)`;
      }
    });
    scheduled = false;
  };
  if (!reduced) {
    window.addEventListener('scroll', () => {
      if (!scheduled) {
        window.requestAnimationFrame(moveLayers);
        scheduled = true;
      }
    }, { passive: true });
  }
})();
