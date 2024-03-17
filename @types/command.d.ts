import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

declare global {	
	interface TCommand {
		data: SlashCommandBuilder
		fn: (interaction: TCommandInteraction) => Promise<void>
	}

	interface TCommandInteraction extends ChatInputCommandInteraction<CacheType> {}
}
