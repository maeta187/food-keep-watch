import React from 'react'
import { Pressable, Text, View } from 'react-native'

import { UI_TEXT } from '@/src/constants/ui-text'
import { type FoodListItem } from '@/src/features/foods/get-food-list'
import { formatDate, formatDateTime } from '@/src/utils/date-format'

type Props = {
	item: FoodListItem
	onPress?: (item: FoodListItem) => void
}

const DAY_IN_MS = 24 * 60 * 60 * 1000
const BADGE_CONFIG = {
	warningDays: 7,
	dangerDays: 3
}

const buildBadge = (expirationDate: Date | null) => {
	if (!expirationDate) {
		return null
	}

	const today = new Date()
	const startOfToday = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate()
	)
	const startOfTarget = new Date(
		expirationDate.getFullYear(),
		expirationDate.getMonth(),
		expirationDate.getDate()
	)

	const diffDays = Math.floor(
		(startOfTarget.getTime() - startOfToday.getTime()) / DAY_IN_MS
	)

	if (diffDays < 0) {
		return {
			label: UI_TEXT.home.list.expiredLabel,
			className: 'bg-rose-100 text-rose-700 border border-rose-200'
		}
	}

	const dangerThreshold = BADGE_CONFIG.dangerDays
	const warningThreshold = BADGE_CONFIG.warningDays
	return {
		label:
			diffDays === 0
				? UI_TEXT.home.list.dueTodayLabel
				: `${UI_TEXT.home.list.daysPrefix}${diffDays}${UI_TEXT.home.list.daysSuffix}`,
		className:
			diffDays <= dangerThreshold
				? 'bg-rose-100 text-rose-700 border border-rose-200'
				: diffDays <= warningThreshold
					? 'bg-amber-100 text-amber-800 border border-amber-200'
					: 'bg-emerald-100 text-emerald-700 border border-emerald-200'
	}
}

export const FoodListCard = ({ item, onPress }: Props) => {
	const badge = buildBadge(item.expirationDate)

	// エラー対策: expirationTypeは 'bestBefore' | 'useBy' 型だが、念のためキー存在チェック
	const expirationTypes = UI_TEXT.home.list.expirationTypes
	const expirationLabel = expirationTypes.hasOwnProperty(item.expirationType)
		? expirationTypes[item.expirationType as keyof typeof expirationTypes]
		: expirationTypes.bestBefore

	const expirationText =
		formatDate(item.expirationDate ?? undefined) ??
		UI_TEXT.home.list.expirationFallback
	const notificationText =
		formatDateTime(item.notificationDateTime ?? undefined) ??
		UI_TEXT.home.list.notificationFallback

	const handlePress = () => {
		onPress?.(item)
	}

	return (
		<Pressable
			className='mb-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm'
			onPress={handlePress}
			accessibilityRole='button'
			accessibilityLabel={`${item.name}の詳細を開く`}
		>
			<View className='flex-row items-center justify-between'>
				<Text className='text-lg font-semibold text-slate-900'>
					{item.name}
				</Text>
				{badge ? (
					<Text
						className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
					>
						{badge.label}
					</Text>
				) : null}
			</View>

			<Text className='mt-2 text-sm text-slate-700'>
				{expirationLabel}：{expirationText}
			</Text>

			<View className='mt-2 flex-row items-center gap-2'>
				<Text className='text-xs font-medium text-slate-500'>
					{UI_TEXT.home.list.storageLabel}
				</Text>
				<Text className='text-sm text-slate-800'>
					{item.storageLocation ?? UI_TEXT.home.list.storageFallback}
				</Text>
			</View>

			{item.notificationDateTime ? (
				<View className='mt-1 flex-row items-center gap-2'>
					<Text className='text-xs font-medium text-slate-500'>
						{UI_TEXT.home.list.notificationLabel}
					</Text>
					<Text className='text-sm text-slate-800'>{notificationText}</Text>
				</View>
			) : null}

			<View className='mt-3'>
				<Text className='text-xs font-medium text-slate-500'>
					{UI_TEXT.home.list.categoriesLabel}
				</Text>
				<View className='mt-2 flex-row flex-wrap gap-2'>
					{item.categories.length > 0 ? (
						item.categories.map((category, index) => (
							<Text
								key={`${category}-${index}`}
								className='rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600'
							>
								{category}
							</Text>
						))
					) : (
						<Text className='text-xs text-slate-500'>
							{UI_TEXT.home.list.categoriesFallback}
						</Text>
					)}
				</View>
			</View>
		</Pressable>
	)
}
