"use strict"

class Stamps {
	static handleGetStamps(data, penguin) {
		let stampStr = ""

		penguin.database.getStamps(penguin.id).then((result) => {
			if (result.length <= 0) return penguin.sendXt("gps", -1, "")

			result.forEach(row => {
				penguin.stamps.push(`${penguin.id}|${row.stampID}`)
				stampStr += `${row.stampID}|`
			})

			penguin.sendXt("gps", -1, penguin.id, `${stampStr.slice(0, -1)}`)
		})
	}
}

module.exports = Stamps