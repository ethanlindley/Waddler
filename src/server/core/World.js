"use strict"

const Logger = require("../Logger")

const Clothing = require("./handlers/Clothing")
const Navigation = require("./handlers/Navigation")
const Player = require("./handlers/Player")
const Toy = require("./handlers/Toy")
const Multiplayer = require("./handlers/Multiplayer")

const xtHandlers = {
	"s":
	{
		"s#upc":
		{
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#uph":
		{
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upf":
		{
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upn":
		{
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upb":
		{
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upa":
		{
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upe":
		{
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upl":
		{
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upp":
		{
			func: "handleUpdateClothing",
			file: Clothing
		},
		"i#ai":
		{
			func: "handleAddItem",
			file: Clothing
		},
		"i#gi":
		{
			func: "handleGetInventory",
			file: Clothing
		},
		"j#js":
		{
			func: "handleJoinServer",
			file: Navigation
		},
		"j#jr":
		{
			func: "handleJoinRoom",
			file: Navigation
		},
		"j#jp":
		{
			func: "handleJoinPlayer",
			file: Navigation
		},
		"u#sp":
		{
			func: "handleSendPosition",
			file: Player
		},
		"u#sf":
		{
			func: "handleSendFrame",
			file: Player
		},
		"u#sa":
		{
			func: "handleSendAction",
			file: Player
		},
		"u#sb":
		{
			func: "handleSendSnowball",
			file: Player
		},
		"u#se":
		{
			func: "handleSendEmote",
			file: Player
		},
		"u#sj":
		{
			func: "handleSendJoke",
			file: Player
		},
		"u#ss":
		{
			func: "handleSendSafeMessage",
			file: Player
		},
		"u#sg":
		{
			func: "handleSendTourGuide",
			file: Player
		},
		"u#gp":
		{
			func: "handleGetPlayer",
			file: Player
		},
		"u#h":
		{
			func: "handleHeartBeat",
			file: Player
		},
		"u#glr":
		{
			func: "handleLastRevision",
			file: Player
		},
		"u#sl":
		{
			func: "handleSendLine",
			file: Player
		},
		"m#sm":
		{
			func: "handleSendMessage",
			file: Player
		},
		"t#at":
		{
			func: "handleOpenPlayerBook",
			file: Toy
		},
		"t#rt":
		{
			func: "handleClosePlayerBook",
			file: Toy
		}
	},
	"z":
	{
		"m":
		{
			func: "handleMovePuck",
			file: Multiplayer
		},
		"gz":
		{
			func: "handleGetGame",
			file: Multiplayer
		}
	}
}

class World
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

		if (data[0] != "xt") return penguin.disconnect()

		const type = data[1],
			handler = data[2]

		if (handler.split("#")[1].substr(0, 3) == "epf" || handler.substr(0, 3) == "iCP") return

		const method = xtHandlers[type][handler]

		if (!method) return Logger.unknown(packet)

		const func = method["func"],
			file = method["file"]

		if (typeof file[func] == "function")
		{
			Logger.incoming(packet)

			file[func](data, penguin)
		}
		else
		{
			Logger.error(`Unexisting packet "${packet}" passed through error checking`)
		}
	}
}

module.exports = World