import { Text, TextInput } from 'react-native'

const placeholderColor = '#94a3b8'

type Props = {
	label: string
	placeholder: string
	value: string
	error?: string
	onChangeText: (value: string) => void
	onBlur?: () => void
}

/**
 * ラベル付きテキスト入力を描画する。
 *
 * @param props フィールド構成要素
 */
export function TextField({
	label,
	placeholder,
	value,
	error,
	onChangeText,
	onBlur
}: Props) {
	const borderClass = error
		? 'border-red-400 bg-red-50/30'
		: 'border-slate-200 bg-slate-50'
	const textColor = error ? 'text-red-600' : 'text-slate-900'

	return (
		<>
			<Text className='mb-3 text-sm font-semibold text-slate-700'>{label}</Text>
			<TextInput
				className={`h-12 w-full rounded-2xl border ${borderClass} px-4 text-base ${textColor}`}
				placeholder={placeholder}
				placeholderTextColor={placeholderColor}
				value={value}
				onChangeText={onChangeText}
				onBlur={onBlur}
				cursorColor='#2563eb'
				returnKeyType='done'
				textAlignVertical='center'
				style={{ paddingTop: 0, paddingBottom: 0, height: 48, lineHeight: 48 }}
			/>
			{error ? <Text className='text-xs text-red-500'>{error}</Text> : null}
		</>
	)
}
