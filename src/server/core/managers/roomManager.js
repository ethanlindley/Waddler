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
	/*
	 * Creates a room.
	 * We first check if the room doesn't exist before creating it.
	 * Nothing will happen if the room exists, for reasons.
	 */
	createRoom(id)
	{
		if (!this.rooms[id])
		{
			return this.rooms[id] = new Room(id, this)
		}
	}
	/*
	 * Gets information from a room.
	 * We first check if the room exists.
	 * Nothing will happen if the room doesn't exist, for reasons.
	 */
	getRoom(id)
	{
		if (this.rooms[id])
		{
			return this.rooms[id]
		}
	}
}

module.exports = roomManager