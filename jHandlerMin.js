// (c)2011 Pedro Gregório

Class={create:function(p,h){var _that={};for(var i in p){if(typeof(p[i])!="function"&&typeof(p[i])!="object"){_that[i]=p[i];delete p[i];}}
var f=function(){for(var i in _that){this[i]=_that[i];};return this.init.apply(this,arguments);};f.prototype=(h)?h:{};for(var i in p){f.prototype[i]=p[i];};return f;},extend:function(c,o){for(var i in o)
c.prototype[i]=o[i];},destroy:function(n){return delete window[n];}};Class.extend(String,{trim:function(){return this.replace(/^\s+|\s+$/g,"");},replaceAll:function(t,n){return(this.indexOf(t)!=-1)?this.replace(t,n).replaceAll(t,n).toString():this;},concat:function(s){return this+s+Array.prototype.slice.call(arguments).slice(1).join(s);},camelize:function(){var parts=this.split(' ');for(var i=0;i<parts.length;i++)
parts[i]=parts[i].charAt(0).toUpperCase()+parts[i].substring(1);return parts.join(" ");},eval:function(){eval("var x = ("+this.toString()+");");return x;},toJson:function(){return this.eval();},letters:function(){return this.replace(/[^a-z\s]/gi,'');},lettersSpace:function(){return this.replace(/[^a-z\s]/gi,' ');},numbers:function(){return this.replace(/[^0-9\-]/gi,'');},toNumber:function(){return Number(this.numbers().toString());},lambda:function(){if(this.indexOf("->")!=-1){var parts=this.split("->");var formal=parts[0].trim().split(" ")
var expression=parts[1];}
else{var formal=this.lettersSpace().trim().replace(/[\s]/gi,",").replaceAll(",,",",");var expression=this;}
return(new Function(formal," return "+expression+"; ")).fullCurry();}});Class.extend(Number,{times:function(f){if({}.toString.call(f)!="[object Function]")
throw new TypeError(f+" is not a function");for(var i=0;i<this;i++)
f(i);}});Class.extend(Function,{delay:function(s){var method=this;var args=Array.prototype.slice.call(arguments);args.shift();return setTimeout(function(){return method.apply(method,args);},s);},curry:function(){var _method=this,args=Array.prototype.slice.call(arguments);return function(){return _method.apply(_method,args.concat(Array.prototype.slice.call(arguments)));}},fullCurry:function(){var _method=this,args=Array.prototype.slice.call(arguments);if(arguments.length==_method.length)
return _method.apply(this,arguments);else{return function(){return _method.fullCurry.apply(_method,args.concat(Array.prototype.slice.call(arguments)));}}}},new Object());if(navigator.userAgent.indexOf("MSIE")==-1){Class.extend(HTMLCollection,{toArray:function(){return Array.prototype.slice.call(this);}});Class.extend(NodeList,{toArray:HTMLCollection.prototype.toArray});}
jHandler=Class.create({selector:null,last:null,init:function(s,f){if(!s)return this;f=f||document;var obj=(this.last==null)?this:new jHandler();obj.last=this;obj.selector=s;if(f&&typeof(f.push)=="function")
obj=this.initArrayContext(s,f,obj);else if(s instanceof jHandler)
obj=s;else if(typeof(s)=="string"){if(f.querySelectorAll)
obj.pushArray(f.querySelectorAll(s));else{if(s.indexOf(",")!=-1){var selectors=s.split(",");for(var i=0;i<selectors.length;i++){var nSelector=jH(selectors[i]);for(var j=0;j<nSelector.length;j++)
obj.push(nSelector[j]);}}
else{var type=s.substr(0,1);if(type=="#"&&f==document)
obj.push(f.getElementById(s.substr(1)));else if(type=="["&&f==document)
obj.pushArray(f.getElementsByName(s.substr(1,s.length-2)));else if(type==".")
obj.pushArray(f.getElementsByClassName(s.substr(1)))
else
obj.pushArray(f.getElementsByTagName(s));}}}
else if(s.tagName!=null||s.toString().indexOf("HTML")!=-1||s.toString().indexOf("NodeList")!=-1||s.nodeValue)
obj.push(s);else
throw new TypeError(s+" could not be initialized");return obj;},initArrayContext:function(s,f,obj){var elements;for(var i=0;i<f.length;i++){elements=obj.init(s,f[i]);for(var j=0;j<elements.length;j++)
obj.push(elements[j]);}
return obj;},pushArray:function(a){if(a){for(var i=0;i<a.length;i++){this.push(a[i]);}}},jh:function(i){var r=new jHandler(this[i]);r.last=this;return r;},each:function(f){if({}.toString.call(f)!="[object Function]")
throw new TypeError(f+" is not a function");for(var i=0;i<this.length;i++)
f.apply(new jHandler(this[i]));return this;},find:function(s){return this.init(s,this);},parent:function(){return jH(this[0].parentNode);},child:function(){var obj=new jHandler();obj.last=this;this.each(function(){var i=this[0].firstChild;while(i!=null){if(i.tagName&&i.tagName!="BR")
obj.push(i);i=i.nextSibling;}});return obj;},textNodes:function(){var obj=new jHandler();obj.last=this;this.each(function(){var i=this[0].firstChild;while(i!=null){if(!i.tagName)
obj.push(i);i=i.nextSibling;}});return obj;},next:function(){var e=this[this.length-1];var i=e.nextSibling;while(i!=null&&(!i.tagName||i.tagName=="BR"))
i=i.nextSibling;return(i)?jH(i):null;},prev:function(){var e=this[0];var i=e.previousSibling;while(i!=null&&(!i.tagName||i.tagName=="BR"))
i=i.previousSibling;return(i)?jH(i):null;},expression:function(x){var _object=this;var obj=new jHandler();obj.last=this;this.length.times(function(i){if(x.replaceAll("x",i+1).eval())
obj.push(_object[i]);});return obj;},attr:function(p,v){if(!v)return this[0].getAttribute(p);else{this.each(function(){this[0].setAttribute(p,v);});return this}},val:function(v){if(v||typeof v=="string"){this.each(function(){this[0].value=v;});return this;}
else
return this[0].value;},html:function(h){if(h||typeof h=="string"){this.each(function(){this[0].innerHTML=h;});return this;}
else
return this[0].innerHTML;},css:function(p,v){if(!v)return this[0].style[p];else{this.each(function(){this[0].style[p]=v;});return this;}},style:function(o){for(var obj in o){this.css(obj,o[obj]);}
return this;},position:function(){var left=0,top=0,e=this[0];while(e.offsetParent){left+=e.offsetLeft;top+=e.offsetTop;e=e.offsetParent;}
return{left:left+e.offsetLeft,top:top+e.offsetTop};},"event":function(t,f){this.each(function(){if(this[0].attachEvent){this[0]["on"+t]=f;}
else
this[0].addEventListener(t,f,false);});return this;},addClass:function(n){this.each(function(){if(this[0].className.indexOf(n)==-1)
this[0].className=(this[0].className.length>0)?this[0].className+" "+n:n;});return this;},remClass:function(n){this.each(function(){var classes=this[0].className.split(" ");var position=classes.indexOf(n);if(position>-1){classes.splice(position,1);this[0].className=classes.join(" ");}});return this;},createElement:function(e,o,n){var element=document.createElement(e);for(var i in o)
jH(element).attr(i,o[i]);if(n)
element.appendChild(document.createTextNode(n));return element;},addElement:function(e,o,n){this.each(function(){this[0].appendChild(this.createElement(e,o,n));});return this;},addAfter:function(e,o,n){var next=this.next().shift();next.parentNode.insertBefore(this.createElement(e,o,n),next);return this;},addBefore:function(e,o,n){var prev=this.prev().shift();prev.parentNode.insertBefore(this.createElement(e,o,n),prev);return this;},replace:function(n){this.parent()[0].replaceChild((n instanceof jHandler)?n[0]:n,this[0]);return this;},remove:function(){this.each(function(){this[0].parentNode.removeChild(this[0]);});return this;},select:function(){this.each(function(){this[0].select();});return this;}},[]);jH=function(s,f){return new jHandler(s,f);};NotEnoughArguments=Class.create({init:function(){this.name="NotEnoughArguments";this.message="Arguments missing";}},new Error());jAjax=Class.create({msVersions:["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.5.0","MSXML2.XMLHttp.4.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp","Microsoft.XMLHTTP"],http:null,options:{},states:[],tryMsVersion:function(v){try{this.http=new ActiveXObject(msVersions[v]);}catch(e){this.tryMsVersion(v++);}},init:function(o){this.options={},this.states=[];if(!o)
throw new NotEnoughArguments();this.http=(window.XMLHttpRequest)?new XMLHttpRequest():this.tryMsVersion(0);this.load(o);try{this.connect();}catch(e){}
return this;},load:function(o){for(var i in o)
this.options[i]=o[i];if(!this.options.method){this.options.method="GET";}
if(!this.options.success)this.options.success=null;if(!this.options.data)this.options.data="";else if(typeof(this.options.data)=="object"){var p="";for(var i in this.options.data)
p+="&"+i+"="+this.options.data[i];this.options.data=p.substr(1);}
return this;},connect:function(){var _object=this;_object.states=[];this.http.onreadystatechange=function(){try{_object.states.push({readyState:this.readyState,status:this.status,statusText:this.statusText,response:this.responseText});}catch(e){}
if(this.readyState==4&&_object.options&&_object.options.success){if(_object.options.comet){_object.options.success.apply(_object,[this.responseText]);_object.renew();}
else
_object.options.success(this.responseText);}};if(this.sameDomain()){try{if(this.options.method=="POST"){this.http.open(this.options.method,this.options.url,true);this.http.send(this.options.data);}
else{this.http.open(this.options.method,this.options.url+((this.options.data)?"?"+this.options.data:""),true);this.http.send();}}
catch(e){throw new NotEnoughArguments();}}
else{if(this.options.jsonp&&this.options.success)
window[this.options.jsonp]=this.options.success;this.crossDomain();}},abort:function(){this.http.abort();return this;},renew:function(o){if(o)this.load(o);this.abort().connect();return this;},interval:null,setInterval:function(t){var _object=this;this.interval=setInterval(function(){_object.connect();},t);return this;},clearInterval:function(){if(this.interval!=null)
clearInterval(this.interval);return this;},sameDomain:function(){var l=document.location;var u=this.options.url;return((l.host==""&&!(/http|www/.test(u)))||(l.host!=""&&u.indexOf(l.host)!=-1));},crossDomain:function(){var script,_object=this,head=document.head||document.getElementsByTagName("head")[0]||document.documentElement;script=document.createElement("script");script.async="async";script.src=this.options.url;script.onload=script.onreadystatechange=function(_,isAbort){if(isAbort||!script.readyState||/loaded|complete/.test(script.readyState)){script.onload=script.onreadystatechange=null;if(head&&script.parentNode)
head.removeChild(script);if(_object.options.success&&!_object.options.jsonp)
_object.options.success();script=undefined;}};head.insertBefore(script,head.firstChild);return this;}},new Object());Ajax=function(o){return new jAjax(o);};Class.extend(jHandler,{moveTo:function(d,p,e,s,c,type){if(p>e){var _object=this,type=type||"marginLeft";this.css(type,this.css(type).toNumber()+(!d?-2:2)+"px");setTimeout(function(){_object.moveTo(d,p,e+2,s,c,type);},s/10);}
else if(c)
c.apply(this);return this;},toLeft:function(p,s,c){return this.moveTo(0,p,0,s,c);},toRight:function(p,s,c){return this.moveTo(1,p,0,s,c);},toTop:function(p,s,c){return this.moveTo(0,p,0,s,c,"marginTop");},toBottom:function(p,s,c){return this.moveTo(1,p,0,s,c,"marginTop");},shake:function(type){var scope,step_one,step_two;if(type=="up")
scope="this.toBottom(25,70);",step_one="toTop",step_two="toBottom";else
scope="this.toLeft(25,70);",step_one="toRight",step_two="toLeft";for(var i=5;i>0;i--){if(i%2==1)
scope="this."+step_one+"(50,70,function(){ "+scope+" })";else
scope="this."+step_two+"(50,70,function(){ "+scope+" })";}
if(type=="up")
scope="this.toBottom(24,70,function(){ "+scope+" });";else
scope="this.toLeft(24,70,function(){ "+scope+" });";(new Function(" "+scope+" ")).apply(this);return this;},setOpacity:function(v){this.css("opacity",v/10);this.css("filter",'alpha(opacity='+(v*10)+')');return this;},fadeIn:function(s,c,i){if(!i||i<10){var _object=this.setOpacity(i);if(!i){i=1;this.css("display","block");}
setTimeout(function(){_object.fadeIn(s,c,i+1);},s/10);}
else if(c)
c.apply(this);return this;},fadeOut:function(s,c,i){if((!i&&i!=0)||i>0){var _object=this.setOpacity(i);i=(i)?i:10;setTimeout(function(){_object.fadeOut(s,c,i-1);},s/10);}
else{this.css("display","none");if(c)c.apply(this);}
return this;}});Class.extend(jHandler,{buildForm:function(o){var aux=0;if(o instanceof Array){for(var i=0;i<o.length;i++){if(o[i]instanceof Array)
for(var j=0;j<o[i].length;j++)
eval("jH(this[aux])."+o[i][j]+"()");else
eval("jH(this[aux])."+o[i]+"()");aux++;}}else{for(var i in o){if(o[i]instanceof Array)
for(var j=0;j<o[i].length;j++)
eval("jH(i)."+o[i][j]+"()");else
eval("jH(i)."+o[i]+"()");}}
return this;},validator:function(){this[0].onsubmit=function(){var wrongField=jH(this).find(".fBuilder_wrong");if(wrongField.length>0){alert("Preencha os campos corretamente");return false;}
else
return true;}
return this;},required:function(){this.event("blur",function(){var e=jH(this);if(e.val().length>0)e.remClass("fBuilder_wrong").addClass("fBuilder_right");else{e.remClass("fBuilder_right").addClass("fBuilder_wrong");}});return this;},completeDate:function(){this.event("keydown",function(e){var c=(e.keyCode)?e.keyCode:e.which;if(c!=8){if(this.value.length==2)
this.value+="/";else if(this.value.length==5)
this.value+="/";}});return this;},completeCpf:function(){this.event("keydown",function(e){var c=(e.keyCode)?e.keyCode:e.which;if(c!=14){if(this.value.length==3)
this.value+=".";else if(this.value.length==7)
this.value+=".";else if(this.value.length==11)
this.value+='-';}});return this;},completeMoney:function(){this.event("keyup",function(e){var c=(e.keyCode)?e.keyCode:e.which;if(c!=14&&this.value.length>=3){var newValue="";this.value=this.value.replaceAll(".","").replace(",","");if(this.value.length>=6){for(var i=6;i<=this.value.length;i++){if(i%3==0)
newValue=this.value.charAt(this.value.length-i)+"."+newValue;else
newValue=this.value.charAt(this.value.length-i)+newValue;}
newValue=newValue+this.value.substr(this.value.length-5,3)+","+this.value.substr(this.value.length-2,2);}
else
newValue=this.value.substr(0,this.value.length-2)+","+this.value.substr(this.value.length-2,2);this.value=newValue;}});},mail:function(){this.event("blur",function(){var e=jH(this);if(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(e.val()))
e.remClass("fBuilder_wrong").addClass("fBuilder_right");else
e.remClass("fBuilder_right").addClass("fBuilder_wrong");});return this;},cpf:function(){this.event("blur",function(){var cpf=this.value.replace(".","").replace(".","").replace("-","");if(cpf.length!=11||cpf=="00000000000"||cpf=="11111111111"||cpf=="22222222222"||cpf=="33333333333"||cpf=="44444444444"||cpf=="55555555555"||cpf=="66666666666"||cpf=="77777777777"||cpf=="88888888888"||cpf=="99999999999"){jH(this).remClass("fBuilder_right").addClass("fBuilder_wrong");return false;}
add=0;for(i=0;i<9;i++)
add+=parseInt(cpf.charAt(i))*(10-i);rev=11-(add%11);if(rev==10||rev==11)
rev=0;if(rev!=parseInt(cpf.charAt(9))){jH(this).remClass("fBuilder_right").addClass("fBuilder_wrong");return false;}
add=0;for(i=0;i<10;i++)
add+=parseInt(cpf.charAt(i))*(11-i);rev=11-(add%11);if(rev==10||rev==11)
rev=0;if(rev!=parseInt(cpf.charAt(10))){jH(this).remClass("fBuilder_right").addClass("fBuilder_wrong");return false;}
jH(this).remClass("fBuilder_wrong").addClass("fBuilder_right");return true;});return this;}});jServer=Class.create({conn:null,timeout:null,events:{},options:{},init:function(u,d,e,r){this.setParam(u,d,e,r);return this;},setParam:function(u,d,e,r){this.options.url=u;this.options.data=d;this.options.reconnectTime=r||25000;this.events=e;},start:function(){this.connect();},stop:function(){this.conn.abort();},connect:function(){var _object=this;this.setTimeout();this.conn=Ajax({url:_object.options.url,data:_object.options.data,comet:true,success:function(data){var responseObj=data.eval();if(_object.events[responseObj.ev.name])
_object.events[responseObj.ev.name].apply(_object,responseObj.ev.args);this.load({data:responseObj.param});_object.options.data=responseObj.param;_object.setTimeout();}});return this;},setTimeout:function(){var _object=this;if(this.timeout)
clearTimeout(_object.timeout);this.timeout=setTimeout(function(){_object.reconnect();},this.options.reconnectTime);},reconnect:function(){this.stop();this.start();},makeEvent:function(s){var data=s.split("(");return{name:data[0],param:data[1].substr(0,data[1].length-2).split(",")}}});