
	/**
	 * @name jServer
	 * @description jHandler Server Event Oriented
	 * @author Pedro Gregorio
	 */
	jServer = Class.create({

		conn : null,
		timeout : null,
		events : {},
		options : {},
	
		init : function(u,d,e,r){
			this.setParam(u,d,e,r);
			return this;
		},
		
		setParam : function(u,d,e,r){

			this.options.url = u;
			this.options.data = d;
			this.options.reconnectTime = r || 25000; // 25 seconds
			this.events = e;
		},
		
		start : function(){
			this.connect();
		},
		
		stop: function(){
			this.conn.abort();
		},
		
		connect : function(){
			
			var _object = this;

		   	// First call to timeout
			this.setTimeout();

		   	this.conn = Ajax({
		   		
		   		url : _object.options.url,
		   		data : _object.options.data,
		   		comet : true,
		   		success : function(data){
		   			
		   			var responseObj = data.eval();

		   			// Callback event
		   			if(_object.events[responseObj.ev.name])
		   				_object.events[responseObj.ev.name].apply(_object,responseObj.ev.args);

		   			// Renew Ajax parameters
		   			this.load({
		   				data : responseObj.param
		   			});
		   			
		   			// Renew _object parameters
		   			_object.options.data = responseObj.param;
		   			
		   			// Destroy abortion machanism, and creates a new one
		   			_object.setTimeout();
		   		}
		   	});

		   	return this;
		},
		
		// Aborts last requisition and starts a new one
		setTimeout : function(){

			var _object = this;
			
			if(this.timeout)
				clearTimeout(_object.timeout);

	   		this.timeout = setTimeout(function(){
	   			_object.reconnect();
	   		},this.options.reconnectTime);
		},
		
		reconnect : function(){
			this.stop();
			this.start();
		},
		
		// Parse data string
		makeEvent : function(s){
			
			var data = s.split("(");

			return {
				name : data[0],
				param : data[1].substr(0,data[1].length-2).split(",")
			}
		}
	});