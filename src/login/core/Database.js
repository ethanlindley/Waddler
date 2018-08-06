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
}

module.exports = Database