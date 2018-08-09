"use strict"

class Clothing
{
	/*
	 * When a player updates his clothes, this will take care of it.
	 */
	static handleUpdateClothing(data, penguin)
	{
		const type = data[2].substr(2),
			item = parseInt(data[4])

		const types = {
			"upc": "color",
			"uph": "head",
			"upf": "face",
			"upn": "neck",
			"upb": "body",
			"upa": "hand",
			"upe": "feet",
			"upl": "pin",
			"upp": "photo"
		}

		if (isNaN(item))
		{
			return penguin.disconnect()
		}

		if (types[type])
		{
			penguin.room.sendXt(type, -1, penguin.id, item)
			penguin.updateClothing(types[type], item)
		}
	}
	/*
	 * The player buys an item, this will add it to their inventory.
	 */
	static handleAddItem(data, penguin)
	{
		const item = parseInt(data[4])

		if (isNaN(item))
		{
			return penguin.disconnect()
		}

		const items = require("../../crumbs/items")

		if (items[item])
		{
			const cost = items[item].cost

			if (penguin.inventory.includes(item))
			{
				return penguin.sendError(400)
			}
			if (penguin.coins < cost)
			{
				return penguin.sendError(401)
			}

			penguin.removeCoins(cost)
			penguin.addItem(item)
		}
		else
		{
			penguin.sendError(402)
		}
	}
	/*
	 * This gets requested once logged in.
	 * It gets the player's inventory.
	 */
	static handleGetInventory(data, penguin)
	{
		penguin.getInventory()
		penguin.sendXt("gi", -1, penguin.inventory.join("%"))
	}
}

module.exports = Clothing