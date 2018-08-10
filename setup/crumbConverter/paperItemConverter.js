"use strict"

/*
 * Used to convert icer.ink's paper item format to Waddler's paper item format.
 * Written by: Zaseth
 */

class paperItemConverter
{
	static convertPaperItem()
	{
		let obj = {}

		const options = {
			method: "GET",
			uri: "https://icer.ink/media1.clubpenguin.com/play/en/web_service/game_configs/paper_items.json",
			headers:
			{
				"User-Agent": "Crumbs downloader",
				"Content-Type": "application/json"
			}
		}

		require("request-promise")(options).then((res) =>
		{
			res = JSON.parse(res)

			if (res.length > 0)
			{
				console.log("Grabbed icer.ink's crumbs")

				for (const i in res)
				{
					const itemid = res[i]["paper_item_id"]
					const name = res[i]["label"]
					const cost = res[i]["cost"]
					const member = res[i]["is_member"]

					const id = res[i]["type"]
					const type = id == 1 ? "color" : id == 2 ? "head" : id == 3 ? "face" : id == 4 ? "neck" : id == 5 ? "body" : id == 6 ? "hand" : id == 7 ? "feet" : id == 8 ? "pin" : id == 9 ? "photo" : id == 10 ? "other" : console.error(`Unknown item type: ${id}`)

					obj[itemid] = {
						name: name,
						cost: cost,
						member: member,
						type: type
					}
				}

				require("fs").appendFile("items.json", JSON.stringify(obj), (err) =>
				{
					if (err) console.error(err)

					console.log("Converted and stored crumbs as items.json")
				})
			}
		}).catch((err) =>
		{
			console.error(err)
		})
	}
}

module.exports = paperItemConverter