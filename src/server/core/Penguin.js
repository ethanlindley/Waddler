"use strict"

const Logger = require("../Logger")

class Penguin
{
	constructor(socket, server)
	{
		this.socket = socket
		this.server = server
		this.ipAddr = socket.remoteAddress.split(":").pop()
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
}

module.exports = Penguin