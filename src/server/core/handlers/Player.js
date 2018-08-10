"use strict"

class Player
{
	static handleSendPosition(data, penguin)
	{
		const x = parseInt(data[4]),
			y = parseInt(data[5])

		if (isNaN(x) || isNaN(y)) return penguin.disconnect()

		penguin.x = x
		penguin.y = y

		penguin.room.sendXt("sp", -1, penguin.id, x, y)
	}

	static handleSendFrame(data, penguin)
	{
		const frame = parseInt(data[4])

		if (isNaN(frame)) return penguin.disconnect()

		penguin.frame = frame

		penguin.room.sendXt("sf", -1, penguin.id, frame)
	}

	static handleSendAction(data, penguin)
	{
		const action = parseInt(data[4])

		if (isNaN(action)) return penguin.disconnect()

		penguin.frame = 1

		penguin.room.sendXt("sa", -1, penguin.id, action)
	}

	static handleSendSnowball(data, penguin)
	{
		const x = parseInt(data[4]),
			y = parseInt(data[5])

		if (isNaN(x) || isNaN(y)) return penguin.disconnect()

		penguin.room.sendXt("sb", -1, penguin.id, x, y)
	}

	static handleSendEmote(data, penguin)
	{
		const emote = parseInt(data[4])

		if (isNaN(emote)) return penguin.disconnect()

		penguin.room.sendXt("se", -1, penguin.id, emote)
	}

	static handleSendJoke(data, penguin)
	{
		const joke = parseInt(data[4])

		if (isNaN(joke)) return penguin.disconnect()

		penguin.room.sendXt("sj", -1, penguin.id, joke)
	}

	static handleSendSafeMessage(data, penguin)
	{
		const sfMsg = parseInt(data[4])

		if (isNaN(sfMsg)) return penguin.disconnect()

		penguin.room.sendXt("ss", -1, penguin.id, sfMsg)
	}

	static handleSendTourGuide(data, penguin)
	{
		const tour = parseInt(data[4])

		if (isNaN(tour)) return penguin.disconnect()

		penguin.room.sendXt("sg", -1, penguin.id, tour)
	}

	static handleGetPlayer(data, penguin)
	{
		const id = parseInt(data[4])

		if (isNaN(id)) return penguin.disconnect()

		penguin.database.getPlayer(id).then((result) =>
		{
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
		}).catch((err) =>
		{
			console.error(err)
			return penguin.disconnect()
		})
	}

	static handleHeartBeat(data, penguin)
	{
		penguin.sendXt("h", -1)
	}

	static handleLastRevision(data, penguin)
	{
		penguin.sendXt("glr", -1, "Waddler")
	}

	static handleSendLine(data, penguin)
	{
		const line = parseInt(data[4])

		if (isNaN(line)) return penguin.disconnect()

		penguin.sendXt("sl", -1, penguin.id, line)
	}

	static handleSendMessage(data, penguin)
	{
		const message = String(data[5])

		if (message.length > 0 && message.length <= 48)
		{
			penguin.room.sendXt("sm", -1, penguin.id, message)
		}
		else
		{
			penguin.sendError(5, true)
		}
	}
}

module.exports = Player