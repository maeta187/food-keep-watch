export type ParsedDate = Date | null

export const parseDate = (value?: string | null): ParsedDate => {
	if (!value) {
		return null
	}
	const parsed = new Date(value)
	return Number.isNaN(parsed.getTime()) ? null : parsed
}

export const parseEpochSeconds = (value?: number | null): ParsedDate => {
	if (value == null) {
		return null
	}
	const parsed = new Date(value * 1000)
	return Number.isNaN(parsed.getTime()) ? null : parsed
}

export const parseCategories = (value?: string | null): string[] => {
	if (!value) {
		return []
	}
	try {
		const parsed = JSON.parse(value)
		return Array.isArray(parsed)
			? parsed.filter((item) => typeof item === 'string')
			: []
	} catch {
		return []
	}
}

export const normalizeOptionalText = (value?: string | null): string | null => {
	const trimmed = value?.trim() ?? ''
	return trimmed.length > 0 ? trimmed : null
}

export const buildCategoriesPayload = (categories: string[]): string =>
	JSON.stringify(categories ?? [])
