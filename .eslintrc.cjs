module.exports = {
	root: true,
	extends: [
		'universe/native',
		'universe/shared/typescript-analysis',
		'plugin:tailwindcss/recommended',
		'prettier'
	],
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname
	},
	settings: {
		tailwindcss: {
			callees: ['cn'],
			classRegex: 'class(Name)?'
		}
	},
	rules: {
		'tailwindcss/classnames-order': 'warn',
		'tailwindcss/no-custom-classname': 'off'
	}
}
