/* ============================================================
   Mesa 9 — main.js
   Vanilla. Sin dependencias.
   ============================================================ */
(function () {
  'use strict';

  // 1. Año dinámico en footer
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Navbar blur al hacer scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 24) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // 3. Menú móvil
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      })
    );
  }

  // 4. Scroll reveal con IntersectionObserver
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reduced && 'IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // 5. Reveal individual de cada plato (hairlines scaleX 0→1)
  const dishes = document.querySelectorAll('.dish');
  if (!reduced && 'IntersectionObserver' in window && dishes.length) {
    const ioDish = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            ioDish.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' }
    );
    dishes.forEach((el) => ioDish.observe(el));
  } else {
    dishes.forEach((el) => el.classList.add('is-visible'));
  }

  // 6. Marcar precios placeholder ("—") para que aparezcan al hover
  document.querySelectorAll('.dish__price').forEach((el) => {
    const txt = (el.textContent || '').trim();
    if (txt === '—' || txt === '-' || txt === '') {
      el.classList.add('dish__price--hidden');
    }
  });

  // 7. Parallax sutil del hero (imagen viaja un 30% más lenta que el scroll)
  const heroImg = document.querySelector('.hero__media img');
  const hero = document.querySelector('.hero');
  if (!reduced && heroImg && hero && 'requestAnimationFrame' in window) {
    const MAX = 80; // px máx de desplazamiento
    const FACTOR = 0.3;
    let ticking = false;

    const update = () => {
      const rect = hero.getBoundingClientRect();
      // Sólo trabajamos mientras el hero se ve o está cerca
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
        ticking = false;
        return;
      }
      // scrollY relativo al inicio del hero
      const scrolled = Math.max(0, -rect.top);
      let y = scrolled * FACTOR;
      if (y > MAX) y = MAX;
      heroImg.style.setProperty('--parallax-y', y.toFixed(1) + 'px');
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }
})();
