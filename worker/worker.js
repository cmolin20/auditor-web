// Intermediari de l'Auditor web de centre.
// Descarrega fitxers públics de webs WordPress/Nodes perquè l'eina (a GitHub Pages)
// en pugui llegir les metadades. No és un proxy obert:
//  - GET només per a fitxers de /wp-content/uploads/ (PDF, imatges, documents)
//  - HEAD (només l'estat, sense contingut) per comprovar enllaços interns
//  - només respon a l'origen configurat a ALLOWED_ORIGIN
//  - limita la mida de cada descàrrega

const MAX_BYTES = 25 * 1024 * 1024;

export default {
  async fetch(req, env) {
    const allowed = (env.ALLOWED_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : (allowed[0] || ''),
      'Access-Control-Allow-Headers': 'Range',
      'Access-Control-Expose-Headers': 'Content-Range, X-Status',
      'Vary': 'Origin',
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (allowed.length && !allowed.includes(origin)) return new Response('Origen no permès', { status: 403, headers: cors });

    const p = new URL(req.url).searchParams;
    let target;
    try { target = new URL(p.get('u') || ''); } catch { return new Response('Falta u', { status: 400, headers: cors }); }
    if (target.protocol !== 'https:' && target.protocol !== 'http:') return new Response('URL no vàlida', { status: 400, headers: cors });

    const ua = { 'User-Agent': 'AuditorWebCentre/2.0 (+revisio de webs educatives)' };

    if (p.get('m') === 'head') {
      let r = await fetch(target, { method: 'HEAD', headers: ua, redirect: 'follow' });
      if (r.status === 405) r = await fetch(target, { method: 'GET', headers: { ...ua, Range: 'bytes=0-0' }, redirect: 'follow' });
      return new Response(null, { status: 204, headers: { ...cors, 'X-Status': String(r.status) } });
    }

    if (!target.pathname.includes('/wp-content/uploads/')) return new Response('Només fitxers de wp-content/uploads', { status: 403, headers: cors });

    const range = req.headers.get('Range') || 'bytes=0-262143';
    const r = await fetch(target, { headers: { ...ua, Range: range }, cf: { cacheTtl: 3600, cacheEverything: true } });
    const len = +(r.headers.get('Content-Length') || 0);
    if (len > MAX_BYTES) return new Response('Fitxer massa gran', { status: 413, headers: cors });
    return new Response(r.body, {
      status: r.status,
      headers: { ...cors, 'Content-Type': r.headers.get('Content-Type') || 'application/octet-stream', 'Cache-Control': 'no-store' },
    });
  },
};
