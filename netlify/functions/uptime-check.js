// Monitoreo de caídas. Netlify lo ejecuta cada 15 min (ver netlify.toml).
// Si el sitio no responde, avisa por ntfy.sh (gratis, sin cuenta).
// Para recibir el aviso: instalá la app "ntfy" y suscribite al topic de abajo.
// Cambiá el topic por uno propio y difícil de adivinar.
const SITE_URL = 'https://brendabecerra.studio/';
const NTFY_TOPIC = 'bb-uptime-CAMBIAR-ESTE-TEXTO';

exports.handler = async function () {
  try {
    const res = await fetch(SITE_URL, { redirect: 'follow' });
    if (!res.ok) await notify('brendabecerra.studio respondió con código ' + res.status + '. Revisá Netlify.');
  } catch (err) {
    await notify('brendabecerra.studio no respondió (' + (err && err.message ? err.message : 'sin conexión') + '). Revisá Netlify.');
  }
  return { statusCode: 200, body: 'ok' };
};
async function notify(message) {
  try { await fetch('https://ntfy.sh/' + NTFY_TOPIC, { method: 'POST', headers: { Title: 'Brenda Becerra Studio podria estar caido' }, body: message }); } catch (e) {}
}
