"use strict"

const Logger = require("../../Logger")

const Room = require("../system/Room")

const Rooms = require("../../crumbs/rooms")

class roomManager {
	constructor(server) {
		this.rooms = []
		this.server = server

		for (let id of Object.keys(Rooms)) {
			if (id < 900) {
				this.createRoom(id)
			}
		}
	}

	createRoom(id) {
		if (!this.rooms[id]) {
			return this.rooms[id] = new Room(id, this)
		} else {
			Logger.error(`Tried to create room ${id} but it already exists`)
		}
	}

	getRoom(id) {
		if (this.rooms[id]) {
			return this.rooms[id]
		} else {
			Logger.error(`Tried to get room ${id} but it doesn't exist`)
		}
	}

	checkIgloo(id) {
		if (this.rooms[id]) {
			if (this.rooms[id].open === true) {
				return true
			}
		}
	}

	closeIgloo(id) {
		if (this.rooms[id]) {
			return (this.rooms[id].open = false)
		}
	}
}

module.exports = roomManager