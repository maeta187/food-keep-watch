import FontAwesome from '@expo/vector-icons/FontAwesome'
import React from 'react'
import { Pressable, Text } from 'react-native'

type Props = {
	label: string
	placeholder: string
	valueLabel?: string
	icon: 'calendar' | 'clock-o'
	error?: string
	onPress: () => void
}

/**
 * モーダルピッカーを開くための擬似入力フィールドを描画する。
 *
 * @param props フィールド構成要素
 */
export function PickerField({
	label,
	placeholder,
	valueLabel,
	icon,
	error,
	onPress
}: Props) {
	const borderClass = error
		? 'border-red-400 bg-red-50/30'
		: 'border-slate-200 bg-slate-50'
	const textClass = valueLabel ? 'text-slate-900' : 'text-slate-400'
	const displayValue = valueLabel ?? placeholder

	return (
		<>
			<Text className='mb-3 text-sm font-semibold text-slate-700'>{label}</Text>
			<Pressable
				className={`h-12 flex-row items-center rounded-2xl border ${borderClass} px-4`}
				onPress={onPress}
				accessibilityRole='button'
			>
				<FontAwesome name={icon} size={18} color='#2563eb' />
				<Text className={`ml-3 text-base ${textClass}`}>{displayValue}</Text>
			</Pressable>
			{error ? <Text className='text-xs text-red-500'>{error}</Text> : null}
		</>
	)
}
