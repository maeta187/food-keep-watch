/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const projectRoot = __dirname
const config = getDefaultConfig(projectRoot)

config.resolver.alias = {
	...(config.resolver.alias ?? {}),
	'@': projectRoot,
	types: path.join(projectRoot, 'src/types')
}

module.exports = withNativeWind(config, { input: './global.css' })
