"use strict"

function Commands(penguin) {
	this.penguin = penguin
	this.commands = {
		"ping": "handlePing",
		"date": "handleGetDate",
		"online": "handleGetOnline",
		"ban": "handleBan",
		"unban": "handleUnban",
		"kick": "handleKick",
		"mute": "handleMute",
		"unmute": "handleUnmute"
	}
}

Commands.prototype.handleCommand = function(command, argument) {
	command = command[0]
	argument = argument[1]
	if (this.commands[command]) {
		const method = this.commands[command]
		if (this[method] && typeof this[method] == "function") {
			this[method](argument)
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

Commands.prototype.handleBan = function(player) {
	if (!this.penguin.moderator) return this.penguin.sendLoadMovie("You must be a moderator to use this command")
	if (player == undefined) return this.penguin.sendLoadMovie("You must specify a player to ban")

	this.penguin.database.banByUsername(player.toString()).then(() => {
		const bannedPlayer = this.penguin.server.getPenguinByUsername(player)

		if (bannedPlayer) {
			bannedPlayer.sendXt("b", -1)
			bannedPlayer.disconnect()

			this.penguin.sendLoadMovie(`${player.toString()} has been banned`)
		}
	}).catch(() => {
		this.penguin.sendLoadMovie(`${player.toString()} doesn't exist`)
	})
}

Commands.prototype.handleUnban = function(player) {
	if (!this.penguin.moderator) return this.penguin.sendLoadMovie("You must be a moderator to use this command")
	if (player == undefined) return this.penguin.sendLoadMovie("You must specify a player to unban")

	this.penguin.database.unbanByUsername(player.toString()).then(() => {
		this.penguin.sendLoadMovie(`${player.toString()} has been unbanned`)
	}).catch(() => {
		this.penguin.sendLoadMovie(`${player.toString()} doesn't exist`)
	})
}

Commands.prototype.handleKick = function(player) {
	if (!this.penguin.moderator) return this.penguin.sendLoadMovie("You must be a moderator to use this command")
	if (player == undefined) return this.penguin.sendLoadMovie("You must specify a player to kick")

	const kickedPlayer = this.penguin.server.getPenguinByUsername(player)

	if (kickedPlayer) {
		kickedPlayer.sendError(5, true)

		this.penguin.sendLoadMovie(`${player.toString()} has been kicked`)
	}
}

Commands.prototype.handleMute = function(player) {
	if (!this.penguin.moderator) return this.penguin.sendLoadMovie("You must be a moderator to use this command")
	if (player == undefined) return this.penguin.sendLoadMovie("You must specify a player to mute")

	const mutedPlayer = this.penguin.server.getPenguinByUsername(player)

	if (mutedPlayer) {
		mutedPlayer.muted = !mutedPlayer.muted

		this.penguin.sendLoadMovie(`${player.toString()} has been muted`)
	}
}

Commands.prototype.handleUnmute = function(player) {
	if (!this.penguin.moderator) return this.penguin.sendLoadMovie("You must be a moderator to use this command")
	if (player == undefined) return this.penguin.sendLoadMovie("You must specify a player to unmute")

	const unmutedPlayer = this.penguin.server.getPenguinByUsername(player)

	if (unmutedPlayer) {
		unmutedPlayer.muted = false

		this.penguin.sendLoadMovie(`${player.toString()} has been unmuted`)
	}
}

module.exports = Commands