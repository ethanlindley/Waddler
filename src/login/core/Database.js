"use strict"

const config = require("../config")

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
}

module.exports = Database