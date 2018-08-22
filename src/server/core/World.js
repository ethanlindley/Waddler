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
const Ignore = require("./handlers/Ignore")
const Buddy = require("./handlers/Buddy")

const Mail = require("./handlers/Mail")
const Stamps = require("./handlers/Stamps")
const Multiplayer = require("./handlers/Multiplayer")

const xtHandlers = {
	"s": {
		"s#upc": {
			func: "handleUpdateClothing",
			file: Clothing,
			throttle: true
		},
		"s#uph": {
			func: "handleUpdateClothing",
			file: Clothing,
			throttle: false
		},
		"s#upf": {
			func: "handleUpdateClothing",
			file: Clothing,
			throttle: false
		},
		"s#upn": {
			func: "handleUpdateClothing",
			file: Clothing,
			throttle: false
		},
		"s#upb": {
			func: "handleUpdateClothing",
			file: Clothing,
			throttle: false
		},
		"s#upa": {
			func: "handleUpdateClothing",
			file: Clothing,
			throttle: false
		},
		"s#upe": {
			func: "handleUpdateClothing",
			file: Clothing,
			throttle: false
		},
		"s#upl": {
			func: "handleUpdateClothing",
			file: Clothing,
			throttle: false
		},
		"s#upp": {
			func: "handleUpdateClothing",
			file: Clothing,
			throttle: false
		},
		"i#ai": {
			func: "handleAddItem",
			file: Clothing,
			throttle: true
		},
		"i#gi": {
			func: "handleGetInventory",
			file: Clothing,
			throttle: true
		},
		"j#js": {
			func: "handleJoinServer",
			file: Navigation,
			throttle: false
		},
		"j#jr": {
			func: "handleJoinRoom",
			file: Navigation,
			throttle: true
		},
		"j#jp": {
			func: "handleJoinPlayer",
			file: Navigation,
			throttle: true
		},
		"j#grs": {
			func: "handleRefreshRoom",
			file: Navigation,
			throttle: true
		},
		"u#sp": {
			func: "handleSendPosition",
			file: Player,
			throttle: false
		},
		"u#sf": {
			func: "handleSendFrame",
			file: Player,
			throttle: false
		},
		"u#sa": {
			func: "handleSendAction",
			file: Player,
			throttle: true
		},
		"u#sb": {
			func: "handleSendSnowball",
			file: Player,
			throttle: true
		},
		"u#se": {
			func: "handleSendEmote",
			file: Player,
			throttle: true
		},
		"u#sj": {
			func: "handleSendJoke",
			file: Player,
			throttle: true
		},
		"u#ss": {
			func: "handleSendSafeMessage",
			file: Player,
			throttle: true
		},
		"u#sg": {
			func: "handleSendTourGuide",
			file: Player,
			throttle: true
		},
		"u#sma": {
			func: "handleSendMascotMessage",
			file: Player,
			throttle: false
		},
		"u#gp": {
			func: "handleGetPlayer",
			file: Player,
			throttle: true
		},
		"u#h": {
			func: "handleHeartBeat",
			file: Player,
			throttle: false
		},
		"u#glr": {
			func: "handleLastRevision",
			file: Player,
			throttle: false
		},
		"u#sl": {
			func: "handleSendLine",
			file: Player,
			throttle: true
		},
		"m#sm": {
			func: "handleSendMessage",
			file: Player,
			throttle: true
		},
		"r#cdu": {
			func: "handleMineCoins",
			file: Player,
			throttle: false
		},
		"u#sq": {
			func: "handleSendQuickMessage",
			file: Player,
			throttle: true
		},
		"t#at": {
			func: "handleOpenPlayerBook",
			file: Toy,
			throttle: true
		},
		"t#rt": {
			func: "handleClosePlayerBook",
			file: Toy,
			throttle: true
		},
		"g#af": {
			func: "handleIglooFurniture",
			file: Igloo,
			throttle: true
		},
		"g#gf": {
			func: "handleGetFurniture",
			file: Igloo,
			throttle: true
		},
		"g#gm": {
			func: "handleGetActiveIgloo",
			file: Igloo,
			throttle: true
		},
		"g#gr": {
			func: "handleLoadPlayerIglooList",
			file: Igloo,
			throttle: true
		},
		"g#go": {
			func: "handleGetIgloos",
			file: Igloo,
			throttle: true
		},
		"g#ur": {
			func: "handleSaveFurniture",
			file: Igloo,
			throttle: true
		},
		"g#um": {
			func: "handleUpdateMusic",
			file: Igloo,
			throttle: false
		},
		"g#or": {
			func: "handleOpenIgloo",
			file: Igloo,
			throttle: false
		},
		"g#cr": {
			func: "handleCloseIgloo",
			file: Igloo,
			throttle: false
		},
		"g#au": {
			func: "handleBuyIgloo",
			file: Igloo,
			throttle: true
		},
		"g#ao": {
			func: "handleUpdateIgloo",
			file: Igloo,
			throttle: true
		},
		"g#ag": {
			func: "handleUpdateIglooFloor",
			file: Igloo,
			throttle: true
		},
		"o#b": {
			func: "handleBan",
			file: Moderation,
			throttle: false
		},
		"o#k": {
			func: "handleKick",
			file: Moderation,
			throttle: false
		},
		"o#m": {
			func: "handleMute",
			file: Moderation,
			throttle: false
		},
		"p#pg": {
			func: "handleGetPufflesByPlayerId",
			file: Pet,
			throttle: true
		},
		"p#pgu": {
			func: "handleGetPuffles",
			file: Pet,
			throttle: true
		},
		"p#pr": {
			func: "handlePuffleRest",
			file: Pet,
			throttle: false
		},
		"p#pp": {
			func: "handlePufflePlay",
			file: Pet,
			throttle: false
		},
		"p#pt": {
			func: "handlePuffleTreat",
			file: Pet,
			throttle: false
		},
		"p#pf": {
			func: "handlePuffleFeed",
			file: Pet,
			throttle: false
		},
		"p#pb": {
			func: "handlePuffleBath",
			file: Pet,
			throttle: false
		},
		"p#ir": {
			func: "handlePuffleInteractionRest",
			file: Pet,
			throttle: false
		},
		"p#ip": {
			func: "handlePuffleInteractionPlay",
			file: Pet,
			throttle: false
		},
		"p#if": {
			func: "handlePuffleInteractionFeed",
			file: Pet,
			throttle: false
		},
		"p#pir": {
			func: "handlePuffleInitInteractionRest",
			file: Pet,
			throttle: false
		},
		"p#pip": {
			func: "handlePuffleInitInteractionPlay",
			file: Pet,
			throttle: false
		},
		"p#pm": {
			func: "handlePuffleMove",
			file: Pet,
			throttle: false
		},
		"p#ps": {
			func: "handlePuffleFrame",
			file: Pet,
			throttle: false
		},
		"p#pw": {
			func: "handlePuffleWalk",
			file: Pet,
			throttle: false
		},
		"p#pn": {
			func: "handleAdoptPuffle",
			file: Pet,
			throttle: true
		},
		"n#gn": {
			func: "handleGetIgnored",
			file: Ignore,
			throttle: true
		},
		"n#an": {
			func: "handleAddIgnore",
			file: Ignore,
			throttle: true
		},
		"n#rn": {
			func: "handleRemoveIgnore",
			file: Ignore,
			throttle: false
		},
		"b#gb": {
			func: "handleGetBuddies",
			file: Buddy,
			throttle: true
		},
		"b#ba": {
			func: "handleBuddyAccept",
			file: Buddy,
			throttle: false
		},
		"b#br": {
			func: "handleBuddyRequest",
			file: Buddy,
			throttle: true
		},
		"b#rb": {
			func: "handleBuddyRemove",
			file: Buddy,
			throttle: false
		},
		"b#bf": {
			func: "handleBuddyFind",
			file: Buddy,
			throttle: true
		},
		"st#gps": {
			func: "handleGetStamps",
			file: Stamps,
			throttle: true
		},
		"i#qpp": {
			func: "handleQueryPlayerPins",
			file: Stamps,
			throttle: true
		},
		"i#qpa": {
			func: "handleQueryPlayerAwards",
			file: Stamps,
			throttle: true
		},
		"st#gsbcd": {
			func: "handleGetStampBookCoverDetails",
			file: Stamps,
			throttle: false
		},
		"st#ssbcd": {
			func: "handleSetStampBookCoverDetails",
			file: Stamps,
			throttle: true
		},
		"st#gmres": {
			func: "handleGetMyRecentlyEarnedStamps",
			file: Stamps,
			throttle: false
		},
		"st#sse": {
			func: "handleAddStamp",
			file: Stamps,
			throttle: true
		},
		"a#gt": {
			func: "handleMultiplayerData",
			file: Multiplayer,
			throttle: false
		},
		"a#jt": {
			func: "handleMultiplayerData",
			file: Multiplayer,
			throttle: false
		},
		"a#lt": {
			func: "handleMultiplayerData",
			file: Multiplayer,
			throttle: false
		},
		"m#mst": {
			func: "handleStartMailEngine",
			file: Mail,
			throttle: false
		},
		"m#mg": {
			func: "handleGetMail",
			file: Mail,
			throttle: false
		},
		"m#ms": {
			func: "handleSendMail",
			file: Mail,
			throttle: false
		},
		"m#mr": {
			func: "handleReceiveMail",
			file: Mail,
			throttle: false
		},
		"m#md": {
			func: "handleDeleteMail",
			file: Mail,
			throttle: false
		},
		"m#mdp": {
			func: "handleDeleteMailFromPlayer",
			file: Mail,
			throttle: false
		},
		"m#mgd": {
			func: "handleGetMailDetails",
			file: Mail,
			throttle: false
		},
		"m#mc": {
			func: "handleCheckMail",
			file: Mail,
			throttle: false
		}
	},
	"z": {
		"m": {
			func: "handleMovePuck",
			file: Multiplayer,
			throttle: false
		},
		"gz": {
			func: "handleMultiplayerData",
			file: Multiplayer,
			throttle: false
		},
		"zo": {
			func: "handleGameOver",
			file: Multiplayer,
			throttle: true
		},
		"jz": {
			func: "handleMultiplayerData",
			file: Multiplayer,
			throttle: true
		},
		"zm": {
			func: "handleMultiplayerData",
			file: Multiplayer,
			throttle: true
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
			throttle = method["throttle"]

		if (typeof file[func] == "function") {
			Logger.incoming(packet)

			let now = new Date()
			let timestamp = (now.getTime() / 1000)

			if (throttle) {
				if (penguin.throttle[handler] == undefined || !penguin.throttle[handler]) {
					penguin.throttle[handler] = [0, timestamp]
				} else {
					penguin.throttle[handler][0]++;
					now.setMinutes(now.getMinutes() - 1)
					if (Math.round(now.getTime() / 1000) < Math.round(penguin.throttle[handler][1])) {
						if (penguin.throttle[handler][0] >= 150) {
							return penguin.sendError(800, true)
						}
					} else {
						delete penguin.throttle[handler]
					}
					if (penguin.throttle[handler] !== undefined) penguin.throttle[handler][1] = timestamp
				}
			}

			file[func](data, penguin)
		} else {
			Logger.error(`Unexisting packet "${packet}" passed through error checking`)
		}
	}
}


module.exports = World