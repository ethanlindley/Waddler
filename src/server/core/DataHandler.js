"use strict"

const Logger = require("../Logger")

const GameDataEncryptor = require("./utils/GameDataEncryptor")

class DataHandler
{
	constructor(server)
	{
		this.server = server
		this.database = server.database

		this.failedLogins = {}
	}

	handleLogin(data, penguin)
	{
		const username = data.split("CDATA[")[1].split("]]></nick>")[0]
		const password = data.split("CDATA[")[2].split("]]></pword>")[0]

		if (password.length == 0) return penguin.sendError(130, true)
		if (username.length == 0) return penguin.sendError(140, true)

		if (password.length > 32) return penguin.sendError(132, true)
		if (username.length > 12) return penguin.sendError(142, true)

		if (password.length < 4) return penguin.sendError(131, true)
		if (username.length < 3) return penguin.sendError(141, true)

		this.database.getPlayer(username).then((result) =>
		{
			if (result.banned >= 1)
			{
				Logger.warn(`${username} tried to login but is banned`)
				return penguin.sendError(603, true)
			}

			if (this.server.type == "login")
			{
				if (this.failedLogins[penguin.ipAddr] == undefined) this.failedLogins[penguin.ipAddr] = []
				if (this.failedLogins[penguin.ipAddr].length >= 7) return penguin.sendError(150, true)

				const hash = GameDataEncryptor.hashPassword(GameDataEncryptor.decryptZaseth(password, penguin.randomKey))

				if (result.password == hash && this.failedLogins[penguin.ipAddr].length < 7)
				{
					delete this.failedLogins[penguin.ipAddr]

					penguin.loginKey = GameDataEncryptor.generateRandomKey(12)

					this.database.updateColumn(username, "loginkey", penguin.loginKey)

					penguin.sendXt("sd", -1, "100|Snowy Lands|127.0.0.1|6113")
					penguin.sendXt("l", -1, penguin.id, penguin.loginKey, "", "100,1")
				}
				else
				{
					this.failedLogins[penguin.ipAddr].push(1)

					return penguin.sendError(101, true)
				}
			}
			else
			{
				const hash = GameDataEncryptor.hashPassword(GameDataEncryptor.decryptZaseth(password, result.loginkey))

				const penguinObj = this.server.getPenguin(result.id)

				if (penguinObj) return penguinObj.disconnect()

				if (result.password == hash)
				{
					penguin.sendXt("l", -1)
					penguin.setPenguin(result)
				}
				else
				{
					return penguin.sendError(101, true)
				}

				this.database.updateColumn(result.id, "loginkey", "")
			}
		}).catch((err) =>
		{
			return penguin.sendError(100, true)
		})
	}

	handleData(data, penguin)
	{
		if (data.charAt(0) == "<" && data.charAt(data.length - 1) == ">")
		{
			Logger.incoming(data)

			if (data == "<policy-file-request/>")
			{
				return penguin.sendRaw(`<cross-domain-policy><site-control permitted-cross-domain-policies="master-only"/><allow-access-from domain="*" to-ports="*"/></cross-domain-policy>`)
			}
			else
			{
				const type = data.split("action='")[1].split("'")[0]

				if (type == "verChk")
				{
					return penguin.sendRaw(`<msg t="sys"><body action="apiOK" r="0"></body></msg>`)
				}
				else if (type == "rndK")
				{
					penguin.randomKey = GameDataEncryptor.generateRandomKey(12)
					penguin.sendRaw(`<msg t="sys"><body action="rndK" r="-1"><k>${penguin.randomKey}</k></body></msg>`)
				}
				else if (type == "login")
				{
					return this.handleLogin(data, penguin)
				}
			}
		}
		else if (data.charAt(0) == "%" && data.charAt(data.length - 1) == "%")
		{
			Logger.incoming(data)

			return this.server.gameHandler.handleGameData(data, penguin)
		}
		else
		{
			Logger.warn(`Unknown data received: ${data}`)
			return penguin.disconnect()
		}
	}
}

module.exports = DataHandler