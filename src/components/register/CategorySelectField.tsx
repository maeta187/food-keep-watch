import React from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'

import { UI_TEXT } from '@/src/constants/ui-text'

type Props = {
	values: string[]
	suggestions: string[]
	onToggle: (value: string) => void
	errorMessage?: string
	isLoading?: boolean
}

/**
 * 既存のカテゴリー候補から紐づけるものを選択するフィールド。
 */
export function CategorySelectField({
	values,
	suggestions,
	onToggle,
	errorMessage,
	isLoading
}: Props) {
	return (
		<View>
			<View className='mb-3'>
				<Text className='text-sm font-semibold text-slate-700'>
					{UI_TEXT.register.fields.category.label}
				</Text>
				<Text className='text-xs text-slate-500'>
					{UI_TEXT.register.fields.category.selectionHelper}
				</Text>
			</View>

			<View className='mb-2'>
				{values.length > 0 ? (
					<View className='flex-row flex-wrap gap-2'>
						{values.map((category) => (
							<Pressable
								key={category}
								className='rounded-full bg-blue-50 px-3 py-1'
								onPress={() => {
									onToggle(category)
								}}
								accessibilityRole='button'
								accessibilityState={{ selected: true }}
							>
								<Text className='text-sm font-semibold text-blue-600'>
									{category}
								</Text>
							</Pressable>
						))}
					</View>
				) : (
					<Text className='text-xs text-slate-500'>
						{UI_TEXT.register.fields.category.emptySelection}
					</Text>
				)}
			</View>

			<View>
				<Text className='mb-2 text-xs font-semibold text-slate-600'>
					{UI_TEXT.register.fields.category.suggestionsLabel}
				</Text>
				{isLoading ? (
					<View className='flex-row items-center gap-2'>
						<ActivityIndicator size='small' color='#2563eb' />
						<Text className='text-xs text-slate-500'>
							{UI_TEXT.register.fields.category.loading}
						</Text>
					</View>
				) : (
					<View className='flex-row flex-wrap gap-2'>
						{suggestions.map((category) => {
							const isSelected = values.includes(category)
							return (
								<Pressable
									key={category}
									className={`rounded-full border px-3 py-1 ${
										isSelected
											? 'border-blue-500 bg-blue-50'
											: 'border-slate-200 bg-white'
									}`}
									onPress={() => {
										onToggle(category)
									}}
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
				)}
			</View>

			{errorMessage ? (
				<Text className='text-xs text-red-500'>{errorMessage}</Text>
			) : null}
		</View>
	)
}
