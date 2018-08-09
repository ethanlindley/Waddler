"use strict"

const config = require("../../../config")

class Database
{
	constructor()
	{
		this.knex = require("knex")(
		{
			client: config.client,
			connection:
			{
				"host": config.host,
				"user": config.user,
				"password": config.pass,
				"database": config.database
			}
		})
	}
	/*
	 * First decide whether player is a username or an id.
	 * After that, get the player's data.
	 */
	getPlayer(player)
	{
		const type = isNaN(player) ? "username" : "id"

		return this.knex("penguins").first("*").where(type, player)
	}
	/*
	 * Checks if player is username or id.
	 * Then, update the column.
	 */
	updateColumn(player, column, value, table)
	{
		const type = isNaN(player) ? "username" : "id"

		return this.knex(table == null ? "penguins" : table).update(column, value).where(type, player).then(() =>
		{}).catch((err) =>
		{
			console.error(err)
		})
	}
	/*
	 * Checks if player is username or id.
	 * Then, retrieve column value.
	 */
	getColumn(player, column, table)
	{
		const type = isNaN(player) ? "username" : "id"

		return this.knex(table == null ? "penguins" : table).select(column).where(type, player)
	}
	/*
	 * Adds an item to the inventory table.
	 */
	insertItem(id, item)
	{
		return this.knex("inventory").insert(
		{
			id: id,
			itemid: item
		}).catch((err) =>
		{
			console.error(err)
		})
	}
}

module.exports = Database