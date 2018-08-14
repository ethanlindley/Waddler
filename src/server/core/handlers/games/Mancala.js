"use strict"

class Mancala {
	constructor() {
		this.currentPlayer = 1
		this.boardMap = [
			[4, 4, 4, 4, 4, 4, 0],
			[4, 4, 4, 4, 4, 4, 0]
		]
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

	isValidMove(hollow) {
		if (this.currentPlayer === 1 && ![0, 1, 2, 3, 4, 5, 6].includes(hollow)) {
			return false
		} else if (this.currentPlayer === 2 && ![7, 8, 9, 10, 11, 12, 13].includes(hollow)) {
			return false
		}
		return true
	}
}

module.exports = Mancala