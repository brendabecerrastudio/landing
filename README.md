# Brenda Becerra Studio — landing

Landing estática (HTML/CSS/JS) con Netlify Functions para la API de Conversiones de Meta.

```
/
├── index.html                    landing principal
├── 404.html
├── privacidad/index.html         política de privacidad
├── robots.txt · sitemap.xml
├── assets/js/tracking.js         pixel + eventos (Contact en WhatsApp)
├── netlify/functions/
│   ├── capi.js                   relevo de eventos a Meta (CAPI)
│   └── uptime-check.js           aviso si el sitio se cae (cada 15 min)
├── netlify.toml
└── README-tracking.md            pasos para activar el pixel
```

Deploy: GitHub → Netlify (build vacío, publish directory `/`). Ver `README-tracking.md`.
