"use strict"

/*
 * Used to convert icer.ink's room format to Waddler's room format.
 * Written by: Zaseth
 */

class roomConverter
{
	static convertRoom()
	{
		let obj = {}

		const options = {
			method: "GET",
			uri: "https://icer.ink/media1.clubpenguin.com/play/en/web_service/game_configs/rooms.json",
			headers:
			{
				"User-Agent": "Crumbs downloader",
				"Content-Type": "application/json"
			}
		}

		require("request-promise")(options).then((res) =>
		{
			res = JSON.parse(res)

			console.log("Grabbed icer.ink's room crumbs")

			for (const i in res)
			{
				const roomid = res[i]["room_id"]
				const name = res[i]["display_name"]
				const maxusers = res[i]["max_users"]

				obj[roomid] = {
					"Name": name,
					"MaxUsers": maxusers
				}
			}

			require("fs").appendFile("rooms.json", JSON.stringify(obj), (err) =>
			{
				if (err) console.error(err)

				console.log("Converted and stored crumbs as rooms.json")
			})

		}).catch((err) =>
		{
			console.error(err)
		})
	}
}

module.exports = roomConverter