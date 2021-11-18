const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { Command } = require('discord-akairo');
const { Message } = require('discord.js');
const { embedTrack } = require('../../util/embed');
const MusicSubscription = require('../../structures/MusicSubscription');
const Track = require('../../structures/Track');

module.exports = class PlayCommand extends Command {
	constructor() {
		super('play', {
			aliases: ['play', 'p'],
			category: 'Musique',
      description: {
        content: 'La commande play joue de la musique à partir de Youtube',
        usage: '(p)lay <urlYoutube>',
        exemples: ['play <urlYoutube>', 'p <urlYoutube>']
      },
      channel: 'guild',
			args: [
				{ id: 'url', type: 'url'}
			]
		});
	}

	/**
	 * 
	 * @param {Message} message 
	 * @param {Object} args 
	 * @returns 
	 */
	async exec(message, args) {
		if (!message.member.voice.channelId) {
			return message.channel.send('`Vous devez vous connecter à un channel fdp`');
		}

		let subscription = this.client.subscriptions.get(message.guildId);

		if (!subscription) {
			if (message.member.voice.channel) {
				const channel = message.member.voice.channel;
				subscription = new MusicSubscription(
					joinVoiceChannel({
						channelId: channel.id,
						guildId: message.guildId,
						adapterCreator: channel.guild.voiceAdapterCreator
					})
				);
				subscription.voiceConnection.on('error', console.warn)
				this.client.subscriptions.set(message.guildId, subscription);
			} else {
				return message.channel.send('Connectez-vous à un channel vocal, puis réessayé!');
			}
		}

		try {
			await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
		} catch (error) {
			console.warn(error);
			return message.channel.send('Impossible de rejoindre le channel vocal, réessayé plus tard!');
		}

		try {
			// Attempt to create a Track from the user's video URL
			const track = await Track.from(args.url);
			// Enqueue the track and reply a success message to the user
			subscription.enqueue(track);
			return message.channel.send({ embeds: [ embedTrack(message.member.user, track) ] });
		} catch (error) {
			console.warn(error);
			return message.channel.send('Impossible de jouer la musique, réessayé plus tard!');
		}
	}
}