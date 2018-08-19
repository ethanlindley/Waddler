"use strict"

const Logger = require("../../Logger")
const Plugins = require("../../../config").Plugins

class pluginLoader {
	constructor() {
		this.plugins = {}

		this.loadPlugins()
	}

	loadPlugins() {
		for (const plugin in Plugins) {
			if (Plugins[plugin].enabled) {
				this.plugins[Plugins[plugin].name] = require(`../plugins/${Plugins[plugin].name}/${Plugins[plugin].name}`)
			}
		}
		Logger.info(`Loaded ${Object.keys(this.plugins).length} plugins`)
	}

	getPlugin(plugin) {
		return this.plugins[plugin]
	}
}

module.exports = pluginLoader