"use strict"

const Logger = require("../Logger")

const sp = require("./utils/sp")

class Penguin {
	constructor(socket, server) {
		this.socket = socket
		this.server = server
		this.ipAddr = socket.remoteAddress.split(":").pop()
		this.database = server.database
		this.roomHandler = server.roomHandler
	}

	setPenguin(penguin) {
		this.id = penguin.ID
		this.username = penguin.username
		this.age = sp.dateToInt() - penguin.registrationDate

		this.coins = penguin.coins

		this.color = penguin.color
		this.head = penguin.head
		this.face = penguin.face
		this.neck = penguin.neck
		this.body = penguin.body
		this.hand = penguin.hand
		this.feet = penguin.feet
		this.pin = penguin.pin
		this.photo = penguin.photo

		this.rank = penguin.rank
		this.moderator = (penguin.moderator >= 1)
		this.muted = false

		this.x = 0
		this.y = 0
		this.frame = 1
		this.gameRoomId = 0
		this.coinDig = 0

		this.openIgloos = []

		this.buddies = []
		this.ignored = []
		this.requests = []

		this.getInventory()
	}

	buildPlayerString() {
		if (!this.id || !this.username) return this.disconnect()

		const playerArr = [
			this.id,
			this.username,
			45,
			this.color,
			this.head,
			this.face,
			this.neck,
			this.body,
			this.hand,
			this.feet,
			this.pin,
			this.photo,
			this.x,
			this.y,
			this.frame,
			1,
			this.rank * 146
		]
		return playerArr.join("|")
	}

	addItem(item) {
		if (require("./plugins/PatchedItems/items").includes(item) && !this.moderator) return this.sendError(410)
		if (this.inventory.includes(item)) return this.sendError(400)

		this.inventory.push(item)
		this.database.insertItem(this.id, item)
		this.sendXt("ai", -1, item, this.coins)
	}
	getInventory() {
		let inventory = []

		this.getColumn("itemID", "inventory").then((result) => {
			if (result.length <= 0) return this.sendXt("gi", -1, "")

			result.forEach(row => {
				inventory.push(row.itemID)
			})

			this.inventory = inventory
		}).catch((err) => {
			Logger.error(err)
		})
	}
	updateClothing(type, item) {
		this[type] = item
		this.updateColumn(type, item)
	}

	getFurniture() {
		this.database.getFurnitureAndQuantity(this.id).then((result) => {
			if (result.length <= 0) return this.sendXt("gf", -1, "")

			result.forEach(row => {
				this.sendXt("gf", -1, [row.furnitureID, row.quantity].join("|") + "|")
			})
		}).catch((err) => {
			Logger.error(err)
		})
	}
	getIgloos() {
		let igloos = []

		this.getColumn("igloos").then((result) => {
			let iglooStr = result[0].igloos

			if (iglooStr.length <= 0) return this.sendXt("go", -1, "")

			igloos.push(iglooStr.split("|").join("|"))

			this.igloos = igloos
		}).catch((err) => {
			Logger.error(err)
		})
	}
	addFurniture(furnitureID) {
		this.getColumn("furnitureID", "furniture").then((result) => {
			result.length != 0 ? this.database.updateQuantity(this.id) : this.database.insertFurniture(this.id, furnitureID)

			this.sendXt("af", -1, furnitureID, this.coins)
		}).catch((err) => {
			Logger.error(err)
		})
	}
	addIgloo(igloo) {
		this.database.alreadyOwnsIgloo(this.id).then((result) => {
			let igloos = []

			for (const i of result[0].igloos.split("|")) {
				igloos.push(parseInt(i))
			}

			if (igloos.includes(igloo)) return this.sendError(500)

			this.database.addIgloo(this.id, igloo)

			if (this.room.id == (this.id + 1000)) this.sendXt("au", -1, igloo, this.coins)
		}).catch((err) => {
			Logger.error(err)
		})
	}
	addFloor(floor) {
		this.updateColumn("floor", floor, "igloo")

		this.sendXt("ag", -1, floor, this.coins)
	}

	addCoins(coins) {
		this.coins += coins

		if (coins > 9999 && !this.moderator) return this.disconnect()

		this.updateColumn("coins", this.coins)
	}
	removeCoins(coins) {
		this.coins -= coins
		this.updateColumn("coins", this.coins)
	}

	sendRaw(data) {
		if (this.socket && this.socket.writable) {
			Logger.outgoing(data)
			this.socket.write(data + "\0")
		}
	}
	sendXt() {
		this.sendRaw(`%xt%${Array.prototype.join.call(arguments, "%")}%`)
	}
	sendError(err, disconnect) {
		this.sendXt("e", -1, err)

		if (disconnect) this.disconnect()
	}
	sendLoadMovie(message) {
		this.sendXt("lm", -1, `${require("../../config").loadMovieURL}${message}`)
	}

	disconnect() {
		this.server.removePenguin(this)
	}

	updateColumn(column, value, table = null) {
		this.database.updateColumn(this.id, column, value, table).catch((err) => {
			Logger.error(err)
		})
	}
	getColumn(column, table = null) {
		return this.database.getColumn(this.id, column, table)
	}
}

module.exports = Penguin