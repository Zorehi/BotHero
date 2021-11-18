const { Command } = require('discord-akairo')

module.exports = class RestartCommand extends Command {
	constructor() {
		super('restart', {
			aliases: ['restart', 'rs'],
			category: 'Dev',
      ownerOnly: true,
      description: {
        content: 'La commande restart comme sont nom l\'indique restart le bot',
        usage: 'restart',
        exemples: ['restart']
      },
      channel: 'guild',
		});
	}

	exec() {
		require('child_process').execSync('pm2 restart 0');
	}
}