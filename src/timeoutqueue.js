var timeoutQueue = (function(){
	var tq = function(){
		this.fnQueue =   {
			fnDef : []
		};
	}
	
	var tqproto = tq.prototype;
	tqproto.add = function(fn, scope, timeout/*, params*/){
		var params;
		fn =  (fn instanceof Array) ? fn : [fn];
		var fnDef = {};
		for(var i = 0; i < fn.length; i++){			
			if(typeof fn[i] === 'function'){
				params = undefined;
				params = Array.prototype.splice.call(arguments, 3);
				fnDef = {
					fn : fn[i],
					scope : scope,
					timeout : timeout,
					params : params
				}
				this.fnQueue.fnDef.push(fnDef);
			}
			else{
				throw "Invalid object: Function expected";
			}
		}
	}
	tqproto.execute = function(timeout, scope, fnCallback){		
		var me = this;
		var scope = scope || me;  
		var fDef, fnDef = me.fnQueue.fnDef;
		if( fnDef && fnDef.length > 0){
			var fn;
			scope = scope || me;
			
			var fnCnt = fnDef.length;
			var fnExecCmpl = {
				success : 0,
				fail : 0
			};
			
			var cb = function(isSuccess){
				if(isSuccess){
					fnExecCmpl.success++;
				}
				else{
					fnExecCmpl.fail++;
				}
				if(fnCnt === (fnExecCmpl.success + fnExecCmpl.fail)){
					//all functions have executed
					if(fnCallback){
						fnCallback.call(scope, fnExecCmpl);
					}
				}
			}
			
			var exScope, exTimeout, exParams;
			while(fnDef.length > 0){
				exScope = scope;
				exTimeout = timeout;
				exParams = undefined;
			
				fDef = fnDef.shift();
				fn = fDef.fn;
				exScope = fDef.scope || scope;
				exTimeout = fDef.timeout || timeout;
				exParams = fDef.params;
				
				(function(fn, scope, timeout, params){
					setTimeout(function(){
						try{
							fn.apply(scope, params);
							cb(true);
						}
						catch(e){
							cb(false);
							throw e;
						}
					}, timeout);
				})(fn, exScope, exTimeout, exParams);
			}	
		}
		else{
			throw "There are no functions to execute";
		}
	}
	
	return tq;
})();