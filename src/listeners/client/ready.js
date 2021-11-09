const { Listener } = require('discord-akairo');

module.exports = class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
	}

	exec() {
		console.log('I\'m ready!');
	}
}