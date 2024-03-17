import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('pings')

export default async (interaction: TCommandInteraction) => {
	await interaction.reply(`pong`)
}
