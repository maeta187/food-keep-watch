import { eq } from 'drizzle-orm'

import { getDb } from '@/src/database/client'
import { foods, type Food } from '@/src/database/schema'
import {
	parseCategories,
	parseDate,
	parseEpochSeconds,
	type ParsedDate
} from '@/src/features/foods/utils'

export type FoodDetail = {
	id: number
	name: string
	expirationType: Food['expirationType']
	expirationDate: Date
	storageLocation: string | null
	categories: string[]
	notificationDateTime: ParsedDate
	createdAt: ParsedDate
	updatedAt: ParsedDate
}

/**
 * foods テーブルから指定 ID のレコードを取得する。
 * 期限日が欠損または不正な場合は null を返す。
 */
export const getFoodDetail = async (id: number): Promise<FoodDetail | null> => {
	const db = await getDb()
	const [row] = await db.select().from(foods).where(eq(foods.id, id))

	if (!row) {
		return null
	}

	const expirationDate = parseDate(row.expirationDate)
	if (!expirationDate) {
		return null
	}

	return {
		id: row.id,
		name: row.name,
		expirationType: row.expirationType,
		expirationDate,
		storageLocation: row.storageLocation ?? null,
		categories: parseCategories(row.categories),
		notificationDateTime: parseDate(row.notificationDateTime),
		createdAt: parseEpochSeconds(row.createdAt),
		updatedAt: parseEpochSeconds(row.updatedAt)
	}
}
