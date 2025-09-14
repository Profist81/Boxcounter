const CACHE='bcm-v30';
const CORE=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE&&caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  e.respondWith(
    caches.match(r).then(hit=>hit||fetch(r).then(res=>{
      try{ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(r,copy)); }catch(_){}
      return res;
    }).catch(()=>hit||new Response('Offline',{status:503})))
  );
});
