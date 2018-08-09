"use strict"

class sp
{
	/*
	 * Returns int of current date.
	 */
	static dateToInt()
	{
		const date = new Date()
		return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
	}
	/*
	 * Returns an array of patched items.
	 */
	static getPatchedItems()
	{
		return [413, 444]
	}
}

module.exports = sp