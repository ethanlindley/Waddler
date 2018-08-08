"use strict"

class Navigation
{
	static handleJoinServer(data, penguin, server)
	{
		penguin.sendXt("js", -1, 0, 1, penguin.moderator ? 1 : 0)
		penguin.sendXt("gps", -1, "")
		penguin.sendXt("lp", -1, penguin.buildPlayerString(), penguin.coins, 0, 1440, Math.floor(new Date() / 1000), 100, 1000, 233, "", 7)
		this.handleJoinRoom(
		{
			2: "j#jr",
			3: 100
		}, penguin, server)
	}

	static handleJoinRoom(data, penguin, server)
	{
		const room = parseInt(data[3])

		let x = parseInt(data[4]),
			y = parseInt(data[5])

		if (!x || isNaN(x)) x = 0
		if (!y || isNaN(y)) y = 0

		if (penguin.room) penguin.room.removePenguin(penguin)

		if (room > 900) return penguin.sendXt("jg", -1, room)

		const roomObj = server.roomManager.getRoom(room)

		if (roomObj)
		{
			roomObj.addPenguin(penguin, [x, y])
		}
		else
		{
			penguin.sendError(210)
		}
	}

	static handleJoinPlayer(data, penguin, server)
	{
		let room = parseInt(data[3])

		let x = parseInt(data[4]),
			y = parseInt(data[5])

		if (!x || isNaN(x)) x = 0
		if (!y || isNaN(y)) y = 0

		if (penguin.room) penguin.room.removePenguin(penguin)

		if (room < 1000) room += 1000

		if (server.roomManager.getRoom(room) == false) server.roomManager.createRoom(room)

		const roomObj = server.roomManager.getRoom(room)

		if (roomObj)
		{
			roomObj.addPenguin(penguin, [x, y])
		}
		else
		{
			penguin.sendError(210)
		}
	}
}

module.exports = Navigation