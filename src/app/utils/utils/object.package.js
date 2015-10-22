function mixin(target, source, rules) {
	Object.getOwnPropertyNames( source ).forEach(function( key ) {
    Object.defineProperty( target, key, Object.getOwnPropertyDescriptor(source, key)) 
  });

  return target;
}

function create(vals, proto) {
	return mixin(Object.create(proto || null), vals);
}

//Cheap- but adapted
function extend(target, parent) {
	Object.keys(parent).forEach(function(e) {
		if (parent[e] instanceof Function) {
			target.prototype[e] = parent[e];
		}
		else target[e] = parent[e];
	});
}

module.exports = {
	mixin: mixin,
	create: create
};