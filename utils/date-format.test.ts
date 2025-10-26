const createIntlFormatterMock = (returnValue: string) => {
	const format = vi.fn().mockReturnValue(returnValue)

	const partial: Pick<
		Intl.DateTimeFormat,
		| 'format'
		| 'formatToParts'
		| 'resolvedOptions'
		| 'formatRange'
		| 'formatRangeToParts'
	> = {
		format,
		formatToParts: vi.fn(),
		resolvedOptions: vi.fn(),
		formatRange: vi.fn(),
		formatRangeToParts: vi.fn()
	}

	return { formatter: partial as unknown as Intl.DateTimeFormat, format }
}

const importModuleWithIntlMocks = async () => {
	vi.resetModules()

	const dateFormatter = createIntlFormatterMock('formatted-date')
	const dateTimeFormatter = createIntlFormatterMock('formatted-datetime')

	vi.spyOn(Intl, 'DateTimeFormat')
		.mockReturnValueOnce(dateFormatter.formatter)
		.mockReturnValueOnce(dateTimeFormatter.formatter)

	const module = await import('./date-format')

	return {
		...module,
		dateFormatterMock: dateFormatter.format,
		dateTimeFormatterMock: dateTimeFormatter.format
	}
}

describe('date-format utilities', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('returns undefined when date input is falsy', async () => {
		const { formatDate, formatDateTime } = await importModuleWithIntlMocks()

		expect(formatDate()).toBeUndefined()
		expect(formatDate(null)).toBeUndefined()
		expect(formatDateTime()).toBeUndefined()
		expect(formatDateTime(null)).toBeUndefined()
	})

	it('returns the value provided by Intl formatters', async () => {
		const {
			formatDate,
			formatDateTime,
			dateFormatterMock,
			dateTimeFormatterMock
		} = await importModuleWithIntlMocks()
		const targetDate = new Date('2024-01-15T00:00:00Z')

		expect(formatDate(targetDate)).toBe('formatted-date')
		expect(formatDateTime(targetDate)).toBe('formatted-datetime')
		expect(dateFormatterMock).toHaveBeenCalledWith(targetDate)
		expect(dateTimeFormatterMock).toHaveBeenCalledWith(targetDate)
	})
})
