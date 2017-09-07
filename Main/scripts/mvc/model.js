function appModel() {
     this.data= null;
     this.default = "top";
     this.cachedData = new EventListener(this);
     this.newData = new EventListener( this);
 };

 appModel.prototype = {
      
     getNewData: function ( networkStatus , args ) {

         if(args !== "undefined"){
            this.data = args.sortBy;
            this.saveFilter( args );
         }else{
             this.data = this.default;
         }
         var _this = this;
         var url = "https://newsapi.org/v1/articles";
            
        /*
       * Check if the service worker has already cached this city's weather
       * data. If the service worker has the data, then display the cached
       * data while the app fetches the latest data.
       */
            this.getCachedData();
        /*
       *fetch new data wh you display cached dta...
       */
       
            ajax.get(url, {
                "apiKey": "639cdf8c0ccc40f1b3fa372dee4fcb0a",
                "source": "techcrunch",
                "sortBy": this.data,
            })
            .success(function( success ){
                _this.newData.notify( success );
            })
            .error(function( error ){
                _this.newData.notify( false );
            });
        
     },
     
     getCachedData: function(){
        var message = "OFFLINE MODE";
        var _this = this;

        var cacheUrl = "https://newsapi.org/v1/articles?apiKey=639cdf8c0ccc40f1b3fa372dee4fcb0a&source=techcrunch&sortBy="+this.data;
       
        
        if ('caches' in window) {
            
            caches.match(cacheUrl).then(function(response) {

                if (response) {
                     response.json().then(function updateFromCache(json) { 
                    _this.cachedData.notify( json );
                    });
                }
            });
          }
        
     },

     saveFilter: function( data ){
         if (!('indexedDB' in window)) {
            console.log('This browser doesn\'t support IndexedDB..oops you are missing the awesomeness of this app. try using a different browser');
            return;
         }

        var indexedDB = window.indexedDB || 
                        window.mozIndexedDB || 
                        window.webkitIndexedDB || 
                        window.msIndexedDB || 
                        window.shimIndexedDB;
         
     },

     

 };