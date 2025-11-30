export const UI_TEXT = {
	appEditingHint: 'アプリの編集は App.tsx から始められます。',
	tabs: {
		homeTitle: '期限一覧',
		registerTitle: '期限登録',
		settingsTitle: '設定',
		homePlaceholder: '期限一覧のコンテンツを実装してください。',
		settingsPlaceholder: '設定画面のコンテンツを実装してください。'
	},
	home: {
		title: '保存した食品',
		description: '登録済みの食品の期限と保管場所を確認できます。',
		list: {
			expirationTypes: {
				bestBefore: '賞味期限',
				useBy: '消費期限'
			},
			storageLabel: '保管場所',
			notificationLabel: '通知',
			categoriesLabel: 'カテゴリー',
			storageFallback: '未入力',
			notificationFallback: '未設定',
			categoriesFallback: 'カテゴリーなし',
			expirationFallback: '日付未設定',
			expiredLabel: '期限切れ',
			dueTodayLabel: '今日まで',
			daysPrefix: 'あと',
			daysSuffix: '日'
		},
		empty: {
			title: 'まだ食品が登録されていません',
			description: '「期限登録」タブから登録するとここに表示されます。'
		},
		errors: {
			title: 'エラー',
			loadFailed:
				'保存済みの食品を読み込めませんでした。時間をおいて再度お試しください。'
		},
		actions: {
			retry: '再読み込み'
		}
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
		messages: {
			submitSuccessTitle: '登録が完了しました',
			submitSuccessDescription: '食品を保存しました。'
		},
		errors: {
			required: '必須項目です。',
			expirationRequired: '期限日を選択してください。',
			categoryLimit: 'カテゴリーは最大5件までです。',
			categoryStorageLimit: 'カテゴリー候補は最大15件までです。',
			webPickerUnsupported:
				'Web 版では日付ピッカーを利用できません。iOS 端末で設定してください。',
			submitFailed: '登録に失敗しました。時間をおいてから再度お試しください。'
		}
	},
	notifications: {
		expirationReminderTitle: '「{name}」の期限が近づいています',
		expirationReminderBody:
			'{expirationType}が{expirationDate}です。食品を確認しましょう。',
		permissionDeniedTitle: '通知を送信できません',
		permissionDeniedDescription:
			'通知の権限が許可されていないため、通知を予約できませんでした。端末の設定で通知を有効にしてください。',
		invalidScheduleTitle: '通知時間が無効です',
		invalidScheduleDescription:
			'過去の時刻には通知を設定できません。通知時間を見直してください。',
		scheduleFailedTitle: '通知の予約に失敗しました',
		scheduleFailedDescription:
			'食品は保存しましたが、通知の予約に失敗しました。時間をおいてから再度お試しください。'
	}
} as const
