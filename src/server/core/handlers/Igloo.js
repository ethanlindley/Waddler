"use strict"

class Igloo {
	static handleIglooFurniture(data, penguin) {
		const furnitureID = parseInt(data[4])

		if (isNaN(furnitureID)) return penguin.disconnect()

		penguin.addFurniture(furnitureID)
	}

	static handleGetFurniture(data, penguin) {
		return penguin.getFurniture()
	}

	static handleGetActiveIgloo(data, penguin) {
		const penguinID = parseInt(data[4])

		if (isNaN(penguinID)) return penguin.disconnect()

		penguin.doesIDExist(penguinID).then((exists) => {
			if (!exists) return

			if (penguin.id != penguinID) return penguin.disconnect()

			penguin.database.getActiveIgloo(penguin.id).then((result) => {
				const iglooStr = `${result[0].type}%${result[0].music}%${result[0].floor}%${result[0].furniture}%${result[0].locked}`

				penguin.sendXt("gm", -1, penguin.id, iglooStr)
			})
		})
	}

	static handleLoadPlayerIglooList(data, penguin) {
		if (penguin.openIgloos.length == 0 || Object.keys(penguin.openIgloos).length == 0) return penguin.sendXt("gr", -1)

		let iglooList = []

		for (const i in Object.keys(penguin.openIgloos)) {
			let id = Object.keys(penguin.openIgloos)[i]
			let username = penguin.openIgloos[id]

			iglooList.push([id, username].join("|"))
		}

		penguin.sendXt("gr", -1, iglooList.join("%"))
	}

	static handleGetIgloos(data, penguin) {
		penguin.getIgloos()
		penguin.sendXt("go", -1, penguin.igloos)
	}

	static handleSaveFurniture(data, penguin) {
		let furniture = data.join(",").substr(13)

		if (furniture.length < 1) return penguin.updateColumn("furnitureID", "[]", "furniture")
		if (furniture.length > 99) {
			let addStamp = true

			if (penguin.stamps.length != 0) {
				penguin.stamps.forEach(stamp => {
					stamp = stamp.split("|")
					if (Number(stamp[0]) == 23) addStamp = false
				})
			}

			if (addStamp) penguin.addStamp(23)

			return penguin.sendError(10006)
		}

		penguin.updateColumn("furniture", furniture, "igloo")
	}

	static handleUpdateMusic(data, penguin) {
		const musicId = parseInt(data[4])

		if (isNaN(musicId)) return penguin.disconnect()

		penguin.updateColumn("music", musicId, "igloo")
	}

	static handleOpenIgloo(data, penguin) {
		const penguinID = parseInt(data[4])

		if (isNaN(penguinID)) return penguin.disconnect()

		penguin.doesIDExist(penguinID).then((exists) => {
			if (!exists) return

			if (penguin.id != penguinID) return penguin.disconnect()

			penguin.openIgloos[penguin.id] = penguin.username
		})
	}

	static handleCloseIgloo(data, penguin) {
		const penguinID = parseInt(data[4])

		if (isNaN(penguinID)) return penguin.disconnect()

		penguin.doesIDExist(penguinID).then((exists) => {
			if (!exists) return

			if (penguin.id != penguinID) return penguin.disconnect()

			delete penguin.openIgloos[penguin.id]
		})
	}

	static handleBuyIgloo(data, penguin) {
		const igloo = parseInt(data[4])

		if (isNaN(igloo)) return penguin.disconnect()

		penguin.addIgloo(igloo)
	}

	static handleUpdateIgloo(data, penguin) {
		const igloo = parseInt(data[4])

		if (isNaN(igloo)) return penguin.disconnect()

		penguin.updateColumn("furniture", "[]", "igloo")
		penguin.updateColumn("floor", 0, "igloo")
		penguin.updateColumn("type", igloo, "igloo")
	}

	static handleUpdateIglooFloor(data, penguin) {
		const floor = parseInt(data[4])

		if (isNaN(floor)) return penguin.disconnect()

		penguin.addFloor(floor)
	}
}

module.exports = Igloo