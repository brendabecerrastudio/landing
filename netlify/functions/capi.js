// Relevo de eventos del navegador hacia la API de conversiones de Meta (CAPI).
// Variables en Netlify: META_PIXEL_ID, META_ACCESS_TOKEN (nunca en el código).
const GRAPH_VERSION = 'v21.0';
const HOSTS_PERMITIDOS = ['brendabecerra.studio', 'www.brendabecerra.studio'];

function hostDe(url) { try { return new URL(url).hostname; } catch (e) { return ''; } }

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const PIXEL_ID = process.env.META_PIXEL_ID;
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
  if (!PIXEL_ID || !ACCESS_TOKEN) return { statusCode: 500, body: JSON.stringify({ error: 'Faltan META_PIXEL_ID o META_ACCESS_TOKEN en Netlify' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, body: '{"error":"JSON inválido"}' }; }
  const { event_name, event_id, event_source_url, fbp, fbc, custom_data } = body;

  if (!event_name || !/^[A-Za-z0-9_]{2,50}$/.test(event_name) || !event_id || String(event_id).length > 120)
    return { statusCode: 400, body: '{"error":"event_name o event_id inválido"}' };
  if (!HOSTS_PERMITIDOS.includes(hostDe(event_source_url)))
    return { statusCode: 403, body: '{"error":"Origen no permitido"}' };

  const h = event.headers || {};
  const userData = {
    client_ip_address: h['x-nf-client-connection-ip'] || (h['x-forwarded-for'] || '').split(',')[0].trim() || undefined,
    client_user_agent: h['user-agent'],
  };
  if (fbp) userData.fbp = String(fbp);
  if (fbc) userData.fbc = String(fbc);

  let cd;
  if (custom_data && typeof custom_data === 'object') {
    cd = {};
    Object.keys(custom_data).slice(0, 25).forEach((k) => {
      const v = custom_data[k];
      if (['string', 'number', 'boolean'].includes(typeof v)) cd[k] = typeof v === 'string' ? v.slice(0, 200) : v;
    });
  }
  const payload = { data: [{
    event_name, event_time: Math.floor(Date.now() / 1000), event_id: String(event_id),
    event_source_url, action_source: 'website', user_data: userData,
    ...(cd && Object.keys(cd).length ? { custom_data: cd } : {}),
  }] };

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ACCESS_TOKEN}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) console.error('Error CAPI Meta:', JSON.stringify(data));
    return { statusCode: res.ok ? 200 : 400, body: JSON.stringify(data) };
  } catch (err) {
    console.error('Error llamando a CAPI:', err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
