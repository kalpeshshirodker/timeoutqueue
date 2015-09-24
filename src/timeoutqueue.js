var timeoutQueue = (function(){
	var tq = function(synchronous){
		this.fnQueue = [];
		this.synchronous = synchronous || false;
	}
	
	var tqproto = tq.prototype;
	tqproto.add = function(fn){
		if(typeof fn === 'function'){
			this.fnQueue.push(fn);
		}
		else{
			throw "Invalid object: Function expected";
		}
	}
	tqproto.execute = function(timeout, scope, fnCallback){		
		var me = this;
		if(!this.synchronous){
			if(me.fnQueue && me.fnQueue.length > 0){
				var fn;
				scope = scope || me;
				
				var fnCnt = me.fnQueue.length;
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
				while(me.fnQueue.length > 0){
					fn = me.fnQueue.shift();
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
	}
	tqproto.executeSync = function(timeout, scope){
		if(this.fnQueue && this.fnQueue.length > 0){
			var fn;
			scope = scope || this;
			while(this.fnQueue.length > 0){
				fn = this.fnQueue.shift();
				setTimeout(fn.bind(scope), timeout);
			}	
		}
		else{
			throw "There are no functions to execute";
		}
	}
	
	return tq;
})();