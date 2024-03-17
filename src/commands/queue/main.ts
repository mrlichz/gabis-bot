import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
	.setName('queue')
	.setDescription('Gets the songs queue')

export default async (interaction: TCommandInteraction) => {
	const queues = [
		{
			title: 'Starlight'
		},
		{
			title: 'Knights of Cydonia'
		},
		{
			title: 'Uprising'
		}
	]
	
	await interaction.reply(`Songs in the queue ${queues.map(i => i.title)}`)
}
