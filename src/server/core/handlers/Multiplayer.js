"use strict"

const sp = require("../utils/sp")

class Multiplayer {
	static handleMovePuck(data, penguin) {
		const x = parseInt(data[5]),
			y = parseInt(data[6]),
			z = parseInt(data[7]),
			h = parseInt(data[8])

		if (isNaN(x) || isNaN(y) || isNaN(z) || isNaN(h)) return penguin.disconnect()

		let puckCoords = [x, y, z, h].join("%")

		penguin.sendXt("zm", -1, penguin.id, puckCoords)
	}

	static handleGetGame(data, penguin) {
		if (penguin.room.id == 802) {
			penguin.sendXt("gz", -1, "0%0%0%0%")
		}
	}

	static handleGameOver(data, penguin) {
		const score = parseInt(data[4])

		if (isNaN(score) || isNaN(penguin.gameRoomId)) return penguin.disconnect()

		if (penguin.gameRoomId > 1000) return

		sp.getNonDividableGames().includes(penguin.gameRoomId) ? penguin.addCoins(score) : score < 99999 ? penguin.addCoins(Math.floor(score / 10)) : penguin.disconnect()

		penguin.sendXt("zo", -1, penguin.coins, 0, 0, 0, 0)
	}
}

module.exports = Multiplayer