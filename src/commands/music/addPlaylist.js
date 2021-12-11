const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { Command } = require('discord-akairo');
const { Message } = require('discord.js');
const ytpl = require('ytpl');
const { embedPlaylist } = require('../../util/embed');
const MusicSubscription = require('../../structures/MusicSubscription');
const Track = require('../../structures/Track');

module.exports = class AddPlayListCommand extends Command {
	constructor() {
		super('addplaylist', {
			aliases: ['addplaylist', 'addpl', 'addp', 'ap'],
			category: 'Musique',
      description: {
        content: 'La commande addplaylist ajoute une playlist à la queue et la joue',
        usage: '(addpl)aylist <urlYoutube>',
        exemples: ['addplaylist <urlYoutube>', 'addpl <urlYoutube>']
      },
      channel: 'guild',
			args: [
				{ id: 'url', type: 'string'}
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
      // Attempt to dowload info from the user's playlist URL
      const playlist = await ytpl(args.url, { limit: 1000 });
      const firstItem = playlist.items.shift()
			// Attempt to create a Track from the user's video URL
			const track = await Track.from(firstItem.shortUrl);
			// Enqueue the track and reply a success message to the user
			subscription.enqueue(track);
			message.channel.send({ embeds: [ embedPlaylist(message.member.user, playlist, subscription.nowPlaying) ] });

      // Enqueue the rest of the playlist
      playlist.items.forEach((item, idx) => {
        const track = Track.fromYtpl(item)
        subscription.enqueue(track, false);
      })

		} catch (error) {
			console.warn(error);
			return message.channel.send('Impossible de jouer la musique, réessayé plus tard!');
		}
	}
}