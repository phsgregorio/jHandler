
	/**
	 * @name NotEnoughArguments
	 * @description jHandler NotEnoughArguments exception
	 * @author Pedro Gregorio
	 */
	NotEnoughArguments = Class.create({
		
		init : function(){
			this.name = "NotEnoughArguments";
			this.message = "Arguments missing";
		}
		
	}, new Error());
			
	/**
	 * @name jHandlerAjax extension
	 * @description jHandler plugin(jHandler prototype) to make assync requisitions
	 * @author Pedro Gregorio
	 */
	jAjax = Class.create({

        msVersions : ["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.5.0","MSXML2.XMLHttp.4.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp","Microsoft.XMLHTTP"],
        http : null,
        options : {},
        states : [],
    
        tryMsVersion : function(v){

        	try{
        	    this.http = new ActiveXObject(msVersions[v]);
        	}catch(e){ this.tryMsVersion(v++); }
       	},

		/**
		 * @name init
		 * @description Class Constructor, initialize atributes and try to make a new requisition
		 */
        init : function(o){

			this.options = {}, this.states = [];

			if(!o)
				throw new NotEnoughArguments();

        	this.http = (window.XMLHttpRequest) ? new XMLHttpRequest() : this.tryMsVersion(0);
        	this.load(o);
        	
        	try{
        		this.connect();
        	}catch(e){}

        	return this;
        },
        
        load : function(o){

			for(var i in o)
				this.options[i] = o[i];

    		if(!this.options.method){ this.options.method = "GET";}
    		if(!this.options.success) this.options.success = null;
    	
    		if(!this.options.data) this.options.data = "";
    		else if(typeof(this.options.data)=="object"){
    	    
        	    var p = "";
        	    
        	    for(var i in this.options.data)
        			p += "&"+i+"="+this.options.data[i];

        	    this.options.data = p.substr(1);
    		}
    		
    		return this;
        },
   
		/**
		 * @name connect
		 * @description Try making a request
		 */
        connect : function(){

			var _object = this;
			_object.states = [];

        	this.http.onreadystatechange = function(){

				try{
				
					_object.states.push({
						readyState : this.readyState,
						status : this.status,
						statusText : this.statusText,
						response : this.responseText
					});
				}catch(e){}

        	    if(this.readyState==4 && _object.options && _object.options.success){
        			
        			
        			if(_object.options.comet){
        				_object.options.success.apply(_object,[this.responseText]);
						_object.renew();
					}
					else
						_object.options.success(this.responseText);
        		}
        	};

			if(this.sameDomain()){

				try{
	
		        	if(this.options.method=="POST"){
		        	    this.http.open(this.options.method,this.options.url,true);
		        	    this.http.send(this.options.data);
		        	}
		        	else{
		        	    this.http.open(this.options.method,this.options.url+( (this.options.data) ? "?"+this.options.data : "" ),true);
		        	    this.http.send();
		        	}
		        }
		        catch(e){ throw new NotEnoughArguments(); }
	       }
	       else{
	       	
				if(this.options.jsonp && this.options.success)
					window[this.options.jsonp] = this.options.success;
					
	       		this.crossDomain();
	       	}
        },
        
        abort : function(){
        	this.http.abort();
        	return this;
        },
        
        renew : function(o){

        	if(o) this.load(o);
        	this.abort().connect();
        	return this;
        },
        
        /**
	 	 * @name interval
	 	 * @description Make requests on intervals
         */
        interval : null,
        
        setInterval : function(t){
        	
        	var _object = this;
        	
        	this.interval = setInterval(function(){
        		_object.connect();
        	},t);
        	
        	return this;
        },
        
        clearInterval : function(){
        	
        	if(this.interval!=null)
        		clearInterval(this.interval);
        		
        	return this;
        },
        
        sameDomain: function(){
        	var l = document.location;
        	var u = this.options.url;
        	return ( (l.host=="" && !(/http|www/.test(u)) ) || (l.host!="" && u.indexOf(l.host) != -1) );
        },

		/**
		 * @name crossDomain
		 * @description make a cross domain requisition
		 * @note http://www.w3.org/TR/cors/ - This document defines a mechanism to enable client-side cross-origin requests
		 */
        crossDomain : function(){
        	
        	// TODO implement cross domain requisitions acording to http://www.w3.org/TR/cors/

        	var script, _object = this ,head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
 			script = document.createElement( "script" );
			script.async = "async";
			script.src = this.options.url;

			script.onload = script.onreadystatechange = function( _, isAbort ) {

				if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

					script.onload = script.onreadystatechange = null;

					if ( head && script.parentNode )
						head.removeChild( script );
						
					if(_object.options.success && !_object.options.jsonp)
						_object.options.success();
        			
        			script = undefined;
				}
			};

			head.insertBefore( script, head.firstChild );

        	return this;
        }
	},new Object());
	
	Ajax = function(o){
		return new jAjax(o);
	};