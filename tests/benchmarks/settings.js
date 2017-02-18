module.exports = {
	transport: 'TCP',
	port: 3000,
	profile: { step: 16, maxBytes: 1400 },
	testDuration: 1000 * 1,
	testPayload: { foo: 'bar'},
	testChannel: 'test'
};