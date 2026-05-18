// Komodo Travel — interacciones mínimas
(() => {
  // Año dinámico en footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menú móvil
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("menu");
  toggle?.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  // Cerrar menú al hacer clic en enlace (móvil)
  menu?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    })
  );

  // Resaltado del enlace activo en nav según sección visible
  const sections = ["inicio", "paquetes", "promo", "galeria", "contacto"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const links = document.querySelectorAll(".nav__link");
  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.id;
          links.forEach((l) => {
            const isActive = l.getAttribute("href") === `#${id}`;
            l.classList.toggle("is-active", isActive);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }

  // Fechas mínimas razonables en booking
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById("checkin")?.setAttribute("min", today);
  document.getElementById("checkout")?.setAttribute("min", today);

  // Carrusel de testimonios
  const testimonios = [
    {
      name: "Febrián",
      text: "El itinerario en Bali superó cualquier expectativa: cada chofer, cada villa, cada cena privada estaba pensada al detalle. Volveremos sí o sí.",
    },
    {
      name: "Mariana",
      text: "Hicimos Komodo y Flores con guía privado. Komodo Travel resolvió permisos, barco y vuelos internos sin un solo tropiezo. Lo recomendaría sin pensarlo.",
    },
    {
      name: "Andrés",
      text: "Buscaba una luna de miel diferente y nos diseñaron una ruta por Bangkok, Chiang Mai y Phuket impecable. Comunicación 10/10 antes y durante el viaje.",
    },
  ];
  const textEl = document.getElementById("testimonyText");
  const nameEl = document.getElementById("testimonyName");
  const avatars = document.querySelectorAll(".avatar");
  let activeIdx = 0;
  let autoTimer = null;

  function setTestimony(i) {
    activeIdx = i;
    const t = testimonios[i];
    if (!t) return;
    if (textEl) {
      textEl.style.opacity = "0";
      setTimeout(() => {
        textEl.textContent = t.text;
        nameEl && (nameEl.textContent = t.name);
        textEl.style.transition = "opacity .4s ease";
        textEl.style.opacity = "1";
      }, 160);
    }
    avatars.forEach((a) =>
      a.classList.toggle("is-active", Number(a.dataset.index) === i)
    );
  }
  avatars.forEach((a) =>
    a.addEventListener("click", () => {
      setTestimony(Number(a.dataset.index));
      restartAuto();
    })
  );
  function restartAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(
      () => setTestimony((activeIdx + 1) % testimonios.length),
      6000
    );
  }
  if (testimonios.length) restartAuto();

  // Botones de paginación de paquetes (visuales — toggle activo)
  document.querySelectorAll(".packages__dots .dot").forEach((d) => {
    d.addEventListener("click", () => {
      document
        .querySelectorAll(".packages__dots .dot")
        .forEach((x) => x.classList.remove("is-active"));
      d.classList.add("is-active");
    });
  });
})();
