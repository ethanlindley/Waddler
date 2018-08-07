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

	handleLogin(data, penguin)
	{

		const username = data.split("CDATA[")[1].split("]]></nick>")[0]
		const password = data.split("CDATA[")[2].split("]]></pword>")[0]

		this.database.getPlayer(username).then((result) =>
		{

		}).catch(() =>
		{
			return penguin.sendError(100, true)
		})
	}

	handleData(data, penguin)
	{
		if (data.charAt(0) == "<" && data.charAt(data.length - 1) == ">")
		{
			Logger.info(`INCOMING: ${data}`)

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
		else
		{
			return penguin.disconnect()
		}
	}
}

module.exports = DataHandler