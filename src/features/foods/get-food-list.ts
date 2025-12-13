import { asc } from 'drizzle-orm'

import { getDb } from '@/src/database/client'
import { foods, type Food } from '@/src/database/schema'
import {
	parseCategories,
	parseDate,
	parseEpochSeconds,
	type ParsedDate
} from '@/src/features/foods/utils'

export type FoodListItem = {
	id: number
	name: string
	expirationType: Food['expirationType']
	expirationDate: ParsedDate
	storageLocation: string | null
	categories: string[]
	notificationDateTime: ParsedDate
	createdAt: ParsedDate
	updatedAt: ParsedDate
}

/**
 * foods テーブルに保存されたレコードを期限日の昇順で取得する。
 */
export const getFoodList = async (): Promise<FoodListItem[]> => {
	const db = await getDb()
	const rows = await db
		.select()
		.from(foods)
		.orderBy(asc(foods.expirationDate), asc(foods.id))

	return rows.map((row) => ({
		id: row.id,
		name: row.name,
		expirationType: row.expirationType,
		expirationDate: parseDate(row.expirationDate),
		storageLocation: row.storageLocation ?? null,
		categories: parseCategories(row.categories),
		notificationDateTime: parseDate(row.notificationDateTime),
		createdAt: parseEpochSeconds(row.createdAt),
		updatedAt: parseEpochSeconds(row.updatedAt)
	}))
}
