/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const projectRoot = __dirname
const config = getDefaultConfig(projectRoot)
const { assetExts } = config.resolver

config.resolver.alias = {
	...(config.resolver.alias ?? {}),
	'@': projectRoot,
	types: path.join(projectRoot, 'src/types')
}

// Allow Metro to load Drizzle SQL migration files as plain text assets.
config.resolver.assetExts = [...(assetExts ?? []), 'sql']

module.exports = withNativeWind(config, { input: './src/global.css' })
