"use strict"

/*
 * Just a simple Pino logger.
 */
module.exports = require("pino")(
{
	base:
	{
		pid: null,
		hostname: null,
		name: null
	},
	prettyPrint: true
})