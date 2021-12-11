const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { Command } = require('discord-akairo');
const { Message } = require('discord.js');
const ytsr = require('ytsr');
const { embedSearch, embedTrack } = require('../../util/embed');
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
	 * @param {String} query 
	 * @returns 
	 */
	async exec(message, { query } ) {
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
		const filters = await ytsr.getFilters(query);
		const filter = filters.get('Type').get('Video');

		// Recherche dans Youtube fr 
		const search = await ytsr(filter.url, { gl: 'FR', hl: 'fr', limit: 5 });

		const emojis = [ 
			'\u0031\uFE0F\u20E3', // Emoji :one:
			'\u0032\uFE0F\u20E3', // Emoji :two:
			'\u0033\uFE0F\u20E3', // Emoji :three:
			'\u0034\uFE0F\u20E3', // Emoji :four:
			'\u0035\uFE0F\u20E3', // Emoji :five:
		];
		const messageChoice = await message.channel.send({ embeds: [ embedSearch(message.member.user, search.items, query) ] });
		emojis.forEach((emoji, idx) => { messageChoice.react(emoji); });

		const filterReaction = (reaction, user) => {
			return (emojis.findIndex(element => element === reaction.emoji.name) != -1 ? true : false) && user.id === message.author.id;
		};
		const reactionsCollector = messageChoice.createReactionCollector({ filter: filterReaction, max: 1, time: 60e3 });
		reactionsCollector.once('collect', r => {
			const idx = emojis.findIndex(element => element == r.emoji.name);
			const track = Track.fromYtsr(search.items[idx]);
			subscription.enqueue(track);
			message.channel.send({ embeds: [ embedTrack(message.member, track) ] });
		});
	}
}