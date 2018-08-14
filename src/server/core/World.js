"use strict"

const Logger = require("../Logger")
const sp = require("./utils/sp")

const Clothing = require("./handlers/Clothing")
const Navigation = require("./handlers/Navigation")
const Player = require("./handlers/Player")

const Toy = require("./handlers/Toy")
const Igloo = require("./handlers/Igloo")
const Moderation = require("./handlers/Moderation")

const Pet = require("./handlers/Pet")
const Multiplayer = require("./handlers/Multiplayer")

const xtHandlers = {
	"s": {
		"s#upc": {
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#uph": {
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upf": {
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upn": {
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upb": {
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upa": {
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upe": {
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upl": {
			func: "handleUpdateClothing",
			file: Clothing
		},
		"s#upp": {
			func: "handleUpdateClothing",
			file: Clothing
		},
		"i#ai": {
			func: "handleAddItem",
			file: Clothing,
			timeout: 1
		},
		"i#gi": {
			func: "handleGetInventory",
			file: Clothing
		},
		"j#js": {
			func: "handleJoinServer",
			file: Navigation
		},
		"j#jr": {
			func: "handleJoinRoom",
			file: Navigation
		},
		"j#jp": {
			func: "handleJoinPlayer",
			file: Navigation
		},
		"j#grs": {
			func: "handleRefreshRoom",
			file: Navigation
		},
		"u#sp": {
			func: "handleSendPosition",
			file: Player
		},
		"u#sf": {
			func: "handleSendFrame",
			file: Player
		},
		"u#sa": {
			func: "handleSendAction",
			file: Player
		},
		"u#sb": {
			func: "handleSendSnowball",
			file: Player
		},
		"u#se": {
			func: "handleSendEmote",
			file: Player
		},
		"u#sj": {
			func: "handleSendJoke",
			file: Player
		},
		"u#ss": {
			func: "handleSendSafeMessage",
			file: Player
		},
		"u#sg": {
			func: "handleSendTourGuide",
			file: Player
		},
		"u#sma": {
			func: "handleSendMascotMessage",
			file: Player
		},
		"u#gp": {
			func: "handleGetPlayer",
			file: Player
		},
		"u#h": {
			func: "handleHeartBeat",
			file: Player
		},
		"u#glr": {
			func: "handleLastRevision",
			file: Player
		},
		"u#sl": {
			func: "handleSendLine",
			file: Player
		},
		"m#sm": {
			func: "handleSendMessage",
			file: Player,
			timeout: 0.5
		},
		"r#cdu": {
			func: "handleMineCoins",
			file: Player
		},
		"e#dc": {
			func: "handleDonateCoins",
			file: Player
		},
		"t#at": {
			func: "handleOpenPlayerBook",
			file: Toy
		},
		"t#rt": {
			func: "handleClosePlayerBook",
			file: Toy
		},
		"g#af": {
			func: "handleIglooFurniture",
			file: Igloo
		},
		"g#gf": {
			func: "handleGetFurniture",
			file: Igloo
		},
		"g#gm": {
			func: "handleGetActiveIgloo",
			file: Igloo
		},
		"g#gr": {
			func: "handleLoadPlayerIglooList",
			file: Igloo
		},
		"g#go": {
			func: "handleGetIgloos",
			file: Igloo
		},
		"g#ur": {
			func: "handleSaveFurniture",
			file: Igloo
		},
		"g#um": {
			func: "handleUpdateMusic",
			file: Igloo
		},
		"g#or": {
			func: "handleOpenIgloo",
			file: Igloo
		},
		"g#cr": {
			func: "handleCloseIgloo",
			file: Igloo
		},
		"g#au": {
			func: "handleBuyIgloo",
			file: Igloo
		},
		"g#ao": {
			func: "handleUpdateIgloo",
			file: Igloo
		},
		"g#ag": {
			func: "handleUpdateIglooFloor",
			file: Igloo
		},
		"o#b": {
			func: "handleBan",
			file: Moderation
		},
		"o#k": {
			func: "handleKick",
			file: Moderation
		},
		"o#m": {
			func: "handleMute",
			file: Moderation
		},
		"p#pg": {
			func: "handleGetPufflesByPlayerId",
			file: Pet
		},
		"a#gt": {
			func: "handleMultiplayerData",
			file: Multiplayer
		},
		"a#jt": {
			func: "handleMultiplayerData",
			file: Multiplayer
		},
		"a#lt": {
			func: "handleMultiplayerData",
			file: Multiplayer
		}
	},
	"z": {
		"m": {
			func: "handleMovePuck",
			file: Multiplayer
		},
		"gz": {
			func: "handleMultiplayerData",
			file: Multiplayer
		},
		"zo": {
			func: "handleGameOver",
			file: Multiplayer
		},
		"jz": {
			func: "handleMultiplayerData",
			file: Multiplayer
		},
		"zm": {
			func: "handleMultiplayerData",
			file: Multiplayer
		}
	}
}

class World {
	constructor(server) {
		this.server = server
		this.database = server.database
	}

	handleGameData(data, penguin) {
		const packet = data

		data = data.split("%")
		data.shift()

		if (data[0] != "xt") return penguin.disconnect()

		const type = data[1],
			handler = data[2]

		const method = xtHandlers[type][handler]

		if (!method) return Logger.unknown(packet)

		const func = method["func"],
			file = method["file"],
			timeout = method["timeout"]

		if (typeof file[func] == "function") {
			Logger.incoming(packet)

			if (timeout != undefined) {
				if (!penguin.throttled) penguin.throttled = {}

				if (penguin.throttled[handler] && (sp.getTime() < penguin.throttled[handler])) {
					delete penguin.throttled
					return penguin.sendError(1, true)
				}

				penguin.throttled[handler] = (sp.getTime() + timeout)
			}

			file[func](data, penguin)
		} else {
			Logger.error(`Unexisting packet "${packet}" passed through error checking`)
		}
	}
}

module.exports = World