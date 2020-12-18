const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { prefix } = require('./config.json');

const client = new CommandoClient({
	commandPrefix: '.',
	owner: '169178004684144650'
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		[ 'general', 'General Bot Commands' ],
		[ 'sounds', 'Sound File Bot Commands' ],
		[ 'new sounds', 'Newly Added Sound Commands' ]
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('Chilling in the water.');
	client.queue = {};
	if (typeof client.guilds == 'object' && typeof client.guilds[Symbol.iterator] == 'function') {
		for (guild of client.guilds) client.queue[guild.id] = [];
	}
});

client.on('error', console.error);

client.login(process.env.TOKEN);
