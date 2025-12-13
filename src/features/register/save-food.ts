import type { SQLiteRunResult } from 'expo-sqlite'

import { getDb } from '@/src/database/client'
import { foods, type NewFood } from '@/src/database/schema'
import {
	buildCategoriesPayload,
	normalizeOptionalText
} from '@/src/features/foods/utils'
import { type RegisterFormValues } from '@/src/types'

const buildInsertPayload = (
	values: RegisterFormValues,
	notificationId?: string | null
): Omit<NewFood, 'id'> => ({
	name: values.name.trim(),
	expirationType: values.expirationType,
	expirationDate: values.expirationDate,
	storageLocation: normalizeOptionalText(values.storageLocation),
	categories: buildCategoriesPayload(values.categories),
	notificationDateTime: normalizeOptionalText(values.notificationDateTime),
	notificationId: normalizeOptionalText(notificationId)
})

/**
 * フォーム入力値を foods テーブルへ保存する。
 *
 * @param values 登録フォームの入力値
 */
export const saveFood = async (
	values: RegisterFormValues,
	options?: { notificationId?: string | null }
): Promise<SQLiteRunResult> => {
	const db = await getDb()
	const payload = buildInsertPayload(values, options?.notificationId)

	const result = await db.insert(foods).values(payload)

	return result
}
