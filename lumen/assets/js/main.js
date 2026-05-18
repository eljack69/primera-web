/* ============================================
   LÚMEN · main.js
   ============================================ */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Año dinámico ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 12) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    // Cerrar al hacer clic en un enlace
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal con stagger ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-reveal-delay');
          if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: mostrar todos
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Línea curva del ritual: dibujar al entrar ---------- */
  const ritualLines = document.querySelectorAll('[data-reveal-curve]');
  if (ritualLines.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    const ioCurve = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-drawn');
          ioCurve.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    ritualLines.forEach((el) => ioCurve.observe(el));
  } else {
    ritualLines.forEach((el) => el.classList.add('is-drawn'));
  }

  /* ---------- Estrellas de testimonios con stagger ---------- */
  const starGroups = document.querySelectorAll('[data-stars]');
  if (starGroups.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    const ioStars = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-lit');
          ioStars.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    starGroups.forEach((el) => ioStars.observe(el));
  } else {
    starGroups.forEach((el) => el.classList.add('is-lit'));
  }

  /* ---------- Newsletter (demo) ---------- */
  const form = document.querySelector('.news-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      if (input && input.value) {
        const original = btn.textContent;
        btn.textContent = 'Hecho ✓';
        btn.disabled = true;
        input.value = '';
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
        }, 2200);
      }
    });
  }

  /* ---------- Smooth scroll para anclas internas ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });
})();
