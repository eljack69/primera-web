(() => {
  // Navbar blur progresivo + CTA sticky móvil
  const nav = document.getElementById('nav');
  const ctaSticky = document.getElementById('ctaSticky');
  if (nav || ctaSticky) {
    const updateOnScroll = () => {
      const y = window.scrollY;
      if (nav) nav.classList.toggle('is-scrolled', y > 8);
      if (ctaSticky) ctaSticky.classList.toggle('is-visible', y > 400);
    };
    updateOnScroll();
    window.addEventListener('scroll', updateOnScroll, { passive: true });
  }

  // Menú móvil
  const toggle = document.querySelector('.nav__toggle');
  const menu   = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll-reveal
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // Parallax sutil del hero (la foto se traslada más lento que el scroll)
  const heroPhoto = document.querySelector('.hero__photo');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroPhoto && !reduceMotion) {
    let ticking = false;
    const maxShift = 60; // px
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = heroPhoto.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        // Solo calcula si el hero está visible
        if (rect.bottom > 0 && rect.top < vh) {
          const progress = 1 - (rect.top + rect.height / 2) / vh; // -1..1 aprox
          const shift = Math.max(-maxShift, Math.min(maxShift, progress * maxShift * 0.6));
          heroPhoto.style.setProperty('--parallax-y', `${-shift.toFixed(1)}px`);
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  // Año dinámico
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  // Form mock (mientras Formspree no esté conectado)
  const form = document.querySelector('.cta__form');
  if (form && form.action.includes('REEMPLAZAR')) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const original = btn.textContent;
      btn.textContent = '✓ Enviado — te llamamos pronto';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; form.reset(); }, 3500);
    });
  }
})();
