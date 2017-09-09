(function(){
   
   
   var $el = function( selector ){
       return document.querySelector( selector );
   }
   
   $el(".network-mode").style.display = "none";
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
     // alert("supported");
      $eachElem(".network-mode", function(index, elem){
        elem.removeAttribute("hidden");
      });
  }else{
   //  alert("not supported");
      $eachElem(".network-mode", function(index, elem){
         elem.setAttribute("hidden", true);
      });
  }
}())
