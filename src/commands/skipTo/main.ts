import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
	.setName('skip')
	.setDescription('skips to the song number')
;

export default async (interaction: TCommandInteraction) => {
	await interaction.reply(`Skiping to 3...`)
}
