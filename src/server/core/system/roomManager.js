"use strict"

const Logger = require("../../Logger")

const Room = require("./Room")

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
		}
	}

	getRoom(id) {
		if (this.rooms[id]) {
			return this.rooms[id]
		} else {
			return false
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