import * as Notifications from 'expo-notifications'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { scheduleExpirationNotification } from './schedule-expiration-notification'

const futureDateIso = new Date(Date.now() + 60 * 60 * 1000).toISOString()
const expirationDateIso = new Date(
	Date.now() + 24 * 60 * 60 * 1000
).toISOString()

const buildPermissionStatus = (
	overrides?: Partial<Notifications.NotificationPermissionsStatus>
): Notifications.NotificationPermissionsStatus => ({
	granted: true,
	status: Notifications.PermissionStatus.GRANTED,
	canAskAgain: true,
	expires: 'never',
	...overrides
})

describe('scheduleExpirationNotification', () => {
	const getPermissionsAsyncMock = vi.mocked(Notifications.getPermissionsAsync)
	const requestPermissionsAsyncMock = vi.mocked(
		Notifications.requestPermissionsAsync
	)
	const scheduleNotificationAsyncMock = vi.mocked(
		Notifications.scheduleNotificationAsync
	)

	beforeEach(() => {
		vi.clearAllMocks()
		getPermissionsAsyncMock.mockResolvedValue(buildPermissionStatus())
		requestPermissionsAsyncMock.mockResolvedValue(buildPermissionStatus())
		scheduleNotificationAsyncMock.mockResolvedValue('mock-id')
	})

	it('skips scheduling when notification time is not provided', async () => {
		const result = await scheduleExpirationNotification({
			foodName: '牛乳',
			expirationDateIso,
			expirationType: 'bestBefore'
		})

		expect(result.status).toBe('skipped')
		expect(scheduleNotificationAsyncMock).not.toHaveBeenCalled()
	})

	it('returns invalid-trigger when notification time is in the past', async () => {
		const pastIso = new Date(Date.now() - 1000).toISOString()
		const result = await scheduleExpirationNotification({
			foodName: '牛乳',
			expirationDateIso,
			expirationType: 'bestBefore',
			notificationDateTimeIso: pastIso
		})

		expect(result.status).toBe('invalid-trigger')
		expect(scheduleNotificationAsyncMock).not.toHaveBeenCalled()
	})

	it('requests permission and schedules notification when allowed', async () => {
		const result = await scheduleExpirationNotification({
			foodName: 'ヨーグルト',
			expirationDateIso,
			expirationType: 'useBy',
			notificationDateTimeIso: futureDateIso
		})

		expect(result.status).toBe('scheduled')
		expect(scheduleNotificationAsyncMock).toHaveBeenCalledWith(
			expect.objectContaining({
				trigger: {
					type: Notifications.SchedulableTriggerInputTypes.DATE,
					date: new Date(futureDateIso)
				},
				content: expect.objectContaining({
					title: expect.stringContaining('ヨーグルト'),
					body: expect.any(String),
					sound: true
				})
			})
		)
	})

	it('returns permission-denied when user does not grant permission', async () => {
		getPermissionsAsyncMock.mockResolvedValue(
			buildPermissionStatus({
				granted: false,
				status: Notifications.PermissionStatus.DENIED,
				canAskAgain: true
			})
		)
		requestPermissionsAsyncMock.mockResolvedValue(
			buildPermissionStatus({
				granted: false,
				status: Notifications.PermissionStatus.DENIED,
				canAskAgain: false
			})
		)

		const result = await scheduleExpirationNotification({
			foodName: '牛乳',
			expirationDateIso,
			expirationType: 'bestBefore',
			notificationDateTimeIso: futureDateIso
		})

		expect(result.status).toBe('permission-denied')
		expect(scheduleNotificationAsyncMock).not.toHaveBeenCalled()
	})

	it('returns failed when scheduling throws an error', async () => {
		scheduleNotificationAsyncMock.mockRejectedValueOnce(
			new Error('schedule failed')
		)

		const result = await scheduleExpirationNotification({
			foodName: '牛乳',
			expirationDateIso,
			expirationType: 'bestBefore',
			notificationDateTimeIso: futureDateIso
		})

		expect(result.status).toBe('failed')
	})
})
