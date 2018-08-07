"use strict"

let rndSeed = 327680

class RND
{
	static Random(val)
	{
		rndSeed = (rndSeed * 1140671485 + 1280163) % 16777216
		return Math.ceil((rndSeed / 16777216) * val)
	}

	static getSeed()
	{
		return rndSeed
	}

	static setSeed(seed)
	{
		rndSeed = Math.abs(seed)
	}
}

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