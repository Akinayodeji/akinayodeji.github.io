(function(){
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
   
}())
