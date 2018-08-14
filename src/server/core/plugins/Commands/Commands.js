"use strict"

function Commands(penguin) {
	this.penguin = penguin
	this.commands = {
		"ping": "handlePing",
		"date": "handleGetDate",
		"online": "handleGetOnline"
	}
}

Commands.prototype.handleCommand = function(command) {
	if (this.commands[command]) {
		const method = this.commands[command]
		if (this[method] && typeof this[method] == "function") {
			this[method]()
		}
	} else {
		return this.penguin.sendLoadMovie(`${command} is not a valid command`)
	}
}

Commands.prototype.handlePing = function() {
	return this.penguin.sendLoadMovie("Pong!")
}

Commands.prototype.handleGetDate = function() {
	return this.penguin.sendLoadMovie(new Date().toString())
}

Commands.prototype.handleGetOnline = function() {
	let online = this.penguin.server.penguins.length,
		msg = ""

	online == 1 ? msg += "You're the only one online" : `There are ${online} players online`

	return this.penguin.sendLoadMovie(msg)
}

module.exports = Commands