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

	sendArray(arr)
	{
		if (arr.constructor.name == "Array")
		{
			for (const packet in arr)
			{
				this.sendRaw(arr[packet])
			}
		}
	}

	disconnect()
	{
		this.server.removePenguin(this)
	}
}

module.exports = Penguin