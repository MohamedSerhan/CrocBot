const { Command } = require('discord.js-commando');
const ytdl = require('ytdl-core');
let queue = new Map();

module.exports = class PlayFileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'y',
			group: 'general',
			memberName: 'y',
			description:
				'Plays a URL from Youtube \n.y play [URL] | Plays specified URL or adds song to queue if there is a song already playing \n.y skip | Skips to next song in queue \n.y stop | Stops all music and clears the queue'
		});
	}

	run(message) {
		let serverQueue = queue.get(message.guild.id);
		try {
			if (message.content.startsWith('.y play') && message.content) {
				execute(message, serverQueue);
				return;
			} else if (message.content.startsWith('.y skip') && message.content) {
				skip(message, serverQueue);
				return;
			} else if (message.content.startsWith('.y stop') && message.content) {
				stop(message, serverQueue);
				return;
			} else {
				message.channel.send(
					'You need to enter a valid command! \n.y play [URL] | Plays specified URL or adds song to queue if there is a song already playing \n.y skip | Skips to next song in queue \n.y stop | Stops all music and clears the queue'
				);
			}
		} catch (error) {
			console.log('streamController 1: ', error);
		}

		async function execute(message, serverQueue) {
			const args = message.content.split(' ');
			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
			const permissions = voiceChannel.permissionsFor(message.client.user);
			if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
				return message.channel.send('I need the permissions to join and speak in your voice channel!');
			}

			if (args[2] && (args[2].startsWith('https://') || args[2].startsWith('www.'))) {
				const songInfo = await ytdl.getBasicInfo(args[2]);
				const song = {
					title: songInfo.videoDetails.title,
					url: songInfo.videoDetails.video_url
				};
				if (!serverQueue) {
				} else {
					serverQueue.songs.push(song);
					return message.channel.send(`${song.title} has been added to the queue!`);
				}

				const queueContruct = {
					textChannel: message.channel,
					voiceChannel: voiceChannel,
					connection: null,
					songs: [],
					volume: 5,
					playing: true
				};
				// Setting the queue using our contract
				queue.set(message.guild.id, queueContruct);
				// Pushing the song to our songs array
				queueContruct.songs.push(song);

				try {
					// Here we try to join the voicechat and save our connection into our object.
					var connection = await voiceChannel.join();
					queueContruct.connection = connection;
					// Calling the play function to start a song
					global.isStreaming = true;
					play(message.guild, queueContruct.songs[0]);
				} catch (error) {
					// Printing the error message if the bot fails to join the voicechat
					console.log('streamController 2: ', error);
					queue.delete(message.guild.id);
					return message.channel.send(error);
				}
			} else {
				return message.channel.send(
					'Please enter a valid youtube URL! Search by name is not yet implemented! If you did enter a link, chances are you forgot a space somewhere in the command.'
				);
			}
		}

		function play(guild, song) {
			try {
				const serverQueue = queue.get(guild.id);
				if (!song) {
					serverQueue.voiceChannel.leave();
					queue.delete(guild.id);
					return;
				}
				const dispatcher = serverQueue.connection
					.play(ytdl(song.url), {
						requestOptions: {
							headers: {
							}
						}
					})
					.on('finish', () => {
						global.isStreaming = false;
						serverQueue.songs.shift();
						play(guild, serverQueue.songs[0]);
					})
					.on('error', (error) => console.error(error));
				dispatcher.setVolume(0.5);
				serverQueue.textChannel.send(`Start playing: **${song.title}**`);
			} catch (error) {
				console.log('streamController 3: ', error);
			}
		}

		function skip(message, serverQueue) {
			try {
				if (!message.member.voice.channel)
					return message.channel.send('You have to be in a voice channel to stop the music!');
				if (!serverQueue) return message.channel.send('There is no song that I could skip!');
				serverQueue.connection.dispatcher.end();
			} catch (error) {
				console.log('streamController 4: ', error);
			}
		}

		function stop(message, serverQueue) {
			try {
				if (!message.member.voice.channel)
					return message.channel.send('You have to be in a voice channel to stop the music!');

				if (!serverQueue) return message.channel.send('There is no song that I could stop!');

				serverQueue.songs = [];
				global.isStreaming = false;
				serverQueue.connection.dispatcher.end();
			} catch (error) {
				console.log('streamController 5: ', error);
			}
		}
	}
};
