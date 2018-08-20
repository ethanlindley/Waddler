"use strict"

class Censor {
	static censorCheck(str) {
		const regexp = new RegExp(require("./dictionary").join("|"), "gi")

		if (this.containsSwear(str, regexp)) {
			return str.replace(regexp, (s) => {
				let i = 0,
					asterisks = ""

				while (i < s.length) {
					asterisks += "*"
					i++
				}

				return asterisks
			})
		} else {
			return str
		}
	}

	static containsSwear(str, regexp) {
		if (!regexp) {
			const regexp = new RegExp(require("./dictionary").join("|"), "gi")
		}
		return str.match(regexp) == null ? false : true
	}
}

module.exports = Censor