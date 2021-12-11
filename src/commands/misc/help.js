const { Command } = require('discord-akairo');
const { Message } = require('discord.js');
const { embedHelp } = require('../../util/embed');

module.exports = class HelpCommand extends Command {
	constructor() {
		super('help', {
			aliases: ['help', 'h'],
			category: 'Misc',
      description: {
        content: 'La commande help envoie les commandes disponible sur le Bot',
        usage: '(h)elp',
        exemples: ['help', ]
      },
      channel: 'guild',
      args: [{id: 'command', type: 'commandAlias'}]
		});
	}

  /**
   * 
   * @param {Message} message 
   * @param {*} param1 
   * @returns 
   */
	async exec(message, {command}) {
    const prefix = await this.handler.prefix(message);
		if (!command) {
      return message.channel.send({embeds: [ embedHelp(this.client, this.handler, prefix) ]});
    }
	}
}