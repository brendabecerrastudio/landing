/* Tracking de Brenda Becerra Studio.
   - Dispara eventos del Pixel y los repite por servidor (CAPI) con el MISMO event_id,
     así Meta los cuenta una sola vez aunque el navegador bloquee el pixel.
   - Mientras window.BB_PIXEL_ID sea 'TU_PIXEL_ID' no envía nada. */
(function () {
  var ID = window.BB_PIXEL_ID;
  if (!ID || ID === 'TU_PIXEL_ID') return;

  function cookie(n) {
    var m = document.cookie.match('(?:^|; )' + n + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : '';
  }
  function eventId(p) { return p + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10); }
  function fbc() {
    var c = cookie('_fbc'); if (c) return c;
    var m = location.search.match(/[?&]fbclid=([^&]+)/);
    return m ? 'fb.1.' + Date.now() + '.' + m[1] : '';
  }
  function server(name, id, data) {
    var body = JSON.stringify({
      event_name: name, event_id: id, event_source_url: location.href,
      fbp: cookie('_fbp'), fbc: fbc(), custom_data: data || {}
    });
    try {
      if (navigator.sendBeacon) { navigator.sendBeacon('/api/capi', new Blob([body], { type: 'application/json' })); return; }
    } catch (e) {}
    try { fetch('/api/capi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true }); } catch (e) {}
  }
  function track(name, data, standard) {
    var id = eventId(name);
    try { window.fbq(standard === false ? 'trackCustom' : 'track', name, data || {}, { eventID: id }); } catch (e) {}
    server(name, id, data);
  }

  // Clic en cualquier botón/enlace a WhatsApp (incluye los armados por JS): evento Contact
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (!a) return;
    var label = (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    track('Contact', { content_name: label, canal: 'whatsapp' });
  }, true);

  // Interés: vio la sección de precios / de testimonios (una sola vez por visita)
  function once(sel, name) {
    var el = document.querySelector(sel);
    if (!el || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { io.disconnect(); track(name, {}, false); }
    }, { threshold: 0.4 });
    io.observe(el);
  }
  once('#prices', 'vio_precios');
  once('#track', 'vio_testimonios');

  window.BB = { track: track };
})();
