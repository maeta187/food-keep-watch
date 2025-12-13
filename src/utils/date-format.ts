type DateInput = Date | string | number | null | undefined

const DATE_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
	dateStyle: 'medium'
})

const DATETIME_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
	dateStyle: 'medium',
	timeStyle: 'short'
})

const normalizeDateInput = (value?: DateInput): Date | undefined => {
	if (value === null || value === undefined) return undefined

	const normalized =
		value instanceof Date ? new Date(value.getTime()) : new Date(value)
	if (Number.isNaN(normalized.getTime())) return undefined

	return normalized
}

/**
 * 日付を日本語の中期フォーマットで整形する。
 *
 * @param {Date | string | number | null | undefined} date 整形対象の日付
 */
export const formatDate = (date?: DateInput): string | undefined => {
	const normalizedDate = normalizeDateInput(date)
	if (!normalizedDate) return undefined

	return DATE_FORMATTER.format(normalizedDate)
}

/**
 * 日時を日本語の中期フォーマットで整形する。
 *
 * @param {Date | string | number | null | undefined} dateTime 整形対象の日時
 */
export const formatDateTime = (dateTime?: DateInput): string | undefined => {
	const normalizedDateTime = normalizeDateInput(dateTime)
	if (!normalizedDateTime) return undefined

	return DATETIME_FORMATTER.format(normalizedDateTime)
}
