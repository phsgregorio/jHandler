
	/**
	 * @name jhandler.js
	 * @description jHandler framework
	 * @author Pedro Gregorio
	 * @version 1.1
	 */

	/**
	 * @name Class
	 * @type Object
	 * @desc Create, extend and destroy classes using prototype
	 */
	Class = {

		create : function(p,h){
		
			var _that = {};
		
			/* Instance variables */
			for(var i in p){
		
		        if(typeof(p[i])!="function" && typeof(p[i])!="object"){
		
		        	_that[i] = p[i];
		            delete p[i];
				}
			}
		
			/* Constructor */
			var f = function(){
		
		   		for(var i in _that){
		    		this[i] = _that[i];
				};
		
		        return this.init.apply(this,arguments);
			};
		
		    /* Inheritance */
			f.prototype = (h) ? h : {};
		
		    /* Class methods and objects */
			for(var i in p){
		    	f.prototype[i] = p[i];
			};
		
			return f;
		},
		
		extend : function(c,o){
			for(var i in o)
				c.prototype[i] = o[i];
		},
		
		destroy : function(n){
			return delete window[n];
		}
	};
	
	/**
	 * @desc Extend String prototype
	 */
	Class.extend(String,{
		
		trim : function(){
			return this.replace(/^\s+|\s+$/g,"");
		},

		replaceAll : function(t,n){
			return (this.indexOf(t)!=-1) ? this.replace(t,n).replaceAll(t,n).toString() : this;
    	},
    	
    	concat : function(s){
		    return this+s+Array.prototype.slice.call(arguments).slice(1).join(s);
    	},
    	
		camelize : function() {
			
			var parts = this.split(' ');

			for(var i = 0; i < parts.length; i++)
				parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
			
			return parts.join(" ");
		},
		
		eval : function(){
			eval("var x = ("+this.toString()+");");
			return x;
		},
		
		toJson : function(){
			return this.eval();
		},
		
		letters : function(){
			return this.replace(/[^a-z\s]/gi,'');
		},
		
		lettersSpace : function(){
			return this.replace(/[^a-z\s]/gi,' ');
		},
		
		numbers : function(){
			return this.replace(/[^0-9\-]/gi,'');
		},
		
		toNumber : function(){
			return Number(this.numbers().toString());
		},
		
		/**
		 * @desc Functional suport 
		 */
		lambda : function(){
			
			if(this.indexOf("->")!=-1){
				var parts = this.split("->");
				var formal = parts[0].trim().split(" ")
				var expression = parts[1];
			}
			else{
				var formal = this.lettersSpace().trim().replace(/[\s]/gi,",").replaceAll(",,",",");
				var expression = this;
			}

			return (new Function(formal," return "+expression+"; ")).fullCurry();
		}
	});
	
	/**
	 * @desc Extend Number prototype
	 */
	Class.extend(Number,{
		
		times : function(f){

        	if ( {}.toString.call(f) != "[object Function]" )
        	    throw new TypeError( f + " is not a function" );

			for(var i=0;i<this;i++)
				f(i);
		}
	});
	
	/**
	 * @desc Extend Function prototype
	 */
	Class.extend(Function,{
		
		delay : function(s){

			var method = this;
		    var args = Array.prototype.slice.call(arguments);
		    args.shift();

		    return setTimeout(function(){
				return method.apply(method,args);
		    },s);
		},

		/**
		 * @desc Functional suport
		 */
		curry : function(){
			
			var _method = this, args = Array.prototype.slice.call(arguments);

			return function(){
				return _method.apply(_method,args.concat(Array.prototype.slice.call(arguments)));
			}
		},
		
		fullCurry : function() {
			
			var _method = this, args = Array.prototype.slice.call(arguments);

			if(arguments.length==_method.length)
				return _method.apply(this,arguments);
			else{
				
				return function(){
					return _method.fullCurry.apply(_method,args.concat(Array.prototype.slice.call(arguments)));
				}
			}
		}
		
	},new Object());
	

	if(navigator.userAgent.indexOf("MSIE")==-1){

		/**
		 * @description Extend HTMLCollection prototype
		 */
		Class.extend(HTMLCollection,{
			toArray : function(){
				return Array.prototype.slice.call(this);
			}
		});

		/**
		 * @description Extend NodeList prototype
		 */
		Class.extend(NodeList,{
			toArray : HTMLCollection.prototype.toArray
		});
	}

	/**
	 * @name Class jHandler
	 * @type Class
	 * @desc Manipulate DOM elements
	 */
	jHandler = Class.create({
        
        selector : null,
        last : null,

		/**
		 * @name jHandler Constructor
		 * @type Constructor
		 * @desc new jHandler Object, extends new Array()
		 */
        init : function(s,f){

			if(!s) return this;
			f = f|| document;

			// init return obj
        	var obj = (this.last==null) ? this : new jHandler();
        	obj.last = this;
        	obj.selector = s;

        	if(f && typeof(f.push)=="function")
				obj = this.initArrayContext(s,f,obj);
            else if(s instanceof jHandler)
            	obj = s;
        	else if(typeof(s)=="string"){

				if(f.querySelectorAll)
					obj.pushArray(f.querySelectorAll(s));
				else{
					
                    if(s.indexOf(",")!=-1){
                	
	                	var selectors = s.split(",");
	                	
	                	for(var i=0;i<selectors.length;i++){
	                	    
	                	    var nSelector = jH(selectors[i]);

	                	    for(var j=0;j<nSelector.length;j++)
	                			obj.push(nSelector[j]);
	                	}
                    }
                    else{
        
                        var type = s.substr(0,1);

                        if(type=="#" && f==document)
                            obj.push(f.getElementById(s.substr(1)));
                        else if(type=="[" && f==document)
                            obj.pushArray(f.getElementsByName(s.substr(1,s.length-2)));
                        else if(type==".")
                            obj.pushArray(f.getElementsByClassName(s.substr(1)))
                        else
                            obj.pushArray(f.getElementsByTagName(s));
                    }
				}
            }
            else if(s.tagName != null || s.toString().indexOf("HTML") != -1  || s.toString().indexOf("NodeList") != -1 || s.nodeValue)
                obj.push(s);
            else
                throw new TypeError( s + " could not be initialized" );
    
            return obj;
        },

		/**
		 * @name initArrayContext
		 * @type Method
		 * @desc Init a jHandler object in a array context
		 */
        initArrayContext : function(s,f,obj){

    	    var elements;

    	    for(var i=0;i<f.length;i++){
    		
    			elements = obj.init(s,f[i]);
    		
    			for(var j=0;j<elements.length;j++)
    		    	obj.push(elements[j]);
    	    }
    	    
    	    return obj;
        },

		/**
		 * @name pushArray
		 * @type Method
		 * @desc Pushes an array into jHandler object
		 */
        pushArray : function(a){

			if(a){
				
                for(var i=0;i<a.length;i++){
            		this.push(a[i]);
            	}
            }
        },

		/**
		 * @name jh
		 * @type Method
		 * @desc Return a new jHandler object in the given position
		 */
        jh : function(i){
        	var r = new jHandler(this[i]);
        	r.last = this;
        	return r;
        },

		/**
		 * @name jh
		 * @type Method
		 * @desc Apply a function to each element present in the jHandler object
		 */
        each : function(f){
    	
        	if ( {}.toString.call(f) != "[object Function]" )
        	    throw new TypeError( f + " is not a function" );
        	
			for(var i=0;i<this.length;i++)
            	f.apply(new jHandler(this[i]));

        	return this;
        },

		/**
		 * @name Elements Navigation
		 * @description Adds suport to DOM elements navigation
		 */
        find : function(s){
    		return this.init(s,this);
        },
        
        parent : function(){
        	return jH(this[0].parentNode);
        },
        
        child : function(){

        	var obj = new jHandler();
        	obj.last = this;

			this.each(function(){

	        	var i = this[0].firstChild;
	        	
	        	while(i!=null){
	        		
	        		if(i.tagName && i.tagName!="BR")
	        			obj.push(i);
	        		
	        		i = i.nextSibling;
	        	}
			});
			
			return obj;
        },
        
        textNodes : function(){

        	var obj = new jHandler();
        	obj.last = this;

			this.each(function(){

	        	var i = this[0].firstChild;
	        	
	        	while(i!=null){
	        		
	        		if(!i.tagName)
	        			obj.push(i);
	        			
	        		i = i.nextSibling;
	        	}
			});
			
			return obj;
        },
        
        next : function(){
        	
        	var e = this[this.length-1];
        	var i = e.nextSibling;

        	while(i!=null && (!i.tagName || i.tagName=="BR") )
        		i = i.nextSibling;

        	return (i) ? jH(i) : null;
        },
        
        prev : function(){
        	
        	var e = this[0];
        	var i = e.previousSibling;
        	
        	while(i!=null && (!i.tagName || i.tagName=="BR") )
        		i = i.previousSibling;
        		
        	return (i) ? jH(i) : null;
        },
        
        expression : function(x){
        	
        	var _object = this;
    	    var obj = new jHandler();
    	    obj.last = this;

        	this.length.times(function(i){
        		if(x.replaceAll("x",i+1).eval())
        			obj.push(_object[i]);
        	});
        	
        	return obj;
        },
        
        attr : function(p,v){
            
            //if(p=="class") p = "className";
            
            if(!v) return this[0].getAttribute(p);
            else{
                this.each(function(){ this[0].setAttribute(p,v); });
                return this
            }
        },
        
        val : function(v){

        	if(v || typeof v == "string"){
        	    this.each(function(){ this[0].value = v; });
        	    return this;
        	}
        	else
        		return this[0].value;
        },
    
        html : function(h){

    		if(h || typeof h == "string"){
        	    this.each(function(){ this[0].innerHTML = h; });
        	    return this;
    		}
    		else
    			return this[0].innerHTML;
        },

        css : function(p,v){
            
        	if(!v) return this[0].style[p];
        	else{
				this.each(function(){ this[0].style[p] = v; });
				return this;
        	}
        },

        style : function(o){

        	for(var obj in o){
        	    this.css(obj,o[obj]);
			}

        	return this;
        },
        
        position : function(){

			var left = 0, top  = 0, e = this[0];

			while(e.offsetParent){
				left += e.offsetLeft;
				top += e.offsetTop;
				e = e.offsetParent;
			}

			return { left: left+e.offsetLeft, top: top+e.offsetTop };
        },

        "event" : function(t,f){

        	this.each(function(){

        	    if(this[0].attachEvent){
        			// this[0]['e'+t+f] = f;
        			// this[0][t+f] : function(){ this[0]['e'+t+f]( window.event ); };
        			// this[0].attachEvent('on'+t,f);
        			this[0]["on"+t] = f;
        	    }
        	    else
        			this[0].addEventListener(t,f,false);
        	});

        	return this;
		},
            
        addClass : function(n){
    
        	this.each(function(){
        	    if(this[0].className.indexOf(n)==-1)
            	    this[0].className = (this[0].className.length>0) ? this[0].className+" "+n : n;
        	});
      
        	return this;
        },
    
        remClass : function(n){

        	this.each(function(){
        	    
        	    var classes = this[0].className.split(" ");
        	    var position = classes.indexOf(n);
        		
        	    if(position>-1){
        		    classes.splice(position,1);
        		    this[0].className = classes.join(" ");
        	    }
        	});
        
        	return this;
        },
        
        /**
         * @name Elements Suport
         * @description Functions to suport new DOM elements
         */
        createElement : function(e,o,n){

			var element = document.createElement(e);
                    
        	for(var i in o)
        		jH(element).attr(i,o[i]);
            	
        	if(n)
        		element.appendChild(document.createTextNode(n));
        		
        	return element;
        },
        
        // TODO Discussion -> return this or the new element
        addElement : function(e,o,n){

        	this.each(function(){
        	    this[0].appendChild(this.createElement(e,o,n));
        	});

    		return this;
        },
        
        addAfter : function(e,o,n){

        	var next = this.next().shift();
        	next.parentNode.insertBefore(this.createElement(e,o,n),next);
        	
        	return this;
        },
        
        addBefore : function(e,o,n){
        	
        	var prev = this.prev().shift();
        	prev.parentNode.insertBefore(this.createElement(e,o,n),prev);
        	
        	return this;
        },
        
        replace : function(n){

        	this.parent()[0].replaceChild( (n instanceof jHandler) ? n[0] : n , this[0] );
        	return this;
        },
        
        remove : function(){
        	
        	this.each(function(){
        		this[0].parentNode.removeChild(this[0]);
        	});
        	
        	return this;
        },
        
        select : function(){
        	
        	this.each(function(){
        		this[0].select();
        	});
        	
        	return this;
        }
	},[]);

    /**
     * @name jH
     * @type Function
     * @desc Shortcut to use jHandler objects
     */
	jH = function(s,f){
        return new jHandler(s,f);
    };
