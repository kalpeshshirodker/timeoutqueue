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
	tqproto.execute = function(timeout, scope){
		if(!this.synchronous){
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
		else{
			this.executeSync(timeout, scope);
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