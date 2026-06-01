// We maken er 'v2' van, zodat de app weet dat er bestanden zijn bijgewerkt!
const CACHE_NAME = 'kogeldruk-v2'; 

// Hier staan nu ook je twee iconen veilig in de lijst
const bestandenOmTeCachen = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Installatie: Sla de app-bestanden lokaal op de telefoon op
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Zorgt dat een eventuele nieuwe versie direct klaarstaat
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(bestandenOmTeCachen);
            })
    );
});

// Activatie: Ruim oude versies op
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((oudeCache) => {
                    if (oudeCache !== CACHE_NAME) {
                        return caches.delete(oudeCache); // Gooi de oude app-bestanden weg
                    }
                })
            );
        })
    );
    return self.clients.claim(); // Zorgt dat de nieuwe versie direct de leiding neemt
});

// Ophalen (Fetch): Het update-mechanisme
self.addEventListener('fetch', (event) => {
    event.respondWith(
        // Probeer ALTIJD eerst de bestanden van het internet (live) te halen
        fetch(event.request).catch(() => {
            // Lukt dat niet (bijv. geen internet)? Pak dan de opgeslagen versie van de telefoon
            return caches.match(event.request);
        })
    );
});