const { Listener } = require('discord-akairo');
const { Guild } = require('discord.js');
const { GuildModel } = require('../../structures/Models');

module.exports = class guildCreateListener extends Listener {
	constructor() {
		super('guildCreate', {
			emitter: 'client',
			event: 'guildCreate'
		});
	}

	/**
	 * 
	 * @param {Guild} guild 
	 */
	async exec(guild) {
		console.log(`Le Bot à rejoins la guild ${guild.name} (${guild.id})`);
		if (!await GuildModel.exists({ id: guild.id })) {
			console.log('Création du GuildModel pour la nouvelle guild')
			await GuildModel.create({ id: guild.id }, err => {
				if (err) return console.log('Une erreur !\n', err);
			})
		}

		guild.channels.fetch().then(async channels => {
			const channel = channels.find(channel => channel.name === 'welcome');
			if (!channel) {
				guild.channels.create('welcome', { reason: 'Needed a cool new channel to welcome people' })
					.then(async channel => { await this.client.guildSettings.update(guild, { welcomeChannelId: channel.id }) })
					.catch(console.error)
			} else { await this.client.guildSettings.update(guild, { welcomeChannelId: channel.id }) }
		})
	}
}