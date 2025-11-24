import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./test/setup.ts'],
		deps: {
			inline: [
				/react-native/,
				'@react-native-community/datetimepicker',
				'@testing-library/react-native',
				'react-native-safe-area-context',
				'react-native-reanimated',
				'react-test-renderer'
			],
			optimizer: {
				ssr: {
					include: [
						'@testing-library/react-native',
						'react-native',
						'@react-native-community/datetimepicker',
						'react-native-safe-area-context',
						'react-native-reanimated',
						'react-test-renderer'
					]
				}
			}
		},
		coverage: {
			provider: 'v8',
			reporter: ['text', 'text-summary', 'lcov', 'html']
		}
	},
	resolve: {
		alias: [
			{
				find: /^react-native$/,
				replacement: path.resolve(__dirname, 'test/mocks/react-native.ts')
			},
			{
				find: /^react-native\/.*/,
				replacement: path.resolve(
					__dirname,
					'test/mocks/react-native-submodule.ts'
				)
			},
			{
				find: '@react-native-community/datetimepicker',
				replacement: path.resolve(
					__dirname,
					'test/mocks/react-native-datetimepicker.ts'
				)
			},
			{
				find: 'react-native/Libraries/Animated/NativeAnimatedHelper',
				replacement: path.resolve(
					__dirname,
					'test/mocks/react-native-native-animated.ts'
				)
			},
			{
				find: /^@\//,
				replacement: path.resolve(__dirname, '') + '/'
			}
		]
	},
	server: {}
})
