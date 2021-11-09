const { VoiceConnection, createAudioPlayer, VoiceConnectionStatus, VoiceConnectionDisconnectReason, entersState, AudioPlayerStatus } = require("@discordjs/voice");
const Track = require("./Track");

module.exports = class MusicSubscription {
	/**
	 * 
	 * @param {VoiceConnection} voiceConnection 
	 */
	constructor(voiceConnection) {
		this.voiceConnection = voiceConnection;
		this.audioPlayer = createAudioPlayer();
		this.readyLock = false;
		this.queueLock = false;
		this.queue = [];
		this.nowPlaying = undefined;
		this.loop = false;
		this.loopQueue = false

		// Configure audio player
		this.audioPlayer.on('stateChange', (oldState, newState) => {
			if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
				// If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
				// The queue is then processed to start playing the next track, if one is available.
				this.processQueue();
			} else if (newState.status === AudioPlayerStatus.Playing) {
				// If the Playing state has been entered, then a new track has started playback.
			}
		});

		this.audioPlayer.on('error', error => { console.log(error) });

		voiceConnection.subscribe(this.audioPlayer);
	}

	/**
	 * Adds a new Track to the queue.
	 * 
	 * @param {Track} track 
	 */
	enqueue(track, process=true) {
		this.queue.push(track);
		if (process) this.processQueue();
	}

	/**
	 * Stops audio playback and empties the queue
	 */
	stop() {
		this.queueLock = true;
		this.queue = [];
		this.audioPlayer.stop(true);
	}

	/**
	 * Attempts to play a Track from the queue
	 * 
	 * @returns {void}
	 */
	async processQueue() {
		// En fonction des modes que les utilisateurs on choisis
		if (this.nowPlaying) {
			if (this.loopQueue && !this.loop) {
				this.queue.push(this.nowPlaying);
			} else if (this.loop) {
				this.queue.unshift(this.nowPlaying);
			}
		}

		// If the queue is locked (already being processed), is empty, or the audio player is already playing something, return
		if (this.queueLock || this.audioPlayer.state.status !== AudioPlayerStatus.Idle || this.queue.length === 0) {
			return;
		}
		if (this.queue.length === 0) {
			this.nowPlaying = undefined;
			return;
		}
		// Lock the queue to guarantee safe access
		this.queueLock = true;

		// Take the first item from the queue. This is guaranteed to exist due to the non-empty check above.
		const nextTrack = this.queue.shift();

		try {
			// Attempt to convert the Track into an AudioResource (i.e. start streaming the video)
			const resource = await nextTrack.createAudioRessource();
			this.audioPlayer.play(resource);
			this.nowPlaying = nextTrack;
			this.queueLock = false;
		} catch (error) {
			// If an error occurred, try the next item of the queue instead
			console.warn(error)
			this.nowPlaying = undefined;
			this.queueLock = false;
			return this.processQueue();
		}
	}
}