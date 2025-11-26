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
		storageLimitErrorMessage: 'ストレージ上限です',
		setCategoryInput,
		setCategoryError,
		updateCategories,
		onNewCategoryAdded: undefined,
		...overrides
	}
}

describe('createCategoryHandlers', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('adds trimmed category and resets input', async () => {
		const params = buildParams()
		const handlers = createCategoryHandlers(params)

		await handlers.addCategory()

		expect(params.updateCategories).toHaveBeenCalledWith(['野菜', '冷凍食品'])
		expect(params.setCategoryError).toHaveBeenCalledWith(null)
		expect(params.setCategoryInput).toHaveBeenLastCalledWith('')
	})

	it('ignores empty input', async () => {
		const params = buildParams({ categoryInput: '   ' })
		const handlers = createCategoryHandlers(params)

		await handlers.addCategory()

		expect(params.updateCategories).not.toHaveBeenCalled()
		expect(params.setCategoryInput).toHaveBeenCalledWith('')
	})

	it('prevents adding over the limit', async () => {
		const params = buildParams({
			categories: ['野菜', '肉類', '乳製品'],
			maxCategories: 3
		})
		const handlers = createCategoryHandlers(params)

		await handlers.addCategory()

		expect(params.setCategoryError).toHaveBeenCalledWith(
			'カテゴリーは3つまでです'
		)
		expect(params.updateCategories).not.toHaveBeenCalled()
	})

	it('removes specified category and clears error', async () => {
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

	it('notifies when a new category is added', async () => {
		const onNewCategoryAdded = vi.fn()
		const params = buildParams({ onNewCategoryAdded })
		const handlers = createCategoryHandlers(params)

		await handlers.addCategory()

		expect(onNewCategoryAdded).toHaveBeenCalledWith('冷凍食品')
	})

	it('shows error when validation rejects new category', async () => {
		const params = buildParams({
			validateBeforeAdd: () => '保存上限です'
		})
		const handlers = createCategoryHandlers(params)

		await handlers.addCategory()

		expect(params.updateCategories).not.toHaveBeenCalled()
		expect(params.setCategoryError).toHaveBeenCalledWith('保存上限です')
		expect(params.setCategoryInput).toHaveBeenLastCalledWith('')
	})

	it('shows storage limit error when persistence returns false', async () => {
		const params = buildParams({
			onNewCategoryAdded: () => false
		})
		const handlers = createCategoryHandlers(params)

		await handlers.addCategory()

		expect(params.setCategoryError).toHaveBeenCalledWith('ストレージ上限です')
	})
})
