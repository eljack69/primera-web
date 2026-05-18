/* =========================================================
   Pulse — main.js
   - Sticky navbar shadow on scroll
   - Reveal on scroll (IntersectionObserver)
   - Dynamic copyright year
   - Smooth focus management
   ========================================================= */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -----------------------------------------------------
  // Navbar scroll state
  // -----------------------------------------------------
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 8) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // -----------------------------------------------------
  // Reveal on scroll
  // -----------------------------------------------------
  const revealTargets = document.querySelectorAll('.reveal');
  if (revealTargets.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    revealTargets.forEach((el) => io.observe(el));
  } else {
    // Fallback: show everything
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  // -----------------------------------------------------
  // Sparkline area chart — draw stroke once when in viewport
  // -----------------------------------------------------
  const chartLine = document.querySelector('.chart__line');
  if (chartLine && 'IntersectionObserver' in window && !prefersReducedMotion) {
    try {
      const len = chartLine.getTotalLength();
      chartLine.style.setProperty('--chart-len', len);
    } catch (_) { /* SVGGeometryElement unsupported — fallback to CSS default */ }
    const drawObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          chartLine.classList.add('is-drawn');
          drawObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    drawObs.observe(chartLine);
  } else if (chartLine) {
    // Fallback: show fully drawn
    chartLine.style.strokeDasharray = 'none';
    chartLine.style.strokeDashoffset = '0';
  }

  // -----------------------------------------------------
  // Dynamic year
  // -----------------------------------------------------
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // -----------------------------------------------------
  // Smooth anchor scroll (respects reduced motion)
  // -----------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });
})();
