	
	/**
	 * @name jHandlerEffects extension
	 * @description jHandler plugin(jHandler prototype) to add effects
	 * @author Pedro Gregorio
	 */
	Class.extend(jHandler,{
		
		/**
		 * @name moveTo
		 * @description Moves jHandler elements to sides 
		 */
		moveTo : function(d,p,e,s,c,type){

			if(p>e){

				var _object = this, type = type || "marginLeft";

				this.css(type,this.css(type).toNumber()+( !d ? -2 : 2 )+"px");

				setTimeout(function(){
					_object.moveTo(d,p,e+2,s,c,type);
				},s/10);
			}
			else if(c)
				c.apply(this);

			return this;
		},
		
		toLeft : function(p,s,c){
			return this.moveTo(0,p,0,s,c);
		},
		
		toRight : function(p,s,c){
			return this.moveTo(1,p,0,s,c);
		},
		
		toTop: function(p,s,c){
			return this.moveTo(0,p,0,s,c,"marginTop");
		},
		
		toBottom : function(p,s,c){
			return this.moveTo(1,p,0,s,c,"marginTop");
		},

		/**
		 * @name shake
		 * @description Shakes jHandler elements
		 */
		shake : function(type){

			var scope,step_one,step_two;
			
			// declare values
			if(type=="up")
				scope = "this.toBottom(25,70);", step_one = "toTop", step_two = "toBottom";
			else
				scope = "this.toLeft(25,70);", step_one = "toRight", step_two = "toLeft";

			// 3 times by default
			for(var i=5;i>0;i--){
				
				if(i%2==1)
					scope = "this."+step_one+"(50,70,function(){ "+scope+" })";
				else
					scope = "this."+step_two+"(50,70,function(){ "+scope+" })";
			}
			
			if(type=="up")
				scope = "this.toBottom(24,70,function(){ "+scope+" });";
			else
				scope = "this.toLeft(24,70,function(){ "+scope+" });";

			// finaly shake it baby
			(new Function(" "+scope+" ")).apply(this);
			
			return this;
		},
		
		setOpacity : function(v){
			
			this.css("opacity",v/10);
			this.css("filter",'alpha(opacity='+(v*10)+')');
			return this;
		},

		/**
		 * @name fadeIn
		 * @description Fade jHandler elements
		 */
		fadeIn : function(s,c,i){

			if(!i || i<10){

				var _object = this.setOpacity(i);
				
				if(!i){
					i = 1;
					this.css("display","block");
				}

				setTimeout(function(){
					_object.fadeIn(s,c,i+1);
				},s/10);
			}
			else if(c)
				c.apply(this);

			return this;
		},
		
		/**
		 * @name fadeOut
		 * @description Fade jHandler elements
		 */
		fadeOut : function(s,c,i){

			if((!i && i!=0) || i>0){

				var _object = this.setOpacity(i);
				i = (i) ? i : 10;

				setTimeout(function(){
					_object.fadeOut(s,c,i-1);
				},s/10);
			}
			else{
				
				this.css("display","none");
				if(c) c.apply(this);
			}

			return this;
		}
	});