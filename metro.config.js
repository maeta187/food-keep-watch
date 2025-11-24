/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const projectRoot = __dirname
const config = getDefaultConfig(projectRoot)
const { assetExts, sourceExts } = config.resolver

config.resolver.alias = {
	...(config.resolver.alias ?? {}),
	'@': projectRoot,
	types: path.join(projectRoot, 'src/types')
}

// Treat Drizzle SQL migration files as assets (raw text) so Metro doesn't try to parse them as JS.
config.resolver.assetExts = [...(assetExts ?? []), 'sql']
config.resolver.sourceExts = (sourceExts ?? []).filter((ext) => ext !== 'sql')

module.exports = withNativeWind(config, { input: './src/global.css' })
