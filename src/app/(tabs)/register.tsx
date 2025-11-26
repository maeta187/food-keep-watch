import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	View
} from 'react-native'
import { RegisterFormValues } from 'types'

import { CategoryField } from '@/src/components/register/CategoryField'
import { DateTimePickerSheet } from '@/src/components/register/DateTimePickerSheet'
import { ExpirationTypeField } from '@/src/components/register/ExpirationTypeField'
import { PickerField } from '@/src/components/register/PickerField'
import { TextField } from '@/src/components/register/TextField'
import {
	MAX_CATEGORIES,
	MAX_SAVED_CATEGORIES
} from '@/src/constants/categories'
import { UI_TEXT } from '@/src/constants/ui-text'
import { useCategorySuggestions } from '@/src/features/categories/use-category-suggestions'
import { createCategoryHandlers } from '@/src/features/register/category-handlers'
import { saveFood } from '@/src/features/register/save-food'
import { registerFormSchema } from '@/src/schemas/register-form'
import { formatDate, formatDateTime } from '@/src/utils/date-format'

const defaultRegisterValues: RegisterFormValues = {
	name: '',
	expirationType: 'bestBefore',
	expirationDate: '',
	storageLocation: '',
	categories: [],
	notificationDateTime: ''
}

/**
 * 賞味期限登録フォームのタブ画面を描画する。
 */
export default function RegisterTab() {
	const {
		control,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors, isSubmitting }
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: defaultRegisterValues
	})

	const categories: string[] = useWatch({ control, name: 'categories' }) ?? []
	const expirationDateIso = watch('expirationDate')
	const notificationDateTimeIso = watch('notificationDateTime')

	const [categoryInput, setCategoryInput] = useState('')
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

	const formattedExpirationDate = formatDate(
		expirationDateIso ? new Date(expirationDateIso) : undefined
	)
	const formattedNotificationDateTime = formatDateTime(
		notificationDateTimeIso ? new Date(notificationDateTimeIso) : undefined
	)
	const { suggestions: categorySuggestions, persistCategory } =
		useCategorySuggestions()

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
	 * react-hook-form 経由で送信された値を整形する。
	 *
	 * @param values バリデーション済みのフォーム値
	 */
	const handleValidSubmit = async (values: RegisterFormValues) => {
		try {
			await saveFood(values)
			reset(defaultRegisterValues)
			setCategoryInput('')
			setCategoryError(null)
			setPendingExpirationDate(new Date())
			setPendingNotificationDate(new Date())
			Alert.alert(
				UI_TEXT.register.messages.submitSuccessTitle,
				UI_TEXT.register.messages.submitSuccessDescription
			)
		} catch (error) {
			console.error('食品登録に失敗しました', error)
			Alert.alert(UI_TEXT.register.errors.submitFailed)
		} finally {
			setExpirationPickerVisible(false)
			setNotificationPickerVisible(false)
		}
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
	 * 期限日ピッカーで選択した値をフォームに反映する。
	 */
	const confirmExpirationPicker = () => {
		updateField('expirationDate', pendingExpirationDate.toISOString())
		setExpirationPickerVisible(false)
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
	 * 通知日時ピッカーで選択した値をフォームに反映する。
	 */
	const confirmNotificationPicker = () => {
		updateField('notificationDateTime', pendingNotificationDate.toISOString())
		setNotificationPickerVisible(false)
	}

	const { addCategory, removeCategory, selectCategorySuggestion } =
		createCategoryHandlers({
			categories,
			categoryInput,
			maxCategories: MAX_CATEGORIES,
			limitErrorMessage: UI_TEXT.register.errors.categoryLimit,
			storageLimitErrorMessage: UI_TEXT.register.errors.categoryStorageLimit,
			setCategoryInput,
			setCategoryError,
			updateCategories: (nextCategories) => {
				updateField('categories', nextCategories)
			},
			validateBeforeAdd: (candidate) => {
				if (
					!categorySuggestions.includes(candidate) &&
					categorySuggestions.length >= MAX_SAVED_CATEGORIES
				) {
					return UI_TEXT.register.errors.categoryStorageLimit
				}
				return null
			},
			onNewCategoryAdded: persistCategory
		})

	const onSubmit = handleSubmit(handleValidSubmit)

	return (
		<KeyboardAvoidingView
			className='flex-1 bg-white'
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<ScrollView
				className='flex-1 bg-white px-4 py-8'
				contentContainerStyle={{ paddingBottom: 32 }}
				keyboardShouldPersistTaps='handled'
			>
				<View className='bg-white'>
					{/* <HeaderSection /> */}
					<View className='px-4'>
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
								placeholder={UI_TEXT.register.fields.expirationDate.placeholder}
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
							<CategoryField
								values={categories}
								inputValue={categoryInput}
								onInputChange={setCategoryInput}
								onAdd={addCategory}
								onRemove={removeCategory}
								onSelectSuggestion={selectCategorySuggestion}
								suggestions={categorySuggestions}
								errorMessage={categoryError ?? undefined}
							/>
						</View>
						<View className='pt-4'>
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
					<View className='p-6'>
						<Pressable
							className={`rounded-full bg-blue-600 py-4 ${
								isSubmitting ? 'opacity-60' : ''
							}`}
							onPress={onSubmit}
							accessibilityRole='button'
							disabled={isSubmitting}
						>
							<Text className='text-center text-base font-semibold text-white'>
								{UI_TEXT.register.actions.submit}
							</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>

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
		</KeyboardAvoidingView>
	)
}
