"use strict"

const Logger = require("../Logger")

const GameDataEncryptor = require("./utils/GameDataEncryptor")

class DataHandler {
	constructor(server) {
		this.server = server
		this.database = server.database
		this.failedLogins = {}
	}

	handleLogin(data, penguin) {
		const username = data.split("CDATA[")[1].split("]]></nick>")[0]
		const password = data.split("CDATA[")[2].split("]]></pword>")[0]

		this.database.getPlayer(username).then((result) => {
			if (result.banned >= 1) return penguin.sendError(603, true)

			if (this.server.type == "login") {
				if (this.failedLogins[penguin.ipAddr] == undefined) this.failedLogins[penguin.ipAddr] = []
				if (this.failedLogins[penguin.ipAddr].length > 7) return penguin.sendError(150, true)

				const hash = GameDataEncryptor.hashPassword(GameDataEncryptor.decryptZaseth(password, penguin.randomKey))
				if (result.password == hash && this.failedLogins[penguin.ipAddr].length < 7) {
					delete this.failedLogins[penguin.ipAddr]

					penguin.loginKey = GameDataEncryptor.generateRandomKey(12)
					this.database.updateColumn(username, "loginKey", penguin.loginKey)

					penguin.sendXt("sd", -1, "100|Snowy Lands|127.0.0.1|6113")
					penguin.sendXt("l", -1, penguin.id, penguin.loginKey, "", `100,${this.server.getServerBars()}`)
				} else {
					this.failedLogins[penguin.ipAddr].push(1)

					return penguin.sendError(101, true)
				}
			} else {
				const penguinObj = this.server.getPenguinById(result.ID)

				if (penguinObj) return penguinObj.disconnect()

				const hash = GameDataEncryptor.hashPassword(GameDataEncryptor.decryptZaseth(password, result.loginKey))
				if (result.password == hash) {
					penguin.sendXt("l", -1)
					penguin.setPenguin(result)
				} else {
					return penguin.sendError(101, true)
				}
			}
		}).catch(() => {
			return penguin.sendError(100, true)
		})
	}

	handleData(data, penguin) {
		if (data.startsWith("<") && data.endsWith(">")) {
			Logger.incoming(data)
			if (data == "<policy-file-request/>") {
				return penguin.sendRaw(`<cross-domain-policy><allow-access-from domain="*" to-ports="*"/></cross-domain-policy>`)
			} else {
				const type = data.split("action='")[1].split("'")[0]
				if (type == "verChk") {
					return penguin.sendRaw(`<msg t="sys"><body action="apiOK" r="0"></body></msg>`)
				} else if (type == "rndK") {
					penguin.randomKey = GameDataEncryptor.generateRandomKey(12)
					return penguin.sendRaw(`<msg t="sys"><body action="rndK" r="-1"><k>${penguin.randomKey}</k></body></msg>`)
				} else if (type == "login") {
					return this.handleLogin(data, penguin)
				} else {
					return penguin.disconnect()
				}
			}
		} else if (data.startsWith("%") && data.endsWith("%")) {
			return this.server.gameHandler.handleGameData(data, penguin)
		} else {
			return penguin.disconnect()
		}
	}
}

module.exports = DataHandler