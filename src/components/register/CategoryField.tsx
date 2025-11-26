import React from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'

import { UI_TEXT } from '@/src/constants/ui-text'

const placeholderColor = '#94a3b8'
type Props = {
	values: string[]
	inputValue: string
	onInputChange: (value: string) => void
	onAdd: () => void
	onRemove: (value: string) => void
	onSelectSuggestion: (value: string) => void
	suggestions: string[]
	errorMessage?: string
}

/**
 * カテゴリー入力・タグ表示・サジェストをまとめたフィールドを描画する。
 *
 * @param props カテゴリー関連の値とハンドラー
 */
export function CategoryField({
	values,
	inputValue,
	onInputChange,
	onAdd,
	onRemove,
	onSelectSuggestion,
	suggestions,
	errorMessage
}: Props) {
	return (
		<View className='space-y-3'>
			<View>
				<Text className='mb-3 text-sm font-semibold text-slate-700'>
					{UI_TEXT.register.fields.category.label}
				</Text>
				{values.length > 0 ? (
					<View className='mb-3'>
						<View className='flex-row flex-wrap gap-2'>
							{values.map((category) => (
								<Pressable
									key={category}
									className='rounded-full bg-blue-50 px-3 py-1'
									onPress={() => {
										onRemove(category)
									}}
									accessibilityRole='button'
								>
									<Text className='text-sm font-semibold text-blue-600'>
										{category}
									</Text>
								</Pressable>
							))}
						</View>
					</View>
				) : null}
				<TextInput
					className='h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900'
					placeholder={UI_TEXT.register.fields.category.placeholder}
					placeholderTextColor={placeholderColor}
					value={inputValue}
					onChangeText={onInputChange}
					onSubmitEditing={onAdd}
					onBlur={onAdd}
					cursorColor='#2563eb'
					returnKeyType='done'
					textAlignVertical='top'
					style={{
						paddingTop: 0,
						paddingBottom: 0
					}}
				/>
				{errorMessage ? (
					<Text className='mt-2 text-xs text-red-500'>{errorMessage}</Text>
				) : (
					<Text className='mt-2 text-xs text-slate-500'>
						{UI_TEXT.register.fields.category.helper}
					</Text>
				)}
			</View>

			<View>
				<View className='mt-2 flex-row flex-wrap gap-2'>
					{suggestions.map((category) => {
						const isSelected = values.includes(category)
						const handlePress = () => {
							if (isSelected) {
								onRemove(category)
								return
							}
							onSelectSuggestion(category)
						}
						return (
							<Pressable
								key={category}
								className={`rounded-full border px-3 py-1 ${
									isSelected
										? 'border-blue-500 bg-blue-50'
										: 'border-slate-200 bg-white'
								}`}
								onPress={handlePress}
								accessibilityRole='button'
								accessibilityState={{ selected: isSelected }}
							>
								<Text
									className={`text-sm ${
										isSelected ? 'text-blue-600' : 'text-slate-600'
									}`}
								>
									{category}
								</Text>
							</Pressable>
						)
					})}
				</View>
			</View>
		</View>
	)
}
