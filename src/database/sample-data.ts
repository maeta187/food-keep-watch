import { type NewFood } from '@/src/database/schema'

const createDateString = (daysFromNow: number): string => {
	const date = new Date()
	date.setDate(date.getDate() + daysFromNow)
	return date.toISOString()
}

export const sampleFoods: Omit<NewFood, 'id'>[] = [
	{
		name: '牛乳',
		expirationType: 'bestBefore',
		expirationDate: createDateString(3),
		storageLocation: '冷蔵庫',
		categories: JSON.stringify(['乳製品']),
		notificationDateTime: createDateString(1)
	},
	{
		name: 'ヨーグルト',
		expirationType: 'useBy',
		expirationDate: createDateString(1),
		storageLocation: '冷蔵庫',
		categories: JSON.stringify(['乳製品', '朝食'])
	},
	{
		name: '冷凍うどん',
		expirationType: 'bestBefore',
		expirationDate: createDateString(14),
		storageLocation: '冷凍庫',
		categories: JSON.stringify(['主食'])
	}
]
