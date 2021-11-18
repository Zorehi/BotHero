const { Listener } = require('discord-akairo');
const { MessageReaction } = require('discord.js');

module.exports = class MessageReactionAddListener extends Listener {
	constructor() {
		super('messageReactionAdd', {
			emitter: 'client',
			event: 'messageReactionAdd'
		});
	}
  /**
   * 
   * @param {MessageReaction} messageReaction 
   * @param {*} user 
   */
	exec(messageReaction, user) {
		//
	}
}