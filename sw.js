/* BuildX offline helper: saves the app on your phone so it opens without internet */
const CACHE='buildx-v5';
const FILES=['./','./index.html','./manifest.webmanifest','./icon2-192.png','./icon2-512.png','./icon2-maskable-192.png','./icon2-maskable-512.png','./apple-touch-icon2.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k.startsWith('buildx-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
/* try the internet first (so updates show up), fall back to the saved copy when offline */
/* only the app's own files: other sites (like the small AI download) are left alone */
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));});
