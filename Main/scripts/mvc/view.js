
var appView = function(model, elements) {
    this._model = model;
    this._elements = elements;
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
    show: function(){
        this.showLoader();
    },
    showLoader: function(){
        document.querySelector(this._elements.loading).classList.remove("hidden");
        document.querySelector(this._elements.temp).classList.add("hidden");
        document.querySelector(this._elements.error).classList.add("hidden");
    },
    hideLoader: function(){
      document.querySelector(this._elements.loading).classList.add("hidden");
      document.querySelector(this._elements.temp).classList.remove("hidden");
      document.querySelector(this._elements.heading).classList.remove("hidden");
      document.querySelector(this._elements.error).classList.add("hidden");
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
    retrieveAndDisplay: function( feedback ){
        if(feedback){
            this.displayData( feedback ) ;
            this.hideLoader();
        }else{
            document.querySelector(this._elements.loading).classList.add("hidden");
            document.querySelector(this._elements.error).classList.remove("hidden");
            document.querySelector(this._elements.heading).classList.add("hidden");

            document.querySelector(this._elements.error).innerHTML = 
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
        var sortBy = document.querySelector(this._elements.select).value;

        var template = document.querySelector(this._elements.temp);
        document.querySelector(this._elements.heading).innerHTML = sortBy;
        template.innerHTML = generatedHtml;
    }
}
