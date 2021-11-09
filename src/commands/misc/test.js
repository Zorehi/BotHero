const { Command } = require('discord-akairo');
const { Message, MessageEmbed } = require('discord.js');

module.exports = class TestCommand extends Command {
	constructor() {
		super('test', {
			aliases: ['test'],
      category: 'Settings',
      description: {
        content: 'La commande prefix permet de changer le prefix du Bot',
        usage: 'prefix <newPrefix>',
        exemples: ['prefix', 'prefix !']
      },
      channel: 'guild',
		});
	}

	/**
	 * 
	 * @param {Message} message 
	 * @returns 
	 */
	async exec(message) {
    // inside a command, event listener, etc.
    const exampleEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Some title')
      .setURL('https://discord.js.org/')
      .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
      .setDescription('Some description here')
      .setThumbnail('https://i.imgur.com/wSTFkRM.png')
      .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true },
      )
      .addField('Inline field title', 'Some value here')
      .setImage('https://i.imgur.com/wSTFkRM.png')
      .setTimestamp()
      .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

      message.channel.send({ embeds: [ exampleEmbed ] });
	}
}