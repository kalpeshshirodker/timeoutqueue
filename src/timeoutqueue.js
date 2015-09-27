var timeoutQueue = (function(){
	var tq = function(){
		this.fnQueue = {
			fnDef : []
		};
	}
	
	var tqproto = tq.prototype;
	tqproto.add = function(fn, scope){		
		fn =  (fn instanceof Array) ? fn : [fn];
		var fnDef = {};
		for(var i = 0; i < fn.length; i++){			
			if(typeof fn[i] === 'function'){
				//this.fnQueue.push(fn[i]);
				fnDef = {
					fn : fn[i],
					scope : scope
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
				console.log(fnExecCmpl);
				if(fnCnt === (fnExecCmpl.success + fnExecCmpl.fail)){
					//all functions have executed
					if(fnCallback){
						fnCallback.call(scope, fnExecCmpl);
					}
				}
			}
			while(fnDef.length > 0){
				fDef = fnDef.shift();
				fn = fDef.fn;
				scope = fDef.scope || scope;
				//setTimeout(fn.bind(scope), timeout);
				(function(fn, scope){
					setTimeout(function(){
						try{
							fn.call(scope);
							cb(true);
						}
						catch(e){
							cb(false);
							throw e;
						}
					}, timeout);
				})(fn, scope);
			}	
		}
		else{
			throw "There are no functions to execute";
		}
	}
	
	return tq;
})();