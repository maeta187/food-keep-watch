import { asc } from 'drizzle-orm'

import { getDb } from '@/src/database/client'
import { foods, type Food } from '@/src/database/schema'

type ParsedDate = Date | null

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

const parseDate = (value?: string | null): ParsedDate => {
	if (!value) {
		return null
	}
	const parsed = new Date(value)
	return Number.isNaN(parsed.getTime()) ? null : parsed
}

const parseEpochSeconds = (value?: number | null): ParsedDate => {
	if (value == null) {
		return null
	}
	const parsed = new Date(value * 1000)
	return Number.isNaN(parsed.getTime()) ? null : parsed
}

const parseCategories = (value?: string | null): string[] => {
	if (!value) {
		return []
	}
	try {
		const parsed = JSON.parse(value)
		return Array.isArray(parsed)
			? parsed.filter((item) => typeof item === 'string')
			: []
	} catch {
		return []
	}
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
