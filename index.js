require('dotenv/config');
const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity('in the water.');
    // Old sound related code
    // client.queue = {};
    // if (typeof client.guilds == 'object' && typeof client.guilds[Symbol.iterator] == 'function') {
    //     for (guild of client.guilds) client.queue[guild.id] = [];
    // }
    // global.isStreaming = false;
});

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
    if(message.author.bot) return;
    if(message.channel.id !== process.env.DISCORD_CHANNEL_ID) {
        if(message.channel.id !== process.env.DISCORD_DEV_CHANNEL_ID) return;
    };
    if(!message.content.startsWith('o wise one:')) return;

    const conversationLog = [{
        role: 'system',
        content: 'You are an arrogant and cocky chatbot.'
    }];

    await message.channel.sendTyping();

    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
        if(msg.author.id !== client.user.id && message.author.bot) return;
        if(msg.author.id !== message.author.id) return;

        conversationLog.push({
            role: 'user',
            content: msg.content
        });
    });

    const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
    });

    message.reply(result.data.choices[0].message);
});

client.login(process.env.DISCORD_TOKEN);


// require('dotenv').config();
// const { Client, Events, GatewayIntentBits } = require('discord.js');

// const client = new Client({
//     intents: [GatewayIntentBits.Guilds]
// });

// client.once(Events.ClientReady, c => {
// 	// console.log(`Ready! Logged in as ${c.user.tag}`);
//     console.log(`Logged in as ${c.user.tag}! (${c.user.id})`);
//     client.user.setActivity('in the water.');
//     // client.queue = {};
//     // if (typeof client.guilds == 'object' && typeof client.guilds[Symbol.iterator] == 'function') {
//     //     for (guild of client.guilds) client.queue[guild.id] = [];
//     // }
//     // global.isStreaming = false;
// });

// client.login(process.env.DISCORD_TOKEN);


// client.once(Events.)








// const { CommandoClient } = require('discord.js-commando');
// const path = require('path');

// const client = new CommandoClient({
// 	commandPrefix: '.',
// 	owner: process.env.OWNER_ID
// });

// client.registry
// 	.registerDefaultTypes()
// 	.registerGroups([
// 		[ 'general', 'General Bot Commands' ],
// 		[ 'new sounds', 'Newly Added Sound Commands' ],
// 		[ 'sounds', 'Sound File Bot Commands' ]
// 	])
// 	.registerDefaultGroups()
// 	.registerDefaultCommands()
// 	.registerCommandsIn(path.join(__dirname, 'commands'));

// client.once('ready', () => {
// 	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
// 	client.user.setActivity('in the water.');
// 	client.queue = {};
// 	if (typeof client.guilds == 'object' && typeof client.guilds[Symbol.iterator] == 'function') {
// 		for (guild of client.guilds) client.queue[guild.id] = [];
// 	}
// 	global.isStreaming = false;
// });

// client.on('error', console.error);

// client.login(process.env.TOKEN);
