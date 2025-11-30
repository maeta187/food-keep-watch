import { afterEach, vi } from 'vitest'
afterEach(() => {
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
