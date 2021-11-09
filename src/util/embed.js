const { MessageEmbed, User } = require('discord.js');
const Track = require('./Track');

/**
 * 
 * @param {User} user 
 * @param {Track} track 
 * @returns {MessageEmbed}
 */
function embedTrack(user, track) {
	const minutes = Math.floor(track.lengthSeconds / 60);
	const secondes = track.lengthSeconds - minutes * 60;
	return new MessageEmbed()
		.setColor('#dc143c')
		.setAuthor('Added to queue', user.displayAvatarURL())
		.setThumbnail(track.thumbnails[track.thumbnails.length - 1].url)
		.setDescription(`**[${track.title}](${track.url})**`)
		.addFields([
			{ name: '**Channel**', value: `[${track.author.name}](${track.author.channel_url})`, inline: true },
			{ name: '**Track duration**', value: `${minutes > 10 ? minutes : '0' + minutes}:${secondes > 10 ? secondes : '0' + secondes}`, inline: true }
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
		const minutes = Math.floor(nowPlaying.lengthSeconds / 60);
		const secondes = nowPlaying.lengthSeconds - minutes * 60;
		embed.addField('**Now Playing**', `[${nowPlaying.title}](${nowPlaying.url})\t${minutes > 10 ? minutes : '0' + minutes}:${secondes > 10 ? secondes : '0' + secondes}`);
	}

	let info = '';
	if (queue.length != 0) {
		queue.slice((page-1)*10, page*10).forEach((track, idx) => {
			const minutes = Math.floor(track.lengthSeconds / 60);
			const secondes = track.lengthSeconds - minutes * 60;
			info += `\`${idx+1+((page-1)*10)}\`\t[${track.title}](${track.url})\t${minutes > 10 ? minutes : '0' + minutes}:${secondes > 10 ? secondes : '0' + secondes}\n`;
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
function embedPlaylist(user, playlist, nowPlaying) {
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

module.exports = {
	embedTrack: embedTrack,
	embedQueue: embedQueue,
	embedPlaylist: embedPlaylist,
}