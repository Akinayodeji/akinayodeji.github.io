(function(){
    var url = "https://newsapi.org/v1/articles";
   ajax.get(url, {
                "apiKey": "639cdf8c0ccc40f1b3fa372dee4fcb0a",
                "source": "techcrunch",
                "sortBy": this.data,
            })
            .success(function( success ){
                alert( success );
            })
            .error(function( error ){
                alert( error );
            });
   
   var $el = function( selector ){
       return document.querySelector( selector );
   }
   
   
   var $eachElem = function( selector , callback){
      var el = document.querySelectorAll( selector );
     if(typeof el !== "undefined"){
         
        for(var i=0; i < el.length;i++){
            callback(i, el[i]);
        }

     }
   }
  
   ///--------
  
    var el = document.createElement("div").style;
    if(('flexWrap' in el) || ('WebkitFlexWrap' in el) || ('msFlexWrap' in el)){
          $eachElem(".flex", function(index, elem){
               elem.classList.add("flex");
           });
    }else{
          $eachElem(".flex", function(index, elem){
               elem.classList.remove("flex");
           });
    }

    //-------fallback------
   flex = CSS.supports("display", "flex");
   flexWrap = CSS.supports("flex-wrap", "wrap");
    if(!flex || !flexWrap){
        
        $eachElem(".flex", function(index, elem){
            elem.classList.remove("flex");
         });
    }
  //

  if('fixed' in el || "transform" in el){
     $el(".network-mode").style.display = "none";
  }else{
   $el(".network-mode").style.display = "";
  }
}())
