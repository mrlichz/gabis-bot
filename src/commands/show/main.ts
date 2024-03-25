import { SlashCommandBuilder } from '@discordjs/builders'
import { usePlayer } from 'discord-player'
import { EmbedBuilder } from 'discord.js'


export const data = new SlashCommandBuilder()
	.setName('show')
	.setDescription('show the current music')
;

export default async (interaction: TCommandInteraction) => {
	const guildPlayerNode = usePlayer(interaction.guild!.id)

	if (guildPlayerNode === null) {
		// TODO error message
		interaction.reply(`**Error**`)
		return
	}

	const track = guildPlayerNode.queue.currentTrack

	if (track === null) {
		// TODO error message
		interaction.reply(`Not playing currently`)
		return
	}

	const embed = new EmbedBuilder()
		.setTitle(track.title)
		.setURL(track.url)
		.setThumbnail(track.thumbnail)
		.setAuthor({
			name: track.author
		})
		.setColor('DarkOrange')
	;

	return interaction.reply({ content: 'Currently playing:', embeds: [embed] })
}
