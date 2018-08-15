"use strict"

const sp = require("../utils/sp")

class Player {
	static handleSendPosition(data, penguin) {
		const x = parseInt(data[4]),
			y = parseInt(data[5])

		if (isNaN(x) || isNaN(y)) return penguin.disconnect()

		penguin.x = x
		penguin.y = y

		if (penguin.coinDig > 5) return penguin.sendError(800, true)
		if (penguin.coinDig != 0) penguin.coinDig = 0

		penguin.room.sendXt("sp", -1, penguin.id, x, y)
	}

	static handleSendFrame(data, penguin) {
		const frameId = parseInt(data[4])

		if (isNaN(frameId)) return penguin.disconnect()

		penguin.frame = frameId

		penguin.room.sendXt("sf", -1, penguin.id, frameId)
	}

	static handleSendAction(data, penguin) {
		const actionId = parseInt(data[4])

		if (isNaN(actionId)) return penguin.disconnect()

		penguin.frame = 1

		penguin.room.sendXt("sa", -1, penguin.id, actionId)
	}

	static handleSendSnowball(data, penguin) {
		const x = parseInt(data[4]),
			y = parseInt(data[5])

		if (isNaN(x) || isNaN(y)) return penguin.disconnect()

		penguin.room.sendXt("sb", -1, penguin.id, x, y)
	}

	static handleSendEmote(data, penguin) {
		const emoteId = parseInt(data[4])

		if (isNaN(emoteId)) return penguin.disconnect()

		penguin.room.sendXt("se", -1, penguin.id, emoteId)
	}

	static handleSendJoke(data, penguin) {
		const jokeId = parseInt(data[4])

		if (isNaN(jokeId)) return penguin.disconnect()

		penguin.room.sendXt("sj", -1, penguin.id, jokeId)
	}

	static handleSendSafeMessage(data, penguin) {
		const safeMessageId = parseInt(data[4])

		if (isNaN(safeMessageId)) return penguin.disconnect()

		penguin.room.sendXt("ss", -1, penguin.id, safeMessageId)
	}

	static handleSendTourGuide(data, penguin) {
		const tourGuideId = parseInt(data[4])

		if (isNaN(tourGuideId)) return penguin.disconnect()

		penguin.room.sendXt("sg", -1, penguin.id, tourGuideId)
	}

	static handleSendMascotMessage(data, penguin) {
		const mascotMessageId = parseInt(data[4])

		if (isNaN(mascotMessageId)) return penguin.disconnect()

		penguin.room.sendXt("sma", -1, penguin.id, mascotMessageId)
	}

	static handleGetPlayer(data, penguin) {
		const id = parseInt(data[4])

		if (isNaN(id)) return penguin.disconnect()

		penguin.database.getPlayer(id).then((result) => {
			const playerInfo = [
				result.id,
				result.username,
				1,
				result.color,
				result.head,
				result.face,
				result.neck,
				result.body,
				result.hand,
				result.feet,
				result.pin,
				result.photo
			]
			penguin.sendXt("gp", -1, playerInfo.join("|") + "|")
		}).catch((err) => {
			console.error(err)
			return penguin.disconnect()
		})
	}

	static handleHeartBeat(data, penguin) {
		penguin.sendXt("h", -1)
	}

	static handleLastRevision(data, penguin) {
		penguin.sendXt("glr", -1, "Waddler")
	}

	static handleSendLine(data, penguin) {
		const lineId = parseInt(data[4])

		if (isNaN(lineId)) return penguin.disconnect()

		penguin.sendXt("sl", -1, penguin.id, lineId)
	}

	static handleSendMessage(data, penguin) {
		const message = String(data[5])

		if (message.length <= 0 || message.length > 48) return penguin.sendError(5, true)
		if (penguin.muted) {
			penguin.room.sendXt("mm", -1, penguin.id, message)
		} else {
			if (message.startsWith("/") || message.startsWith("!")) {
				const command = message.substr(1, message.length - 1)
				const argument = message.split(" ")

				return new(require("../plugins/Commands/Commands"))(penguin).handleCommand(command.split(" "), argument)
			} else {
				penguin.room.sendXt("sm", -1, penguin.id, require("../plugins/Censor/Censor").censorCheck(message))
			}
		}
	}

	static handleMineCoins(data, penguin) {
		if (penguin.frame != 26) return penguin.sendError(5, true)
		if (penguin.coinDig > 5) return

		const amount = sp.getRandomCoins()

		penguin.addCoins(amount)
		penguin.sendXt("cdu", -1, amount, penguin.coins)
		penguin.coinDig++
	}

	static handleDonateCoins(data, penguin) {
		const amount = parseInt(data[4])

		if (penguin.coins < amount) return penguin.sendError(401)

		penguin.removeCoins(amount)
		penguin.sendXt("dc", -1, penguin.id, penguin.coins)
	}
}

module.exports = Player