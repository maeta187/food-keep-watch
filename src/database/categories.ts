import { asc, eq, inArray, sql } from 'drizzle-orm'

import { MAX_SAVED_CATEGORIES } from '@/src/constants/categories'
import { getDb } from '@/src/database/client'
import { categories } from '@/src/database/schema'

/**
 * カテゴリーテーブルに登録されている名称を取得する。
 *
 * @returns DB 上のカテゴリー名一覧
 */
export const getAllCategoryNames = async (): Promise<string[]> => {
	const db = await getDb()
	const rows = await db
		.select({ name: categories.name })
		.from(categories)
		.where(eq(categories.visible, true))
		.orderBy(asc(categories.name))
		.limit(MAX_SAVED_CATEGORIES)

	return rows.map((row) => row.name)
}

/**
 * 渡されたカテゴリー名のうち、未登録のものだけを追加する。
 *
 * @param names 追加対象のカテゴリー名配列
 * @returns 実際に追加できたカテゴリー名配列
 */
export const insertCategoriesIfMissing = async (
	names: string[]
): Promise<string[]> => {
	const normalized = Array.from(
		new Set(names.map((name) => name.trim()).filter(Boolean))
	)

	if (normalized.length === 0) {
		return []
	}

	const db = await getDb()

	const [{ count: totalCount }] = (await db
		.select({ count: sql<number>`count(*)` })
		.from(categories)
		.where(eq(categories.visible, true))) ?? [{ count: 0 }]
	if (totalCount >= MAX_SAVED_CATEGORIES) {
		return []
	}

	const existing = await db
		.select({ name: categories.name })
		.from(categories)
		.where(inArray(categories.name, normalized))

	const existingNames = new Set(existing.map((row) => row.name))
	const toInsert = normalized.filter((name) => !existingNames.has(name))

	if (toInsert.length === 0) {
		return []
	}

	const remainingSlots = MAX_SAVED_CATEGORIES - totalCount
	const limitedInsert = toInsert.slice(0, remainingSlots)
	if (limitedInsert.length === 0) {
		return []
	}

	await db
		.insert(categories)
		.values(limitedInsert.map((name) => ({ name, visible: true })))
		.onConflictDoNothing()

	return limitedInsert
}
