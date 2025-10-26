import { Text, View } from 'react-native'

import { UI_TEXT } from '@/constants/ui-text'

/**
 * フォームのヘッダーセクションを描画する。
 */
export function HeaderSection() {
	return (
		<View className='border-b border-slate-200 px-4 pb-6'>
			<Text className='text-xl font-bold text-slate-900'>
				{UI_TEXT.register.sectionHeading}
			</Text>
			<Text className='mt-2 text-sm leading-6 text-slate-500'>
				{UI_TEXT.register.sectionDescription}
			</Text>
		</View>
	)
}
