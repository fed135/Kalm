/**
 * Default properties for new Clients/ Servers
 * @class config
 */

'use strict'

/* Exports -------------------------------------------------------------------*/

module.exports = {
	/**
	 * @property hostname
	 * Default value: '0.0.0.0'
	 */
	hostname: '0.0.0.0',
	/**
	 * @property port
	 * Default value: 3000
	 */
	port: 3000,
	/**
	 * @property recordStats
	 * Default value: false
	 */
	recordStats: true,
	/**
	 * Terminates requests with no listeners
	 * @property rejectUnsubscribed
	 * Default: true
	 */
	rejectForeign: true
};