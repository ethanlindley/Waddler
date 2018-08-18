"use strict"

class Bot {
	static generateBotString() {
		const botArr = [
			0, // ID
			"Bot", // Username
			45,
			1, // Color
			122, // Head
			0, // Face
			0, // Neck
			276, // Body
			0, // Hand
			0, // Feet
			514, // Flag
			0, // Photo
			100, // X
			100, // Y
			1, // Frame
			1,
			876 // Rank -> 6 * 146
		]
		return botArr.join("|")
	}

	static sendMessage(message, penguin) {
		penguin.sendXt("sm", -1, 0, message)
	}
}

module.exports = Bot