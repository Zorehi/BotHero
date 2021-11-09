const { Command } = require('discord-akairo');
const { Message } = require('discord.js');

module.exports = class ResumeCommand extends Command {
	constructor() {
		super('resume', {
			aliases: ['unpause', 'resume'],
			category: 'Musique',
      description: {
        content: 'La commande resume remet la musique en marche',
        usage: 'resume',
        exemples: ['resume']
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
		subscription.audioPlayer.unpause();
		return message.channel.send('Musique unpaused!');

	}
}