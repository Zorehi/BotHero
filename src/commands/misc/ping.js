const { Command } = require('discord-akairo')

module.exports = class PingCommand extends Command {
	constructor() {
		super('ping', {
			aliases: ['ping'],
			category: 'Misc',
      description: {
        content: 'La commande ping renvoie pong',
        usage: 'ping',
        exemples: ['ping']
      },
      channel: 'guild',
		});
	}

	exec(message) {
		return message.reply('Pong!');
	}
}