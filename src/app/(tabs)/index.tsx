import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	RefreshControl,
	Text,
	View
} from 'react-native'

import { FoodListCard } from '@/src/components/foods/FoodListCard'
import { UI_TEXT } from '@/src/constants/ui-text'
import {
	getFoodList,
	type FoodListItem
} from '@/src/features/foods/get-food-list'

export default function Tab() {
	const [foods, setFoods] = useState<FoodListItem[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const loadFoods = useCallback(
		async (mode: 'initial' | 'refresh' = 'initial') => {
			if (mode === 'initial') {
				setIsLoading(true)
			}
			if (mode === 'refresh') {
				setIsRefreshing(true)
			}
			setError(null)

			try {
				const items = await getFoodList()
				setFoods(items)
			} catch (err) {
				console.error('食品一覧の取得に失敗しました', err)
				setError(UI_TEXT.home.errors.loadFailed)
			} finally {
				if (mode === 'initial') {
					setIsLoading(false)
				}
				if (mode === 'refresh') {
					setIsRefreshing(false)
				}
			}
		},
		[]
	)

	useFocusEffect(
		useCallback(() => {
			loadFoods().catch((err) => {
				console.error('食品一覧の取得に失敗しました', err)
			})
		}, [loadFoods])
	)

	const renderHeader = () => (
		<View className='bg-slate-50 px-4 pb-4 pt-12'>
			<Text className='text-2xl font-semibold text-slate-900'>
				{UI_TEXT.home.title}
			</Text>
			<Text className='mt-1 text-sm text-slate-600'>
				{UI_TEXT.home.description}
			</Text>

			{error ? (
				<View className='mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3'>
					<Text className='text-sm font-semibold text-rose-800'>
						{UI_TEXT.home.errors.title}
					</Text>
					<Text className='mt-1 text-sm text-rose-700'>{error}</Text>
					<Pressable
						className='mt-3 self-start rounded-full bg-rose-200 px-4 py-2'
						onPress={() => {
							loadFoods().catch((err) => {
								console.error('食品一覧の再取得に失敗しました', err)
							})
						}}
					>
						<Text className='text-sm font-semibold text-rose-800'>
							{UI_TEXT.home.actions.retry}
						</Text>
					</Pressable>
				</View>
			) : null}
		</View>
	)

	const renderEmpty = () =>
		error ? null : (
			<View className='px-4'>
				<View className='rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-6'>
					<Text className='text-base font-semibold text-slate-900'>
						{UI_TEXT.home.empty.title}
					</Text>
					<Text className='mt-1 text-sm text-slate-600'>
						{UI_TEXT.home.empty.description}
					</Text>
				</View>
			</View>
		)

	if (isLoading) {
		return (
			<View className='flex-1 items-center justify-center bg-slate-50 px-4'>
				<ActivityIndicator size='large' color='#0f172a' />
				<Text className='mt-3 text-sm text-slate-600'>
					{UI_TEXT.home.description}
				</Text>
			</View>
		)
	}

	return (
		<View className='flex-1 bg-slate-50'>
			<FlatList
				data={foods}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<View className='px-4'>
						<FoodListCard
							item={item}
							onPress={(pressed) => {
								console.log('食品カードがタップされました', {
									id: pressed.id,
									name: pressed.name
								})
							}}
						/>
					</View>
				)}
				ListHeaderComponent={renderHeader}
				stickyHeaderIndices={[0]}
				ListEmptyComponent={renderEmpty}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={() => {
							loadFoods('refresh').catch((err) => {
								console.error('食品一覧の再取得に失敗しました', err)
							})
						}}
						tintColor='#0f172a'
					/>
				}
				contentContainerStyle={{ paddingBottom: 32 }}
			/>
		</View>
	)
}
