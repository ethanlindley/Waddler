"use strict"

const API = require("./API")

module.exports = function(fastify, opts, next) {
	fastify.get("/api/users/registered", (req, res) => {
		console.log(`[INFO] > Registered user count requested`)
		return API.getRegisteredCount(res, opts.database)
	})
	fastify.get("/api/users/banned", (req, res) => {
		console.log(`[INFO] > Banned user count requested`)
		return API.getBannedCount(res, opts.database)
	})
	fastify.get("/api/users/usernames", (req, res) => {
		console.log(`[INFO] Registered usernames array requested`)
		return API.getRegisteredUsernames(res, opts.database)
	})
	next()
}