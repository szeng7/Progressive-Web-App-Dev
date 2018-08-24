var cacheName = 'hello-world-page';
var filesToCache = [
  '/',
  '/index.html',
];

/* Install event:
 * triggered after browser registers service worker
 */
self.addEventListener('install', function(e) {
  //once installed, fetch all files to add to cache (for offline capability)
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Activate event:
 * Makes sure that clients are controlled after service worker is activated
 * If not here, possibility for sub-resources/part of page to not show 
 */
self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

/* Fetch event (any request made within that page): 
 * this tries to look for something in cache that matches
 * if it fails, we'll use the network
 */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});