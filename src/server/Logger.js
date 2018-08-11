"use strict"

const fs = require("fs")
const momentjs = require("moment")
const moment = momentjs.utc().local()

class Logger {
	static saveLog(lvl, msg) {
		fs.appendFile(`${__dirname}\\logs\\${lvl}.log`, `{${this.getCustomDate()}} - ${msg}\r\n`, (err) => {
			if (err) throw err
		})
	}
	static getCustomDate() {
		const second = moment.seconds()
		const minute = moment.minutes()
		const hour = moment.hours()

		const serverDate = momentjs(`${hour} ${minute} ${second}`, "HH mm ss")

		return serverDate.format("h:mm:ss a")
	}
	static info(msg) {
		const x = `[INFO] > ${msg}`
		console.log(`\x1b[42m%s\x1b[0m`, x)
		this.saveLog("info", x)
	}
	static warn(msg) {
		const x = `[WARN] > ${msg}`
		console.log(`\x1b[43m%s\x1b[0m`, x)
		this.saveLog("warn", x)
	}
	static error(msg) {
		const x = `[ERROR] > ${msg}`
		console.log(`\x1b[41m%s\x1b[0m`, x)
		this.saveLog("error", x)
	}
	static cheat(msg) {
		const x = `[CHEAT] > ${msg}`
		console.log(`\x1b[43m%s\x1b[0m`, x)
		this.saveLog("cheat", x)
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