import { Text, View } from 'react-native'

import { UI_TEXT } from '@/src/constants/ui-text'

export default function Tab() {
	return (
		<View className='flex-1 items-center justify-center bg-white'>
			<Text className='text-base text-slate-900' selectable>
				{UI_TEXT.tabs.settingsPlaceholder}
			</Text>
		</View>
	)
}
