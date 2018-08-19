"use strict"

class Censor {
	static censorCheck(str) {
		const regexp = new RegExp(require("./dictionary").join("|"), "gi")
		const containsSwear = str.match(regexp) == null ? false : true

		if (containsSwear) {
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
}

module.exports = Censor