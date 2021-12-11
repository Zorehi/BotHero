const { Listener } = require('discord-akairo');
const { GuildModel } = require('../../util/models');

module.exports = class guildDeleteListener extends Listener {
	constructor() {
		super('guildDelete', {
			emitter: 'client',
			event: 'guildDelete'
		});
	}

	exec(guild) {
		console.log(`Le Bot à été kick de la guild ${guild.name} (${guild.id})`);
    GuildModel.deleteOne({ id: guild.id }, err => {
      if (err) return console.log('Une erreur !\n', err);
    })
  }
}