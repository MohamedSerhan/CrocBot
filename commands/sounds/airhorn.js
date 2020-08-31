const { Command } = require('discord.js-commando');
const path = require("path");
const fileName = path.basename(__filename);
const cName = fileName.substring(0, fileName.indexOf('.'));


module.exports = class PlayFileCommand extends Command {
	constructor(client) {
		super(client, {
			name: cName,
			group: 'sounds',
			memberName: cName,
            description: 'Plays a ' + cName + ' sound file.',
		});
	}

	run(message) {
        function joinChannel() {
            if(message.member.voiceChannel) {
                if(!message.guild.voiceConnection) {
                    message.member.voiceChannel.join()
                        .then(connection => {
                            if(message.member.id !== "169494506050158594") {
                                const dispatcher = connection.playFile("C:\\Users\\xxsku\\Documents\\MyCode\\CrocBotWorkspace\\CrocBot\\SoundFiles\\" + cName + "Sound.mp3");
                            }
                            else {
                                const dispatcher = connection.playFile("C:\\Users\\xxsku\\Documents\\MyCode\\CrocBotWorkspace\\CrocBot\\SoundFiles\\" + "shortairhorn" + "Sound.mp3");
                            }
                        dispatcher.on("end", end => {
                            leaveChannel();
                        });
                    })
                .catch(console.error);
                }
            }
            else {
                //message.say("You must be in a voice channel to summon me!");
                message.say(`Log1: ${message} Log2: ${message.member.voiceChannel} Log3: ${message.guild.voiceConnection} Log4: ${message.member.id}`);
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
