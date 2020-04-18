const { Command } = require('discord.js-commando');
const ytdl = require('ytdl-core');

module.exports = class PlayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			group: 'sounds',
			memberName: 'play',
            description: 'Play some music!',
            args: [
				{
					key: 'args',
					prompt: 'Please provide a link!',
					type: 'string'
				}
			]
		});
	}

	run(message, { args }) {
       if(!message.member.voiceChannel) return message.reply("Please connect to a voice channel.");

       if(message.guild.me.voiceChannel) return message.reply("Sorry, the bot is already connected.");

       if(!args) return message.reply("Please input a URL following the command.");

       let info = ytdl.getInfo(args);

       const connection = message.member.voiceChannel.join();

       const dispatcher = connection.playStream(ytdl(args, {filter: 'audioonly'}));

       message.say(`Now Playing: ${info.title}`);
	}
};
