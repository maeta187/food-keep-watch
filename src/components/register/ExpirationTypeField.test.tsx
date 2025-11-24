import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import { ExpirationTypeField } from './ExpirationTypeField'
import { UI_TEXT } from '../../constants/ui-text'

describe('ExpirationTypeField', () => {
	it('renders options with correct selection state', () => {
		const { getAllByRole, getByText } = render(
			<ExpirationTypeField value='bestBefore' onChange={vi.fn()} />
		)

		expect(getByText(UI_TEXT.register.fields.type.bestBefore)).toBeTruthy()
		expect(getByText(UI_TEXT.register.fields.type.useBy)).toBeTruthy()

		const radios = getAllByRole('radio')
		expect(radios[0].getAttribute('aria-checked')).toBe('true')
		expect(radios[1].getAttribute('aria-checked')).toBe('false')
	})

	it('calls onChange when selecting a different option', () => {
		const handleChange = vi.fn()
		const { getAllByRole } = render(
			<ExpirationTypeField value='bestBefore' onChange={handleChange} />
		)

		fireEvent.click(getAllByRole('radio')[1])

		expect(handleChange).toHaveBeenCalledWith('useBy')
	})
})
