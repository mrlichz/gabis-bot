import { SlashCommandBuilder } from '@discordjs/builders'
import { usePlayer } from 'discord-player'
import { EmbedBuilder } from 'discord.js'


export const data = new SlashCommandBuilder()
	.setName('pause')
	.setDescription('pause current music')
;

export default async (interaction: TCommandInteraction) => {
	const guildPlayerNode = usePlayer(interaction.guild!.id)

	if (guildPlayerNode === null) {
		// TODO error message
		interaction.reply(`**Error**`)
		return
	}
	
	if (guildPlayerNode.isPlaying()) {
		guildPlayerNode.pause()
	}
	return interaction.reply({ content: 'Paused' })
}
