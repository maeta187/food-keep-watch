import type { SQLiteRunResult } from 'expo-sqlite'

import { getDb } from '@/src/database/client'
import { foods, type NewFood } from '@/src/database/schema'
import { type RegisterFormValues } from '@/src/types'

const normalizeOptionalText = (value?: string | null): string | null => {
	const trimmed = value?.trim() ?? ''
	return trimmed.length > 0 ? trimmed : null
}

const buildInsertPayload = (
	values: RegisterFormValues
): Omit<NewFood, 'id'> => ({
	name: values.name.trim(),
	expirationType: values.expirationType,
	expirationDate: values.expirationDate,
	storageLocation: normalizeOptionalText(values.storageLocation),
	categories: JSON.stringify(values.categories),
	notificationDateTime: normalizeOptionalText(values.notificationDateTime)
})

/**
 * フォーム入力値を foods テーブルへ保存する。
 *
 * @param values 登録フォームの入力値
 */
export const saveFood = async (
	values: RegisterFormValues
): Promise<SQLiteRunResult> => {
	const db = await getDb()
	const payload = buildInsertPayload(values)

	const result = await db.insert(foods).values(payload)

	return result
}
