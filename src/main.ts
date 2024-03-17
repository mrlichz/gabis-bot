import cluster from 'node:cluster'
import fs from 'node:fs'
import path from 'node:path'

import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js'
import 'dotenv/config'

const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? ''
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? ''
const WORKERS = +(process.env.WORKERS ?? '2')

function main() {
	if (cluster.isPrimary) {
		for (let i = WORKERS; i > 0; i--) {
			cluster.fork()
		}

		cluster.on('exit', (worker, code, _signal) => {
			console.error(`Worker ${worker.process.pid} died with code ${code}`)

			const newWorker = cluster.fork()
			console.log(`A new worker started, pid ${newWorker.process.pid}`)
		})

		console.log(`${WORKERS} workers started`)
	} else {
		setupDiscord()
	}
}

async function setupDiscord() {
	const commands: TCommand[] = []
	const client = new Client({
		intents: [GatewayIntentBits.Guilds],
		closeTimeout: 100000
	})

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

		const command: TCommand | undefined = commands.find(
			el => el.data.name === interaction.commandName
		)

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
	
	client.login(DISCORD_TOKEN)
	
	{
		const rest = new REST().setToken(DISCORD_TOKEN)
		
		if (process.argv.includes('delete')) {
			await deleteCommands(rest)
		}
		
		if (process.argv.includes('sync')) {
			await syncCommands(rest, commands)
		}
	}
}

async function deleteCommands(rest: REST) {
	try {
		await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
			body: []
		})
		console.log('Successfully deleted all application commands.')
	} catch (err) {
		console.error(err)
	}
}

async function syncCommands(rest: REST, commands: TCommand[]) {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`)

		const data: any = await rest.put(
			Routes.applicationCommands(
				DISCORD_CLIENT_ID,
			),
			{
				body: [...commands.map(e => e.data)]
			}
		)

		console.log(`Successfully reloaded ${data.length} application (/) commands.`)
	} catch (err) {
		console.error(err)
	}
}

main()
