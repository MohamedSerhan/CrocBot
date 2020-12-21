const { Command } = require('discord.js-commando');

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
			fs.writeFileSync('./commands/youtube/stream.txt', 'stream:false');
			process.exit(1);
		});
	}
};
