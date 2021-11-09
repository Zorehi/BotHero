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
	constructor({ url, title, author, lengthSeconds, format, thumbnails }) {
		this.url = url;
		this.title = title;
		this.author = author;
		this.lengthSeconds = lengthSeconds;
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
		return new Track({ 
			url: url,
			title: info.videoDetails.title,
			author: info.videoDetails.author,
			lengthSeconds: info.videoDetails.lengthSeconds,
			thumbnails: info.videoDetails.thumbnails,
			format: format
		});
	}

	static fromYtpl(info) {
		return new Track({ 
			url: info.shortUrl,
			title: info.title,
			author: info.author,
			lengthSeconds: info.durationSec,
			thumbnails: info.bestThumbnail,
			format: undefined
		});
	}
}