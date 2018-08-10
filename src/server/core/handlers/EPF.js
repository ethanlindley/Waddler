"use strict"

class EPF
{
	static handleGetAgentStatus(data, penguin)
	{
		penguin.sendXt("epfga", -1, Number(penguin.epf))
	}

	static handleGetAgentRank(data, penguin)
	{
		penguin.sendXt("epfgr", -1, 0, 0)
	}

	static handleGetFieldStatus(data, penguin)
	{
		penguin.sendXt("epfgf", -1, Number(penguin.epf))
	}

	static handleGetCOMMessages(data, penguin)
	{
		const timestamp = parseInt(Date.now().toString().substr(0, 10))
		penguin.sendXt("epfgm", -1, 0, `Welcome!|${timestamp}|10`)
	}
}

module.exports = EPF