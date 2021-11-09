const { Command } = require('discord-akairo');
const { Message } = require('discord.js');

module.exports = class StopCommand extends Command {
	constructor() {
		super('stop', {
			aliases: ['stop'],
			category: 'Musique',
      description: {
        content: 'La commande stop arrète la musique et déconnecte le Bot',
        usage: 'stop',
        exemples: ['stop']
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
		subscription.voiceConnection.destroy();
		return message.channel.send('Musique stopped!');
	}
}