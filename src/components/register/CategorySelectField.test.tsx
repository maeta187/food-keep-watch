import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { CategorySelectField } from './CategorySelectField'

import { UI_TEXT } from '@/src/constants/ui-text'

const baseProps = () => ({
	values: [],
	suggestions: ['乳製品', '野菜', '肉'],
	onToggle: vi.fn(),
	errorMessage: undefined,
	isLoading: false
})

describe('CategorySelectField', () => {
	it('shows helper and empty text when nothing is selected', () => {
		const { getByText } = render(<CategorySelectField {...baseProps()} />)

		expect(
			getByText(UI_TEXT.register.fields.category.selectionHelper)
		).toBeTruthy()
		expect(
			getByText(UI_TEXT.register.fields.category.emptySelection)
		).toBeTruthy()
	})

	it('renders error message when provided', () => {
		const props = { ...baseProps(), errorMessage: 'エラーです' }
		const { getByText } = render(<CategorySelectField {...props} />)

		expect(getByText('エラーです')).toBeTruthy()
	})

	it('calls onToggle when suggestions or selected tags are pressed', () => {
		const onToggle = vi.fn()
		const selectedValue = '乳製品'
		const { getByText, getAllByText } = render(
			<CategorySelectField
				{...baseProps()}
				values={[selectedValue]}
				onToggle={onToggle}
			/>
		)

		fireEvent.click(getByText('肉'))
		expect(onToggle).toHaveBeenCalledWith('肉')

		const [, selectedSuggestionButton] = getAllByText(selectedValue)
		fireEvent.click(selectedSuggestionButton)
		expect(onToggle).toHaveBeenCalledWith(selectedValue)
	})
})
