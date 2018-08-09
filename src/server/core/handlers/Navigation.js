"use strict"

class Navigation
{
	/*
	 * Handles players joining the server.
	 */
	static handleJoinServer(data, penguin)
	{
		const randomRoom = [100, 110, 300, 400][Math.floor(Math.random() * 4)]

		penguin.sendXt("js", -1, 0, 1, penguin.moderator ? 1 : 0)
		penguin.sendXt("gps", -1, "")
		penguin.sendXt("lp", -1, penguin.buildPlayerString(), penguin.coins, 0, 1440, Math.floor(new Date() / 1000), penguin.age, 4, 1)

		this.handleJoinRoom(
		{
			3: "j#jr",
			4: randomRoom,
			5: 0,
			6: 0
		}, penguin)
	}
	/*
	 * Handles players joining a room.
	 * The difference here is that this is sent on handleJoinServer.
	 * Also we check if the player is joining a game room based on the room they want to join.
	 */
	static handleJoinRoom(data, penguin)
	{
		const room = parseInt(data[4])

		let x = parseInt(data[5]),
			y = parseInt(data[6])

		if (!x || isNaN(x)) x = 0
		if (!y || isNaN(y)) y = 0

		if (penguin.room) penguin.room.removePenguin(penguin)
		if (room > 900) return penguin.sendXt("jg", -1, room)

		const roomObj = penguin.server.roomManager.getRoom(room)

		if (roomObj)
		{
			roomObj.addPenguin(penguin, [x, y])
		}
		else
		{
			penguin.sendError(210)
		}
	}
	/*
	 * Handles players joining a room.
	 */
	static handleJoinPlayer(data, penguin)
	{
		let room = parseInt(data[4])

		let x = parseInt(data[5]),
			y = parseInt(data[6])

		if (!x || isNaN(x)) x = 0
		if (!y || isNaN(y)) y = 0

		if (penguin.room) penguin.room.removePenguin(penguin)
		if (room < 1000) room += 1000
		if (penguin.server.roomManager.getRoom(room) == false) penguin.server.roomManager.createRoom(room)

		const roomObj = penguin.server.roomManager.getRoom(room)

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