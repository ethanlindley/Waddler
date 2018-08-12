"use strict"

const Logger = require("./Logger")

const Database = require("./core/system/Database")
const Penguin = require("./core/Penguin")

const DataHandler = require("./core/DataHandler")
const World = require("./core/World")

const roomManager = require("./core/managers/roomManager")

class Server {
	constructor(type) {
		this.type = type
		this.port = type == "login" ? 6112 : 6113

		this.penguins = []

		this.database = new Database()
		this.gameHandler = new World(this)
		this.dataHandler = new DataHandler(this)

		if (this.type == "game") {
			this.roomManager = new roomManager(this)
		}

		this.startServer()

		process.on("SIGINT", () => this.handleShutdown())
		process.on("SIGTERM", () => this.handleShutdown())
	}

	startServer() {
		require("net").createServer(socket => {
			socket.setEncoding("utf8")
			socket.setTimeout(600000)
			socket.setNoDelay(true)

			const penguin = new Penguin(socket, this)

			if (this.penguins.length >= 100) return penguin.sendError(103, true)

			this.penguins.push(penguin)

			Logger.info(`${penguin.ipAddr} connected`)

			socket.on("data", (data) => {
				return this.dataHandler.handleData(data.toString().split("\0")[0], penguin)
			})

			socket.on("close", () => {
				Logger.info(`${penguin.ipAddr} disconnected`)
				return penguin.disconnect()
			})

			socket.on("error", (error) => {
				Logger.error(error)
				return penguin.disconnect()
			})

		}).listen(this.port, () => {
			Logger.info(`Waddler {${this.type}} listening on port ${this.port}`)
		})
	}

	getPenguin(player) {
		for (const penguin of this.penguins) {
			const type = isNaN(player) ? penguin.username : penguin.id
			if (type === player) {
				return penguin
			}
		}
	}

	isPenguinOnline(player) {
		for (const penguin of this.penguins) {
			const type = isNaN(player) ? penguin.username : penguin.id
			if (type === player) {
				return true
			}
		}
		return false
	}

	handleShutdown() {
		if (this.penguins.length > 0) {
			Logger.info("Server shutting down in 3 seconds")
			Logger.info(`Disconnecting ${this.penguins.length} client(s)`)
			setTimeout(() => {
				for (const penguin of this.penguins) {
					penguin.disconnect()
				}
				process.exit(0)
			}, 3000)
		} else {
			Logger.info("No clients connected, shutting down instantly")
			process.exit(0)
		}
	}

	removePenguin(penguin) {
		const index = this.penguins.indexOf(penguin)

		if (index > -1) {
			Logger.info("Removing client")

			this.penguins.splice(index, 1)

			penguin.socket.end()
			penguin.socket.destroy()
		}
	}
}

module.exports = Server