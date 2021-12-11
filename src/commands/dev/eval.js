const { Command } = require('discord-akairo');
const { Message } = require('discord.js');

const clean = text => {
  if (typeof (text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}

module.exports = class EvalCommand extends Command {
  constructor() {
    super('eval', {
      aliases: ['eval'],
      category: 'Dev',
      description: {
        content: 'La commande eval permet d\'écrire du code dans Discord, par exemple pour émettre un event',
        usage: 'eval <code>',
        exemples: ['eval this.client.emit(\'guildCreate\', \'messeage.guild\')', 'eval this.client.emit(\'guildMemberAdd\', \'messeage.member\')']
      },
      ownerOnly: true,
      args: [
        {
          id: 'code',
          match: 'content',
        },
      ],
    });
  }

  /**
   * 
   * @param {Message} message 
   * @param {} param1 
   */
  async exec(message, { code }) {
    try {
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), { code: "xl" });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
};