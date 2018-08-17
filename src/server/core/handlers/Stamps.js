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

		penguin.database.getInventoryByID(penguin.id).then((result) => {
			result.forEach(row => {
				if (items[row.itemID].type == "pin") {
					if (pins[row.itemID] != undefined) {
						pinStr += `${row.itemID}|${pins[row.itemID].unix}|1%`
					} else {
						pinStr += `${row.itemID}|${sp.getTime()}|1%`
					}
				}
			})

			if (pinStr.length == 0) return penguin.sendXt("qpp", -1, penguin.id, "")

			penguin.sendXt("qpp", -1, penguin.id, `|${pinStr.slice(0, -1)}`)
		})
	}

	static handleQueryPlayerAwards(data, penguin) {
		let awardStr = ""

		const awards = require("../../crumbs/awards")

		penguin.database.getInventoryByID(penguin.id).then((result) => {
			result.forEach(row => {
				if (awards[row.itemID]) {
					awardStr += `${row.itemID}|${awards[row.itemID].unix}|1%`
				}
			})

			if (awardStr.length == 0) return penguin.sendXt("qpa", -1, penguin.id, "")

			penguin.sendXt("qpa", -1, penguin.id, `|${awardStr.slice(0, -1)}`)
		})
	}
}

module.exports = Stamps