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

	sendLoadMovie(message) {
		this.sendXt("lm", -1, `${require("../../config").loadMovieURL}${message}`)
	}

	disconnect() {
		this.server.removePenguin(this)
	}
}

module.exports = Socket