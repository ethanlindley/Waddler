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
		"s":
		{
			"upc":
			{
				func: "handleUpdateClothing",
				file: Clothing
			},
			"uph":
			{
				func: "handleUpdateClothing",
				file: Clothing
			},
			"upf":
			{
				func: "handleUpdateClothing",
				file: Clothing
			},
			"upn":
			{
				func: "handleUpdateClothing",
				file: Clothing
			},
			"upb":
			{
				func: "handleUpdateClothing",
				file: Clothing
			},
			"upa":
			{
				func: "handleUpdateClothing",
				file: Clothing
			},
			"upe":
			{
				func: "handleUpdateClothing",
				file: Clothing
			},
			"upl":
			{
				func: "handleUpdateClothing",
				file: Clothing
			},
			"upp":
			{
				func: "handleUpdateClothing",
				file: Clothing
			}
		},
		"i":
		{
			"ai":
			{
				func: "handleAddItem",
				file: Clothing
			},
			"gi":
			{
				func: "handleGetInventory",
				file: Clothing
			}
		},
		"j":
		{
			"js":
			{
				func: "handleJoinServer",
				file: Navigation
			},
			"jr":
			{
				func: "handleJoinRoom",
				file: Navigation
			},
			"jp":
			{
				func: "handleJoinPlayer",
				file: Navigation
			}
		},
		"u":
		{
			"sp":
			{
				func: "handleSendPosition",
				file: Player
			},
			"sf":
			{
				func: "handleSendFrame",
				file: Player
			},
			"sa":
			{
				func: "handleSendAction",
				file: Player
			},
			"sb":
			{
				func: "handleSendSnowball",
				file: Player
			},
			"se":
			{
				func: "handleSendEmote",
				file: Player
			},
			"sj":
			{
				func: "handleSendJoke",
				file: Player
			},
			"ss":
			{
				func: "handleSendSafeMessage",
				file: Player
			},
			"sg":
			{
				func: "handleSendTourGuide",
				file: Player
			},
			"gp":
			{
				func: "handleGetPlayer",
				file: Player
			},
			"h":
			{
				func: "handleHeartBeat",
				file: Player
			},
			"glr":
			{
				func: "handleLastRevision",
				file: Player
			},
			"sl":
			{
				func: "handleSendLine",
				file: Player
			}
		},
		"m":
		{
			"sm":
			{
				func: "handleSendMessage",
				file: Player
			}
		},
		"t":
		{
			"at":
			{
				func: "handleOpenPlayerBook",
				file: Toy
			},
			"rt":
			{
				func: "handleClosePlayerBook",
				file: Toy
			}
		}
	},
	"z":
	{
		"m":
		{
			func: "handleMovePuck",
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
			group = data[2].split("#")[0],
			handler = data[2].split("#")[1]

		if (type == "s" && xtHandlers[type][group] == undefined || type == "z" && xtHandlers[type][data[2]] == undefined)
		{
			return Logger.unknown(`Unknown packet: ${packet}`)
		}

		const method = type == "s" ? xtHandlers[type][group][handler] : xtHandlers[type][data[2]]

		const func = method["func"],
			file = method["file"]

		Logger.incoming(packet)

		file[func](data, penguin)
	}
}

module.exports = World