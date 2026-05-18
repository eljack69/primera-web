# Manu Selva — landing demo Amazonía peruana

Página de aterrizaje **estática** inspirada en un mockup de agencia de viajes
con tema verde bosque y acento rojo. Foco en la Amazonía peruana (Manu,
Tambopata, Pacaya-Samiria, Madre de Dios).

Stack: HTML5 + CSS moderno (custom properties + grid) + JS vanilla. Sin build step.

## Demo

- URL pública: https://eljack69.github.io/kalimantan-travel/
  (el slug se conserva por compatibilidad; la marca pública es **Manu Selva**.)

## Estructura

```
kalimantan-travel/
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── img/             # vacío — imágenes desde Unsplash CDN
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── README.md
```

## Aviso

- Marca ("Manu Selva"), handle de instagram, lead y números de día son **ficticios** /
  placeholder.
- Las imágenes vienen de Unsplash CDN; reemplazar por fotografía propia con licencia
  antes de producción.
- Los thumbnails de la sección "Viaja en bote por la selva viva" abren un modal con la
  imagen, no son videos reales — sustituir por iframes de YouTube/Vimeo cuando aplique.

## Reutilizar

1. `index.html`: cambia copy, nombres de lugares, handle de instagram.
2. `assets/css/styles.css`: paleta en `:root` (`--c-page`, `--c-red`, `--c-fg`).
3. `assets/js/main.js`: lógica del paginador 18-22 (autoplay 5 s) y del modal.
