import { asc, eq, inArray, sql } from 'drizzle-orm'

import { MAX_SAVED_CATEGORIES } from '@/src/constants/categories'
import {
	setCategoryInitializedFlag,
	setCategorySeededFlag
} from '@/src/database/app-settings'
import { getDb, type Database } from '@/src/database/client'
import { categories, foods } from '@/src/database/schema'
import { parseCategories } from '@/src/features/foods/utils'

export type CategoryWithUsage = {
	id: number
	name: string
	visible: boolean
	usageCount: number
}

const buildCategoryUsageMap = async (
	db: Database
): Promise<Map<string, number>> => {
	const usageMap = new Map<string, number>()
	const foodRows = await db.select({ categories: foods.categories }).from(foods)

	foodRows.forEach((row) => {
		const categoriesInFood = parseCategories(row.categories)
		categoriesInFood.forEach((category) => {
			usageMap.set(category, (usageMap.get(category) ?? 0) + 1)
		})
	})

	return usageMap
}

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
 * カテゴリーテーブルに1件以上存在するか判定する。
 *
 * @returns カテゴリーが存在する場合 true
 */
export const hasAnyCategories = async (): Promise<boolean> => {
	const db = await getDb()
	const [{ count }] = (await db
		.select({ count: sql<number>`count(*)` })
		.from(categories)) ?? [{ count: 0 }]

	return count > 0
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

	await Promise.all([setCategorySeededFlag(), setCategoryInitializedFlag()])

	return limitedInsert
}

/**
 * カテゴリー編集用に、可視状態と紐づき件数を含めて取得する。
 */
export const getManageableCategories = async (): Promise<
	CategoryWithUsage[]
> => {
	const db = await getDb()
	const [categoryRows, usageMap] = await Promise.all([
		db
			.select({
				id: categories.id,
				name: categories.name,
				visible: categories.visible
			})
			.from(categories)
			.orderBy(asc(categories.name)),
		buildCategoryUsageMap(db)
	])

	if (categoryRows.length > 0) {
		await setCategoryInitializedFlag()
	}

	return categoryRows.map((row) => ({
		...row,
		usageCount: usageMap.get(row.name) ?? 0
	}))
}

/**
 * カテゴリーの表示状態を更新する。
 */
export const updateCategoryVisibility = async (
	id: number,
	visible: boolean
): Promise<void> => {
	const db = await getDb()
	await setCategoryInitializedFlag()
	await db
		.update(categories)
		.set({ visible, updatedAt: sql`(unixepoch())` })
		.where(eq(categories.id, id))
}

export type DeleteCategoryResult =
	| { deleted: true }
	| { deleted: false; reason: 'not-found' }
	| { deleted: false; reason: 'in-use'; usageCount: number }

/**
 * 紐づきがない場合に限りカテゴリーを削除する。
 */
export const deleteCategoryIfUnused = async (
	id: number
): Promise<DeleteCategoryResult> => {
	const db = await getDb()
	const [target] = await db
		.select({ id: categories.id, name: categories.name })
		.from(categories)
		.where(eq(categories.id, id))

	if (!target) {
		return { deleted: false, reason: 'not-found' }
	}

	const usageMap = await buildCategoryUsageMap(db)
	const usageCount = usageMap.get(target.name) ?? 0
	if (usageCount > 0) {
		return { deleted: false, reason: 'in-use', usageCount }
	}

	await setCategoryInitializedFlag()
	await db.delete(categories).where(eq(categories.id, id))

	return { deleted: true }
}
