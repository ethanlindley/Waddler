"use strict"

const Logger = require("./Logger")

const Database = require("./core/system/Database")
const Penguin = require("./core/Penguin")

const DataHandler = require("./core/DataHandler")
const ClubPenguin = require("./core/ClubPenguin")

const roomManager = require("./core/managers/roomManager")

class Server
{
	constructor(type)
	{
		this.type = type
		this.port = type == "login" ? 6112 : 6113

		this.penguins = []

		this.patchedItems = [413, 444]

		this.database = new Database()
		this.gameHandler = new ClubPenguin(this)
		this.dataHandler = new DataHandler(this)

		if (this.type == "game")
		{
			this.roomManager = new roomManager(this)
		}

		this.startServer()

		process.on("SIGINT", () => this.handleShutdown())
		process.on("SIGTERM", () => this.handleShutdown())
	}
	/*
	 * An advanced createServer structure.
	 *
	 * Checks if the server is full and for errors.
	 */
	startServer()
	{
		require("net").createServer(socket =>
		{
			socket.setEncoding("utf8")
			socket.setTimeout(600000)
			socket.setNoDelay(true)

			const penguin = new Penguin(socket, this)

			if (this.penguins.length >= 100)
			{
				return penguin.sendError(103, true)
			}

			this.penguins.push(penguin)

			socket.on("data", (data) =>
			{
				return this.dataHandler.handleData(data.toString().split("\0")[0], penguin)
			})

			socket.on("close", () =>
			{
				Logger.info(`Client disconnected`)
				return penguin.disconnect()
			})

			socket.on("error", (error) =>
			{
				Logger.error(error)
				return penguin.disconnect()
			})

		}).listen(this.port, () =>
		{
			Logger.info(`Waddler {${this.type}} listening on port ${this.port}`)

			if (this.type == "game")
			{
				Logger.info(`${this.patchedItems.length} patched item(s) loaded!`)
			}
		})
	}
	/*
	 * Just like in Database.js, we check if player is a username or an id.
	 */
	getPenguin(player)
	{
		for (const penguin of this.penguins)
		{
			const type = isNaN(player) ? penguin.username : penguin.id
			if (type === player)
			{
				return penguin
			}
		}
	}
	/*
	 * Just like in getPenguin, player does the same.
	 */
	isPenguinOnline(player)
	{
		for (const penguin of this.penguins)
		{
			const type = isNaN(player) ? penguin.username : penguin.id
			if (type === player)
			{
				return true
			}
		}
		return false
	}
	/*
	 * Before the server is shut down, we check if there's any connections.
	 * If there's no connections, just instantly kill the server.
	 */
	handleShutdown()
	{
		if (this.penguins.length > 0)
		{
			Logger.info("Server shutting down in 3 seconds")
			Logger.info(`Disconnecting ${this.penguins.length} client(s)`)
			setTimeout(() =>
			{
				for (const penguin of this.penguins)
				{
					penguin.disconnect()
				}
				process.exit(0)
			}, 3000)
		}
		else
		{
			Logger.info("No clients connected, shutting down instantly")
			process.exit(0)
		}
	}
	/*
	 * Removes the player entirely from the server.
	 */
	removePenguin(penguin)
	{
		const index = this.penguins.indexOf(penguin)

		if (index > -1)
		{
			Logger.info("Removing client")

			this.penguins.splice(index, 1)

			penguin.socket.end()
			penguin.socket.destroy()
		}
	}
}

module.exports = Server