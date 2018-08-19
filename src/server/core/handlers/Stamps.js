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
		const penguinID = parseInt(data[4])

		if (isNaN(penguinID)) return penguin.disconnect()

		penguin.doesIDExist(penguinID).then((exists) => {
			if (!exists) return

			let pinStr = ""

			const items = require("../../crumbs/items")
			const pins = require("../../crumbs/pins")

			penguin.database.getInventoryByID(penguinID).then((result) => {
				result.forEach(row => {
					if (items[row.itemID].type == "pin") {
						if (pins[row.itemID] != undefined) {
							pinStr += `${row.itemID}|${pins[row.itemID].unix}|1%`
						} else {
							pinStr += `${row.itemID}|${sp.getTime()}|1%`
						}
					}
				})

				if (pinStr.length == 0) return penguin.sendXt("qpp", -1, "")

				penguin.sendXt("qpp", -1, `|${pinStr.slice(0, -1)}`)
			})
		})
	}

	static handleQueryPlayerAwards(data, penguin) {
		const penguinID = parseInt(data[4])

		if (isNaN(penguinID)) return penguin.disconnect()

		penguin.doesIDExist(penguinID).then((exists) => {
			if (!exists) return

			let awardStr = ""

			const awards = require("../../crumbs/awards")

			penguin.database.getInventoryByID(penguinID).then((result) => {
				result.forEach(row => {
					if (awards[row.itemID]) {
						awardStr += `${row.itemID}|${awards[row.itemID].unix}|1%`
					}
				})

				if (awardStr.length == 0) return penguin.sendXt("qpa", -1, "")

				penguin.sendXt("qpa", -1, `|${awardStr.slice(0, -1)}`)
			})
		})
	}

	static handleGetStampBookCoverDetails(data, penguin) {
		const penguinID = parseInt(data[4])

		if (isNaN(penguinID)) return penguin.disconnect()

		penguin.doesIDExist(penguinID).then((exists) => {
			if (!exists) return

			penguin.getColumnByID(penguinID, "cover").then((result) => {
				penguin.sendXt("gsbcd", -1, result[0].cover)
			})
		})
	}

	static handleSetStampBookCoverDetails(data, penguin) {
		if (isNaN(parseInt(data[4])) || isNaN(parseInt(data[5])) || isNaN(parseInt(data[6])) || isNaN(parseInt(data[7]))) return penguin.disconnect()

		let cover = [parseInt(data[4]), parseInt(data[5]), parseInt(data[6]), parseInt(data[7])].join("%")
		cover += "%"

		data.forEach(row => {
			if (row.length > 13) cover += `%${row}`
		})

		penguin.getColumn("cover").then((result) => {
			if (cover != result[0].cover) {
				penguin.updateColumn("cover", cover)
			}
		})

		penguin.sendXt("ssbcd", -1)
	}

	static handleGetMyRecentlyEarnedStamps(data, penguin) {
		penguin.sendXt("gmres", -1, "")
	}

	static handleAddStamp(data, penguin) {
		const stampID = parseInt(data[4])

		if (isNaN(stampID)) return penguin.disconnect()

		penguin.addStamp(stampID)
	}
}

module.exports = Stamps