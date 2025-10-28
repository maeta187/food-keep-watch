import { Pressable, Text, View } from 'react-native'

import { UI_TEXT } from '@/src/constants/ui-text'

type OptionValue = 'bestBefore' | 'useBy'

type Props = {
	value: OptionValue
	onChange: (value: OptionValue) => void
}

/**
 * 賞味期限/消費期限の区分を選択するラジオボタン群を描画する。
 *
 * @param props 現在値と更新ハンドラー
 */
export function ExpirationTypeField({ value, onChange }: Props) {
	const options: { label: string; value: OptionValue }[] = [
		{ value: 'bestBefore', label: UI_TEXT.register.fields.type.bestBefore },
		{ value: 'useBy', label: UI_TEXT.register.fields.type.useBy }
	]

	return (
		<>
			<Text className='mb-3 text-sm font-semibold text-slate-700'>
				{UI_TEXT.register.fields.type.label}
			</Text>
			<View className='flex-row items-center gap-6'>
				{options.map((option) => (
					<RadioOption
						key={option.value}
						label={option.label}
						selected={value === option.value}
						onPress={() => {
							onChange(option.value)
						}}
					/>
				))}
			</View>
		</>
	)
}

type RadioOptionProps = {
	label: string
	selected: boolean
	onPress: () => void
}

/**
 * ラジオボタンの単一項目を描画する。
 *
 * @param props 表示ラベルと選択状態
 */
function RadioOption({ label, selected, onPress }: RadioOptionProps) {
	return (
		<Pressable
			className='flex-row items-center'
			onPress={onPress}
			accessibilityRole='radio'
			accessibilityState={{ selected }}
		>
			<View
				className={`size-5 items-center justify-center rounded-full border-2 ${
					selected ? 'border-blue-500' : 'border-slate-300'
				}`}
			>
				{selected ? (
					<View className='size-2.5 rounded-full bg-blue-500' />
				) : null}
			</View>
			<Text className='ml-2 text-sm text-slate-700'>{label}</Text>
		</Pressable>
	)
}
