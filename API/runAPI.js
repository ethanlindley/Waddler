"use strict"

const database = new(require("./src/Database"))

const fastify = require("fastify")()

fastify
	.register(require("./src/routes/Routes"), {
		database: database
	})
	.listen(8099, (err, address) => {
		if (err) throw err

		console.log(`API listening on ${address}`)
	})