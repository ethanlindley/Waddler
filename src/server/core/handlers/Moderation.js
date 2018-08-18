"use strict"

class Moderation {
	static handleBan(data, penguin) {
		if (!penguin.moderator) return

		const toBan = parseInt(data[4])

		if (isNaN(toBan)) return penguin.disconnect()
		penguin.doesIDExist(toBan).then((exists) => {
			if (!exists) return
		})

		penguin.database.updateColumn(toBan, "banned", 1)

		const player = penguin.server.getPenguinById(toBan)

		if (player) {
			player.sendXt("b", -1)
			player.disconnect()
		}
	}

	static handleKick(data, penguin) {
		if (!penguin.moderator) return

		const toKick = parseInt(data[4])

		if (isNaN(toKick)) return penguin.disconnect()
		penguin.doesIDExist(toKick).then((exists) => {
			if (!exists) return
		})

		const player = penguin.server.getPenguinById(toKick)

		if (player) player.sendError(5, true)
	}

	static handleMute(data, penguin) {
		if (!penguin.moderator) return

		const toMute = parseInt(data[4])

		if (isNaN(toMute)) return penguin.disconnect()
		penguin.doesIDExist(toMute).then((exists) => {
			if (!exists) return
		})

		let player = penguin.server.getPenguinById(toMute)

		if (player) player.muted = !player.muted
	}
}

module.exports = Moderation