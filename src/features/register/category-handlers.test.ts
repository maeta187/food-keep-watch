import { createCategoryHandlers } from './category-handlers'

const buildParams = (
	overrides: Partial<Parameters<typeof createCategoryHandlers>[0]> = {}
) => {
	const setCategoryInput = vi.fn()
	const setCategoryError = vi.fn()
	const updateCategories = vi.fn()

	return {
		categories: ['野菜'],
		categoryInput: ' 冷凍食品 ',
		maxCategories: 3,
		limitErrorMessage: 'カテゴリーは3つまでです',
		setCategoryInput,
		setCategoryError,
		updateCategories,
		...overrides
	}
}

describe('createCategoryHandlers', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('adds trimmed category and resets input', () => {
		const params = buildParams()
		const handlers = createCategoryHandlers(params)

		handlers.addCategory()

		expect(params.updateCategories).toHaveBeenCalledWith(['野菜', '冷凍食品'])
		expect(params.setCategoryError).toHaveBeenCalledWith(null)
		expect(params.setCategoryInput).toHaveBeenLastCalledWith('')
	})

	it('ignores empty input', () => {
		const params = buildParams({ categoryInput: '   ' })
		const handlers = createCategoryHandlers(params)

		handlers.addCategory()

		expect(params.updateCategories).not.toHaveBeenCalled()
		expect(params.setCategoryInput).toHaveBeenCalledWith('')
	})

	it('prevents adding over the limit', () => {
		const params = buildParams({
			categories: ['野菜', '肉類', '乳製品'],
			maxCategories: 3
		})
		const handlers = createCategoryHandlers(params)

		handlers.addCategory()

		expect(params.setCategoryError).toHaveBeenCalledWith(
			'カテゴリーは3つまでです'
		)
		expect(params.updateCategories).not.toHaveBeenCalled()
	})

	it('removes specified category and clears error', () => {
		const params = buildParams({ categories: ['野菜', '肉類'] })
		const handlers = createCategoryHandlers(params)

		handlers.removeCategory('肉類')

		expect(params.updateCategories).toHaveBeenCalledWith(['野菜'])
		expect(params.setCategoryError).toHaveBeenCalledWith(null)
	})

	it('adds suggestion when under the limit', () => {
		const params = buildParams({ categoryInput: '', categories: ['野菜'] })
		const handlers = createCategoryHandlers(params)

		handlers.selectCategorySuggestion('肉類')

		expect(params.updateCategories).toHaveBeenCalledWith(['野菜', '肉類'])
		expect(params.setCategoryError).toHaveBeenCalledWith(null)
	})
})
