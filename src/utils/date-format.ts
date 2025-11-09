const DATE_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
	dateStyle: 'medium'
})

const DATETIME_FORMATTER = new Intl.DateTimeFormat('ja-JP', {
	dateStyle: 'medium',
	timeStyle: 'short'
})

/**
 * 日付を日本語の中期フォーマットで整形する。
 *
 * @param {Date | null | undefined} date 整形対象の日付
 */
export const formatDate = (date?: Date | null): string | undefined => {
	if (!date) return undefined
	return DATE_FORMATTER.format(date)
}

/**
 * 日時を日本語の中期フォーマットで整形する。
 *
 * @param {Date | null | undefined} dateTime 整形対象の日時
 */
export const formatDateTime = (dateTime?: Date | null): string | undefined => {
	if (!dateTime) return undefined
	return DATETIME_FORMATTER.format(dateTime)
}
