const { Listener } = require('discord-akairo')

module.exports = class MissingPermissionsCommand extends Listener {
	constructor() {
		super('missingPermissions', {
			emitter: 'commandHandler',
			event: 'missingPermissions'
		});
	}

	async exec(message, command, type, missing) {
		if (type == 'client') {
			return await message.reply(`Il me manque l${missing.length > 1 ? 'es' : 'a'} permission${missing.length > 1 ? 's' : ''} \`${missing}\` pour la commande **${command.id}** !`)
		} else {
			return await message.reply(`Il te manque l${missing.length > 1 ? 'es' : 'a'} permission${missing.length > 1 ? 's' : ''} \`${missing}\` pour la commande **${command.id}** !`)
		}
	}
}