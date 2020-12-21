const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');
const fileName = path.basename(__filename);
const cName = fileName.substring(0, fileName.indexOf('.'));
let botIsStreaming = '';
let dispatcher;

module.exports = class PlayFileCommand extends Command {
	constructor(client) {
		super(client, {
			name: cName,
			group: 'new sounds',
			memberName: cName,
			description: 'Plays a ' + cName + ' sound file.'
		});
	}

	run(message) {
		var streamData = fs.readFileSync('./commands/youtube/stream.txt', { encoding: 'utf8' });
		if (streamData) {
			let result = streamData.split(':');
			botIsStreaming = result[1];
			console.log(result);
		}
		console.log(botIsStreaming);
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

		joinChannel();
	}
};
