const { Command } = require('discord.js-commando');

module.exports = class PlayFileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'playf',
			group: 'sounds',
			memberName: 'playf',
            description: 'Plays a specified sound file.',
            args: [
				{
					key: 'args',
					prompt: 'Please provide args!',
					type: 'string'
				}
			]
		});
	}

	run(message, { args }) {
        function joinChannel() {
            if(message.member.voiceChannel) {
                if(!message.guild.voiceConnection) {
                    message.member.voiceChannel.join()
                        .then(connection => {
                            const dispatcher = connection.playFile("C:\\Users\\xxsku\\Documents\\MyCode\\CrocBotWorkspace\\CrocBot\\SoundFiles\\" + args + "Sound.mp3");
                        dispatcher.on("end", end => {
                            leaveChannel();
                        });
                    })
                .catch(console.error);
                }
            }
            else {
                message.say("You must be in a voice channel to summon me!");
            }
        }
        
        function leaveChannel() {
            if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }
            else {
                message.say("I must be in a voice channel to be banished!");
            }
        }

        joinChannel();
	}
};
