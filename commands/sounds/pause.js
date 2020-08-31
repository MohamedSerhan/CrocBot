const { Command } = require('discord.js-commando');
const path = require("path");
const fileName = path.basename(__filename);
const cName = fileName.substring(0, fileName.indexOf('.'));
let dispatcher;


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
            if(message.member.voice.channel) {
                if(!message.guild.voiceConnection) {
                    message.member.voice.channel.join()
                        .then(connection => {
                            dispatcher = connection.play("./SoundFiles/" + cName + "Sound.mp3");
                        dispatcher.on("finish", end => {
                            connection.disconnect();
                        });
                    })
                .catch(console.error);
                }
            }
            else {
                message.say("You must be in a voice channel to summon me!");
            }
        }
        
        joinChannel();
	}
};
