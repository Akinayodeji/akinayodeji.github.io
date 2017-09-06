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
        
        if(networkStatus && networkStatus !== "undefined"){
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

        }else{
            this.getCachedData();
        }
        
     },
     
     getCachedData: function(){
        var message = "OFFLINE MODE";
        var _this = this;

        var cacheUrl = "https://newsapi.org/v1/articles?apiKey=639cdf8c0ccc40f1b3fa372dee4fcb0a&source=techcrunch&sortBy=top";
       
        
        if ('caches' in window) {
            
            caches.match(cacheUrl).then(function(response) {

                if (response) {
                        response.json().then(function updateFromCache(json) { 
                        _this.cachedData.notify( json );
                    });
                }else{
                       _this.cachedData.notify( false );
                        console.log( message );
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