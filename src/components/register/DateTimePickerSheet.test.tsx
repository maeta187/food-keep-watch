import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { Platform } from 'react-native'

import { DateTimePickerSheet } from './DateTimePickerSheet'
import { UI_TEXT } from '../../constants/ui-text'

describe('DateTimePickerSheet', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('returns null when not visible', () => {
		const { container } = render(
			<DateTimePickerSheet
				visible={false}
				mode='date'
				value={new Date()}
				onChange={vi.fn()}
				onCancel={vi.fn()}
				onConfirm={vi.fn()}
			/>
		)

		expect(container.firstChild).toBeNull()
	})

	it('renders web fallback and handles cancel', () => {
		Platform.OS = 'web' as typeof Platform.OS
		const handleCancel = vi.fn()

		const { getByText } = render(
			<DateTimePickerSheet
				visible
				mode='date'
				value={new Date()}
				onChange={vi.fn()}
				onCancel={handleCancel}
				onConfirm={vi.fn()}
			/>
		)

		expect(getByText(UI_TEXT.register.errors.webPickerUnsupported)).toBeTruthy()

		fireEvent.click(getByText(UI_TEXT.register.actions.cancel))
		expect(handleCancel).toHaveBeenCalled()
	})

	it('renders native actions and handles confirm/cancel', () => {
		Platform.OS = 'ios' as typeof Platform.OS
		const handleConfirm = vi.fn()
		const handleCancel = vi.fn()

		const { getByText } = render(
			<DateTimePickerSheet
				visible
				mode='datetime'
				value={new Date()}
				onChange={vi.fn()}
				onCancel={handleCancel}
				onConfirm={handleConfirm}
			/>
		)

		fireEvent.click(getByText(UI_TEXT.register.actions.confirm))
		fireEvent.click(getByText(UI_TEXT.register.actions.cancel))

		expect(handleConfirm).toHaveBeenCalled()
		expect(handleCancel).toHaveBeenCalled()
	})
})
