const { CommandHandler, Command } = require('discord-akairo');
const { MessageEmbed, User, Client } = require('discord.js');
const Track = require('../structures/Track');

/**
 * 
 * @param {User} user 
 * @param {Track} track 
 * @returns {MessageEmbed}
 */
function embedTrack(user, track) {
	return new MessageEmbed()
		.setColor('#dc143c')
		.setAuthor('Added to queue', user.displayAvatarURL())
		.setThumbnail(track.thumbnails.url)
		.setDescription(`**[${track.title}](${track.url})**`)
		.addFields([
			{ name: '**Channel**', value: `[${track.author.name}](${track.author.channel_url})`, inline: true },
			{ name: '**Track duration**', value: `${track.formatLength}`, inline: true }
		])
}

/**
 * 
 * @param {User} user 
 * @param {Array<Track>} queue 
 * @param {Number} page 
 * @param {Track} nowPlaying 
 * @returns 
 */
function embedQueue(user, queue, page, nowPlaying) {
	const embed = new MessageEmbed()
		.setColor('#dc143c')
		.setAuthor('Asked for queue', user.displayAvatarURL())
		.setTitle(`Music Queue (${queue.length} tracks)`)
	if (queue.length > 10) {
		embed.setFooter(`Page ${page}/${Math.ceil(queue.length/10)}`);
	}

	if (nowPlaying) {
		embed.addField('**Now Playing**', `[${nowPlaying.title}](${nowPlaying.url})\t${nowPlaying.formatLength}`);
		embed.setThumbnail(nowPlaying.thumbnails.url);
	}

	let info = '';
	if (queue.length != 0) {
		queue.slice((page-1)*10, page*10).forEach((track, idx) => {
			info += `\`${idx+1+((page-1)*10)}\`\t[${track.title}](${track.url})\t${track.formatLength}\n`;
		})
	} else {
		info += '`There\'s no song in the queue`';
	}
	try {
		embed.addField('\u200B', info);
	} catch (error) {
		embed.addField('\u200B', '`There\'s no song in this page, try another one!`');
	}

	return embed;
}

/**
 * 
 * @param {User} user 
 * @param {Object} playlist 
 * @returns
 */
function embedPlaylist(user, playlist) {
	const embed = new MessageEmbed()
		.setColor('#dc143c')
		.setAuthor('Added to queue', user.displayAvatarURL())
		.setThumbnail(playlist.bestThumbnail.url)
		.setDescription(`**[${playlist.title}](${playlist.url})**`)
		.addFields([
			{ name: '**Channel**', value: `[${playlist.author.name}](${playlist.author.url})`, inline: true },
			{ name: '**Number of Tracks**', value: `${playlist.estimatedItemCount} tracks!`, inline: true }
		])

	return embed;
}

/**
 * 
 * @param {User} user 
 * @param {Track} nowPlaying 
 * @returns 
 */
function embedNowPlaying(user, nowPlaying) {
	return new MessageEmbed()
		.setColor('#dc143c')
		.setAuthor('Now playing', user.displayAvatarURL())
		.setThumbnail(nowPlaying.thumbnails.url)
		.setDescription(`**[${nowPlaying.title}](${nowPlaying.url})**`)
		.addFields([
			{ name: '**Channel**', value: `[${nowPlaying.author.name}](${nowPlaying.author.channel_url})`, inline: true },
			{ name: '**Time left**', value: `${nowPlaying.formatLength}`, inline: true }
		])
}

/**
 * 
 * @param {User} user 
 * @param {Array} results 
 * @returns 
 */
function embedSearch(user, results, query) {
	const embed = new MessageEmbed()
		.setColor('#dc143c')
		.setAuthor('Results for search', user.displayAvatarURL())
		.setDescription(`Results for query : \`${query}\``);

	let info = "";
	results.forEach((item, idx) => {
		info += `\`${idx+1}\` Title : [${item.title}](${item.url})\n\u200B   Channel : [${item.author.name}](${item.author.url})\n`;
	});

	embed.addField('\u200B', info);

	return embed;
}

/**
 * 
 * @param {Client} client
 * @param {CommandHandler} commandHandler 
 * @param {String} prefix
 * @returns 
 */
function embedHelp(client, commandHandler, prefix) {
	const embed = new MessageEmbed()
		.setColor('#dc143c')
		.setAuthor(`Hello there, I'm ${client.user.username}!`, client.user.displayAvatarURL())
		.setDescription(`Find the list of all our commands below!
		**--------------**`);

	for (const category of commandHandler.categories.values()) {
		embed.addField(
			`ф ${category.id}`,
			`${category
				.filter(cmd => cmd.aliases.length > 0)
				.map(cmd => `\`${cmd.aliases[0]}\``)
				.join(' | ')}`
		)
	}

	embed.addField(
		'**--------------**',
		`**\`${prefix}help <command>\` for more info about a specific command.**
		Examples: \`${prefix}help play\` | \`${prefix}help ping\``
	)

	return embed;
}

/**
 * 
 * @param {Client} client
 * @param {CommandHandler} commandHandler 
 * @param {String} prefix
 * @param {Command} command
 * @returns 
 */
function embedHelpCommand(user, commandHandler, prefix, command) {
	const embed = new MessageEmbed()
		.setColor('#dc143c')
		.setAuthor('Asked for help', user.displayAvatarURL())
    .setDescription(`Help for command ${command.id}`)

  for (const [type, string] of Object.entries(command.description)) {
    embed.addField(`ф ${type}`, `${string}`)
  }

	return embed;
}

module.exports = {
	embedTrack: embedTrack,
	embedQueue: embedQueue,
	embedPlaylist: embedPlaylist,
	embedNowPlaying: embedNowPlaying,
	embedSearch: embedSearch,
	embedHelp: embedHelp,
	embedHelpCommand: embedHelpCommand
}