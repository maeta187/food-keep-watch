import { Stack } from 'expo-router'

import { UI_TEXT } from '@/src/constants/ui-text'

export default function SettingsLayout() {
	return (
		<Stack
			screenOptions={{
				headerStyle: { backgroundColor: '#fff' },
				headerShadowVisible: false,
				headerTitleAlign: 'center',
				headerTitleStyle: {
					color: '#0f172a',
					fontWeight: '700',
					fontSize: 18
				},
				headerTintColor: '#0f172a',
				contentStyle: { backgroundColor: '#f8fafc' }
			}}
		>
			<Stack.Screen
				name='index'
				options={{ title: UI_TEXT.settings.title, headerShown: true }}
			/>
			<Stack.Screen
				name='categories'
				options={{ title: UI_TEXT.settings.categories.title }}
			/>
		</Stack>
	)
}
