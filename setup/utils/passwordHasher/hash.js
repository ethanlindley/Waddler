"use strict"

const hashPassword = (pass, algorithm) => {
	return require("keccak")(algorithm).update(pass).digest("hex")
}

const algorithm = process.argv[2]
const pass = process.argv[3]

if (algorithm.length == 0) throw new Error("Must specify an algorithm")
if (pass.length == 0) throw new Error("Must specify a password")

switch (algorithm) {
	case "keccak224":
		console.log(`Keccak224 hash: ${hashPassword(pass, "keccak224")}`)
		break
	case "keccak256":
		console.log(`Keccak256 hash: ${hashPassword(pass, "keccak256")}`)
		break
	case "keccak384":
		console.log(`Keccak384 hash: ${hashPassword(pass, "keccak384")}`)
		break
	case "keccak512":
		console.log(`Keccak512 hash: ${hashPassword(pass, "keccak512")}`)
		break

	case "sha3-224":
		console.log(`SHA3-224 hash: ${hashPassword(pass, "sha3-224")}`)
		break
	case "sha3-256":
		console.log(`SHA3-256 hash: ${hashPassword(pass, "sha3-256")}`)
		break
	case "sha3-384":
		console.log(`SHA3-384 hash: ${hashPassword(pass, "sha3-384")}`)
		break
	case "sha3-512":
		console.log(`SHA3-512 hash: ${hashPassword(pass, "sha3-512")}`)
		break

	case "shake128":
		console.log(`Shake128 hash: ${hashPassword(pass, "shake128")}`)
		break
	case "shake256":
		console.log(`Shake256 hash: ${hashPassword(pass, "shake256")}`)
		break

	default:
		throw new Error(`Unknown algorithm: ${algorithm}`)
}