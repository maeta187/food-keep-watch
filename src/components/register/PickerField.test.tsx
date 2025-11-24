import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import { PickerField } from './PickerField'
import { UI_TEXT } from '../../constants/ui-text'

describe('PickerField', () => {
	it('shows placeholder when no value is selected', () => {
		const { getByText } = render(
			<PickerField
				label={UI_TEXT.register.fields.expirationDate.label}
				placeholder={UI_TEXT.register.fields.expirationDate.placeholder}
				icon='calendar'
				onPress={vi.fn()}
			/>
		)

		expect(
			getByText(UI_TEXT.register.fields.expirationDate.placeholder)
		).toBeTruthy()
	})

	it('shows selected value when provided', () => {
		const label = '2025/01/10'
		const { getByText } = render(
			<PickerField
				label={UI_TEXT.register.fields.expirationDate.label}
				placeholder={UI_TEXT.register.fields.expirationDate.placeholder}
				valueLabel={label}
				icon='calendar'
				onPress={vi.fn()}
			/>
		)

		expect(getByText(label)).toBeTruthy()
	})

	it('calls onPress when pressed', () => {
		const handlePress = vi.fn()
		const { getByRole } = render(
			<PickerField
				label={UI_TEXT.register.fields.expirationDate.label}
				placeholder={UI_TEXT.register.fields.expirationDate.placeholder}
				icon='calendar'
				onPress={handlePress}
			/>
		)

		fireEvent.click(getByRole('button'))
		expect(handlePress).toHaveBeenCalled()
	})

	it('displays error message when error is provided', () => {
		const error = '必須項目です'
		const { getByText } = render(
			<PickerField
				label={UI_TEXT.register.fields.expirationDate.label}
				placeholder={UI_TEXT.register.fields.expirationDate.placeholder}
				icon='calendar'
				error={error}
				onPress={vi.fn()}
			/>
		)

		expect(getByText(error)).toBeTruthy()
	})
})
