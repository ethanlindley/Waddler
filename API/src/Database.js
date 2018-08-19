"use strict"

const config = require("./config")

class Database {
	constructor() {
		this.knex = require("knex")({
			client: config.client,
			connection: {
				"host": config.host,
				"user": config.user,
				"password": config.pass,
				"database": config.database
			}
		})
	}

	APICount() {
		return this.knex("penguins").count("ID as CNT")
	}
	APIBannedCount() {
		return this.knex("penguins").where("banned", ">=", 1).count("banned as CNT")
	}
	APIGetUsernames() {
		return this.knex("penguins").select("username").where("ID", ">=", 100)
	}
}

module.exports = Database