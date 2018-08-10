"use strict"

class Multiplayer
{
	static handleMovePuck(data, penguin)
	{
		let puckCoords = [parseInt(data[5]), parseInt(data[6]), parseInt(data[7]), parseInt(data[8])].join("%")

		penguin.sendXt("zm", -1, penguin.id, puckCoords)
	}
}

module.exports = Multiplayer