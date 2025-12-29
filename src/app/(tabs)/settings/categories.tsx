import FontAwesome from '@expo/vector-icons/FontAwesome'
import { BlurView } from 'expo-blur'
import { Stack, useFocusEffect, useNavigation, useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Pressable,
	RefreshControl,
	Switch,
	Text,
	View
} from 'react-native'

import { MAX_SAVED_CATEGORIES } from '@/src/constants/categories'
import { UI_TEXT } from '@/src/constants/ui-text'
import {
	deleteCategoryIfUnused,
	getManageableCategories,
	updateCategoryVisibility,
	type CategoryWithUsage
} from '@/src/database/categories'

type LoadMode = 'initial' | 'refresh'

export default function CategorySettingsScreen() {
	const router = useRouter()
	const navigation = useNavigation()
	const [categories, setCategories] = useState<CategoryWithUsage[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [updatingId, setUpdatingId] = useState<number | null>(null)
	const [deletingId, setDeletingId] = useState<number | null>(null)
	const [listKey, setListKey] = useState(0)

	const loadCategories = useCallback(async (mode: LoadMode = 'initial') => {
		if (mode === 'initial') {
			setIsLoading(true)
		} else {
			setIsRefreshing(true)
		}

		try {
			const list = await getManageableCategories()
			setCategories(list)
		} catch (error) {
			console.error('カテゴリー一覧の取得に失敗しました', error)
			Alert.alert(UI_TEXT.settings.categories.errors.loadFailed)
		} finally {
			if (mode === 'initial') {
				setIsLoading(false)
			} else {
				setIsRefreshing(false)
			}
		}
	}, [])

	useFocusEffect(
		useCallback(() => {
			setListKey((prev) => prev + 1)
			loadCategories().catch((error) => {
				console.error('カテゴリー一覧の取得に失敗しました', error)
			})
		}, [loadCategories])
	)

	const goBackToSettings = useCallback(() => {
		if (navigation.canGoBack()) {
			navigation.goBack()
			return
		}
		router.replace('/(tabs)/settings')
	}, [navigation, router])

	const handleToggleVisibility = useCallback(
		async (category: CategoryWithUsage, nextVisible: boolean) => {
			if (!category.visible && nextVisible) {
				const visibleCount = categories.filter((item) => item.visible).length
				if (visibleCount >= MAX_SAVED_CATEGORIES) {
					Alert.alert(UI_TEXT.settings.categories.errors.visibleLimit)
					return
				}
			}
			setUpdatingId(category.id)
			try {
				await updateCategoryVisibility(category.id, nextVisible)
				setCategories((prev) =>
					prev.map((item) =>
						item.id === category.id ? { ...item, visible: nextVisible } : item
					)
				)
			} catch (error) {
				console.error('カテゴリー表示切替に失敗しました', error)
				Alert.alert(UI_TEXT.settings.categories.errors.updateFailed)
			} finally {
				setUpdatingId(null)
			}
		},
		[categories]
	)

	const performDelete = useCallback(
		async (category: CategoryWithUsage) => {
			setDeletingId(category.id)
			try {
				const result = await deleteCategoryIfUnused(category.id)
				if (!result.deleted) {
					if (result.reason === 'in-use') {
						Alert.alert(
							UI_TEXT.settings.categories.actions.deleteBlockedTitle,
							UI_TEXT.settings.categories.actions.deleteBlockedDescription.replace(
								'{count}',
								result.usageCount.toString()
							)
						)
					} else {
						Alert.alert(UI_TEXT.settings.categories.errors.deleteFailed)
					}
					await loadCategories('refresh')
					return
				}

				setCategories((prev) => prev.filter((item) => item.id !== category.id))
			} catch (error) {
				console.error('カテゴリーの削除に失敗しました', error)
				Alert.alert(UI_TEXT.settings.categories.errors.deleteFailed)
			} finally {
				setDeletingId(null)
			}
		},
		[loadCategories]
	)

	const confirmDelete = useCallback(
		(category: CategoryWithUsage) => {
			if (category.usageCount > 0) {
				Alert.alert(
					UI_TEXT.settings.categories.actions.deleteBlockedTitle,
					UI_TEXT.settings.categories.actions.deleteBlockedDescription.replace(
						'{count}',
						category.usageCount.toString()
					)
				)
				return
			}

			Alert.alert(
				UI_TEXT.settings.categories.actions.deleteConfirmTitle,
				UI_TEXT.settings.categories.actions.deleteConfirmDescription.replace(
					'{name}',
					category.name
				),
				[
					{
						text: UI_TEXT.settings.categories.actions.deleteCancel,
						style: 'cancel'
					},
					{
						text: UI_TEXT.settings.categories.actions.delete,
						style: 'destructive',
						onPress: () => {
							performDelete(category).catch((error) => {
								console.error('カテゴリーの削除に失敗しました', error)
							})
						}
					}
				]
			)
		},
		[performDelete]
	)

	const renderEmpty = () => (
		<View className='mt-6 rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6'>
			<Text className='text-sm font-semibold text-slate-800'>
				{UI_TEXT.settings.categories.empty}
			</Text>
			<Text className='mt-1 text-xs text-slate-600'>
				{UI_TEXT.settings.categories.description}
			</Text>
		</View>
	)

	const renderItem = ({ item }: { item: CategoryWithUsage }) => {
		const isUpdating = updatingId === item.id
		const isDeleting = deletingId === item.id
		const usageText = item.usageCount
			? UI_TEXT.settings.categories.usageLabel.replace(
					'{count}',
					item.usageCount.toString()
				)
			: UI_TEXT.settings.categories.noUsageLabel

		const deleteLabel = isDeleting
			? UI_TEXT.settings.categories.actions.deleting
			: item.usageCount > 0
				? UI_TEXT.settings.categories.actions.deleteBlocked
				: UI_TEXT.settings.categories.actions.delete

		return (
			<View className='mb-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-100'>
				<View className='flex-row items-start justify-between gap-3'>
					<View className='flex-1'>
						<Text className='text-base font-semibold text-slate-900'>
							{item.name}
						</Text>
						<Text
							className={`mt-1 text-xs ${
								item.usageCount ? 'text-amber-600' : 'text-slate-500'
							}`}
						>
							{usageText}
						</Text>
					</View>

					<View className='items-end'>
						<View className='flex-row items-center gap-2'>
							<Text className='text-xs text-slate-600'>
								{item.visible
									? UI_TEXT.settings.categories.visibleOnLabel
									: UI_TEXT.settings.categories.visibleOffLabel}
							</Text>
							<Switch
								value={item.visible}
								onValueChange={async (value) => {
									await handleToggleVisibility(item, value)
								}}
								disabled={isUpdating || isDeleting}
								trackColor={{ false: '#cbd5e1', true: '#2563eb' }}
								thumbColor='#ffffff'
								ios_backgroundColor='#cbd5e1'
							/>
						</View>
					</View>
				</View>

				<Pressable
					className={`mt-3 self-start rounded-full px-3 py-2 ${
						item.usageCount > 0
							? 'border border-amber-200 bg-amber-50'
							: 'border border-rose-200 bg-rose-50'
					} ${isDeleting ? 'opacity-70' : ''}`}
					onPress={() => {
						confirmDelete(item)
					}}
					disabled={isDeleting || isUpdating}
					accessibilityRole='button'
				>
					<Text
						className={`text-xs font-semibold ${
							item.usageCount > 0 ? 'text-amber-700' : 'text-rose-700'
						}`}
					>
						{deleteLabel}
					</Text>
				</Pressable>
			</View>
		)
	}

	const renderHeaderActions = useMemo(
		() => (
			<Stack.Screen
				options={{
					title: UI_TEXT.settings.categories.title,
					headerTitleAlign: 'center',
					headerTitleStyle: {
						color: '#0f172a',
						fontWeight: '700',
						fontSize: 18
					},
					headerLeft: () => (
						<View className='pl-3'>
							<BlurView
								intensity={50}
								tint='extraLight'
								className='bg-transparent'
							>
								<Pressable
									className='flex-row items-center gap-2'
									onPress={goBackToSettings}
									accessibilityRole='button'
									accessibilityLabel={UI_TEXT.settings.title}
									hitSlop={10}
								>
									<FontAwesome name='chevron-left' size={16} color='#0f172a' />
								</Pressable>
							</BlurView>
						</View>
					),
					headerShadowVisible: false,
					headerTransparent: false,
					headerBlurEffect: undefined,
					headerBackground: () => <View className='flex-1 bg-white' />
				}}
			/>
		),
		[goBackToSettings]
	)

	return (
		<View className='flex-1 bg-slate-50'>
			{renderHeaderActions}
			<FlatList
				key={listKey}
				data={categories}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderItem}
				contentInsetAdjustmentBehavior='never'
				automaticallyAdjustContentInsets={false}
				contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
				scrollIndicatorInsets={{ top: 0, bottom: 0, left: 0, right: 0 }}
				ListEmptyComponent={
					isLoading ? (
						<View className='flex-1 items-center justify-center py-12'>
							<ActivityIndicator size='large' color='#0f172a' />
							<Text className='mt-3 text-sm text-slate-600'>
								{UI_TEXT.settings.categories.loading}
							</Text>
						</View>
					) : (
						renderEmpty()
					)
				}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing || isLoading}
						onRefresh={() => {
							loadCategories('refresh').catch((error) => {
								console.error('カテゴリー一覧の取得に失敗しました', error)
							})
						}}
						tintColor='#0f172a'
					/>
				}
				contentContainerStyle={{
					paddingHorizontal: 16,
					paddingVertical: 12,
					flexGrow: categories.length === 0 ? 1 : 0
				}}
			/>
		</View>
	)
}
