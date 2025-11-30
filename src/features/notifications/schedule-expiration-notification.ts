import * as Notifications from 'expo-notifications'

import { UI_TEXT } from '@/src/constants/ui-text'
import { formatDate } from '@/src/utils/date-format'

type ExpirationType = 'bestBefore' | 'useBy'

type ScheduleExpirationNotificationParams = {
	foodName: string
	expirationDateIso: string
	expirationType: ExpirationType
	notificationDateTimeIso?: string | null
}

export type ScheduleExpirationNotificationResult =
	| { status: 'skipped' }
	| { status: 'invalid-trigger' }
	| { status: 'permission-denied' }
	| { status: 'scheduled'; notificationId: string }
	| { status: 'failed' }

const isPermissionGranted = (
	status: Notifications.NotificationPermissionsStatus
): boolean => {
	if (status.granted) {
		return true
	}

	return status.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
}

const ensureNotificationPermission = async (): Promise<boolean> => {
	const currentStatus = await Notifications.getPermissionsAsync()
	if (isPermissionGranted(currentStatus)) {
		return true
	}

	const requestedStatus = await Notifications.requestPermissionsAsync({
		ios: {
			allowAlert: true,
			allowSound: true
		}
	})

	return isPermissionGranted(requestedStatus)
}

const createNotificationContent = ({
	foodName,
	expirationDateIso,
	expirationType
}: {
	foodName: string
	expirationDateIso: string
	expirationType: ExpirationType
}): Notifications.NotificationRequestInput['content'] => {
	const expirationTypeLabel =
		UI_TEXT.home.list.expirationTypes[expirationType] ??
		UI_TEXT.home.list.expirationTypes.bestBefore
	const expirationDate = new Date(expirationDateIso)
	const formattedExpirationDate =
		formatDate(
			Number.isNaN(expirationDate.getTime()) ? undefined : expirationDate
		) ?? UI_TEXT.home.list.expirationFallback

	return {
		title: UI_TEXT.notifications.expirationReminderTitle.replace(
			'{name}',
			foodName
		),
		body: UI_TEXT.notifications.expirationReminderBody
			.replace('{expirationType}', expirationTypeLabel)
			.replace('{expirationDate}', formattedExpirationDate),
		sound: true
	}
}

export const scheduleExpirationNotification = async ({
	foodName,
	expirationDateIso,
	expirationType,
	notificationDateTimeIso
}: ScheduleExpirationNotificationParams): Promise<ScheduleExpirationNotificationResult> => {
	if (!notificationDateTimeIso) {
		return { status: 'skipped' }
	}

	const triggerDate = new Date(notificationDateTimeIso)
	if (
		Number.isNaN(triggerDate.getTime()) ||
		triggerDate.getTime() <= Date.now()
	) {
		return { status: 'invalid-trigger' }
	}

	const hasPermission = await ensureNotificationPermission()
	if (!hasPermission) {
		return { status: 'permission-denied' }
	}

	try {
		const notificationId = await Notifications.scheduleNotificationAsync({
			content: createNotificationContent({
				foodName,
				expirationDateIso,
				expirationType
			}),
			trigger: {
				type: Notifications.SchedulableTriggerInputTypes.DATE,
				date: triggerDate
			}
		})
		return { status: 'scheduled', notificationId }
	} catch (error) {
		console.error('通知の予約に失敗しました', error)
		return { status: 'failed' }
	}
}
