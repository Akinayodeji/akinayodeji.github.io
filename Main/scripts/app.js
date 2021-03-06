(function(){
    
     var model = new appModel(),
         view = new appView(model, {
             "loading":".loading",
             "temp": ".template",
             "networkMode":".network-mode",
             "scriptTemplate":"#scriptTemplate",
             "error":".error-container",
             "select":".select",
             "heading":".heading"
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
