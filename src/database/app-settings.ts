import { eq, sql } from 'drizzle-orm'

import { getDb } from '@/src/database/client'
import { appSettings } from '@/src/database/schema'

const CATEGORY_SEEDED_KEY = 'category_seeded'

/**
 * カテゴリーの初期シード実行済みフラグを取得する。
 */
export const getCategorySeededFlag = async (): Promise<boolean> => {
	const db = await getDb()
	const [row] = await db
		.select({ value: appSettings.value })
		.from(appSettings)
		.where(eq(appSettings.key, CATEGORY_SEEDED_KEY))

	return row?.value === 'true'
}

/**
 * カテゴリーの初期シード実行済みフラグを保存する。
 */
export const setCategorySeededFlag = async (): Promise<void> => {
	const db = await getDb()
	await db
		.insert(appSettings)
		.values({ key: CATEGORY_SEEDED_KEY, value: 'true' })
		.onConflictDoUpdate({
			target: appSettings.key,
			set: { value: 'true', updatedAt: sql`(unixepoch())` }
		})
}
