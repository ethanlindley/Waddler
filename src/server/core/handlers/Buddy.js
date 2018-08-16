"use strict"

class Buddy {
	static handleGetBuddies(data, penguin) {
		let buddies = []

		penguin.database.getBuddies(penguin.id).then((result) => {
			if (result.length <= 0) return penguin.sendXt("gb", -1, "")

			result.forEach(row => {
				const isOnline = penguin.server.isPenguinOnline(row.buddyID) ? "1" : "0"

				if (Number(isOnline) == 1) {
					const onlineBuddy = penguin.server.getPenguinById(row.buddyID)

					onlineBuddy.sendXt("bon", -1, penguin.id)
				}

				buddies.push(`${row.buddyID}|${row.buddyUsername}|${isOnline}`)
			})

			penguin.sendXt("gb", -1, buddies)
		})
	}

	static handleBuddyAccept(data, penguin) {
		const toAccept = parseInt(data[4])

		penguin.database.getBuddies(penguin.id).then((result) => {
			if (result.length >= 500) return penguin.sendError(901)

			result.forEach(row => {
				if (Number(row.buddyID) == toAccept) return
			})

			if (!penguin.requests.includes(toAccept)) return

			const usernameObj = penguin.server.getPenguinById(toAccept)
			let usernameToAccept = ""

			if (usernameObj) usernameToAccept = usernameObj.username

			penguin.database.addBuddy(penguin.id, toAccept, usernameToAccept).then(() => {
				penguin.database.addBuddy(toAccept, penguin.id, penguin.username).then(() => {
					const acceptObj = penguin.server.getPenguinByUsername(usernameToAccept)

					if (acceptObj) acceptObj.sendXt("ba", -1, penguin.id, penguin.username)

					penguin.sendXt("ba", -1, toAccept, usernameToAccept)

					penguin.requests.splice(penguin.requests.indexOf(toAccept), 1)
				})
			})
		})
	}

	static handleBuddyRequest(data, penguin) {
		const toRequest = parseInt(data[4])

		if (toRequest == penguin.id) return

		penguin.database.getBuddies(penguin.id).then((result) => {
			if (result.length >= 500) return penguin.sendError(901)

			const requestObj = penguin.server.getPenguinById(toRequest)

			if (requestObj) {
				requestObj.database.getBuddies(requestObj.id).then((result) => {
					if (result.length >= 500) return
					if (requestObj.requests.includes(penguin.id)) return

					requestObj.requests.push(penguin.id)
					requestObj.sendXt("br", -1, penguin.id, penguin.username)
				})
			}
		})
	}

	static handleBuddyRemove(data, penguin) {
		const toRemove = parseInt(data[4])

		penguin.database.getUsernameById(toRemove).then((result) => {
			let usernameToRemove = result[0].username

			penguin.database.removeBuddy(penguin.id, toRemove, usernameToRemove).then(() => {
				penguin.database.removeBuddy(toRemove, penguin.id, penguin.username).then(() => {
					const removeObj = penguin.server.getPenguinByUsername(usernameToRemove)

					if (removeObj) removeObj.sendXt("rb", -1, penguin.id, penguin.username)

					penguin.sendXt("rb", -1, toRemove, usernameToRemove)
				})
			})

			penguin.database.removeBuddy(toRemove, penguin.id, usernameToRemove).then(() => {
				penguin.database.removeBuddy(penguin.id, toRemove, penguin.username)
			})
		})
	}

	static handleBuddyFind(data, penguin) {
		const toFind = parseInt(data[4])

		const findObj = penguin.server.getPenguinById(toFind)

		if (findObj) penguin.sendXt("bf", -1, findObj.room.id)
	}
}

module.exports = Buddy