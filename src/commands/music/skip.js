const { Command } = require('discord-akairo');
const { Message } = require('discord.js');

module.exports = class SkipCommand extends Command {
	constructor() {
		super('skip', {
			aliases: ['skip', 's'],
		});
	}

	/**
	 * 
	 * @param {Message} message 
	 * @returns 
	 */
	async exec(message) {
		if (!message.member.voice.channelId) {
			return message.reply('`Vous devez être connecter à un channel fdp`');
		}

		const subscription = this.client.subscriptions.get(message.guildId);
		if (!subscription) return message.channel.send('Le Bot ne joue pas de musique sur ce serveur!');
		subscription.audioPlayer.stop();
		return message.channel.send('Musique skiped!');
	}
}