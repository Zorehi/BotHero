const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { Command } = require('discord-akairo');
const { Message } = require('discord.js');
const ytsr = require('ytsr');
const { embedSearch } = require('../../util/embed');
const MusicSubscription = require('../../structures/MusicSubscription');
const Track = require('../../structures/Track');

module.exports = class SearchCommand extends Command {
	constructor() {
		super('search', {
			aliases: ['search'],
			category: 'Musique',
      description: {
        content: 'La commande search ajoute une playlist à la queue et la joue',
        usage: 'search <yourQuery>',
        exemples: ['search <yourQuery>']
      },
      channel: 'guild',
			args: [
				{ id: 'query', type: 'string', match: 'content'}
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

		// Génération des filtres pour avoir que des videos
		const filters = await ytsr.getFilters(args.query);
		const filter = filters.get('Type').get('Video');

		// Recherche dans Youtube fr 
		const search = await ytsr(filter.url, { gl: 'FR', hl: 'fr', limit: 5 });

		const messageChoice = await message.channel.send({ embeds: [ embedSearch(message.member.user, search.items, args.query) ] });
		const emojies = [ '<:one:>', '<:two:>', '<:three:>', '<:four:>', '<:five:>' ];
		emojies.forEach((emoji, idx) => { messageChoice.react(emoji) });
		return ;

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