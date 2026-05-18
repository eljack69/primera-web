# Hatun Perú — landing demo

Página de aterrizaje **estática** para una agencia ficticia de viajes de **lujo
curado en Perú** (Belmond, Hiram Bingham, helicóptero a Machu Picchu, hoteles 5*
en Cusco, Lima y Valle Sagrado). Hereda el mockup oscuro con acento dorado.
Stack: HTML5 + CSS moderno + JS vanilla. Sin build step.

> Slug y URL pública NO cambian — se conservan como `komodo-travel/` por compatibilidad
> con el despliegue existente en GitHub Pages.

## Demo

- URL pública: https://eljack69.github.io/komodo-travel/

## Estructura

```
komodo-travel/
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── img/                # vacío — imágenes vía Unsplash CDN
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── README.md
```

## Aviso importante

- Marca, datos de contacto, dirección, teléfono y testimonios son **ficticios**.
- Las imágenes se sirven desde Unsplash con su CDN público; reemplázalas por
  fotografía propia con licencia antes de usar en producción.
- El formulario de búsqueda es **demo** (no envía a ningún motor de reservas).

## Reutilizar para un cliente real

1. Cambia textos en `index.html` (logo, copy de hero, paquetes, testimonios, footer).
2. Sustituye imágenes: reemplaza URLs de `https://images.unsplash.com/...` por
   archivos en `assets/img/` y referencias relativas.
3. Cambia paleta editando las custom properties al inicio de `assets/css/styles.css`
   (variables `--c-gold`, `--c-bg`, etc.).
4. Conecta el formulario `#booking` a Formspree, Getform u otro endpoint real.
