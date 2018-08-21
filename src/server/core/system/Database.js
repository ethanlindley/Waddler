"use strict"

const config = require("../../../config")
const Logger = require("../../Logger")

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

	doesIDExist(ID) {
		return this.knex("penguins").count().where({
			ID
		})
	}
	getPlayer(player) {
		const type = isNaN(player) ? "username" : "ID"

		return this.knex("penguins").first("*").where(type, player)
	}
	getUsernameByID(ID) {
		return this.knex("penguins").select("username").where({
			ID
		})
	}
	getInventoryByID(ID) {
		return this.knex("inventory").select("itemID").where({
			ID
		})
	}
	updateColumn(player, column, value, table) {
		const type = isNaN(player) ? "username" : "ID"

		return this.knex(table == null ? "penguins" : table).update(column, value).where(type, player).then(() => {}).catch((err) => {
			Logger.error(err)
		})
	}
	getColumn(player, column, table) {
		const type = isNaN(player) ? "username" : "ID"

		return this.knex(table == null ? "penguins" : table).select(column).where(type, player)
	}
	getColumnByID(ID, column) {
		return this.knex("penguins").select(column).where({
			ID
		})
	}

	insertItem(ID, item) {
		return this.knex("inventory").insert({
			ID: ID,
			itemID: item
		}).catch((err) => {
			Logger.error(err)
		})
	}

	updateQuantity(ID) {
		return this.knex.raw("UPDATE `furniture` SET `quantity` = quantity + ? WHERE `ID` = ?", [1, ID]).then(() => {}).catch((err) => {
			Logger.error(err)
		})
	}
	insertFurniture(ID, furnitureID) {
		return this.knex("furniture").insert({
			ID: ID,
			furnitureID: furnitureID,
			quantity: 1
		})
	}
	getFurnitureAndQuantity(ID) {
		return this.knex("furniture").select("furnitureID", "quantity").where({
			ID
		})
	}
	getActiveIgloo(ID) {
		return this.knex("igloo").select("*").where({
			ID
		})
	}
	addIgloo(ID, igloo) {
		if (igloo.includes("'")) return
		return this.knex.raw('UPDATE `penguins` SET `igloos` =' + `concat(igloos, "|", ${igloo})` + 'WHERE `ID` = ?', [ID]).then(() => {}).catch((err) => {
			Logger.error(err)
		})
	}
	alreadyOwnsIgloo(ID) {
		return this.knex("penguins").select("igloos").where({
			ID
		})
	}

	getIgnored(ID) {
		return this.knex("ignored").select("ignoredID", "ignoredUsername").where({
			ID
		})
	}
	addIgnore(ID, toIgnore, usernameToIgnore) {
		return this.knex("ignored").insert({
			ID: ID,
			ignoredID: toIgnore,
			ignoredUsername: usernameToIgnore
		})
	}
	removeIgnore(ID, toRemove, usernameToRemove) {
		return this.knex("ignored").del().where({
			ID: ID,
			ignoredID: toRemove,
			ignoredUsername: usernameToRemove
		})
	}

	banByUsername(username) {
		return this.knex("penguins").update("banned", 1).where({
			username
		})
	}
	unbanByUsername(username) {
		return this.knex("penguins").update("banned", 0).where({
			username
		})
	}

	getBuddies(ID) {
		return this.knex("buddies").select("buddyID", "buddyUsername").where({
			ID
		})
	}
	addBuddy(ID, toAccept, usernameToAccept) {
		return this.knex("buddies").insert({
			ID: ID,
			buddyID: toAccept,
			buddyUsername: usernameToAccept
		})
	}
	removeBuddy(ID, toRemove, usernameToRemove) {
		return this.knex("buddies").del().where({
			ID: ID,
			buddyID: toRemove,
			buddyUsername: usernameToRemove
		})
	}

	getStamps(ID) {
		return this.knex("stamps").select("stampID").where({
			ID
		})
	}
	insertStamp(ID, stampID) {
		return this.knex("stamps").insert({
			ID: ID,
			stampID: stampID
		})
	}

	getPuffle(ID, puffleID) {
		return this.knex("puffles").select("*").where({
			ID: ID,
			puffleID: puffleID
		})
	}
	getPuffleByName(ID, puffleName) {
		return this.knex("puffles").select("*").where({
			ID: ID,
			puffleName: puffleName
		})
	}
	getPuffles(ID) {
		return this.knex("puffles").select("*").where({
			ID
		})
	}
	adoptPuffle(ID, puffleName, puffleType) {
		return this.knex("puffles").insert({
			ID: ID,
			puffleName: puffleName,
			puffleType: puffleType,
			puffleFood: 100,
			pufflePlay: 100,
			puffleRest: 100,
			puffleWalk: 0
		})
	}
}

module.exports = Database