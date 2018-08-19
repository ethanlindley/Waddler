"use strict"

const Logger = require("../Logger")

class Socket {
	constructor(socket) {
		this.socket = socket
	}

	sendRaw(data) {
		if (this.socket && this.socket.writable) {
			Logger.outgoing(data)
			this.socket.write(data + "\0")
		}
	}

	sendXt() {
		this.sendRaw(`%xt%${Array.prototype.join.call(arguments, "%")}%`)
	}

	sendError(err, disconnect) {
		this.sendXt("e", -1, err)

		if (disconnect) this.disconnect()
	}

	sendArray(arr) {
		if (arr.constructor.name == "Array" && this.socket && this.socket.writable) {
			Logger.outgoing(arr)
			for (const i in arr) {
				this.socket.write(arr[i].toString() + "\0")
			}
		}
	}

	disconnect() {
		this.server.removePenguin(this)
	}
}

module.exports = Socket