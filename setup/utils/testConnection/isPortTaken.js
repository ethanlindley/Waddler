"use strict"

const isPortTaken = (port) => {
	if (isNaN(port)) throw new Error("You must specify a port")
	return new Promise((resolve) => {
		port = parseInt(port)
		const server = require("net").createServer().once("error", (err) => {
			resolve(false)
		}).once("listening", () => server.once("close", () => resolve(true)).close()).listen(port)
	})
}

isPortTaken(6112).then((status) => {
	console.log(`Login server running: ${status ? "no" : "yes"}`)
})
isPortTaken(6113).then((status) => {
	console.log(`Game server running: ${status ? "no" : "yes"}`)
})
isPortTaken(3306).then((status) => {
	console.log(`MySQL server running: ${status ? "no" : "yes"}`)
})