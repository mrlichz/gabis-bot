import { SlashCommandBuilder } from '@discordjs/builders'
import { usePlayer } from 'discord-player'

export const data = new SlashCommandBuilder()
	.setName('resume')
	.setDescription('resumes the current music')
;

export default async (interaction: TCommandInteraction) => {
	const guildPlayerNode = usePlayer(interaction.guild!.id)

	if (guildPlayerNode === null) {
		// TODO error message
		interaction.reply(`**Error**`)
		return
	}
	
	if (guildPlayerNode.isPaused()) {
		guildPlayerNode.resume()
	}
	return interaction.reply({ content: 'Resumed' })
}
