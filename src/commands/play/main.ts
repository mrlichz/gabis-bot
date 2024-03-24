import { SlashCommandBuilder } from '@discordjs/builders'
import { useMainPlayer } from 'discord-player'
import { EmbedBuilder } from 'discord.js'


export const data = new SlashCommandBuilder()
	.setName('play')
	.setDescription('play a song from YouTube.')
	.addStringOption(
		b => b
			.setName('query')
			.setDescription('query')
			.setRequired(true)
		,
	)
;

export default async (interaction: TCommandInteraction) => {
	const player = useMainPlayer()

	const user = await interaction.guild?.members.fetch(interaction.user)
	const channel = user?.voice.channelId

	if (!channel) {
		return interaction.reply({
			content: 'You are not connected to a voice channel!',
			ephemeral: true
		})
	}
	const query = interaction.options.getString('query', true)

	await interaction.deferReply()

	try {
		const { track } = await player.play(channel, query, {
			nodeOptions: {
				metadata: interaction
			}
		})

		const embed = new EmbedBuilder()
			.setTitle(track.title)
			.setURL(track.url)
			.setThumbnail(track.thumbnail)
			.setAuthor({
				name: track.author
			})
			.setColor('DarkOrange')
		;

		return interaction.followUp({ embeds: [embed] })
	} catch (err) {
		return interaction.followUp(`Something went wrong: ${err}`)
	}
}
