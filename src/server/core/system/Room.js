"use strict"

class Room {
	constructor(id, manager) {
		this.penguins = []
		this.id = id
		this.parent = manager
		this.server = manager.server
	}

	addPenguin(penguin, coords) {
		let x = coords[0],
			y = coords[1]

		if (!x || isNaN(x)) x = 0
		if (!y || isNaN(y)) y = 0

		penguin.room = this
		penguin.frame = 1
		penguin.x = x
		penguin.y = y

		this.penguins.push(penguin)
		this.sendXt("ap", -1, penguin.buildPlayerString())

		if (this.id > 1000) penguin.sendXt("jp", -1, this.id)

		if (this.penguins.length > 0) {
			penguin.sendXt("jr", -1, this.id, this.buildRoomString())
		} else {
			penguin.sendXt("jr", -1, this.id)
		}
	}

	removePenguin(penguin) {
		const index = this.penguins.indexOf(penguin)

		if (index > -1) {
			this.penguins.splice(index, 1)
			this.sendXt("rp", -1, penguin.id)
		}
	}

	sendRaw(data) {
		for (const penguin of this.penguins) penguin.sendRaw(data)
	}

	sendXt() {
		this.sendRaw(`%xt%${Array.prototype.join.call(arguments, "%")}%`)
	}

	buildRoomString() {
		let roomStr = ""

		for (const penguin of this.penguins) roomStr += `%${penguin.buildPlayerString()}`

		return roomStr.substr(1)
	}
}

module.exports = Room