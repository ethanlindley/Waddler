"use strict"

const Logger = require("./Logger")

const Database = require("./core/system/Database")
const Penguin = require("./core/Penguin")

const DataHandler = require("./core/DataHandler")
const World = require("./core/World")

const roomManager = require("./core/system/roomManager")
const gameManager = require("./core/system/gameManager")
const pluginLoader = require("./core/system/pluginLoader")

class Server {
	constructor(type) {
		this.type = type
		this.port = type == "login" ? 6112 : 6113
		this.maxPenguins = 150

		this.penguins = []

		this.database = new Database()
		this.gameHandler = new World(this)
		this.dataHandler = new DataHandler(this)

		if (this.type == "game") {
			this.roomManager = new roomManager(this)
			this.gameManager = new gameManager(this)
			this.pluginLoader = new pluginLoader()
		}

		this.startServer()

		process.on("SIGINT", () => this.handleShutdown())
		process.on("SIGTERM", () => this.handleShutdown())
	}

	startServer() {
		require("net").createServer(socket => {
			socket.setEncoding("utf8")
			socket.setTimeout(600000, () => {
				socket.end("Disconnected inactive socket")
			})
			socket.setNoDelay(true)

			const penguin = new Penguin(socket, this)

			if (this.penguins.length >= this.maxPenguins) return penguin.sendError(103, true)

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
				if (error.code == "ETIMEDOUT" || error.code == "ECONNRESET") return
				Logger.error(error)
				return penguin.disconnect()
			})
		}).listen(this.port, () => {
			Logger.info(`Waddler {${this.type}} listening on port ${this.port}`)
			if (this.type == "login") {
				if (this.calculateValidMaxPenguins(this.maxPenguins)) {
					Logger.info(`Max amount of penguins: ${this.maxPenguins}`)
				} else {
					throw new Error(`${this.maxPenguins} cannot be divided over 6 server bars`)
					process.exit(1)
				}
			}
		})
	}

	calculateValidMaxPenguins() {
		const playersPerBar = this.maxPenguins / 6

		if (playersPerBar.toString().indexOf(".") == -1) return true

		return false
	}

	getServerBars() {
		const population = this.penguins.length

		if (population <= 25) {
			return 1
		} else if (population > 25 && population <= 50) {
			return 2
		} else if (population > 50 && population <= 75) {
			return 3
		} else if (population > 75 && population <= 100) {
			return 4
		} else if (population > 100 && population <= 125) {
			return 5
		} else if (population > 125 && population <= 150) {
			return 6
		}
	}

	getPenguinById(id) {
		for (const penguin of this.penguins) {
			if (penguin.id == id) {
				return penguin
			}
		}
	}

	getPenguinByUsername(username) {
		for (const penguin of this.penguins) {
			if (penguin.username.toLowerCase() == username.toLowerCase()) {
				return penguin
			}
		}
	}

	isPenguinOnline(id) {
		for (const penguin of this.penguins) {
			if (penguin.id == id) {
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

			if (penguin.room) penguin.room.removePenguin(penguin)
			if (penguin.tableId) {
				if (this.gameManager.gameType == "M") {
					this.gameManager.leaveMancalaTable(penguin)
				} else {
					this.gameManager.leaveTable(penguin)
				}
			}

			if (this.type == "game" && penguin.id != undefined) {
				if (penguin.buddies.length != 0) {
					penguin.buddies.forEach(buddy => {
						buddy = buddy.split("|")
						const buddyID = Number(buddy[0])
						if (this.isPenguinOnline(buddyID)) {
							this.getPenguinById(buddyID).sendXt("bof", -1, penguin.id)
						}
					})
				}
			}

			if (this.roomManager) {
				const igloo = (penguin.id + 1000)

				if (this.roomManager.checkIgloo(igloo)) this.roomManager.closeIgloo(igloo)
			}

			this.penguins.splice(index, 1)

			penguin.socket.end()
			penguin.socket.destroy()
		}
	}
}

module.exports = Server