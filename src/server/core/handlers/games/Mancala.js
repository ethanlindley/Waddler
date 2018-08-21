"use strict"

class Mancala {
	constructor() {
		this.board = [
			4, 4, 4, 4, 4, 4, 0,
			4, 4, 4, 4, 4, 4, 0
		]
		this.players = [null, null]
		this.seatTurn = 0
		this.finished = false

		this.tablesById = {}
		this.roomByTable = {}
		this.gameByTableId = {}
		this.tablePlayers = {}

		this.tablesById[100] = []
		this.tablesById[101] = []
		this.tablesById[102] = []
		this.tablesById[103] = []
		this.tablesById[104] = []
		this.roomByTable[100] = 111
		this.roomByTable[101] = 111
		this.roomByTable[102] = 111
		this.roomByTable[103] = 111
		this.roomByTable[104] = 111
	}

	sum(a) {
		let s = 0

		for (const x of a) s += x

		return s
	}

	boardToString() {
		return this.board.join(",")
	}

	addPlayer(penguin) {
		if (this.players.length > 2) return

		this.getPlayerBoard(penguin.playerSeat)

		this.players[1] = penguin
	}

	getPlayerMancala(seat) {
		return seat > 0 ? 13 : 6
	}

	getPlayerBoard(seat) {
		let board = this.board.slice(0)

		board.splice(6, 1)
		board.splice(12, 1)

		return seat == 0 ? board.slice(0, 5) : board.slice(6)
	}

	movement(obj) {
		if (obj.cup < 0 && cup < this.board.length) return

		this.seatTurn == 0 ? this.seatTurn = 1 : this.seatTurn = 0
	}

	handleGetTable(data, penguin) {
		let tablePopulation = [100, 101, 102, 103, 104].map(tid => [tid, this.tablesById[tid].length].join("|")).join("%")

		penguin.sendXt("gt", -1, tablePopulation)
	}

	handleJoinTable(data, penguin) {
		const tableId = parseInt(data[4])

		if (isNaN(tableId)) return

		this.handleLeaveTable(data, penguin)

		const seatId = this.tablesById[tableId].length

		if (Object.keys(this.tablesById[tableId]).length == 0) {
			this.gameByTableId[tableId] = this
			this.players[0] = penguin
			this.tablePlayers[tableId] = {}
		}

		this.tablePlayers[tableId][seatId] = penguin
		this.tablesById[tableId][seatId] = penguin.username

		penguin.tableId = tableId
		penguin.playerSeat = seatId

		penguin.sendXt("jt", -1, tableId, seatId + 1)
		penguin.room.sendXt("ut", -1, tableId, seatId + 1)
	}

	handleLeaveTable(data, penguin) {
		penguin.server.tablesById = this.tablesById
		penguin.server.gameByTableId = this.gameByTableId
		penguin.server.tablePlayers = this.tablePlayers
		penguin.server.gameManager.gameType = "M"
		penguin.server.gameManager.leaveMancalaTable(penguin)
	}

	handleGetGame(data, penguin) {
		const playerNames = require("range").range(2).map(i => this.tablesById[penguin.tableId][i]).join("%")
		const boardString = this.gameByTableId[penguin.tableId].boardToString()

		penguin.sendXt("gz", -1, playerNames, boardString)
	}

	handleJoinGame(data, penguin) {
		const seatId = penguin.playerSeat

		if (seatId == null || isNaN(seatId)) return

		penguin.sendXt("jz", -1, seatId)

		this.gameByTableId[penguin.tableId].addPlayer(penguin)

		for (const seat in this.tablePlayers[penguin.tableId]) {
			const player = this.tablePlayers[penguin.tableId][seat]

			player.sendXt("uz", -1, seatId, penguin.username)

			if (seatId == 1) player.sendXt("sz", -1, this.gameByTableId[penguin.tableId].seatTurn)
		}
	}

	handleSendMove(data, penguin) {
		if (this.tablePlayers[penguin.tableId].length < 2 || penguin.playerSeat > 1) return

		const match = this.gameByTableId[penguin.tableId] || null
		const obj = {
			seat: penguin.playerSeat,
			cup: data[4]
		}

		if (isNaN(obj.cup)) return

		for (const seat in this.tablePlayers[penguin.tableId]) {
			const player = this.tablePlayers[penguin.tableId][seat]

			player.sendXt("zm", -1, Object.values(obj).join("%"))
		}

		if (match !== null) match.movement(obj)
	}
}

module.exports = Mancala