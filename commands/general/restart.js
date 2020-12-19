const { Command } = require('discord.js-commando');

module.exports = class StfuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'restart',
			group: 'general',
			memberName: 'restart',
			description: 'Use this is to make CrocBot self-restart'
		});
	}

	run(message) {
		message.channel.send('Restarted.').then(() => {
			process.exit(1);
		});
	}
};
