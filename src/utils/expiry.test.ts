import { daysUntilExpiry, isExpired } from './expiry'

describe('expiry utilities', () => {
	it('判定対象日が参照日時より過去なら期限切れとみなす', () => {
		const reference = new Date('2024-01-11T09:00:00Z')
		const target = new Date('2024-01-10T23:59:59Z')

		expect(isExpired(target, reference)).toBe(true)
	})

	it('判定対象日が参照日時より未来なら期限切れではない', () => {
		const reference = new Date('2024-01-11T09:00:00Z')
		const target = new Date('2024-01-12T00:00:00Z')

		expect(isExpired(target, reference)).toBe(false)
	})

	it('期限までの日数を切り上げで返す', () => {
		const reference = new Date('2024-01-01T00:00:00Z')
		const target = new Date('2024-01-03T10:30:00Z')

		expect(daysUntilExpiry(target, reference)).toBe(3)
	})
})
