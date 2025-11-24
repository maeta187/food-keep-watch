import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import { TextField } from './TextField'
import { UI_TEXT } from '../../constants/ui-text'

describe('TextField', () => {
	it('renders label and placeholder', () => {
		const { getByText, getByPlaceholderText } = render(
			<TextField
				label={UI_TEXT.register.fields.name.label}
				placeholder={UI_TEXT.register.fields.name.placeholder}
				value=''
				onChangeText={vi.fn()}
			/>
		)

		expect(getByText(UI_TEXT.register.fields.name.label)).toBeTruthy()
		expect(
			getByPlaceholderText(UI_TEXT.register.fields.name.placeholder)
		).toBeTruthy()
	})

	it('calls onChangeText when input changes', () => {
		const handleChange = vi.fn()
		const { getByPlaceholderText } = render(
			<TextField
				label={UI_TEXT.register.fields.name.label}
				placeholder={UI_TEXT.register.fields.name.placeholder}
				value=''
				onChangeText={handleChange}
			/>
		)

		fireEvent.change(
			getByPlaceholderText(UI_TEXT.register.fields.name.placeholder),
			{
				target: { value: '牛乳' }
			}
		)

		expect(handleChange).toHaveBeenCalledWith('牛乳')
	})

	it('shows error message when provided', () => {
		const error = '必須項目です'
		const { getByText } = render(
			<TextField
				label={UI_TEXT.register.fields.name.label}
				placeholder={UI_TEXT.register.fields.name.placeholder}
				value=''
				error={error}
				onChangeText={vi.fn()}
			/>
		)

		expect(getByText(error)).toBeTruthy()
	})
})
