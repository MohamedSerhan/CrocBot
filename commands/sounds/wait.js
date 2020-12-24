const { Command } = require('discord.js-commando');
const path = require('path');
const fileName = path.basename(__filename);
const cName = fileName.substring(0, fileName.indexOf('.'));
var playSoundFile = require('../../helpers/soundCommand');
module.exports = class PlayFileCommand extends Command {
	constructor(client) {
		super(client, {
			name: cName,
			group: 'sounds',
			memberName: cName,
			description: 'Plays a ' + cName + ' sound file.'
		});
	}

	run(message) {
		playSoundFile(message, cName);
	}
};
