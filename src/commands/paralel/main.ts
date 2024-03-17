import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
	.setName('paralel')
	.setDescription('test')

export default async (interaction: TCommandInteraction) => {
	await new Promise(res => setTimeout(res, 2000))	
	await interaction.reply(`Delayed`)
}
