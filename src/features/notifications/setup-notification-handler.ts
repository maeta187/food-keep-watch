import * as Notifications from 'expo-notifications'

export const setupNotificationHandler = (): void => {
	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowBanner: true,
			shouldShowList: true,
			shouldPlaySound: true,
			shouldSetBadge: false
		})
	})
}
