"use strict"

class Buddy {
	static handleGetBuddies(data, penguin) {
		let buddyStr = ""

		penguin.database.getBuddies(penguin.id).then((result) => {
			if (result.length <= 0) return penguin.sendXt("gb", -1, "")

			result.forEach(row => {
				const isBuddyOnline = penguin.server.isPenguinOnline(row.buddyID) ? "1" : "0"

				if (Number(isBuddyOnline) == 1) {
					const onlineBuddy = penguin.server.getPenguinById(row.buddyID)
					onlineBuddy.sendXt("bon", -1, penguin.id)
				}

				penguin.buddies.push(`${row.buddyID}|${row.buddyUsername}`)
				buddyStr += `${row.buddyID}|${row.buddyUsername}|${isBuddyOnline}`
			})

			penguin.sendXt("gb", -1, buddyStr)
		})
	}

	static handleBuddyAccept(data, penguin) {
		const toAccept = parseInt(data[4])

		if (isNaN(toAccept)) return penguin.disconnect()

		penguin.doesIDExist(toAccept).then((exists) => {
			if (!exists) return

			if (penguin.buddies.length >= 500) return penguin.sendError(901)

			if (penguin.buddies.length != 0) {
				penguin.buddies.forEach(buddy => {
					buddy = buddy.split("|")
					if (Number(buddy[0]) == toAccept) return
				})
			}

			if (!penguin.requests.includes(toAccept)) return

			penguin.database.getUsernameByID(toAccept).then((result) => {
				let usernameToAccept = result[0].username

				penguin.database.addBuddy(penguin.id, toAccept, usernameToAccept).then(() => {
					penguin.database.addBuddy(toAccept, penguin.id, penguin.username).then(() => {
						const acceptObj = penguin.server.getPenguinById(toAccept)

						if (acceptObj) acceptObj.sendXt("ba", -1, penguin.id, penguin.username)

						penguin.sendXt("ba", -1, toAccept, usernameToAccept)

						penguin.requests.splice(penguin.requests.indexOf(toAccept), 1)
					})
				})
			})
		})
	}

	static handleBuddyRequest(data, penguin) {
		const toRequest = parseInt(data[4])

		if (isNaN(toRequest)) return penguin.disconnect()

		penguin.doesIDExist(toRequest).then((exists) => {
			if (!exists) return

			if (toRequest == penguin.id) return
			if (penguin.buddies.length >= 500) return penguin.sendError(901)

			if (penguin.buddies.length != 0) {
				penguin.buddies.forEach(buddy => {
					buddy = buddy.split("|")
					if (Number(buddy[0]) == toRequest) return
				})
			}

			const requestObj = penguin.server.getPenguinById(toRequest)

			if (requestObj) {
				if (requestObj.buddies.length >= 500) return requestObj.sendError(901)
				if (requestObj.buddies.length != 0) {
					requestObj.buddies.forEach(buddy => {
						buddy = buddy.split("|")
						if (Number(buddy[0]) == penguin.id) return
					})
				}

				requestObj.requests.push(penguin.id)
				requestObj.sendXt("br", -1, penguin.id, penguin.username)
			}
		})
	}

	static handleBuddyRemove(data, penguin) {
		const toRemove = parseInt(data[4])

		if (isNaN(toRemove)) return penguin.disconnect()

		penguin.doesIDExist(toRemove).then((exists) => {
			if (!exists) return

			if (penguin.buddies.length == 0) return

			penguin.database.getUsernameByID(toRemove).then((result) => {
				const usernameToRemove = result[0].username

				penguin.database.removeBuddy(penguin.id, toRemove, usernameToRemove).then(() => {
					penguin.database.removeBuddy(toRemove, penguin.id, penguin.username).then(() => {
						const removeObj = penguin.server.getPenguinById(toRemove)

						if (removeObj) removeObj.sendXt("rb", -1, penguin.id, penguin.username)

						penguin.sendXt("rb", -1, toRemove, usernameToRemove)
					})
				}).catch(() => {
					penguin.disconnect()
				})
			})
		})
	}

	static handleBuddyFind(data, penguin) {
		const toFind = parseInt(data[4])

		if (isNaN(toFind)) return penguin.disconnect()

		penguin.doesIDExist(toFind).then((exists) => {
			if (!exists) return

			const findObj = penguin.server.getPenguinById(toFind)

			if (findObj) penguin.sendXt("bf", -1, findObj.room.id)
		})
	}
}

module.exports = Buddy