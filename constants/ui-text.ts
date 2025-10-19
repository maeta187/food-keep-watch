export const UI_TEXT = {
	appEditingHint: 'アプリの編集は App.tsx から始められます。',
	tabs: {
		homeTitle: 'ホーム',
		registerTitle: '期限登録',
		settingsTitle: '設定',
		homePlaceholder: 'ホーム画面のコンテンツを実装してください。',
		settingsPlaceholder: '設定画面のコンテンツを実装してください。'
	},
	register: {
		title: '食品登録',
		sectionHeading: '賞味期限管理',
		sectionDescription:
			'食品の賞味期限や消費期限を登録して、適切に管理しましょう。',
		fields: {
			name: {
				label: '食品名',
				placeholder: '例：牛乳'
			},
			type: {
				label: '賞味期限/消費期限',
				bestBefore: '賞味期限',
				useBy: '消費期限'
			},
			expirationDate: {
				label: '期限日',
				placeholder: '日付を選択'
			},
			storage: {
				label: '保管場所',
				placeholder: '例：冷蔵庫'
			},
			category: {
				label: 'カテゴリー',
				placeholder: 'カテゴリーを入力して Enter で追加',
				helper:
					'カテゴリーは複数追加できます。不要になったタグはタップで削除します。',
				suggestionsLabel: 'カテゴリー候補'
			},
			notificationTime: {
				label: '通知時間',
				placeholder: '通知日時を選択'
			}
		},
		actions: {
			cancel: 'キャンセル',
			confirm: '決定',
			submit: '登録する'
		},
		errors: {
			required: '必須項目です。',
			expirationRequired: '期限日を選択してください。',
			categoryLimit: 'カテゴリーは最大5件までです。'
		}
	}
} as const
