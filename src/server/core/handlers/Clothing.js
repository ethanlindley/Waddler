"use strict"

class Clothing {
	static handleUpdateClothing(data, penguin) {
		const type = String(data[2].substr(2)),
			item = parseInt(data[4])

		const types = {
			"upc": "color",
			"uph": "head",
			"upf": "face",
			"upn": "neck",
			"upb": "body",
			"upa": "hand",
			"upe": "feet",
			"upl": "pin",
			"upp": "photo"
		}

		if (type.length != 3) return penguin.disconnect()
		if (isNaN(item)) return penguin.disconnect()
		if (!types[type]) return penguin.disconnect()

		penguin.room.sendXt(type, -1, penguin.id, item)
		penguin.updateClothing(types[type], item)
	}

	static handleAddItem(data, penguin) {
		const item = parseInt(data[4])

		if (isNaN(item)) return penguin.disconnect()

		const items = require("../../crumbs/items")

		if (!items[item]) return penguin.sendError(402)

		const cost = items[item].cost

		if (penguin.inventory.includes(item)) return penguin.sendError(400)
		if (penguin.coins < cost) return penguin.sendError(401)

		penguin.removeCoins(cost)
		penguin.addItem(item)
	}

	static handleGetInventory(data, penguin) {
		penguin.getInventory()
		penguin.sendXt("gi", -1, penguin.inventory.join("%"))
	}
}

module.exports = Clothing