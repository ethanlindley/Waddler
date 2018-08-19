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

	usernameExists(username) {
		return this.knex("penguins").count().first().where({
			username
		})
	}

	insertPenguin(username, hash, color) {
		const date = new Date()

		return this.knex("penguins").insert({
			username: username,
			password: hash,
			registrationdate: date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate(),
			color: color,
			igloos: "1",
			cover: "1%1%1%1%"
		})
	}

	addColor(id, color) {
		return this.knex("inventory").insert({
			id: id,
			itemid: color
		})
	}
}

module.exports = Database