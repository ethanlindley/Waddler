"use strict"

const isDebug = require("../config").debug

class Logger {
	static saveLog(lvl, msg) {
		require("fs").appendFile(`${__dirname}\\logs\\${lvl}.log`, `${this.getLogTime(new Date())} - ${msg}\r\n`, (err) => {
			if (err) throw err
		})
	}
	static getLogTime(date) {
		return `{${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()} ${date.getUTCHours() >= 12 ? "pm" : "am"}}`
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
		this.saveLog("incoming", isDebug ? this.var_dump(msg) : x)
	}
	static outgoing(msg) {
		const x = `[OUTGOING] > ${msg}`
		console.log(`\x1b[46m%s\x1b[0m`, x)
		this.saveLog("outgoing", isDebug ? this.var_dump(msg) : x)
	}
	static unknown(msg) {
		const x = `[UNKNOWN PACKET] > ${msg}`
		console.log(`\x1b[41m%s\x1b[0m`, x)
		this.saveLog("unknown", isDebug ? this.var_dump(msg) : x)
	}
	static var_dump(arr) {
		if (arr.charAt(0) == "<") return arr

		arr = arr.split("%")
		arr.shift()

		if (arr.includes("")) arr.splice(arr.length - 1, 1)

		let dumpStr = "Array\r\n(\r\n"

		for (const i in arr) dumpStr += `    ${i} => ${isNaN(arr[i]) ? `String(${arr[i]})` : `Number(${arr[i]})`}\r\n`

		dumpStr += ")"

		return dumpStr
	}
}

module.exports = Logger