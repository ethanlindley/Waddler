"use strict"

class Ignore {
	static handleGetIgnored(data, penguin) {
		let ignored = []

		penguin.database.getIgnored(penguin.id).then((result) => {
			if (result.length <= 0) return penguin.sendXt("gn", -1, "")

			result.forEach(row => {
				ignored.push(row.ignoredID + "|" + row.ignoredUsername)
			})

			penguin.sendXt("gn", -1, ignored)
		})
	}

	static handleAddIgnore(data, penguin) {
		const toIgnore = parseInt(data[4])

		if (isNaN(toIgnore)) return penguin.disconnect()

		penguin.database.alreadyIgnored(toIgnore).then((result) => {
			if (result.length > 0) return

			penguin.database.getUsernameById(toIgnore).then((result) => {
				let usernameToIgnore = result[0].username,
					ignored = []

				penguin.database.addIgnore(penguin.id, toIgnore, usernameToIgnore).then((result) => {
					penguin.database.getIgnored(penguin.id).then((result) => {

						result.forEach(row => {
							ignored.push(row.ignoredID + "|" + row.ignoredUsername)
						})

						penguin.sendXt("an", -1, toIgnore)
						penguin.sendXt("gn", -1, ignored)
					})
				})
			})
		})
	}

	static handleRemoveIgnore(data, penguin) {
		const toRemove = parseInt(data[4])

		penguin.database.alreadyIgnored(toRemove).then((result) => {
			if (result.length < 0) return

			penguin.database.getUsernameById(toRemove).then((result) => {
				let usernameToRemove = result[0].username

				penguin.database.removeIgnore(penguin.id, toRemove, usernameToRemove).then((result) => {
					penguin.sendXt("rn", -1, toRemove)
				})
			})
		})
	}
}

module.exports = Ignore