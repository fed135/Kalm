const EventEmitter = require('events').EventEmitter;

class Child extends EventEmitter {
	constructor() {
		super();
	}

	run() {
		this.emit('something', 'Hello!');
	}
}

class Test extends EventEmitter {
	constructor() {
		super();
	}
}

const foo = new Test();
foo.prototype = new Child(); 
foo.on('something', console.log);
console.log(foo);
foo.prototype.run();
setTimeout(()=> { console.log('ok, then'); }, 1000);


/*--------------------------------------------------*/


let socket = Object.assign({}, Client, Multiplexed, Queue, Serializer, EventEmitter.prototype, options);