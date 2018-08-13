"use strict"

const database = new(require("./src/Database"))

const fastify = require("fastify")()

fastify
	.register(require("fastify-static"), {
		root: require("path").join(__dirname, "./src/public"),
		prefix: "/"
	})
	.register(require("fastify-formbody"))
	.register(require("fastify-helmet"))
	.register(require("./src/routes/Routes"), {
		database: database
	})
	.listen(6969, (err, address) => {
		if (err) throw err

		console.log(`Listening on ${address}`)
	})