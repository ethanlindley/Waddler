"use strict"

const Logger = require("./Logger")
const DataHandler = require("./core/DataHandler")

class Server
{
	constructor()
	{
		this.penguins = []

		this.dataHandler = new DataHandler(this)
		this.startServer(6112)

		process.on("SIGINT", () => this.handleShutdown())
		process.on("SIGTERM", () => this.handleShutdown())
	}

	startServer(port)
	{
		require("net").createServer(socket =>
		{
			socket.setEncoding("utf8")
			socket.setTimeout(600000)
			socket.setNoDelay(true)

			const penguin = new Penguin(socket, this)
			this.penguins.push(penguin)

			socket.on("data", (data) =>
			{
				this.dataHandler.handleData(data.toString().split("\0")[0], penguin)
			})
			socket.on("close", () =>
			{
				Logger.info(`${penguin.ipAddr} disconnected`)
				penguin.disconnect()
			})
			socket.on("error", (error) =>
			{
				Logger.error(error)
				penguin.disconnect()
			})
		}).listen(6112, () =>
		{
			Logger.info(`Login server listening on port 6112`)
		})
	}

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