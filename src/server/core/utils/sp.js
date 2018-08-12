"use strict"

class sp {
	static dateToInt() {
		const date = new Date()
		return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
	}
	static getTime() {
		return Math.floor(new Date() / 1000)
	}

	static getPatchedItems() {
		return [413, 444]
	}
	static getNonDividableGames() {
		return [916, 906, 905, 904, 912]
	}

	static getRandomCoins() {
		return [1, 2, 5, 10, 20, 50, 100][Math.floor(Math.random() * 7)]
	}
	static getRandomRoom() {
		return [100, 110, 300, 400][Math.floor(Math.random() * 4)]
	}
	static getRandomPosition() {
		return Math.floor(Math.random() * 300) + 100
	}
}

module.exports = sp