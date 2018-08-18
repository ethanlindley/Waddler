"use strict"

new(require("./src/server/Server"))("game")

process.on("uncaughtException", (err) => {
	console.error(err)
})