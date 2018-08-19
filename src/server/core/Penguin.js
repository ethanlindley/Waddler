"use strict"

const Logger = require("../Logger")

const sp = require("./utils/sp")

const Socket = require("./Socket")

class Penguin extends Socket {
	constructor(socket, server) {
		super(socket)
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
		this.loggedIn = true
		this.openIgloos = []

		this.buddies = []
		this.ignored = []
		this.requests = []
		this.stamps = []

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

		const items = require("../crumbs/items")

		if (!items[item]) return this.sendError(402)

		const cost = items[item].cost

		if (this.coins < cost) return this.sendError(401)

		this.removeCoins(cost)
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
		const furniture = require("../crumbs/furniture")

		if (!furniture[furnitureID]) return this.sendError(402)

		const cost = furniture[furnitureID].cost

		if (this.coins < cost) return this.sendError(401)

		this.removeCoins(cost)
		this.getColumn("furnitureID", "furniture").then((result) => {
			result.length != 0 ? this.database.updateQuantity(this.id) : this.database.insertFurniture(this.id, furnitureID)

			this.sendXt("af", -1, furnitureID, this.coins)
		}).catch((err) => {
			Logger.error(err)
		})
	}
	addIgloo(igloo) {
		const igloos = require("../crumbs/igloos")

		if (!igloos[igloo]) return this.sendError(402)

		const cost = igloos[igloo].cost

		if (this.coins < cost) return this.sendError(401)

		this.removeCoins(cost)
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
		const floors = require("../crumbs/floors")

		if (!floors[floor]) return this.sendError(402)

		const cost = floors[floor].cost

		if (this.coins < cost) return this.sendError(401)

		this.removeCoins(cost)
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

	addStamp(stampID) {
		if (Number(stampID) == 14 && this.age != 183) return
		if (Number(stampID) == 20 && this.age != 365) return

		const stamps = require("../crumbs/stamps")

		if (!stamps[stampID]) return

		if (this.stamps.length != 0) {
			this.stamps.forEach(stamp => {
				stamp = stamp.split("|")
				if (Number(stamp[0]) == stampID) return
			})
		}

		this.database.insertStamp(this.id, stampID).then(() => {
			this.sendXt("aabs", -1, stampID)
		})
	}

	updateColumn(column, value, table = null) {
		this.database.updateColumn(this.id, column, value, table).catch((err) => {
			Logger.error(err)
		})
	}
	getColumn(column, table = null) {
		return this.database.getColumn(this.id, column, table)
	}
	getColumnByID(ID, column) {
		return this.database.getColumnByID(ID, column, "penguins")
	}
	doesIDExist(ID) {
		return this.database.doesIDExist(ID).then((result) => {
			return result[0]["count(*)"] >= 1
		})
	}
}

module.exports = Penguin