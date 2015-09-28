var timeoutQueue = (function(){
	var promise;
	var tq = function(synchronous){
		this.fnQueue = {
			fnDef : []
		};
		this.synchronous = synchronous || false;
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
		promise = new assure();
		if(!this.synchronous){
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
						promise.resolve(fnExecCmpl);
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
		else{
			me.executeSync(timeout, scope);
		}
		
		return promise;
	}
	tqproto.executeSync = function(timeout, scope){
		//call the functions in synchronous order
		//assume timeout = 10ms
		//e.g 
		//call f1 after 10ms
		//wait for f1 to finish
		//call f2 after 10ms
		//wait for f2 to finish
		//...
	}
	return tq;
})();