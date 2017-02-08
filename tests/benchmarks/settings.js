module.exports = {
	adapter: 'tcp',
	encoder: 'json',
	port: 3000,
	bundlerDelay: 16,
	bundlerMaxPackets: 2048,
	testDuration: 1000 * 1,
	testPayload: { foo: 'bar'},
	testChannel: 'test'
};