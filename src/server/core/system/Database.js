"use strict"

const config = require("../../../config")

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

	getPlayer(player) {
		const type = isNaN(player) ? "username" : "id"

		return this.knex("penguins").first("*").where(type, player)
	}

	updateColumn(player, column, value, table) {
		const type = isNaN(player) ? "username" : "id"

		return this.knex(table == null ? "penguins" : table).update(column, value).where(type, player).then(() => {}).catch((err) => {
			console.error(err)
		})
	}

	getColumn(player, column, table) {
		const type = isNaN(player) ? "username" : "id"

		return this.knex(table == null ? "penguins" : table).select(column).where(type, player)
	}

	insertItem(id, item) {
		return this.knex("inventory").insert({
			id: id,
			itemid: item
		}).catch((err) => {
			console.error(err)
		})
	}
}

module.exports = Database