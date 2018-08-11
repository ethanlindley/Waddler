"use strict"

class Multiplayer
{
	static handleMovePuck(data, penguin)
	{
		let puckCoords = [parseInt(data[5]), parseInt(data[6]), parseInt(data[7]), parseInt(data[8])].join("%")

		penguin.sendXt("zm", -1, penguin.id, puckCoords)
	}

	static handleGetGame(data, penguin)
	{
		if (penguin.room.id == 802)
		{
			penguin.sendXt("gz", -1, "0%0%0%0%")
		}
	}
}

module.exports = Multiplayer