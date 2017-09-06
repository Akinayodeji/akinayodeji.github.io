
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
            //this.hideLoader();
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
        var sortBy = document.querySelector(this._elements.select).value;

        var template = document.querySelector(this._elements.temp);
        document.querySelector(this._elements.heading).innerHTML = sortBy;
        template.innerHTML = generatedHtml;
    }
}
