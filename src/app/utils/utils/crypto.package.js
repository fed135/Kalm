function generate() {
	//TODO: proper uid generation
	return (Math.random()*10000).toString();	
}

module.exports = {
	generate: generate
};