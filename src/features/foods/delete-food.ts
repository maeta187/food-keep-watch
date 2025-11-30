import { eq } from 'drizzle-orm'
import * as Notifications from 'expo-notifications'

import { getDb } from '@/src/database/client'
import { foods } from '@/src/database/schema'

const cancelNotification = async (
	notificationId: string | null
): Promise<void> => {
	if (!notificationId) {
		return
	}

	try {
		await Notifications.cancelScheduledNotificationAsync(notificationId)
	} catch (error) {
		console.error('通知のキャンセルに失敗しました', {
			notificationId,
			error
		})
	}
}

/**
 * foods テーブルから指定 ID のレコードを削除する。
 * 通知 ID を保持している場合は予約済み通知も解除する。
 */
export const deleteFood = async (id: number): Promise<{ deleted: boolean }> => {
	const db = await getDb()
	const [target] = await db
		.select({
			notificationId: foods.notificationId
		})
		.from(foods)
		.where(eq(foods.id, id))

	if (!target) {
		return { deleted: false }
	}

	await db.delete(foods).where(eq(foods.id, id))
	await cancelNotification(target.notificationId ?? null)

	return { deleted: true }
}
