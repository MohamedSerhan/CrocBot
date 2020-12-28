let dispatcher;

let playSoundFile = (message, cName) => {
	function joinChannel() {
		const voiceChannel = message.member.voice.channel;
		if (voiceChannel) {
			if (!message.guild.voiceConnection) {
				voiceChannel
					.join()
					.then((connection) => {
						dispatcher = connection.play('./SoundFiles/' + cName + 'Sound.mp3');
						dispatcher.on('finish', (end) => {
							connection.disconnect();
						});
					})
					.catch(console.error);
			}
		} else {
			message.say('You must be in a voice channel to summon me!');
		}
	}
	try {
		if (global.isStreaming === false) joinChannel();
	} catch (error) {
		console.log(error);
	}
};

module.exports = playSoundFile;
