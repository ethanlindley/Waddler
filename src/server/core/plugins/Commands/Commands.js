"use strict"

const commands = {
	"ping": "handlePing",
	"date": "handleGetDate",
	"online": "handleGetOnline",
	"ai": "handleAddItem",
	"ac": "handleAddCoins",
	"rc": "handleRemoveCoins",
	"ban": "handleBan",
	"unban": "handleUnban",
	"kick": "handleKick",
	"mute": "handleMute",
	"unmute": "handleUnmute",
	"as": "handleAddStamp",
	"jr": "handleJoinRoom",
	"tp": "handleGotoPlayer"
}

class Commands {
	static handleCommand(command, argument, penguin) {
		if (!penguin.server.pluginLoader.getPlugin("Bot")) throw new Error("Bot plugin must be enabled to use commands")

		command = command[0]
		argument = argument[1]
		const Bot = penguin.server.pluginLoader.getPlugin("Bot")

		if (commands[command]) {
			const method = commands[command]
			if (this[method] && typeof this[method] == "function") {
				this[method](argument, penguin, Bot)
			}
		} else {
			return Bot.sendMessage(`${command} is not a valid command`, penguin)
		}
	}

	static handlePing(argument, penguin, Bot) {
		return Bot.sendMessage("Pong!", penguin)
	}

	static handleGetDate(argument, penguin, Bot) {
		return Bot.sendMessage(`The date is: ${require("../../utils/sp").dateToInt()}`, penguin)
	}

	static handleGetOnline(argument, penguin, Bot) {
		let online = penguin.server.penguins.length,
			msg = ""

		online == 1 ? msg += "You're the only one online" : `There are ${online} players online`

		return Bot.sendMessage(msg, penguin)
	}

	static handleAddItem(argument, penguin, Bot) {
		if (!penguin.moderator) return

		penguin.addItem(parseInt(argument))

		return Bot.sendMessage(`Added item ${argument}`, penguin)
	}

	static handleAddCoins(argument, penguin, Bot) {
		if (!penguin.moderator) return

		penguin.addCoins(parseInt(argument))

		return Bot.sendMessage(`Added ${argument} coins`, penguin)
	}

	static handleRemoveCoins(argument, penguin, Bot) {
		if (!penguin.moderator) return

		penguin.removeCoins(parseInt(argument))

		return Bot.sendMessage(`Removed ${argument} coins`, penguin)
	}

	static handleBan(argument, penguin, Bot) {
		if (!penguin.moderator) return

		penguin.database.banByUsername(argument).then(() => {
			const bannedPlayer = penguin.server.getPenguinByUsername(argument)

			if (bannedPlayer) {
				bannedPlayer.sendXt("b", -1)
				bannedPlayer.disconnect()

				Bot.sendMessage(`${argument} has been banned`, penguin)
			} else {
				Bot.sendMessage(`${argument} is not online`, penguin)
			}
		}).catch(() => {
			Bot.sendMessage(`${argument} doesn't exist`, penguin)
		})
	}

	static handleUnban(argument, penguin, Bot) {
		if (!penguin.moderator) return

		penguin.database.unbanByUsername(argument).then(() => {
			Bot.sendMessage(`${argument} has been unbanned`, penguin)
		}).catch(() => {
			Bot.sendMessage(`${argument} doesn't exist`, penguin)
		})
	}

	static handleKick(argument, penguin, Bot) {
		if (!penguin.moderator) return

		const kickedPlayer = penguin.server.getPenguinByUsername(argument)

		if (kickedPlayer) {
			kickedPlayer.sendError(5, true)

			Bot.sendMessage(`${argument} has been kicked`, penguin)
		} else {
			Bot.sendMessage(`${argument} is not online`, penguin)
		}
	}

	static handleMute(argument, penguin, Bot) {
		if (!penguin.moderator) return

		const mutedPlayer = penguin.server.getPenguinByUsername(argument)

		if (mutedPlayer) {
			mutedPlayer.muted = !mutedPlayer.muted

			Bot.sendMessage(`${argument} has been muted`, penguin)
		} else {
			Bot.sendMessage(`${argument} is not online`, penguin)
		}
	}

	static handleUnmute(argument, penguin, Bot) {
		if (!penguin.moderator) return

		const unmutedPlayer = penguin.server.getPenguinByUsername(argument)

		if (unmutedPlayer) {
			unmutedPlayer.muted = false

			Bot.sendMessage(`${argument} has been unmuted`, penguin)
		} else {
			Bot.sendMessage(`${argument} is not online`, penguin)
		}
	}

	static handleAddStamp(argument, penguin, Bot) {
		if (!penguin.moderator) return

		penguin.addStamp(parseInt(argument))

		return Bot.sendMessage(`Added stamp ${argument}`, penguin)
	}

	static handleJoinRoom(argument, penguin, Bot) {
		if (!penguin.moderator) return

		require("../../handlers/Navigation").handleJoinRoom({
			4: parseInt(argument),
			5: 100,
			6: 100
		}, penguin)
	}

	static handleGotoPlayer(argument, penguin, Bot) {
		if (!penguin.moderator) return

		const findPlayer = penguin.server.getPenguinByUsername(argument)

		if (findPlayer) {
			if (findPlayer.room.id == penguin.room.id) return Bot.sendMessage(`You're in the same room as ${argument}`, penguin)
			this.handleJoinRoom(findPlayer.room.id, penguin, Bot)
		} else {
			Bot.sendMessage(`${argument} is not online`, penguin)
		}
	}
}

module.exports = Commands