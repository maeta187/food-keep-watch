import { drizzle, type ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite'
import { migrate } from 'drizzle-orm/expo-sqlite/migrator'
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite'

import migrations from '@/drizzle/migrations'
import * as schema from '@/src/database/schema'

const DB_NAME = 'food-keep-watch.db'

let sqliteInstance: SQLiteDatabase | null = null
let drizzleDb: ExpoSQLiteDatabase<typeof schema> | null = null
let isMigrated = false

const ensureVisibleColumnExists = async (
	sqliteDb: SQLiteDatabase
): Promise<void> => {
	try {
		// categoriesテーブルにvisibleカラムが存在するか確認
		const tableInfo = await sqliteDb.getAllAsync<{
			cid: number
			name: string
			type: string
			notnull: number
			dflt_value: unknown
			pk: number
		}>('PRAGMA table_info(categories)')

		const hasVisibleColumn = tableInfo.some((col) => col.name === 'visible')

		if (!hasVisibleColumn) {
			// visibleカラムが存在しない場合は追加
			await sqliteDb.execAsync(
				'ALTER TABLE `categories` ADD COLUMN `visible` integer DEFAULT 1 NOT NULL;'
			)
			// 既存のレコードにvisible=1を設定
			await sqliteDb.execAsync(
				'UPDATE `categories` SET `visible` = 1 WHERE `visible` IS NULL;'
			)
		}
	} catch (error) {
		// テーブルが存在しない場合は無視（マイグレーションで作成される）
		if (error instanceof Error && error.message.includes('no such table')) {
			return
		}
		throw error
	}
}

const runMigrations = async (
	db: ExpoSQLiteDatabase<typeof schema>
): Promise<void> => {
	if (isMigrated) {
		return
	}

	try {
		await migrate(db, migrations)
		// マイグレーション後にvisibleカラムの存在を確認
		if (sqliteInstance) {
			await ensureVisibleColumnExists(sqliteInstance)
		}
	} catch (error) {
		// マイグレーションエラーをログに記録
		console.error('マイグレーションエラー:', error)
		// エラーを再スローして、アプリが適切にエラーを処理できるようにする
		throw error
	}
	isMigrated = true
}

const createSQLiteInstance = async (): Promise<SQLiteDatabase> => {
	if (sqliteInstance) {
		return sqliteInstance
	}

	sqliteInstance = await openDatabaseAsync(DB_NAME)
	await sqliteInstance.execAsync('PRAGMA journal_mode = WAL;')

	return sqliteInstance
}

const createDrizzleDb = async (): Promise<
	ExpoSQLiteDatabase<typeof schema>
> => {
	if (drizzleDb) {
		return drizzleDb
	}

	const sqliteDb = await createSQLiteInstance()
	drizzleDb = drizzle(sqliteDb, { schema })
	await runMigrations(drizzleDb)

	return drizzleDb
}

export const getDb = async (): Promise<ExpoSQLiteDatabase<typeof schema>> =>
	await createDrizzleDb()

export type Database = Awaited<ReturnType<typeof getDb>>
