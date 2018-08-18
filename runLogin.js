"use strict"

new(require("./src/server/Server"))("login")

process.on("uncaughtException", (err) => {
	console.error(err)
})