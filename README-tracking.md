# Tracking — Brenda Becerra Studio

El código ya está instalado. Faltan 3 pasos tuyos (los secretos NUNCA van al repo).

## 1. Pixel ID
1. business.facebook.com/events_manager → tu pixel (o "Conectar orígenes de datos" → Web → crear).
2. Copiá el **ID del pixel** (número de ~15-16 dígitos).
3. En `index.html` buscá `TU_PIXEL_ID` y reemplazalo (aparece 2 veces dentro del bloque TRACKING).

## 2. Verificar el dominio
Events Manager / Configuración del negocio → Seguridad de la marca → Dominios → agregar `brendabecerra.studio` y verificar (meta-tag o DNS en GoDaddy).

## 3. API de Conversiones (CAPI)
1. Events Manager → tu pixel → Configuración → API de conversiones → **Generar token de acceso**.
2. Netlify → Site configuration → Environment variables:
   - `META_PIXEL_ID` = el mismo ID
   - `META_ACCESS_TOKEN` = el token (pegalo vos, no lo compartas en el chat)
3. Redeploy.

## Eventos que se envían
| Evento | Cuándo | Para qué |
|---|---|---|
| PageView | al cargar | base |
| Contact | clic en cualquier botón a WhatsApp | evento de optimización de la campaña (Clic a WhatsApp) |
| vio_precios | llega a la sección de precios | audiencia de retargeting caliente |
| vio_testimonios | llega a los testimonios | audiencia de retargeting |

Todos se mandan por el navegador y por servidor con el mismo `event_id` (Meta los deduplica).

## Probar
Events Manager → Probar eventos → pegá `https://brendabecerra.studio` → tocá un botón de WhatsApp: debe aparecer `Contact` con "Navegador" y "Servidor".

## Monitoreo
`netlify/functions/uptime-check.js` revisa el sitio cada 15 min. Cambiá `NTFY_TOPIC` por un texto propio y suscribite en la app ntfy.

## Seguridad
Este repo es público: no pongas tokens, contraseñas ni claves aquí. El Pixel ID sí puede ser público.
