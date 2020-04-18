const { Command } = require('discord.js-commando');

module.exports = class ResumeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'resume',
			group: 'sounds',
			memberName: 'resume',
            description: 'Resume the sound stream.',
		});
	}

	run(message) {
       var fetched = ops.active.get(message.guild.id);
       if(!fetched) return message.say("There currently isn't any music playing!");
       if(message.member.voiceChannel !== message.guild.me.voiceChannel) return message.say("Sorry, you need to be in the channel to control me!");
       if(!fetched.dispatcher.paused) return message.say("Music is already paused!");
       
       fetched.dispatcher.resume();
       message.say("Sounds are now playing.");
	}
};
