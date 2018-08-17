"use strict"

/*
 * Converts icer.ink's crumbs to be used with Waddler.
 * Fully written by Zaseth.
 * Stamp converter made by Unspirited.
 */

const request = require("request-promise")
const fs = require("fs")

class convertCrumbs {
	static getOptions(file) {
		return {
			method: "GET",
			uri: `https://icer.ink/media1.clubpenguin.com/play/en/web_service/game_configs/${file}.json`,
			headers: {
				"User-Agent": "Crumbs downloader by Zaseth",
				"Content-Type": "application/json"
			}
		}
	}

	static convertPaperItems() {
		let obj = {}

		request(this.getOptions("paper_items")).then((result) => {
			result = JSON.parse(result)

			console.log("Downloaded paper items from icer.ink")

			for (const i in result) {
				const itemid = result[i]["paper_item_id"]
				const name = result[i]["label"]
				const cost = result[i]["cost"]
				const member = result[i]["is_member"]

				const id = result[i]["type"]
				const type = id == 1 ? "color" : id == 2 ? "head" : id == 3 ? "face" : id == 4 ? "neck" : id == 5 ? "body" : id == 6 ? "hand" : id == 7 ? "feet" : id == 8 ? "pin" : id == 9 ? "photo" : id == 10 ? "other" : console.error(`Unknown item type: ${id}`)

				obj[itemid] = {
					name: name,
					cost: parseInt(cost),
					member: member,
					type: type
				}
			}
			fs.appendFile("items.json", JSON.stringify(obj), (error) => {
				if (error) console.error(error)

				console.log("Converted and saved paper items")
			})
		}).catch((error) => {
			console.error(error)
		})
	}

	static convertRooms() {
		let obj = {}

		request(this.getOptions("rooms")).then((result) => {
			result = JSON.parse(result)

			console.log("Downloaded rooms from icer.ink")

			for (const i in result) {
				const roomid = result[i]["room_id"]
				const name = result[i]["display_name"]
				const maxusers = result[i]["max_users"]

				obj[roomid] = {
					"Name": name,
					"MaxUsers": parseInt(maxusers)
				}
			}
			fs.appendFile("rooms.json", JSON.stringify(obj), (error) => {
				if (error) console.error(error)

				console.log("Converted and saved rooms")
			})
		}).catch((error) => {
			console.error(error)
		})
	}

	static convertIgloos() {
		let obj = {}

		request(this.getOptions("igloos")).then((result) => {
			result = JSON.parse(result)

			console.log("Downloaded igloos from icer.ink")

			for (const i in result) {
				const iglooid = result[i]["igloo_id"]
				const cost = result[i]["cost"]
				const name = result[i]["name"]

				obj[iglooid] = {
					"cost": parseInt(cost),
					"name": name
				}
			}
			fs.appendFile("igloos.json", JSON.stringify(obj), (error) => {
				if (error) console.error(error)

				console.log("Converted and saved igloos")
			})
		}).catch((error) => {
			console.error(error)
		})
	}

	static convertFurniture() {
		let obj = {}

		request(this.getOptions("furniture_items")).then((result) => {
			result = JSON.parse(result)

			console.log("Downloaded furniture items from icer.ink")

			for (const i in result) {
				const furnitureid = result[i]["furniture_item_id"]
				const cost = result[i]["cost"]
				const name = result[i]["label"]

				obj[furnitureid] = {
					"cost": parseInt(cost),
					"name": name
				}
			}
			fs.appendFile("furniture.json", JSON.stringify(obj), (error) => {
				if (error) console.error(error)

				console.log("Converted and saved furniture items")
			})
		}).catch((error) => {
			console.error(error)
		})
	}

	static convertFloors() {
		let obj = {}

		request(this.getOptions("igloo_floors")).then((result) => {
			result = JSON.parse(result)

			console.log("Downloaded igloo floors from icer.ink")

			for (const i in result) {
				const floorid = result[i]["igloo_floor_id"]
				const cost = result[i]["cost"]
				const name = result[i]["label"]

				obj[floorid] = {
					"cost": parseInt(cost),
					"name": name
				}
			}
			fs.appendFile("floors.json", JSON.stringify(obj), (error) => {
				if (error) console.error(error)

				console.log("Converted and saved igloo floors")
			})
		}).catch((error) => {
			console.error(error)
		})
	}

	static convertPins() {
		let obj = {}

		fs.readFile("./pins.json", (error, data) => {
			if (error) console.error(error)

			data = JSON.parse(data)

			console.log("Pins have been read")

			for (const i in data) {
				const pinid = data[i]["paper_item_id"]
				const name = data[i]["label"]
				const unix = data[i]["unix"]

				obj[pinid] = {
					"name": name,
					"unix": parseInt(unix)
				}
			}
			fs.appendFile("convertedPins.json", JSON.stringify(obj), (error) => {
				if (error) console.error(error)

				console.log("Converted and saved pins with UNIX timestamp")
			})
		})
	}

	static convertStamps() { // By Unspirited
		let obj = {}

		request(this.getOptions("stamps")).then((result) => {
			let stampid = 0

			console.log("Downloaded stamps from icer.ink")

			JSON.parse(result, (key, value) => {
				if (key == "stamp_id") stampid = value
				if (stampid != 0 && key == "name") {
					obj[stampid] = {
						"name": value
					}
					stampid = 0
				}
			})
			fs.appendFile("stamps.json", JSON.stringify(obj), (error) => {
				if (error) console.error(error)

				console.log("Converted and saved stamps")
			})
		}).catch((error) => {
			console.error(error)
		})
	}
}

module.exports = convertCrumbs