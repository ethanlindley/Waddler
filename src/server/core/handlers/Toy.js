"use strict"

class Toy
{
	static handleOpenPlayerBook(data, penguin)
	{
		penguin.room.sendXt("at", -1, penguin.id)
	}
	static handleClosePlayerBook(data, penguin)
	{
		penguin.room.sendXt("rt", -1, penguin.id)
	}
}

module.exports = Toy