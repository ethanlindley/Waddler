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

		this.getInventory()
	}
	/*
	 * Builds the player string.
	 *
	 * Before the player string is built, we check if the player has been set.
	 */
	buildPlayerString()
	{
		if (!this.id || !this.username) return this.disconnect()

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
	 * Gets the inventory from the player.
	 */
	getInventory()
	{
		let inventory = []

		this.getColumn("itemid", "inventory").then((result) =>
		{
			if (result.length > 0)
			{
				result.forEach(row =>
				{
					inventory.push(row.itemid)
				})

				this.inventory = inventory
			}
			else
			{
				Logger.cheat(`${this.username} has an empty inventory`)

				this.disconnect()
			}
		}).catch((err) =>
		{
			Logger.error(err)
		})
	}
	/*
	 * Updates the clothing for the player.
	 */
	updateClothing(type, item)
	{
		this[type] = item
		this.updateColumn(type, item)
	}
	/*
	 * Adds coins.
	 */
	addCoins(coins)
	{
		this.coins += coins

		if (coins > 9999 && !this.moderator)
		{
			Logger.cheat(`${this.username} tried to add a large amount of coins`)

			return this.disconnect()
		}

		this.updateColumn("coins", this.coins)
	}
	/*
	 * Removes coins.
	 */
	removeCoins(coins)
	{
		this.coins -= coins

		this.updateColumn("coins", this.coins)
	}
	/*
	 * Adds an item.
	 */
	addItem(item)
	{
		if (sp.getPatchedItems().includes(item) && !this.moderator)
		{
			Logger.cheat(`${this.username} tried to add a patched item`)

			return this.sendError(410)
		}

		if (!this.inventory.includes(item))
		{
			this.inventory.push(item)

			this.database.insertItem(this.id, item)

			this.sendXt("ai", -1, item, this.coins)
		}
		else
		{
			this.sendError(400)
		}
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
			Logger.outgoing(data)
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
	 * Writes an error given by the error code.
	 */
	sendError(err, disconnect)
	{
		this.sendXt("e", -1, err)
		if (disconnect)
		{
			this.disconnect()
		}
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
	updateColumn(column, value, table = null)
	{
		this.database.updateColumn(this.id, column, value, table).catch((err) =>
		{
			Logger.error(err)
		})
	}
	/*
	 * Gets the column from the database.
	 */
	getColumn(column, table = null)
	{
		return this.database.getColumn(this.id, column, table)
	}
}

module.exports = Penguin