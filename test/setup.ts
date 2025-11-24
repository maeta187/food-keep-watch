import { afterEach, vi } from 'vitest'
afterEach(() => {
	vi.restoreAllMocks()
})

// Mocks for native modules that are not available in the test environment.
vi.mock('react-native-safe-area-context', () => {
	const inset = { top: 0, right: 0, bottom: 0, left: 0 }
	return {
		SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
		SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
		useSafeAreaInsets: () => inset,
		useSafeAreaFrame: () => ({ x: 0, y: 0, width: 0, height: 0 })
	}
})

vi.mock('@expo/vector-icons/FontAwesome', () => {
	return {
		__esModule: true,
		default: ({ children }: { children?: React.ReactNode }) => children ?? null
	}
})
