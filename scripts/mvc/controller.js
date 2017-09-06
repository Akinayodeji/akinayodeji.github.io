var appController = function(model, view){
    this.model = model;
    this.view = view;
    _this = this;
   
     this.checkNetWork = navigator.onLine;

     window.addEventListener('load', function() {  

        if(_this.checkNetWork ){
           _this.view.onlineNote.notify();
           _this.getData(_this.checkNetWork, "undefined");
        }else{
           _this.view.offlineNote.notify();
           _this.getData(_this.checkNetWork, "undefined");   
        }

     });

     this.view.sortBy.attach(function( sender ,args ){
         
         _this.getData(_this.checkNetWork, args );
     });

};

appController.prototype = {

    getData: function (status, args) {
        this.model.getNewData( status, args);
    }
}
