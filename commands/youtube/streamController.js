const { Command } = require('discord.js-commando');
const ytdl = require('ytdl-core');
module.exports = class PlayFileCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'y',
			group: 'general',
			memberName: 'y',
			description: 'Plays a URL from Youtube'
		});
	}

	run(message) {
		const queue = new Map();
		const serverQueue = queue.get(message.guild.id);

		if (message.content.startsWith('.y play')) {
			execute(message, serverQueue);
			return;
		} else if (message.content.startsWith('.y skip')) {
			skip(message, serverQueue);
			return;
		} else if (message.content.startsWith('.y stop')) {
			stop(message, serverQueue);
			return;
		} else {
			message.channel.send('You need to enter a valid command! .y play [URL] | .y skip | .y stop');
		}

		async function execute(message, serverQueue) {
			const args = message.content.split(' ');
			//console.log('EXECUTE FUNCTION ENTERED');
			const voiceChannel = message.member.voice.channel;
			if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
			const permissions = voiceChannel.permissionsFor(message.client.user);
			if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
				return message.channel.send('I need the permissions to join and speak in your voice channel!');
			}
			//console.log('FINDING SONG YTDL with args: ', args[2]);
			const songInfo = await ytdl.getBasicInfo(args[2]);
			//console.log('FOUND SONG YTDL', songInfo);
			const song = {
				title: songInfo.videoDetails.title,
				url: songInfo.videoDetails.video_url
			};
			//console.log('GOT SONG INFO YTDL');

			//console.log('SERVERQUEUE IS HERE');
			if (!serverQueue) {
			} else {
				serverQueue.songs.push(song);
				console.log(serverQueue.songs);
				return message.channel.send(`${song.title} has been added to the queue!`);
			}
			console.log('QUEUEcontruct IS HERE');
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
			console.log('TRY IS HERE');
			try {
				// Here we try to join the voicechat and save our connection into our object.
				var connection = await voiceChannel.join();
				queueContruct.connection = connection;
				// Calling the play function to start a song
				play(message.guild, queueContruct.songs[0]);
			} catch (err) {
				// Printing the error message if the bot fails to join the voicechat
				console.log(err);
				queue.delete(message.guild.id);
				return message.channel.send(err);
			}
		}

		function play(guild, song) {
			console.log('PLAY FUNCTION ENTERED');
			const serverQueue = queue.get(guild.id);
			if (!song) {
				serverQueue.voiceChannel.leave();
				queue.delete(guild.id);
				return;
			}
			const dispatcher = serverQueue.connection
				.play(ytdl(song.url))
				.on('finish', () => {
					serverQueue.songs.shift();
					play(guild, serverQueue.songs[0]);
				})
				.on('error', (error) => console.error(error));
			dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
			serverQueue.textChannel.send(`Start playing: **${song.title}**`);
		}
	}
};
