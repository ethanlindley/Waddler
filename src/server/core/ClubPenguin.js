"use strict"

const Logger = require("../Logger")

const Multiplayer = require("./handlers/Multiplayer")
const Clothing = require("./handlers/Clothing")
const Navigation = require("./handlers/Navigation")
const Player = require("./handlers/Player")
const Toy = require("./handlers/Toy")

const bannedHandlers = ["f#epfga", "f#epfsa", "f#epfgr", "f#epfgf", "f#epfai"]

const xtHandlers = {
	"s":
	{
		"s#upc": "handleUpdateClothing",
		"s#uph": "handleUpdateClothing",
		"s#upf": "handleUpdateClothing",
		"s#upn": "handleUpdateClothing",
		"s#upb": "handleUpdateClothing",
		"s#upa": "handleUpdateClothing",
		"s#upe": "handleUpdateClothing",
		"s#upl": "handleUpdateClothing",
		"s#upp": "handleUpdateClothing",
		"i#ai": "handleAddItem",
		"i#gi": "handleGetInventory",

		"j#js": "handleJoinServer",
		"j#jr": "handleJoinRoom",
		"j#jp": "handleJoinPlayer",

		"u#sp": "handleSendPosition",
		"u#sf": "handleSendFrame",
		"u#sa": "handleSendAction",
		"u#sb": "handleSendSnowball",
		"u#se": "handleSendEmote",
		"u#sj": "handleSendJoke",
		"u#ss": "handleSendSafeMessage",
		"u#sg": "handleSendTourGuide",
		"u#gp": "handleGetPlayer",
		"u#h": "handleHeartBeat",
		"m#sm": "handleSendMessage",
		"u#glr": "handleLastRevision",
		"u#sl": "handleSendLine",
		"u#tp": "handleSendTeleport",

		"t#at": "handleOpenPlayerBook",
		"t#rt": "handleClosePlayerBook"
	},
	"z":
	{
		"m": "handleMovePuck"
	}
}

class ClubPenguin
{
	constructor(server)
	{
		this.server = server
		this.database = server.database
	}

	handleGameData(data, penguin)
	{
		const packet = data

		data = data.split("%")
		data.shift()

		const type = data[1],
			handler = data[2]
		const method = xtHandlers[type][handler]

		if (typeof this[method] == "function")
		{
			Logger.incoming(packet)

			this[method](data, penguin)
		}
		else
		{
			if (bannedHandlers.includes(handler)) return
			Logger.error(`Unknown handler: ${handler}`)
		}
	}
	/*
	 * Multiplayer.js
	 */
	handleMovePuck(data, penguin)
	{
		Multiplayer.handleMovePuck(data, penguin)
	}
	/*
	 * Clothing.js
	 */
	handleUpdateClothing(data, penguin)
	{
		Clothing.handleUpdateClothing(data, penguin)
	}
	handleAddItem(data, penguin)
	{
		Clothing.handleAddItem(data, penguin)
	}
	handleGetInventory(data, penguin)
	{
		Clothing.handleGetInventory(data, penguin)
	}
	/*
	 * Navigation.js
	 */
	handleJoinServer(data, penguin)
	{
		Navigation.handleJoinServer(data, penguin)
	}
	handleJoinRoom(data, penguin)
	{
		Navigation.handleJoinRoom(data, penguin)
	}
	handleJoinPlayer(data, penguin)
	{
		Navigation.handleJoinPlayer(data, penguin)
	}
	/*
	 * Player.js
	 */
	handleSendPosition(data, penguin)
	{
		Player.handleSendPosition(data, penguin)
	}
	handleSendFrame(data, penguin)
	{
		Player.handleSendFrame(data, penguin)
	}
	handleSendAction(data, penguin)
	{
		Player.handleSendAction(data, penguin)
	}
	handleSendSnowball(data, penguin)
	{
		Player.handleSendSnowball(data, penguin)
	}
	handleSendEmote(data, penguin)
	{
		Player.handleSendEmote(data, penguin)
	}
	handleSendJoke(data, penguin)
	{
		Player.handleSendJoke(data, penguin)
	}
	handleSendSafeMessage(data, penguin)
	{
		Player.handleSendSafeMessage(data, penguin)
	}
	handleSendTourGuide(data, penguin)
	{
		Player.handleSendTourGuide(data, penguin)
	}
	handleGetPlayer(data, penguin)
	{
		Player.handleGetPlayer(data, penguin)
	}
	handleHeartBeat(data, penguin)
	{
		Player.handleHeartBeat(data, penguin)
	}
	handleSendMessage(data, penguin)
	{
		Player.handleSendMessage(data, penguin)
	}
	handleLastRevision(data, penguin)
	{
		Player.handleLastRevision(data, penguin)
	}
	handleSendLine(data, penguin)
	{
		Player.handleSendLine(data, penguin)
	}
	handleSendTeleport(data, penguin)
	{
		Player.handleSendTeleport(data, penguin)
	}
	/*
	 * Toy.js
	 */
	handleOpenPlayerBook(data, penguin)
	{
		Toy.handleOpenPlayerBook(data, penguin)
	}
	handleClosePlayerBook(data, penguin)
	{
		Toy.handleClosePlayerBook(data, penguin)
	}
}

module.exports = ClubPenguin