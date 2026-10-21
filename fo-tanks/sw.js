const V='fo-v1';
const PREFIX='fo-';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-512.png'];
const SCOPE=new URL('./',self.location).pathname;
const EXCLUDE=[];
function mine(u){
  if(u.origin!==self.location.origin||u.pathname.indexOf(SCOPE)!==0)return false;
  for(const x of EXCLUDE){if(u.pathname.indexOf(SCOPE+x)===0)return false;}
  return true;
}
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(FILES.map(f=>c.add(new Request(f,{cache:'reload'}))))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.indexOf(PREFIX)===0&&x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(!mine(new URL(e.request.url)))return;
  e.respondWith(caches.open(V).then(c=>c.match(e.request,{ignoreSearch:true})).then(r=>r||fetch(e.request).then(n=>{if(n.ok){const cp=n.clone();caches.open(V).then(c=>c.put(e.request,cp));}return n}).catch(()=>caches.open(V).then(c=>c.match('./index.html')))));
});
