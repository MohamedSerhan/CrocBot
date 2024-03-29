const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const client = new CommandoClient({
	commandPrefix: '.',
	owner: process.env.OWNER_ID
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		[ 'general', 'General Bot Commands' ],
		[ 'new sounds', 'Newly Added Sound Commands' ],
		[ 'sounds', 'Sound File Bot Commands' ]
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('in the water.');
	client.queue = {};
	if (typeof client.guilds == 'object' && typeof client.guilds[Symbol.iterator] == 'function') {
		for (guild of client.guilds) client.queue[guild.id] = [];
	}
	global.isStreaming = false;
});

client.on('error', console.error);

client.login(process.env.TOKEN);
