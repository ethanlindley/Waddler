"use strict"

const Logger = require("../Logger")

const Navigation = require("./handlers/Navigation")

const xtHandlers = {
	"s":
	{
		"j#js": "handleJoinServer",
		"j#jr": "handleJoinRoom",
		"j#jp": "handleJoinPlayer"
	}
}

class ClubPenguin
{
	constructor(server)
	{
		this.server = server
		this.database = server.database
	}
	/*
	 * Handles the game data.
	 * The incoming XT packet is parsed.
	 * After it's parsed, the right handler is signed to it.
	 */
	handleGameData(data, penguin)
	{
		data = data.split("%")
		data.shift()

		const type = data[1],
			handler = data[2]
		const method = xtHandlers[type][handler]

		if (typeof this[method] == "function")
		{
			this[method](data, penguin)
		}
		else
		{
			Logger.error(`Unknown handler: ${handler}`)
		}
	}
	/*
	 * Navigation.js
	 */
	handleJoinServer(data, penguin)
	{
		Navigation.handleJoinServer(data, penguin, this.server)
	}
	handleJoinRoom(data, penguin)
	{
		Navigation.handleJoinRoom(data, penguin, this.server)
	}
	handleJoinPlayer(data, penguin)
	{
		Navigation.handleJoinPlayer(data, penguin, this.server)
	}
}

module.exports = ClubPenguin