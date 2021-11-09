const { Command } = require('discord-akairo');
const { Message } = require('discord.js');

module.exports = class PrefixCommand extends Command {
	constructor() {
		super('prefix', {
			aliases: ['prefix'],
      category: 'Settings',
      description: {
        content: 'La commande prefix permet de changer le prefix du Bot',
        usage: 'prefix <newPrefix>',
        exemples: ['prefix', 'prefix !']
      },
      channel: 'guild',
      args: [
				{ id: 'newPrefix', type: 'string'}
			]
		});
	}

	/**
	 * 
	 * @param {Message} message 
	 * @returns 
	 */
	async exec(message, args) {
		if (!args.newPrefix) return message.channel.send(`Préfix actuel => \`${await this.handler.prefix(message)}\``)
    await this.client.guildSettings.update(message.guild, { prefix: args.newPrefix });
    return message.channel.send(`Le nouveau prefix du serveur est maintenant => \`${args.newPrefix}\``);
	}
}