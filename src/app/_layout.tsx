import { Stack } from 'expo-router/stack'
import { useEffect } from 'react'
import { View } from 'react-native'
import '../global.css'

import { setupNotificationHandler } from '@/src/features/notifications/setup-notification-handler'

export default function Layout() {
	useEffect(() => {
		setupNotificationHandler()
	}, [])

	return (
		<Stack
			screenOptions={{
				headerStyle: { backgroundColor: '#fff' },
				headerShadowVisible: false,
				headerTransparent: false,
				headerBlurEffect: undefined,
				headerBackground: () => <View className='flex-1 bg-white' />,
				contentStyle: { backgroundColor: '#fff' }
			}}
		>
			<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
		</Stack>
	)
}
