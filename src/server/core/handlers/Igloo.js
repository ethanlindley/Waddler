"use strict"

class Igloo {
	static handleLoadPlayerIglooList(data, penguin) {
		if (penguin.openIgloos.length == 0 || Object.keys(penguin.openIgloos).length == 0) return penguin.sendXt("gr", -1)

		let iglooList = []

		for (const i in Object.keys(penguin.openIgloos)) {
			let id = Object.keys(penguin.openIgloos[i])
			let username = penguin.openIgloos[id]

			iglooList.push([id, username].join("|"))
		}

		penguin.sendXt("gr", -1, iglooList.join("%"))
	}

	static handleGetIgloos(data, penguin) {
		penguin.getIgloos()
		penguin.sendXt("go", -1, penguin.igloos)
	}

	static handleOpenIgloo(data, penguin) {
		if (parseInt(data[4]) != penguin.id) return

		penguin.openIgloos[penguin.id] = penguin.username
	}

	static handleCloseIgloo(data, penguin) {
		if (parseInt(data[4]) != penguin.id) return

		delete penguin.openIgloos[penguin.id]
	}
}

module.exports = Igloo