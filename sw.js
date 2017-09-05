var DEFINE_CACHE = 'news-feed-v1.1',
    RUNTIME_CACHE = 'news-feed-runtime-v1.1';

var filesToCache = [
  '/',
  '/index.html',
  

  '/scripts/support.js',
  '/scripts/ajax.js',
  '/scripts/app.js',
  '/scripts/mvc/eventListener.js',
  '/scripts/mvc/model.js',
  '/scripts/mvc/view.js',
  '/scripts/mvc/controller.js',


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
    console.log('[ServiceWorker] Install');
  // Perform install steps
  event.waitUntil(
    caches.open(DEFINE_CACHE)
      .then(function(cache ) {
        //console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(filesToCache);
      })
     .then(self.skipWaiting())
  );
});

self.addEventListener('activate', function(event) {
   var cacheWhitelist = [DEFINE_CACHE, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          
          if (cacheWhitelist.indexOf(cacheName) === -1) {
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
  
    event.respondWith(
      caches.match(event.request).then(function(response) {

            if(response){
                return response;
            }else{
               return requestFromNetwork(event);
            }
            

         })
    );
});

function requestFromNetwork(event){
    var url = event.request.clone();
  
    return fetch(url).then(function(res){
        //if not a valid response send the error
        
        if(!res || res.status !== 200){
           
            return res;
        }
        
        var response = res.clone();

        caches.open(RUNTIME_CACHE).then(function(cache){
            cache.put(event.request, response);
        });
   
        return res;
    })
}

