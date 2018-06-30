var curConCacheName = 'currency-converter-v1'

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(curConCacheName).then(function (cache) {
            return cache.addAll([
                '/index.html',
                '/bundle.js',
                'https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css'
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    var requestUrl = new URL(event.request.url);

    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
            event.respondWith(caches.match('/index.html'));
            return;
        }

        if (requestUrl.pathname.startsWith('/api/v5/convert')) {
            console.log("convert values")
            return;
        }
    }

    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});