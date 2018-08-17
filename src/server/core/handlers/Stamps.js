"use strict"

const sp = require("../utils/sp")

class Stamps {
	static handleGetStamps(data, penguin) {
		let stampStr = ""

		penguin.database.getStamps(penguin.id).then((result) => {
			if (result.length <= 0) return penguin.sendXt("gps", -1, penguin.id, "")

			result.forEach(row => {
				penguin.stamps.push(`${penguin.id}|${row.stampID}`)
				stampStr += `${row.stampID}|`
			})

			penguin.sendXt("gps", -1, penguin.id, `${stampStr.slice(0, -1)}`)
		})
	}

	static handleQueryPlayerPins(data, penguin) {
		let pinStr = ""

		const items = require("../../crumbs/items")
		const pins = require("../../crumbs/pins")

		penguin.database.getPlayerPins(penguin.id).then((result) => {
			result.forEach(row => {
				if (items[row.itemID].type == "pin") {
					if (pins[row.itemID] != undefined) {
						pinStr += `${parseInt(row.itemID)}|${parseInt(pins[row.itemID].unix)}|`
					} else {
						pinStr += `${parseInt(row.itemID)}|${sp.getTime()}|`
					}
				}
			})

			if (pinStr.length == 0) return penguin.sendXt("qpp", -1, penguin.id, "")

			penguin.sendXt("qpp", -1, penguin.id, `|${pinStr.slice(0, -1)}`)
		})
	}

	static handleQueryPlayerAwards(data, penguin) {

	}
}

module.exports = Stamps