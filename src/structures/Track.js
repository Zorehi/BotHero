const { createAudioResource, demuxProbe } = require("@discordjs/voice");
const ytdl = require("ytdl-core");

function filter(format) {
	return format.codecs === 'opus' &&
		format.container === 'webm' /* &&
		format.audioSampleRate == 48000 */;
}

async function probeAndCreateResource(readableStream) {
	const { stream, type } = await demuxProbe(readableStream);
	return createAudioResource(stream, { inputType: type });
}

module.exports = class Track {
	constructor({ url, title, author, lengthSeconds, formatLength, format, thumbnails }) {
		this.url = url;
		this.title = title;
		this.author = author;
		this.lengthSeconds = lengthSeconds;
		this.formatLength = formatLength;
		this.format = format;
		this.thumbnails = thumbnails
	}

	async createAudioRessource(options = {}) {
		if (!this.format) {
		  const info = await ytdl.getInfo(this.url);
		  this.format = info.formats.find(filter);
		}
		const canDemux = this.format && this.lengthSeconds != 0;
		if (canDemux) options = { ...options, filter };
		else if (this.lengthSeconds != 0) options = { ...options, filter: 'audioonly' };
		return probeAndCreateResource(ytdl(this.url, options))
		// return createAudioResource(ytdl(this.url, { filter: 'audioonly' }));
	}

	static async from(url) {
		const info = await ytdl.getInfo(url);
		const format = info.formats.find(filter);
		const minutes = Math.floor(info.videoDetails.lengthSeconds / 60);
		const secondes = info.videoDetails.lengthSeconds - minutes * 60;
		return new Track({ 
			url: url,
			title: info.videoDetails.title,
			author: info.videoDetails.author,
			lengthSeconds: info.videoDetails.lengthSeconds,
			formatLength: `${minutes}:${secondes > 9 ? secondes : '0'+secondes}`,
			thumbnails: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1],
			format: format
		});
	}

	static fromYtpl(info) {
		const minutes = Math.floor(info.durationSec / 60);
		const secondes = info.durationSec - minutes * 60;
		return new Track({ 
			url: info.shortUrl,
			title: info.title,
			author: info.author,
			lengthSeconds: info.durationSec,
			formatLength: `${minutes}:${secondes > 9 ? secondes : '0'+secondes}`,
			thumbnails: info.bestThumbnail,
			format: undefined
		});
	}

	static fromYtsr(info) {
		const numbers = info.duration.split(':');
		numbers.forEach(i => i = parseInt(i));
		const durationSec = numbers[0] * 60 + numbers[1];
		return new Track({ 
			url: info.url,
			title: info.title,
			author: info.author,
			lengthSeconds: durationSec,
			formatLength: info.duration,
			thumbnails: info.bestThumbnail,
			format: undefined
		});
	}
}