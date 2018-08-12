"use strict"

const Logger = require("../Logger")
const sp = require("./utils/sp")

const Clothing = require("./handlers/Clothing")
const Navigation = require("./handlers/Navigation")
const Player = require("./handlers/Player")
const Toy = require("./handlers/Toy")
const Igloo = require("./handlers/Igloo")
const EPF = require("./handlers/EPF")
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
		"u#sp": {
			func: "handleSendPosition",
			file: Player,
			timeout: 0.1
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
			file: Player
		},
		"r#cdu": {
			func: "handleMineCoins",
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
		"g#gr": {
			func: "handleLoadPlayerIglooList",
			file: Igloo
		},
		"g#go": {
			func: "handlegetIgloos",
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
		"f#epfgr": {
			func: "handleGetEPFPoints",
			file: EPF
		},
		"f#epfgf": {
			func: "handleGetEPFPoints",
			file: EPF
		},
		"f#epfgm": {
			func: "handleGetCOMMessages",
			file: EPF
		},
		"f#epfga": {
			func: "handleEPFGetAgent",
			file: EPF
		},
		"f#epfsf": {
			func: "handleSetFieldOpPoints",
			file: EPF
		},
		"f#epfsa": {
			func: "handleEPFSetAgent",
			file: EPF
		},
		"f#epfai": {
			func: "handleAddEPFItem",
			file: EPF
		}
	},
	"z": {
		"m": {
			func: "handleMovePuck",
			file: Multiplayer
		},
		"gz": {
			func: "handleGetGame",
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

		if (data[0] != "xt") return penguin.sendError(800, true)

		const type = data[1],
			handler = data[2]

		if (handler.substr(0, 3) == "iCP") return

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
					Logger.warn("Kicked packet spammer")

					delete penguin.throttled

					return penguin.sendError(800, true)
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