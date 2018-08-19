"use strict"

const items = require("./items")

class PatchedItems {
	static containsBaitItem(itemID) {
		return items.includes(itemID)
	}
}

module.exports = PatchedItems