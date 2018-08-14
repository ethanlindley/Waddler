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

	updateQuantity(id) {
		return this.knex.raw("UPDATE `furniture` SET `quantity` = quantity + ? WHERE `id` = ?", [1, id]).then(() => {}).catch((err) => {
			console.error(err)
		})
	}
	insertFurniture(id, furnitureid) {
		return this.knex("furniture").insert({
			id: id,
			furnitureid: furnitureid,
			quantity: 1
		})
	}

	getFurnitureAndQuantity(id) {
		return this.knex("furniture").select("furnitureid", "quantity").where({
			id
		})
	}

	getActiveIgloo(id) {
		return this.knex("igloo").select("*").where({
			id
		})
	}

	addIgloo(id, igloo) {
		return this.knex.raw('UPDATE `penguins` SET `igloos` =' + `concat(igloos, "|", ${igloo})` + 'WHERE `id` = ?', [id]).then(() => {}).catch((err) => {
			console.error(err)
		})
	}
}

module.exports = Database