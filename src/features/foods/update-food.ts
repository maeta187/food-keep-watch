import { eq, sql } from 'drizzle-orm'
import * as Notifications from 'expo-notifications'

import { getDb } from '@/src/database/client'
import { foods } from '@/src/database/schema'
import {
	buildCategoriesPayload,
	normalizeOptionalText
} from '@/src/features/foods/utils'
import {
	scheduleExpirationNotification,
	type ScheduleExpirationNotificationResult
} from '@/src/features/notifications/schedule-expiration-notification'
import { type RegisterFormValues } from '@/src/types'

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

type UpdateFoodFailureReason = 'not-found' | 'invalid-notification'

export type UpdateFoodResult =
	| {
			updated: true
			notificationResult: ScheduleExpirationNotificationResult
	  }
	| {
			updated: false
			reason: UpdateFoodFailureReason
			notificationResult: ScheduleExpirationNotificationResult
	  }

const buildNotificationResult = (
	foodName: string,
	expirationDateIso: string,
	expirationType: RegisterFormValues['expirationType'],
	shouldReschedule: boolean,
	notificationDateTimeIso: string | null
): Promise<ScheduleExpirationNotificationResult> => {
	if (!shouldReschedule || !notificationDateTimeIso) {
		return Promise.resolve({ status: 'skipped' })
	}

	return scheduleExpirationNotification({
		foodName,
		expirationDateIso,
		expirationType,
		notificationDateTimeIso
	})
}

/**
 * 指定した食品の登録情報を更新する。
 * 通知日時が変更された場合は既存の通知を解除し、必要に応じて再予約する。
 */
export const updateFood = async (
	id: number,
	values: RegisterFormValues
): Promise<UpdateFoodResult> => {
	const db = await getDb()
	const [current] = await db
		.select({
			id: foods.id,
			notificationId: foods.notificationId,
			notificationDateTime: foods.notificationDateTime,
			name: foods.name,
			expirationType: foods.expirationType,
			expirationDate: foods.expirationDate
		})
		.from(foods)
		.where(eq(foods.id, id))

	if (!current) {
		return {
			updated: false,
			reason: 'not-found',
			notificationResult: { status: 'skipped' }
		}
	}

	const normalizedNotificationDateTime = normalizeOptionalText(
		values.notificationDateTime
	)
	const trimmedName = values.name.trim()
	const currentNotificationDateTime = normalizeOptionalText(
		current.notificationDateTime
	)
	const notificationDateTimeChanged =
		normalizedNotificationDateTime !== currentNotificationDateTime
	const notificationContentChanged =
		!!currentNotificationDateTime &&
		!notificationDateTimeChanged &&
		(trimmedName !== current.name ||
			values.expirationType !== current.expirationType ||
			values.expirationDate !== current.expirationDate)
	const currentNotificationDate = currentNotificationDateTime
		? new Date(currentNotificationDateTime)
		: null
	const hasFutureNotification =
		!!currentNotificationDate &&
		!Number.isNaN(currentNotificationDate.getTime()) &&
		currentNotificationDate.getTime() > Date.now()
	const shouldReschedule =
		notificationDateTimeChanged ||
		(notificationContentChanged && hasFutureNotification)

	const notificationResult = await buildNotificationResult(
		trimmedName,
		values.expirationDate,
		values.expirationType,
		shouldReschedule,
		normalizedNotificationDateTime
	)

	if (notificationResult.status === 'invalid-trigger') {
		return {
			updated: false,
			reason: 'invalid-notification',
			notificationResult
		}
	}

	if (shouldReschedule && current.notificationId) {
		await cancelNotification(current.notificationId)
	}

	let notificationIdToSave = current.notificationId ?? null
	if (shouldReschedule) {
		if (
			normalizedNotificationDateTime &&
			notificationResult.status === 'scheduled'
		) {
			notificationIdToSave = notificationResult.notificationId
		} else {
			notificationIdToSave = null
		}
	}

	await db
		.update(foods)
		.set({
			name: trimmedName,
			expirationType: values.expirationType,
			expirationDate: values.expirationDate,
			storageLocation: normalizeOptionalText(values.storageLocation),
			categories: buildCategoriesPayload(values.categories),
			notificationDateTime: normalizedNotificationDateTime,
			notificationId: notificationIdToSave,
			updatedAt: sql`(unixepoch())`
		})
		.where(eq(foods.id, id))

	return { updated: true, notificationResult }
}
