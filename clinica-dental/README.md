# Clínica Dental — Plantilla demo

Landing estática de demostración (odontología) generada con el skill `web-pages` de Claude Code.

**Contenido 100% ficticio** — marca "SonrisaClara", testimonios, dirección y horario son placeholders.

**Stack**: HTML5 + CSS moderno (custom properties, grid) + JS vanilla. Tipografía Google Fonts (Fraunces + Inter). Imágenes Unsplash.

**Publicada en**: https://eljack69.github.io/clinica-dental/

## Estructura
```
.
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── img/
└── favicon.svg
```

## Personalizar
- Reemplazar marca, dirección, teléfono, horario en `index.html`.
- Sustituir fotos Unsplash por imágenes propias (subir a `assets/img/`).
- Cambiar paleta editando los tokens en `:root` de `styles.css`.
- Activar formulario reemplazando `REEMPLAZAR` por endpoint real de Formspree.
- Quitar el `<div class="demo-banner">` cuando el contenido sea real.
- Eliminar `<meta name="robots" content="noindex,nofollow">` para que Google la indexe.
