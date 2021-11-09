const { Command } = require('discord-akairo');
const { Message } = require('discord.js');

module.exports = class LoopQueueCommand extends Command {
	constructor() {
		super('loopqueue', {
			aliases: ['loopqueue', 'lpq', 'lpqueue'],
			category: 'Musique',
      description: {
        content: 'La commande loopqueue permet de rejouer les musiques qui sont dans la queue',
        usage: 'loopqueue',
        exemples: ['loopqueue', 'lpq', 'lpqueue']
      },
      channel: 'guild'
		});
	}

	/**
	 * 
	 * @param {Message} message 
	 * @returns 
	 */
	async exec(message) {
		if (!message.member.voice.channelId) {
			return message.channel.send('`Vous devez être connecter à un channel fdp`');
		}

		const subscription = this.client.subscriptions.get(message.guildId);
		if (!subscription) return message.channel.send('Le Bot ne joue pas de musique sur ce serveur!');

		if (subscription.loopQueue) {
			subscription.loopQueue = false;
			return message.channel.send('Queue unloop!')
		} else {
			subscription.loopQueue = true;
			return message.channel.send('Queue looped!')
		}
	}
}