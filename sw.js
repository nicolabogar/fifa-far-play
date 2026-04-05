const CACHE = 'futmanager-v3-' + new Date().toISOString().slice(0,10);
const ARQUIVOS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Deixa requisições de API e auth passarem direto (network only)
  if (url.includes('firebase') || url.includes('google') || url.includes('gstatic') || url.includes('flagcdn') || url.includes('/__/auth')) {
    return;
  }

  // Network-first para HTML/navegação (sempre busca versão mais nova)
  if (e.request.mode === 'navigate' || url.endsWith('.html') || url.endsWith('/')) {
    e.respondWith(
      fetch(e.request)
        .then(resp => {
          // Só cache se for sucesso
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
          }
          return resp;
        })
        .catch(() => caches.match(e.request).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  // Cache-first para assets estáticos
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
