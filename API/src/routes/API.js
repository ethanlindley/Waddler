"use strict"

module.exports = class API {
	static getRegisteredCount(res, database) {
		database.APICount().then((result) => {
			res.code(200).send(Number(result[0].CNT))
		})
	}
	static getBannedCount(res, database) {
		database.APIBannedCount().then((result) => {
			res.code(200).send(Number(result[0].CNT))
		})
	}
	static getRegisteredUsernames(res, database) {
		database.APIGetUsernames().then((result) => {
			const usernames = []

			for (const i in result) {
				usernames.push(result[i].username)
			}

			res.code(200).send(usernames)
		})
	}
}