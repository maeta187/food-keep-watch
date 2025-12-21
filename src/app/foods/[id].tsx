import FontAwesome from '@expo/vector-icons/FontAwesome'
import { zodResolver } from '@hookform/resolvers/zod'
import { BlurView } from 'expo-blur'
import {
	Stack,
	useLocalSearchParams,
	useNavigation,
	useRouter
} from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RegisterFormValues } from 'types'

import { CategorySelectField } from '@/src/components/register/CategorySelectField'
import { DateTimePickerSheet } from '@/src/components/register/DateTimePickerSheet'
import { ExpirationTypeField } from '@/src/components/register/ExpirationTypeField'
import { PickerField } from '@/src/components/register/PickerField'
import { TextField } from '@/src/components/register/TextField'
import { MAX_CATEGORIES } from '@/src/constants/categories'
import { UI_TEXT } from '@/src/constants/ui-text'
import { useCategorySuggestions } from '@/src/features/categories/use-category-suggestions'
import { deleteFood } from '@/src/features/foods/delete-food'
import { getFoodDetail } from '@/src/features/foods/get-food-detail'
import { updateFood } from '@/src/features/foods/update-food'
import { type ScheduleExpirationNotificationResult } from '@/src/features/notifications/schedule-expiration-notification'
import { createCategorySelectionHandlers } from '@/src/features/register/category-handlers'
import { registerFormSchema } from '@/src/schemas/register-form'
import { formatDate, formatDateTime } from '@/src/utils/date-format'

const emptyValues: RegisterFormValues = {
	name: '',
	expirationType: 'bestBefore',
	expirationDate: '',
	storageLocation: '',
	categories: [],
	notificationDateTime: ''
}

const buildFormValues = (
	detail: Awaited<ReturnType<typeof getFoodDetail>>
): RegisterFormValues => {
	if (!detail) {
		return emptyValues
	}

	return {
		name: detail.name,
		expirationType: detail.expirationType as 'bestBefore' | 'useBy',
		expirationDate: detail.expirationDate.toISOString(),
		storageLocation: detail.storageLocation ?? undefined,
		categories: detail.categories,
		notificationDateTime: detail.notificationDateTime
			? detail.notificationDateTime.toISOString()
			: undefined
	}
}

const buildUpdateAlertContent = (
	notificationResult: ScheduleExpirationNotificationResult
): { title: string; message: string } => {
	switch (notificationResult.status) {
		case 'permission-denied':
			return {
				title: UI_TEXT.notifications.permissionDeniedTitle,
				message: UI_TEXT.notifications.permissionDeniedDescription
			}
		case 'failed':
			return {
				title: UI_TEXT.notifications.scheduleFailedTitle,
				message: UI_TEXT.notifications.scheduleFailedDescription
			}
		default:
			return {
				title: UI_TEXT.detail.messages.updateSuccessTitle,
				message: UI_TEXT.detail.messages.updateSuccessDescription
			}
	}
}

export default function FoodDetailScreen() {
	const { id } = useLocalSearchParams<{ id?: string }>()
	const router = useRouter()
	const navigation = useNavigation()
	const foodId = Number(id)
	const isValidId = Number.isInteger(foodId) && foodId > 0
	const insets = useSafeAreaInsets()
	const headerBackground = useMemo(
		() => <View className='flex-1 bg-white' />,
		[]
	)

	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [foodName, setFoodName] = useState('')
	const [isDeleting, setIsDeleting] = useState(false)
	const [categoryError, setCategoryError] = useState<string | null>(null)
	const [isExpirationPickerVisible, setExpirationPickerVisible] =
		useState(false)
	const [pendingExpirationDate, setPendingExpirationDate] = useState<Date>(
		new Date()
	)
	const [isNotificationPickerVisible, setNotificationPickerVisible] =
		useState(false)
	const [pendingNotificationDate, setPendingNotificationDate] = useState<Date>(
		new Date()
	)

	const {
		control,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors, isSubmitting }
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: emptyValues
	})

	const categories: string[] = useWatch({ control, name: 'categories' }) ?? []
	const expirationDateIso = watch('expirationDate')
	const notificationDateTimeIso = watch('notificationDateTime')

	const formattedExpirationDate = formatDate(
		expirationDateIso ? new Date(expirationDateIso) : undefined
	)
	const formattedNotificationDateTime = formatDateTime(
		notificationDateTimeIso ? new Date(notificationDateTimeIso) : undefined
	)
	const { suggestions: categorySuggestions, isLoading: isCategoryLoading } =
		useCategorySuggestions()

	const goBackToList = useCallback(() => {
		if (navigation.canGoBack()) {
			navigation.goBack()
			return
		}
		router.replace('/(tabs)')
	}, [navigation, router])

	const loadDetail = useCallback(async () => {
		if (!isValidId) {
			setError(UI_TEXT.detail.errors.notFound)
			setIsLoading(false)
			return
		}

		setIsLoading(true)
		setError(null)

		try {
			const detail = await getFoodDetail(foodId)
			if (!detail) {
				setError(UI_TEXT.detail.errors.notFound)
				return
			}

			const nextValues = buildFormValues(detail)
			reset(nextValues)
			setFoodName(detail.name)
			setCategoryError(null)
			setPendingExpirationDate(detail.expirationDate)
			setPendingNotificationDate(
				detail.notificationDateTime ?? new Date(nextValues.expirationDate)
			)
		} catch (err) {
			console.error('食品の詳細取得に失敗しました', err)
			setError(UI_TEXT.detail.errors.loadFailed)
		} finally {
			setIsLoading(false)
		}
	}, [foodId, isValidId, reset])

	useEffect(() => {
		loadDetail().catch((err) => {
			console.error('食品の詳細取得に失敗しました', err)
		})
	}, [loadDetail])

	/**
	 * フォームステートの指定フィールドを更新する。
	 *
	 * @param key 更新対象のフィールドキー
	 * @param value 設定する値
	 */
	const updateField = <K extends keyof RegisterFormValues>(
		key: K,
		value: RegisterFormValues[K]
	) => {
		setValue(key, value as any, { shouldDirty: true, shouldValidate: true })
	}

	/**
	 * 期限日ピッカーを開く際に暫定値を初期化する。
	 */
	const openExpirationPicker = () => {
		setPendingExpirationDate(
			expirationDateIso ? new Date(expirationDateIso) : new Date()
		)
		setExpirationPickerVisible(true)
	}

	/**
	 * 通知日時ピッカーを開く際に暫定値を初期化する。
	 */
	const openNotificationPicker = () => {
		setPendingNotificationDate(
			notificationDateTimeIso ? new Date(notificationDateTimeIso) : new Date()
		)
		setNotificationPickerVisible(true)
	}

	/**
	 * 期限日ピッカーで選択した値をフォームに反映する。
	 */
	const confirmExpirationPicker = () => {
		updateField('expirationDate', pendingExpirationDate.toISOString())
		setExpirationPickerVisible(false)
	}

	/**
	 * 通知日時ピッカーで選択した値をフォームに反映する。
	 */
	const confirmNotificationPicker = () => {
		updateField('notificationDateTime', pendingNotificationDate.toISOString())
		setNotificationPickerVisible(false)
	}

	const { toggleCategory } = createCategorySelectionHandlers({
		categories,
		maxCategories: MAX_CATEGORIES,
		limitErrorMessage: UI_TEXT.register.errors.categoryLimit,
		setCategoryError,
		updateCategories: (nextCategories) => {
			updateField('categories', nextCategories)
		}
	})

	const handleUpdate = useCallback(
		async (values: RegisterFormValues) => {
			if (!isValidId) {
				Alert.alert(UI_TEXT.detail.errors.notFound)
				return
			}

			try {
				const result = await updateFood(foodId, values)
				if (!result.updated) {
					if (result.reason === 'invalid-notification') {
						Alert.alert(
							UI_TEXT.notifications.invalidScheduleTitle,
							UI_TEXT.notifications.invalidScheduleDescription
						)
						return
					}
					if (result.reason === 'not-found') {
						Alert.alert(UI_TEXT.detail.errors.notFound)
						return
					}
					Alert.alert(UI_TEXT.detail.errors.updateFailed)
					return
				}

				const alertContent = buildUpdateAlertContent(result.notificationResult)
				Alert.alert(alertContent.title, alertContent.message, [
					{ text: UI_TEXT.detail.actions.backToList, onPress: goBackToList }
				])
				setFoodName(values.name.trim())
			} catch (err) {
				console.error('食品の更新に失敗しました', err)
				Alert.alert(UI_TEXT.detail.errors.updateFailed)
			}
		},
		[foodId, goBackToList, isValidId]
	)

	const onSubmit = handleSubmit(handleUpdate)

	const confirmDelete = useCallback(() => {
		if (!isValidId) {
			Alert.alert(UI_TEXT.detail.errors.notFound)
			return
		}

		Alert.alert(
			UI_TEXT.detail.actions.deleteConfirmTitle,
			UI_TEXT.detail.actions.deleteConfirmDescription.replace(
				'{name}',
				foodName || UI_TEXT.detail.title
			),
			[
				{ text: UI_TEXT.home.actions.deleteCancel, style: 'cancel' },
				{
					text: UI_TEXT.detail.actions.delete,
					style: 'destructive',
					onPress: async () => {
						setIsDeleting(true)
						try {
							const result = await deleteFood(foodId)
							if (!result.deleted) {
								Alert.alert(UI_TEXT.detail.errors.deleteFailed)
								return
							}
							goBackToList()
						} catch (err) {
							console.error('食品の削除に失敗しました', err)
							Alert.alert(UI_TEXT.detail.errors.deleteFailed)
						} finally {
							setIsDeleting(false)
						}
					}
				}
			]
		)
	}, [foodId, foodName, goBackToList, isValidId])

	const renderHeaderActions = useMemo(
		() => (
			<Stack.Screen
				options={{
					title: '編集',
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
									onPress={goBackToList}
									accessibilityRole='button'
									accessibilityLabel={UI_TEXT.detail.actions.backToList}
									hitSlop={10}
								>
									<FontAwesome name='chevron-left' size={16} color='#0f172a' />
								</Pressable>
							</BlurView>
						</View>
					),
					headerRight: () => (
						<View className='pl-3'>
							<BlurView
								intensity={50}
								tint='extraLight'
								className='overflow-hidden rounded-full'
							>
								<Pressable
									onPress={confirmDelete}
									accessibilityRole='button'
									accessibilityLabel={UI_TEXT.detail.actions.delete}
									disabled={isDeleting || isLoading}
									hitSlop={10}
								>
									<FontAwesome
										name='trash'
										size={18}
										className=''
										color={isDeleting ? '#cbd5e1' : '#e11d48'}
									/>
								</Pressable>
							</BlurView>
						</View>
					),
					headerShadowVisible: false,
					headerTransparent: false,
					headerBlurEffect: undefined,
					headerBackground: () => headerBackground
				}}
			/>
		),
		[
			confirmDelete,
			foodName,
			goBackToList,
			headerBackground,
			isDeleting,
			isLoading
		]
	)

	if (isLoading) {
		return (
			<View className='flex-1 items-center justify-center bg-slate-50 px-4'>
				{renderHeaderActions}
				<ActivityIndicator size='large' color='#0f172a' />
				<Text className='mt-3 text-sm text-slate-600'>
					{UI_TEXT.detail.description}
				</Text>
			</View>
		)
	}

	if (error) {
		return (
			<View className='flex-1 bg-slate-50 px-4 py-10'>
				{renderHeaderActions}
				<View className='rounded-2xl border border-amber-200 bg-white px-4 py-6 shadow-sm'>
					<Text className='text-base font-semibold text-slate-900'>
						{error}
					</Text>
					<Text className='mt-2 text-sm text-slate-600'>
						{UI_TEXT.detail.description}
					</Text>
					<View className='mt-4 flex-row gap-3'>
						<Pressable
							className='flex-1 rounded-full bg-slate-100 px-4 py-3'
							onPress={goBackToList}
							accessibilityRole='button'
						>
							<Text className='text-center text-sm font-semibold text-slate-800'>
								{UI_TEXT.detail.actions.backToList}
							</Text>
						</Pressable>
						<Pressable
							className='flex-1 rounded-full bg-blue-600 px-4 py-3'
							onPress={() => {
								loadDetail().catch((err) => {
									console.error('食品の再読み込みに失敗しました', err)
								})
							}}
							accessibilityRole='button'
						>
							<Text className='text-center text-sm font-semibold text-white'>
								{UI_TEXT.home.actions.retry}
							</Text>
						</Pressable>
					</View>
				</View>
			</View>
		)
	}

	return (
		<View className='flex-1 bg-white'>
			{renderHeaderActions}
			<KeyboardAvoidingView
				className='flex-1 border-t border-t-gray-300'
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<ScrollView
					className='flex-1 px-4 py-8'
					contentContainerStyle={{ paddingBottom: 100 }}
					keyboardShouldPersistTaps='handled'
				>
					<View className='space-y-8'>
						<View className='space-y-2'>
							<Text className='text-xl font-bold text-slate-900'>
								{UI_TEXT.detail.title}
							</Text>
							<Text className='text-sm text-slate-600'>
								{UI_TEXT.detail.description}
							</Text>
						</View>

						<View className=''>
							<View>
								<Controller
									control={control}
									name='name'
									render={({ field: { value, onChange, onBlur } }) => (
										<TextField
											label={UI_TEXT.register.fields.name.label}
											placeholder={UI_TEXT.register.fields.name.placeholder}
											value={value}
											error={errors.name?.message}
											onChangeText={onChange}
											onBlur={onBlur}
										/>
									)}
								/>
							</View>

							<View className='pt-4'>
								<ExpirationTypeField
									value={watch('expirationType')}
									onChange={(value) => {
										updateField('expirationType', value)
									}}
								/>
							</View>

							<View className='pt-4'>
								<PickerField
									label={UI_TEXT.register.fields.expirationDate.label}
									placeholder={
										UI_TEXT.register.fields.expirationDate.placeholder
									}
									valueLabel={formattedExpirationDate}
									icon='calendar'
									error={errors.expirationDate?.message}
									onPress={openExpirationPicker}
								/>
							</View>

							<View className='pt-4'>
								<Controller
									control={control}
									name='storageLocation'
									render={({ field: { value, onChange, onBlur } }) => (
										<TextField
											label={UI_TEXT.register.fields.storage.label}
											placeholder={UI_TEXT.register.fields.storage.placeholder}
											value={value ?? ''}
											onChangeText={onChange}
											onBlur={onBlur}
										/>
									)}
								/>
							</View>

							<View className='pt-4'>
								<CategorySelectField
									values={categories}
									suggestions={categorySuggestions}
									onToggle={toggleCategory}
									errorMessage={categoryError ?? undefined}
									isLoading={isCategoryLoading}
								/>
							</View>

							<View className='pb-2 pt-4'>
								<PickerField
									label={UI_TEXT.register.fields.notificationTime.label}
									placeholder={
										UI_TEXT.register.fields.notificationTime.placeholder
									}
									valueLabel={formattedNotificationDateTime}
									icon='clock-o'
									onPress={openNotificationPicker}
								/>
							</View>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

			<View
				className='absolute inset-x-0 bottom-0 border-t border-slate-200 bg-white px-4 pt-3 shadow-lg shadow-slate-200/80'
				style={{ paddingBottom: Math.max(insets.bottom, 24) }}
			>
				<View className='flex-row items-center gap-3'>
					<Pressable
						className='flex-1 rounded-full border border-slate-200 bg-white py-3 shadow-sm shadow-slate-200'
						onPress={goBackToList}
						accessibilityRole='button'
					>
						<Text className='text-center text-base font-semibold text-slate-800'>
							{UI_TEXT.detail.actions.cancel}
						</Text>
					</Pressable>
					<Pressable
						className={`flex-1 rounded-full bg-blue-600 py-3 shadow-sm shadow-blue-200 ${
							isSubmitting ? 'opacity-60' : ''
						}`}
						onPress={onSubmit}
						accessibilityRole='button'
						disabled={isSubmitting}
					>
						<Text className='text-center text-base font-semibold text-white'>
							{UI_TEXT.detail.actions.update}
						</Text>
					</Pressable>
				</View>
			</View>

			<DateTimePickerSheet
				mode='date'
				visible={isExpirationPickerVisible}
				value={pendingExpirationDate}
				onChange={setPendingExpirationDate}
				onCancel={() => {
					setExpirationPickerVisible(false)
				}}
				onConfirm={confirmExpirationPicker}
			/>

			<DateTimePickerSheet
				mode='datetime'
				visible={isNotificationPickerVisible}
				value={pendingNotificationDate}
				onChange={setPendingNotificationDate}
				onCancel={() => {
					setNotificationPickerVisible(false)
				}}
				onConfirm={confirmNotificationPicker}
			/>
		</View>
	)
}
