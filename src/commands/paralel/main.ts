import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder()
	.setName('paralel')
	.setDescription('test')

export default async (interaction: TCommandInteraction) => {
	await interaction.deferReply({ephemeral: true});
	await new Promise(res => setTimeout(res, 3000))	
	await interaction.editReply('Delayed');
	await interaction.followUp({content: 'hell yeah', ephemeral: true});
}
