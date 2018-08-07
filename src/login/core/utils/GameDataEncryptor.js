"use strict"

class GameDataEncryptor
{
	static hashPassword(pass)
	{
		return require("keccak")("keccak256").update(password).digest("hex")
	}

	static generateRandomKey(len)
	{
		return require("crypto").randomBytes(len / 2).toString("hex")
	}
}

module.exports = GameDataEncryptor