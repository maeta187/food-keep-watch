export const UI_TEXT = {
	appEditingHint: 'アプリの編集は App.tsx から始められます。',
	tabs: {
		homeTitle: 'ホーム',
		settingsTitle: '設定',
		homePlaceholder: 'ホーム画面のコンテンツを実装してください。',
		settingsPlaceholder: '設定画面のコンテンツを実装してください。'
	}
} as const

export type TabsUiText = typeof UI_TEXT.tabs
