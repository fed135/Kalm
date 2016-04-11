module.exports = {
	adapter: 'tcp',
	encoder: 'msg-pack',
	port: 3000,
	bundlerDelay: 16,
	bundlerMaxPackets: 1024,
	testDuration: 1000 * 60,
	testPayload: { foo: 'bar'},
	testChannel: 'test'
};