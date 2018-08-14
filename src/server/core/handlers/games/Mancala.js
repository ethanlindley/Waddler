"use strict"

class Mancala {
	constructor() {
		this.currentPlayer = 1
		this.winner = 0
		this.boardMap = [
			[4, 4, 4, 4, 4, 4, 0],
			[4, 4, 4, 4, 4, 4, 0]
		]

		this.tableGames = []
		this.tablePopulation = []
		this.tablePlayers = []

		for (let i = 100; i < 104; i++) {
			this.tableGames[i] = null
			this.tablePopulation[i] = {}
			this.tablePlayers[i] = []
		}

		penguin.server.tableGames = this.tableGames
		penguin.server.tablePopulation = this.tablePopulation
		penguin.server.tablePlayers = this.tablePlayers
	}

	array_sum(array) {
		let sum = 0
		if (typeof array != "object") return null
		for (const key in array) {
			if (!isNaN(parseFloat(array[key]))) {
				sum += parseFloat(array[key])
			}
		}
		return sum
	}
	is_int(mixedVar) {
		return mixedVar === +mixedVar && isFinite(mixedVar) && !(mixedVar % 1)
	}
	isset() {
		let a = arguments
		let l = a.length,
			i = 0,
			undef
		if (l === 0) throw new Error("Empty isset")
		while (i !== l) {
			if (a[i] === undef || a[i] === null) {
				return false
			}
			i++
		}
		return true
	}
	array_slice(arr, offst, lgth, preserveKeys) {
		let key = ""
		if (Object.prototype.toString.call(arr) != "[object Array]" || (preserveKeys && offst != 0)) {
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
				it++
				if (arrlgth >= lgth) {
					break
				}
				if (it === offst) {
					start = true
				}
				if (!start) {
					continue
				}
				arrlgth++;
				if (this.is_int(key) && !preserveKeys) {
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

	toString() {
		let boardMap = ""
		for (let i = 0; i < 7; i++) {
			for (let x = 0; x < 2; x++) {
				boardMap += this.boardMap[x][i] + ","
			}
		}
		return boardMap.slice(0, -1)
	}

	changePlayer() {
		if (this.currentPlayer === 1) {
			this.currentPlayer = 2
		} else {
			this.currentPlayer = 1
		}
	}

	validMove(hollow) {
		if (this.currentPlayer === 1 && ![0, 1, 2, 3, 4, 5].includes(hollow)) return false
		if (this.currentPlayer === 2 && ![7, 8, 9, 10, 11, 12].includes(hollow)) return false
		return true
	}

	determineTie() {
		if (this.array_sum(this.array_slice(this.boardMap, 0, 6)) === 0 || this.array_sum(this.array_slice(this.boardMap, 7, 6)) === 0) {
			if (this.array_sum(this.array_slice(this.boardMap, 0, 6)) === this.array_sum(this.array_slice(this.boardMap, 7, 6))) {
				return 2
			}
		}
		return 3
	}

	determineWin() {
		if (this.array_sum(this.array_slice(this.boardMap, 0, 6)) === 0 || this.array_sum(this.array_slice(this.boardMap, 7, 6)) === 0) {
			if (this.array_sum(this.array_slice(this.boardMap, 0, 6)) > this.array_sum(this.array_slice(this.boardMap, 7, 6))) {
				this.winner = 1
			} else {
				this.winner = 2
			}
			return 1
		}
		return 3
	}

	processBoard() {
		const tie = this.determineTie()
		if (tie === 2) return tie
		const win = this.determineWin()
		if (win === 1) return win
		return 0
	}

	makeMove(hollow) {
		if (this.validMove(hollow)) {
			let capture = false,
				hand = this.boardMap[hollow]
			this.boardMap[hollow] = 0

			while (hand > 0) {
				hollow++
				if (!this.isset(this.boardMap[hollow])) hollow = 0
				let myMancala = (this.currentPlayer === 1 ? 6 : 13)
				let opponentMancala = (this.currentPlayer === 1 ? 13 : 6)
				if (hollow === opponentMancala) continue
				let oppositeHollow = 12 - hollow
				if (this.currentPlayer === 1 && [0, 1, 2, 3, 4, 5].includes(hollow) && hand === 1 && this.boardMap[hollow] === 0) {
					this.boardMap[myMancala] = this.boardMap[myMancala] + this.boardMap[oppositeHollow] + 1
					this.boardMap[oppositeHollow] = 0
					capture = true
					break
				}
				if (this.currentPlayer === 2 && [7, 8, 9, 10, 11, 12].includes(hollow) && hand === 1 && this.boardMap[hollow] === 0) {
					this.boardMap[myMancala] = this.boardMap[myMancala] + this.boardMap[oppositeHollow] + 1
					this.boardMap[oppositeHollow] = 0
					capture = true
					break
				}
				this.boardMap[hollow]++
					hand--
			}
			let gameStatus = this.processBoard()
			if (gameStatus === 0) {
				if ((this.currentPlayer === 1 && hollow !== 6) || (this.currentPlayer === 2 && hollow !== 13)) {
					this.changePlayer()
					if (capture) {
						return "c"
					}
				} else {
					return "f"
				}
			}
			return gameStatus
		} else {
			return -1
		}
	}
}

module.exports = Mancala