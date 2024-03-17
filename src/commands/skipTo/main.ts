import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
	.setName('skip')
	.setDescription('skips to the song number')
	.addNumberOption(
		b => b
			.setName('index')
			.setDescription('Index')
			.setRequired(true)
		,
	)
;

export default async (interaction: TCommandInteraction) => {
	await interaction.reply(`Skiping to ${interaction.options.getNumber('index')}...`)
}
