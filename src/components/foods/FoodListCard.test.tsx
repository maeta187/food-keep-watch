import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { FoodListCard } from './FoodListCard'

import { UI_TEXT } from '@/src/constants/ui-text'

const baseItem = {
	id: 1,
	name: '牛乳',
	expirationType: 'bestBefore',
	expirationDate: new Date('2024-01-04T12:00:00Z'),
	storageLocation: '冷蔵庫',
	categories: ['乳製品', '朝食'],
	notificationDateTime: new Date('2024-01-03T12:00:00Z'),
	createdAt: new Date('2024-01-01T00:00:00Z'),
	updatedAt: new Date('2024-01-01T00:00:00Z')
} as const

describe('FoodListCard', () => {
	it('期限が近い場合に危険バッジを赤色で表示する', () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))

		// FoodListCardのitem propsの型 FoodListItem では、categoriesはstring[]型（可変）で渡す必要があるため、.slice()でmutableに変換
		const mutableItem = { ...baseItem, categories: [...baseItem.categories] }
		const { getByText } = render(<FoodListCard item={mutableItem} />)

		const badge = getByText(
			`${UI_TEXT.home.list.daysPrefix}3${UI_TEXT.home.list.daysSuffix}`
		)
		expect(badge.className).toContain('bg-rose-100')
		expect(badge.className).toContain('text-rose-700')

		vi.useRealTimers()
	})

	it('カテゴリータグが登録画面と同じ青系スタイルで表示される', () => {
		const mutableItem = { ...baseItem, categories: [...baseItem.categories] }
		const { getByText } = render(<FoodListCard item={mutableItem} />)

		const tag = getByText('乳製品')
		expect(tag.className).toContain('bg-blue-50')
		expect(tag.className).toContain('text-blue-600')
		expect(tag.className).toContain('font-semibold')
	})

	it('カードを押下すると onPress ハンドラーが呼ばれる', () => {
		const handlePress = vi.fn()
		const mutableItem = { ...baseItem, categories: [...baseItem.categories] }
		const { getByRole } = render(
			<FoodListCard item={mutableItem} onPress={handlePress} />
		)

		fireEvent.click(getByRole('button'))

		expect(handlePress).toHaveBeenCalledTimes(1)
		expect(handlePress).toHaveBeenCalledWith(baseItem)
	})
})
