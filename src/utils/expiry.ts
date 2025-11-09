/**
 * 指定した賞味・消費期限が参照日時時点で切れているかどうかを判定する。
 *
 * @param {Date} target 判定対象の期限日時
 * @param {Date} reference 判定の基準とする日時（省略時は現在時刻）
 */
export const isExpired = (
	target: Date,
	reference: Date = new Date()
): boolean => {
	const normalizedTarget = new Date(target)
	const normalizedReference = new Date(reference)

	return normalizedTarget.getTime() <= normalizedReference.getTime()
}

/**
 * 指定した賞味・消費期限までの日数を算出し、端数は切り上げる。
 *
 * @param {Date} target 期限日時
 * @param {Date} reference 計算の基準とする日時（省略時は現在時刻）
 */
export const daysUntilExpiry = (
	target: Date,
	reference: Date = new Date()
): number => {
	const msPerDay = 1000 * 60 * 60 * 24
	const diff = new Date(target).getTime() - new Date(reference).getTime()

	return Math.ceil(diff / msPerDay)
}
