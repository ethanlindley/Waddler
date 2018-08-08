"use strict"

const Logger = require("../Logger")

class Penguin
{
	constructor(socket, server)
	{
		this.socket = socket
		this.server = server
		this.database = server.database
		this.roomHandler = server.roomHandler
	}

	setPenguin(penguin)
	{
		this.id = penguin.id
		this.username = penguin.username

		this.coins = penguin.coins

		this.color = penguin.color
		this.head = penguin.head
		this.face = penguin.face
		this.neck = penguin.neck
		this.body = penguin.body
		this.hand = penguin.hand
		this.feet = penguin.feet
		this.pin = penguin.pin
		this.photo = penguin.photo

		this.rank = penguin.rank
		this.moderator = (penguin.moderator >= 1)

		this.x = 0
		this.y = 0
		this.frame = 1
	}

	buildPlayerString()
	{
		const playerArr = [
			this.id,
			this.username,
			45,
			this.color,
			this.head,
			this.face,
			this.neck,
			this.body,
			this.hand,
			this.feet,
			this.pin,
			this.photo,
			this.x,
			this.y,
			this.frame,
			1,
			this.rank * 146
		]
		return playerArr.join("|")
	}

	sendRaw(data)
	{
		if (this.socket && this.socket.writable)
		{
			Logger.info(`OUTGOING: ${data}`)
			this.socket.write(data + "\0")
		}
	}

	sendXt()
	{
		this.sendRaw(`%xt%${Array.prototype.join.call(arguments, "%")}%`)
	}

	sendError(err, disconnect)
	{
		this.sendXt("e", -1, err)
		if (disconnect) this.disconnect()
	}

	disconnect()
	{
		this.server.removePenguin(this)
	}

	updateColumn(column, value)
	{
		this.database.updateColumn(this.id, column, value).catch((err) =>
		{
			Logger.error(err)
		})
	}
}

module.exports = Penguin