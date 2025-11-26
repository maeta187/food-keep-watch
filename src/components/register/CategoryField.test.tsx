import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { CategoryField } from './CategoryField'

import { UI_TEXT } from '@/src/constants/ui-text'

const baseProps = () => ({
	values: [],
	inputValue: '',
	onInputChange: vi.fn(),
	onAdd: vi.fn(),
	onRemove: vi.fn(),
	onSelectSuggestion: vi.fn(),
	suggestions: ['乳製品', '野菜', '肉'],
	errorMessage: undefined
})

describe('CategoryField', () => {
	it('renders helper text when no error is provided', () => {
		const { getByText } = render(<CategoryField {...baseProps()} />)

		expect(getByText(UI_TEXT.register.fields.category.helper)).toBeTruthy()
	})

	it('renders error message when provided', () => {
		const props = { ...baseProps(), errorMessage: 'エラーです' }
		const { getByText } = render(<CategoryField {...props} />)

		expect(getByText('エラーです')).toBeTruthy()
	})

	it('calls onInputChange and onAdd via input interactions', () => {
		const onInputChange = vi.fn()
		const onAdd = vi.fn()
		const { getByPlaceholderText } = render(
			<CategoryField
				{...baseProps()}
				onInputChange={onInputChange}
				onAdd={onAdd}
			/>
		)

		const input = getByPlaceholderText(
			UI_TEXT.register.fields.category.placeholder
		)

		fireEvent.change(input, { target: { value: '新規カテゴリ' } })
		expect(onInputChange).toHaveBeenCalledWith('新規カテゴリ')

		fireEvent.blur(input)
		expect(onAdd).toHaveBeenCalled()
	})

	it('toggles selection via suggestion press and tag press', () => {
		const onSelectSuggestion = vi.fn()
		const onRemove = vi.fn()
		const selectedValue = '乳製品'
		const { getByText, getAllByText } = render(
			<CategoryField
				{...baseProps()}
				values={[selectedValue]}
				onSelectSuggestion={onSelectSuggestion}
				onRemove={onRemove}
			/>
		)

		// 未選択のサジェストを選択
		fireEvent.click(getByText('肉'))
		expect(onSelectSuggestion).toHaveBeenCalledWith('肉')

		// 選択済みサジェストをタップすると削除
		const [, selectedSuggestionButton] = getAllByText(selectedValue)
		fireEvent.click(selectedSuggestionButton)
		expect(onRemove).toHaveBeenCalledWith(selectedValue)
	})
})
