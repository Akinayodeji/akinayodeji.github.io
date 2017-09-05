var appModel = function () {
     this.data = [];
     this.savedData = new EventListener(this);
     this.newData = new EventListener( this);
     
     
 };

 appModel.prototype = {
      
     getNewData: function () {
         var _this = this;
         var url = "https://newsapi.org/v1/articles";
        
         ajax.get(url, {
             "apiKey": "639cdf8c0ccc40f1b3fa372dee4fcb0a",
             "source": "techcrunch",
             "sortBy": "top",
         })
         .success(function( success ){
            _this.newData.notify( success );
         })
         .error(function( error ){
            _this.newData.notify( false );
            console.log("OOPS");
         });
       
     },
     
     getSavedData: function(){
        var message = "OFFLINE MODE";
        var cacheUrl = "https://newsapi.org/v1/articles?apiKey=639cdf8c0ccc40f1b3fa372dee4fcb0a&source=techcrunch&sortBy=top";
        var _this = this;
            // TODO add cache logic here
        if ('caches' in window) {
            
            caches.match(cacheUrl).then(function(response) {
                console.log(response);
                if (response) {
                    response.json().then(function updateFromCache(json) {
                         console.log(json);
                        _this.newData.notify( json );
                    });
                }else{
                       _this.newData.notify( false );
                }
            });
          }
        
     },

     saveSelectedData: function(){
        
     },

     

 };