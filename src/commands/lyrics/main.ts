import { SlashCommandBuilder } from '@discordjs/builders'
import { lyricsExtractor } from '@discord-player/extractor'
import { EmbedBuilder } from 'discord.js'


export const data = new SlashCommandBuilder()
	.setName('lyrics')
	.setDescription('lyrics')
	.addStringOption(
		b => b
			.setName('query')
			.setDescription('query')
			.setRequired(true)
		,
	)
;

export default async (interaction: TCommandInteraction) => {
	const user = await interaction.guild?.members.fetch(interaction.user)
	const channel = user?.voice.channelId

	if (!channel) {
		return interaction.reply('You are not connected to a voice channel!')
	}

	const query = interaction.options.getString('query', true)
	await interaction.deferReply()
	const lyricsFinder = lyricsExtractor()

	try {
		const lyrics = await lyricsFinder.search(query)

		if (!lyrics) {
			return interaction.followUp({ content: 'No lyrics found', ephemeral: true })
		}

		const trimmedLyrics = lyrics.lyrics.substring(0, 1997)
		
		const embed = new EmbedBuilder()
			.setTitle(lyrics.title)
			.setURL(lyrics.url)
			.setThumbnail(lyrics.thumbnail)
			.setAuthor({
				name: lyrics.artist.name,
				iconURL: lyrics.artist.image,
				url: lyrics.artist.url
			})
			.setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
			.setColor('DarkOrange')
		;

		return interaction.followUp({ embeds: [embed] });
	} catch (err) {
		return interaction.followUp(`Something went wrong`)
	}
}
