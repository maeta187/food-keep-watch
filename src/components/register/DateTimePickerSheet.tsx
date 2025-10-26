import DateTimePicker, {
	DateTimePickerEvent
} from '@react-native-community/datetimepicker'
import { Modal, Platform, Pressable, Text, View } from 'react-native'

import { UI_TEXT } from '@/constants/ui-text'

type Props = {
	visible: boolean
	mode: 'date' | 'time' | 'datetime'
	value: Date
	onChange: (date: Date) => void
	onCancel: () => void
	onConfirm: () => void
}

/**
 * 日付/時間ピッカーをモーダルとして表示する。
 *
 * @param props ピッカー制御に必要な値やハンドラー
 */
export function DateTimePickerSheet({
	visible,
	mode,
	value,
	onChange,
	onCancel,
	onConfirm
}: Props) {
	if (!visible) return null

	const isWeb = Platform.OS === 'web'

	/**
	 * ピッカーの選択結果を受けとり暫定日時を更新する。
	 */
	const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
		if (selectedDate) {
			onChange(selectedDate)
		}
	}

	const displayType = Platform.OS === 'ios' ? 'spinner' : 'default'
	const iosPickerProps =
		Platform.OS === 'ios'
			? ({
					textColor: '#0f172a',
					themeVariant: 'light',
					preferredDatePickerStyle: 'wheels',
					style: { alignSelf: 'stretch' }
				} as const)
			: undefined

	if (isWeb) {
		return (
			<Modal
				visible={visible}
				transparent
				animationType='fade'
				onRequestClose={onCancel}
			>
				<View className='flex-1 justify-end bg-slate-900/40'>
					<View className='rounded-t-3xl bg-white px-5 py-6'>
						<Text className='text-base font-semibold text-slate-900'>
							{UI_TEXT.register.errors.webPickerUnsupported}
						</Text>
						<View className='mt-4 flex-row justify-end'>
							<Pressable
								className='rounded-full bg-slate-900 px-5 py-2'
								onPress={onCancel}
								accessibilityRole='button'
							>
								<Text className='text-sm font-semibold text-white'>
									{UI_TEXT.register.actions.cancel}
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		)
	}

	return (
		<Modal
			visible={visible}
			transparent
			animationType='slide'
			onRequestClose={onCancel}
		>
			<View className='flex-1 justify-end bg-slate-900/40'>
				<View className='rounded-t-3xl bg-white px-4 pb-6 pt-4'>
					<DateTimePicker
						value={value}
						onChange={handleChange}
						mode={mode}
						display={displayType}
						locale='ja-JP'
						{...(iosPickerProps ?? {})}
					/>
					<View className='mt-4 flex-row justify-end gap-4'>
						<Pressable
							className='px-4 py-2'
							onPress={onCancel}
							accessibilityRole='button'
						>
							<Text className='text-sm font-semibold text-slate-500'>
								{UI_TEXT.register.actions.cancel}
							</Text>
						</Pressable>
						<Pressable
							className='rounded-full bg-blue-600 px-5 py-2'
							onPress={onConfirm}
							accessibilityRole='button'
						>
							<Text className='text-sm font-semibold text-white'>
								{UI_TEXT.register.actions.confirm}
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	)
}
