import { Player } from 'discord-player'
import { CacheType, ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js'

declare global {	
	interface TCommand {
		data: SlashCommandBuilder
		cooldown?: number
		fn: (interaction: TCommandInteraction) => Promise<void>
	}

	interface TCommandInteraction extends ChatInputCommandInteraction<CacheType> {}
}
