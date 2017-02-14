/**
 * Queue system
 */

'use strict';

/* Local variables -----------------------------------------------------------*/

const reservedBytes = 20;

/* Methods -------------------------------------------------------------------*/

function QueueManager(scope) {
	return {
		queues: {},
		queue: (name, profile) => {
			if (scope.queues.hasOwnProperty(name)) return scope.queues[name];

			scope.queues[name] = Queue({ 
				name,
				frame: 0,
				packets: [],
				timer: null,
				bytes: 0
			}, profile || scope.profile, scope.end);

			scope.queues[name].reset(scope.queues[name].step);

			return scope.queues[name];
		}	
	};
}

function Queue(scope, profile, end) {
	return {
		reset: (step) => {
			clearInterval(scope.timer);
			if (profile.tick !== null) {
				scope.timer = setInterval(step, profile.tick);
			}
		},
		add: (packet) => {
			scope.packets.push(packet);
			
			if (profile.maxBytes !== null) {
				scope.bytes += packet.length;
				if (scope.bytes >= (profile.maxBytes + reservedBytes)) scope.process();
			}
		},
		step: () => {
			if (scope.packets.length > 0) {
				end(scope, scope.packets.concat());
				scope.packets.length = 0;
				scope.bytes = 0;
				scope.frame++;
			}
		}
	};
}

/* Exports -------------------------------------------------------------------*/

module.exports = QueueManager;