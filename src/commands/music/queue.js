const { Command } = require('discord-akairo');
const { Message } = require('discord.js');
const { embedQueue } = require('../../util/embed');

module.exports = class QueueCommand extends Command {
	constructor() {
		super('queue', {
			aliases: ['queue', 'q'],
			category: 'Musique',
      description: {
        content: 'La commande queue permet d\'afficher la queue',
        usage: '(q)ueue <page>',
        exemples: ['queue <page>', 'q <page>']
      },
      channel: 'guild',
      args:  [
				{ id: 'page', type: 'integer', default: 1}
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
			return message.channel.send('`Vous devez être connecter à un channel fdp`');
		}
    const subscription = this.client.subscriptions.get(message.guildId);
		if (!subscription) return message.channel.send('Le Bot ne joue pas de musique sur ce serveur!');
    if (subscription.queue.length == 0) return message.channel.send('Aucune musique à suivre!');

    return message.channel.send({ embeds: [ embedQueue(message.member.user, subscription.queue, args.page, subscription.nowPlaying) ] })
  }
}