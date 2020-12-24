const { Command } = require('discord.js-commando');
const fs = require('fs');
let botIsStreaming = '';
let dispatcher;

let playSoundFile = (message, cName) => {
	function joinChannel() {
		const voiceChannel = message.member.voice.channel;
		if (voiceChannel) {
			if (!message.guild.voiceConnection && botIsStreaming === 'false') {
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
		var streamData = fs.readFileSync('./commands/youtube/stream.txt', { encoding: 'utf8' });
		if (streamData) {
			let result = streamData.split(':');
			botIsStreaming = result[1];
		}
		joinChannel();
	} catch (error) {
		console.log(error);
	}
};

module.exports = playSoundFile;
