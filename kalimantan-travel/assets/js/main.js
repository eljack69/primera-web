// Selva Travel — Kalimantan landing
(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menú móvil
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("menu");
  toggle?.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    })
  );

  // Paginador vertical (18..22): se mueve solo cada 5s, click para fijar
  const pagerBtns = document.querySelectorAll(".hero__pager button");
  let pagerIdx = Array.from(pagerBtns).findIndex((b) => b.classList.contains("is-active"));
  if (pagerIdx < 0) pagerIdx = 2;
  let pagerTimer = null;

  function setPager(i) {
    pagerIdx = ((i % pagerBtns.length) + pagerBtns.length) % pagerBtns.length;
    pagerBtns.forEach((b, idx) => {
      b.classList.toggle("is-active", idx === pagerIdx);
      if (idx === pagerIdx) b.setAttribute("aria-current", "true");
      else b.removeAttribute("aria-current");
    });
  }
  function startPagerAuto() {
    clearInterval(pagerTimer);
    pagerTimer = setInterval(() => setPager(pagerIdx + 1), 5000);
  }
  pagerBtns.forEach((b, i) =>
    b.addEventListener("click", () => {
      setPager(i);
      startPagerAuto();
    })
  );
  if (pagerBtns.length) startPagerAuto();

  // Swipe button → siguiente día
  document.querySelector(".hero__swipe")?.addEventListener("click", () => {
    setPager(pagerIdx + 1);
    startPagerAuto();
  });

  // Video thumbs → abrir modal con la imagen
  const modal = document.getElementById("videoModal");
  const modalImg = document.getElementById("modalImg");
  function openModal(src, alt) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = alt || "";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    modalImg.src = "";
    document.body.style.overflow = "";
  }
  document.querySelectorAll(".video-thumb").forEach((btn) => {
    btn.addEventListener("click", () => {
      const img = btn.querySelector("img");
      if (!img) return;
      // versión más grande de la imagen Unsplash
      const big = img.src.replace(/w=\d+/, "w=1600");
      openModal(big, btn.getAttribute("aria-label") || "");
    });
  });
  modal?.addEventListener("click", (e) => {
    if (e.target.matches("[data-close]")) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  // Nav: resaltar enlace según sección visible
  const sections = ["inicio", "islas", "bosque"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const links = document.querySelectorAll(".nav__link");
  const linkMap = {
    inicio: ["#mar", "#inicio"],
    islas: ["#islas"],
    bosque: ["#bosque"],
  };
  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.id;
          const matchHrefs = linkMap[id] || [];
          links.forEach((l) => {
            l.classList.toggle("is-active", matchHrefs.includes(l.getAttribute("href")));
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }
})();
