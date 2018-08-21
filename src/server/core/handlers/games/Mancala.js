"use strict"

/*
 * Fully working Mancala, ported from Kitsune by Zaseth.
 */

class Mancala {
	constructor() {
		this.boardMap = [
			4, 4, 4, 4, 4, 4, 0, // The first 6 numbers are for player 1, where 0 is the basket (right-side of table)
			4, 4, 4, 4, 4, 4, 0 // The second 6 numbers are for player 2, where 0 is the basket (left-side of table)
		]
		this.currentPlayer = 1
		this.winner = 0

		this.tableGames = []
		this.tablePopulation = []
		this.tablePlayers = []

		for (let i = 100; i <= 104; i++) { // '<=' adds all the tables where '<' misses table 104
			this.tableGames[i] = null
			this.tablePopulation[i] = {}
			this.tablePlayers[i] = []
		}
	}

	/*
	 * PHP implementation scripts, taken from Locutus.io
	 */
	sum(a) {
		let s = 0

		for (const k in a) {
			if (!isNaN(parseFloat(a[k]))) {
				s += parseFloat(a[k])
			}
		}

		return s
	}

	range(min, max) {
		const result = []

		for (let i = min; i < max; i += 1) result.push(i)

		return result
	}

	slice(arr, offst, lgth, preserveKeys) {
		let key = ""

		if (Object.prototype.toString.call(arr) !== "[object Array]" || (preserveKeys && offst !== 0)) {
			let lgt = 0,
				newAssoc = {}

			for (key in arr) {
				lgt += 1
				newAssoc[key] = arr[key]
			}

			arr = newAssoc
			offst = (offst < 0) ? lgt + offst : offst
			lgth = lgth === undefined ? lgt : (lgth < 0) ? lgt + lgth - offst : lgth

			let assoc = {},
				start = false,
				it = -1,
				arrlgth = 0,
				noPkIdx = 0

			for (key in arr) {
				it++;

				if (arrlgth >= lgth) break;
				if (it === offst) start = true
				if (!start) continue;

				arrlgth++;

				let isInteger = key === +key && isFinite(key) && !(key % 1)

				if (isInteger && !preserveKeys) {
					assoc[noPkIdx++] = arr[key]
				} else {
					assoc[key] = arr[key]
				}
			}
			return assoc
		}

		if (lgth === undefined) {
			return arr.slice(offst)
		} else if (lgth >= 0) {
			return arr.slice(offst, offst + lgth)
		} else {
			return arr.slice(offst, lgth)
		}
	}

	/*
	 * Joins the board together (player 1 and player 2's baskets).
	 */
	toString() {
		return this.boardMap.join(",")
	}

	/*
	 * Checks whether you're not nuking the game dropping 14+ stones.
	 */
	validMove(stone) {
		if (this.currentPlayer === 1 && !this.range(0, 7).includes(stone)) return false
		if (this.currentPlayer === 2 && !this.range(7, 14).includes(stone)) return false
		return true
	}

	/*
	 * Uses PHP's array_slice as boardMap.slice isn't precise enough.
	 * Counts the first 6 numbers for both players' baskets if it's 0 or equal to each other.
	 * Technically speaking: is [1, 1, 1, 1, 1, 1] equal to [1, 1, 1, 1, 1, 1]?
	 */
	determineTie() {
		if (this.sum(this.slice(this.boardMap, 0, 6)) === 0 || this.sum(this.slice(this.boardMap, 7, 6)) === 0) {
			if (this.sum(this.slice(this.boardMap, 0, 6)) === this.sum(this.slice(this.boardMap, 7, 6))) {
				return 2
			}
		}
		return 3
	}

	/*
	 * Counts the first 6 numbers for both players' baskets if it's 0 or equal to each other.
	 * If player 1's stone count in the baskets is greater than player 2's stone count in the baskets,
	 * Player 1 is the winner, else it's player 2.
	 */
	determineWin() {
		if (this.sum(this.slice(this.boardMap, 0, 6)) === 0 || this.sum(this.slice(this.boardMap, 7, 6)) === 0) {
			if (this.sum(this.slice(this.boardMap, 0, 6)) > this.sum(this.slice(this.boardMap, 7, 6))) {
				this.winner = 1
			} else {
				this.winner = 2
			}
			return 1
		}
		return 3
	}

	/*
	 * Fully checks the board if there's a tie or a win.
	 * If there's no tie or win, both players still have stones to play with.
	 */
	processBoard() {
		const tie = this.determineTie()
		if (tie === 2) return tie
		const win = this.determineWin()
		if (win === 1) return win
		return 0
	}

	/*
	 * Handles stone movements.
	 */
	makeMove(stone) {
		if (this.validMove(stone)) {
			let capture = false,
				hand = this.boardMap[stone]
			this.boardMap[stone] = 0

			while (hand > 0) {
				stone++;

				if (!this.boardMap[stone] || this.boardMap[stone] == undefined) stone = 0

				const myMancala = (this.currentPlayer === 1 ? 6 : 13)
				const opponentMancala = (this.currentPlayer === 1 ? 13 : 6)

				if (stone === opponentMancala) continue;

				const oppositeStone = 12 - stone

				if (this.currentPlayer === 1 && this.range(0, 6).includes(stone) && hand === 1 && this.boardMap[stone] === 0) {
					this.boardMap[myMancala] = this.boardMap[myMancala] + this.boardMap[oppositeStone] + 1
					this.boardMap[oppositeStone] = 0

					capture = true
					break;
				}

				if (this.currentPlayer === 2 && this.range(7, 13).includes(stone) && hand === 1 && this.boardMap[stone] === 0) {
					this.boardMap[myMancala] = this.boardMap[myMancala] + this.boardMap[oppositeStone] + 1
					this.boardMap[oppositeStone] = 0

					capture = true
					break;
				}

				this.boardMap[stone]++;
				hand--;
			}

			const gameStatus = this.processBoard()

			if (gameStatus === 0) {
				if ((this.currentPlayer === 1 && stone != 6) || (this.currentPlayer === 2 && stone != 13)) {
					if (this.currentPlayer === 1) {
						this.currentPlayer = 2
					} else {
						this.currentPlayer = 1
					}

					if (capture) return "c"
				} else {
					return "f"
				}
			}

			return gameStatus
		} else {
			return -1
		}
	}

	handleGetTable(data, penguin) {
		data.splice(0, 4)

		let tablePopulation = ""

		for (const tableId of data) {
			if (this.tablePopulation[tableId]) {
				const tableObj = this.tablePopulation[tableId]
				const seatId = Object.keys(tableObj).length

				tablePopulation += `${tableId}|${seatId}%`
			}
		}
		penguin.sendXt("gt", -1, tablePopulation.slice(0, -1))
	}

	handleJoinTable(data, penguin) {
		penguin.server.tableGames = this.tableGames
		penguin.server.tablePopulation = this.tablePopulation
		penguin.server.tablePlayers = this.tablePlayers

		const tableId = parseInt(data[4])
		const tableObj = this.tablePopulation[tableId]
		let seatId = Object.keys(tableObj).length

		if (!this.tableGames[tableId]) this.tableGames[tableId] = this

		seatId += 1

		this.tablePopulation[tableId][penguin.username] = penguin
		this.tablePlayers[tableId].push(penguin)

		penguin.sendXt("jt", -1, tableId, seatId)
		penguin.room.sendXt("ut", -1, tableId, seatId)
		penguin.tableId = tableId
	}

	handleLeaveTable(data, penguin) {
		penguin.server.gameManager.leaveTable(penguin)
	}

	handleGetGame(data, penguin) {
		if (penguin.tableId) {
			const tableId = penguin.tableId
			const players = Object.keys(this.tablePopulation[tableId])
			const board = this.tableGames[tableId].toString()
			const [playerOne, playerTwo] = players

			penguin.sendXt("gz", -1, playerOne, playerTwo, board)
		}
	}

	handleJoinGame(data, penguin) {
		if (penguin.tableId) {
			const tableId = penguin.tableId
			const tableObj = this.tablePopulation[tableId]
			const seatId = Object.keys(tableObj).length - 1

			penguin.sendXt("jz", -1, seatId)

			for (const player of this.tablePlayers[tableId]) {
				player.sendXt("uz", -1, seatId, penguin.username)

				if (seatId == 1) player.sendXt("sz", -1, 0)
			}
		}
	}

	handleSendMove(data, penguin) {
		if (penguin.tableId) {
			const tableId = penguin.tableId
			const isPlaying = this.tablePlayers[tableId].indexOf(penguin) < 2
			const isReady = this.tablePlayers[tableId].length >= 2

			if (isPlaying && isReady) {
				const potIndex = parseInt(data[4])
				const seatId = this.tablePlayers[tableId].indexOf(penguin)

				if (this.tableGames[tableId].currentPlayer == (seatId + 1)) {
					const result = this.tableGames[tableId].makeMove(potIndex)
					const opponentSeat = (seatId == 0 ? 1 : 0)
					const opponent = this.tablePlayers[tableId][opponentSeat]

					if (result == 1) {
						penguin.addCoins(20)
						opponent.addCoins(10)
					}

					if (result == 2) {
						penguin.addCoins(5)
						opponent.addCoins(5)
					}

					for (const player of this.tablePlayers[tableId]) {
						if (result == "f" || result == "c") {
							player.sendXt("zm", -1, seatId, potIndex, result)
						} else {
							player.sendXt("zm", -1, seatId, potIndex)
						}

						if (result == 1 || result == 2) player.sendXt("zo", -1, player.coins)
					}
				} else {
					console.log("Invalid move -1")
				}
			}
		}
	}
}

module.exports = Mancala