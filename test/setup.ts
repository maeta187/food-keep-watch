import { afterEach, beforeEach, vi } from 'vitest'

// React NativeのPressableがテスト環境で<button>に変換される際の警告を抑制
// 実際のReact NativeアプリではPressableはネイティブコンポーネントに変換されるため問題なし
const originalError = console.error
beforeEach(() => {
	console.error = (...args: unknown[]) => {
		const message = typeof args[0] === 'string' ? args[0] : String(args[0])
		// <button>のネスト警告のみを抑制
		if (
			message.includes('<button> cannot be a descendant of <button>') ||
			message.includes('cannot contain a nested <button>')
		) {
			return
		}
		originalError.call(console, ...args)
	}
})

afterEach(() => {
	console.error = originalError
	vi.restoreAllMocks()
})

vi.mock('expo-notifications', () => {
	const permissionPayload = {
		granted: true,
		status: 'granted',
		canAskAgain: true,
		expires: 'never'
	}

	return {
		__esModule: true,
		getPermissionsAsync: vi.fn(async () => permissionPayload),
		requestPermissionsAsync: vi.fn(async () => permissionPayload),
		scheduleNotificationAsync: vi.fn(async () => 'mock-notification-id'),
		setNotificationHandler: vi.fn(),
		IosAuthorizationStatus: {
			NOT_DETERMINED: 0,
			DENIED: 1,
			AUTHORIZED: 2,
			PROVISIONAL: 3,
			EPHEMERAL: 4
		},
		SchedulableTriggerInputTypes: {
			CALENDAR: 'calendar',
			DAILY: 'daily',
			WEEKLY: 'weekly',
			MONTHLY: 'monthly',
			YEARLY: 'yearly',
			DATE: 'date',
			TIME_INTERVAL: 'timeInterval'
		},
		PermissionStatus: {
			GRANTED: 'granted',
			UNDETERMINED: 'undetermined',
			DENIED: 'denied'
		}
	}
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
