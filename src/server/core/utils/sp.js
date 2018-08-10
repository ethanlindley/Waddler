"use strict"

class sp
{
	static dateToInt()
	{
		const date = new Date()
		return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
	}

	static getPatchedItems()
	{
		return [413, 444]
	}
}

module.exports = sp