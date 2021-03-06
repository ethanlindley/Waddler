"use strict"

const sp = require("../utils/sp")

class Navigation {
	static handleJoinServer(data, penguin) {
		const randomRoom = sp.getRandomRoom()
		const x = sp.getRandomPosition()
		const y = sp.getRandomPosition()

		if (!penguin.loggedIn) return penguin.disconnect()

		penguin.sendXt("js", -1, 1, 0, Number(penguin.moderator), 1)
		require("./Stamps").handleGetStamps(data, penguin)
		penguin.sendXt("lp", -1, penguin.buildPlayerString(), penguin.coins, 0, 1440, sp.getTime(), penguin.age, 4, 1)

		this.handleJoinRoom({
			3: "j#jr",
			4: randomRoom,
			5: x,
			6: y
		}, penguin)
	}

	static handleJoinRoom(data, penguin) {
		const room = parseInt(data[4])

		let x = parseInt(data[5]),
			y = parseInt(data[6])

		if (!x || isNaN(x)) x = sp.getRandomPosition()
		if (!y || isNaN(y)) y = sp.getRandomPosition()
		if (!room || isNaN(room)) room = sp.getRandomRoom()

		if (penguin.room) penguin.room.removePenguin(penguin)
		if (room > 900) {
			penguin.gameRoomId = room
			return penguin.sendXt("jg", -1, room)
		}

		const roomObj = penguin.server.roomManager.getRoom(room)

		if (roomObj) {
			roomObj.addPenguin(penguin, [x, y])
			if (penguin.server.pluginLoader.getPlugin("Bot")) {
				penguin.sendXt("ap", -1, penguin.server.pluginLoader.getPlugin("Bot").generateBotString())
			}
		} else {
			penguin.sendError(210)
		}
	}

	static handleJoinPlayer(data, penguin) {
		let room = parseInt(data[4])

		let x = parseInt(data[5]),
			y = parseInt(data[6])

		if (!x || isNaN(x)) x = 0
		if (!y || isNaN(y)) y = 0
		if (!room || isNaN(room)) room = sp.getRandomRoom()

		if (penguin.room) penguin.room.removePenguin(penguin)
		if (room < 1000) room += 1000
		if (penguin.server.roomManager.getRoom(room) == false) penguin.server.roomManager.createRoom(room)

		const roomObj = penguin.server.roomManager.getRoom(room)

		if (roomObj) {
			roomObj.addPenguin(penguin, [x, y])
		} else {
			penguin.sendError(210)
		}
	}

	static handleRefreshRoom(data, penguin) {
		penguin.sendXt("grs", -1, penguin.id, penguin.room.buildRoomString())
	}
}

module.exports = Navigation