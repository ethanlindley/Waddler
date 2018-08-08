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
}

module.exports = sp