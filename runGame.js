"use strict"

console.log(`*********************
*      Waddler      *
*     By Zaseth     *
*   Actionscript 2  *
*********************`)

new(require("./src/server/Server"))("game")

process.on("uncaughtException", (err) => {
	console.error(err)
})