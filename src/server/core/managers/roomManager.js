"use strict"

const Room = require("../Room")

const Rooms = require("../../crumbs/rooms")

class roomManager
{
	constructor(server)
	{
		this.rooms = []
		this.server = server

		for (let id of Object.keys(Rooms))
		{
			if (id < 900)
			{
				this.createRoom(id)
			}
		}
	}

	createRoom(id)
	{
		if (!this.rooms[id])
		{
			return this.rooms[id] = new Room(id, this)
		}
	}

	getRoom(id)
	{
		if (this.rooms[id])
		{
			return this.rooms[id]
		}
	}
}

module.exports = roomManager