import fs from 'node:fs'
import path from 'node:path'

import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js'
import 'dotenv/config'


const client = new Client({ intents: [GatewayIntentBits.Guilds] })
const commands: TCommand[] = []

async function main() {
	const foldersPath = path.join(__dirname, 'commands')
	const commandFolders = fs.readdirSync(foldersPath)

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder)
		const commandFiles = fs.readdirSync(commandsPath)
		
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file)

			const imported = await import(filePath)
			
			const command: TCommand = {
				data: imported.default.data.toJSON(),
				fn: imported.default.default
			}

			commands.push(command)
		}
	}

	client.once(Events.ClientReady, readyClient => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`)
	})
	
	client.on(Events.InteractionCreate, async interaction => {
		if (!interaction.isChatInputCommand()) return
	
		const command: TCommand | undefined = commands.find(el => el.data.name === interaction.commandName)
	
		if (command === undefined) {
			console.error(`No command matching ${interaction.commandName} was found.`)
			return
		}
	
		try {
			await command.fn(interaction)
		} catch (error) {
			console.error(error)
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					ephemeral: true
				})
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true
				})
			}
		}
	})
	
	client.login(process.env.DISCORD_TOKEN)

	if (!process.argv.includes('sync')) {
		return
	}

	const rest = new REST().setToken(process.env.DISCORD_TOKEN ?? '')

	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`)

		const data: any = await rest.put(
			Routes.applicationGuildCommands(
				process.env.DISCORD_CLIENT_ID ?? '',
				// TODO remove
				'1166690101666005002'
			),
			{
				body: [...commands.map(e => e.data)]
			}
		)

		console.log(`Successfully reloaded ${data.length} application (/) commands.`)
	} catch (error) {
		console.error(error)
	}
}

main()
