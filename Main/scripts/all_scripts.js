(function(){
     var appController = function(model, view){
    this.model = model;
    this.view = view;
    _this = this;
   
    window.addEventListener('load', function() {
      
        if(navigator.onLine)
        {
         _this.view.onlineNote.notify();
           _this.newData();
        }
        else
        {
           _this.view.offlineNote.notify();
           _this.savedData();
           
        }
     });

};

appController.prototype = {

    newData: function () {
        this.model.getNewData();
    },
    savedData: function () {
        this.model.getSavedData();
    },
     
    
    
}


function appModel() {
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

 var EventListener = function (sender) {
    this._sender = sender;
    this._listeners = [];
}

EventListener.prototype = {

    attach: function (listener) {
        this._listeners.push(listener);
    },

    notify: function (args) {
        for (var i = 0; i < this._listeners.length; i += 1) {
            this._listeners[i](this._sender, args);
        }
    }

};



var appView = function(model, elements) {
    this._model = model;
    this._elements = elements;
    this.offlineNote = new EventListener();
    this.onlineNote = new EventListener();

    this.datafilter = new Event(this);
   
    var _this = this;
     
    // attach model listeners
    this._model.newData.attach(function ( sender , feedback ) {
        _this.retrieveAndDisplay( feedback );
    });
    
    this._model.savedData.attach(function ( sender, feedback) {
        _this.retrieveAndDisplay( feedback );
    });
    
    //offline and online onlineNote
         this.offlineNote.attach(function(){
               // console.log("you are currently offline");
                _this.networkFeedback( "#f50057","Offline Mode")
            });

         this.onlineNote.attach(function(){
                _this.networkFeedback("#76ff03", "Online mode")
            });


}

appView.prototype = {
    show: function(){
        this.showLoader();
    },
    showLoader: function(){
        document.querySelector(this._elements.loading).style.display = "block";
        document.querySelector(this._elements.temp).style.display = "none";
    },
    hideLoader: function(){
      document.querySelector(this._elements.loading).style.display = "none";
      document.querySelector(this._elements.temp).style.display = "flex"
    },
    networkFeedback: function( color, msg ){
        document.querySelector(this._elements.networkMode).innerHTML =  msg;
        document.querySelector(this._elements.networkMode).style.color =  color;
        document.querySelector(this._elements.networkMode).style["transform"] = "translateY(0)";
    },
    retrieveAndDisplay: function( feedback ){
        if(feedback){
            this.displayData( feedback ) ;
            this.hideLoader();
        }else{
            this.hideLoader();
            document.querySelector(this._elements.shell).innerHTML = 
            `<div class='error-msg'>
              Couldn't retrieve data at this time.. check your network conection and try again 
            </div>
            `
        }
    },
    
    displayData: function( data ){
        var scriptTemplate = document.querySelector(this._elements.scriptTemplate).innerHTML;
        var compiledTemplate = Handlebars.compile(scriptTemplate);
        var generatedHtml = compiledTemplate( data );

        var template = document.querySelector(this._elements.temp);
        template.innerHTML = generatedHtml;
    }
}

     var model = new appModel(),
         view = new appView(model, {
             "loading":".loading",
             "temp": ".template",
             "networkMode":".network-mode",
             "scriptTemplate":"#scriptTemplate",
             "shell":".shell",
         }),
         
         controller = new appController(model, view);
         
         view.show();
    /*
       @service workers
       check and register for it ....
    */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('./sw.js').then(function(registration) {
            // Registration was successful
           // console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
            // registration failed :(
           // console.log('ServiceWorker registration failed: ', err);
            });
        });
   }else{
        console.log("Service worker not supported")
    }
    
    /*
      @end
    */
     
})();
