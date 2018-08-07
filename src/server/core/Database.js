"use strict"

const config = require("../../config")

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

	getPlayer(player)
	{
		const type = isNaN(player) ? "username" : "id"
		return this.knex("penguins").first("*").where(type, player)
	}

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