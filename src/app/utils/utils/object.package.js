function mixin(target, source, rules) {
	Object.getOwnPropertyNames( source ).forEach(function( key ) {
    Object.defineProperty( target, key, Object.getOwnPropertyDescriptor(source, key)) 
  });

  return target;
}

module.exports = {
	mixin: mixin
};