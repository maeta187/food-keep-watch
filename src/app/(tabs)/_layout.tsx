import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'

import { UI_TEXT } from '@/src/constants/ui-text'

export default function TabLayout() {
	return (
		<Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
			<Tabs.Screen
				name='index'
				options={{
					title: UI_TEXT.tabs.homeTitle,
					tabBarIcon: ({ color }) => (
						<FontAwesome size={28} name='list-alt' color={color} />
					)
				}}
			/>
			<Tabs.Screen
				name='register'
				options={{
					title: UI_TEXT.tabs.registerTitle,
					tabBarIcon: ({ color }) => (
						<FontAwesome size={28} name='plus' color={color} />
					)
				}}
			/>
			<Tabs.Screen
				name='settings'
				options={{
					title: UI_TEXT.tabs.settingsTitle,
					tabBarIcon: ({ color }) => (
						<FontAwesome size={28} name='cog' color={color} />
					)
				}}
			/>
		</Tabs>
	)
}
