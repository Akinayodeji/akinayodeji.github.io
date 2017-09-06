(function(){
   var $el = function( selector ){
       return document.querySelector( selector );
   }
   var el = document.createElement("div");
  
   if(el.style.flex === "undefined" || el.style.flexWrap === "undefined"){
        $el(".flex").style.display = "block";
        
   }else{
       var elem = document.createElement('div'),
          prefix = ['-webkit-box','-moz-box','-ms-flexbox','-webkit-flex', 'flex' ]
        for(var i = 0 ;i <= prefix.length; i++){
             var prefixCurr = prefix[i],
               result =  ((elem.style.display = prefixCurr ) !== "undefined") ? prefixCurr : false;
               if(result){
                   elem.style.display = result;
               }
        }
   }

}())