
	/**
	 * @name jHandlerForm extension
	 * @description jHandler plugin(jHandler prototype) to validate forms
	 * @author Pedro Gregorio
	 */
	Class.extend(jHandler,{

		/**
		 * @name buildForm
		 * @description Build an entire form validator
		 */
		buildForm : function(o){
			    
			var aux = 0;
			    
			if(o instanceof Array){
				
				for(var i=0;i<o.length;i++){
		
				    if(o[i] instanceof Array)
						for(var j=0;j<o[i].length;j++)
					    	eval("jH(this[aux])."+o[i][j]+"()");
				    else
						eval("jH(this[aux])."+o[i]+"()");
		
				    aux++;
				}
			}else{
				
				for(var i in o){
					
				    if(o[i] instanceof Array)
						for(var j=0;j<o[i].length;j++)
					    	eval("jH(i)."+o[i][j]+"()");
				    else
						eval("jH(i)."+o[i]+"()");
				}
			}
		
			return this;
		},
			
		validator : function(){

		    this[0].onsubmit = function(){
			    
				var wrongField = jH(this).find(".fBuilder_wrong");
		
				if(wrongField.length>0){
				    alert("Preencha os campos corretamente");
				    return false;
				}
				else
				    return true; 
		    }
	
		    return this;
		},
		
		required : function(){
	
		    this.event("blur",function(){
	
				var e = jH(this);
		
				if(e.val().length>0) e.remClass("fBuilder_wrong").addClass("fBuilder_right");
				else { e.remClass("fBuilder_right").addClass("fBuilder_wrong"); }
		    });
		    
		    return this;
		},
		
		completeDate : function(){
	
		    this.event("keydown",function(e){
	
				var c = (e.keyCode) ? e.keyCode : e.which;
		
				if(c!=8){
					    
				    if(this.value.length==2)
					this.value += "/";
				    else if(this.value.length == 5)
					this.value += "/";
				}
		    });
		    
		    return this;
		},
	
		completeCpf : function(){
	
		    this.event("keydown",function(e){
	
				var c = (e.keyCode) ? e.keyCode : e.which;
		
				if(c != 14){
					
				    if(this.value.length==3)
						this.value += ".";
				    else if(this.value.length == 7)
						this.value += ".";
				    else if(this.value.length == 11)
						this.value += '-';
				}
		    });
		    
		    return this;
		},
		
		completeMoney : function(){
	
		    this.event("keyup",function(e){
	
				var c = (e.keyCode) ? e.keyCode : e.which;
		
				if(c != 14 && this.value.length>=3){
		
				    var newValue = "";
				    this.value = this.value.replaceAll(".","").replace(",","");
		
				    if(this.value.length>=6){
		
						for(var i=6;i<=this.value.length;i++){
							
						    if(i%3==0)
								newValue = this.value.charAt(this.value.length-i)+"."+newValue;
						    else
								newValue = this.value.charAt(this.value.length-i)+newValue;
						}
		
						newValue = newValue+this.value.substr(this.value.length-5,3)+","+this.value.substr(this.value.length-2,2);
				    }
				    else
						newValue = this.value.substr(0,this.value.length-2)+","+this.value.substr(this.value.length-2,2);
						
				    this.value = newValue;
				}
		    });
		},
		
		mail : function(){
	
		    this.event("blur",function(){
			
				var e = jH(this);
				
				if(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(e.val()))
				    e.remClass("fBuilder_wrong").addClass("fBuilder_right");
				else
				    e.remClass("fBuilder_right").addClass("fBuilder_wrong");
		    });
		    
		    return this;
		},
	
		cpf : function(){
			
		    this.event("blur",function(){
	
				var cpf = this.value.replace(".","").replace(".","").replace("-","");
		
				if(cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999"){
				    jH(this).remClass("fBuilder_right").addClass("fBuilder_wrong");
				    return false;
				}
		
				add = 0;
				for (i=0; i < 9; i ++)
				    add += parseInt(cpf.charAt(i)) * (10 - i);
		
				rev = 11 - (add % 11);
				    
				if(rev == 10 || rev == 11)
				    rev = 0;
				    
				if(rev != parseInt(cpf.charAt(9))){
				    jH(this).remClass("fBuilder_right").addClass("fBuilder_wrong");
				    return false;
				}
		
				add = 0;
				for(i = 0; i < 10; i ++)
				    add += parseInt(cpf.charAt(i)) * (11 - i);
		
				rev = 11 - (add % 11);
		
				if(rev == 10 || rev == 11)
				    rev = 0;
		
				if(rev != parseInt(cpf.charAt(10))){
				    jH(this).remClass("fBuilder_right").addClass("fBuilder_wrong");
				    return false;
				}
		
				jH(this).remClass("fBuilder_wrong").addClass("fBuilder_right");
				return true;
		    });
		    
		    return this;
		}
	});