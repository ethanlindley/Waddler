"use strict"

class gameManager {
	constructor(server) {
		this.server = server
		this.gameType = ""
	}

	leaveTable(penguin) {
		const tableId = penguin.tableId

		if (tableId) {
			const seatId = this.server.tablePlayers[tableId].indexOf(penguin)
			const opponentSeat = (seatId == 0 ? 1 : 0)

			penguin.room.sendXt("ut", -1, tableId, seatId)
			penguin.tableId = null

			if (this.server.tablePlayers[tableId].length == 2) this.server.tablePlayers[tableId][opponentSeat].sendXt("cz", -1, penguin.username)

			this.server.tablePlayers[tableId].splice(seatId)

			delete this.server.tablePopulation[tableId][penguin.username]

			if (this.server.tablePlayers[tableId].length == 0) {
				this.server.tablePlayers[tableId] = []
				this.server.tablePopulation[tableId] = {}
				this.server.tableGames[tableId] = null
			}
		}
	}
}

module.exports = gameManager