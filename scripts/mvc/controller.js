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
