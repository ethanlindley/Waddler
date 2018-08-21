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

	leaveMancalaTable(penguin) {
		if (penguin.tableId == null || penguin.playerSeat == null) return

		penguin.sendXt("lt", -1)

		if (this.server.tablesById[penguin.tableId].length > 1) penguin.room.sendXt("ut", -1, penguin.tableId, penguin.playerSeat)

		const game = this.server.gameByTableId[penguin.tableId]

		if (game == undefined) {
			penguin.tableId = null
			return
		}

		if (penguin.playerSeat > 1) {
			delete this.tablePlayers[penguin.tableId][penguin.playerSeat]
			penguin.tableId = null
			return
		}

		const opponentSeatId = penguin.playerSeat == 0 ? 1 : 0

		if (this.server.tablePlayers[penguin.tableId][opponentSeatId] !== undefined && game.finished == false) this.server.tablePlayers[penguin.tableId][opponentSeatId].addCoins(10)

		if (this.server.tablesById[penguin.tableId].length > 1 && game.finished == false) {
			for (const seat in this.server.tablePlayers[penguin.tableId]) {
				const player = this.server.tablePlayers[penguin.tableId][seat]
				player.sendXt("cz", -1, penguin.username)
			}
		}

		this.server.tablesById[penguin.tableId] = []

		delete this.server.tablePlayers[penguin.tableId]
		delete this.server.gameByTableId[penguin.tableId]

		penguin.room.sendXt("ut", -1, penguin.tableId, 0)

		penguin.tableId = null
	}
}

module.exports = gameManager