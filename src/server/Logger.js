"use strict"

const fs = require("fs")

class Logger {
	static saveLog(lvl, msg) {
		fs.appendFile(`${__dirname}\\logs\\${lvl}.log`, `{${this.getLogTime(new Date())}} - ${msg}\r\n`, (err) => {
			if (err) throw err
		})
	}
	static getLogTime(date) {
		return `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()} ${date.getUTCHours() >= 12 ? "pm" : "am"}`
	}
	static info(msg) {
		const x = `[INFO] > ${msg}`
		console.log(`\x1b[42m%s\x1b[0m`, x)
		this.saveLog("info", x)
	}
	static error(msg) {
		const x = `[ERROR] > ${msg}`
		console.log(`\x1b[41m%s\x1b[0m`, x)
		this.saveLog("error", x)
	}
	static incoming(msg) {
		const x = `[INCOMING] > ${msg}`
		console.log(`\x1b[46m%s\x1b[0m`, x)
		this.saveLog("incoming", x)
	}
	static outgoing(msg) {
		const x = `[OUTGOING] > ${msg}`
		console.log(`\x1b[46m%s\x1b[0m`, x)
		this.saveLog("outgoing", x)
	}
	static unknown(msg) {
		const x = `[UNKNOWN PACKET] > ${msg}`
		console.log(`\x1b[41m%s\x1b[0m`, x)
		this.saveLog("unknown", x)
	}
}

module.exports = Logger