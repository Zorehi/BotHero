const { Command } = require('discord-akairo');
const { Message } = require('discord.js');

module.exports = class LoopCommand extends Command {
	constructor() {
		super('loop', {
			aliases: ['loop', 'lp'],
			category: 'Musique',
      description: {
        content: 'La commande loop remet la musique actuellement joué à chaque fois',
        usage: 'loop',
        exemples: ['loop', 'lp']
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

		if (subscription.loop) {
			subscription.loop = false;
			return message.channel.send('Musique unloop!')
		} else {
			subscription.loop = true;
			return message.channel.send('Musique looped!')
		}
	}
}