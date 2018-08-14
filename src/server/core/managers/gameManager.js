"use strict"

class gameManager {
	constructor(server) {
		this.server = server

		this.tableGames = []
		this.tablePopulation = []
		this.tablePlayers = []

		for (let i = 200; i < 208; i++) {
			this.tableGames[i] = null
			this.tablePopulation[i] = {}
			this.tablePlayers[i] = []
		}
	}

	leaveTable(penguin) {
		const tableId = penguin.tableId

		if (tableId) {
			const seatId = this.tablePlayers[tableId].indexOf(penguin)
			const opponentSeat = (seatId == 0 ? 1 : 0)

			penguin.room.sendXt("ut", -1, tableId, seatId)
			penguin.tableId = null

			if (this.tablePlayers[tableId].length == 2) this.tablePlayers[tableId][opponentSeat].sendXt("cz", -1, penguin.username)

			this.tablePlayers[tableId].splice(seatId)

			delete this.tablePopulation[tableId][penguin.username]

			if (this.tablePlayers[tableId].length == 0) {
				this.tablePlayers[tableId] = []
				this.tablePopulation[tableId] = {}
				this.tableGames[tableId] = null
			}
		}
	}
}

module.exports = gameManager