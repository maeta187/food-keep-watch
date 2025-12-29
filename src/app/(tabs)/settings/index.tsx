import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

import { UI_TEXT } from '@/src/constants/ui-text'

export default function SettingsIndex() {
	const router = useRouter()

	return (
		<View className='flex-1 bg-slate-50'>
			<View className='flex-1 px-4 pt-4'>
				<View className='rounded-3xl bg-white p-2 shadow-sm shadow-slate-100'>
					<Pressable
						className='flex-row items-center justify-between rounded-2xl px-3 py-4 active:bg-slate-50'
						onPress={() => {
							router.push('/(tabs)/settings/categories')
						}}
						accessibilityRole='button'
					>
						<View className='flex-1 pr-3'>
							<Text className='text-base font-semibold text-slate-900'>
								{UI_TEXT.settings.items.categories.title}
							</Text>
							<Text className='mt-1 text-xs text-slate-600'>
								{UI_TEXT.settings.items.categories.description}
							</Text>
						</View>
						<FontAwesome name='chevron-right' size={16} color='#94a3b8' />
					</Pressable>
				</View>
			</View>
		</View>
	)
}
