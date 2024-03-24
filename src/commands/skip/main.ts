import { SlashCommandBuilder } from '@discordjs/builders'
import { usePlayer } from 'discord-player'


export const data = new SlashCommandBuilder()
	.setName('skip')
	.setDescription('skips to the next track')
;

export default async (interaction: TCommandInteraction) => {
	const user = await interaction.guild?.members.fetch(interaction.user)
	const channel = user?.voice.channelId

	if (!channel) {
		return interaction.reply({
			content: 'You are not connected to a voice channel!',
			ephemeral: true
		})
	}
	
	const guildPlayerNode = usePlayer(interaction.guild!.id)

	if (guildPlayerNode === null) {
		// TODO error message
		interaction.reply(`**Error**`)
		return
	}

	const currentTrack = guildPlayerNode.queue.currentTrack

	if (currentTrack === null) {
		// TODO error message
		interaction.reply(`**Error**`)
		return
	}

	guildPlayerNode.skip()
	interaction.reply(`**${ currentTrack.title }** skipped!`)
}
