"use strict"

class Database {
	constructor() {
		this.knex = require("knex")({
			client: "mysql2",
			connection: {
				"host": "127.0.0.1",
				"user": "root",
				"password": "",
				"database": "waddler"
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
			igloos: "1"
		})
	}
}

module.exports = Database