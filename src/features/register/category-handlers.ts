type CategoryHandlersParams = {
	categories: string[]
	categoryInput: string
	maxCategories: number
	limitErrorMessage: string
	storageLimitErrorMessage?: string
	setCategoryInput: (value: string) => void
	setCategoryError: (value: string | null) => void
	updateCategories: (next: string[]) => void
	onNewCategoryAdded?: (
		category: string
	) => Promise<boolean | void> | boolean | void
	validateBeforeAdd?: (
		category: string
	) => Promise<string | null> | string | null
}

type CategoryHandlers = {
	addCategory: () => Promise<void>
	removeCategory: (category: string) => void
	selectCategorySuggestion: (category: string) => void
}

/**
 * 入力欄をクリアして UI 側に即時反映させる。
 */
const resetInput = (setCategoryInput: (value: string) => void) => {
	setCategoryInput('')
}

/**
 * カテゴリーの追加・削除・サジェスト選択を制御するハンドラを生成する。
 *
 * @param params.categories 現在フォームにセットされているカテゴリー一覧
 * @param params.categoryInput 入力欄に表示されている文字列
 * @param params.maxCategories カテゴリーを保持できる上限数
 * @param params.limitErrorMessage 上限超過時に表示するエラーメッセージ
 * @param params.setCategoryInput 入力欄の文字列を更新する setter
 * @param params.setCategoryError バリデーションエラーの表示 state setter
 * @param params.updateCategories フォーム state にカテゴリー配列を反映する updater
 */
export const createCategoryHandlers = ({
	categories,
	categoryInput,
	maxCategories,
	limitErrorMessage,
	storageLimitErrorMessage,
	setCategoryInput,
	setCategoryError,
	updateCategories,
	onNewCategoryAdded,
	validateBeforeAdd
}: CategoryHandlersParams): CategoryHandlers => {
	const addCategory = async () => {
		const trimmed = categoryInput.trim()
		if (!trimmed) {
			resetInput(setCategoryInput)
			return
		}

		const validationError = validateBeforeAdd
			? await validateBeforeAdd(trimmed)
			: null
		if (validationError) {
			setCategoryError(validationError)
			resetInput(setCategoryInput)
			return
		}

		if (categories.length >= maxCategories) {
			setCategoryError(limitErrorMessage)
			resetInput(setCategoryInput)
			return
		}

		if (categories.includes(trimmed)) {
			setCategoryError(null)
			resetInput(setCategoryInput)
			return
		}

		updateCategories([...categories, trimmed])
		setCategoryError(null)
		resetInput(setCategoryInput)
		if (onNewCategoryAdded) {
			const result = await onNewCategoryAdded(trimmed)
			// 挿入が拒否された場合はエラー表示のみ行う（フォームの値は維持）
			if (result === false) {
				setCategoryError(storageLimitErrorMessage ?? limitErrorMessage)
			}
		}
	}

	const removeCategory = (category: string) => {
		updateCategories(categories.filter((item) => item !== category))
		setCategoryError(null)
	}

	const selectCategorySuggestion = (category: string) => {
		if (categories.length >= maxCategories) {
			setCategoryError(limitErrorMessage)
			return
		}
		if (categories.includes(category)) {
			setCategoryError(null)
			return
		}
		updateCategories([...categories, category])
		setCategoryError(null)
	}

	return { addCategory, removeCategory, selectCategorySuggestion }
}
