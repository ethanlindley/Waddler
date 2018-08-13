"use strict"

class GameDataEncryptor {
	static hashPassword(pass) {
		return require("keccak")("keccak256").update(pass).digest("hex")
	}
	static generateRandomKey(len) {
		return require("crypto").randomBytes(len / 2).toString("hex")
	}
	static decryptZaseth(str, key) {
		let keyIndex = 0x00,
			res = ""
		for (let i = 0x00; i < str.length; i++) {
			let charCode = str.charCodeAt(i),
				firstChar = str.charCodeAt(i + 0x01),
				secondChar = key.charCodeAt(keyIndex)
			charCode &= 0x1F, firstChar &= 0x1F, firstChar *= 0x10
			res += String.fromCharCode((firstChar | charCode) ^ secondChar)
			keyIndex++
			if (keyIndex >= key.length) keyIndex = 0x00
			i++
		}
		return res
	}
}

module.exports = GameDataEncryptor