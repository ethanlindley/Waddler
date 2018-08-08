"use strict"

const Logger = require("../Logger")

const sp = require("./utils/sp")

class Penguin
{
	constructor(socket, server)
	{
		this.socket = socket
		this.server = server
		this.database = server.database
		this.roomHandler = server.roomHandler
	}
	/*
	 * Sets the client.
	 *
	 * penguin is SQL retrieved data, an object actually.
	 */
	setPenguin(penguin)
	{
		this.id = penguin.id
		this.username = penguin.username

		this.age = sp.dateToInt() - penguin.registrationdate

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
	/*
	 * Builds the player string.
	 *
	 * Before the player string is built, we check if the player has been set.
	 */
	buildPlayerString()
	{
		if (!this.id || !this.username) return this.sendError(800, true)
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
	/*
	 * Writes a raw packet to the socket.
	 *
	 * The socket is checked as well before writing to it.
	 */
	sendRaw(data)
	{
		if (this.socket && this.socket.writable)
		{
			Logger.info(`OUTGOING: ${data}`)
			this.socket.write(data + "\0")
		}
	}
	/*
	 * Joins the XT packet and writes it.
	 */
	sendXt()
	{
		this.sendRaw(`%xt%${Array.prototype.join.call(arguments, "%")}%`)
	}
	/*
	 * Writes an array of packets (XT/raw).
	 */
	sendArray(arr)
	{
		for (const i in arr)
		{
			this.sendRaw(arr[i])
		}
	}
	/*
	 * Writes an error given by the error code.
	 */
	sendError(err, disconnect)
	{
		this.sendXt("e", -1, err)
		if (disconnect) this.disconnect()
	}
	/*
	 * Disconnect a client.
	 */
	disconnect()
	{
		this.server.removePenguin(this)
	}
	/*
	 * Update a column in the database.
	 */
	updateColumn(column, value)
	{
		this.database.updateColumn(this.id, column, value).catch((err) =>
		{
			Logger.error(err)
		})
	}
}

module.exports = Penguin