const { Command } = require('discord-akairo');
const { Message } = require('discord.js');

module.exports = class PauseCommand extends Command {
	constructor() {
		super('pause', {
			aliases: ['pause'],
			category: 'Musique',
      description: {
        content: 'La commande pause met en pause la musique actuellement joué',
        usage: 'pause',
        exemples: ['pause']
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
		subscription.audioPlayer.pause();
		return message.channel.send('Musique paused!');
	}
}