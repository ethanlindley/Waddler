"use strict"

const Logger = require("../Logger")

const GameDataEncryptor = require("./utils/GameDataEncryptor")

class DataHandler
{
	constructor(server)
	{
		this.server = server
		this.database = server.database
	}
	/*
	 * Inputted password '123123' -> Custom encryption to server
	 * Server decrypts it -> '123123' gets hashed to Keccak256 and then compared.
	 *
	 * We don't use XML libraries to parse.
	 * Why? Because split works just fine.
	 * This will save some resources as well.
	 */
	handleLogin(data, penguin)
	{
		const username = data.split("CDATA[")[1].split("]]></nick>")[0]
		const password = data.split("CDATA[")[2].split("]]></pword>")[0]

		this.database.getPlayer(username).then((result) =>
		{
			if (result.banned >= 1) return penguin.sendError(603, true)

			if (this.server.type == "login")
			{
				const hash = GameDataEncryptor.hashPassword(GameDataEncryptor.decryptZaseth(password, penguin.randomKey))

				if (result.password == hash)
				{
					penguin.loginKey = GameDataEncryptor.generateRandomKey(12)

					this.database.updateColumn(username, "loginkey", penguin.loginKey)

					penguin.sendXt("sd", -1, "100|Snowy Lands|127.0.0.1|6113")
					penguin.sendXt("l", -1, penguin.id, penguin.loginKey, "", "100,1")
				}
				else
				{
					return penguin.sendError(101, true)
				}
			}
			else
			{
				const hash = GameDataEncryptor.hashPassword(GameDataEncryptor.decryptZaseth(password, result.loginkey))

				const penguinObj = this.server.getPenguin(result.id)
				if (penguinObj) penguinObj.disconnect()

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
			Logger.error(err)
			return penguin.sendError(100, true)
		})
	}
	/*
	 * We check if the incoming data starts with '<' and ends with '>'.
	 * If it doesn't start and end with that, it's a game packet.
	 * The packet is also checked if it starts with '%' and ends with '%'.
	 *
	 * Same as in handleLogin, no XML parsing libraries are used.
	 */
	handleData(data, penguin)
	{
		Logger.info(`INCOMING: ${data}`)

		if (data.charAt(0) == "<" && data.charAt(data.length - 1) == ">")
		{

			if (data == "<policy-file-request/>")
			{
				return penguin.sendRaw(`<cross-domain-policy><site-control permitted-cross-domain-policies="master-only"/><allow-access-from domain="*" to-ports="*"/></cross-domain-policy>`)
			}
			else
			{
				const type = data.split("action='")[1].split("'")[0]

				if (type == "verChk")
				{
					const version = data.split("ver v='")[1].split("'")[0]
					const room = data.split("r='")[1].split("'")[0]

					if (version == 153 && room == 0)
					{
						return penguin.sendRaw(`<msg t="sys"><body action="apiOK" r="0"></body></msg>`)
					}
					else
					{
						return penguin.disconnect()
					}
				}
				else if (type == "rndK")
				{
					const room = data.split("r='")[1].split("'")[0]

					if (room == -1)
					{
						penguin.randomKey = GameDataEncryptor.generateRandomKey(12)
						penguin.sendRaw(`<msg t="sys"><body action="rndK" r="-1"><k>${penguin.randomKey}</k></body></msg>`)
					}
					else
					{
						return penguin.disconnect()
					}
				}
				else if (type == "login")
				{
					const room = data.split("r='")[1].split("'")[0]

					if (room == 0)
					{
						return this.handleLogin(data, penguin)
					}
					else
					{
						return penguin.disconnect()
					}
				}
				else
				{
					return penguin.disconnect()
				}
			}
		}
		else if (data.charAt(0) == "%" && data.charAt(data.length - 1) == "%")
		{
			return this.server.gameHandler.handleGameData(data, penguin)
		}
	}
}

module.exports = DataHandler