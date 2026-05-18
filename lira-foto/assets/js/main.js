/* ============================================
   Lira · main.js
   Navbar shadow · scroll-reveal · parallax hero ·
   image lazy fade-in · smooth-scroll · año dinámico
   ============================================ */

(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Año dinámico --- */
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  /* --- Navbar: sombra al hacer scroll --- */
  const nav = document.querySelector('[data-nav]');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Scroll reveal vía IntersectionObserver ---
     Cubre [data-reveal], [data-reveal-h1] y [data-reveal-hero]. */
  const reveals = document.querySelectorAll(
    '[data-reveal], [data-reveal-h1], [data-reveal-hero]'
  );
  if (reveals.length && !prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* --- Hero parallax sutil (translateY 25% más lento que el scroll,
         máx 60px). Aplicado al <figure> contenedor; la <img> interna
         conserva su animación ken-burns intacta. --- */
  const parallaxFigure = document.querySelector('.hero__figure');
  if (parallaxFigure && !prefersReduced) {
    const factor = 0.25;
    const maxOffset = 60; // px
    let ticking = false;
    let figTop = 0;
    let figHeight = 0;

    const measure = () => {
      const rect = parallaxFigure.getBoundingClientRect();
      figTop = rect.top + window.scrollY;
      figHeight = rect.height;
    };

    const update = () => {
      ticking = false;
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      // Solo aplica cuando la figura está visible (rango de scroll relevante)
      if (scrollY + viewportH < figTop || scrollY > figTop + figHeight) return;

      // Desplazamiento relativo: cuántos px ha scrolleado desde la pos. inicial.
      let offset = scrollY * factor;
      if (offset > maxOffset) offset = maxOffset;
      if (offset < -maxOffset) offset = -maxOffset;
      parallaxFigure.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { measure(); update(); }, { passive: true });
    // will-change solo durante movimiento — la figura ya tiene overflow:hidden,
    // marcamos will-change como hint persistente solo si hay parallax activo.
    parallaxFigure.style.willChange = 'transform';
  }

  /* --- Image lazy fade-in: añade .is-loaded cuando termina de cargar --- */
  const fadeImgs = document.querySelectorAll('img[data-img-fade]');
  fadeImgs.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('is-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
      img.addEventListener('error', () => img.classList.add('is-loaded'), { once: true });
    }
  });

  /* --- Smooth scroll para enlaces internos (respeta reduced-motion) --- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });
})();
