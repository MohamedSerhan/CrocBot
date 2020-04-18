const { Command } = require('discord.js-commando');

module.exports = class ArgsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'args-info',
			group: 'general',
			memberName: 'args-info',
			description: 'Replies with arg information.',
			args: [
				{
					key: 'text',
					prompt: 'What text would you like the bot to say?',
					type: 'string'
				}
			]
		});
	}

	run(message, { args }) {
		if (args === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	}
};
