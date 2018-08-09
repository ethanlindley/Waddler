"use strict"

const Logger = require("../../Logger")

const Room = require("../system/Room")

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
	 */
	createRoom(id)
	{
		if (!this.rooms[id])
		{
			return this.rooms[id] = new Room(id, this)
		}
		else
		{
			Logger.error(`Tried to create room ${id} but it already exists`)
		}
	}
	/*
	 * Gets information from a room.
	 * We first check if the room exists.
	 */
	getRoom(id)
	{
		if (this.rooms[id])
		{
			return this.rooms[id]
		}
		else
		{
			Logger.error(`Tried to get room ${id} but it doesn't exist`)
		}
	}
	/*
	 * Checks if the igloo is open.
	 * We first check if the room exists.
	 */
	checkIgloo(id)
	{
		if (this.rooms[id])
		{
			if (this.rooms[id].open === true)
			{
				return true
			}
		}
	}
	/*
	 * Closes the igloo.
	 * We first check if the room exists.
	 */
	closeIgloo(id)
	{
		if (this.rooms[id])
		{
			return (this.rooms[id].open = false)
		}
	}
}

module.exports = roomManager