import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'

import { UI_TEXT } from '../../constants/ui-text'

export default function TabLayout() {
	return (
		<Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
			<Tabs.Screen
				name='index'
				options={{
					title: UI_TEXT.tabs.homeTitle,
					tabBarIcon: ({ color }) => (
						<FontAwesome size={28} name='home' color={color} />
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
