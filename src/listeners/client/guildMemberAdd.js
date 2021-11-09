const { Listener } = require('discord-akairo');
const { GuildMember } = require('discord.js');

module.exports = class guildMemberAddListener extends Listener {
	constructor() {
		super('guildMemberAdd', {
			emitter: 'client',
			event: 'guildMemberAdd'
		});
	}

	/**
	 * 
	 * @param {GuildMember} member 
	 */
	exec(member) {
		console.log(`Bonjour à tous, je suis ${member.user.username} (Guild: ${member.guild.name})`);
	}
}