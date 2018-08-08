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
	 * Just like in getPlayer, check player type.
	 * Then, update the column.
	 */
	updateColumn(player, column, value)
	{
		const type = isNaN(player) ? "username" : "id"
		return this.knex("penguins").update(column, value).where(type, player).then(() =>
		{}).catch((err) =>
		{
			console.error(err)
		})
	}
}

module.exports = Database