import { render } from '@testing-library/react'
import React from 'react'

import { HeaderSection } from './HeaderSection'
import { UI_TEXT } from '../../constants/ui-text'

describe('HeaderSection', () => {
	it('renders heading and description', () => {
		const { getByText } = render(<HeaderSection />)

		expect(getByText(UI_TEXT.register.sectionHeading)).toBeTruthy()
		expect(getByText(UI_TEXT.register.sectionDescription)).toBeTruthy()
	})
})
