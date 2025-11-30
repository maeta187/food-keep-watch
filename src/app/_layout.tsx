import { Stack } from 'expo-router/stack'
import { useEffect } from 'react'
import '../global.css'

import { setupNotificationHandler } from '@/src/features/notifications/setup-notification-handler'

export default function Layout() {
	useEffect(() => {
		setupNotificationHandler()
	}, [])

	return (
		<Stack>
			<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
		</Stack>
	)
}
