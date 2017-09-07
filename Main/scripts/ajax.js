var ajax = (function() {
   'use strict';
    var xhr, getParams, setRequestHeader, config, parse;

    config = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/x-www-form-urlencoded'
    };
    parse = function(req){
       var result;
       try {
           result = JSON.parse(req.responseText);
       } catch (e) {
           result = req.responseText;
       }
       return result;
    };

    getParams = function(data){
      
      var params = (typeof data === 'string')? data : Object.keys(data).map(
            function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
        ).join('&');
       
        return params;
    };

    setRequestHeader = function(req, config){
      for(var h = 0; h < config.length; h++) {
           req && req.setRequestHeader(h, config[h]);
      }
    };

    xhr = function(method,url,data){
        var req = null
           , callbacks = {
                success: function () {},
                error: function () {},
                always: function () {}
           };

          req = new(XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
          if(method === 'GET') {
              req.open(method, url + "?" + getParams(data), true);
           } else {
              req.open(method, url, true);
              setRequestHeader(req, config);
          }

          req.onreadystatechange = function () {
              var results;
              if (req.readyState === 4) {
                    results = parse(req);
                if (req.status >= 200 && req.status < 300) {
                      callbacks.success.call({}, results);
                } else {
                      callbacks.error.call({}, req.status);
                }
                callbacks.always.apply({}, [results, req]);
              }
            };
        // console.log(getParams(data));
          method === 'get' ? req.send() : req.send(data);
      
          var feedbacks = {
              success: function (callback) {
                callbacks.success = callback;
                return this;
              },
              error: function (callback) {
                callbacks.error = callback;
                return this;
              },
              always: function (callback) {
                callbacks.always = callback;
                return this;
              }
            };
            return feedbacks;
    };

    return{
      request: function(ops){
        if(typeof ops === "object") {
           return xhr(ops.method, ops.url, ops.data);
         }else{};
      },
      get: function(url, data){
        return xhr("GET", url, data);
      },
      getJSON: function(){
          return xhr("GET", url, data);
      },
      post: function(url, data){
        return xhr("POST", url, data);
      },
    }
}());
