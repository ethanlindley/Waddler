"use strict"

const Logger = require("../Logger")

const GameDataEncryptor = require("./utils/GameDataEncryptor")

const xmldoc = require("xmldoc")

class DataHandler
{
	constructor(server)
	{
		this.server = server
		this.database = server.database
	}

	handleLogin(data, penguin)
	{
		const xmlPacket = new xmldoc.XmlDocument(data)

		const username = xmlPacket.children[0].firstChild.firstChild.val
		const password = xmlPacket.children[0].lastChild.lastChild.val

		this.database.getPlayer(username).then((result) =>
		{

		}).catch(() =>
		{
			return penguin.sendError(100, true)
		})
	}

	handleData(data, penguin)
	{
		if (data.startsWith("<") && data.endsWith(">"))
		{
			Logger.info(`INCOMING: ${data}`)

			if (data == "<policy-file-request/>")
			{
				return penguin.sendRaw(`<cross-domain-policy><site-control permitted-cross-domain-policies="master-only"/><allow-access-from domain="*" to-ports="*"/></cross-domain-policy>`)
			}
			else
			{
				const xmlPacket = new xmldoc.XmlDocument(data)

				const type = xmlPacket.children[0].attr.action

				if (type == "verChk")
				{
					const version = xmlPacket.children[0].firstChild.attr.v

					if (version == 153)
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
					penguin.randomKey = GameDataEncryptor.generateRandomKey(12)

					penguin.sendRaw(`<msg t="sys"><body action="rndK" r="-1"><k>${penguin.randomKey}</k></body></msg>`)
				}
				else if (type == "login")
				{
					return this.handleLogin(data, penguin)
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