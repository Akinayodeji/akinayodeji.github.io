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


 /*******************/
 /**    VIEW      ***\
  /************* */

  
var appView = function(model, elements) {
    this._model = model;
    this._elements = elements;
    this.isLoading = true;
    this.sortBy = new EventListener();
    this.offlineNote = new EventListener();
    this.onlineNote = new EventListener();

    this.datafilter = new Event(this);
   
    var _this = this;
     
    // attach model listeners
    this._model.newData.attach(function ( sender , feedback ) {
        _this.retrieveAndDisplay( feedback );
    });
    
    this._model.cachedData.attach(function ( sender, feedback) {
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
        //trigger events
        document.querySelector(this._elements.select).addEventListener("change", function(){
            _this.showLoader();
            _this.sortBy.notify({"sortBy": this.value});
        });

}

appView.prototype = {
    showLoader: function(){
        if(!this.isLoading){
           document.querySelector(this._elements.loading).removeAttribute('hidden');
           document.querySelector(this._elements.container).setAttribute('hidden', true);
           document.querySelector(this._elements.error).setAttribute('hidden', true);
           this.isLoading = true;
        }
    },
    hideLoader: function(){
      if(this.isLoading){
          document.querySelector(this._elements.loading).setAttribute('hidden', true);
          document.querySelector(this._elements.container).removeAttribute('hidden');
          document.querySelector(this._elements.error).setAttribute('hidden', true);
          this.isLoading = false;
        }
    },
    networkFeedback: function( color, msg ){
        var _this = this;
        document.querySelector(this._elements.networkMode).innerHTML =  msg;
        document.querySelector(this._elements.networkMode).style.color =  color;
        document.querySelector(this._elements.networkMode).classList.add("up");

        setTimeout(function(){
           document.querySelector(_this._elements.networkMode).classList.remove("up");
        },2000);
    },
    showError: function(){
         document.querySelector(this._elements.error).removeAttribute('hidden');
         document.querySelector(this._elements.container).setAttribute('hidden', true);
         document.querySelector(this._elements.loading).setAttribute('hidden', true);
         this.isLoading = false;
         document.querySelector(this._elements.error).innerHTML = 
        `<div class='error-msg'>
              Couldn't retrieve data at this time.. check your network conection and try again 
            </div>
            `
    },
    retrieveAndDisplay: function( feedback ){
      
        if(feedback){
            this.displayData( feedback ) ;
            this.hideLoader();
        }else{
           this.showError();
        }
    },
    
    displayData: function( data ){
        var scriptTemplate = document.querySelector(this._elements.scriptTemplate).innerHTML;
        var compiledTemplate = Handlebars.compile(scriptTemplate);
        var generatedHtml = compiledTemplate( data );
        var sortBy = document.querySelector(this._elements.select).value;

        var template = document.querySelector(this._elements.temp);
        document.querySelector(this._elements.heading).innerHTML = sortBy;
        template.innerHTML = generatedHtml;
    }
}


/*******************/
/**    CONTROLLER     ***/
/********************/
var appController = function(model, view){
    this.model = model;
    this.view = view;
    _this = this;
   
     this.checkNetWork = navigator.onLine;
      //LOAD DATA
    // _this.getData(_this.checkNetWork, "undefined");

     window.addEventListener('load', function() {      
        if(_this.checkNetWork ){
            _this.view.onlineNote.notify();
        }else{
           _this.view.offlineNote.notify();
        }
     });


     //SORTBY
     this.view.sortBy.attach(function( sender ,args ){
         _this.getData(_this.checkNetWork, args );
     });

};

appController.prototype = {

    getData: function (status, args) {
        alert("getting data");
        this.model.getNewData( status, args);
    }
}

/********/
/*****  APP  */
//(function(){
    
     var model = new appModel(),
         view = new appView(model, {
             "loading":".loading",
             "temp": ".template",
             "networkMode":".network-mode",
             "scriptTemplate":"#scriptTemplate",
             "error":".error-container",
             "container":".main-container",
             "select":".select",
             "heading":".heading"
         }),
         
         controller = new appController(model, view);
         controller.getData(true, "undefined");
    /*
       @service workers
       check and register for it ....
    */
    
    if ('serviceWorker' in navigator) {
       
            navigator.serviceWorker.register('./sw.js').then(function(registration) {
            // Registration was successful
           // console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, function(err) {
            // registration failed :(
           // console.log('ServiceWorker registration failed: ', err);
            });
       
   }else{
        console.log("Service worker not supported")
    }
    
    /*
      @end
    */
     
//}());
