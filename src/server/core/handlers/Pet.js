"use strict"

let puffles = {}

class Pet {
	static handleUpdatePuffle(type, value, puffleID, penguin) {
		if (isNaN(puffleID) || isNaN(value)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return

			penguin.updateColumn(type, value, "puffles")
		})
	}

	static joinPuffleData(puffleData, iglooAppend = false) {
		let puffleArray = []

		for (const i in puffleData) {
			let puffle = puffleData[i]
			let puffleID = puffle["puffleID"]
			let puffleDetails = [puffle["puffleID"], puffle["puffleName"], puffle["puffleType"], puffle["puffleFood"], puffle["pufflePlay"], puffle["puffleRest"]]

			if (iglooAppend) {
				if (puffles[puffleID] == undefined) {
					puffles[puffleID] = [100, 100, 100, 0, 0, 0, 0]
				}
				puffleDetails = puffleDetails.concat(puffles[puffleID])
			}
			puffleArray.push(puffleDetails.join("|"))
		}
		return puffleArray.join("%")
	}

	static handleGetPufflesByPlayerId(data, penguin) {
		const penguinID = parseInt(data[4])

		if (isNaN(penguinID)) return penguin.disconnect()

		penguin.doesIDExist(penguinID).then((exists) => {
			if (!exists) return

			penguin.database.getPuffles(penguinID).then((result) => {
				if (result.length <= 0) return penguin.sendXt("pg", -1)

				penguin.sendXt("pg", -1, this.joinPuffleData(result, true))
			})
		})
	}

	static handleGetPuffles(data, penguin) {
		penguin.database.getPuffles(penguin.id).then((result) => {
			if (result.length <= 0) return penguin.sendXt("pg", -1)

			penguin.sendXt("pgu", -1, this.joinPuffleData(result, true))
		})
	}

	static handlePuffleRest(data, penguin) {
		const puffleID = parseInt(data[4])

		if (isNaN(puffleID)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return

			let puffle = this.joinPuffleData(result, true)

			penguin.removeCoins(5)

			result[0].puffleRest += 20
			this.handleUpdatePuffle("puffleRest", result[0].puffleRest, puffleID, penguin)

			puffle = this.joinPuffleData(result, true)

			penguin.room.sendXt("pr", -1, puffle)
		})
	}

	static handlePufflePlay(data, penguin) {
		const puffleID = parseInt(data[4])

		if (isNaN(puffleID)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return

			let puffle = this.joinPuffleData(result, true)

			penguin.removeCoins(5)

			result[0].pufflePlay += 20
			this.handleUpdatePuffle("pufflePlay", result[0].pufflePlay, puffleID, penguin)

			puffle = this.joinPuffleData(result, true)

			penguin.room.sendXt("pp", -1, puffle, 1)
		})
	}

	static handlePuffleTreat(data, penguin) {
		const puffleID = parseInt(data[4])
		const treatID = parseInt(data[5])

		if (isNaN(puffleID) || isNaN(treatID)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return
			if (![1, 2].includes(treatID)) return

			let puffle = this.joinPuffleData(result, true)

			penguin.removeCoins(5)

			result[0].puffleFood += 10
			this.handleUpdatePuffle("puffleFood", result[0].puffleFood, puffleID, penguin)

			puffle = this.joinPuffleData(result, true)

			penguin.room.sendXt("pt", -1, penguin.coins, puffle, treatID)
		})
	}

	static handlePuffleFeed(data, penguin) {
		const puffleID = parseInt(data[4])

		if (isNaN(puffleID)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return

			let puffle = this.joinPuffleData(result, true)

			penguin.removeCoins(5)

			result[0].puffleFood += 20
			this.handleUpdatePuffle("puffleFood", result[0].puffleFood, puffleID, penguin)

			puffle = this.joinPuffleData(result, true)

			penguin.room.sendXt("pf", -1, penguin.coins, puffle)
		})
	}

	static handlePuffleBath(data, penguin) {
		const puffleID = parseInt(data[4])

		if (isNaN(puffleID)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return

			let puffle = this.joinPuffleData(result, true)

			penguin.removeCoins(5)

			result[0].pufflePlay += 20
			this.handleUpdatePuffle("pufflePlay", result[0].pufflePlay, puffleID, penguin)

			puffle = this.joinPuffleData(result, true)

			penguin.room.sendXt("pb", -1, penguin.coins, puffle)
		})
	}

	static handlePuffleInteractionRest(data, penguin) {
		const puffleID = parseInt(data[4])

		if (isNaN(puffleID)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return

			let puffle = this.joinPuffleData(result, true)

			penguin.room.sendXt("ir", -1, puffle)
		})
	}

	static handlePuffleInteractionPlay(data, penguin) {
		const puffleID = parseInt(data[4])

		if (isNaN(puffleID)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return

			let puffle = this.joinPuffleData(result, true)

			penguin.room.sendXt("ip", -1, puffle)
		})
	}

	static handlePuffleInteractionFeed(data, penguin) {
		const puffleID = parseInt(data[4])

		if (isNaN(puffleID)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return

			let puffle = this.joinPuffleData(result, true)

			penguin.room.sendXt("if", -1, puffle)
		})
	}

	static handlePuffleInitInteractionRest(data, penguin) {
		const puffleID = parseInt(data[4])
		const puffleX = parseInt(data[5])
		const puffleY = parseInt(data[6])

		if (isNaN(puffleID) || isNaN(puffleX) || isNaN(puffleY)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return

			let puffle = this.joinPuffleData(result, true)

			penguin.removeCoins(5)

			result[0].puffleRest += 20
			this.handleUpdatePuffle("puffleRest", result[0].puffleRest, puffleID, penguin)

			puffle = this.joinPuffleData(result, true)

			penguin.room.sendXt("pir", -1, puffleID, puffleX, puffleY)
		})
	}

	static handlePuffleInitInteractionPlay(data, penguin) {
		const puffleID = parseInt(data[4])
		const puffleX = parseInt(data[5])
		const puffleY = parseInt(data[6])

		if (isNaN(puffleID) || isNaN(puffleX) || isNaN(puffleY)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return

			let puffle = this.joinPuffleData(result, true)

			penguin.removeCoins(5)

			result[0].pufflePlay += 20
			this.handleUpdatePuffle("pufflePlay", result[0].pufflePlay, puffleID, penguin)

			puffle = this.joinPuffleData(result, true)

			penguin.room.sendXt("pip", -1, puffleID, puffleX, puffleY)
		})
	}

	static handlePuffleMove(data, penguin) {
		const puffleID = parseInt(data[4])
		const puffleX = parseInt(data[5])
		const puffleY = parseInt(data[6])

		if (isNaN(puffleID) || isNaN(puffleX) || isNaN(puffleY)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return

			let puffle = this.joinPuffleData(result, true)

			if (puffles[puffleID] == undefined) return

			puffles[puffleID] = [100, 100, 100, puffleX, puffleY, 0, 0]

			puffle = this.joinPuffleData(result, true)

			penguin.room.sendXt("pm", -1, puffleID, puffleX, puffleY)
		})
	}

	static handlePuffleFrame(data, penguin) {
		const puffleID = parseInt(data[4])
		const puffleFrame = parseInt(data[5])

		if (isNaN(puffleID) || isNaN(puffleFrame)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return

			penguin.room.sendXt("ps", -1, puffleID, puffleFrame)
		})
	}

	static handlePuffleWalk(data, penguin) {
		const puffleID = parseInt(data[4])

		if (isNaN(puffleID)) return

		penguin.database.getPuffle(penguin.id, puffleID).then((result) => {
			if (result.length <= 0) return

			let puffle = this.joinPuffleData(result, true)
			let puffleType = result[0].puffleType
			let handItem = `75${puffleType}`
			let walking

			if (puffles[puffleID] == undefined) return

			if (Number(result[0].puffleWalk) == 0) {
				walking = 1
				penguin.walkingPuffle = puffleID
			} else {
				walking = 0
			}

			puffles[puffleID] = [100, 100, 100, 0, 0, 0, walking]

			this.handleUpdatePuffle("puffleWalk", walking, puffleID, penguin)

			let puffleData = this.joinPuffleData(result, true)

			penguin.room.sendXt("pw", -1, penguin.id, puffleData)
		})
	}

	static handleAdoptPuffle(data, penguin) {
		const puffleType = parseInt(data[4])
		let puffleName = String(data[5])

		if (isNaN(puffleType)) return

		penguin.database.getPuffles(penguin.id).then((result) => {
			if (result.length >= 20) return penguin.sendError(440)
			if (penguin.coins < 800) return penguin.sendError(401)

			puffleName = String(puffleName).replace(/\W/g, "")

			if (penguin.server.pluginLoader.getPlugin("Censor")) {
				puffleName = penguin.server.pluginLoader.getPlugin("Censor").censorCheck(puffleName)
			}

			penguin.database.adoptPuffle(penguin.id, puffleName, puffleType).then(() => {
				penguin.removeCoins(800)
				penguin.database.getPuffleByName(penguin.id, puffleName).then((result) => {
					if (result.length <= 0) return

					let puffle = this.joinPuffleData(result)

					penguin.sendXt("pn", -1, penguin.coins, puffle)
				})
			})
		})
	}
}

module.exports = Pet