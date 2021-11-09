const { default: Collection } = require("@discordjs/collection");
const { AkairoClient, CommandHandler, ListenerHandler } = require("discord-akairo");
const mongoose = require("mongoose");
const { MONGOSTRING, TOKEN } = require("../util/config");
const { GuildsProvider } = require("./Providers");

module.exports = class HeroClient extends AkairoClient {
	constructor(config = {}) {
		super(
			{ ownerID: '276811682330836992' },
			{
				allowedMentions: {
					parse: ['roles', 'everyone', "users"],
					repliedUser: false
				},
				partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
				presence: {
					status: 'online',
					activities: [
						{
							name: 'Visual Studio Code',
							type: 'STREAMING',
							url: 'https://www.linkedin.com/in/j%C3%A9r%C3%A9my-legrix-994a67198/'
						}
					]
				},
				intents: 32767
			}
		);

		this.subscriptions = new Collection();

		this.guildSettings = new GuildsProvider();

		this.commandHandler = new CommandHandler(this, {
			allowMention: true,
			prefix: async message => {
				const guildPrefix = await this.guildSettings.get(message.guild);
				if (guildPrefix) return guildPrefix.prefix;
				return config.prefix;
			},
			defaultCooldown: 500,
			directory: './src/commands/'
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: './src/listeners/'
		})

		this.commandHandler.loadAll();
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.loadAll();
	}

	async start() {
		try {
			await mongoose.connect(MONGOSTRING, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			})
			console.log("DB connectée!")
		} catch (e) {
			console.log("DB pas connectée! Voir l'erreur ci-dessous\n", e);
			process.exit();
		}

		return this.login(TOKEN)
	}
}