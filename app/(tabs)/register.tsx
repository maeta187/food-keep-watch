import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	ScrollView,
	Text,
	View
} from 'react-native'
import type { RegisterFormValues } from 'types/register-form'

import { UI_TEXT } from '@/constants/ui-text'
import { CategoryField } from '@/src/components/register/CategoryField'
import { DateTimePickerSheet } from '@/src/components/register/DateTimePickerSheet'
import { ExpirationTypeField } from '@/src/components/register/ExpirationTypeField'
import { HeaderSection } from '@/src/components/register/HeaderSection'
import { PickerField } from '@/src/components/register/PickerField'
import { TextField } from '@/src/components/register/TextField'
import {
	MAX_CATEGORIES,
	SUGGESTED_CATEGORIES
} from '@/src/constants/categories'
import { registerFormSchema } from '@/src/schemas/register-form'
import { formatDate, formatDateTime } from '@/utils/date-format'

/**
 * 賞味期限登録フォームのタブ画面を描画する。
 */
export default function RegisterTab() {
	const {
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors }
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			name: '',
			expirationType: 'bestBefore',
			expirationDate: '',
			storageLocation: '',
			categories: [],
			notificationDateTime: ''
		}
	})

	const categories = watch('categories') ?? []
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
	const handleValidSubmit = (values: RegisterFormValues) => {
		const payload = {
			name: values.name.trim(),
			expirationType: values.expirationType,
			expirationDate: new Date(values.expirationDate),
			storageLocation: values.storageLocation?.trim() ?? '',
			categories: values.categories,
			notificationDateTime: values.notificationDateTime
				? new Date(values.notificationDateTime)
				: undefined
		}

		console.log(payload)
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

	/**
	 * カテゴリー入力欄の文字列をタグとして追加する。
	 */
	const addCategory = () => {
		const trimmed = categoryInput.trim()
		if (!trimmed) {
			setCategoryInput('')
			return
		}

		if (categories.length >= MAX_CATEGORIES) {
			setCategoryError(UI_TEXT.register.errors.categoryLimit)
			setCategoryInput('')
			return
		}

		if (categories.includes(trimmed)) {
			setCategoryError(null)
			setCategoryInput('')
			return
		}

		updateField('categories', [...categories, trimmed])
		setCategoryError(null)
		setCategoryInput('')
	}

	/**
	 * 指定したカテゴリータグを削除する。
	 *
	 * @param category 削除対象のカテゴリー
	 */
	const removeCategory = (category: string) => {
		updateField(
			'categories',
			categories.filter((item) => item !== category)
		)
		setCategoryError(null)
	}

	/**
	 * サジェスト一覧からカテゴリーを追加する。
	 *
	 * @param category 追加するカテゴリー
	 */
	const selectCategorySuggestion = (category: string) => {
		if (categories.length >= MAX_CATEGORIES) {
			setCategoryError(UI_TEXT.register.errors.categoryLimit)
			return
		}
		if (categories.includes(category)) {
			setCategoryError(null)
			return
		}
		updateField('categories', [...categories, category])
		setCategoryError(null)
	}

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
				<View className='rounded-3xl bg-white'>
					<HeaderSection />
					<View className='space-y-6 px-4 py-6'>
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
						<ExpirationTypeField
							value={watch('expirationType')}
							onChange={(value) => {
								updateField('expirationType', value)
							}}
						/>
						<PickerField
							label={UI_TEXT.register.fields.expirationDate.label}
							placeholder={UI_TEXT.register.fields.expirationDate.placeholder}
							valueLabel={formattedExpirationDate}
							icon='calendar'
							error={errors.expirationDate?.message}
							onPress={openExpirationPicker}
						/>
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
						<CategoryField
							values={categories}
							inputValue={categoryInput}
							onInputChange={setCategoryInput}
							onAdd={addCategory}
							onRemove={removeCategory}
							onSelectSuggestion={selectCategorySuggestion}
							suggestions={SUGGESTED_CATEGORIES}
							errorMessage={categoryError ?? undefined}
						/>
						<PickerField
							label={UI_TEXT.register.fields.notificationTime.label}
							placeholder={UI_TEXT.register.fields.notificationTime.placeholder}
							valueLabel={formattedNotificationDateTime}
							icon='clock-o'
							onPress={openNotificationPicker}
						/>
					</View>
					<View className='px-4 pb-6'>
						<Pressable
							className='rounded-full bg-blue-600 py-4'
							onPress={onSubmit}
							accessibilityRole='button'
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
