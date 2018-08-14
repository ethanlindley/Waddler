"use strict"

const sp = require("../utils/sp")

module.exports = class Multiplayer {
	static handleMovePuck(data, penguin) {
		let puckCoords = [parseInt(data[5]), parseInt(data[6]), parseInt(data[7]), parseInt(data[8])].join("%")

		penguin.sendXt("zm", -1, penguin.id, puckCoords)
	}

	static handleGetGame(data, penguin) {
		if (penguin.room.id == 802) {
			penguin.sendXt("gz", -1, "0%0%0%0%")
		} else if (penguin.tableId) {
			const tableId = penguin.tableId
			const players = Object.keys(penguin.server.gameManager.tablePopulation[tableId])
			const board = penguin.server.gameManager.tableGames[tableId].toString()
			const [playerOne, playerTwo] = players

			penguin.sendXt("gz", -1, playerOne, playerTwo, board)
		}
	}

	static handleGameOver(data, penguin) {
		const score = parseInt(data[4])

		if (isNaN(score) || isNaN(penguin.gameRoomId)) return penguin.disconnect()
		if (penguin.gameRoomId > 1000) return

		sp.isNonDividableGame(penguin.gameRoomId) ? penguin.addCoins(score) : score < 99999 ? penguin.addCoins(Math.floor(score / 10)) : penguin.disconnect()

		penguin.sendXt("zo", -1, penguin.coins, 0, 0, 0, 0)
	}

	static handleGetTable(data, penguin) {
		data.splice(0, 4)

		let tablePopulation = ""

		for (const tableId of data) {
			if (penguin.server.gameManager.tablePopulation[tableId]) {
				const tableObj = penguin.server.gameManager.tablePopulation[tableId]
				const seatId = Object.keys(tableObj).length

				tablePopulation += `${tableId}|${seatId}%`
			}
		}
		penguin.sendXt("gt", -1, tablePopulation.slice(0, -1))
	}

	static handleJoinTable(data, penguin) {
		const tableId = parseInt(data[4])
		const tableObj = penguin.server.gameManager.tablePopulation[tableId]
		let seatId = Object.keys(tableObj).length

		if (!penguin.server.gameManager.tableGames[tableId]) {
			penguin.server.gameManager.tableGames[tableId] = new(require("./games/FindFour"))
		}

		seatId += 1

		penguin.server.gameManager.tablePopulation[tableId][penguin.username] = penguin
		penguin.server.gameManager.tablePlayers[tableId].push(penguin)
		penguin.sendXt("jt", -1, tableId, seatId)
		penguin.room.sendXt("ut", -1, tableId, seatId)
		penguin.tableId = tableId
	}

	static handleLeaveTable(data, penguin) {
		penguin.server.gameManager.leaveTable(penguin)
	}

	static handleJoinGame(data, penguin) {
		if (penguin.tableId) {
			const tableId = penguin.tableId
			const tableObj = penguin.server.gameManager.tablePopulation[tableId]
			const seatId = Object.keys(tableObj).length - 1

			penguin.sendXt("jz", -1, seatId)

			for (const player of penguin.server.gameManager.tablePlayers[tableId]) {
				player.sendXt("uz", -1, seatId, penguin.username)

				if (seatId == 1) player.sendXt("sz", -1, 0)
			}
		}
	}

	static handleSendMove(data, penguin) {
		if (penguin.tableId) {
			const tableId = penguin.tableId
			const isPlaying = penguin.server.gameManager.tablePlayers[tableId].indexOf(penguin) < 2
			const isReady = penguin.server.gameManager.tablePlayers[tableId].length >= 2

			if (isPlaying && isReady) {
				const chipColumn = parseInt(data[4])
				const chipRow = parseInt(data[5])
				const seatId = penguin.server.gameManager.tablePlayers[tableId].indexOf(penguin)

				if (penguin.server.gameManager.tableGames[tableId].currentPlayer == (seatId + 1)) {
					const result = penguin.server.gameManager.tableGames[tableId].placeChip(chipColumn, chipRow)
					const opponentSeat = (seatId == 0 ? 1 : 0)
					const opponent = penguin.server.gameManager.tablePlayers[tableId][opponentSeat]

					if (result == 1) {
						penguin.addCoins(20)
						opponent.addCoins(10)
					}
					if (result == 2) {
						penguin.addCoins(5)
						opponent.addCoins(5)
					}

					for (const player of penguin.server.gameManager.tablePlayers[tableId]) {
						player.sendXt("zm", -1, seatId, chipColumn, chipRow)

						if (result == 1 || result == 2) player.sendXt("zo", -1, player.coins)
					}
				}
			}
		}
	}
}