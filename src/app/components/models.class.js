module.exports = {
	pkgName: 'models',
	attributes: {
		list: [
			///////////////// Cache ////////////////
			{
				tableName: 'cache',
				_exposed: false,
				adapter: 'sails-memory',
				attributes: {
					key: {
						type: 'string',
						required: true,
						unique: true
					},
					data: {
						type: 'json'
					},
					ttl: {
						type: 'integer',
						defaultsTo: 60000 * 5	//5 Minutes
					}
				}
			}
		]
	},
	methods: {
		print: function() {
			return ;
		}
	}
};