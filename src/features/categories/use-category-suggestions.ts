import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'

import { SUGGESTED_CATEGORIES } from '@/src/constants/categories'
import {
	getCategoryInitializedFlag,
	getCategorySeededFlag
} from '@/src/database/app-settings'
import {
	getAllCategoryNames,
	hasAnyCategories,
	insertCategoriesIfMissing
} from '@/src/database/categories'

/**
 * DB に保存されたカテゴリーサジェストを提供し、
 * 新規カテゴリーを永続化するためのフック。
 */
export const useCategorySuggestions = () => {
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const load = useCallback(async () => {
		try {
			const names = await getAllCategoryNames()
			if (names.length === 0) {
				const [hasSeeded, hasInitialized, hasCategories] = await Promise.all([
					getCategorySeededFlag(),
					getCategoryInitializedFlag(),
					hasAnyCategories()
				])
				if (!hasSeeded && !hasInitialized && !hasCategories) {
					await insertCategoriesIfMissing(SUGGESTED_CATEGORIES)
					setSuggestions(SUGGESTED_CATEGORIES)
					return
				}
				setSuggestions([])
				return
			}
			setSuggestions(names)
		} catch (error) {
			console.error('カテゴリーの読み込みに失敗しました', error)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useFocusEffect(
		useCallback(() => {
			load().catch((error) => {
				console.error('カテゴリーの読み込みに失敗しました', error)
			})
		}, [load])
	)

	const persistCategory = useCallback(
		async (name: string): Promise<boolean> => {
			const trimmed = name.trim()
			if (!trimmed) {
				return false
			}

			try {
				const inserted = await insertCategoriesIfMissing([trimmed])
				const insertedSet = new Set(inserted)

				// 追加できなかった場合は false を返す
				if (!insertedSet.has(trimmed) && !suggestions.includes(trimmed)) {
					return false
				}

				setSuggestions((prev) => {
					if (prev.includes(trimmed)) {
						return prev
					}
					return [...prev, trimmed].sort((a, b) => a.localeCompare(b, 'ja'))
				})
				return true
			} catch (error) {
				console.error('カテゴリーの保存に失敗しました', error)
				return false
			}
		},
		[suggestions]
	)

	return { suggestions, isLoading, persistCategory }
}
