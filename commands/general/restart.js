const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class StfuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'restart',
			group: 'general',
			memberName: 'restart',
			description: 'Did you break CrocBot? Try this. Use this is to make CrocBot self-restart.'
		});
	}

	run(message) {
		message.channel.send('Restarted.').then(() => {
			try {
				fs.writeFileSync('./commands/youtube/stream.txt', 'stream:false');
			} catch (error) {
				console.log('restart: ', error);
			}
			//process.exit(1);
		});
	}
};
