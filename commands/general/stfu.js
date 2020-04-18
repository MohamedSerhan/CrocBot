const { Command } = require('discord.js-commando');

module.exports = class StfuCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stfu',
			group: 'general',
			memberName: 'stfu',
            description: 'When you really want to that one person to stay silent, use this!',
            usage: 'stfu <name>',
			args: [
				{
					key: 'name',
					prompt: 'Please type in a name.',
					type: 'string'
				}
			]
		});
	}

	run(message, { name }) {
        message.say("Dear " + name + ", Please shut the fuck up you lil bitch. Thank you.");    
    }
};
