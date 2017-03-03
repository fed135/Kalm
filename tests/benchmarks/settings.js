module.exports = {
	transport: 'TCP',
	port: 3000,
	profile: { tick: 5, maxBytes: 1400 },
	testDuration: 1000 * 60,
	testPayload: { foo: 'bar'},
	testChannel: 'test'
};