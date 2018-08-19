"use strict"

const Bot = require("../Bot/Bot")

function Commands(penguin) {
	this.penguin = penguin
	this.commands = {
		"ping": "handlePing",
		"date": "handleGetDate",
		"online": "handleGetOnline",
		"ai": "handleAddItem",
		"ac": "handleAddCoins",
		"rc": "handleRemoveCoins",
		"uc": "handleUpdateColor",
		"ban": "handleBan",
		"unban": "handleUnban",
		"kick": "handleKick",
		"mute": "handleMute",
		"unmute": "handleUnmute",
		"as": "handleAddStamp"
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
		return Bot.sendMessage(`${command} is not a valid command`, this.penguin)
	}
}

Commands.prototype.handlePing = function() {
	return Bot.sendMessage("Pong!", this.penguin)
}

Commands.prototype.handleGetDate = function() {
	return Bot.sendMessage(`The date is: ${require("../../utils/sp").dateToInt()}`, this.penguin)
}

Commands.prototype.handleGetOnline = function() {
	let online = this.penguin.server.penguins.length,
		msg = ""

	online == 1 ? msg += "You're the only one online" : `There are ${online} players online`

	return Bot.sendMessage(msg, this.penguin)
}

Commands.prototype.handleAddItem = function(item) {
	if (!this.penguin.moderator) return

	this.penguin.addItem(parseInt(item))

	Bot.sendMessage(`Added item ${item}`, this.penguin)
}

Commands.prototype.handleAddCoins = function(coins) {
	if (!this.penguin.moderator) return

	this.penguin.addCoins(parseInt(coins))

	Bot.sendMessage(`Added ${coins} coins`, this.penguin)
}

Commands.prototype.handleRemoveCoins = function(coins) {
	if (!this.penguin.moderator) return

	this.penguin.removeCoins(parseInt(coins))

	Bot.sendMessage(`Removed ${coins} coins`, this.penguin)
}

Commands.prototype.handleUpdateColor = function(color) {
	if (!this.penguin.moderator) return

	if (!color || isNaN(color)) return

	this.penguin.updateColumn("color", color)
	this.penguin.color = color

	Bot.sendMessage(`Updated your color. Rejoin the room`, this.penguin)
}

Commands.prototype.handleBan = function(player) {
	if (!this.penguin.moderator) return
	if (!player) return

	this.penguin.database.banByUsername(player.toString()).then(() => {
		const bannedPlayer = this.penguin.server.getPenguinByUsername(player)

		if (bannedPlayer) {
			bannedPlayer.sendXt("b", -1)
			bannedPlayer.disconnect()

			Bot.sendMessage(`${player.toString()} has been banned`, this.penguin)
		} else {
			Bot.sendMessage(`${player.toString()} is not online`, this.penguin)
		}
	}).catch(() => {
		Bot.sendMessage(`${player.toString()} doesn't exist`, this.penguin)
	})
}

Commands.prototype.handleUnban = function(player) {
	if (!this.penguin.moderator) return
	if (!player) return

	this.penguin.database.unbanByUsername(player.toString()).then(() => {
		Bot.sendMessage(`${player.toString()} has been unbanned`, this.penguin)
	}).catch(() => {
		Bot.sendMessage(`${player.toString()} doesn't exist`, this.penguin)
	})
}

Commands.prototype.handleKick = function(player) {
	if (!this.penguin.moderator) return
	if (!player) return

	const kickedPlayer = this.penguin.server.getPenguinByUsername(player)

	if (kickedPlayer) {
		kickedPlayer.sendError(5, true)

		Bot.sendMessage(`${player.toString()} has been kicked`, this.penguin)
	} else {
		Bot.sendMessage(`${player.toString()} is not online`, this.penguin)
	}
}

Commands.prototype.handleMute = function(player) {
	if (!this.penguin.moderator) return
	if (!player) return

	const mutedPlayer = this.penguin.server.getPenguinByUsername(player)

	if (mutedPlayer) {
		mutedPlayer.muted = !mutedPlayer.muted

		Bot.sendMessage(`${player.toString()} has been muted`, this.penguin)
	} else {
		Bot.sendMessage(`${player.toString()} is not online`, this.penguin)
	}
}

Commands.prototype.handleUnmute = function(player) {
	if (!this.penguin.moderator) return
	if (!player) return

	const unmutedPlayer = this.penguin.server.getPenguinByUsername(player)

	if (unmutedPlayer) {
		unmutedPlayer.muted = false

		Bot.sendMessage(`${player.toString()} has been unmuted`, this.penguin)
	} else {
		Bot.sendMessage(`${player.toString()} is not online`, this.penguin)
	}
}

Commands.prototype.handleAddStamp = function(stampID) {
	if (!this.penguin.moderator) return

	this.penguin.addStamp(stampID)
}

module.exports = Commands