"use strict"

class EPF {
	static handleGetEPFPoints(data, penguin) {
		penguin.sendXt("epfgr", -1, 99, 99)
	}

	static handleGetEPFPoints(data, penguin) {
		penguin.sendXt("epfgf", -1, 1)
	}

	static handleGetCOMMessages(data, penguin) {
		penguin.sendXt("epfgm", -1, 0, `Welcome!|${Math.round((Date.now() / 1000))}|10`)
	}

	static handleEPFGetAgent(data, penguin) {
		penguin.sendXt("epfga", -1, 1)
	}

	static handleSetFieldOpPoints(data, penguin) {
		penguin.sendXt("epfsf", -1, penguin.id)
	}

	static handleEPFSetAgent(data, penguin) {
		penguin.sendXt("epfsa", -1, 1)
	}

	static handleAddEPFItem(data, penguin) {
		const item = parseInt(data[4])

		if (isNaN(item)) return penguin.disconnect()

		penguin.sendXt("epfai", -1, 99)
		penguin.addItem(item)
	}
}

module.exports = EPF