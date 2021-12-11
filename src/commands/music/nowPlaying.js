const { Command } = require('discord-akairo');
const { Message } = require('discord.js');
const { embedNowPlaying } = require('../../util/embed');

module.exports = class NowPlayingCommand extends Command {
	constructor() {
		super('nowPlaying', {
			aliases: ['nowPlaying', 'np'],
			category: 'Musique',
      description: {
        content: 'La commande nowPlaying affiche la musique actuellement joué',
        usage: 'nowPlaying',
        exemples: ['nowPlaying', 'np']
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
		return message.channel.send({ embeds: [ embedNowPlaying(message.member, subscription.nowPlaying) ] });
	}
}