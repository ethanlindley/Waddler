"use strict"

const _ = require("underscore")

const hashPassword = (pass) => {
	return require("keccak")("keccak256").update(pass).digest("hex")
}

const handleRegister = (body, database, res) => {
	const [username, password, color] = [body.username, body.password, body.color]

	if (_.escape(username) != username) return res.code(200).send("Your username contains illegal characters")
	if (_.escape(password) != password) return res.code(200).send("Your password contains illegal characters")

	database.usernameExists(username).then((result) => {
		const count = result["count(*)"]

		if (count != 0) return res.code(200).send("That username already exists!")

		const hash = hashPassword(password)

		database.insertPenguin(username, hash, color).then((result) => {
			console.log(`${username} registered`)

			return res.code(200).send(`Successfully registered with the username ${username}`)
		}).catch((err) => {
			console.error(err)

			return res.code(400).send("Something went wrong while trying to insert your data")
		})
	}).catch((err) => {
		console.error(err)

		return res.code(400).send("Something went wrong while checking if your username is unique")
	})
}

module.exports = function(fastify, opts, next) {
	fastify.post("/registerPost", (req, res) => {
		return handleRegister(req.body, opts.database, res)
	})
	fastify.get("/registerPost", (req, res) => {
		return res.code(400).send("That's not going to work my lad")
	})
	next()
}