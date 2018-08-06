"use strict"

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