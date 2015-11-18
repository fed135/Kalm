/**
 * Crypto utils
 * @exports {object}
 */

'use strict'

/* Local variables -----------------------------------------------------------*/

var lut = null;

/* Methods -------------------------------------------------------------------*/

/**
 * Generates a unique id
 * @method generate
 * @returns {string} The generated unique id
 */
function generate() {
	if (lut === null) {
		lut = [];
		for(var i = 0; i < 256; i++) { 
			lut[i] = (i<16?'0':'') + (i).toString(16); 
		}
	}

	//E7
	var d0 = Math.random()*0xffffffff|0;
  var d1 = Math.random()*0xffffffff|0;
  var d2 = Math.random()*0xffffffff|0;
  var d3 = Math.random()*0xffffffff|0;
  return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
    lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
    lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
    lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];	
}

/* Exports -------------------------------------------------------------------*/

module.exports = {
	generate: generate
};