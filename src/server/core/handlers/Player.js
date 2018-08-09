"use strict"

class Player
{
	/*
	 * Sends the position of the player.
	 *
	 * x = int
	 * y = int
	 */
	static handleSendPosition(data, penguin)
	{
		const x = parseInt(data[4]),
			y = parseInt(data[5])

		if (isNaN(x) || isNaN(y))
		{
			return penguin.disconnect()
		}

		penguin.x = x
		penguin.y = y

		penguin.room.sendXt("sp", -1, penguin.id, x, y)
	}
	/*
	 * Sends the frame of the player.
	 *
	 * frame = int
	 */
	static handleSendFrame(data, penguin)
	{
		const frame = parseInt(data[4])

		if (isNaN(frame))
		{
			return penguin.disconnect()
		}

		penguin.frame = frame

		penguin.room.sendXt("sf", -1, penguin.id, frame)
	}
	/*
	 * Sends the action of the player.
	 *
	 * action = int
	 */
	static handleSendAction(data, penguin)
	{
		const action = parseInt(data[4])

		if (isNaN(action))
		{
			return penguin.disconnect()
		}

		penguin.frame = 1

		penguin.room.sendXt("sa", -1, penguin.id, action)
	}
	/*
	 * Sends the snowball coordinates.
	 *
	 * x = int
	 * y = int
	 */
	static handleSendSnowball(data, penguin)
	{
		const x = parseInt(data[4]),
			y = parseInt(data[5])

		if (isNaN(x) || isNaN(y))
		{
			return penguin.disconnect()
		}

		penguin.room.sendXt("sb", -1, penguin.id, x, y)
	}
	/*
	 * Sends the emote of the player.
	 *
	 * emote = int
	 */
	static handleSendEmote(data, penguin)
	{
		const emote = parseInt(data[4])

		if (isNaN(emote))
		{
			return penguin.disconnect()
		}

		penguin.room.sendXt("se", -1, penguin.id, emote)
	}
	/*
	 * Sends the joke of the player.
	 *
	 * joke = int
	 */
	static handleSendJoke(data, penguin)
	{
		const joke = parseInt(data[4])

		if (isNaN(joke))
		{
			return penguin.disconnect
		}

		penguin.room.sendXt("sj", -1, penguin.id, joke)
	}
	/*
	 * Sends the safe message of the player.
	 *
	 * sfMsg = int
	 */
	static handleSendSafeMessage(data, penguin)
	{
		const sfMsg = parseInt(data[4])

		if (isNaN(sfMsg))
		{
			return penguin.disconnect()
		}

		penguin.room.sendXt("ss", -1, penguin.id, sfMsg)
	}
	/*
	 * Sends the tour guide message of the player.
	 *
	 * tour = int
	 */
	static handleSendTourGuide(data, penguin)
	{
		const tour = parseInt(data[4])

		if (isNaN(tour))
		{
			return penguin.disconnect()
		}

		penguin.room.sendXt("sg", -1, penguin.id, tour)
	}
	/*
	 * Get the player's crumbs.
	 * This uses database connection.
	 * On the catch, it means that the id doesn't exist.
	 *
	 * id = int
	 */
	static handleGetPlayer(data, penguin)
	{
		const id = parseInt(data[4])

		if (isNaN(id))
		{
			return penguin.disconnect()
		}

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
	/*
	 * Keeps the player alive.
	 */
	static handleHeartBeat(data, penguin)
	{
		penguin.sendXt("h", -1)
	}
	/*
	 * Handles the message sent by the player.
	 *
	 * message = string
	 */
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
	/*
	 * No clue what this does.
	 */
	static handleLastRevision(data, penguin)
	{
		penguin.sendXt("glr", -1, "Waddler")
	}
	/*
	 * Something with messaging, I guess?
	 *
	 * line = int
	 */
	static handleSendLine(data, penguin)
	{
		const line = parseInt(data[4])

		if (isNaN(line))
		{
			return penguin.disconnect()
		}

		penguin.sendXt("sl", -1, penguin.id, line)
	}
	/*
	 * Teleports the player, rarely used but still.
	 *
	 * x = int
	 * y = int
	 */
	static handleSendTeleport(data, penguin)
	{
		const x = parseInt(data[4]),
			y = parseInt(data[5])

		if (isNaN(x) || isNaN(y))
		{
			return penguin.disconnect()
		}

		penguin.x = x
		penguin.y = y

		penguin.sendXt("tp", -1, penguin.id, x, y)
	}
}

module.exports = Player