"use strict"

class Buddy {
	static handleGetBuddies(data, penguin) {
		let buddies = []

		penguin.database.getBuddies(penguin.id).then((result) => {
			if (result.length <= 0) return penguin.sendXt("gb", -1, "")

			result.forEach(row => {
				const isOnline = penguin.server.isPenguinOnline(row.buddyID) ? "1" : "0"

				buddies.push(`${row.buddyID}|${row.buddyUsername}|${isOnline}`)
			})

			penguin.sendXt("gb", -1, buddies)
		})
	}
}

module.exports = Buddy