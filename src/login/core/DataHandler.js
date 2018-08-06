"use strict"

const Logger = require("../Logger")

class DataHandler
{
	constructor(server)
	{
		this.server = server
	}

	handleData(data, penguin)
	{
		if (data.startsWith("<") && data.endsWith(">"))
		{
			Logger.info(`INCOMING: ${data}`)
			if (data == "<policy-file-request/>")
			{
				return penguin.send(`<cross-domain-policy><site-control permitted-cross-domain-policies="master-only"/><allow-access-from domain="*" to-ports="*"/></cross-domain-policy>`)
			}
		}
		else
		{
			penguin.disconnect()
		}
	}
}

module.exports = DataHandler