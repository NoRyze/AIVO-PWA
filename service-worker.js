// Service Worker minimal pour activer la PWA
self.addEventListener('install', (event) => {
    console.log("Service Worker installé");
    self.skipWaiting();
});

self.addEventListener('activate', (event) =>{
    console.log("Service Worker activé");
});

self.addEventListener('fetch', (event)=> {
    // Pour l'instant, on laisse passer toutes les requêtes
});