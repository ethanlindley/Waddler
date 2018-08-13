"use strict"

class Moderation {
	static handleBan(data, penguin) {
		if (!penguin.moderator) return

		const id = parseInt(data[4])

		if (isNaN(id)) return penguin.disconnect()

		penguin.database.updateColumn(id, "banned", 1)

		const player = penguin.server.getPenguin(id)

		if (player) {
			player.sendXt("b", -1)
			player.disconnect()
		}
	}

	static handleKick(data, penguin) {
		if (!penguin.moderator) return

		const id = parseInt(data[4])

		if (isNaN(id)) return penguin.disconnect()

		const player = penguin.server.getPenguin(id)

		if (player) player.sendError(5, true)
	}

	static handleMute(data, penguin) {
		if (!penguin.moderator) return

		const id = parseInt(data[4])

		if (isNaN(id)) return penguin.disconnect()

		let player = penguin.server.getPenguin(id)

		if (player) player.muted = !player.muted
	}
}

module.exports = Moderation