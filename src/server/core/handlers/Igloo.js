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

	static handleGetActiveIgloo(data, penguin) {
		if (parseInt(data[4]) != penguin.id) return

		penguin.database.getIglooDetails(penguin.id).then((result) => {
			const [type, music, floor, furniture, locked] = [result[0].type, result[0].music, result[0].floor, result[0].furniture, result[0].locked]
			penguin.sendXt("gm", -1, penguin.id, type, music, floor, furniture, locked)
		})
	}

	static handleGetIglooFurniture(data, penguin) {
		penguin.database.getIglooFurniture(penguin.id).then((result) => {
			if (result.length != 0) {
				result.forEach(row => {
					penguin.sendXt("gf", -1, [row.furnitureid, row.quantity].join("|") + "|")
				})
			} else {
				penguin.sendXt("gf", -1, [])
			}
		})
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