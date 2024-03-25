import { SlashCommandBuilder } from '@discordjs/builders'
import { usePlayer } from 'discord-player'


export const data = new SlashCommandBuilder()
	.setName('stop')
	.setDescription('stops')
;

export default async (interaction: TCommandInteraction) => {
	const guildPlayerNode = usePlayer(interaction.guild!.id)

	if (guildPlayerNode === null) {
		// TODO error message
		interaction.reply(`**Error**`)
		return
	}

	guildPlayerNode.stop()
	return interaction.reply({ content: 'Bye' })
}
