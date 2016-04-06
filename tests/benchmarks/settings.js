module.exports = {
	adapter: 'tcp',
	encoder: 'msg-pack',
	port: 3000,
	bundlerDelay: 16,
	bundlerMaxPackets: 512,
	testDuration: 1000 * 1,
	testPayload: { foo: 'bar'},
	testChannel: 'test'
};