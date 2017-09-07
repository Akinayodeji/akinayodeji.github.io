   var version = 'v0.1',
    DEFINE_CACHE = 'news-feed-'+version,
    RUNTIME_CACHE = 'news-feed-runtime-'+version;

var filesToCache = [
  '/',
  '/index.html',
  
  '/scripts/ajax.js',
  '/scripts/libs/handlebars-v4.0.10.js',
  '/scripts/libs/modernizr-custom.js',
  '/scripts/mvc/eventListener.js',
  '/scripts/mvc/model.js',
  '/scripts/mvc/view.js',
  '/scripts/mvc/controller.js',
  '/scripts/allScripts.js',
   '/scripts/app.js',
   '/scripts/support.js',


  '/styles/reset.css',
  '/styles/css.css',


  '/font2/ionicons-2.0.1/fonts/ionicons.eot?v=2.0.0',
  '/font2/ionicons-2.0.1/fonts/ionicons.eot?v=2.0.0#iefix',
  '/font2/ionicons-2.0.1/fonts/ionicons.ttf?v=2.0.0',
  '/font2/ionicons-2.0.1/fonts/ionicons.woff?v=2.0.0',
  '/font2/ionicons-2.0.1/fonts/ionicons.svg?v=2.0.0#Ionicons',
  '/font2/ionicons-2.0.1/css/ionicons.min.css',
 

  'manifest.json',
  'images/icons/icon1-512.png',
  'images/icons/icon-512.png',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(DEFINE_CACHE)
      .then(function(cache) {
        return cache.addAll(filesToCache);
          console.log('[ServiceWorker] Installed');
      })
     .then(self.skipWaiting())
  );
});

var expectedCaches = [
   DEFINE_CACHE, 
   RUNTIME_CACHE
  ];

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          
          if (expectedCaches.indexOf(cacheName) === -1) {
              console.log('deleted');
              return caches.delete(cacheName);
          }
        })
      );
    })
  );
 return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
   //  console.log(event.request);
    event.respondWith(
      caches.match(event.request).then(function(response) {
              return response || fetchAndCache(event)
         })
    );
});

function fetchAndCache(event){
    var url = event.request.clone();
  
    return fetch(url)
    .then(function(response){
      
       var res = response.clone();

       caches.open( RUNTIME_CACHE).then(function(cache) {
           cache.put(event.request.url, res);
        });

        return response;
         
    })
    .catch(function(error) {
      console.log('Request failed:', error);
   });

}

